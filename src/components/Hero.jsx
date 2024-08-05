import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import axios from "axios";

const Hero = ({listeningData, artistImage}) => {
  const artistsName = listeningData.item.artists.map(artist => artist.name);
  const artists = artistsName.join(', '); 

  return (
    <section className="flex-1 mt-40">
      <div className="flex flex-col my-5 ml-5 mr-5">
        <div className="flex flex-row mt-5 ml-5">
          <img className='rounded-xl select-none' src={listeningData.item.album.images[0]?.url} width={340}/>
          <div className="mt-5 ml-5 flex flex-col flex-1">
            <div className="flex-1"/>
            <div className="ml-3 ">
              
              <p className="font-semibold text-6xl">{listeningData.item.name}</p> 
              
              <div className="flex-col items-center justify-center mt-5">
                <div className="flex space-x-4 items-center">
                  <img src={artistImage?.url} className="flex rounded-full size-10 select-none"/>
                  <p className="font-light text-xl flex-1 text-gray-400"><strong>{artists}</strong> · <span className="font-extralight text-lg text-gray-400">{listeningData.item.album.name}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ProgressBar trackDuration={listeningData.item.duration_ms} trackProgress={listeningData.progress_ms}/>
      </div>
    </section>
  )
}

export default Hero;
