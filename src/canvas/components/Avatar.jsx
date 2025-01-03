import React, { useEffect, useRef, useState,useMemo } from 'react'
import { useGraph, useFrame,useThree} from '@react-three/fiber'
import { useAnimations, useGLTF , useFBX} from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { useControls } from 'leva'
import * as THREE from 'three'
import faceExpressions from '../data/FaceExpressionConfig'
import { usePlayer } from '../hooks/usePlayer'
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import axios from 'axios'
import { useProjectInfo } from '../../hooks/ProjectContext'
//import audioData from '../data/storyAudioData';

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};


export function Avatar(props) {

  const { camera } = useThree();
  
  const {avatarName, isSitting, targetPosition,avatarType,charCoord,avatarId,avatarGender, ...prop} = props;

  const avatarUrl = `https://models.readyplayer.me/${avatarId}.glb?morphTargets=ARKit,Oculus%20Visemes`
  const [avatarBodyType,setAvatarBodyType] = useState("male");


 // const { scene } = useGLTF(`models/${avatarType}.glb`);
  const { scene } = useGLTF(avatarUrl);
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  const avatarRef = useRef();
  const {animations : avatarAnimation} = useMemo(() => useGLTF(`/animations/${avatarGender}AvatarAnimation.glb`),[avatarGender]);
  const {animations : avatarPose} = useGLTF(`/animations/${avatarGender}AvatarPose.glb`);

  const [blink,setBlink] = useState(false);
  const isStart = useRef(true);

  const [currentAnimation,setCurrentAnimation] = useState(undefined);
  const [nextAnimation,setNextAnimation] = useState(undefined);
  const [previousAnimation,setPreviousAnimation] = useState(undefined);
  const [currentFaceExpression,setCurrentFaceExpression] = useState('Neutral');
  const morphTargetList = Object.keys(nodes.EyeLeft.morphTargetDictionary);

  const [animationNumber,setAnimationNumber] = useState(0);
  const [lipsync,setLipsync] = useState(undefined);
  const audio = useRef(null);
  const avatarFaceExpression = useRef(null);
  const avatarLipSync = useRef(null);

  const {script, animationState,setAnimationState,toggleState, next, videoState, setVideoState,currentAudioData,setCurrentSceneIndex,currentSceneIndex,setCurrentSceneScript,characterLook,updateAnimationState,avatarVisibility,currentView,mediaStreamAudioDestinationRef,audioContextRef} = usePlayer();
  const {isRecording,currentStage,audioMap} = useProjectInfo();

  const {actions, mixer,names} =useAnimations(avatarAnimation,avatarRef);
  const {actions : pose, mixer : poseSetup} = useAnimations(avatarPose, avatarRef);


  // look logic

  const avatarLookPosition = useRef([0,0,1.5]);

  useGSAP(() => {
    console.log("teloankit", characterLook.current, currentView, avatarName);
    const requiredLookPosition = (characterLook.current == "Character" && currentView.current != 'Focused')?charCoord:[0,0,1.5];

    gsap.to(avatarLookPosition.current, {
      0: requiredLookPosition[0],
      1: requiredLookPosition[1],
      2: requiredLookPosition[2],
      duration: (currentView.current != 'Focused'? 1: 0),
      overwrite: 'auto'
    });
  },[animationState,toggleState])


  const moveMorphTarget = (target, value, speed = 0.1) => {
    // For Traversing each child objects also of this object
    clone.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
      }
    });
  };

  //useFrame
  useFrame(()=> {

    // if(videoState === "Paused")
    // {
    //   setBlink(false);
    // }
    

    if(videoState === "Paused"){
       // mixer.timeScale = 0;
        setBlink(false);
    }
    if(avatarLookPosition.current != undefined){
       avatarRef.current.getObjectByName('Head').lookAt(...avatarLookPosition.current)
    }

    const faceExpressionConfiguration = faceExpressions[currentFaceExpression]; 
    morphTargetList.forEach((morphTarget) => {
      if(faceExpressionConfiguration && faceExpressionConfiguration[morphTarget])
      {
         moveMorphTarget(morphTarget, faceExpressionConfiguration[morphTarget],0.1)
      }
      else{
        moveMorphTarget(morphTarget, 0,0.1)
      }
    })

    moveMorphTarget("eyeBlinkLeft", blink ? 1 : 0, 0.5);
    moveMorphTarget("eyeBlinkRight", blink? 1 : 0, 0.5);

    //lipsync
    const appliedMorphTargets = [];
    if (lipsync != undefined && audio.current != undefined) {
      const currentAudioTime = audio.current.currentTime;
      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const mouthCue = lipsync.mouthCues[i];
        if (
          currentAudioTime >= mouthCue.start &&
          currentAudioTime <= mouthCue.end
        ) {
          appliedMorphTargets.push(corresponding[mouthCue.value]);
          moveMorphTarget(corresponding[mouthCue.value], 1, 0.2);
          break;
        }
      }
    }

    Object.values(corresponding).forEach((value) => {
      if (appliedMorphTargets.includes(value)) {
        return;
      }
      moveMorphTarget(value, 0, 0.1);
    });
  })


  // For setting video state
  useEffect(() => {

    if(videoState == "Paused")
    {
        mixer.timeScale = 0;
        setCurrentFaceExpression('Smile')
      if(audio.current === null || audio.current === undefined)
      {
         return;
      }
      audio.current.pause();
    }

    if(videoState == "Playing")
    {
       mixer.timeScale=0.9;
       isStart.current = false;
      if(audio.current === null || audio.current === undefined)
        {
          console.log("opps");
           return;
        }
      if (!audio.current.sourceNode && isRecording) {
          const source = audioContextRef.current.createMediaElementSource(audio.current);
          source.connect(mediaStreamAudioDestinationRef.current);
          audio.current.sourceNode = source;
      }
      audio.current.play();
      return;
    }

    if(videoState == "Reset")
    {
      mixer.stopAllAction();
      setVideoState("Paused");
      isStart.current = true;
      setCurrentAnimation(undefined);
      if(audio.current === null || audio.current === undefined)
      {
          return;
      }
        audio.current.pause(); 
    }

  },[videoState])


  useEffect(()=> {


    if(animationState === undefined || !currentAnimation || !animationNumber)
    {
      return;
    }

    poseSetup.stopAllAction();
    console.log("ummm");
    console.log(actions);
    console.log(mixer.timeScale);
    const action = actions[currentAnimation];
    if(action === undefined) return;


    console.log("speaker " + avatarName + " AN " + animationNumber)
    console.log("previous Animation: " + previousAnimation);
    console.log("Current Animation: " + currentAnimation);
    console.log("Next Animation: " + nextAnimation);
    
    if(currentAnimation != previousAnimation){
     // console.log("play")
      action.reset().fadeIn(0.9).play();
      }

    return () => {
      //It gets value of previous render itself
      if(currentAnimation != nextAnimation){
        action.fadeOut(0.9);
      }
    }

  },[animationNumber]);


   useEffect(()=> {
    const nextAnimation = () => {
        console.log(animationState);
        console.log('animation Statee');

        if(animationState === undefined)
        {
          return;
        }

        if(!((animationState.currentSpeakers).toLowerCase() == avatarName.toLowerCase()))
        {
          console.log("returning for "+avatarName);
          if(currentAnimation == 'Idle')
          {
            setPreviousAnimation('Idle');
          }
          setCurrentAnimation('Idle');
          setNextAnimation('Idle');
          setAnimationNumber(animationNumber+1);
          setLipsync(undefined);
          audio.current = undefined;
          setCurrentFaceExpression('Smile');
          return;
        }

        const animationToPlay = animationState.currentDialogs[animationState.currentDialogIndex].Animation;
        var nextAnimationToPlay = 'Idle';
        if(animationState.currentDialogsLength > (animationState.currentDialogIndex + 1)){
          nextAnimationToPlay = animationState.currentDialogs[animationState.currentDialogIndex + 1].Animation;
        }

        setPreviousAnimation(currentAnimation);
        setCurrentAnimation(animationToPlay);
        setNextAnimation(nextAnimationToPlay);
        setAnimationNumber(animationNumber + 1);

        const currentAudioDataItem = currentAudioData[currentSceneIndex]?.[animationState.currentSpeechIndex]?.[animationState.currentDialogIndex];
        
        avatarFaceExpression.current = animationState.currentDialogs[animationState.currentDialogIndex].FaceExpression;
        setCurrentFaceExpression("");

        if (currentAudioDataItem) 
        {  
          const audioSource = audioMap.get(`${currentSceneIndex}_${animationState.currentSpeechIndex}_${animationState.currentDialogIndex}`);
            
          if (!audioSource) {
              console.error("Audio source not found");
              next();  
              return;
          }

          audio.current = new Audio("data:audio/mp3;base64," + audioSource);

          if(isRecording)
          {
            if (!audio.current.sourceNode) {
              const source = audioContextRef.current.createMediaElementSource(audio.current);
              source.connect(mediaStreamAudioDestinationRef.current);
              audio.current.sourceNode = source;
            }
          }

          if(videoState === "Playing")
          {
            audio.current.play();
          }

          audio.current.onended = next;
          setLipsync(currentAudioData[currentSceneIndex][animationState.currentSpeechIndex][animationState.currentDialogIndex]?.lipsync);
        }
        else
        {
            next();
        }
    }

      if(isStart.current)
      {
        mixer.timeScale = 1;
        setPreviousAnimation('Idle');
        actions['Idle'].play();
        setTimeout(() => {
          mixer.timeScale = 0;
          nextAnimation();
        },[1000])
      }
      else{
        nextAnimation();
      }

  },[animationState]);




  useEffect(() => {

    avatarRef.current.castShadow = true;
    avatarRef.current.receiveShadow = true;
    //pose logic 
    // if(isSitting){
    //   pose['Sitting'].play();
    // }
    // else{
    //   pose['Idle'].play();
    // }
    //console.log("av",avatarAnimation)

    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 600);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return  () => {
      clearTimeout(blinkTimeout);
      setCurrentAnimation(undefined);
    };
  }, []);


  return (
    <group {...prop} visible={avatarVisibility} scale={0.8} dispose={null}  ref={avatarRef}>
      <group rotation-x={0}>
     <primitive object={clone}/>    </group>
    </group>
  )
}

