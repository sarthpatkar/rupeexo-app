import { createClient } from "../../../lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")

    if (code) {
      const supabase = await createClient()
      await supabase.auth.exchangeCodeForSession(code)
    }

    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.redirect(`${requestUrl.origin}/login`)
  }
}