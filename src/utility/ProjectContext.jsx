import React, {useState, useContext, createContext, useEffect} from "react";
import { fetchGeneratedScript, fetchScript, fetchAnimationScript } from "../api/projectApi";
import scriptData from "../data/scriptData";

const ProjectContext = createContext();

export const useProjectInfo= () => {
    return useContext(ProjectContext);
}



export const ProjectInfoProvider = ({children}) => {

    var projectId = 1;
    const [currentStage, setCurrentStage] = useState(1);
    const [script,setScript] = useState([]);
    const [animationScript,setAnimationScript] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

    const getScript = async () => {
        console.log(scriptData.scenes);
        setScript(scriptData.scenes);
     }

    const getAnimationScript = async () => {
        const animationScriptData = await fetchAnimationScript("1");
        setAnimationScript(animationScriptData);
     }

     const generateScript = async (prompt) => {
            setIsLoading(true);
            const scriptData = await fetchGeneratedScript("1",prompt);
            setScript(scriptData.scenes);
            setIsLoading(false);
     }

    
    useEffect(() => {
        if(currentStage == 1){
            getScript();
            return;
        }
        if(currentStage == 2){
            getAnimationScript();
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
        isLoading}}>
            {children}
        </ProjectContext.Provider>
    )
}