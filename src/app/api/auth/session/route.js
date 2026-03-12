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

export async function GET(request) {
  const response = NextResponse.json({ ok: true })
  const supabase = createSupabaseServerClient(request, response)

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let fullName = null
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()

    if (profile?.full_name) {
      fullName = profile.full_name
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email ?? null,
        full_name: fullName,
        metadata_full_name: user.user_metadata?.full_name ?? null,
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Unable to verify session right now." },
      { status: 502 }
    )
  }
}
