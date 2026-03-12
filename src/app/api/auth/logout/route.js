import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { SUPABASE_AUTH_STORAGE_KEY } from "../../../../lib/supabase/constants"

function createSupabaseServerClient(request, response) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        storageKey: SUPABASE_AUTH_STORAGE_KEY,
      },
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )
}

export async function POST(request) {
  const response = NextResponse.json({ ok: true })
  const supabase = createSupabaseServerClient(request, response)

  try {
    await supabase.auth.signOut()
  } catch {}

  return response
}
