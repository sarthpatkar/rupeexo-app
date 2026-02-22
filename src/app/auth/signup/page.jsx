"use client"

import { useState, useId } from "react"
import { createClient } from "../../../lib/supabase/client"
import { useRouter } from "next/navigation"

// ─── Internal Helper Components ───────────────────────────────────────────────

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="w-4 h-4 text-[#475569]"
    >
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
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

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3 h-3"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  )
}

// ─── Password Strength ────────────────────────────────────────────────────────

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" }
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: "Weak", color: "#b91c1c" }
  if (score === 2) return { score, label: "Fair", color: "#d97706" }
  if (score === 3) return { score, label: "Good", color: "#2563eb" }
  return { score, label: "Strong", color: "#15803d" }
}

// ─── Reusable Input Field ─────────────────────────────────────────────────────

function InputField({ id, label, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1.5"
        style={{ color: "#0f172a" }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-xs"
          style={{ color: "#b91c1c" }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

function inputStyle(hasError) {
  return {
    border: hasError ? "1px solid #b91c1c" : "1px solid #e2e8f0",
    color: "#0f172a",
    backgroundColor: "#fff",
    fontFamily: "Inter, sans-serif",
  }
}

function handleFocus(e, hasError) {
  e.currentTarget.style.borderColor = hasError ? "#b91c1c" : "#2563eb"
  e.currentTarget.style.boxShadow = hasError
    ? "0 0 0 3px rgba(185,28,28,0.1)"
    : "0 0 0 3px rgba(37,99,235,0.1)"
}

function handleBlurCapture(e, hasError) {
  e.currentTarget.style.borderColor = hasError ? "#b91c1c" : "#e2e8f0"
  e.currentTarget.style.boxShadow = "none"
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateForm(form) {
  const errors = {}

  if (!form.fullName.trim()) {
    errors.fullName = "Full name is required."
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name."
  }

  if (!form.email.trim()) {
    errors.email = "Email address is required."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address."
  }

  if (!form.password) {
    errors.password = "Password is required."
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters."
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = "Please confirm your password."
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match."
  }

  if (!form.terms) {
    errors.terms = "You must accept the terms to continue."
  }

  return errors
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function SignUpPage() {
  const fullNameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPasswordId = useId()
  const termsId = useId()

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const currentErrors = validateForm(form)
  const isValid = Object.keys(currentErrors).length === 0
  const strength = getPasswordStrength(form.password)

  const router = useRouter()

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
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
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true, terms: true })

    if (!isValid) return

    setIsLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
        },
      },
    })

    setIsLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push("/dashboard")
  }

  async function handleGoogleLogin() {
    const supabase = createClient()

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const passwordRules = [
    { label: "At least 8 characters", met: form.password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(form.password) },
    { label: "One number", met: /[0-9]/.test(form.password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(form.password) },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8fafc" }}>

        {/* ── Top Bar ── */}
        <header className="w-full bg-white" style={{ borderBottom: "1px solid #e2e8f0" }}>
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a
              href="/"
              className="flex items-center gap-2 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm"
            >
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ color: "#1e3a8a", fontFamily: "Inter, sans-serif" }}
              >
                Rupeexo
              </span>
            </a>
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
        <main className="flex-1 flex items-start justify-center px-4 py-10">
          <div className="w-full" style={{ maxWidth: "440px" }}>

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
                  <UserIcon />
                  <span
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#475569" }}
                  >
                    Create Account
                  </span>
                </div>
                <h1
                  className="text-xl font-semibold mb-1.5"
                  style={{ color: "#0f172a", fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}
                >
                  Start your financial journey
                </h1>
                <p className="text-sm" style={{ color: "#475569" }}>
                  Join thousands of investors on Rupeexo. Free to get started.
                </p>
              </div>

              {/* ── Form ── */}
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                {/* Full Name */}
                <InputField id={fullNameId} label="Full name" error={getFieldError("fullName")}>
                  <input
                    id={fullNameId}
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-invalid={!!getFieldError("fullName")}
                    aria-describedby={getFieldError("fullName") ? `${fullNameId}-error` : undefined}
                    value={form.fullName}
                    onChange={handleChange}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="Amit Sharma"
                    className="w-full rounded-md px-3 py-2.5 text-sm focus:outline-none"
                    style={inputStyle(!!getFieldError("fullName"))}
                    onFocus={(e) => handleFocus(e, !!getFieldError("fullName"))}
                    onBlurCapture={(e) => handleBlurCapture(e, !!getFieldError("fullName"))}
                  />
                </InputField>

                {/* Email */}
                <InputField id={emailId} label="Email address" error={getFieldError("email")}>
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
                    className="w-full rounded-md px-3 py-2.5 text-sm focus:outline-none"
                    style={inputStyle(!!getFieldError("email"))}
                    onFocus={(e) => handleFocus(e, !!getFieldError("email"))}
                    onBlurCapture={(e) => handleBlurCapture(e, !!getFieldError("email"))}
                  />
                </InputField>

                {/* Password */}
                <div>
                  <InputField id={passwordId} label="Password" error={getFieldError("password")}>
                    <div className="relative">
                      <input
                        id={passwordId}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        aria-required="true"
                        aria-invalid={!!getFieldError("password")}
                        aria-describedby={getFieldError("password") ? `${passwordId}-error` : `${passwordId}-hint`}
                        value={form.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur("password")}
                        placeholder="Create a strong password"
                        className="w-full rounded-md px-3 py-2.5 pr-10 text-sm focus:outline-none"
                        style={inputStyle(!!getFieldError("password"))}
                        onFocus={(e) => handleFocus(e, !!getFieldError("password"))}
                        onBlurCapture={(e) => handleBlurCapture(e, !!getFieldError("password"))}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm"
                        style={{ color: "#94a3b8" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                  </InputField>

                  {/* Password Strength Meter */}
                  {form.password && (
                    <div className="mt-2.5" id={`${passwordId}-hint`}>
                      <div className="flex gap-1 mb-1.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-colors"
                            style={{
                              backgroundColor:
                                i <= strength.score ? strength.color : "#e2e8f0",
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {passwordRules.map((rule) => (
                            <span
                              key={rule.label}
                              className="flex items-center gap-1 text-xs"
                              style={{ color: rule.met ? "#15803d" : "#94a3b8" }}
                            >
                              {rule.met && <CheckIcon />}
                              {rule.label}
                            </span>
                          ))}
                        </div>
                        {strength.label && (
                          <span
                            className="text-xs font-medium ml-2 shrink-0"
                            style={{ color: strength.color }}
                          >
                            {strength.label}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <InputField id={confirmPasswordId} label="Confirm password" error={getFieldError("confirmPassword")}>
                  <div className="relative">
                    <input
                      id={confirmPasswordId}
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      aria-required="true"
                      aria-invalid={!!getFieldError("confirmPassword")}
                      aria-describedby={getFieldError("confirmPassword") ? `${confirmPasswordId}-error` : undefined}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Re-enter your password"
                      className="w-full rounded-md px-3 py-2.5 pr-10 text-sm focus:outline-none"
                      style={inputStyle(!!getFieldError("confirmPassword"))}
                      onFocus={(e) => handleFocus(e, !!getFieldError("confirmPassword"))}
                      onBlurCapture={(e) => handleBlurCapture(e, !!getFieldError("confirmPassword"))}
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm"
                      style={{ color: "#94a3b8" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                    >
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  </div>
                </InputField>

                {/* Terms Checkbox */}
                <div>
                  <div className="flex items-start gap-2.5">
                    <input
                      id={termsId}
                      name="terms"
                      type="checkbox"
                      checked={form.terms}
                      onChange={handleChange}
                      onBlur={() => handleBlur("terms")}
                      aria-required="true"
                      aria-invalid={!!getFieldError("terms")}
                      className="mt-0.5 w-4 h-4 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                      style={{ accentColor: "#1e3a8a", cursor: "pointer" }}
                    />
                    <label
                      htmlFor={termsId}
                      className="text-sm cursor-pointer leading-snug"
                      style={{ color: "#475569" }}
                    >
                      I agree to the{" "}
                      <a
                        href="#"
                        className="font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm"
                        style={{ color: "#2563eb" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#1e3a8a")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#2563eb")}
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm"
                        style={{ color: "#2563eb" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#1e3a8a")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#2563eb")}
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {getFieldError("terms") && (
                    <p className="mt-1.5 text-xs" style={{ color: "#b91c1c" }} role="alert">
                      {getFieldError("terms")}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || (submitted && !isValid)}
                  aria-disabled={isLoading || (submitted && !isValid)}
                  className="w-full rounded-md py-2.5 text-sm font-medium text-white flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]"
                  style={{
                    backgroundColor:
                      isLoading || (submitted && !isValid) ? "#94a3b8" : "#1e3a8a",
                    cursor: isLoading || (submitted && !isValid) ? "not-allowed" : "pointer",
                    fontFamily: "Inter, sans-serif",
                    transition: "background-color 0.15s ease",
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
                      <span>Creating account…</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Security Note */}
                <p className="text-center text-xs" style={{ color: "#94a3b8", marginTop: "-8px" }}>
                  Your data is encrypted and securely stored.
                </p>
              </form>

              {/* ── Divider ── */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full" style={{ borderTop: "1px solid #e2e8f0" }} />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs" style={{ color: "#94a3b8" }}>
                    or
                  </span>
                </div>
              </div>

              {/* ── Google Button ── */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full rounded-md py-2.5 text-sm font-medium flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]"
                style={{
                  border: "1px solid #e2e8f0",
                  color: "#0f172a",
                  backgroundColor: "#fff",
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {/* ── Sign In Link ── */}
              <p className="mt-6 text-center text-sm" style={{ color: "#475569" }}>
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-sm"
                  style={{ color: "#2563eb" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1e3a8a")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#2563eb")}
                >
                  Sign in
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
