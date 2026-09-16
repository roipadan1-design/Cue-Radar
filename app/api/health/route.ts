import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { supabase: 'missing_env', session: false },
      { status: 500 }
    )
  }

  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    // Test a lightweight query to verify db connectivity
    const { error } = await supabase.from('markets').select('slug').limit(1)

    if (error) {
      return NextResponse.json(
        { supabase: 'unreachable', session: Boolean(session), error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { supabase: 'ok', session: Boolean(session) },
      { status: 200 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { supabase: 'unreachable', session: false, error: message },
      { status: 500 }
    )
  }
}
