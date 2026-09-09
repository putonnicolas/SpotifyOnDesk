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
          <div className="image bg-gray-800 flex items-center justify-center text-gray-500">
            No Cover
          </div>
        )}
      </div>

      {/* Streaming info */}
      <div className="songInfo">
        <p className="songName font-semibold text-3xl truncate-text">
          {songName}
        </p>

        <div className="artistContainer">
          {artistImage?.url ? (
            <img
              src={artistImage.url}
              className="rounded-full size-16 object-cover"
              alt="Artist"
            />
          ) : (
            <div className="rounded-full size-16 bg-gray-700 flex items-center justify-center text-xs text-gray-400">
              Artist
            </div>
          )}
          <div className="artistAlbumInfo flex-1 truncate-text">
            <p className="artistName font-light text-gray-400 truncate-text text-xl">
              <strong>{artists}</strong>
              {albumName && (
                <>
                  {" · "}
                  <span className="albumName font-extralight text-gray-400 truncate-text">
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
