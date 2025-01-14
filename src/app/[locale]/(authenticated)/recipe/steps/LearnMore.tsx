import React from 'react'

export const LearnMore: React.FC = () => {
  return (
    <div className='p-6 bg-github-canvas-default text-github-fg-default rounded-md'>
      <h1 className='text-2xl font-bold'>Understanding Session Storage and Minting</h1>
      <p className='mt-4'>
        Our application uses local session storage to temporarily save your recipe data. This means
        that if you close your browser or refresh the page, your data will be lost. To ensure your
        recipe is saved permanently, you need to complete the minting process. This involves storing
        your recipe on IPFS, a decentralized storage network, and minting it as an NFT on the
        blockchain.
      </p>
      <h2 className='text-xl font-semibold mt-6'>Why Minting is Important</h2>
      <p className='mt-2'>
        Minting your recipe as an NFT not only secures your data but also allows you to prove
        ownership and authenticity. It enables you to share your recipe with others while
        maintaining control over its distribution.
      </p>
      <h2 className='text-xl font-semibold mt-6'>Steps to Mint Your Recipe</h2>
      <ol className='list-decimal list-inside mt-2'>
        <li>Complete all the steps in the recipe creation process.</li>
        <li>Review your recipe and ensure all information is correct.</li>
        <li>
          Proceed to the minting step and follow the instructions to mint your recipe as an NFT.
        </li>
      </ol>
      <p className='mt-4'>
        If you have any questions or need assistance, please contact our support team.
      </p>
    </div>
  )
}
