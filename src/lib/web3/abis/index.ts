// Contract ABIs
export const TIER_NFT_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_usdc',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_proPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_groupPrice',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'mintPro',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintGroup',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'upgradeToGroup',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'isGroupTier',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const CHANGELOG_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_version',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_description',
        type: 'string',
      },
    ],
    name: 'addChange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getChangelog',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'version',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256',
          },
        ],
        internalType: 'struct CookMoreChangelog.Change[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const VERSION_CONTROL_ABI = [
  {
    inputs: [],
    name: 'getCurrentVersion',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_version',
        type: 'string',
      },
    ],
    name: 'updateVersion',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const RECIPE_NFT_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadataURI',
        type: 'string',
      },
    ],
    name: 'createRecipe',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'getRecipe',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'metadataURI',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'exists',
            type: 'bool',
          },
        ],
        internalType: 'struct CookMoreRecipe.Recipe',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_metadataURI',
        type: 'string',
      },
    ],
    name: 'updateRecipe',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// Re-export all ABIs
export * from './ProfileRegistry'
export * from './AccessControl'
export * from './Metadata'
export * from './ProfileSystem'
export * from './TierContracts'

// Alias for backward compatibility
export { PROFILE_REGISTRY_ABI as PROFILE_SYSTEM_ABI } from './ProfileRegistry'
