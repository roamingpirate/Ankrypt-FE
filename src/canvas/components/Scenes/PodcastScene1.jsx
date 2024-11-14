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
    <mesh position={[0, 0, -0.2]}>
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

    const {animationState,backgroundImage,characterLook,currentView,toggleState} = usePlayer();
    const {speakerList} = useProjectInfo();
    const [avatar1Position, setAvatar1Position] = useState([-0.4, -1.5, 0.1]);
    const [avatar2Position, setAvatar2Position] = useState([0.4, -1.5, 0.1]);
    const [avatar1Rotation, setAvatar1Rotation] = useState([0, 0.4, 0]);
    const [avatar2Rotation, setAvatar2Rotation] = useState([0, 0.4, 0]);
    const [isAvatar1Visible, setIsAvatar1Visible] = useState(true);
    const [isAvatar2Visible, setIsAvatar2Visible] = useState(true);
    console.log("peppe",currentView);

    useEffect(() => {
       if(animationState == undefined)
        {return;}
        console.log(currentView.current,"peppepepepepepepeppepepepepepepe");
        if(currentView.current != 'Focused') {
          setAvatar1Position([-0.4, -1.5, 0.1]);
          setAvatar2Position([0.4, -1.5, 0.1]);
          setAvatar1Rotation([0,0.4,0]);
          setAvatar2Rotation([0,-0.4,0]);
          setIsAvatar1Visible(true);
          setIsAvatar2Visible(true);
        }
        else{
            if(((animationState.currentSpeakers).toLowerCase() == (speakerList[0].avatarName).toLowerCase()))   
            {
              setAvatar1Position([0, -1.3, 0.6]);
              setAvatar2Position([-8, -1.3, 0.6]);
              setAvatar1Rotation([0,0,0]);
              setAvatar2Rotation([0,0,0]);  
            } 
            else{
              setAvatar1Position([-8, -1.3, 0.6]);
              setAvatar2Position([0, -1.3, 0.6]);
              setAvatar1Rotation([0,0,0]);
              setAvatar2Rotation([0,0,0]);  
            }
        }
    },[animationState,toggleState])

   // const {scene : livingRoomScene } = useGLTF('models/PodcastScene_2.glb');
    const directionalLightRef = useRef();
    console.log(speakerList);


  
    // Use Leva's `useControls` to create interactive sliders
    // const { avatar1X, avatar1Y, avatar1Z, avatar2X, avatar2Y, avatar2Z } = useControls({
    //   avatar1X: { value: avatar1Position[0], min: -5, max: 5, step: 0.1 },
    //   avatar1Y: { value: avatar1Position[1], min: -5, max: 5, step: 0.1 },
    //   avatar1Z: { value: avatar1Position[2], min: -5, max: 5, step: 0.1 },
    //   avatar2X: { value: avatar2Position[0], min: -5, max: 5, step: 0.1 },
    //   avatar2Y: { value: avatar2Position[1], min: -5, max: 5, step: 0.1 },
    //   avatar2Z: { value: avatar2Position[2], min: -5, max: 5, step: 0.1 },
    // });

    // useEffect(() => {
    //   setAvatar1Position([avatar1X, avatar1Y, avatar1Z]);
    // }, [avatar1X, avatar1Y, avatar1Z]);
  
    // useEffect(() => {
    //   setAvatar2Position([avatar2X, avatar2Y, avatar2Z]);
    // }, [avatar2X, avatar2Y, avatar2Z]);



  return (
    <>
      <Background/>
      {/* <ambientLight intensity={1.5}/>
      <directionalLight 
        color={0xffffff} 
        ref={directionalLightRef}
        intensity={0.8} 
        position={[0,1,1]}
        castShadow 
      /> */}
          {/* Ambient light for overall lighting */}
          <ambientLight intensity={0.9} />

        {/* Directional light for primary lighting */}
        <directionalLight 
          color={0xffffff} 
          intensity={1.3} 
          position={[2, 2, 2]} // Adjusted position for better avatar lighting
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={10}
        />

        {/* Fill light to reduce harsh shadows and soften lighting */}
        <pointLight 
          color={0xaaaaaa} 
          intensity={0.6} 
          position={[-2, -2, 2]} // Soft fill light
        />

        {/* Rim light to create a nice edge highlight around avatars */}
        <pointLight
          color={0xffc0cb} 
          intensity={0.6} 
          position={[0, 2, -2]} // Rim light position to highlight edges
          castShadow
        />
      <group>
         {/* <Avatar avatarType={"femaleAvatar"} charCoord={[0.5,-0.3,0.6]} isSitting={false} avatarGender={speakerList[0].gender} avatarId={speakerList[0].avatarId} avatarName = {speakerList[0].avatarName} position={[-0.4,-1.5,0.1]} rotation={[0,0.4,0.0]}/>  */}
        {/* <Avatar avatarType={"avatar"}  charCoord={[-0.5,-0.3,0.6]} isSitting={false} avatarGender={speakerList[1].gender} avatarId={speakerList[1].avatarId} avatarName = {speakerList[1].avatarName}  position={[0.4,-1.5,0.1]} rotation={[0,-0.4,0.0]}/> */}
        {isAvatar1Visible && <Avatar avatarType={"femaleAvatar"} charCoord={[0.5,-0.3,0.6]} isSitting={false} avatarGender={speakerList[0].gender} avatarId={speakerList[0].avatarId} avatarName = {speakerList[0].avatarName} position={avatar1Position} rotation={avatar1Rotation}/>  }
        {isAvatar2Visible && <Avatar avatarType={"avatar"}  charCoord={[-0.5,-0.3,0.6]} isSitting={false} avatarGender={speakerList[1].gender} avatarId={speakerList[1].avatarId} avatarName = {speakerList[1].avatarName}  position={avatar2Position} rotation={avatar2Rotation}/>}
      </group>

      
    </>
  );
};
