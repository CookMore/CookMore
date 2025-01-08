const ethers = require('ethers')

// Define the event signature
const eventSignature = 'ProfileCreated(address,uint256,string)'

// Hash the signature using Keccak-256
const eventSignatureHash = ethers.utils.id(eventSignature)

console.log('Event Signature Hash:', eventSignatureHash)
