import React, { useEffect, useState } from 'react';
import Hero from './Hero';
import Navbar from './Navbar';
import axios from 'axios';
import { useBackground } from '../context/BackgroundContext'; // Importer le contexte
import ColorThief from 'colorthief';

const Player = ({ userData, token }) => {
  const [listeningData, setListeningData] = useState(null);
  const { setBackgroundColor } = useBackground(); // Obtenir la fonction pour mettre à jour la couleur de fond

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
            setListeningData(response.data);

            const coverUrl = response.data.item.album.images[0]?.url;
            if (coverUrl) {
              handleBackgroundColor(coverUrl);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching current track', error);
        });
    };

    fetchCurrentTrack();

    const intervalId = setInterval(fetchCurrentTrack, 5000);

    return () => clearInterval(intervalId);
  }, [token, setBackgroundColor]);

  // Fonction pour gérer la couleur de fond
  const handleBackgroundColor = (coverUrl) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Permet le chargement d'images de domaines externes
    img.src = coverUrl;

    img.onload = () => {
      const colorThief = new ColorThief();
      const dominantColor = colorThief.getColor(img);
      const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
      setBackgroundColor(rgbColor);
    };

    img.onerror = () => {
      console.error('Error loading image');
    };
  };

  return (
    <>
      <Navbar />
      {!userData && token && <div>Loading data...</div>}
      {listeningData ? <Hero listeningData={listeningData} /> : ''}
    </>
  );
};

export default Player;
