import * as THREE from "three"
import { Text, Float} from "@react-three/drei"
import ProgressBar3D from "./ProgressBar3D"
import { useLoader } from "@react-three/fiber"
import { useEffect } from "react"


const musicElements = ({ listeningData, artistImage }) => {  

  const Image = ({ texture, position, circle, scale }) => {
    return (
      <mesh position={position} scale={scale}>
        {circle ? <circleGeometry args={[2, 32]} /> : <planeGeometry args={[5, 5]} />}
        <meshBasicMaterial map={texture} />
      </mesh>
    )
  }

  /**
   * Text
   */
  
  const artistsName = listeningData.item.artists.map((artist) => artist.name)
  const artists = artistsName.join(", ")
  
  const songName = listeningData.item.name
  const albumName = '  ·  ' + listeningData.item.album.name
  
  const fontSize = 0.75
  const charWidth = 0.5 * fontSize
  const artistsTextWidth = artists.length > 15 ? 18 * charWidth : artists.length * charWidth
  
  /**
   *  Textures
   */
  
  const albumURL = listeningData.item.album.images[0]?.url || ''
  const artistURL = artistImage ? artistImage.url : ''

  const albumTexture = useLoader(THREE.TextureLoader, albumURL)
  const artistTexture = artistURL ? useLoader(THREE.TextureLoader, artistURL) : ''

  useEffect(() => {
    return () => {
      albumTexture.dispose()
      artistURL ? artistTexture.dispose() : null
    }
  }, [albumTexture, artistTexture])


  return (
    <group position={[0, 15, -10]} scale={2}>
      {/* Image album */}
      <Float
        floatIntensity={2}
        speed={2}
      >
        <Image
          position={[-5.5, 0, 0]}
          scale={1.5}
          texture={albumTexture}
        />
      </Float>

      <group position={[1,0,0]} >
        {/* Song name  */}
        <Float
          floatIntensity={0.3}
        >
          <Text
            position={[-1, 0.5, 0]}
            anchorX="left"
            font="./fonts/Poppins-SemiBold.ttf"
            color="white"
            fontSize={1.25}
            maxWidth={20}
          >
            {songName.length > 25 ? songName.slice(0,25) + '...' : songName}
          </Text>
        </Float>

        {/* Artist  */}
        <Float
          floatIntensity={0.3}
        >
          <Image
            texture={artistTexture}
            position={[-0.5, -2, 0]}
            scale={0.5}
            circle={true}
          />
          <Text
            position={[1.5, -2, 0]}
            font="./fonts/Poppins-Light.ttf"
            fontSize={0.75}
            anchorX="left"
            color="#9ca3af"
            maxWidth={8}
          >
            {artists.length > 18 ? artists.slice(0,15) + '...': artists }
          </Text>

          {/* Album name */}
          <Text
            position={[1.5 + artistsTextWidth, -2, 0]}
            font="./fonts/Poppins-ExtraLight.ttf"
            fontSize={0.75}
            anchorX="left"
            color="#9ca3af"
            maxWidth={10}

          >
            {`${albumName.length > 23 ? albumName.slice(0, 20) + '...' : albumName }`}
          </Text>
        </Float>
      </group>

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
  )
}

export default musicElements
