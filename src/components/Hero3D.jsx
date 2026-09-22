import React, { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Leva } from "leva"

import Environment from "./3D/Environment.jsx"
import MusicElements from "./3D/MusicElements.jsx"
import Loading from "./3D/Loading.jsx"

const Hero3D = ({ listeningData, artistImage, backgroundColor, energy }) => {
  const [cameraZ, setCameraZ] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 62 : 40
  )

  useEffect(() => {
    const handleResize = () => {
      setCameraZ(window.innerWidth < 768 ? 62 : 40)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <Leva collapsed hidden />
      <div className="w-full h-full fixed top-0 left-0 z-0">
        <Suspense fallback={<Loading />}>
          <Canvas
            style={{ width: "100%", height: "100%" }}
            camera={{ position: [0, 6, cameraZ], fov: 60, rotation: [0, 0, 0] }}
          >
            <Environment backgroundColor={backgroundColor} energy={energy} />
            <MusicElements
              listeningData={listeningData}
              artistImage={artistImage}
            />
          </Canvas>
        </Suspense>
      </div>
    </>
  )
}

export default Hero3D
