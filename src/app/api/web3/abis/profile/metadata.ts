export const METADATA_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '_profileId', type: 'uint256' },
      { internalType: 'string', name: '_metadataURI', type: 'string' },
    ],
    name: 'createMetadata',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_profileId', type: 'uint256' },
      { internalType: 'string', name: '_metadataURI', type: 'string' },
    ],
    name: 'updateMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
