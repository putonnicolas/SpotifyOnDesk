import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { PlaneGeometry } from 'three'
import * as THREE from 'three'
import { Text, Float, OrbitControls, Html } from '@react-three/drei'


const Hero3D = ({listeningData, artistImage}) => {
  const artistsName = listeningData.item.artists.map(artist => artist.name);
  const artists = artistsName.join(', '); 

  const Image = ({ url, position, circle, scale }) => {
    const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);
    
    return ( 
      <mesh position={position} scale={scale}>
        {circle ? <circleGeometry/>  :  <planeGeometry args={[5,5]}/>}
        <meshBasicMaterial map={texture}/>
      </mesh>
    )
  };

  return (
    <div className='w-full h-full fixed top-0 left-0 z-10'>
      <Canvas style={{ width: '100%', height: '100%' }} camera={{position: [0, 0, 20], fov:60}}>
        <OrbitControls/>
        <ambientLight intensity={1.2}/>
        <mesh rotation={[-Math.PI /2, 0, 0]} scale={100} position={[0,-5,0]}>
          <planeGeometry />
          <meshStandardMaterial/>
        </mesh>

        {/* Image album */}
        <Float>
          <Image position={[-5.5,0,0]} scale={1.5} url={listeningData.item.album.images[0]?.url}/> 
        </Float>

        {/* Song name  */}
        <Float>
          <Text position={[-1,0,0]} anchorX="left" font='./fonts/Poppins-SemiBold.ttf' fontSize={1.25}>
            {listeningData.item.name}
          </Text>
        </Float>

        {/* Artist  */}
        <Float>
          <Image position={[-0.5,-2,0]} scale={0.5} url={artistImage?.url} circle={true}/>
          <Text position={[0.5, -2,0 ]} font='./fonts/Poppins-Light.ttf' fontSize={0.75} anchorX="left">
            {artists}
          </Text>
          <Text position={[8,-2,0]} font='./fonts/Poppins-ExtraLight.ttf' fontSize={0.75} anchorX="left">
            
            {`·   ${listeningData.item.album.name}`}
          </Text>
        </Float>

        {/* Album name */}
        
      </Canvas>
    </div>
  )
}

export default Hero3D