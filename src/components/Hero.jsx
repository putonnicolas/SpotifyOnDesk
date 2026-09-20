import React from "react"
import ProgressBar from "./ProgressBar"

const Hero = ({ listeningData, artistImage }) => {
  const item = listeningData?.item
  const artistsName = item?.artists?.map((artist) => artist.name) || []
  const artists = artistsName.join(", ") || "Unknown Artist"

  const albumImage = item?.album?.images?.[0]?.url
  const songName = item?.name || "Unknown Track"
  const albumName = item?.album?.name || ""

  return (
    <div className="hero2D">
      <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4">
        {/* Top: Album cover + Song & Artist Info */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full">
          {/* Album cover */}
          <div className="albumContainer">
            {albumImage ? (
              <img
                className="image"
                src={albumImage}
                alt="Album cover"
              />
            ) : (
              <div className="image bg-gray-800 flex items-center justify-center text-gray-500 rounded-2xl w-48 h-48 md:w-60 md:h-60 aspect-square shadow-2xl">
                No Cover
              </div>
            )}
          </div>

          {/* Streaming info */}
          <div className="songInfo text-center md:text-left">
            <p className="songName font-semibold text-2xl sm:text-3xl lg:text-4xl text-white truncate-text">
              {songName}
            </p>

            <div className="artistContainer flex items-center justify-center md:justify-start gap-3 sm:gap-4 my-2 sm:my-3">
              {artistImage?.url ? (
                <img
                  src={artistImage.url}
                  className="rounded-full size-12 sm:size-14 object-cover flex-shrink-0 shadow"
                  alt="Artist"
                />
              ) : (
                <div className="rounded-full size-12 sm:size-14 bg-gray-700 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                  Artist
                </div>
              )}
              <div className="artistAlbumInfo min-w-0 truncate-text">
                <p className="artistName font-light text-gray-400 truncate-text text-sm sm:text-base md:text-lg">
                  <strong className="text-white font-medium">{artists}</strong>
                  {albumName && (
                    <>
                      {" · "}
                      <span className="albumName font-extralight text-gray-300">
                        {albumName}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Progress Bar spanning neatly underneath the cover & info */}
        {item?.duration_ms && (
          <div className="w-full mt-6 sm:mt-8">
            <ProgressBar
              trackDuration={item.duration_ms}
              trackProgress={listeningData.progress_ms || 0}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Hero
