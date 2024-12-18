export const metadataABI = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'bio', type: 'string' },
      { internalType: 'string', name: 'avatar', type: 'string' },
      { internalType: 'string', name: 'ipfsNotesCID', type: 'string' },
    ],
    name: 'createMetadata',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'bio', type: 'string' },
      { internalType: 'string', name: 'avatar', type: 'string' },
      { internalType: 'string', name: 'ipfsNotesCID', type: 'string' },
    ],
    name: 'updateMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'string', name: 'placeholderCID', type: 'string' },
    ],
    name: 'flagMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'profileId', type: 'uint256' }],
    name: 'getMetadata',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'profileId', type: 'uint256' },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'bio', type: 'string' },
          { internalType: 'string', name: 'avatar', type: 'string' },
          { internalType: 'string', name: 'ipfsNotesCID', type: 'string' },
          { internalType: 'bool', name: 'flagged', type: 'bool' },
        ],
        internalType: 'struct CookMoreMetadata.Metadata',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FEATURE_MANAGER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'CONTENT_MODERATOR_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'string', name: 'bio', type: 'string' },
      { indexed: false, internalType: 'string', name: 'avatar', type: 'string' },
      { indexed: false, internalType: 'string', name: 'ipfsNotesCID', type: 'string' },
    ],
    name: 'MetadataCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'placeholderCID', type: 'string' },
    ],
    name: 'MetadataFlagged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'string', name: 'bio', type: 'string' },
      { indexed: false, internalType: 'string', name: 'avatar', type: 'string' },
      { indexed: false, internalType: 'string', name: 'ipfsNotesCID', type: 'string' },
    ],
    name: 'MetadataUpdated',
    type: 'event',
  },
] as const