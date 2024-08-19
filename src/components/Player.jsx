import React, { useEffect, useState } from 'react';
import Hero from './Hero.jsx';
import Navbar from './Navbar.jsx';
import Hero3D from './Hero3D.jsx';
import axios from 'axios';
import { useBackground } from '../context/BackgroundContext'; 
import ColorThief from 'colorthief';

const isMobileDevice = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const Player = ({ userData, token }) => {
  
  const [listeningData, setListeningData] = useState(null);
  const [artistImage, setArtistImage] = useState(null);
  const [oldArtist, setOldArtist] = useState('');
  const [isToggleDimension, setIsToggleDimension] = useState(false);
  const [backgroundColor3D, setBackgroundColor3D] = useState(null)  
  const [trackEnergy, setTrackEnergy] = useState(0)  
  const { setBackgroundColor } = useBackground(); 



  useEffect(() => {
    if (isMobileDevice()) {
      const requestFullscreen = () => {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          docEl.mozRequestFullScreen();
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        } else if (docEl.msRequestFullscreen) {
          docEl.msRequestFullscreen();
        }
      };
  
      requestFullscreen();
    }
  }, []);
  

  useEffect(() => {
    if (!token) return;

    const fetchCurrentTrack = () => {
      axios
        .get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data) {
            const newListeningData = response.data;
            setListeningData(newListeningData);
            
            const coverUrl = newListeningData.item.album.images[0]?.url;
            if (coverUrl) {
              handleBackgroundColor(coverUrl);
            }
            
            const artistName = newListeningData.item.artists[0].name;
            if (artistName !== oldArtist) {
              fetchArtistImage(newListeningData.item.artists[0]);
              setOldArtist(artistName);
            }

            if(newListeningData.item.id){
              fetchAudioFeatures(newListeningData.item.id)
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching current track', error);
        });
    };

    const fetchArtistImage = (artist) => {
      axios
        .get(`https://api.spotify.com/v1/artists/${artist.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data) {
            setArtistImage(response.data.images[0]);            
          }
        })
        .catch((error) => {
          console.error('Error fetching current artist picture', error);
        });
    };

    const fetchAudioFeatures = (id) => {      
      axios
      .get(`https://api.spotify.com/v1/audio-features/${id}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {        
        if(response.data){
          const energy = calculateEnergyScore(response.data)          
          setTrackEnergy(energy)   
        }
      })
    }

    fetchCurrentTrack()
    
    const intervalId = setInterval(fetchCurrentTrack, 10000);


    return () => {
      clearInterval(intervalId);
    };
  }, [token, oldArtist, setBackgroundColor]);

  const handleBackgroundColor = (coverUrl) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; 
    img.src = coverUrl;

    img.onload = () => {
      const colorThief = new ColorThief();
      const dominantColor = colorThief.getColor(img);      
      const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
      
      setBackgroundColor(rgbColor);
      setBackgroundColor3D(rgbColor);
    };

    img.onerror = () => {
      console.error('Error loading image');
    };
  };
  const handleFullscreenRequest = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const onToggle = () => {
    handleFullscreenRequest()
    setIsToggleDimension(t => !t)        
  }  

  return (
      <div className='player'>
        <Navbar onToggle={onToggle} isToggled={isToggleDimension}/>
        {!userData && token && <div>Loading data...</div>}
        {listeningData && !isToggleDimension ? 
        <>
          <Hero listeningData={listeningData} artistImage={artistImage} />
          <div className='flexDiv'/>
        </> : null}
        {listeningData && isToggleDimension ? <Hero3D listeningData={listeningData} artistImage={artistImage} backgroundColor={backgroundColor3D} energy={trackEnergy}/> : null}
      </div>
  );
};

export default Player;


function calculateEnergyScore(audioFeatures) {  
  const {
    energy,
    danceability,
    valence,
} = audioFeatures;

  // Weights for ponderation
  const w1 = 0.4; 
  const w2 = 0.5; 
  const w3 = 0.1; 

  const energyScore =
    (w1 * energy) +
    (w2 * danceability) +
    (w3 * valence)
  return energyScore;
}