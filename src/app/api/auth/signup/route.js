import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

function createSupabaseServerClient(request, response) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
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
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const fullName =
    typeof body?.fullName === "string" ? body.fullName.trim() : ""
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
  const password = typeof body?.password === "string" ? body.password : ""

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { error: "Full name, email and password are required." },
      { status: 400 }
    )
  }

  const response = NextResponse.json({ ok: true })
  const supabase = createSupabaseServerClient(request, response)

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      message: "Account created. Verify your email from inbox, then login.",
    })
  } catch {
    return NextResponse.json(
      { error: "Unable to reach auth service right now." },
      { status: 502 }
    )
  }
}
