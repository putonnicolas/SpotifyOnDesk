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
  // Store the interpolated color in a single persistent THREE.Color
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

  const applyUniformColors = () => {
    currentColorRef.current.setRGB(
      tweenObj.current.r,
      tweenObj.current.g,
      tweenObj.current.b
    )

    if (topWallRef.current?.uColor) topWallRef.current.uColor.copy(currentColorRef.current)
    if (leftWallRef.current?.uColor) leftWallRef.current.uColor.copy(currentColorRef.current)
    if (rightWallRef.current?.uColor) rightWallRef.current.uColor.copy(currentColorRef.current)
    if (backWallRef.current?.uColor) backWallRef.current.uColor.copy(currentColorRef.current)
  }

  // Set initial colors on mount
  useEffect(() => {
    applyUniformColors()
  }, [])

  // Smooth color tweening without mutating or converting in-place
  useEffect(() => {
    if (!backgroundColor) return
    const target = new THREE.Color(backgroundColor)

    const tween = gsap.to(tweenObj.current, {
      r: target.r,
      g: target.g,
      b: target.b,
      duration: 2.5,
      ease: "power2.out",
      onUpdate: applyUniformColors,
    })

    return () => tween.kill()
  }, [backgroundColor])

  // Smooth energy score tweening
  useEffect(() => {
    const tween = gsap.to(animatedEnergyRef.current, {
      value: energy,
      duration: 2.5,
      ease: "power2.out",
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
      {/* Lights */}
      <directionalLight
        position={[0, 45, 0]}
        intensity={1}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Walls */}
      {/* Top Wall */}
      <mesh position={[0, 45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100, 1, 1]} />
        <wallShaderMaterial ref={topWallRef} />
      </mesh>

      {/* Left Wall (Noise + Dynamic Energy) */}
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        position={[-50, 0, 0]}
        scale={[1, 1, 1]}
      >
        <planeGeometry args={[100, 100, 1, 1]} />
        <leftWallShaderMaterial ref={leftWallRef} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 0, -50]}>
        <planeGeometry args={[100, 100, 1, 1]} />
        <wallShaderMaterial ref={backWallRef} />
      </mesh>

      {/* Right Wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[50, 0, 0]}>
        <planeGeometry args={[100, 100, 1, 1]} />
        <wallShaderMaterial ref={rightWallRef} />
      </mesh>

      {/* Reflective Water Floor */}
      <Water />
    </>
  )
}

export default Environment
