import { Canvas } from "@react-three/fiber";
import React, { useEffect, useRef, useMemo } from 'react';
import { PerspectiveCamera, OrbitControls, Environment } from "@react-three/drei";
import { useAnimations, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { useControls } from 'leva';  // Import Leva controls

const Avatar = ({ avatarUrl, avatarGender, speakerList }) => {
  const { scene } = useGLTF(`${avatarUrl}?quality=high&textureQuality=high&textureFormat=webp`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const avatarRef = useRef();
  const { animations: avatarAnimation } = useGLTF(`/animations/${avatarGender}AvatarAnimation.glb`, [avatarGender]);
  const { actions, mixer } = useAnimations(avatarAnimation, avatarRef);

  useEffect(() => {
    mixer.timeScale = 0.5;
    actions['Idle'].stop().play();
  }, [speakerList]);

  return (
    <group position={[0, -1.5, 0.1]} dispose={null} ref={avatarRef}>
      <primitive object={clone} />
    </group>
  );
}

const AvatarDisplay = ({ avatarUrl, avatarGender, speakerList }) => {
  const cameraRef = useRef();
  const directionalLightRef = useRef();

  // Leva controls to dynamically adjust the light position
  // const { x, y, z, intensity } = useControls('Directional Light', {
  //   x: { value: 3, min: -10, max: 10, step: 0.1 },
  //   y: { value: 3, min: -10, max: 10, step: 0.1 },
  //   z: { value: 3, min: -10, max: 10, step: 0.1 },
  //   intensity: { value: 1, min: 0, max: 10, step: 0.1 }
  // });

  // useEffect(() => {
  //   if (directionalLightRef.current) {
  //     directionalLightRef.current.position.set(x, y, z);
  //     directionalLightRef.current.intensity = intensity;
  //   }
  // }, [x, y, z, intensity]);

  return (
    <>
      <div className="bg-gray" style={{ display: 'grid', height: '300px', margin: '5px', border: '1px solid grey' }}>
        <Canvas shadows>
          <OrbitControls
            enableZoom={true}
            minDistance={1}
            maxDistance={1.6}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
          
          {/* Ambient Light for general lighting */}
          <ambientLight intensity={1.7} />

          {/* Directional Light for casting shadows */}
          <directionalLight
            ref={directionalLightRef}
            color={0xffffff}
            intensity={1.2}
            position={[3.9, 10.0, 10.0]} // Dynamic position based on Leva controls
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.1}
            shadow-camera-far={10}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
          />

          {/* Optional Environment (HDR or preset) for reflections */}
          {/* <Environment preset="sunset" background /> */}

          {/* Camera setup */}
          <PerspectiveCamera
            makeDefault
            position={[0, 1, 1]}
            fov={50}
            near={0.1}
            far={1000}
            ref={cameraRef}
          />

          <Avatar avatarUrl={avatarUrl} avatarGender={avatarGender} speakerList={speakerList} />
        </Canvas>
      </div>
    </>
  );
}

export default AvatarDisplay;
