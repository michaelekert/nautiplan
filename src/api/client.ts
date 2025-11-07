const BASE_URL = 'http://localhost:3000' // Twój backend Rails

let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
  if (token) {
    localStorage.setItem('accessToken', token)
  } else {
    localStorage.removeItem('accessToken')
  }
}

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || response.statusText)
  }

  return response.json() as Promise<T>
}
