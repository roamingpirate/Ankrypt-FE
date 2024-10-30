import { Canvas} from "@react-three/fiber";
import React, { useEffect, useRef, useMemo } from 'react'
import {PerspectiveCamera,OrbitControls } from "@react-three/drei";
import { useAnimations, useGLTF} from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { useProjectInfo } from "../utility/ProjectContext";

const Avatar = ({avatarUrl,avatarGender,speakerList}) => {
    const { scene } = useMemo(() => useGLTF(avatarUrl), [avatarUrl]);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const avatarRef = useRef();
    const {animations : avatarAnimation} = useGLTF(`/animations/${avatarGender}AvatarAnimation.glb`,[avatarGender]);
    const {actions} = useAnimations(avatarAnimation,avatarRef);

    useEffect(() => {
        actions['Idle'].stop().play();
    },[speakerList]);

    return (
        <group
          position={[0,-1.5,0.1]}
          dispose={null}
          ref={avatarRef}
        >
          <primitive object={clone}/>
        </group>
      );
    
}


const AvatarDisplay = ({avatarUrl,avatarGender,speakerList}) => {
  const cameraRef = useRef();
  return (
    <>
    <div style={{display:'grid',height:'300px',margin:'5px',backgroundColor:'white',border:'1px solid grey'}}>
    <Canvas shadows>
    <OrbitControls 
        enableZoom={true}
        minDistance={1}
        maxDistance={1.6}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}/>
    <ambientLight intensity={2}/>
      <directionalLight 
        color={0xffffff} 
        intensity={0.8} 
        position={[0,1,1]}
        castShadow 
      />
    <PerspectiveCamera
        makeDefault
        position={[0, 0, 2]}
        fov={50}
        near={0.1}
        far={1000}
        ref={cameraRef}
      />
      <Avatar avatarUrl={avatarUrl} avatarGender={avatarGender} speakerList={speakerList}/>
    </Canvas>
    </div>
    </>
  );
}

export default AvatarDisplay;
