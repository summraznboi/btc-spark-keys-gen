# btc-spark-keys-gen

A TypeScript library for generating Bitcoin Spark keys with maximum compatibility. This library provides utilities for deriving HD keys from seeds using various Bitcoin derivation paths and creating Spark addresses from Bitcoin addresses.

## Features

- 🔐 **HD Key Derivation**: Generate hierarchical deterministic keys from seeds using multiple derivation paths
- 🎯 **Spark Address Generation**: Convert Bitcoin addresses to Spark addresses
- 🔄 **Multiple Derivation Paths**: Support for Native Segwit, Wrapped Segwit, Legacy Bitcoin, and Taproot
- 🛡️ **Type Safety**: Full TypeScript support with comprehensive type definitions
- 📦 **Dual Format**: Supports both CommonJS and ES modules
- 🧪 **Well Tested**: Comprehensive test suite with high coverage

## Installation

```bash
npm install btc-spark-keys-gen
```

## Usage

### HD Key Derivation

```typescript
import {
  NativeSegwitKeysGenerator,
  WrappedSegwitKeysGenerator,
  LegacyBitcoinKeysGenerator,
  TaprootOutputKeysGenerator,
  getSparkAddressFromPublicKey,
  getSparkAddressFromTaproot,
} from "btc-spark-keys-gen";

// Derive keys using Native Segwit derivation path
const nativeSegwitGenerator = new NativeSegwitKeysGenerator(true); // useAddressIndex: true
const seed = new Uint8Array(32); // Your 32-byte seed
const accountNumber = 0;

const derivedKeys = await nativeSegwitGenerator.deriveKeysFromSeed(
  seed,
  accountNumber
);
console.log("Identity Key:", derivedKeys.identityKey);
console.log("Signing HD Key:", derivedKeys.signingHDKey);
console.log("Deposit Key:", derivedKeys.depositKey);
console.log("Static Deposit HD Key:", derivedKeys.staticDepositHDKey);
```

### Spark Address Generation

```typescript
// Generate Spark address from public key
const publicKey = new Uint8Array(33); // Your public key
const sparkAddress = getSparkAddressFromPublicKey(publicKey, "mainnet");
console.log("Spark Address:", sparkAddress); // spark1...

// Convert Taproot address to Spark address
const taprootAddress = "bc1p..."; // Your Taproot address
const sparkAddress = getSparkAddressFromTaproot(taprootAddress);
console.log("Spark Address:", sparkAddress); // spark1...
```

### Different Derivation Paths

```typescript
// Native Segwit (P2WPKH) - m/84'/0'/0'/0/?
const nativeSegwitGenerator = new NativeSegwitKeysGenerator(true);

// Wrapped Segwit (P2SH-P2WPKH) - m/49'/0'/0'/0/?
const wrappedSegwitGenerator = new WrappedSegwitKeysGenerator(true);

// Legacy Bitcoin (P2PKH) - m/44'/0'/0'/0/?
const legacyGenerator = new LegacyBitcoinKeysGenerator(true);

// Taproot (P2TR) - m/86'/0'/0'/0/?
const taprootGenerator = new TaprootOutputKeysGenerator(true);
```

## API Reference

### Functions

#### `getSparkAddressFromPublicKey(publicKey: Uint8Array, network: 'mainnet' | 'regtest'): SparkAddress`

Generates a Spark address from a public key.

**Parameters:**

- `publicKey: Uint8Array` - The public key (must be 33 bytes)
- `network: 'mainnet' | 'regtest'` - The network type

**Returns:**

- `SparkAddress` - The generated Spark address

#### `getSparkAddressFromTaproot(taprootAddress: string): SparkAddress`

Converts a Taproot address to a Spark address.

**Parameters:**

- `taprootAddress: string` - The Taproot address to convert

**Returns:**

- `SparkAddress` - The converted Spark address

### Classes

#### `NativeSegwitKeysGenerator`

A class for generating keys using Native Segwit derivation paths (m/84'/0'/0'/0/? or m/84'/0'/?'/0/0).

**Constructor:**

- `new NativeSegwitKeysGenerator(useAddressIndex: boolean)`

**Methods:**

- `deriveKeysFromSeed(seed: Uint8Array, accountNumber: number): Promise<DerivedKeys>`

#### `WrappedSegwitKeysGenerator`

A class for generating keys using Wrapped Segwit derivation paths (m/49'/0'/0'/0/? or m/49'/0'/?'/0/0).

**Constructor:**

- `new WrappedSegwitKeysGenerator(useAddressIndex: boolean)`

**Methods:**

- `deriveKeysFromSeed(seed: Uint8Array, accountNumber: number): Promise<DerivedKeys>`

#### `LegacyBitcoinKeysGenerator`

A class for generating keys using Legacy Bitcoin derivation paths (m/44'/0'/0'/0/? or m/44'/0'/?'/0/0).

**Constructor:**

- `new LegacyBitcoinKeysGenerator(useAddressIndex: boolean)`

**Methods:**

- `deriveKeysFromSeed(seed: Uint8Array, accountNumber: number): Promise<DerivedKeys>`

#### `TaprootOutputKeysGenerator`

A class for generating keys using Taproot derivation paths (m/86'/0'/0'/0/? or m/86'/0'/?'/0/0).

**Constructor:**

- `new TaprootOutputKeysGenerator(useAddressIndex?: boolean)`

**Methods:**

- `deriveKeysFromSeed(seed: Uint8Array, accountNumber: number): Promise<DerivedKeys>`

### Types

```typescript
type KeyPair = {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
};

type DerivedHDKey = {
  hdKey: HDKey;
  privateKey: Uint8Array;
  publicKey: Uint8Array;
};

type DerivedKeys = {
  identityKey: KeyPair;
  signingHDKey: DerivedHDKey;
  depositKey: KeyPair;
  staticDepositHDKey: DerivedHDKey;
};

type SparkAddress = `spark1${string}` | `sparkrt1${string}`;
```

## Development

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the project
npm run build

# Development mode with watch
npm run dev
```

### Scripts

- `npm run build` - Build the project
- `npm run dev` - Development mode with file watching
- `npm run clean` - Clean build artifacts
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run typecheck` - Run TypeScript type checking

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Security

This library handles cryptographic operations. Please ensure you understand the security implications before using in production environments.

## Changelog

### 1.0.0

- Initial release
- HD key generation
- Spark address generation
- Taproot address conversion
- Full TypeScript support
