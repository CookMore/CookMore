export const tierABI = [
  {
    inputs: [],
    name: 'ADMIN_GROUP_LIMIT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ADMIN_OG_LIMIT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ADMIN_PRO_LIMIT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
    inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }],
    name: 'adminMintGroup',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }],
    name: 'adminMintOG',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }],
    name: 'adminMintPro',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'adminTreasury',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'newTreasury', type: 'address' }],
    name: 'AdminTreasuryUpdated',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: '_newTreasury', type: 'address' }],
    name: 'setAdminTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
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
    inputs: [],
    name: 'mintOG',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'tier', type: 'string' },
    ],
    name: 'Minted',
    type: 'event',
  },
  {
    inputs: [],
    name: 'proPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'groupPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ogPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'tokenTier',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
