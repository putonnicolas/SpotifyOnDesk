import { useEffect } from 'react'

const clientId = 'aecb385327ac4193ba946575ba6fd2e2'
// const redirectUri = 'http://localhost:4000/'
const redirectUri = 'https://spotify-on-desk.vercel.app/'
const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-currently-playing',
  'user-read-playback-state',
]


const LoginSpotify = ({ onLogin }) => {
  const handleLogin = () => {
    const authEndpoint = 'https://accounts.spotify.com/authorize'
    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
      '%20'
    )}&response_type=token&show_dialog=true`

    window.location.href = authUrl
  }

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.substring(1))
    const token = params.get('access_token')
    
    if (token) {      
      onLogin(token)
      window.history.pushState({}, null, '/')
    }
  }, [onLogin])

  return (
    <>
      <div className="flexButtonContainer">
        <button
          onClick={handleLogin}
          className="glowing bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 select-none"
        >
          Connect with <span className='Spotify'>Spotify</span>
        </button>
      </div>
    </>
  )
}

export default LoginSpotify

