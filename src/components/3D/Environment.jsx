import { useEffect, useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial, MeshReflectorMaterial } from "@react-three/drei";

import { useControls } from "leva";

import waterReflectionVertex from "../../shaders/waterReflection/vertex.glsl";
import waterReflectionFragment from "../../shaders/waterReflection/fragment.glsl";
import wallVertex from "../../shaders/wall/vertex.glsl";
import wallFragment from "../../shaders/wall/fragment.glsl";
import leftWallVertex from "../../shaders/wall/leftWall/vertex.glsl";
import leftWallFragment from "../../shaders/wall/leftWall/fragment.glsl";

const Environment = ({ backgroundColor }) => {

  const { frequency, amplitude } = useControls({
    frequency: {
      value: 0.5,
      min: 0,
      max: 1000,
    },

    amplitude: {
      value:5,
      min: 0,
      max: 30,
      step: 1,
    },
  });

  const floorRef = useRef();
  const leftWallRef = useRef();
  const rightWallRef = useRef();
  const backWallRef = useRef();

  const FloorShaderMaterial = shaderMaterial(
    { uTime: 0, color: new THREE.Color("grey") },
    waterReflectionVertex,
    waterReflectionFragment
  );

  const WallShaderMaterial = shaderMaterial(
    {
      uTime: 0,
      uColor: new THREE.Color("white"),
    },
    wallVertex,
    wallFragment
  );

  const LeftWallShaderMaterial = shaderMaterial(
    {
      uTime: 0,
      uColor: new THREE.Color("white"),
      uFrequency: 0.5,
      uAmplitude: 5.0,
    },
    leftWallVertex,
    leftWallFragment
  );

  extend({ FloorShaderMaterial, WallShaderMaterial, LeftWallShaderMaterial })

  useFrame(({ clock }) => {
    if (floorRef.current) {
      floorRef.current.uTime = clock.getElapsedTime();
    }

    const color = new THREE.Color(backgroundColor).convertLinearToSRGB();

    if (leftWallRef.current) {
      leftWallRef.current.uTime = clock.getElapsedTime()
      leftWallRef.current.uFrequency = frequency
      leftWallRef.current.uAmplitude = amplitude
    }

    if (rightWallRef.current) {
      rightWallRef.current.uTime = clock.getElapsedTime();
      rightWallRef.current.uColor.set(color);
    }

    if (backWallRef.current) {
      backWallRef.current.uTime = clock.getElapsedTime();
      backWallRef.current.uColor.set(color);
    }
  });

  useEffect(() => {
    
    if (leftWallRef.current) {
      const color = new THREE.Color(backgroundColor).convertLinearToSRGB();
      leftWallRef.current.uColor.set(color)
    }
  }, [backgroundColor])

  return (
    <>
      <ambientLight intensity={10} />

      <pointLight position={[0, 10, 0]} intensity={100}/>

      {/* Floor*/}
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={100} position={[0, -5, 0]}>
        <planeGeometry />
        {/* <floorShaderMaterial ref={floorRef}/> */}
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={0.3}
          mixStrength={80}
          roughness={1.0}
          depthScale={1.5}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#040404"
          metalness={0.2}
        />
      </mesh>
      {/* walls */}

      <mesh rotation={[0, Math.PI / 2, 0]} scale={100} position={[-45, 44, 0]}>
        <planeGeometry args={[1, 1, 64, 64]} />
        <leftWallShaderMaterial ref={leftWallRef}/>
        {/* <meshStandardMaterial wireframe/> */}
      </mesh>

      <mesh
        rotation={[(3 * Math.PI) / 2, -Math.PI / 2, 0]}
        scale={100}
        position={[45, 44, 0]}
      >
        <planeGeometry />
        <wallShaderMaterial ref={rightWallRef} />
      </mesh>

      <mesh scale={100} position={[0, 44, -45]}>
        <planeGeometry />
        <wallShaderMaterial ref={backWallRef} />
      </mesh>
    </>
  );
};

export default Environment;
