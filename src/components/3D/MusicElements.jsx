import * as THREE from "three"
import { Text, Float } from "@react-three/drei"
import ProgressBar3D from "./ProgressBar3D"
import { useLoader } from "@react-three/fiber"
import { useEffect } from "react"

const TextureImage = ({ url, position, scale, circle }) => {
  const texture = useLoader(THREE.TextureLoader, url)

  useEffect(() => {
    return () => {
      texture?.dispose()
    }
  }, [texture])

  return (
    <mesh position={position} scale={scale}>
      {circle ? <circleGeometry args={[2, 32]} /> : <planeGeometry args={[5, 5]} />}
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

const MusicElements = ({ listeningData, artistImage }) => {
  const item = listeningData?.item
  const artistsName = item?.artists?.map((artist) => artist.name) || []
  const artists = artistsName.join(", ") || "Unknown Artist"

  const songName = item?.name || "Unknown Track"
  const albumName = item?.album?.name ? `  ·  ${item.album.name}` : ""

  const fontSize = 0.75
  const charWidth = 0.5 * fontSize
  const artistsTextWidth =
    artists.length > 15 ? 18 * charWidth : artists.length * charWidth

  const albumURL = item?.album?.images?.[0]?.url || ""
  const artistURL = artistImage?.url || ""

  return (
    <group position={[0, 15, -10]} scale={2}>
      {/* Image album */}
      {albumURL && (
        <Float floatIntensity={2} speed={2}>
          <TextureImage
            position={[-5.5, 0, 0]}
            scale={1.5}
            url={albumURL}
          />
        </Float>
      )}

      <group position={[1, 0, 0]}>
        {/* Song name */}
        <Float floatIntensity={0.3}>
          <Text
            position={[-1, 0.5, 0]}
            anchorX="left"
            font="./fonts/Poppins-SemiBold.ttf"
            color="white"
            fontSize={1.25}
            maxWidth={20}
          >
            {songName.length > 25 ? songName.slice(0, 25) + "..." : songName}
          </Text>
        </Float>

        {/* Artist */}
        <Float floatIntensity={0.3}>
          {artistURL && (
            <TextureImage
              url={artistURL}
              position={[-0.5, -2, 0]}
              scale={0.5}
              circle={true}
            />
          )}
          <Text
            position={[1.5, -2, 0]}
            font="./fonts/Poppins-Light.ttf"
            fontSize={0.75}
            anchorX="left"
            color="#9ca3af"
            maxWidth={8}
          >
            {artists.length > 18 ? artists.slice(0, 15) + "..." : artists}
          </Text>
          <Text
            position={[1.5 + artistsTextWidth, -2, 0]}
            font="./fonts/Poppins-ExtraLight.ttf"
            fontSize={0.75}
            anchorX="left"
            color="#9ca3af"
            maxWidth={10}
          >
            {albumName.length > 20
              ? albumName.slice(0, 20) + "..."
              : albumName}
          </Text>
        </Float>

        {item?.duration_ms && (
          <ProgressBar3D
            trackDuration={item.duration_ms}
            trackProgress={listeningData.progress_ms || 0}
          />
        )}
      </group>
    </group>
  )
}

export default MusicElements
