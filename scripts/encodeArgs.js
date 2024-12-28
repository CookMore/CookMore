const { ethers } = require('ethers')

// Define the ABI and constructor arguments
const abi = ['constructor(address _owner, uint256 _value)']
const iface = new ethers.Interface(abi)

// Replace with your actual arguments
const ownerAddress = '0x0C3897538e000dAdAEA1bb10D5757fC473972018'
const value = 1000

// Encode the arguments
const encodedArgs = iface.encodeDeploy([ownerAddress, value])
console.log(encodedArgs)
