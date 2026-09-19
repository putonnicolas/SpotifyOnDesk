import { navLists } from '../constants'
import ToggleButton from './ToggleButton.jsx'

const Navbar = ({ onToggle, isToggled, showButton = true }) => {
  return (
    <header className={`w-full py-3 sm:py-5 sm:px-10 px-4 z-20 top-0 left-0 ${showButton ? '' : 'absolute'} ${isToggled ? 'absolute' : 'flex-navbar'}`}>
      <div className="flex justify-between items-center">
        <nav className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <img src="./logo/spotify.png" alt="Spotify Logo" width={38} className="sm:w-[48px] select-none" />
            <div className="flex items-center">
              {navLists.map((nav) => (
                <div key={nav} className="px-2 sm:px-5 cursor-pointer text-white font-semibold text-sm sm:text-base select-none">
                  <a href="https://github.com/putonnicolas/SpotifyOnDesk/" target="_blank" rel="noopener noreferrer">{nav}</a>
                </div>
              ))}
            </div>
          </div>
          {showButton && <ToggleButton onToggle={onToggle}/>}
        </nav>
      </div>
      <div className="mt-3 sm:mt-5 px-2 sm:px-10 w-full">
        <div className="relative w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"/>
      </div>
    </header>
  )
}

export default Navbar
