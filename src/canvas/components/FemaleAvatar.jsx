import React, { useEffect, useRef, useState } from 'react'
import { useGraph, useFrame,useThree} from '@react-three/fiber'
import { useAnimations, useGLTF , useFBX} from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { useControls } from 'leva'
import * as THREE from 'three'
import faceExpressions from '../data/FaceExpressionConfig'
import { usePlayer } from '../hooks/usePlayer'
import audioData from '../data/storyAudioData';


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

export function FemaleAvatar(props) {

    const { camera } = useThree();
  
    const {avatarName, isSitting,targetPosition, ...prop} = props;
  
    const { scene } = useGLTF('models/femaleAvatar.glb');
    const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes, materials } = useGraph(clone);
  
    const avatarRef = useRef();
    const animationType = isSitting ? 'SittingAnimation' : 'Animation'
    const {animations : avatarAnimation} = useGLTF(isSitting?'animations/femaleAvatarSittingAnimation.glb':'animations/femaleAvatarAnimation.glb');
    const {animations : avatarPose} = useGLTF('animations/femaleAvatarPose.glb');
  
    const [blink,setBlink] = useState(false);
  
    const [currentAnimation,setCurrentAnimation] = useState(undefined);
    const [nextAnimation,setNextAnimation] = useState(undefined);
    const [previousAnimation,setPreviousAnimation] = useState(undefined);
    const [currentFaceExpression,setCurrentFaceExpression] = useState('Neutral');
    const morphTargetList = Object.keys(nodes.EyeLeft.morphTargetDictionary);
  
    const [animationNumber,setAnimationNumber] = useState(0);
    const [lipsync,setLipsync] = useState(undefined);
    const audio = useRef(null);
  
    const {script, animationState,setAnimationState, next, videoState, setVideoState,getScript} = usePlayer();
  
    const {actions, mixer} = useAnimations(avatarAnimation,avatarRef)
    const {actions : pose, mixer : poseSetup} = useAnimations(avatarPose, avatarRef);
  
  
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
    useFrame((state,delta)=> {
  
      // if(videoState === "Paused")
      // {
      //   setBlink(false);
      // }
      console.log("heh")
      console.log(state.camera.position);
      avatarRef.current.getObjectByName('Head').lookAt(...targetPosition)
  
      const faceExpressionConfiguration = faceExpressions[currentFaceExpression];
      morphTargetList.forEach((morphTarget) => {
        if(faceExpressionConfiguration[morphTarget])
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
        if(audio.current === null || audio.current === undefined)
        {
           return;
        }
        audio.current.pause();
        actions[currentAnimation].stop();
        if(isSitting){
          pose['Sitting'].play();
        }
        else{
          pose['Idle'].play();
        }
        setLipsync(undefined);
        setCurrentFaceExpression('Neutral');
      }
  
      if(videoState == "Playing")
      {
        setAnimationState((animationState) => ({...animationState, isplaying : true}))
        return;
      }
  
      if(videoState == "Reset")
      {
        if(audio.current != null && audio.current != undefined)
          {
            audio.current.pause();
          }
        getScript();
        setAnimationState((animationState) => ({...animationState, isplaying : true}));
      }
  
    },[videoState])
  
  
    useEffect(()=> {
  
      if(animationState.isplaying === false)
      {
          return;
      }
  
      poseSetup.stopAllAction();
  
  
      if(!currentAnimation || !animationNumber)
      {
        return;
      }
  
      const action = actions[currentAnimation];
      if(action === undefined)
      {
        return;
      }
      //action.setLoop(loopType, 1);
      //action.clampWhenFinished = true;
  
      // const onAnimationFinished = () => {
      //   console.log('Animation finished ' + currentAnimation + ' AN '+animationNumber);
      //    if(animationState.currentSpeakers === avatarName)
      //    {
      //       console.log("Next");
      //       next();
      //    }
      // }
      console.log("speaker " + avatarName + " AN " + animationNumber)
      console.log("previous Animation: " + previousAnimation);
      console.log("Current Animation: " + currentAnimation);
      console.log("Next Animation: " + nextAnimation);
  
      var fadeInTime = 0.4;
      if(currentAnimation === previousAnimation)
      {
          fadeInTime = 0;
      }
  
      //mixer.addEventListener('finished', onAnimationFinished);
      if(currentAnimation != nextAnimation){
        action.reset().fadeIn(fadeInTime).play();
     }
     else{
      action.reset().play();
     }
  
      return() => {
        if(currentAnimation != nextAnimation){
           action.fadeOut(0.4);
           return;
        }
       // action.stop();
       // mixer.removeEventListener('finished', onAnimationFinished);
      }
    },[animationNumber]);
  
  
     useEffect(()=> {
  
      if(isSitting){
        pose['Sitting'].play();
      }
      else{
        pose['Idle'].play();
      }
  
      if(animationState === undefined)
      {
         return;
      }
  
      if(!(animationState.currentSpeakers === avatarName))
      {
        console.log("returning for "+avatarName);
        setCurrentAnimation('Idle');
        setNextAnimation('Idle');
        setAnimationNumber(animationNumber+1);
        setLipsync(undefined);
        audio.current = undefined;
        setCurrentFaceExpression('Neutral');
        return;
      }
  
      const animationToPlay = animationState.currentDialogs[animationState.currentDialogIndex].Animation;
      const avatarFaceExpression = animationState.currentDialogs[animationState.currentDialogIndex].FaceExpression;
      var nextAnimationToPlay = 'Idle';
  
      if(animationState.currentDialogsLength > (animationState.currentDialogIndex + 1)){
         nextAnimationToPlay = animationState.currentDialogs[animationState.currentDialogIndex + 1].Animation;
      }
  
      console.log('Speaker Script Animation ' + avatarName);
      console.log('animationToPlay');
      console.log(animationToPlay);
      console.log('NextAnimationToPlay');
      console.log(nextAnimationToPlay);
      console.log('currentFaceExpression');
      console.log(avatarFaceExpression);
  
      setPreviousAnimation(currentAnimation);
      setCurrentAnimation(animationToPlay);
      setNextAnimation(nextAnimationToPlay);
      setAnimationNumber(animationNumber + 1);
      setCurrentFaceExpression(avatarFaceExpression);
      audio.current = new Audio("data:audio/mp3;base64," + audioData[animationState.currentSpeechIndex][animationState.currentDialogIndex].audio);
      audio.current.play();
      audio.current.onended = next;
      setLipsync(audioData[animationState.currentSpeechIndex][animationState.currentDialogIndex].lipsync);
    },[animationState]);
  
  
    useEffect(() => {
  
  
  
      //pose logic 
      if(isSitting){
        pose['Sitting'].play();
      }
      else{
        pose['Idle'].play();
      }
  
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
      return () => clearTimeout(blinkTimeout);
    }, []);
  
      

  return (
    <group {...prop} dispose={null}  ref={avatarRef}>
      <group rotation-x={0}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
    </group>
    </group>
  )
}

useGLTF.preload('models/femaleAvatar.glb')
