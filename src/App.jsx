import React, { useEffect, useState } from 'react';
import LoginSpotify from './components/LoginSpotify';
import axios from 'axios';
import Player from './components/Player';
import { BackgroundProvider, useBackground } from './context/BackgroundContext.jsx';

const App = () => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const { backgroundColor } = useBackground(); // Obtenir la couleur de fond depuis le contexte

  const handleLogin = (accessToken) => {    
    setToken(accessToken);
    localStorage.setItem('spotifyAccessToken', accessToken); 
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('spotifyAccessToken');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {      
      axios
        .get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user data', error);
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('spotifyAccessToken');
            setToken(null);
          }
        });
    }
  }, [token]);

  return (
    <div 
      className="min-h-screen text-white flex flex-col" 
      style={{ 
        background: `linear-gradient(to top right, #121212, ${backgroundColor || '#1f1f1f'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!token && <LoginSpotify onLogin={handleLogin} />}
      <div className='flex-1'>
        {token && userData && <Player userData={userData} token={token} />}
      </div>
    </div>
  );
};

const Root = () => (
  <BackgroundProvider>
    <App />
  </BackgroundProvider>
);

export default Root;
