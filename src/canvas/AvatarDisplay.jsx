import { Canvas, useThree} from "@react-three/fiber";
import React, { useEffect, useRef, useState, useMemo } from 'react'
import {PerspectiveCamera,ContactShadows,OrbitControls } from "@react-three/drei";
import { Leva } from "leva";
import { AnimationEditor } from "./components/AnimationEditor";
import { Podcast2 } from "./components/Scenes/PodcastScene2";
import { Podcast1 } from "./components/Scenes/PodcastScene1";
import { ScriptEditPage } from "./pages/ScriptEditPage";
import { PodcastTransition } from "./components/Scenes/PodcastTransition";
import { PlayerController } from './hooks/usePlayer'
import { useGraph, useFrame} from '@react-three/fiber'
import { useAnimations, useGLTF , useFBX} from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'
import { AlignVerticalBottomRounded } from "@mui/icons-material";
import { useProjectInfo } from "../utility/ProjectContext";

const Avatar = ({avatarUrl,avatarGender}) => {
    const { scene } = useMemo(() => useGLTF(avatarUrl));
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);
    const avatarRef = useRef();
    const {speakerList} = useProjectInfo();
    const {animations : avatarAnimation} = useGLTF(`animations/${avatarGender}AvatarAnimation.glb`);
    const {actions, mixer,names} = useAnimations(avatarAnimation,avatarRef);
    useEffect(() => {
        actions['Idle'].stop().play();

        return () => {
        }
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


const AvatarDisplay = ({avatarUrl,avatarGender}) => {
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
    <ambientLight intensity={0.7}/>
      <directionalLight 
        color={0xffffff} 
        intensity={0.5} 
        position={[0,1,1]}
        // position={[-1.5, 15.9, -3.7]} 
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
      <Avatar avatarUrl={avatarUrl} avatarGender={avatarGender}/>
    </Canvas>
    </div>
    </>
  );
}

export default AvatarDisplay;
