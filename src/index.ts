import { secp256k1 } from "@noble/curves/secp256k1.js";
import { HDKey } from "@scure/bip32";
import { taprootTweakPrivKey } from "@scure/btc-signer/utils.js";
import { bech32m } from "bech32";
import { privateNegate } from "tiny-secp256k1";

type DerivedHDKey = {
  hdKey: HDKey;
  privateKey: Uint8Array;
  publicKey: Uint8Array;
};

type KeyPair = {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
};

type SparkAddress = `spark1${string}` | `sparkrt1${string}`;

type DerivationPathKeysGeneratorClass = {
  new (useAddressIndex: boolean): {
    deriveKeysFromSeed(
      seed: Uint8Array,
      accountNumber: number
    ): Promise<{
      identityKey: KeyPair;
      signingHDKey: DerivedHDKey;
      depositKey: KeyPair;
      staticDepositHDKey: DerivedHDKey;
    }>;
  };
};

function getDerivationPathKeysGeneratorClass(
  derivationPathTemplateUseAddressIndex: string,
  derivationPathTemplateUseAccount: string
): DerivationPathKeysGeneratorClass {
  return class DerivationPathKeysGenerator {
    constructor(private readonly useAddressIndex: boolean) {}

    async deriveKeysFromSeed(
      seed: Uint8Array,
      accountNumber: number
    ): Promise<{
      identityKey: KeyPair;
      signingHDKey: DerivedHDKey;
      depositKey: KeyPair;
      staticDepositHDKey: DerivedHDKey;
    }> {
      const hdkey = HDKey.fromMasterSeed(seed);

      if (!hdkey.privateKey || !hdkey.publicKey) {
        throw new Error("Failed to derive keys from seed");
      }

      const derivationPath = (
        this.useAddressIndex
          ? derivationPathTemplateUseAddressIndex
          : derivationPathTemplateUseAccount
      ).replace(/\?/g, accountNumber.toString());

      const identityKey = hdkey.derive(derivationPath);
      const signingKey = hdkey.derive(`${derivationPath}/1'`);
      const depositKey = hdkey.derive(`${derivationPath}/2'`);
      const staticDepositKey = hdkey.derive(`${derivationPath}/3'`);

      if (
        !identityKey.privateKey ||
        !identityKey.publicKey ||
        !signingKey.privateKey ||
        !signingKey.publicKey ||
        !depositKey.privateKey ||
        !depositKey.publicKey ||
        !staticDepositKey.privateKey ||
        !staticDepositKey.publicKey
      ) {
        throw new Error("Failed to derive all required keys from seed");
      }

      return {
        identityKey: {
          privateKey: identityKey.privateKey,
          publicKey: identityKey.publicKey,
        },
        signingHDKey: {
          hdKey: signingKey,
          privateKey: signingKey.privateKey,
          publicKey: signingKey.publicKey,
        },
        depositKey: {
          privateKey: depositKey.privateKey,
          publicKey: depositKey.publicKey,
        },
        staticDepositHDKey: {
          hdKey: staticDepositKey,
          privateKey: staticDepositKey.privateKey,
          publicKey: staticDepositKey.publicKey,
        },
      };
    }
  };
}

export const NativeSegwitKeysGenerator = getDerivationPathKeysGeneratorClass(
  "m/84'/0'/0'/0/?",
  "m/84'/0'/?'/0/0"
);

export const WrappedSegwitKeysGenerator = getDerivationPathKeysGeneratorClass(
  "m/49'/0'/0'/0/?",
  "m/49'/0'/?'/0/0"
);

export const LegacyBitcoinKeysGenerator = getDerivationPathKeysGeneratorClass(
  "m/44'/0'/0'/0/?",
  "m/44'/0'/?'/0/0"
);

export class TaprootOutputKeysGenerator {
  constructor(private readonly useAddressIndex: boolean = false) {}

  async deriveKeysFromSeed(
    seed: Uint8Array,
    accountNumber: number
  ): Promise<{
    identityKey: KeyPair;
    signingHDKey: DerivedHDKey;
    depositKey: KeyPair;
    staticDepositHDKey: DerivedHDKey;
  }> {
    const hdkey = HDKey.fromMasterSeed(seed);

    if (!hdkey.privateKey || !hdkey.publicKey) {
      throw new Error("Failed to derive keys from seed");
    }

    const derivationPath = this.useAddressIndex
      ? `m/86'/0'/0'/0/${accountNumber}`
      : `m/86'/0'/${accountNumber}'/0/0`;

    const taprootInternalKey = hdkey.derive(derivationPath);

    let tweakedPrivateKey = taprootTweakPrivKey(taprootInternalKey.privateKey!);
    let tweakedPublicKey = secp256k1.getPublicKey(tweakedPrivateKey);

    // always use the even key
    if (tweakedPublicKey[0] === 3) {
      tweakedPrivateKey = privateNegate(tweakedPrivateKey);
      tweakedPublicKey = secp256k1.getPublicKey(tweakedPrivateKey);
    }

    const identityKey = {
      publicKey: tweakedPublicKey,
      privateKey: tweakedPrivateKey,
    };

    const signingKey = hdkey.derive(`${derivationPath}/1'`);
    const depositKey = hdkey.derive(`${derivationPath}/2'`);
    const staticDepositKey = hdkey.derive(`${derivationPath}/3'`);

    if (
      !signingKey.privateKey ||
      !signingKey.publicKey ||
      !depositKey.privateKey ||
      !depositKey.publicKey ||
      !staticDepositKey.privateKey ||
      !staticDepositKey.publicKey
    ) {
      throw new Error("Failed to derive all required keys from seed");
    }

    return {
      identityKey: {
        privateKey: identityKey.privateKey,
        publicKey: identityKey.publicKey,
      },
      signingHDKey: {
        hdKey: signingKey,
        privateKey: signingKey.privateKey,
        publicKey: signingKey.publicKey,
      },
      depositKey: {
        privateKey: depositKey.privateKey,
        publicKey: depositKey.publicKey,
      },
      staticDepositHDKey: {
        hdKey: staticDepositKey,
        privateKey: staticDepositKey.privateKey,
        publicKey: staticDepositKey.publicKey,
      },
    };
  }
}

export function getSparkAddressFromPublicKey(
  publicKey: Uint8Array,
  network: "mainnet" | "regtest"
): SparkAddress {
  if (publicKey.length !== 33) {
    throw new Error("Invalid public key format");
  }

  // decode words to bytes array
  const words = bech32m.toWords([10, 33, ...publicKey]);

  // bech32m encode with spark prefix
  return bech32m.encode(
    network === "mainnet" ? "spark" : "sparkrt",
    words
  ) as SparkAddress;
}

export function getSparkAddressFromTaproot(
  taprootAddress: string
): SparkAddress {
  const { prefix, words } = bech32m.decode(taprootAddress);

  // known testnet/signet prefix but unsupported network
  if (prefix === "tb") {
    throw new Error("Only mainnet or regtest supported");
  }

  // unknown prefix
  if (prefix !== "bc" && prefix !== "bcrt") {
    throw new Error("Unknown prefix detected in decoding taproot address");
  }

  // expect first word to be segwit version
  if (words[0] !== 1) {
    throw new Error("Not valid version for taproot address");
  }

  // decode words to bytes array
  const addressBytes = bech32m.fromWords(words.slice(1));

  // encoded payload should be x-only pubkey of 32 bytes
  if (addressBytes.length !== 32) {
    throw new Error("Invalid public key length");
  }

  // 0a21 + 02 + xonly key and then convert to words
  const sparkWords = bech32m.toWords([10, 33, 2, ...addressBytes]);

  // mapping of taproot prefix to spark prefix
  const sparkPrefix = prefix === "bc" ? "spark" : "sparkrt";

  // bech32m encode with spark prefix
  return bech32m.encode(sparkPrefix, sparkWords) as SparkAddress;
}
