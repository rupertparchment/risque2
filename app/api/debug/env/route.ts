import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL
  
  return NextResponse.json({
    hasDatabaseUrl: !!dbUrl,
    startsWithPostgres: dbUrl?.startsWith('postgresql://') || dbUrl?.startsWith('postgres://'),
    firstChars: dbUrl?.substring(0, 30) || 'NOT SET',
    length: dbUrl?.length || 0,
    // Don't expose the full URL for security, just first few chars
  })
}
