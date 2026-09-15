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
    uColor: new THREE.Color("#121212"),
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
    uColor: new THREE.Color("#121212"),
    uFrequency: 0.5,
    uEnergy: 0.5,
    uLightPosition: new THREE.Vector3(0, 45, 0),
  },
  leftWallVertex,
  leftWallFragment
)

extend({ WallShaderMaterial, LeftWallShaderMaterial })

const Environment = ({ backgroundColor, energy }) => {
  const currentColorRef = useRef(new THREE.Color(backgroundColor || "#121212"))
  const tweenObj = useRef({
    r: currentColorRef.current.r,
    g: currentColorRef.current.g,
    b: currentColorRef.current.b,
  })

  const animatedEnergyRef = useRef({ value: energy || 0.1 })

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
    currentColorRef.current.setRGB(
      tweenObj.current.r,
      tweenObj.current.g,
      tweenObj.current.b
    )

    // Convert a clone so currentColorRef itself isn't mutated in place repeatedly
    const srgbColor = currentColorRef.current.clone().convertLinearToSRGB()

    if (topWallRef.current) topWallRef.current.uColor.set(srgbColor)
    if (leftWallRef.current) leftWallRef.current.uColor.set(srgbColor)
    if (rightWallRef.current) rightWallRef.current.uColor.set(srgbColor)
    if (backWallRef.current) backWallRef.current.uColor.set(srgbColor)
  }

  // Set initial colors on mount
  useEffect(() => {
    updateColor()
  }, [])

  // Smooth color transition
  useEffect(() => {
    if (!backgroundColor) return
    const target = new THREE.Color(backgroundColor)

    const tween = gsap.to(tweenObj.current, {
      r: target.r,
      g: target.g,
      b: target.b,
      duration: 2.0,
      ease: "power1.inOut",
      onUpdate: updateColor,
    })

    return () => tween.kill()
  }, [backgroundColor])

  // Smooth wave energy transition
  useEffect(() => {
    const tween = gsap.to(animatedEnergyRef.current, {
      value: energy,
      duration: 2.0,
      ease: "power1.inOut",
      onUpdate: () => {
        if (leftWallRef.current) {
          leftWallRef.current.uEnergy = animatedEnergyRef.current.value
        }
      },
    })

    return () => tween.kill()
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

      {/* Walls Box - exact original position and proportions */}
      <group position={[0, 44, 0]}>
        {/* Left Wall with Perlin noise waves */}
        <mesh rotation={[0, Math.PI / 2, 0]} scale={100} position={[-45, 0, 0]}>
          <planeGeometry args={[1, 1, 8, 8]} />
          <leftWallShaderMaterial ref={leftWallRef} />
        </mesh>

        {/* Right Wall */}
        <mesh
          rotation={[(3 * Math.PI) / 2, -Math.PI / 2, 0]}
          scale={100}
          position={[45, 0, 0]}
        >
          <planeGeometry />
          <wallShaderMaterial ref={rightWallRef} />
        </mesh>

        {/* Back Wall */}
        <mesh scale={100} position={[0, 0, -45]}>
          <planeGeometry />
          <wallShaderMaterial ref={backWallRef} />
        </mesh>

        {/* Top Wall */}
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
