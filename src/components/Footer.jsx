import React from "react"

const Footer = () => {
  return (
    <footer className="footer w-[calc(100%-2rem)] mx-4 my-4 p-4 sm:px-8 bg-[#212121] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-400 box-border z-10">
      <p className="text-center sm:text-left font-light leading-relaxed max-w-xl">
        <i className="text-gray-200">"Spotify on Desk"</i> is a personal, non-commercial project and is not
        affiliated with{" "}
        <a
          className="underline underline-offset-2 hover:text-white transition-colors"
          href="https://www.spotify.com/fr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Spotify
        </a>
        .<br />
        It simply uses the Spotify API. No user information is stored.
      </p>
      <div className="Links">
        <ul className="flex items-center gap-4 sm:gap-6 justify-center">
          <li>
            <a
              href="https://github.com/putonnicolas"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline underline-offset-4"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/nicolas-puton/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline underline-offset-4"
            >
              LinkedIn
            </a>
          </li>
          <li className="unavailable text-gray-500 line-through decoration-emerald-500 decoration-wavy">
            Portfolio
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
