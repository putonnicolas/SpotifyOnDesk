import React, { useEffect, useState } from 'react';
import Hero from './Hero.jsx';
import Navbar from './Navbar.jsx';
import Hero3D from './Hero3D.jsx';
import axios from 'axios';
import { useBackground } from '../context/BackgroundContext'; 
import ColorThief from 'colorthief';


const Player = ({ userData, token }) => {
  const [listeningData, setListeningData] = useState(null);
  const [artistImage, setArtistImage] = useState(null);
  const [oldArtist, setOldArtist] = useState('');
  const [isToggleDimension, setIsToggleDimension] = useState(true);
  const { setBackgroundColor } = useBackground(); 
  const [backgroundColor3D, setBackgroundColor3D] = useState(null)  

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

    fetchCurrentTrack();
    const intervalId = setInterval(fetchCurrentTrack, 5000);

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

  const onToggle = () => {
    setIsToggleDimension(t => !t)        
  }  

  return (
    <>
      <Navbar onToggle={onToggle} isToggled={isToggleDimension}/>
      {!userData && token && <div>Loading data...</div>}
      {listeningData && !isToggleDimension ? <Hero listeningData={listeningData} artistImage={artistImage} /> : null}
      {listeningData && isToggleDimension ? <Hero3D listeningData={listeningData} artistImage={artistImage} backgroundColor={backgroundColor3D}/> : null}
    </>
  );
};

export default Player;
