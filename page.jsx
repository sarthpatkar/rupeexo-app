"use client"

import { useState, useId } from "react"

// ─── Internal Helper Components ───────────────────────────────────────────────

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="w-4 h-4 text-[#475569]"
    >
      <path
        fillRule="evenodd"
        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
      <path
        fillRule="evenodd"
        d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
        clipRule="evenodd"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
        clipRule="evenodd"
      />
      <path d="M10.748 13.93l2.523 2.523a10.003 10.003 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.09 6.53l2.254 2.254a4 4 0 004.402 4.402l2.002 2.743z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin w-4 h-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateForm(form) {
  const errors = {}

  if (!form.email.trim()) {
    errors.email = "Email address is required."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address."
  }

  if (!form.password) {
    errors.password = "Password is required."
  }

  return errors
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function LoginPage() {
  const emailId = useId()
  const passwordId = useId()
  const rememberId = useId()

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const currentErrors = validateForm(form)
  const isValid = Object.keys(currentErrors).length === 0

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validateForm(form))
  }

  function getFieldError(field) {
    if (submitted || touched[field]) {
      return currentErrors[field]
    }
    return undefined
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setErrors(currentErrors)

    if (!isValid) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // In production: call auth API here
  }

  return (
    <>
      {/* Inter font via Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8fafc" }}>

        {/* ── Top Bar ── */}
        <header
          className="w-full bg-white"
          style={{ borderBottom: "1px solid #e2e8f0" }}
        >
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm">
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ color: "#1e3a8a", fontFamily: "Inter, sans-serif" }}
              >
                Rupeexo
              </span>

            </a>

            {/* Help Link */}
            <a
              href="#"
              className="text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm"
              style={{ color: "#475569" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            >
              Need help?
            </a>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full" style={{ maxWidth: "400px" }}>

            {/* ── Card ── */}
            <div
              className="bg-white rounded-md p-8"
              style={{
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 4px 0 rgba(15,23,42,0.06)",
              }}
            >

              {/* ── Header ── */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-3">
                  <LockIcon />
                  <span
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#475569" }}
                  >
                    Secure Login
                  </span>
                </div>
                <h1
                  className="text-xl font-semibold mb-1.5"
                  style={{ color: "#0f172a", fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}
                >
                  Sign in to your account
                </h1>
                <p className="text-sm" style={{ color: "#475569" }}>
                  Access your investment dashboard securely.
                </p>
              </div>

              {/* ── Form ── */}
              <form onSubmit={handleSubmit} noValidate>

                {/* Email Field */}
                <div className="mb-5">
                  <label
                    htmlFor={emailId}
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "#0f172a" }}
                  >
                    Email address
                  </label>
                  <input
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={!!getFieldError("email")}
                    aria-describedby={getFieldError("email") ? `${emailId}-error` : undefined}
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@example.com"
                    className="w-full rounded-md px-3 py-2.5 text-sm transition-colors focus:outline-none"
                    style={{
                      border: getFieldError("email") ? "1px solid #b91c1c" : "1px solid #e2e8f0",
                      color: "#0f172a",
                      backgroundColor: "#fff",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = getFieldError("email") ? "#b91c1c" : "#2563eb"
                      e.currentTarget.style.boxShadow = getFieldError("email")
                        ? "0 0 0 3px rgba(185,28,28,0.1)"
                        : "0 0 0 3px rgba(37,99,235,0.1)"
                    }}
                    onBlurCapture={(e) => {
                      const err = getFieldError("email")
                      e.currentTarget.style.borderColor = err ? "#b91c1c" : "#e2e8f0"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  />
                  {getFieldError("email") && (
                    <p
                      id={`${emailId}-error`}
                      role="alert"
                      className="mt-1.5 text-xs"
                      style={{ color: "#b91c1c" }}
                    >
                      {getFieldError("email")}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor={passwordId}
                      className="block text-sm font-medium"
                      style={{ color: "#0f172a" }}
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm"
                      style={{ color: "#2563eb" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#1e3a8a")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#2563eb")}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      id={passwordId}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      aria-required="true"
                      aria-invalid={!!getFieldError("password")}
                      aria-describedby={getFieldError("password") ? `${passwordId}-error` : undefined}
                      value={form.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                      placeholder="Enter your password"
                      className="w-full rounded-md px-3 py-2.5 pr-10 text-sm transition-colors focus:outline-none"
                      style={{
                        border: getFieldError("password") ? "1px solid #b91c1c" : "1px solid #e2e8f0",
                        color: "#0f172a",
                        backgroundColor: "#fff",
                        fontFamily: "Inter, sans-serif",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = getFieldError("password") ? "#b91c1c" : "#2563eb"
                        e.currentTarget.style.boxShadow = getFieldError("password")
                          ? "0 0 0 3px rgba(185,28,28,0.1)"
                          : "0 0 0 3px rgba(37,99,235,0.1)"
                      }}
                      onBlurCapture={(e) => {
                        const err = getFieldError("password")
                        e.currentTarget.style.borderColor = err ? "#b91c1c" : "#e2e8f0"
                        e.currentTarget.style.boxShadow = "none"
                      }}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm"
                      style={{ color: "#94a3b8" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {getFieldError("password") && (
                    <p
                      id={`${passwordId}-error`}
                      role="alert"
                      className="mt-1.5 text-xs"
                      style={{ color: "#b91c1c" }}
                    >
                      {getFieldError("password")}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2.5 mt-4 mb-5">
                  <input
                    id={rememberId}
                    name="remember"
                    type="checkbox"
                    checked={form.remember}
                    onChange={handleChange}
                    className="w-4 h-4 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                    style={{
                      accentColor: "#1e3a8a",
                      border: "1px solid #cbd5e1",
                      cursor: "pointer",
                    }}
                  />
                  <label
                    htmlFor={rememberId}
                    className="text-sm cursor-pointer select-none"
                    style={{ color: "#475569" }}
                  >
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || (submitted && !isValid)}
                  aria-disabled={isLoading || (submitted && !isValid)}
                  className="w-full rounded-md py-2.5 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]"
                  style={{
                    backgroundColor:
                      isLoading || (submitted && !isValid) ? "#94a3b8" : "#1e3a8a",
                    cursor: isLoading || (submitted && !isValid) ? "not-allowed" : "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && !(submitted && !isValid)) {
                      e.currentTarget.style.backgroundColor = "#172d6e"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && !(submitted && !isValid)) {
                      e.currentTarget.style.backgroundColor = "#1e3a8a"
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <SpinnerIcon />
                      <span>Signing in…</span>
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Security Note */}
                <p
                  className="mt-3 text-center text-xs"
                  style={{ color: "#94a3b8" }}
                >
                  Your data is encrypted and securely stored.
                </p>
              </form>

              {/* ── Divider ── */}
              <div className="relative my-6">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full" style={{ borderTop: "1px solid #e2e8f0" }} />
                </div>
                <div className="relative flex justify-center">
                  <span
                    className="bg-white px-3 text-xs"
                    style={{ color: "#94a3b8" }}
                  >
                    or
                  </span>
                </div>
              </div>

              {/* ── Google Button ── */}
              <button
                type="button"
                className="w-full rounded-md py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]"
                style={{
                  border: "1px solid #e2e8f0",
                  color: "#0f172a",
                  backgroundColor: "#fff",
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {/* ── Sign Up Link ── */}
              <p
                className="mt-6 text-center text-sm"
                style={{ color: "#475569" }}
              >
                Don&rsquo;t have an account?{" "}
                <a
                  href="#"
                  className="font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm"
                  style={{ color: "#2563eb" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1e3a8a")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#2563eb")}
                >
                  Create one
                </a>
              </p>
            </div>
            {/* End Card */}

          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="py-6 text-center" style={{ borderTop: "1px solid #e2e8f0" }}>
          <p className="text-xs" style={{ color: "#94a3b8" }}>
            &copy; 2026 Rupeexo. All rights reserved.&nbsp;&nbsp;
            <a
              href="#"
              className="transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm"
              style={{ color: "#94a3b8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              Privacy
            </a>
            &nbsp;·&nbsp;
            <a
              href="#"
              className="transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm"
              style={{ color: "#94a3b8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              Terms
            </a>
          </p>
        </footer>

      </div>
    </>
  )
}
