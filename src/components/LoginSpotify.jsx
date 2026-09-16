import React from 'react'
import { redirectToSpotifyAuth } from '../services/spotifyAuth'

const LoginSpotify = ({ error, onStartDemo }) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto text-center">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm w-full text-left">
          <p className="font-semibold mb-1">Information API Spotify :</p>
          <p>{error}</p>
        </div>
      )}

      {/* Recruiter / Visitor Notice */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm text-sm text-gray-300 leading-relaxed shadow-lg w-full">
        <div className="flex items-center justify-center gap-2 mb-2 text-white font-medium text-base">
          <span>✨</span>
          <span>Espace Découverte & Portfolio</span>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm">
          Pour des raisons de sécurité, l'API Spotify restreint les applications en mode développement à une liste fermée d'utilisateurs. 
          <br className="hidden sm:block" />
          Le <strong>Mode Démo</strong> vous permet de tester immédiatement l'intégralité du projet (visualisation 2D, shaders 3D Three.js, extraction de couleurs ColorThief, animations GSAP) sans nécessiter de compte Spotify.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        {/* Instant Demo Button */}
        <button
          onClick={onStartDemo}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all duration-300 select-none cursor-pointer flex items-center justify-center gap-2"
        >
          <span>🚀</span>
          <span>Explorer en Mode Démo</span>
        </button>

        {/* Live Spotify OAuth Button */}
        <button
          onClick={redirectToSpotifyAuth}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1DB954] hover:bg-[#1aa34a] text-black font-semibold shadow-lg shadow-green-500/20 hover:scale-105 transition-all duration-300 select-none cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Connect with Spotify</span>
        </button>
      </div>
    </div>
  )
}

export default LoginSpotify
