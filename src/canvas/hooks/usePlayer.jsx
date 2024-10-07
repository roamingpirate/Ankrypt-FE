import { Children, createContext, useContext, useEffect, useState } from "react";
 import  AnimationScriptData from "../data/japanAnimationScriptData.js"
// import  AnimationScriptData from "../data/script.js"
import script from "../data/script.js";
import { twoSpeakersPodcastProject, oneSpeakerProject } from "../data/projectData.js";
import storyAudioData from '../data/japanAudioData';
import podcastAudioData from '../data/storyAudioData'

const PlayerContext = createContext();

export const PlayerController = ({ children }) => {

  const [isLoaded, setIsLoaded] = useState(true);
  const [animationScript,setAnimationScript] = useState();
  const [animationType,setAnimationType] = useState(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(null);
  const [currentSceneScript, setCurrentSceneScript] = useState([]);
  const [characterLook, setCharacterLook] = useState("Listener");
  const [currentAudioData, setCurrentAudioData] = useState();
  const [backgroundImage, setBackgroundImage] = useState("back1");
  const [previousBackgroundImage, setPreviousBackgroundImage] = useState("back2");
  const [animationState, setAnimationState] = useState();
  const [videoState, setVideoState] = useState("Paused");
  const [avatarVisibility, setAvatarVisibility] = useState(true);
  const [reset, setReset] = useState(false);

  useEffect(() => {

    if(isLoaded){
        setAnimationType("story")
        setCurrentSceneIndex(0);
        setCurrentAudioData(storyAudioData);
        if(animationType === "story")
          {
            // setPreviousBackgroundImage(backgroundImage);
             setBackgroundImage(AnimationScriptData[currentSceneIndex].backgroud);
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

      setCurrentSceneScript(AnimationScriptData[currentSceneIndex].script);
      updateAnimationState(currentSceneIndex,0,0);

      if(animationType === "story")
      {
         setPreviousBackgroundImage(backgroundImage);
         setBackgroundImage(AnimationScriptData[currentSceneIndex].backgroud);
      }

  },[currentSceneIndex]);


  const updateAnimationState = (currentSceneIndex,currentSpeechIndex,currentDialogIndex) => {

    let currentSceneScriptData = AnimationScriptData[currentSceneIndex].script;

    const animationStateObj = {
      currentSpeechIndex: currentSpeechIndex,
      speechLength: currentSceneScriptData.length,
      currentDialogIndex: currentDialogIndex,
      currentDialogsLength: currentSceneScriptData[currentSpeechIndex].speech.length,
      currentDialogs: currentSceneScriptData[currentSpeechIndex].speech,
      currentSpeakers: currentSceneScriptData[currentSpeechIndex].speaker,
      currentView: "fullView",
    }

    setAnimationState(animationStateObj);
  }

  const createSceneTransition = () => {
    console.log("Popopop")
    setAvatarVisibility(false);
    setPreviousBackgroundImage(backgroundImage);
    setBackgroundImage(AnimationScriptData[(currentSceneIndex+1)%AnimationScriptData.length].backgroud);
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
        nextDialogs = currentSceneScript[nextSpeechIndex].speech;
        nextDialogLength= nextDialogs.length;
        nextSpeaker= currentSceneScript[nextSpeechIndex].speaker;
        nextDialogIndex=0;
        nextCurrentView= currentSceneScript[nextSpeechIndex].viewType;
        setCharacterLook(currentSceneScript[nextSpeechIndex].look);

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
