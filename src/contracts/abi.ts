export const PROFILE_CONTRACT_ABI = [
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'getProfile',
    outputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'avatar', type: 'string' },
      { internalType: 'string', name: 'bio', type: 'string' },
      { internalType: 'uint256', name: 'lastUpdated', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'string', name: '_avatar', type: 'string' },
      { internalType: 'string', name: '_bio', type: 'string' },
    ],
    name: 'updateProfile',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'deleteProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'avatar',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'bio',
        type: 'string',
      },
    ],
    name: 'ProfileUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'ProfileDeleted',
    type: 'event',
  },
] as const

export const PROFILE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROFILE_CONTRACT_ADDRESS
