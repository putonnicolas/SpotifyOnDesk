import React from "react"

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <p className="text-left w-1/3 flex-1 font-light ml-4">
          <i>"Spotify on Desk" </i> is a personal, non-commercial project and is not
          affiliated with <a style={{textDecoration : 'underline', textUnderlineOffset: '0.2em'} } href="https://www.spotify.com/fr/">Spotify</a><br /> It simply uses the Spotify API. No
          user information is stored.
        </p>
        <div className="Links">
          <ul>
            <li>
              <a href="https://github.com/putonnicolas">GitHub</a>
            </li>
            <li className="unavailable">
              <a href="">LinkedIn</a>
            </li>
            <li className="unavailable">
              <a href="">Portfolio</a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}

export default Footer
