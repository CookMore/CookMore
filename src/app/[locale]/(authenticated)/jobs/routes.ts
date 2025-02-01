// src/app/[locale]/(authenticated)/jobs/routes.ts

export async function GET(req: Request) {
  console.log('Server debug log for Jobs route')
  // Some code that might throw
  return new Response(JSON.stringify({ message: 'Hello from server' }))
}
