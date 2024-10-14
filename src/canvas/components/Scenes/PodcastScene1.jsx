import { Environment, OrbitControls, Sky, ContactShadows, useGLTF, PerspectiveCamera, useAnimations, useFBX } from "@react-three/drei";
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { useLoader,extend,useFrame , useThree} from '@react-three/fiber';
import {Plane, useHelper,useTexture} from '@react-three/drei'
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
import { TransitionMaterial } from "../../data/TransitionMaterial";
import { useProjectInfo } from "../../../utility/ProjectContext";

extend({
  TransitionMaterial,
});


// <group position={[positionX,positionY,positionZ]} rotation={[rotationX,rotationY,rotationZ]}>

function Background() {

  const {videoState,backgroundImage,previousBackgroundImage} = usePlayer();
  const {viewport} = useThree();

  // useGSAP(() => {
  //   gsap.to(planeRef.current.material, {
  //     opacity: 0.5,
  //     duration: 1,
  //     yoyo: true,  // Makes it go back to 0 
  //     repeat:1,
  //   });
  // }, [backgroundImage]);

  useEffect(() => {
    ref.current.dispFactor=0;
    gsap.to(ref.current, {
      dispFactor: 1,
      duration: 2, 
      
    });
  }, [backgroundImage]);


  const ref = useRef()
  const [texture1, texture2, dispTexture] = useTexture([`/background/${previousBackgroundImage}.jpg`, `/background/${backgroundImage}.jpg`, "/displacement/11.jpg"])
  const [hovered, setHover] = useState(false)
  // useFrame(() => {
  //   ref.current.dispFactor = THREE.MathUtils.lerp(ref.current.dispFactor, hovered ? 1 : 0, 0.0075)
  // })
  return (
    <mesh position={[0,0,-0.1]}>
      <planeGeometry args={[1.1*viewport.width,1.1*viewport.height]}/>
      <transitionMaterial ref={ref} tex={texture1} tex2={texture2} disp={dispTexture} toneMapped={false} />
    </mesh>
  )
}



export const Podcast1 = () => {

    const {animationState,backgroundImage,characterLook} = usePlayer();
    const {speakerList} = useProjectInfo();
    // const avatarLookPosition = useRef([0,0,1.5]);

    // useGSAP(() => {
    //   const requiredLookPosition = (characterLook == "Character")?[0.5,-0.3,0.6]:[0,0,1.5];

    //   gsap.to(avatarLookPosition.current, {
    //     0: requiredLookPosition[0],
    //     1: requiredLookPosition[1],
    //     2: requiredLookPosition[2],
    //     duration: 1,
    //     overwrite: 'auto'
    //   });
    // },[characterLook])

    const {scene : livingRoomScene } = useGLTF('models/PodcastScene_2.glb');
    // const { positionX, positionY, positionZ, rotationX, rotationY, rotationZ } = useControls({
    //     positionX: { value: 0, min: -20, max: 20, step: 0.1 },
    //     positionY: { value: 0, min: -20, max: 20, step: 0.1 },
    //     positionZ: { value: 0, min: -20, max: 20, step: 0.1 },
    //     rotationX: { value: 0, min: -3, max: 3, step: 0.1 },
    //     rotationY: { value: 0, min: -3, max: 3, step: 0.1 },
    //     rotationZ: { value: 0, min: -3, max: 3, step: 0.1 }
    //   });
      const directionalLightRef = useRef();


  return (
    <>
      <Background/>
      <OrbitControls />
      <ambientLight intensity={0.7}/>
      {/* <hemisphereLight 
        skyColor={0xffffff} 
        groundColor={0x444444} 
        intensity={1.5} 
      /> */}
      <directionalLight 
        color={0xffffff} 
        ref={directionalLightRef}
        intensity={0.5} 
        position={[0,1,1]}
        // position={[-1.5, 15.9, -3.7]} 
        castShadow 
      />
      <group>
         <Avatar avatarType={"femaleAvatar"} charCoord={[0.5,-0.3,0.6]} isSitting={false} avatarGender={speakerList[0].gender} avatarId={speakerList[0].avatarId} avatarName = 'Jordan' position={[-0.4,-1.5,0.1]} rotation={[0,0.4,0.0]}/> 
         {/* <Avatar avatarType={"femaleAvatar"} targetPosition={(characterLook == "Listener")?[0,0,2]:[0,0,0.3]} isSitting={false} avatarName = 'Anshika' position={[-0.5,-1.5,0]} rotation={[0,0.4,0.0]}/>  */}
        {/* <FemaleAvatar position={[-0.5,-1.5,0]} rotation={[0,0.4,0.0]}/> */}
        <Avatar avatarType={"avatar"}  charCoord={[-0.5,-0.3,0.6]} isSitting={false} avatarGender={speakerList[1].gender} avatarId={speakerList[1].avatarId} avatarName = 'Michael'  position={[0.4,-1.5,0.1]} rotation={[0,-0.4,0.0]}/>
      </group>

      
    </>
  );
};
