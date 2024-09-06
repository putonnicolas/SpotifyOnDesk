import { useRef, useState, useEffect } from 'react'
import { Text } from "@react-three/drei"

import capsuleVertex from "../../shaders/capsule/vertex.glsl"
import capsuleFragment from "../../shaders/capsule/fragment.glsl"
import { extend, useFrame } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"

const CapsuleShaderMaterial = shaderMaterial(
  { uProgress: 0 },
  capsuleVertex,
  capsuleFragment
)

extend({ CapsuleShaderMaterial })

const ProgressBar3D = ({ trackDuration, trackProgress}) => {
  const [progress, setProgress] = useState(trackProgress)

  useEffect(() => {
    setProgress(trackProgress)
  }, [trackProgress])

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + 1000, trackDuration)
        return newProgress
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [trackDuration])

  const capsuleShaderRef = useRef()

  useFrame(() => {
    if (capsuleShaderRef.current) {
      capsuleShaderRef.current.uProgress = progress / trackDuration
    }
  })

  return (
    <group position={[0,-4, 0]}>
      <Text
        position={[-10, -2, 0]}
        font="./fonts/Poppins-Light.ttf"
        fontSize={0.75}
        anchorX="left"
        color="#ffffff"
      >
        {formatTime(progress)}
      </Text>
      <Text
        position={[10, -2, 0]}
        font="./fonts/Poppins-Light.ttf"
        fontSize={0.75}
        anchorX="right"
        color="#ffffff"
      >
        {formatTime(trackDuration)}
      </Text>      
      <mesh rotation={[0, 0, - Math.PI / 2]} position={[0, -3, 0]}>
        <capsuleGeometry args={[0.25, 20, 5, 15]} />
        <capsuleShaderMaterial ref={capsuleShaderRef} />
      </mesh>
    </group>
  )
}

export default ProgressBar3D