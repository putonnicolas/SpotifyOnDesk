import React, { useEffect, useState } from 'react'
import Hero from './Hero.jsx'
import Navbar from './Navbar.jsx'
import Hero3D from './Hero3D.jsx'
import { useBackground } from '../context/BackgroundContext' 
import NoCurrentMusic from './NoCurrentMusic.jsx'
import ColorThief from 'colorthief'
import { spotifyApi } from '../services/spotifyAuth'

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

  // Effect for Demo Mode
  useEffect(() => {
    if (!isDemo || demoTracks.length === 0) return

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
  }, [isDemo, demoIndex, demoTracks])

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
        .catch((error) => {
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

      {/* Floating Demo Toolbar for recruiters */}
      {isDemo && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-2xl flex flex-wrap items-center justify-center gap-3 max-w-[95vw]">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-green-400 font-semibold">
              Mode Démo
            </span>
          </div>

          <div className="h-4 w-px bg-white/20 hidden sm:block" />

          <div className="flex flex-wrap items-center gap-1.5">
            {demoTracks.map((track, idx) => {
              const isSelected = idx === demoIndex
              return (
                <button
                  key={track.id}
                  onClick={() => onSelectDemoIndex(idx)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 select-none ${
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
              Quitter la démo
            </button>
          )}
        </div>
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
