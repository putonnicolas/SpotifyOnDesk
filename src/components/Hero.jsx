import React from "react";
import ProgressBar from "./ProgressBar";

const Hero = ({ listeningData, artistImage }) => {
  const artistsName = listeningData.item.artists.map((artist) => artist.name);
  const artists = artistsName.join(", ");

  return (
    <div className="hero2D">
      {/* Album image */}
      <div className="albumContainer">
        <img
          className="image"
          src={listeningData.item.album.images[0]?.url}
          alt="Album cover"
        />
      </div>

      {/* Streaming info */}
      <div className="songInfo">
        <p className="songName font-semibold text-3xl truncate-text">
          {listeningData.item.name /** Song's name */}
        </p>

        <div className="artistContainer">
          <img
            src={artistImage?.url}
            className="rounded-full size-16"
            alt="Artist"
          />
          <div className="artistAlbumInfo flex-1 truncate-text">
            <p className="artistName font-light text-gray-400 truncate-text text-xl">
              <strong>{artists}</strong> ·{" "}
              <span className="albumName font-extralight text-gray-400 truncate-text">
                {listeningData.item.album.name}
              </span>
            </p>
          </div>
        </div>

        <ProgressBar
          trackDuration={listeningData.item.duration_ms}
          trackProgress={listeningData.progress_ms}
        />
      </div>
    </div>
  );
};

export default Hero;
