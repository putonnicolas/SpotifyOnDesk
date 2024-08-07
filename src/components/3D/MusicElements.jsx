import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Text, Float} from "@react-three/drei";
import ProgressBar3D from "./ProgressBar3D";


const musicElements = ({ listeningData, artistImage }) => {
  
  const Image = ({ url, position, circle, scale }) => {
    const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);

    return (
      <mesh position={position} scale={scale}>
        {circle ? <circleGeometry /> : <planeGeometry args={[5, 5]} />}
        <meshBasicMaterial map={texture} />
      </mesh>
    );
  }

  const artistsName = listeningData.item.artists.map((artist) => artist.name);
  const artists = artistsName.join(", ");

  return (
    <group position={[0, 15, -15]} scale={2}>
      {/* Image album */}
      <Float
        floatIntensity={2}
        speed={2}
      >
        <Image
          position={[-5.5, 0, 0]}
          scale={1.5}
          url={listeningData.item.album.images[0]?.url}
        />
      </Float>

      {/* Song name  */}
      <Float
        floatIntensity={0.3}
      >
        <Text
          position={[-1, 0, 0]}
          anchorX="left"
          font="./fonts/Poppins-SemiBold.ttf"
          color="white"
          fontSize={1.25}
          maxWidth={20}
        >
          {listeningData.item.name}
        </Text>
      </Float>

      {/* Artist  */}
      <Float
        floatIntensity={0.3}
      >
        <Image
          position={[-0.5, -2, 0]}
          scale={0.5}
          url={artistImage?.url}
          circle={true}
        />
        <Text
          position={[0.5, -2, 0]}
          font="./fonts/Poppins-Light.ttf"
          fontSize={0.75}
          anchorX="left"
          color="#9ca3af"
          maxWidth={5}
        >
          {artists}
        </Text>

        {/* Album name */}
        <Text
          position={[8, -2, 0]}
          font="./fonts/Poppins-ExtraLight.ttf"
          fontSize={0.75}
          anchorX="left"
          color="#9ca3af"
          maxWidth={5}

        >
          {`·   ${listeningData.item.album.name}`}
        </Text>
      </Float>

      <Float
        floatIntensity={0.1}
        speed={2.25}
      >
        <ProgressBar3D
          trackDuration={listeningData.item.duration_ms} 
          trackProgress={listeningData.progress_ms} 
          is3D={true}
        />
      </Float>
    </group>
  );
};

export default musicElements;
