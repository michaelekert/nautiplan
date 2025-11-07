import { apiFetch, setAccessToken } from './client'

export interface User {
  email: string
}

// Logowanie
export async function login(email: string, password: string): Promise<User> {
  const res = await apiFetch<{ auth_token: string }>('/auth', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setAccessToken(res.auth_token)
  return { email }
}

// Rejestracja
export async function register(email: string, password: string): Promise<string> {
  const res = await apiFetch<{ response: string }>('/registration', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return res.response
}

// Logout
export async function logout(): Promise<void> {
  setAccessToken(null)
}
