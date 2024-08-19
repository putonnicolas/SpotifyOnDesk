import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Leva } from "leva";

import Environment from "./3D/Environment.jsx";
import MusicElements from "./3D/MusicElements.jsx";
import Loading from "./3D/Loading.jsx";

const Hero3D = ({ listeningData, artistImage, backgroundColor, energy }) => {
  return (
    <>
      <Leva collapsed hidden />
      <div className="w-full h-full fixed top-0 left-0 z-0">
        <Suspense fallback={<Loading />}>
        <Canvas
          style={{ width: "100%", height: "100%" }}
          camera={{ position: [0, 6, 40], fov: 60, rotation: [0, 0, 0] }}
        >
          {/* <Perf position="bottom-left" hidden /> */}
          {/* <OrbitControls /> */}
            <Environment backgroundColor={backgroundColor} energy={energy} />
            <MusicElements
              listeningData={listeningData}
              artistImage={artistImage}
            />
        </Canvas>
          </Suspense>
      </div>
    </>
  );
};

export default Hero3D;
