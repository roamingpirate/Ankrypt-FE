import { Children, createContext, useContext, useEffect, useState } from "react";
 import  AnimationScriptData from "../data/japanAnimationScriptData.js"
// import  AnimationScriptData from "../data/script.js"
import script from "../data/script.js";
import { twoSpeakersPodcastProject, oneSpeakerProject } from "../data/projectData.js";
import storyAudioData from '../data/japanAudioData';
import podcastAudioData from '../data/storyAudioData'
import { useProjectInfo } from "../../utility/ProjectContext.jsx";
//import animationScriptData from "../../data/animationScriptData.jsx";
import { getBackgroundImageUrls } from "../../api/projectApi.js";
import { TextureLoader } from "three";

const PlayerContext = createContext();

export const PlayerController = ({ children }) => {

 // const [isLoaded, setIsLoaded] = useState(true);
 const {animationScript : AnimationScriptData,audioData: currentAudioData,canavsLoaded: isLoaded,backgroundTextureArray} = useProjectInfo();
 // const [animationScript,setAnimationScript] = useState();
  const [animationType,setAnimationType] = useState(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(null);
  const [currentSceneScript, setCurrentSceneScript] = useState([]);
  const [characterLook, setCharacterLook] = useState("Listener");
 // const [currentAudioData, setCurrentAudioData] = useState();
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [previousBackgroundImage, setPreviousBackgroundImage] = useState(null);
  const [animationState, setAnimationState] = useState();
  const [videoState, setVideoState] = useState("Paused");
  const [avatarVisibility, setAvatarVisibility] = useState(true);
  const [backgroundImageUrls,setBackgroundImageUrls] = useState(undefined);
 //const [reset, setReset] = useState(false);

 useEffect(() => {
  console.log(backgroundImage);
  console.log('Previous Background:', previousBackgroundImage);
}, [isLoaded]);


async function loadTextures(urls) {
  const loader = new TextureLoader();

  const loadTexture = (url) => {
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (texture) => resolve(texture),  // On success
        undefined,  // On progress
        (err) => reject(err)  // On error
      );
    });
  };

  // Use Promise.all to load all textures asynchronously
  const textures = await Promise.all(urls.map(url => loadTexture(url)));
  
  return textures;  // Returns an array of textures
}


   const updateBU = async () => {
    const response = await getBackgroundImageUrls(1);
    const textureArray = await loadTextures(response);
    setBackgroundImageUrls(textureArray);  
    // const imagesPromiseList = []
    // for (const i of response) {
    //   imagesPromiseList.push(preloadImage(i))
    // }
    // await Promise.all(imagesPromiseList)
     console.log(response);
     
   }

   useEffect(() =>{
    if(backgroundImageUrls != undefined){
        console.log(backgroundImageUrls);
        console.log(backgroundImageUrls[0]);
        setPreviousBackgroundImage(backgroundImageUrls[0]);
        setBackgroundImage(backgroundImageUrls[0]);
    }
    },[backgroundImageUrls]);

  useEffect(() => {

    if(isLoaded){
        setAnimationType("story")
        setCurrentSceneIndex(0);
        console.log(AnimationScriptData);
        //setCurrentAudioData(storyAudioData);
        if(animationType === "story")
          {
            // setPreviousBackgroundImage(backgroundImage);  
              
              
          }
          //updateBU();
          if(backgroundTextureArray != []){
            setBackgroundImageUrls(backgroundTextureArray);
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

      // if(animationType === "story")
      // {
      //    setPreviousBackgroundImage(backgroundImage);
      //    setBackgroundImage(`back1`);
      // }

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
    setBackgroundImage(backgroundImageUrls[((currentSceneIndex+1)%AnimationScriptData.length)]);
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
