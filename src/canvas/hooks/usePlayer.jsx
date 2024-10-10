import { Children, createContext, useContext, useEffect, useState } from "react";
 import  AnimationScriptData from "../data/japanAnimationScriptData.js"
// import  AnimationScriptData from "../data/script.js"
import script from "../data/script.js";
import { twoSpeakersPodcastProject, oneSpeakerProject } from "../data/projectData.js";
import storyAudioData from '../data/japanAudioData';
import podcastAudioData from '../data/storyAudioData'
import { useProjectInfo } from "../../utility/ProjectContext.jsx";
import animationScriptData from "../../data/animationScriptData.jsx";

const PlayerContext = createContext();

export const PlayerController = ({ children }) => {

 // const [isLoaded, setIsLoaded] = useState(true);
 const {animationScript : AnimationScriptData,AudioData: currentAudioData,canavsLoaded: isLoaded} = useProjectInfo();
 // const [animationScript,setAnimationScript] = useState();
  const [animationType,setAnimationType] = useState(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(null);
  const [currentSceneScript, setCurrentSceneScript] = useState([]);
  const [characterLook, setCharacterLook] = useState("Listener");
 // const [currentAudioData, setCurrentAudioData] = useState();
  const [backgroundImage, setBackgroundImage] = useState("back1");
  const [previousBackgroundImage, setPreviousBackgroundImage] = useState("back2");
  const [animationState, setAnimationState] = useState();
  const [videoState, setVideoState] = useState("Paused");
  const [avatarVisibility, setAvatarVisibility] = useState(true);
 //const [reset, setReset] = useState(false);

  useEffect(() => {

    if(isLoaded){
        setAnimationType("story")
        setCurrentSceneIndex(0);
        console.log(AnimationScriptData);
        //setCurrentAudioData(storyAudioData);
        if(animationType === "story")
          {
            // setPreviousBackgroundImage(backgroundImage);
              setBackgroundImage(`back1`);
          }
    }

  },[isLoaded]);

  useEffect(() => {
    console.log("kel4o");

      if(currentSceneIndex === null)
      {
        return ;
      }

      if(currentSceneIndex === AnimationScriptData.length){
          setVideoState("Reset");
          setCurrentSceneIndex(0);
          return;
      }

      setCurrentSceneScript(AnimationScriptData[currentSceneIndex].Script);
      updateAnimationState(currentSceneIndex,0,0);

      if(animationType === "story")
      {
         setPreviousBackgroundImage(backgroundImage);
         setBackgroundImage(`back1`);
      }

  },[currentSceneIndex]);


  const updateAnimationState = (currentSceneIndex,currentSpeechIndex,currentDialogIndex) => {

    let currentSceneScriptData = AnimationScriptData[currentSceneIndex].Script;
    console.log("babaji");
    console.log(currentSceneScriptData);

    const animationStateObj = {
      currentSpeechIndex: currentSpeechIndex,
      speechLength: currentSceneScriptData.length,
      currentDialogIndex: currentDialogIndex,
      currentDialogsLength: currentSceneScriptData[currentSpeechIndex].Speech.length,
      currentDialogs: currentSceneScriptData[currentSpeechIndex].Speech,
      currentSpeakers: currentSceneScriptData[currentSpeechIndex].Speaker,
      currentView: "fullView",
    }

    setAnimationState(animationStateObj);
  }

  const createSceneTransition = () => {
    console.log("Popopop")
    setAvatarVisibility(false);
    setPreviousBackgroundImage(backgroundImage);
    //modified
    setBackgroundImage(`back${((currentSceneIndex+1)%animationScriptData.length) + 1}`);
    setTimeout(() => {
      setAvatarVisibility(true);
      setCurrentSceneIndex(currentSceneIndex+1);
    }, 3000);  
    
  }

  const next = () => {

    console.log("kello")
    console.log(animationState);
    var nextDialogIndex = animationState.currentDialogIndex + 1;
    var nextSpeechIndex = animationState.currentSpeechIndex;
    var nextDialogs = animationState.currentDialogs;
    var nextDialogLength = animationState.currentDialogs.length;
    var nextSpeaker = animationState.currentSpeakers;
    var nextCurrentView  = animationState.currentView;

    if(animationState.currentSpeechIndex === animationState.speechLength)
    {
      //console.log('stop');
        //isPlayingV = false;
    }

    if(animationState.currentDialogIndex === (animationState.currentDialogsLength-1))
    {
        nextSpeechIndex = (animationState.currentSpeechIndex+1)%animationState.speechLength;
        if(nextSpeechIndex === 0)
        {
           createSceneTransition();
           //setCurrentSceneIndex(currentSceneIndex + 1);
           return;
        }
        nextDialogs = currentSceneScript[nextSpeechIndex].Speech;
        nextDialogLength= nextDialogs.length;
        nextSpeaker= currentSceneScript[nextSpeechIndex].Speaker;
        nextDialogIndex=0;
        nextCurrentView= currentSceneScript[nextSpeechIndex].View;
        console.log("meowwww!")
        console.log(currentSceneScript[nextSpeechIndex].Look)
        setCharacterLook(currentSceneScript[nextSpeechIndex].Look);

    }
    else{
      nextDialogIndex=animationState.currentDialogIndex + 1;
    }


    setAnimationState(animationState => ({
      ...animationState, 
      currentDialogs: nextDialogs, 
      currentDialogIndex: nextDialogIndex, 
      currentDialogsLength: nextDialogs.length,
      currentSpeechIndex : nextSpeechIndex,
      currentSpeakers : nextSpeaker,
      currentView: nextCurrentView
    }))
  }


  return (
    <PlayerContext.Provider
      value={{
        script,
        animationState,
        setAnimationState,
        next,
        videoState,
        setVideoState,
        setCurrentSceneIndex,
        currentSceneIndex,
        currentAudioData,
        backgroundImage,
        previousBackgroundImage,
        characterLook,
        setCurrentSceneScript,
        updateAnimationState,
        avatarVisibility,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () =>
{
    const context = useContext(PlayerContext);
    return context
}
