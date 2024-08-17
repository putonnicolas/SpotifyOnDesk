import { navLists } from '../constants';
import ToggleButton from './ToggleButton.jsx'


const Navbar = ({ onToggle }) => {
  return (
    <>
      <header className="border py-5 sm:px-10 px-5 z-20 h-auto">
        <div className="flex justify-between items-center">
          <nav className="flex w-full items-center">
            <img src="./logo/spotify.png" alt="Spotify Logo" width={50} className="mr-4 select-none" />
            <div className="flex items-center">
              {navLists.map((nav) => (
                <div key={nav} className="px-5 cursor-pointer text-white font-semibold select-none">
                  <a href="https://github.com/putonnicolas/SpotifyOnDesk/" target="_blank" rel="noopener noreferrer">{nav}</a>
                </div>
              ))}
            </div>
            <div className="flex-grow"></div>
            <ToggleButton onToggle={onToggle}/>
          </nav>
        </div>
        <div className="mt-5 pr-10 pl-10 w-full">
          <div className="relative w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"/>
        </div>
      </header>
    </>
  );
};


export default Navbar;
