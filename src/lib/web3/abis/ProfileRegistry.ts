export const PROFILE_REGISTRY_ADDRESS = '0x4Ab687D7D89FC4FFc5F814e465Fa94346e9CEe5b'

export const PROFILE_REGISTRY_ABI = [
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
] as const

export type ProfileRegistryABI = typeof PROFILE_REGISTRY_ABI
