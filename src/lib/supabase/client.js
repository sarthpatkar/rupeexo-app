import { createBrowserClient } from "@supabase/ssr"

const GLOBAL_STATE_KEY = "__RUPEEXO_SUPABASE_STATE__"

function getGlobalState() {
  const scope = globalThis

  if (!scope[GLOBAL_STATE_KEY]) {
    scope[GLOBAL_STATE_KEY] = {
      client: null,
      locks: new Map(),
    }
  }

  return scope[GLOBAL_STATE_KEY]
}

const localAuthLock = async (name, _acquireTimeout, fn) => {
  const state = getGlobalState()
  const previous = state.locks.get(name) || Promise.resolve()

  let release
  const current = new Promise((resolve) => {
    release = resolve
  })

  const chain = previous.then(() => current)
  state.locks.set(name, chain)

  await previous

  try {
    return await fn()
  } finally {
    release()
    if (state.locks.get(name) === chain) {
      state.locks.delete(name)
    }
  }
}

export function createClient() {
  const state = getGlobalState()
  if (state.client) return state.client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables")
  }

  state.client = createBrowserClient(url, key, {
    auth: {
      storageKey: "rupeexo-auth-token",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      lock: localAuthLock,
    },
  })

  return state.client
}
