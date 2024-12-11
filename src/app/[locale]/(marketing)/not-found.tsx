import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-4xl font-bold mb-4'>404 - Page Not Found</h1>
      <p className='text-github-fg-muted mb-8'>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href='/'
        className='px-4 py-2 bg-github-success-emphasis hover:bg-github-success-fg text-white rounded-md transition-colors'
      >
        Go Home
      </Link>
    </div>
  )
}
