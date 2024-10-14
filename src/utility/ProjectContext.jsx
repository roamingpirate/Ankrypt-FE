import React, {useState, useContext, createContext, useEffect} from "react";
import { fetchGeneratedScript, fetchScript, fetchAnimationScript, updateScript, updateAnimationScript, fetchAudioData, createAudioRequest, getAudioCreationStatus, fetchChangesList, updateChangesList, updateAudioRequest } from "../api/projectApi";
//import scriptData from "../data/scriptData";
import AudioData from "../data/audioData.json";
//import animationScriptData from "../data/animationScriptData";
const ProjectContext = createContext();

export const useProjectInfo= () => {
    return useContext(ProjectContext);
}

const speakersListD = [
    {
      avatarName: "Jordan",
      avatar: "av",
      avatarUrl: "https://models.readyplayer.me/670be6ab9e494b4895c729bd.glb?morphTargets=ARKit,Oculus%20Visemes",
      avatarId: "670ce9d48b2330afb3d7eaf9",
      gender: "female"
    },
    {
      avatarName: "Michael",
      avatar: "av",
      avatarUrl: "https://models.readyplayer.me/670be6ab9e494b4895c729bd.glb?morphTargets=ARKit,Oculus%20Visemes",
      avatarId: "670ce9d48b2330afb3d7eaf9",
      gender:"female",
    },
    // {
    //   avatarName: "Don",
    //   avatar: "av",
    //   avatarUrl: "https://models.readyplayer.me/670be6ab9e494b4895c729bd.glb?morphTargets=ARKit,Oculus%20Visemes&quality=high"
    // }
  ]


export const ProjectInfoProvider = ({children}) => {

    var projectId = 1;
    const [currentStage, setCurrentStage] = useState(1);
    const [scriptData, setScriptData] = useState();
    const [script,setScript] = useState([]);
    const [changesList, setChangesList] = useState([]);
    const [animationScript,setAnimationScript] = useState([]);
    const [speakerList, setSpeakerList] = useState(speakersListD);
    const [audioData,setAudioData] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [canavsLoaded,setCanvasLoaded] = useState(false);
    const [canavsLoadingMessage, setCanvasLoadingMessage] = useState("Creating Your Video :)")
    const [save, setSave] = useState(false);
    const [alert,setAlert] = useState(true);
    const [alertMessage,setAlertMessage] = useState(true);


    const getScript = async () => {
        //console.log(scriptData.scenes);
        const scriptDa = await fetchScript("1");
        const changesListDa = await fetchChangesList("1");
        //console.log(scriptDa);
        setScriptData(scriptDa);
        setChangesList(changesListDa);
        setScript(scriptDa.scenes);
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
           try{
                const audioResponse = await fetchAudioData(projectId);
                 if(audioResponse.status == -1){ /*retry*/ return;};
                if(audioResponse.status == 1){
                    console.log("Audio Data Already Present! setting it!");
                    setAudioData(audioResponse.data);
                    return;
                }
                if(audioResponse.status == 0 || audioResponse.status == 2)
                {
                    console.log("Audio Data Not Present! Creating Audio!");
                    const audioCreationRequestResponse = (audioResponse.status == 2)?await updateAudioRequest(projectId):await createAudioRequest(projectId);
                    if(audioCreationRequestResponse == 0){ /*retry*/ return; };
                    if(audioCreationRequestResponse)
                    {
                        // fetch Status periodically
                        const fetchInterval = setInterval(async () => {
                            const statusResponse = await getAudioCreationStatus(projectId);
                            if(statusResponse.status == 0){ /*retry*/ 
                                clearInterval(fetchInterval); 
                                return}
                            if(statusResponse.status == 2)
                            {
                                const audioResponse = await fetchAudioData(projectId);
                                console.log("Audio Created Successfully!");
                                setAudioData(audioResponse.data);
                                clearInterval(fetchInterval);
                                setCanvasLoaded(true);
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
                return;
           }
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
         Promise.all([getAnimationScript(),getAudio(1), delay(1)]).then(
            () => {
                console.log("bale bale");
                
            }
         )
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
            return;
        }
        if(currentStage == 2){
            getAnimationData();
            return;
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
        AudioData,
        generateScript,
        canavsLoaded,
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
        setChangesList}}>
            {children}
        </ProjectContext.Provider>
    )
}