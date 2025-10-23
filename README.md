# btc-spark-keys-gen

A TypeScript library for generating Bitcoin Spark keys with maximum compatibility. This library provides utilities for deriving HD keys, generating key pairs, and creating Spark addresses from various Bitcoin address formats.

## Features

- 🔐 **HD Key Derivation**: Generate hierarchical deterministic keys from seeds
- 🎯 **Spark Address Generation**: Convert Bitcoin addresses to Spark addresses
- 🔄 **Multiple Address Formats**: Support for P2TR (Taproot) addresses
- 🛡️ **Type Safety**: Full TypeScript support with comprehensive type definitions
- 📦 **Dual Format**: Supports both CommonJS and ES modules
- 🧪 **Well Tested**: Comprehensive test suite with high coverage

## Installation

```bash
npm install btc-spark-keys-gen
```

## Usage

### Basic Key Generation

```typescript
import {
  generateKeyPair,
  generateHDKey,
  getSparkAddressFromPublicKey,
  getSparkAddressFromTaproot,
} from "btc-spark-keys-gen";

// Generate a random key pair
const keyPair = generateKeyPair();
console.log("Private Key:", keyPair.privateKey);
console.log("Public Key:", keyPair.publicKey);

// Generate HD key from seed
const seed = new Uint8Array(32); // Your 32-byte seed
const hdKey = generateHDKey(seed);
console.log("HD Key:", hdKey);
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

### HD Key Derivation

```typescript
import { DerivationPathKeysGenerator } from "btc-spark-keys-gen";

// Create a derivation path generator
const generator = new DerivationPathKeysGenerator(true); // useAddressIndex: true

// Derive keys from seed
const seed = new Uint8Array(32); // Your seed
const accountNumber = 0;

const derivedKeys = await generator.deriveKeysFromSeed(seed, accountNumber);
console.log("Identity Key:", derivedKeys.identityKey);
console.log("Signing HD Key:", derivedKeys.signingHDKey);
console.log("Deposit Key:", derivedKeys.depositKey);
```

## API Reference

### Functions

#### `generateKeyPair(): KeyPair`

Generates a new random key pair.

**Returns:**

- `KeyPair`: Object containing `privateKey` and `publicKey` as `Uint8Array`

#### `generateHDKey(seed: Uint8Array): DerivedHDKey`

Generates an HD key from a seed.

**Parameters:**

- `seed: Uint8Array` - The seed for key generation

**Returns:**

- `DerivedHDKey`: Object containing `hdKey`, `privateKey`, and `publicKey`

#### `getSparkAddressFromPublicKey(publicKey: Uint8Array, network: 'mainnet' | 'regtest'): SparkAddress`

Generates a Spark address from a public key.

**Parameters:**

- `publicKey: Uint8Array` - The public key
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

#### `DerivationPathKeysGenerator`

A class for generating keys using specific derivation paths.

**Constructor:**

- `new DerivationPathKeysGenerator(useAddressIndex: boolean)`

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
