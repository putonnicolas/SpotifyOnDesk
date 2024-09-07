import { useEffect, useRef } from "react"
import { extend, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { shaderMaterial } from "@react-three/drei"
import { useControls, folder } from "leva"
import gsap from "gsap"

import wallVertex from "../../shaders/wall/vertex.glsl"
import wallFragment from "../../shaders/wall/fragment.glsl"
import leftWallVertex from "../../shaders/wall/leftWall/vertex.glsl"
import leftWallFragment from "../../shaders/wall/leftWall/fragment.glsl"
import Water from "./Water"

const WallShaderMaterial = shaderMaterial(
  {
    uColor: new THREE.Color("white"),
    uLightPosition: new THREE.Vector3(0, 45, 0),
    uDirectionalLightPosition: new THREE.Vector3(0, 15, -10),
    uLightColor: new THREE.Vector3(1, 1, 1),
  },
  wallVertex,
  wallFragment
)

const LeftWallShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("white"),
    uFrequency: 0.5,
    uEnergy: 0.5,
    uLightPosition: new THREE.Vector3(0, 45, 0),
  },
  leftWallVertex,
  leftWallFragment
)

extend({ WallShaderMaterial, LeftWallShaderMaterial })

const Environment = ({ backgroundColor, energy }) => {
  const animatedBackgroundRef = useRef(new THREE.Color("#ff0000"))
  const animatedEnergyRef = useRef({ value: 0.1 })
  const gsapTimeline = useRef(gsap.timeline())

  const newColor = new THREE.Color(backgroundColor)

  const { frequency } = useControls({
    environment: folder({
      frequency: {
        value: 0.5,
        min: 0,
        max: 1000,
      },
    }),
  })

  const topWallRef = useRef()
  const leftWallRef = useRef()
  const rightWallRef = useRef()
  const backWallRef = useRef()

  const updateColor = () => {
    const color = animatedBackgroundRef.current.convertLinearToSRGB()

    if (topWallRef.current) topWallRef.current.uColor.set(color)
    if (leftWallRef.current) leftWallRef.current.uColor.set(color)
    if (rightWallRef.current) rightWallRef.current.uColor.set(color)
    if (backWallRef.current) backWallRef.current.uColor.set(color)
  }

  const updateEnergy = () => {
    if (leftWallRef.current) {
      leftWallRef.current.uEnergy = animatedEnergyRef.current.value
    }
  }

  useEffect(() => {
    const timeline = gsap.to(animatedBackgroundRef.current, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
      duration: 6,
      onUpdate: updateColor,
    })

    return () => timeline.kill() 
  }, [backgroundColor])

  useEffect(() => {
    gsapTimeline.current.clear()

    gsapTimeline.current.to(animatedEnergyRef.current, {
      value: energy,
      duration: 5,
      ease: "power2.out",
      onUpdate: updateEnergy,
    })

    return () => gsapTimeline.current.kill() 
  }, [energy])

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()

    if (leftWallRef.current) {
      leftWallRef.current.uTime = elapsedTime
      leftWallRef.current.uFrequency = frequency
    }
  })

  return (
    <>
      <Water />

      {/* Walls */}
      <group position={[0, 44, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]} scale={100} position={[-45, 0, 0]}>
          <planeGeometry args={[1, 1, 8, 8]} />
          <leftWallShaderMaterial ref={leftWallRef} />
        </mesh>

        <mesh
          rotation={[(3 * Math.PI) / 2, -Math.PI / 2, 0]}
          scale={100}
          position={[45, 0, 0]}
        >
          <planeGeometry />
          <wallShaderMaterial ref={rightWallRef} />
        </mesh>

        <mesh scale={100} position={[0, 0, -45]}>
          <planeGeometry />
          <wallShaderMaterial ref={backWallRef} />
        </mesh>

        <mesh
          rotation={[Math.PI / 2, 0, (3 * Math.PI) / 2]}
          scale={100}
          position={[0, 44, 0]}
        >
          <planeGeometry />
          <wallShaderMaterial ref={topWallRef} />
        </mesh>
      </group>
    </>
  )
}

export default Environment
