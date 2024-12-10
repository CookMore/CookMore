export default function FeaturesPage() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold text-github-fg-default text-center mb-12'>
        Features that Make Cooking Better
      </h1>

      {/* Hero Feature */}
      <div className='bg-github-canvas-subtle border border-github-border-default rounded-lg p-8 mb-12'>
        <div className='grid md:grid-cols-2 gap-8 items-center'>
          <div>
            <h2 className='text-2xl font-bold text-github-fg-default mb-4'>
              Recipe Version Control
            </h2>
            <p className='text-github-fg-muted mb-6'>
              Track changes, branch variations, and merge improvements back into your recipes. Just
              like code, but for cooking.
            </p>
            <ul className='space-y-3'>
              <li className='flex items-center text-github-fg-default'>
                <span className='mr-2 text-github-success-fg'>✓</span>
                Track recipe evolution over time
              </li>
              <li className='flex items-center text-github-fg-default'>
                <span className='mr-2 text-github-success-fg'>✓</span>
                Branch and experiment safely
              </li>
              <li className='flex items-center text-github-fg-default'>
                <span className='mr-2 text-github-success-fg'>✓</span>
                Merge successful variations
              </li>
            </ul>
          </div>
          <div className='bg-github-canvas-default border border-github-border-default rounded-lg p-4'>
            {/* Placeholder for feature illustration/screenshot */}
            <div className='aspect-video bg-github-canvas-subtle rounded-md'></div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {/* Collaboration */}
        <div className='bg-github-canvas-subtle border border-github-border-default rounded-lg p-6'>
          <div className='text-2xl mb-4 text-github-fg-default'>👥</div>
          <h3 className='text-xl font-bold text-github-fg-default mb-3'>Collaborative Cooking</h3>
          <p className='text-github-fg-muted mb-4'>
            Work together with family and friends. Share, comment, and improve recipes as a team.
          </p>
          <ul className='space-y-2'>
            <li className='flex items-center text-github-fg-default text-sm'>
              <span className='mr-2 text-github-success-fg'>•</span>
              Real-time collaboration
            </li>
            <li className='flex items-center text-github-fg-default text-sm'>
              <span className='mr-2 text-github-success-fg'>•</span>
              Comments and discussions
            </li>
            <li className='flex items-center text-github-fg-default text-sm'>
              <span className='mr-2 text-github-success-fg'>•</span>
              Permission
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
