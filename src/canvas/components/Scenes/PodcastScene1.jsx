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

const Background = () => {
  const { videoState, backgroundImage, previousBackgroundImage } = usePlayer();
  const { viewport } = useThree();
  const [dispTexture, setDispTexture] = useState(undefined);
  const ref = useRef();



  useEffect(() => {
    const loader = new TextureLoader();
    const loadDispTexture = async () => {
      const texture = await loader.loadAsync("/displacement/11.jpg");
      setDispTexture(texture);
    };

    loadDispTexture();
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.dispFactor = 0;
      gsap.to(ref.current, {
        dispFactor: 1,
        duration: 2,
      });
    }
  }, [backgroundImage]);

  return (
    <mesh position={[0, 0, -0.1]}>
      <planeGeometry args={[1.1 * viewport.width, 1.1 * viewport.height]} />
      {dispTexture && previousBackgroundImage && backgroundImage && (
        <transitionMaterial
          ref={ref}
          tex={previousBackgroundImage}
          tex2={backgroundImage}
          disp={dispTexture}
          toneMapped={false}
        />
      )}
    </mesh>
  );
}



export const Podcast1 = () => {

    const {animationState,backgroundImage,characterLook} = usePlayer();
    const {speakerList} = useProjectInfo();

   // const {scene : livingRoomScene } = useGLTF('models/PodcastScene_2.glb');
    const directionalLightRef = useRef();
    console.log(speakerList);

  return (
    <>
      <Background/>
      <ambientLight intensity={1.5}/>
      <directionalLight 
        color={0xffffff} 
        ref={directionalLightRef}
        intensity={0.8} 
        position={[0,1,1]}
        castShadow 
      />
      <group>
         <Avatar avatarType={"femaleAvatar"} charCoord={[0.5,-0.3,0.6]} isSitting={false} avatarGender={speakerList[0].gender} avatarId={speakerList[0].avatarId} avatarName = {speakerList[0].avatarName} position={[-0.4,-1.5,0.1]} rotation={[0,0.4,0.0]}/> 
        <Avatar avatarType={"avatar"}  charCoord={[-0.5,-0.3,0.6]} isSitting={false} avatarGender={speakerList[1].gender} avatarId={speakerList[1].avatarId} avatarName = {speakerList[1].avatarName}  position={[0.4,-1.5,0.1]} rotation={[0,-0.4,0.0]}/>
      </group>

      
    </>
  );
};
