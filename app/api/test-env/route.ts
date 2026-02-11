import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL
  
  return NextResponse.json({
    hasDatabaseUrl: !!dbUrl,
    startsWithPostgres: dbUrl?.startsWith('postgresql://') || dbUrl?.startsWith('postgres://'),
    firstChars: dbUrl?.substring(0, 50) || 'NOT SET',
    fullValue: dbUrl || 'NOT SET', // For debugging - remove after fixing
    allEnvVars: Object.keys(process.env).filter(k => 
      k.includes('DATABASE') || 
      k.includes('POSTGRES') || 
      k.includes('DB')
    ),
  })
}
