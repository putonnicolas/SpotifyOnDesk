import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

const Hero = ({listeningData}) => {
  const artistsName = listeningData.item.artists.map(artist => artist.name);
  const artists = artistsName.join(', '); // Crée une chaîne avec des noms séparés par des virgules

  return (
    <section className="flex-1">
      <div className="flex flex-col my-5 ml-5 mr-5">
        <div className="flex flex-row mt-5 ml-5">
          <img className='rounded-xl' src={listeningData.item.album.images[0]?.url} width={340}/>
          <div className="mt-5 ml-5 flex flex-col flex-1">
            <div className="flex-1"/>
            <div className="ml-3">
              <p className="font-semibold text-6xl">{listeningData.item.name}</p> 
              <p className="font-light text-xl mt-3 text-gray-400"><strong>{artists}</strong> · <span className="font-extralight text-lg mt-3 text-gray-400">{listeningData.item.album.name}</span></p>
            </div>
          </div>
        </div>
        <ProgressBar trackDuration={listeningData.item.duration_ms} trackProgress={listeningData.progress_ms}/>
      </div>
    </section>
  )
}

export default Hero;
