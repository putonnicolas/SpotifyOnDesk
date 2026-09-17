import React, { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import LoginSpotify from './components/LoginSpotify'
import Player from './components/Player'
import { BackgroundProvider, useBackground } from './context/BackgroundContext'
import { gsap } from 'gsap'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import {
  getValidAccessToken,
  handleAuthCallback,
  logout,
  spotifyApi,
} from './services/spotifyAuth'
import { demoTracks } from './constants/demoTracks'

const App = () => {
  const [token, setToken] = useState(null)
  const [userData, setUserData] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)
  const [demoIndex, setDemoIndex] = useState(0)

  const { backgroundColor, setBackgroundColor } = useBackground()
  const backgroundRef = useRef(null)

  const handleLogout = () => {
    logout()
    setToken(null)
    setUserData(null)
    setBackgroundColor('#1f1f1f')
  }

  const handleStartDemo = () => {
    setIsDemo(true)
  }

  const handleExitDemo = () => {
    setIsDemo(false)
    setBackgroundColor('#1f1f1f')
  }

  // Ensure background resets to default neutral gray on menu
  useEffect(() => {
    if (!token && !isDemo) {
      setBackgroundColor('#1f1f1f')
    }
  }, [token, isDemo, setBackgroundColor])

  const authInitializedRef = useRef(false)

  // Handle OAuth callback or restore session on mount
  useEffect(() => {
    if (authInitializedRef.current) return
    authInitializedRef.current = true

    const initAuth = async () => {
      setAuthLoading(true)
      setAuthError(null)

      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const errorParam = urlParams.get('error')

      if (errorParam) {
        setAuthError(`Spotify error: ${errorParam}`)
        window.history.replaceState({}, document.title, window.location.pathname)
        setAuthLoading(false)
        return
      }

      if (code) {
        // Clean URL query parameters immediately
        window.history.replaceState({}, document.title, window.location.pathname)
        try {
          const accessToken = await handleAuthCallback(code)
          setToken(accessToken)
        } catch (err) {
          console.error('Error during Spotify auth callback:', err)
          setAuthError(err.message || 'Failed to exchange authentication code')
        } finally {
          setAuthLoading(false)
        }
        return
      }

      // Check for stored active or refreshable token
      try {
        const storedToken = await getValidAccessToken()
        if (storedToken) {
          setToken(storedToken)
        }
      } catch (err) {
        console.error('Error recovering stored token:', err)
      } finally {
        setAuthLoading(false)
      }
    }

    initAuth()
  }, [])

  // Periodically ensure token stays refreshed
  useEffect(() => {
    if (!token) return

    const intervalId = setInterval(async () => {
      const activeToken = await getValidAccessToken()
      if (activeToken && activeToken !== token) {
        setToken(activeToken)
      } else if (!activeToken) {
        handleLogout()
      }
    }, 4 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [token])

  // Optional background user profile check (non-blocking)
  useEffect(() => {
    if (token) {
      spotifyApi
        .get('/me')
        .then((response) => {
          setUserData(response.data)
        })
        .catch((error) => {
          console.warn('User profile /me endpoint returned error:', error?.response?.status || error)
          if (error.response && error.response.status === 401) {
            handleLogout()
          }
        })
    }
  }, [token])

  const currentRgbRef = useRef({ r: 31, g: 31, b: 31 })

  useEffect(() => {
    if (!backgroundRef.current || !backgroundColor) return

    let targetR = 31
    let targetG = 31
    let targetB = 31

    try {
      const c = new THREE.Color(backgroundColor)
      targetR = Math.round(c.r * 255)
      targetG = Math.round(c.g * 255)
      targetB = Math.round(c.b * 255)
    } catch (e) {
      // fallback to neutral
    }

    const tween = gsap.to(currentRgbRef.current, {
      r: targetR,
      g: targetG,
      b: targetB,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: () => {
        const { r, g, b } = currentRgbRef.current
        if (backgroundRef.current) {
          backgroundRef.current.style.backgroundImage = `linear-gradient(to top right, #121212, rgb(${Math.round(
            r
          )}, ${Math.round(g)}, ${Math.round(b)}))`
        }
      },
    })

    return () => tween.kill()
  }, [backgroundColor])

  return (
    <div className="min-h-screen text-white relative">
      <div
        ref={backgroundRef}
        className="absolute inset-0"
        style={{
          backgroundColor: '#121212',
          backgroundImage: 'linear-gradient(to top right, #121212, #1f1f1f)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {token || isDemo ? (
        <Player
          token={token}
          onLogout={handleLogout}
          isDemo={isDemo}
          demoTracks={demoTracks}
          demoIndex={demoIndex}
          onSelectDemoIndex={setDemoIndex}
          onExitDemo={handleExitDemo}
        />
      ) : (
        <div className="relative z-10 min-h-screen flex flex-col justify-between">
          <Navbar showButton={false} />
          <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            {authLoading ? (
              <p className="text-gray-400 animate-pulse text-lg">
                Connecting to Spotify...
              </p>
            ) : (
              <LoginSpotify error={authError} onStartDemo={handleStartDemo} />
            )}
          </main>
          <Footer />
        </div>
      )}
    </div>
  )
}

const Root = () => (
  <BackgroundProvider>
    <App />
  </BackgroundProvider>
)

export default Root
