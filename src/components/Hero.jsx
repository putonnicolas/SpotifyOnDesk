import React from "react";
import ProgressBar from "./ProgressBar";

const Hero = ({ listeningData, artistImage }) => {
  const artistsName = listeningData.item.artists.map((artist) => artist.name);
  const artists = artistsName.join(", ");

  return (
    <> 
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between border p-5">
        <img
          className="rounded-xl select-none max-w-full sm:w-1/3 sm:max-w-xs"
          src={listeningData.item.album.images[0]?.url}
          alt="Album cover"
        />
        <div className="mt-5 sm:mt-0 sm:ml-5 flex flex-col flex-1">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-3xl sm:text-4xl lg:text-5xl">
              {listeningData.item.name}
            </p>
            <div className="mt-5 flex items-center space-x-4 justify-center sm:justify-start">
              <img
                src={artistImage?.url}
                className="rounded-full w-10 h-10 select-none"
                alt="Artist"
              />
              <p className="font-light text-lg text-gray-400">
                <strong>{artists}</strong> ·{" "}
                <span className="font-extralight text-gray-400">
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
      </section>
    </>
  );
};

export default Hero;
