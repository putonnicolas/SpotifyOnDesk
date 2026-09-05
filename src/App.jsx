import React, { useEffect, useState, useRef } from 'react'
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

const App = () => {
  const [token, setToken] = useState(null)
  const [userData, setUserData] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const { backgroundColor } = useBackground()
  const backgroundRef = useRef(null)

  const handleLogout = () => {
    logout()
    setToken(null)
    setUserData(null)
  }

  // Handle OAuth callback or restore session on mount
  useEffect(() => {
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
    }, 4 * 60 * 1000) // check every 4 minutes

    return () => clearInterval(intervalId)
  }, [token])

  // Fetch current user profile whenever token is available
  useEffect(() => {
    if (token) {
      spotifyApi
        .get('/me')
        .then((response) => {
          setUserData(response.data)
        })
        .catch((error) => {
          console.error('Error fetching user data', error)
          if (error.response && error.response.status === 401) {
            handleLogout()
          }
        })
    }
  }, [token])

  useEffect(() => {
    if (backgroundRef.current) {
      gsap.to(backgroundRef.current, {
        duration: 2,
        backgroundImage: `linear-gradient(to top right, #121212, ${backgroundColor})`,
        ease: 'power1.inOut',
      })
    }
  }, [backgroundColor])

  return (
    <div className="min-h-screen text-white relative">
      <div
        ref={backgroundRef}
        className="absolute inset-0"
        style={{
          background: `#121212`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {token && userData && (
        <Player userData={userData} token={token} onLogout={handleLogout} />
      )}

      <div className="relative z-10 flex-1">
        {!token && (
          <div className="home">
            <Navbar showButton={false} />
            {authLoading ? (
              <div className="flexButtonContainer">
                <p className="text-gray-400 animate-pulse text-lg">
                  Connecting to Spotify...
                </p>
              </div>
            ) : (
              <LoginSpotify error={authError} />
            )}
            <Footer />
          </div>
        )}
      </div>
    </div>
  )
}

const Root = () => (
  <BackgroundProvider>
    <App />
  </BackgroundProvider>
)

export default Root
