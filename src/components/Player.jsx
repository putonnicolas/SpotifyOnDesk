import React, { useEffect, useState, useRef } from 'react'
import Hero from './Hero.jsx'
import Navbar from './Navbar.jsx'
import Hero3D from './Hero3D.jsx'
import { useBackground } from '../context/BackgroundContext' 
import NoCurrentMusic from './NoCurrentMusic.jsx'
import ColorThief from 'colorthief'
import { spotifyApi } from '../services/spotifyAuth'
import { searchDemoTracks } from '../services/demoSearch'

const Player = ({
  token,
  onLogout,
  isDemo = false,
  demoTracks = [],
  demoIndex = 0,
  onSelectDemoIndex,
  onExitDemo,
}) => {
  const [listeningData, setListeningData] = useState(null)
  const [artistImage, setArtistImage] = useState(null)
  const [oldArtist, setOldArtist] = useState('')
  const [isToggleDimension, setIsToggleDimension] = useState(false)
  const [backgroundColor3D, setBackgroundColor3D] = useState(null)  
  const [trackEnergy, setTrackEnergy] = useState(0.5)  
  const { setBackgroundColor } = useBackground() 

  // Search feature in Demo Mode
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [customTrack, setCustomTrack] = useState(null)
  const searchTimeoutRef = useRef(null)

  const handleBackgroundColor = (coverUrl) => {
    if (!coverUrl) return
    const img = new Image()
    img.crossOrigin = 'Anonymous' 
    img.src = coverUrl

    img.onload = () => {
      try {
        const colorThief = new ColorThief()
        const dominantColor = colorThief.getColor(img)      
        const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
        
        setBackgroundColor(rgbColor)
        setBackgroundColor3D(rgbColor)
      } catch (e) {
        console.warn('ColorThief error:', e)
      }
    }

    img.onerror = () => {
      console.warn('Error loading image for ColorThief:', coverUrl)
    }
  }

  // Handle Search input change with debounce
  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchQuery(val)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (!val.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchDemoTracks(val)
      setSearchResults(results)
      setIsSearching(false)
    }, 350)
  }

  const handleSelectSearchResult = (track) => {
    setCustomTrack(track)
    setListeningData(track)
    setArtistImage(track.artistImage)
    setTrackEnergy(track.energy || 0.5)

    const coverUrl = track.item?.album?.images?.[0]?.url
    if (coverUrl) {
      handleBackgroundColor(coverUrl)
    }

    setShowSearch(false)
    setSearchQuery('')
    setSearchResults([])
  }

  // Effect for Demo Mode (Quick picks)
  useEffect(() => {
    if (!isDemo || demoTracks.length === 0) return
    if (customTrack) return // Keep custom searched track active until user picks another

    const track = demoTracks[demoIndex]
    if (track) {
      setListeningData(track)
      setArtistImage(track.artistImage)
      setTrackEnergy(track.energy || 0.5)

      const coverUrl = track.item?.album?.images?.[0]?.url
      if (coverUrl) {
        handleBackgroundColor(coverUrl)
      }
    }
  }, [isDemo, demoIndex, demoTracks, customTrack])

  // Effect for Live Spotify Web API Mode
  useEffect(() => {
    if (isDemo || !token) return

    const fetchCurrentTrack = () => {
      spotifyApi
        .get('/me/player/currently-playing')
        .then((response) => {
          if (response.status === 204 || !response.data || !response.data.item) {
            setListeningData(null)
            return
          }

          const newListeningData = response.data
          setListeningData(newListeningData)
          
          const coverUrl = newListeningData.item.album?.images?.[0]?.url
          if (coverUrl) {
            handleBackgroundColor(coverUrl)
          }
          
          const firstArtist = newListeningData.item.artists?.[0]
          if (firstArtist && firstArtist.name !== oldArtist) {
            fetchArtistImage(firstArtist)
            setOldArtist(firstArtist.name)
          }

          if (newListeningData.item.id) {
            fetchAudioFeatures(newListeningData.item.id)
          }
        })
        .catch((error) => {
          console.error('Error fetching current track:', error?.response?.data || error)
          if (error.response && error.response.status === 401 && onLogout) {
            onLogout()
          }
        })
    }

    const fetchArtistImage = (artist) => {
      if (!artist?.id) return
      spotifyApi
        .get(`/artists/${artist.id}`)
        .then((response) => {
          if (response.data?.images?.[0]) {
            setArtistImage(response.data.images[0])            
          }
        })
        .catch((error) => {
          console.warn('Error fetching current artist picture', error?.response?.status || error)
        })
    }

    const fetchAudioFeatures = (id) => {      
      spotifyApi
        .get(`/audio-features/${id}`)
        .then((response) => {        
          if (response.data) {
            const energy = calculateEnergyScore(response.data)          
            setTrackEnergy(energy)   
          }
        })
        .catch(() => {
          console.warn('Audio features endpoint restricted by Spotify (403), using fallback energy')
          setTrackEnergy(0.5)
        })
    }

    fetchCurrentTrack()
    const intervalId = setInterval(fetchCurrentTrack, 10000)

    return () => clearInterval(intervalId)
  }, [isDemo, token, oldArtist])

  const onToggle = () => {
    setIsToggleDimension(t => !t)        
  }  

  return (
    <div className='player relative'>
      <Navbar onToggle={onToggle} isToggled={isToggleDimension}/>
      
      { !listeningData && <NoCurrentMusic/>}

      {listeningData && !isToggleDimension && (
        <Hero listeningData={listeningData} artistImage={artistImage} />
      )}

      {listeningData && isToggleDimension && (
        <Hero3D
          listeningData={listeningData}
          artistImage={artistImage}
          backgroundColor={backgroundColor3D}
          energy={trackEnergy}
        />
      )}

      {/* Floating Demo Toolbar for recruiters & visitors */}
      {isDemo && (
        <>
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-black/85 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-center gap-2.5 max-w-[95vw]">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider text-green-400 font-semibold">
                Démo
              </span>
            </div>

            <div className="h-4 w-px bg-white/20 hidden sm:block" />

            {/* Live Search Trigger Button */}
            <button
              onClick={() => setShowSearch(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all duration-200 flex items-center gap-1.5 select-none"
            >
              <span>🔍</span>
              <span className="font-medium">Chercher un titre...</span>
            </button>

            <div className="h-4 w-px bg-white/20 hidden sm:block" />

            {/* Quick Picks */}
            <div className="flex flex-wrap items-center gap-1">
              {demoTracks.map((track, idx) => {
                const isSelected = !customTrack && idx === demoIndex
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      setCustomTrack(null)
                      onSelectDemoIndex(idx)
                    }}
                    className={`text-xs px-2.5 py-1.5 rounded-lg transition-all duration-200 select-none ${
                      isSelected
                        ? 'bg-white text-black font-semibold shadow'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {track.item.name}
                  </button>
                )
              })}
            </div>

            <div className="h-4 w-px bg-white/20 hidden sm:block" />

            {onExitDemo && (
              <button
                onClick={onExitDemo}
                className="text-xs text-gray-400 hover:text-white underline underline-offset-2 transition-colors select-none"
              >
                Quitter
              </button>
            )}
          </div>

          {/* Interactive Search Modal */}
          {showSearch && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#181818] border border-white/20 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔍</span>
                    <h3 className="font-semibold text-white text-base">
                      Rechercher n'importe quelle musique
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowSearch(false)}
                    className="text-gray-400 hover:text-white p-1 rounded-lg text-lg select-none"
                  >
                    ✕
                  </button>
                </div>

                {/* Input */}
                <div className="p-4 border-b border-white/10">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Tapez un titre ou un artiste (ex: Daft Punk, Queen, Billie Eilish...)"
                    autoFocus
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 text-sm"
                  />
                  <p className="text-[11px] text-gray-400 mt-2">
                    💡 Recherche en direct sans compte ni clé API avec pochettes HD et extraction de couleur automatique.
                  </p>
                </div>

                {/* Results List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {isSearching && (
                    <div className="text-center py-8 text-gray-400 text-sm animate-pulse">
                      Recherche en cours...
                    </div>
                  )}

                  {!isSearching && searchQuery && searchResults.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Aucun morceau trouvé pour cette recherche.
                    </div>
                  )}

                  {!isSearching && searchResults.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => handleSelectSearchResult(result)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors duration-150 select-none group"
                    >
                      <img
                        src={result.item.album.images[0]?.url}
                        alt="cover"
                        className="w-12 h-12 rounded-lg object-cover shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate group-hover:text-green-400 transition-colors">
                          {result.item.name}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {result.item.artists[0]?.name} · {result.item.album.name}
                        </p>
                      </div>
                      <span className="text-xs text-green-400 font-medium px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                        Charger
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Player

function calculateEnergyScore(audioFeatures) {  
  const { energy = 0.5, danceability = 0.5, valence = 0.5 } = audioFeatures

  const w1 = 0.4 
  const w2 = 0.5 
  const w3 = 0.1 

  return (w1 * energy) + (w2 * danceability) + (w3 * valence)
}
