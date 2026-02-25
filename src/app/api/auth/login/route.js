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

  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
  const password = typeof body?.password === "string" ? body.password : ""

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    )
  }

  const response = NextResponse.json({ ok: true })
  const supabase = createSupabaseServerClient(request, response)

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      const message = error.message || "Invalid login credentials."

      if (/email not confirmed/i.test(message)) {
        try {
          await supabase.auth.resend({
            type: "signup",
            email,
          })
        } catch {}

        return NextResponse.json(
          {
            error:
              "Email not verified yet. We sent a new verification email. Verify first, then login.",
          },
          { status: 403 }
        )
      }

      if (/invalid login credentials/i.test(message)) {
        return NextResponse.json(
          {
            error:
              "Invalid email or password. If you signed up recently, verify your email before logging in.",
          },
          { status: 401 }
        )
      }

      return NextResponse.json({ error: message }, { status: 401 })
    }

    return response
  } catch {
    return NextResponse.json(
      { error: "Unable to reach auth service right now." },
      { status: 502 }
    )
  }
}
