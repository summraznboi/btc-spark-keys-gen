import {
  NativeSegwitKeysGenerator,
  WrappedSegwitKeysGenerator,
  LegacyBitcoinKeysGenerator,
  TaprootOutputKeysGenerator,
  getSparkAddressFromPublicKey,
  getSparkAddressFromTaproot,
} from "./index";

describe("Bitcoin Spark Keys Generator", () => {
  const testSeed = new Uint8Array(32);
  testSeed.fill(1); // Simple test seed

  describe("NativeSegwitKeysGenerator", () => {
    test("should generate keys with address index", async () => {
      const generator = new NativeSegwitKeysGenerator(true);
      const result = await generator.deriveKeysFromSeed(testSeed, 0);

      expect(result.identityKey).toBeDefined();
      expect(result.identityKey.privateKey).toBeDefined();
      expect(result.identityKey.publicKey).toBeDefined();
      expect(result.signingHDKey).toBeDefined();
      expect(result.depositKey).toBeDefined();
      expect(result.staticDepositHDKey).toBeDefined();
    });

    test("should generate keys with account number", async () => {
      const generator = new NativeSegwitKeysGenerator(false);
      const result = await generator.deriveKeysFromSeed(testSeed, 1);

      expect(result.identityKey).toBeDefined();
      expect(result.identityKey.privateKey).toBeDefined();
      expect(result.identityKey.publicKey).toBeDefined();
    });
  });

  describe("WrappedSegwitKeysGenerator", () => {
    test("should generate keys with address index", async () => {
      const generator = new WrappedSegwitKeysGenerator(true);
      const result = await generator.deriveKeysFromSeed(testSeed, 0);

      expect(result.identityKey).toBeDefined();
      expect(result.identityKey.privateKey).toBeDefined();
      expect(result.identityKey.publicKey).toBeDefined();
    });

    test("should generate keys with account number", async () => {
      const generator = new WrappedSegwitKeysGenerator(false);
      const result = await generator.deriveKeysFromSeed(testSeed, 1);

      expect(result.identityKey).toBeDefined();
      expect(result.identityKey.privateKey).toBeDefined();
      expect(result.identityKey.publicKey).toBeDefined();
    });
  });

  describe("LegacyBitcoinKeysGenerator", () => {
    test("should generate keys with address index", async () => {
      const generator = new LegacyBitcoinKeysGenerator(true);
      const result = await generator.deriveKeysFromSeed(testSeed, 0);

      expect(result.identityKey).toBeDefined();
      expect(result.identityKey.privateKey).toBeDefined();
      expect(result.identityKey.publicKey).toBeDefined();
    });

    test("should generate keys with account number", async () => {
      const generator = new LegacyBitcoinKeysGenerator(false);
      const result = await generator.deriveKeysFromSeed(testSeed, 1);

      expect(result.identityKey).toBeDefined();
      expect(result.identityKey.privateKey).toBeDefined();
      expect(result.identityKey.publicKey).toBeDefined();
    });
  });

  describe("TaprootOutputKeysGenerator", () => {
    test("should generate keys with address index", async () => {
      const generator = new TaprootOutputKeysGenerator(true);
      const result = await generator.deriveKeysFromSeed(testSeed, 0);

      expect(result.identityKey).toBeDefined();
      expect(result.identityKey.privateKey).toBeDefined();
      expect(result.identityKey.publicKey).toBeDefined();
      expect(result.identityKey.publicKey.length).toBe(33);
    });

    test("should generate keys with account number", async () => {
      const generator = new TaprootOutputKeysGenerator(false);
      const result = await generator.deriveKeysFromSeed(testSeed, 1);

      expect(result.identityKey).toBeDefined();
      expect(result.identityKey.privateKey).toBeDefined();
      expect(result.identityKey.publicKey).toBeDefined();
      expect(result.identityKey.publicKey.length).toBe(33);
    });

    test("should generate keys with default constructor", async () => {
      const generator = new TaprootOutputKeysGenerator();
      const result = await generator.deriveKeysFromSeed(testSeed, 0);

      expect(result.identityKey).toBeDefined();
      expect(result.identityKey.privateKey).toBeDefined();
      expect(result.identityKey.publicKey).toBeDefined();
    });
  });

  describe("getSparkAddressFromPublicKey", () => {
    test("should generate mainnet spark address from real public key", async () => {
      // Use a real public key from our key generator
      const generator = new NativeSegwitKeysGenerator(true);
      const result = await generator.deriveKeysFromSeed(testSeed, 0);

      const address = getSparkAddressFromPublicKey(
        result.identityKey.publicKey,
        "mainnet"
      );
      expect(address).toMatch(/^spark1/);
      expect(address.length).toBeGreaterThan(10);
    });

    test("should generate regtest spark address from real public key", async () => {
      // Use a real public key from our key generator
      const generator = new NativeSegwitKeysGenerator(true);
      const result = await generator.deriveKeysFromSeed(testSeed, 0);

      const address = getSparkAddressFromPublicKey(
        result.identityKey.publicKey,
        "regtest"
      );
      expect(address).toMatch(/^sparkrt1/);
      expect(address.length).toBeGreaterThan(10);
    });

    test("should throw error for invalid public key length", () => {
      const invalidPublicKey = new Uint8Array(32);
      expect(() => {
        getSparkAddressFromPublicKey(invalidPublicKey, "mainnet");
      }).toThrow("Invalid public key format");
    });
  });

  describe("getSparkAddressFromTaproot", () => {
    test("should convert mainnet taproot address to spark address", () => {
      const taprootAddress =
        "bc1pvluhspufxmuus9wh3dshxhxfg3656c9mwfw85scaydyp7sk9800sl4h5ae";
      const expectedSparkAddress =
        "spark1pgssyele0qrcjdheeq2a0zmpwdwvj3r4f4stkuju0fp36g6grapv2w7l8am2cp";

      const sparkAddress = getSparkAddressFromTaproot(taprootAddress);
      expect(sparkAddress).toBe(expectedSparkAddress);
    });

    test("should convert regtest taproot address to spark address", () => {
      const taprootAddress =
        "bcrt1p47kh0ff29d3rjw2n43vxqgmrgv9az562x37x6dp4ehyqq7ezyhcqlz5y42";
      const expectedSparkAddress =
        "sparkrt1pgss9tadw7jj52mz8yu48tzcvq3kxsct69f55drud56rtnwgqpajyf0stj62w6";

      const sparkAddress = getSparkAddressFromTaproot(taprootAddress);
      expect(sparkAddress).toBe(expectedSparkAddress);
    });

    test("should throw error for invalid taproot address", () => {
      const invalidAddress = "invalid-address";
      expect(() => {
        getSparkAddressFromTaproot(invalidAddress);
      }).toThrow();
    });

    test("should throw error for testnet prefix", () => {
      const testnetAddress =
        "tb1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjdcwps8yq";
      expect(() => {
        getSparkAddressFromTaproot(testnetAddress);
      }).toThrow();
    });

    test("should throw error for unknown prefix", () => {
      const unknownAddress =
        "xyz1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjdcwps8yq";
      expect(() => {
        getSparkAddressFromTaproot(unknownAddress);
      }).toThrow();
    });
  });

  describe("Error handling", () => {
    test("should handle invalid seed length", async () => {
      const generator = new NativeSegwitKeysGenerator(true);
      const invalidSeed = new Uint8Array(0);

      await expect(
        generator.deriveKeysFromSeed(invalidSeed, 0)
      ).rejects.toThrow();
    });

    test("should handle empty seed", async () => {
      const generator = new NativeSegwitKeysGenerator(true);
      const emptySeed = new Uint8Array(32);

      // This should work as empty seed is valid length
      const result = await generator.deriveKeysFromSeed(emptySeed, 0);
      expect(result.identityKey).toBeDefined();
    });
  });

  describe("Key consistency", () => {
    test("should generate consistent keys for same seed and parameters", async () => {
      const generator1 = new NativeSegwitKeysGenerator(true);
      const generator2 = new NativeSegwitKeysGenerator(true);

      const result1 = await generator1.deriveKeysFromSeed(testSeed, 0);
      const result2 = await generator2.deriveKeysFromSeed(testSeed, 0);

      expect(result1.identityKey.privateKey).toEqual(
        result2.identityKey.privateKey
      );
      expect(result1.identityKey.publicKey).toEqual(
        result2.identityKey.publicKey
      );
    });

    test("should generate different keys for different account numbers", async () => {
      const generator = new NativeSegwitKeysGenerator(false);

      const result1 = await generator.deriveKeysFromSeed(testSeed, 0);
      const result2 = await generator.deriveKeysFromSeed(testSeed, 1);

      expect(result1.identityKey.privateKey).not.toEqual(
        result2.identityKey.privateKey
      );
      expect(result1.identityKey.publicKey).not.toEqual(
        result2.identityKey.publicKey
      );
    });
  });
});
