const crypto = require('crypto')
const encryptionKey = crypto.randomBytes(32).toString('hex') // Generates a 256-bit key
console.log('Generated Encryption Key:', encryptionKey)
