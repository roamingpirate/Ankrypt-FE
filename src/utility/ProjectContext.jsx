import React, {useState, useContext, createContext, useEffect} from "react";
import { fetchGeneratedScript, fetchScript, fetchAnimationScript, updateScript, updateAnimationScript } from "../api/projectApi";
//import scriptData from "../data/scriptData";
import AudioData from "../data/audioData.json";

const ProjectContext = createContext();

export const useProjectInfo= () => {
    return useContext(ProjectContext);
}



export const ProjectInfoProvider = ({children}) => {

    var projectId = 1;
    const [currentStage, setCurrentStage] = useState(1);
    const [scriptData, setScriptData] = useState();
    const [script,setScript] = useState([]);
    const [animationScript,setAnimationScript] = useState([]);
    const [audioData,setAudioData] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [canavsLoading,setCanvasLoading] = useState(false);
    const [save, setSave] = useState(false);
    const [alert,setAlert] = useState(true);
    const [alertMessage,setAlertMessage] = useState(true);

    const getScript = async () => {
        //console.log(scriptData.scenes);
        const scriptDa = await fetchScript("1");
        //console.log(scriptDa);
        setScriptData(scriptDa);
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
           setAudioData(AudioData);
     }

     const generateScript = async (prompt) => {
            setIsLoading(true);
            const scriptData = await fetchGeneratedScript("1",prompt);
            setScript(scriptData.scenes);
            setIsLoading(false);
     }

     const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

     const getAnimationData = async () => {
         setCanvasLoading(true);
         console.log("pelo pelo");
         Promise.all([getAnimationScript(),getAudio(), delay(4000)]).then(
            () => {
                console.log("bale bale");
                setCanvasLoading(false);
            }
         )
     }

     const saveContentToServer = async () => {
        try{
            if(currentStage == 1)
            {
                const copySD = {...scriptData, scenes : script}
                await updateScript("1",copySD);
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
        generateScript,
        save,
        setSave,
        saveContentToServer,
        resetContent,
        alert,
        setAlert,
        alertMessage,
        handleNext,
        isLoading}}>
            {children}
        </ProjectContext.Provider>
    )
}