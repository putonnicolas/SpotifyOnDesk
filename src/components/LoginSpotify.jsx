import React from 'react'
import { redirectToSpotifyAuth } from '../services/spotifyAuth'

const LoginSpotify = ({ error }) => {
  return (
    <div className="flexButtonContainer flex-col items-center gap-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm max-w-md text-center">
          {error}
        </div>
      )}
      <button
        onClick={redirectToSpotifyAuth}
        className="glowing bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 select-none"
      >
        Connect with <span className="Spotify">Spotify</span>
      </button>
    </div>
  )
}

export default LoginSpotify
