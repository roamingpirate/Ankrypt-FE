import { Environment, OrbitControls, Sky, ContactShadows, useGLTF, PerspectiveCamera, useAnimations, useFBX, useFBO } from "@react-three/drei";
import { TextureLoader , MathUtils} from 'three';
import * as THREE from 'three';
import { useFrame, useLoader,useThree,extend } from '@react-three/fiber';
import {Plane, useHelper} from '@react-three/drei'
import { useControls } from "leva";
import { Scene } from "three";
import sceneConfig from "../../data/sceneConfig";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "../Avatar";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import { usePlayer } from "../../hooks/usePlayer";
import { TransitionMaterial } from "../../data/TransitionMaterial";
extend({
    TransitionMaterial,
  });
  

function Background({backgroundImage}) {
    const {viewport} = useThree();
  const planeRef = useRef();
  const texture = useLoader(TextureLoader, `../../public/background/${backgroundImage}.jpg`);

//   useGSAP(() => {
//     gsap.to(planeRef.current.material, {
//       opacity: 0.5,
//       duration: 0.5,
//       yoyo: true,  // Makes it go back to 0 
//       repeat:1,
//     });
//   }, [backgroundImage]);

  return (
    <Plane args={[viewport.width,viewport.height]} position={[0, 0, -1]} ref={planeRef}>
      <meshBasicMaterial attach="material" map={texture} />
    </Plane>
  );
}

export const PodcastTransition = ({cameraRef}) => {
    const {viewport} = useThree();
    const {animationState,backgroundImage,characterLook,previousBackgroundImage} = usePlayer();

    const { positionX, positionY, positionZ, rotationX, rotationY, rotationZ } = useControls({
        positionX: { value: 0, min: -20, max: 20, step: 0.1 },
        positionY: { value: 0, min: -20, max: 20, step: 0.1 },
        positionZ: { value: 0, min: -20, max: 20, step: 0.1 },
        rotationX: { value: 0, min: -3, max: 3, step: 0.1 },
        rotationY: { value: 0, min: -3, max: 3, step: 0.1 },
        rotationZ: { value: 0, min: -3, max: 3, step: 0.1 }
      });
//mock
      const { progressionTarget, transitionSpeed } = useControls({
        transitionSpeed: {
          value: 2,
          min: 0.3,
          max: 10,
        },
        progressionTarget: {
          value: 1,
        },
        transition: {
          value: 0,
          options: {
            Horizontal: 0,
            Vertical: 1,
          },
          onChange: (value) => {
            renderScreenTexture.current.transition = value;
          },
        },
      });
    
      const directionalLightRef = useRef();
      const texture = useLoader(TextureLoader, `../../public/background/${backgroundImage}.jpg`);
    //   const texture = useRef(useLoader(TextureLoader, `../../public/background/${backgroundImage}.jpg`));
      const planeRef = useRef();
      const backgroundRef = useRef();
      const Storyscene = useRef(null);
      const exampleScene = useRef(null);
      const renderPlane = useRef(null);

      const previousScene = useFBO({ width: viewport.width * 2, height: viewport.height * 2 });
      const currentScene = useFBO({ width: viewport.width * 2, height: viewport.height * 2 });

      const renderScreenTexture = useRef();


    
      useFrame(({gl,scene},delta) => {
        Storyscene.current.visible = true;
        exampleScene.current.visible = false;
        gl.setRenderTarget(previousScene);
        gl.render(scene, cameraRef.current);

        Storyscene.current.visible = false;
        exampleScene.current.visible = true;      
        gl.setRenderTarget(currentScene);      
        gl.render(scene, cameraRef.current);

        renderScreenTexture.current.progression = MathUtils.lerp(
            renderScreenTexture.current.progression,
            progressionTarget,
            delta * transitionSpeed
          );

        gl.setRenderTarget(null);
        Storyscene.current.visible = false;
        exampleScene.current.visible = false;        

      })


  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.7}/>

      {/* <group ref={renderPlane}>
         <Plane args={[viewport.width,viewport.height]}/>
         <transitionMaterial
          ref={renderScreenTexture}
          tex={previousScene.texture}
          tex2={currentScene.texture}
          toneMapped={false}
        />
      </group> */}

      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <transitionMaterial
          ref={renderScreenTexture}
          tex={previousScene.texture}
          tex2={currentScene.texture}
          toneMapped={false}
        />
      </mesh>

      <group ref={Storyscene}>
      <directionalLight 
        color={0xffffff} 
        ref={directionalLightRef}
        intensity={0.5} 
        position={[0,1,1]}
        castShadow 
      />

      {/* Background */}
        <Plane args={[viewport.width,viewport.height]} position={[0, 0, -1]} ref={planeRef}>
        <meshBasicMaterial attach="material" map={texture.current} />
        </Plane>
      <group>
         <Avatar avatarType={"femaleAvatar"} charCoord={[0.5,-0.3,0.6]} isSitting={false} avatarName = 'Anshika' position={[-0.4,-1.5,0.1]} rotation={[0,0.4,0.0]}/> 
        <Avatar avatarType={"avatar"}  charCoord={[-0.5,-0.3,0.6]} isSitting={false} avatarName = 'Ankit'  position={[0.4,-1.5,0.1]} rotation={[0,-0.4,0.0]}/>
      </group>
      </group>
      <group ref={exampleScene}>
        <mesh position-x={1}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <mesh position-x={-1}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </group>
      
    </>
  );
};
