import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Footer from './components/Footer.jsx'


function App() {
  return (
    <main className="bg-gradient-to-t from-[#121212] to-[#1f1f1f] text-white">
      <Navbar/>
      <Hero/>
      <Footer/>      
    </main>
  )
}

export default App
