import React, {useState, useContext, createContext, useEffect} from "react";
import { fetchGeneratedScript, fetchScript, fetchAnimationScript, updateScript, updateAnimationScript, fetchAudioData, createAudioRequest, getAudioCreationStatus, fetchChangesList, updateChangesList, updateAudioRequest, getBackgroundImageStatus, fetchSpeakerList, getBackgroundImageUrls } from "../api/projectApi";
//import scriptData from "../data/scriptData";
//import AudioData from "../data/audioData.json";
//import animationScriptData from "../data/animationScriptData";

import SampleAudioData from "../DevSampleData/audio.json";
import SampleSpeakerData from "../DevSampleData/speaker.json"
import SampleAnimationScript from "../DevSampleData/animationScript.json"

import { TextureLoader } from "three";
const ProjectContext = createContext();

export const useProjectInfo= () => {
    return useContext(ProjectContext);
}


export const ProjectInfoProvider = ({children}) => {

    var projectId = 1;
    // download test
    const [currentStage, setCurrentStage] = useState(-1);
    //
    const [scriptData, setScriptData] = useState();
    const [script,setScript] = useState([]);
    const [changesList, setChangesList] = useState([]);
    const [animationScript,setAnimationScript] = useState([]);
    const [speakerList, setSpeakerList] = useState([]);
    const [audioData,setAudioData] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [canavsLoaded,setCanvasLoaded] = useState(false);
    const [canavsLoadingMessage, setCanvasLoadingMessage] = useState("Creating Your Video :)")
    const [save, setSave] = useState(false);
    const [alert,setAlert] = useState(true);
    const [alertMessage,setAlertMessage] = useState(true);
    const [backgroundTextureArray,setBackgroundTextureArray] = useState([]);



    const getScript = async () => {
        //console.log(scriptData.scenes);
        const scriptDa = await fetchScript("1");
        const changesListDa = await fetchChangesList("1");
        //console.log(scriptDa);
        setScriptData(scriptDa);
        setChangesList(changesListDa);
        setScript(scriptDa.scenes);
     }

     const getSpeakerList = async () => {
        const sl = await fetchSpeakerList(1);
        console.log("Sl",sl);
        setSpeakerList(sl);
     }

    const getAnimationScript = async (projectId) => {
        setIsLoading(true);
        const animationScriptData = await fetchAnimationScript("1");
        console.log(animationScriptData);
        setAnimationScript(animationScriptData);
        setIsLoading(false);
     }

     const getAudio = async (projectId) => {
        console.log("Fetching audio..")
        return new Promise(async (resolve, reject) => {
           try{
                const audioResponse = await fetchAudioData(projectId);
                 if(audioResponse.status == -1){ /*retry*/ resolve(); return;};
                if(audioResponse.status == 1){
                    console.log("Audio Data Already Present! setting it!");
                     setAudioData(audioResponse.data);
                     //setCanvasLoaded(true);
                     resolve();
                    return;
                }
                if(audioResponse.status == 0 || audioResponse.status == 2)
                {
                    console.log("Audio Data Not Present! Creating Audio!");
                    const audioCreationRequestResponse = (audioResponse.status == 2)?await updateAudioRequest(projectId):await createAudioRequest(projectId);
                    if(audioCreationRequestResponse == 0){ /*retry*/ resolve(); return; };
                    if(audioCreationRequestResponse)
                    {
                        // fetch Status periodically
                        const fetchInterval = setInterval(async () => {
                            const statusResponse = await getAudioCreationStatus(projectId);
                            if(statusResponse.status == 0){ /*retry*/ 
                                clearInterval(fetchInterval); 
                                resolve();
                                return}
                            if(statusResponse.status == 2)
                            {
                                const audioResponse = await fetchAudioData(projectId);
                                console.log("Audio Created Successfully!");
                                setAudioData(audioResponse.data);
                                clearInterval(fetchInterval);
                                //setCanvasLoaded(true);
                                resolve();
                                return;
                            }
                            if(statusResponse.status == 1)
                            {
                                console.log("Audio Status : "+ statusResponse.status);
                                setCanvasLoadingMessage(statusResponse.message);
                            }
                        }, 5000)
                       
                    }
                }
           }
           catch(err)
           {
                console.log("error");
                reject(err);
                return;
           }
        });
     }

     const getBackgroundImage = async (projectId) => {

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

        console.log("creating background image");
        return new Promise((resolve, reject) => {
            try {
                const fetchStatus = setInterval(async () => {
                    const response = await getBackgroundImageStatus(projectId);
                    const status = response.status;
    
                    console.log("background image status:" + status);
                    
                    if (status === 1) {
                        const urls = await getBackgroundImageUrls(1);
                        console.log(urls);
                        const textureArray = await loadTextures(urls);
                        setBackgroundTextureArray(textureArray);
                        clearInterval(fetchStatus);  
                        resolve(); 
                    }
                }, 5000);
            } catch (err) {
                console.log("error");
                clearInterval(fetchStatus);  
                reject(err); 
            }
        });
     }

     const generateScript = async (prompt) => {
            setIsLoading(true);
            const scriptData = await fetchGeneratedScript("1",prompt);
            await updateChangesList("1", []);
            setScript(scriptData.scenes);
            setChangesList([]);
            setIsLoading(false);
     }

     const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

     const getAnimationData = async () => {
         setCanvasLoaded(false);
         console.log("pelo pelo");
         //download test
        //  Promise.all([getAnimationScript(),getAudio(1), getBackgroundImage(1),delay(1)]).then(
        //     () => {
        //         console.log("bale bale");
        //         setCanvasLoaded(true);
        //     }
        //  )
        //
        setAudioData(SampleAudioData);
        setAnimationScript(SampleAnimationScript);
        console.log(SampleAnimationScript);
        setSpeakerList(SampleSpeakerData.speakerList);
        await getBackgroundImage(1);
        setCanvasLoaded(true);
     }

     const saveContentToServer = async () => {
        try{
            if(currentStage == 1)
            {
                const copySD = {...scriptData, scenes : script}
                await updateScript("1",copySD);
                await updateChangesList("1",changesList);
                setAlert(true);
                setAlertMessage("Script Successfully Saved!");
                setSave(false);
                return;
            }

            if(currentStage == 2)
            {
                console.log(animationScript);
                await updateAnimationScript("1",animationScript);
                setAlert(true);
                setAlertMessage("Animation Script Successfully Saved!");
                setSave(false); 
            }
        }
        catch(err){

        }

     }

     const resetContent = async () => {
        if(currentStage == 1)
        {
            await getScript();
            setAlert(true);
            setAlertMessage("The script has been reset successfully!");
            setSave(false);
        }
        if(currentStage == 2)
        {
            await getAnimationScript();
            setAlert(true);
            setAlertMessage("The Animation Script has been reset successfully!");
            setSave(false);
        }
     }

     const handleNext = async (v) => {
         if(save){
            setAlert(true);
            setAlertMessage("Please save or reset your changes to proceed!");
            return;
         }
         setCurrentStage(v);
     }

    
    useEffect(() => {
        if(currentStage == 1){
            getScript();
            getSpeakerList();
            return;
        }
        if(currentStage == 2){
            getAnimationData();
            return;
        }
        if(currentStage == -1)
        {
            getAnimationData();
        }
       //setScript(getScript());
    },[currentStage])

    return (
        <ProjectContext.Provider value={{currentStage,
        setCurrentStage,
        script,
        setScript,
        animationScript,
        setAnimationScript,
        speakerList,
        setSpeakerList,
        audioData,
        generateScript,
        canavsLoaded,
        setCanvasLoaded,
        canavsLoadingMessage,
        save,
        setSave,
        saveContentToServer,
        resetContent,
        alert,
        setAlert,
        alertMessage,
        handleNext,
        isLoading,
        changesList,
        setChangesList,
        backgroundTextureArray}}>
            {children}
        </ProjectContext.Provider>
    )
}