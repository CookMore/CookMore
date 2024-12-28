import { decodeEventLog } from 'viem'

export const profileABI = [
  {
    inputs: [{ internalType: 'string', name: 'metadataURI', type: 'string' }],
    name: 'createProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'metadataURI', type: 'string' }],
    name: 'updateProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'upgradeTier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'wallet', type: 'address' }],
    name: 'adminDeleteProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'wallet', type: 'address' }],
    name: 'getProfile',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'profileId', type: 'uint256' },
          { internalType: 'address', name: 'wallet', type: 'address' },
          { internalType: 'string', name: 'metadataURI', type: 'string' },
          { internalType: 'uint8', name: 'tier', type: 'uint8' },
          { internalType: 'bool', name: 'exists', type: 'bool' },
        ],
        internalType: 'struct CookMoreProfileRegistry.Profile',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
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
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'wallet', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'metadataURI', type: 'string' },
    ],
    name: 'ProfileCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'wallet', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'metadataURI', type: 'string' },
    ],
    name: 'ProfileUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'wallet', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'profileId', type: 'uint256' },
    ],
    name: 'ProfileDeleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'wallet', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { indexed: false, internalType: 'uint8', name: 'newTier', type: 'uint8' },
    ],
    name: 'ProfileUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
    name: 'Unpaused',
    type: 'event',
  },
] as const

// Function to decode logs using the profileABI
export function decodeProfileLog(log) {
  return decodeEventLog({
    abi: profileABI,
    data: log.data,
    topics: log.topics,
  })
}
