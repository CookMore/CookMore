import { toast } from 'sonner'
import type { IPFSMetadata } from '../../types/metadata'
import type { ProfileMetadata } from '../../profile'

export type IpfsGateway = 'gateway.pinata.cloud' | 'ipfs.io' | 'dweb.link' | 'cloudflare-ipfs.com'

interface IpfsUploadResult {
  cid: string
  url: string
}

class IPFSError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'IPFSError'
  }
}

export class IPFSService {
  private defaultGateway: IpfsGateway = 'gateway.pinata.cloud'
  private jwt: string

  constructor() {
    this.jwt = process.env.NEXT_PUBLIC_PINATA_JWT || ''
    if (!this.jwt) {
      console.warn('Pinata JWT not found')
    }
  }

  getHttpUrl(ipfsCid: string): string {
    if (!ipfsCid) {
      console.warn('IPFS Service - Empty CID provided')
      return ''
    }

    console.log('IPFS Service - getHttpUrl input:', { ipfsCid })

    try {
      // If it's already a gateway URL, return as is
      if (ipfsCid.startsWith('http://') || ipfsCid.startsWith('https://')) {
        console.log('IPFS Service - URL is already in HTTP format, returning as is:', { ipfsCid })
        return ipfsCid
      }

      // If it's already a gateway IPFS URL, return as is
      if (ipfsCid.startsWith(`https://${this.defaultGateway}/ipfs/`)) {
        console.log('IPFS Service - URL is already in gateway format, returning as is:', {
          ipfsCid,
        })
        return ipfsCid
      }

      // Remove any number of ipfs:// prefixes to handle potential double prefixing
      const cid = ipfsCid.replace(/^(ipfs:\/\/)+/, '')

      // Clean any remaining forward slashes
      const cleanCid = cid.replace(/^\/+|\/+$/g, '')

      const url = `https://${this.defaultGateway}/ipfs/${cleanCid}`
      console.log('IPFS Service - URL transformation:', {
        originalCid: ipfsCid,
        cleanedCid: cleanCid,
        gateway: this.defaultGateway,
        finalUrl: url,
      })
      return url
    } catch (error) {
      console.error('IPFS Service - Error processing URL:', error)
      return ipfsCid // Return original input if processing fails
    }
  }

  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<IpfsUploadResult> {
    if (!this.jwt) {
      const error = new IPFSError('Pinata JWT not configured')
      toast.error(error.message)
      throw error
    }

    if (!file) {
      console.error('File is missing before upload')
      throw new IPFSError('No file provided for upload')
    }
    console.log('Uploading file:', file.name)

    console.log('Starting file upload:', {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()

      const uploadPromise = new Promise<IpfsUploadResult>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
            console.log('Upload progress:', progress.toFixed(2) + '%')
          }
        })

        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const result = JSON.parse(xhr.responseText)
            console.log('IPFS Service - Upload success:', {
              response: result,
              status: xhr.status,
              responseType: xhr.responseType,
            })

            const cid = `ipfs://${result.IpfsHash}`
            console.log('IPFS Service - Generated CID:', { cid })

            const url = this.getHttpUrl(cid)
            console.log('IPFS Service - Final result:', {
              cid,
              url,
              originalHash: result.IpfsHash,
            })

            resolve({ cid, url })
          } else {
            let errorMessage = `Upload failed with status ${xhr.status}`
            try {
              const errorResponse = JSON.parse(xhr.responseText)
              errorMessage = `${errorMessage}: ${errorResponse.message || errorResponse.error || 'Unknown error'}`
              console.error('Upload error response:', errorResponse)
            } catch (e) {
              console.error('Could not parse error response:', xhr.responseText)
            }
            reject(new IPFSError(errorMessage))
          }
        }

        xhr.onerror = () => {
          console.error('Network error during upload')
          reject(new IPFSError('Network error during upload'))
        }
      })

      xhr.open('POST', 'https://api.pinata.cloud/pinning/pinFileToIPFS')
      xhr.setRequestHeader('Authorization', `Bearer ${this.jwt}`)
      xhr.send(formData)

      return await uploadPromise
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      if (error instanceof IPFSError) {
        toast.error(error.message)
        throw error
      }
      toast.error('Failed to upload file to IPFS')
      throw new IPFSError('Failed to upload file')
    }
  }

  async uploadMetadata(metadata: IPFSMetadata): Promise<IpfsUploadResult> {
    try {
      console.log('Uploading metadata:', metadata)

      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.jwt}`,
        },
        body: JSON.stringify(metadata),
      })

      if (!response.ok) {
        throw new IPFSError(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const cid = `ipfs://${result.IpfsHash}`
      return {
        cid,
        url: this.getHttpUrl(cid),
      }
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error)
      if (error instanceof IPFSError) {
        toast.error(error.message)
        throw error
      }
      toast.error('Failed to upload metadata to IPFS')
      throw new IPFSError('Failed to upload metadata')
    }
  }

  async fetchMetadata(cid: string): Promise<IPFSMetadata> {
    try {
      const url = this.getHttpUrl(cid)
      const response = await fetch(url)

      if (!response.ok) {
        throw new IPFSError(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching metadata from IPFS:', error)
      if (error instanceof IPFSError) {
        toast.error(error.message)
        throw error
      }
      toast.error('Failed to fetch metadata from IPFS')
      throw new IPFSError('Failed to fetch metadata')
    }
  }

  setDefaultGateway(gateway: IpfsGateway): void {
    this.defaultGateway = gateway
  }

  async uploadHTML(content: string, filename: string): Promise<IpfsUploadResult> {
    const blob = new Blob([content], { type: 'text/html' })
    const file = new File([blob], filename, { type: 'text/html' })
    return this.uploadFile(file)
  }

  generateDynamicRenderer(profileData: ProfileMetadata): string {
    if (!profileData.avatar) {
      throw new Error('Avatar is required for rendering the profile.')
    }

    const avatarUrl = this.getHttpUrl(profileData.avatar)

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${profileData.name}'s Chef Profile</title>
  <style>
    .profile-card {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border-radius: 16px;
      background: var(--bg-color, #fff);
    }
    [data-tier="pro"] { --bg-color: #f8f9fa; }
    [data-tier="group"] { --bg-color: #f3f4f6; }
    [data-tier="og"] { --bg-color: #f1f5f9; }
  </style>
</head>
<body>
  <div id="profile-renderer" data-profile-id="${profileData.profileId}" data-tier="${profileData.tier}">
    <div class="profile-card">
      <img id="avatar" src="${avatarUrl}" alt="Profile" />
      <h1>${profileData.name}</h1>
      <p>${profileData.bio || ''}</p>
      <div id="dynamic-content"></div>
    </div>
  </div>
  <script>
    const profileData = ${JSON.stringify(profileData)};
    
    class ProfileRenderer {
      constructor(data) {
        this.data = data;
        this.render();
      }

      render() {
        const content = document.getElementById('dynamic-content');
        this.renderTierSpecificContent(content);
        this.setupInteractivity();
      }

      renderTierSpecificContent(container) {
        const { tier, culinaryInfo, achievements } = this.data;
        
        // Render tier-specific features
        const tierContent = document.createElement('div');
        tierContent.className = 'tier-content';
        
        if (culinaryInfo) {
          tierContent.innerHTML += \`
            <div class="expertise">
              <h3>Expertise</h3>
              <p>\${culinaryInfo.expertise}</p>
            </div>
          \`;
        }

        if (achievements) {
          tierContent.innerHTML += \`
            <div class="achievements">
              <h3>Achievements</h3>
              <p>Recipes Created: \${achievements.recipesCreated}</p>
              <p>Total Likes: \${achievements.totalLikes}</p>
            </div>
          \`;
        }

        container.appendChild(tierContent);
      }

      setupInteractivity() {
        // Add any interactive features here
        document.querySelector('.profile-card').addEventListener('click', () => {
          // Handle interactions
        });
      }
    }

    // Initialize the renderer
    new ProfileRenderer(profileData);
  </script>
</body>
</html>`
  }
}

export const ipfsService = new IPFSService()
