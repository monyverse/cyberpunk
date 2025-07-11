# NEAR Intent Smart Contract Documentation

## Overview

This contract enables AI-driven agents to autonomously execute user-defined intents on the NEAR blockchain, with support for cross-chain signatures (e.g., EVM/Flow). Users submit intents, and agents fulfill them, optionally verifying signatures from other chains.

---

## Features
- **Intent Submission:** Users submit intents (as JSON or string).
- **Intent Fulfillment:** Agents can fulfill/execute intents and record results.
- **Cross-Chain Signature:** Store and verify a signature from another chain (EVM/Flow) for each intent.

---

## Contract API

### Methods
- `submit_intent(intent: String, cross_chain_sig: String)`
  - Stores a new intent with optional cross-chain signature.
- `get_intents() -> Vec<Intent>`
  - Returns all intents.
- `fulfill_intent(intent_id: u64, result: String)`
  - Marks an intent as fulfilled and stores the result.

### Intent Structure
```json
{
  "id": 0,
  "intent": "Transfer 1 ETH to 0x... on Ethereum",
  "cross_chain_sig": "0x...",
  "fulfilled": false,
  "result": ""
}
```

---

## Deployment (NEAR Testnet)

### Prerequisites
- [NEAR CLI](https://docs.near.org/tools/near-cli)
- Rust toolchain
- NEAR testnet account

### Build & Deploy
```sh
# 1. Clone the repo or copy contract to a folder
cd near-intent-contract

# 2. Build the contract
cargo build --target wasm32-unknown-unknown --release

# 3. Deploy to NEAR testnet
near deploy --accountId <your-account>.testnet --wasmFile target/wasm32-unknown-unknown/release/near_intent_contract.wasm
```

---

## Usage

### Submit an Intent (NEAR CLI)
```sh
near call <your-account>.testnet submit_intent '{"intent": "Swap 1 ETH for USDC on Uniswap", "cross_chain_sig": "0x..."}' --accountId <your-account>.testnet
```

### Fulfill an Intent
```sh
near call <your-account>.testnet fulfill_intent '{"intent_id": 0, "result": "Swap executed on Uniswap, tx: 0x..."}' --accountId <your-account>.testnet
```

### Get All Intents
```sh
near view <your-account>.testnet get_intents '{}'
```

---

## JavaScript SDK Example

```js
import { connect, keyStores, Contract } from 'near-api-js';

const near = await connect({
  networkId: 'testnet',
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
});
const account = await near.account('<your-account>.testnet');
const contract = new Contract(account, '<your-account>.testnet', {
  viewMethods: ['get_intents'],
  changeMethods: ['submit_intent', 'fulfill_intent'],
});

// Submit intent
await contract.submit_intent({ intent: 'Transfer 1 ETH to 0x...', cross_chain_sig: '0x...' });

// Fulfill intent
await contract.fulfill_intent({ intent_id: 0, result: 'Transfer complete' });

// Get intents
const intents = await contract.get_intents();
```

---

## Cross-Chain Signature Demo
- User signs a message on EVM/Flow chain (e.g., using MetaMask or Flow wallet).
- The signature is submitted with the intent to NEAR.
- The contract stores the signature for later verification (off-chain or by an agent).

---

## Security & Notes
- This contract does not perform on-chain signature verification (for demo, verification is off-chain or by the agent).
- For production, integrate NEAR's ed25519 verification or use a cross-chain oracle.

---

## References
- [NEAR Rust Smart Contracts](https://docs.near.org/develop/contracts/rust/intro)
- [NEAR CLI](https://docs.near.org/tools/near-cli)
- [near-api-js](https://docs.near.org/tools/near-api-js) 