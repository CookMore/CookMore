import { create } from 'ipfs-http-client'

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
const projectSecret = process.env.NEXT_PUBLIC_INFURA_API_SECRET
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})

export function useIpfs() {
  const uploadToIpfs = async (data: any) => {
    try {
      const added = await client.add(JSON.stringify(data))
      return added.path
    } catch (error) {
      console.error('IPFS upload error:', error)
      throw error
    }
  }

  return { uploadToIpfs }
}
