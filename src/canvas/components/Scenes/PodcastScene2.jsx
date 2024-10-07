import { Environment, OrbitControls, Sky, ContactShadows, useGLTF, PerspectiveCamera, useAnimations, useFBX } from "@react-three/drei";
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { useControls } from "leva";
import { Scene } from "three";
import sceneConfig from "../../data/sceneConfig";
import { useEffect, useRef, useState } from "react";
import { act } from "react";
import { Avatar } from "../Avatar";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import { usePlayer } from "../../hooks/usePlayer";
import { FemaleAvatar } from "../FemaleAvatar";
import {twoSpeakersPodcastProject} from "../../data/projectData"

// <group position={[positionX,positionY,positionZ]} rotation={[rotationX,rotationY,rotationZ]}>

export const Podcast2 = () => {

    const {animationState} = usePlayer();
    const projectData = twoSpeakersPodcastProject;

    const sceneConfiguration = sceneConfig.podcast["couchPodcast"];
    const speakers = projectData.speakers;

    const {scene : livingRoomScene } = useGLTF(`models/${sceneConfiguration.sceneName}.glb`);
    const { positionX, positionY, positionZ, rotationX, rotationY, rotationZ } = useControls({
        positionX: { value: 0, min: -10, max: 10, step: 0.1 },
        positionY: { value: 0, min: -10, max: 10, step: 0.1 },
        positionZ: { value: 0, min: -10, max: 10, step: 0.1 },
        rotationX: { value: 0, min: -3, max: 3, step: 0.1 },
        rotationY: { value: 0, min: -3, max: 3, step: 0.1 },
        rotationZ: { value: 0, min: -3, max: 3, step: 0.1 }
      });
      const [coordinates,setCoordinates] = useState(sceneConfiguration.fullView);
      console.log(coordinates);
      const sceneRef = useRef();

      useGSAP(() => {
        gsap.to(sceneRef.current.position, {
          x: coordinates.position[0],
          y: coordinates.position[1],
          z: coordinates.position[2],
          duration: 2,
          overwrite: 'auto'
        });
      
        gsap.to(sceneRef.current.rotation, {
          x: coordinates.rotation[0],
          y: coordinates.rotation[1],
          z: coordinates.rotation[2],
          duration: 2,
          overwrite: 'auto'
        });
      }, [coordinates]);

      useEffect(()=> {
            if(animationState === undefined) return;
            setCoordinates(sceneConfiguration[animationState.currentView])
      },[animationState])


  return (
    <>
      <OrbitControls />
      <ambientLight intensity={1}/>
      <group ref = {sceneRef}>
        <primitive object={livingRoomScene}/>
        {
          speakers.map( (speaker,index) =>
            <Avatar avatarType={"avatar"} avatarName = {speaker.name} isSitting  
                    position={sceneConfiguration.modelPositions[index].position} 
                    rotation={sceneConfiguration.modelPositions[index].rotation}/>
          )  
        } 
      </group>

      
    </>
  );
};
