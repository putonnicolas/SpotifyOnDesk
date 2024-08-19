import React, { useEffect, useState, useRef } from 'react';
import LoginSpotify from './components/LoginSpotify';
import axios from 'axios';
import Player from './components/Player';
import { BackgroundProvider, useBackground } from './context/BackgroundContext';
import { gsap } from 'gsap';

const App = () => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const { backgroundColor } = useBackground(); 
  const backgroundRef = useRef(null); 

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

  useEffect(() => {
    if (backgroundRef.current) {      
      gsap.to(backgroundRef.current, {
        duration: 2,
        backgroundImage: `linear-gradient(to top right, #121212, ${backgroundColor})`,
        ease: "power1.inOut",
      });
    }
  }, [backgroundColor]);

  return (
    <>
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
          
        {token && userData && <Player userData={userData} token={token} />}

        <div className="relative z-10 flex-1">
          {!token && <LoginSpotify onLogin={handleLogin} />}
        </div>
      </div>
    </>
  );
};

const Root = () => (
  <BackgroundProvider>
    <App />
  </BackgroundProvider>
);

export default Root;
