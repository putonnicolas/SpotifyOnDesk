import { useEffect, useState }from 'react';
import { navLists, dimensionList } from '../constants';

const Navbar = () => {

  const [currentDimension, setcurrentDimension] = useState(2)

  return (
    <>
      <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center">
        <nav className="flex w-full items-center">
          <img src="./logo/spotify.png" alt="Spotify Logo" width={50} className="mr-4" />
          <div className="flex items-center">
            {navLists.map((nav) => (
              <div key={nav} className="px-5 cursor-pointer text-white">
                {nav}
              </div>
            ))}
          </div>
          <div className="flex-grow"></div>
          <button className="dimension-btn-container">
            {
              dimensionList.map(({ label, value }) => (
                <span key={label} className="dimenstion-btn" style={{ backgroundColor: currentDimension === value ? 'white' : 'transparent', color: currentDimension === value ? 'black' : 'white'}} onClick={() => setcurrentDimension(value)}>
                  {label}
                </span>   
              ))}
          </button>
        </nav>
      </header>
      <hr className="fade-out-hr" />
    </>
  );
};

export default Navbar;
