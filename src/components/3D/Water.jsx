import { useRef, useMemo, useEffect } from "react"
import * as THREE from 'three'
import { extend, useThree, useFrame, useLoader } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import { useControls, folder } from "leva"

import waterReflectionVertex from "../../shaders/waterReflection/vertex.glsl"
import waterReflectionFragment from "../../shaders/waterReflection/fragment.glsl"

const FloorShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("black"),
    uLightPosition: new THREE.Vector3(0, 45, 0),
    uDirectionalLightPosition: new THREE.Vector3(0, 15, -10),
    uLightColor: new THREE.Vector3(1, 1, 1),
    uWavesStrength: 0.1,
    uMoveFactor: 0,
    tDiffuse: null,
    tDudv: null,
    tNormal: null,
  },
  waterReflectionVertex,
  waterReflectionFragment
)

extend({ FloorShaderMaterial })

const Water = () => {
  const { wavesStrength } = useControls({
    waves: folder({
      wavesStrength: 0.05,
    }),
  })

  const floorRef = useRef()

  const dudvTexture = useMemo(() => {
    const texture = useLoader(THREE.TextureLoader, './3D/water/waterDUDV.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    return texture
  }, [])

  const normalTexture = useMemo(() => {
    return useLoader(THREE.TextureLoader, './3D/water/normal.png')
  }, [])

  const { gl: renderer, scene, camera } = useThree()

  const renderTargetA = useMemo(() => new THREE.WebGLRenderTarget(1024, 1024), []);
  const renderTargetB = useMemo(() => new THREE.WebGLRenderTarget(1024, 1024), []);
  let currentTarget = renderTargetA;
  let previousTarget = renderTargetB;
  
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
  
    if (floorRef.current) {
      floorRef.current.uTime = elapsedTime;
      floorRef.current.uMoveFactor = (elapsedTime * 0.015) % 1;
  
      renderer.setRenderTarget(currentTarget);
      renderer.clear()
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
  
      const diffuseTexture = previousTarget.texture;
      diffuseTexture.colorSpace = THREE.LinearSRGBColorSpace;
      floorRef.current.tDiffuse = diffuseTexture;
  
      [currentTarget, previousTarget] = [previousTarget, currentTarget];
  
      renderer.render(scene, camera);
    }
  });

  useEffect(() => {
    if (floorRef.current) {
      floorRef.current.tDudv = dudvTexture
      floorRef.current.tNormal = normalTexture
    }
  }, [dudvTexture, normalTexture])

  useEffect(() => {
    if (floorRef.current) {
      floorRef.current.uWavesStrength = wavesStrength
    }
  }, [wavesStrength])

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={100} position={[0, -5, 0]}>
        <planeGeometry args={[1, 1, 8, 8]} />
        <floorShaderMaterial ref={floorRef} />
      </mesh>
    </>
  )
}

export default Water
