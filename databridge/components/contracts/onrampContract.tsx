export const ONRAMP_CONTRACT_ADDRESS = '0xd7EEf3bd4C819C277B34ab1BdF1D7044c43c311B';

export const ONRAMP_CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "aggId",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "commP",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "uint64[]",
        "name": "offerIDs",
        "type": "uint64[]"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "payoutAddr",
        "type": "address"
      }
    ],
    "name": "AggregationCommitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes",
            "name": "commP",
            "type": "bytes"
          },
          {
            "internalType": "uint64",
            "name": "size",
            "type": "uint64"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "contract IERC20",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "enum OnRampContract.OfferStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "indexed": false,
        "internalType": "struct OnRampContract.Offer",
        "name": "offer",
        "type": "tuple"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "id",
        "type": "uint64"
      }
    ],
    "name": "DataReady",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "commP",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "dealID",
        "type": "uint64"
      }
    ],
    "name": "ProveDataStored",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "aggregationDealIds",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "aggregationPayout",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "aggregations",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "commPToAggregateID",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "commP",
        "type": "bytes"
      },
      {
        "internalType": "uint64[]",
        "name": "claimedIDs",
        "type": "uint64[]"
      },
      {
        "components": [
          {
            "internalType": "uint64",
            "name": "index",
            "type": "uint64"
          },
          {
            "internalType": "bytes32[]",
            "name": "path",
            "type": "bytes32[]"
          }
        ],
        "internalType": "struct PODSIVerifier.ProofData[]",
        "name": "inclusionProofs",
        "type": "tuple[]"
      },
      {
        "internalType": "address",
        "name": "payoutAddr",
        "type": "address"
      }
    ],
    "name": "commitAggregate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dataProofOracle",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "aggId",
        "type": "uint64"
      }
    ],
    "name": "getAggregationDetails",
    "outputs": [
      {
        "internalType": "address",
        "name": "payoutAddress",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isProven",
        "type": "bool"
      },
      {
        "internalType": "uint64",
        "name": "offerCount",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "aggId",
        "type": "uint64"
      }
    ],
    "name": "getAggregationOffers",
    "outputs": [
      {
        "internalType": "uint64[]",
        "name": "",
        "type": "uint64[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "client",
        "type": "address"
      }
    ],
    "name": "getClientOffers",
    "outputs": [
      {
        "internalType": "uint64[]",
        "name": "",
        "type": "uint64[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "offerId",
        "type": "uint64"
      }
    ],
    "name": "getOfferDealId",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "dealId",
        "type": "uint64"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "offerId",
        "type": "uint64"
      }
    ],
    "name": "getOfferDetails",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "commP",
        "type": "bytes"
      },
      {
        "internalType": "uint64",
        "name": "size",
        "type": "uint64"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "contract IERC20",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      },
      {
        "internalType": "enum OnRampContract.OfferStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "offerId",
        "type": "uint64"
      }
    ],
    "name": "getOfferStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      },
      {
        "internalType": "enum OnRampContract.OfferStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPendingOffers",
    "outputs": [
      {
        "internalType": "uint64[]",
        "name": "",
        "type": "uint64[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalOffers",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "isOfferAggregated",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes",
            "name": "commP",
            "type": "bytes"
          },
          {
            "internalType": "uint64",
            "name": "size",
            "type": "uint64"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "contract IERC20",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "enum OnRampContract.OfferStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct OnRampContract.Offer",
        "name": "offer",
        "type": "tuple"
      }
    ],
    "name": "offerData",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "offers",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "commP",
        "type": "bytes"
      },
      {
        "internalType": "uint64",
        "name": "size",
        "type": "uint64"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "contract IERC20",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "enum OnRampContract.OfferStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes",
            "name": "commP",
            "type": "bytes"
          },
          {
            "internalType": "int64",
            "name": "duration",
            "type": "int64"
          },
          {
            "internalType": "uint64",
            "name": "dealID",
            "type": "uint64"
          },
          {
            "internalType": "uint256",
            "name": "status",
            "type": "uint256"
          }
        ],
        "internalType": "struct DataAttestation",
        "name": "attestation",
        "type": "tuple"
      }
    ],
    "name": "proveDataStored",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "provenAggregations",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "oracle_",
        "type": "address"
      }
    ],
    "name": "setOracle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint64",
            "name": "index",
            "type": "uint64"
          },
          {
            "internalType": "bytes32[]",
            "name": "path",
            "type": "bytes32[]"
          }
        ],
        "internalType": "struct PODSIVerifier.ProofData",
        "name": "proof",
        "type": "tuple"
      },
      {
        "internalType": "bytes32",
        "name": "root",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "leaf",
        "type": "bytes32"
      }
    ],
    "name": "verify",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "aggID",
        "type": "uint64"
      },
      {
        "internalType": "uint256",
        "name": "idx",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "offerID",
        "type": "uint64"
      }
    ],
    "name": "verifyDataStored",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
