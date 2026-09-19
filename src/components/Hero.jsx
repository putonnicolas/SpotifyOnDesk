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
      {/* Album image */}
      <div className="albumContainer">
        {albumImage ? (
          <img
            className="image"
            src={albumImage}
            alt="Album cover"
          />
        ) : (
          <div className="image bg-gray-800 flex items-center justify-center text-gray-500 aspect-square w-60 rounded-xl">
            No Cover
          </div>
        )}
      </div>

      {/* Streaming info */}
      <div className="songInfo">
        <p className="songName font-semibold text-2xl sm:text-3xl truncate-text text-center md:text-left">
          {songName}
        </p>

        <div className="artistContainer flex items-center justify-center md:justify-start gap-3 sm:gap-4 my-2 sm:my-3">
          {artistImage?.url ? (
            <img
              src={artistImage.url}
              className="rounded-full size-12 sm:size-16 object-cover flex-shrink-0"
              alt="Artist"
            />
          ) : (
            <div className="rounded-full size-12 sm:size-16 bg-gray-700 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
              Artist
            </div>
          )}
          <div className="artistAlbumInfo flex-1 min-w-0 truncate-text">
            <p className="artistName font-light text-gray-400 truncate-text text-sm sm:text-lg">
              <strong className="text-white font-medium">{artists}</strong>
              {albumName && (
                <>
                  {" · "}
                  <span className="albumName font-extralight text-gray-400">
                    {albumName}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {item?.duration_ms && (
          <ProgressBar
            trackDuration={item.duration_ms}
            trackProgress={listeningData.progress_ms || 0}
          />
        )}
      </div>
    </div>
  )
}

export default Hero
