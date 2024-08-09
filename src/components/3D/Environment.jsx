import { useEffect, useRef, useState } from "react";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { useControls } from "leva";
import gsap from "gsap";
import _ from "lodash"


import waterReflectionVertex from "../../shaders/waterReflection/vertex.glsl";
import waterReflectionFragment from "../../shaders/waterReflection/fragment.glsl";
import wallVertex from "../../shaders/wall/vertex.glsl";
import wallFragment from "../../shaders/wall/fragment.glsl";
import leftWallVertex from "../../shaders/wall/leftWall/vertex.glsl";
import leftWallFragment from "../../shaders/wall/leftWall/fragment.glsl";

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
    uEnergy: 0.5,
  },
  leftWallVertex,
  leftWallFragment
);

extend({ FloorShaderMaterial, WallShaderMaterial, LeftWallShaderMaterial });


const Environment = ({ backgroundColor, energy }) => {  
  
  const animatedBackgroundRef = useRef(new THREE.Color('#121212'));
  const animatedEnergyRef = useRef({ value: 0 });
  const gsapTimeline = useRef(gsap.timeline());

  const newColor = new THREE.Color(backgroundColor)

  const { frequency } = useControls({
    frequency: {
      value: 0.5,
      min: 0,
      max: 1000,
    }
  });

  const floorRef = useRef();
  const leftWallRef = useRef();
  const rightWallRef = useRef();
  const backWallRef = useRef();

  const updateColor = () => {

    const color = animatedBackgroundRef.current.convertLinearToSRGB();
    
    if (leftWallRef.current) {
      leftWallRef.current.uColor.set(color);
    }

    if (rightWallRef.current) {
      rightWallRef.current.uColor.set(color);
    }

    if (backWallRef.current) {
      backWallRef.current.uColor.set(color);
    }
  };

  const updateEnergy = () => {    
    if (leftWallRef.current) {
      leftWallRef.current.uEnergy = animatedEnergyRef.current.value;
    }
  }

  const throttledUpdateEnergy = useRef(    
    _.throttle(updateEnergy, 100) 
  ).current;

  useEffect(() => {
    gsap.to(animatedBackgroundRef.current, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
      duration: 6,
      onUpdate: updateColor,  
    });
  }, [backgroundColor]);


  useEffect(() => {
    gsapTimeline.current.clear();

    gsapTimeline.current.to(animatedEnergyRef.current, {
      value: energy,
      duration: 5,
      ease: "power2.out",
      onUpdate: updateEnergy,
    });
  }, [energy]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    if (floorRef.current) {
      floorRef.current.uTime = elapsedTime;
    }

    if (leftWallRef.current) {
      leftWallRef.current.uTime = elapsedTime;
      leftWallRef.current.uFrequency = frequency;
    }

    if (rightWallRef.current) {
      rightWallRef.current.uTime = elapsedTime;
    }

    if (backWallRef.current) {
      backWallRef.current.uTime = elapsedTime;
    }
  });

  return (
    <>
      <ambientLight intensity={10} />

      <pointLight position={[0, 10, 0]} intensity={100} />

      {/* Floor*/}
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={100} position={[0, -5, 0]}>
        <planeGeometry />
        {/* <floorShaderMaterial ref={floorRef}/> */}
        <meshBasicMaterial />
      </mesh>
      {/* walls */}

      <mesh rotation={[0, Math.PI / 2, 0]} scale={100} position={[-45, 44, 0]}>
        <planeGeometry args={[1, 1, 64, 64]} />
        <leftWallShaderMaterial ref={leftWallRef} />
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
