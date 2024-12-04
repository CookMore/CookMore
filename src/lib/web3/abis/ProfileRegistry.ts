export const PROFILE_REGISTRY_ADDRESS = '0x4Ab687D7D89FC4FFc5F814e465Fa94346e9CEe5b'

export const PROFILE_REGISTRY_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_wallet',
        type: 'address',
      },
    ],
    name: 'adminDeleteProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_wallets',
        type: 'address[]',
      },
    ],
    name: 'batchDeleteProfiles',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadataURI',
        type: 'string',
      },
      {
        internalType: 'enum CookMoreProfileRegistry.ProfileTier',
        name: '_tier',
        type: 'uint8',
      },
    ],
    name: 'createProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_accessControl',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_proNFT',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_groupNFT',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'proNFT',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'groupNFT',
        type: 'address',
      },
    ],
    name: 'NFTContractsUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'profileId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'metadataURI',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'enum CookMoreProfileRegistry.ProfileTier',
        name: 'tier',
        type: 'uint8',
      },
    ],
    name: 'ProfileCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'profileId',
        type: 'uint256',
      },
    ],
    name: 'ProfileDeleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'profileId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum CookMoreProfileRegistry.ProfileTier',
        name: 'newTier',
        type: 'uint8',
      },
    ],
    name: 'ProfileTierUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'profileId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'metadataURI',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'enum CookMoreProfileRegistry.ProfileTier',
        name: 'tier',
        type: 'uint8',
      },
    ],
    name: 'ProfileUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_proNFT',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_groupNFT',
        type: 'address',
      },
    ],
    name: 'updateNFTContracts',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadataURI',
        type: 'string',
      },
    ],
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
    inputs: [],
    name: 'accessControl',
    outputs: [
      {
        internalType: 'contract CookMoreAccessControl',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_wallet',
        type: 'address',
      },
    ],
    name: 'getProfile',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'profileId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'wallet',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'metadataURI',
            type: 'string',
          },
          {
            internalType: 'enum CookMoreProfileRegistry.ProfileTier',
            name: 'tier',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'exists',
            type: 'bool',
          },
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
    name: 'getTotalProfiles',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'groupNFT',
    outputs: [
      {
        internalType: 'contract IERC721',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_wallet',
        type: 'address',
      },
    ],
    name: 'hasProfile',
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
  {
    inputs: [],
    name: 'paused',
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
  {
    inputs: [],
    name: 'proNFT',
    outputs: [
      {
        internalType: 'contract IERC721',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export type ProfileRegistryABI = typeof PROFILE_REGISTRY_ABI
