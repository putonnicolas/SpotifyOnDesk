import axios from 'axios'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || (window.location.origin + window.location.pathname)

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-currently-playing',
  'user-read-playback-state',
]

/**
 * Generate a random string for PKCE code verifier
 */
function generateRandomString(length = 64) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

/**
 * Hash string with SHA-256
 */
async function sha256(plain) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

/**
 * Base64-URL encode an ArrayBuffer
 */
function base64UrlEncode(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Redirect user to Spotify authorization page with PKCE challenge
 */
export async function redirectToSpotifyAuth() {
  if (!CLIENT_ID) {
    console.error('VITE_SPOTIFY_CLIENT_ID is not configured in .env')
    alert('VITE_SPOTIFY_CLIENT_ID is missing in your environment variables (.env).')
    return
  }

  const verifier = generateRandomString(64)
  const challenge = base64UrlEncode(await sha256(verifier))

  localStorage.setItem('spotify_code_verifier', verifier)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: SCOPES.join(' '),
    show_dialog: 'true',
  })

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
}

/**
 * Store token data into localStorage
 */
export function storeTokens(data) {
  if (data.access_token) {
    localStorage.setItem('spotify_access_token', data.access_token)
  }
  if (data.refresh_token) {
    localStorage.setItem('spotify_refresh_token', data.refresh_token)
  }
  if (data.expires_in) {
    // Keep a 60 seconds safety buffer before expiration
    const expiresAt = Date.now() + (data.expires_in - 60) * 1000
    localStorage.setItem('spotify_token_expires_at', expiresAt.toString())
  }
}

/**
 * Exchange the authorization code returned by Spotify for tokens
 */
export async function handleAuthCallback(code) {
  const verifier = localStorage.getItem('spotify_code_verifier')
  if (!verifier) {
    throw new Error('Code verifier missing from localStorage. Please try logging in again.')
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  })

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error_description || data.error || 'Failed to exchange authorization code')
  }

  localStorage.removeItem('spotify_code_verifier')
  storeTokens(data)
  return data.access_token
}

export function getStoredAccessToken() {
  return localStorage.getItem('spotify_access_token')
}

export function getStoredRefreshToken() {
  return localStorage.getItem('spotify_refresh_token')
}

export function isTokenExpired() {
  const expiresAt = localStorage.getItem('spotify_token_expires_at')
  if (!expiresAt) return false
  return Date.now() > parseInt(expiresAt, 10)
}

/**
 * Refresh the access token using the stored refresh_token
 */
export async function refreshAccessToken() {
  const refreshToken = getStoredRefreshToken()
  if (!refreshToken) {
    logout()
    return null
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Failed to refresh token:', data)
      logout()
      return null
    }

    storeTokens(data)
    return data.access_token
  } catch (error) {
    console.error('Network error while refreshing token:', error)
    return null
  }
}

/**
 * Get an active access token, refreshing it if needed
 */
export async function getValidAccessToken() {
  let token = getStoredAccessToken()
  if (!token) return null

  if (isTokenExpired()) {
    token = await refreshAccessToken()
  }
  return token
}

/**
 * Clear all Spotify authentication credentials
 */
export function logout() {
  localStorage.removeItem('spotify_access_token')
  localStorage.removeItem('spotify_refresh_token')
  localStorage.removeItem('spotify_token_expires_at')
  localStorage.removeItem('spotify_code_verifier')
  localStorage.removeItem('spotifyAccessToken') // Clean legacy key
}

/**
 * Axios instance configured for Spotify Web API with auto-auth and token refresh
 */
export const spotifyApi = axios.create({
  baseURL: 'https://api.spotify.com/v1',
})

// Request interceptor: always inject valid Bearer token
spotifyApi.interceptors.request.use(async (config) => {
  const token = await getValidAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: automatically retry on 401 after token refresh
spotifyApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newToken = await refreshAccessToken()
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return spotifyApi(originalRequest)
      }
    }
    return Promise.reject(error)
  }
)
