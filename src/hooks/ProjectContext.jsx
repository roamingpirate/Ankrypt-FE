import React, {useState, useContext, createContext, useEffect, useRef} from "react";
import { fetchGeneratedScript, fetchScript, fetchAnimationScript, updateScript, updateAnimationScript,fetchSpeakerList, getBackgroundImageUrls, getProjectDetail, fetchIsNewStatus, setIsNewToFalse, getAudioFile, updateVideoRecordStatus } from "../api/projectApi";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { processAudioFiles } from "../utility/audioConversion";
import { loadTextures } from "../utility/loadTexture";
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import { createAudioJob, fetchAudioCreationStatus } from "../api/audioApi";

const speakersListD = [
    {
      avatarName: "Jordan",
      avatar: "av",
      avatarUrl: "https://models.readyplayer.me/672e0f1bb1448fd6b482c385.glb?morphTargets=ARKit,Oculus%20Visemes",
      avatarId: "672e0f1bb1448fd6b482c385",
      gender: "male",
      vgender: "male",
    },
    {
      avatarName: "Anaya",
      avatar: "av",
      avatarUrl: "https://models.readyplayer.me/672e0f19f8bb2fcf50cc6409.glb?morphTargets=ARKit,Oculus%20Visemes",
      avatarId: "672e0f19f8bb2fcf50cc6409",
      gender:"female",
      vgender:"female",
    },
]

const ProjectContext = createContext();
export const useProjectInfo= () => {
    return useContext(ProjectContext);
}

export const ProjectInfoProvider = ({children}) => {

    const [currentStage, setCurrentStage] = useState(1);
    const { projectNo } = useParams();
    const [projectId, setProjectId] = useState("");
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
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [alert,setAlert] = useState(true);
    const [alertMessage,setAlertMessage] = useState(true);
    const [backgroundTextureArray,setBackgroundTextureArray] = useState([]);
    const [error, setError] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [projectName, setProjectName] = useState("");
    const {user, isAuthenticated, loginWithPopup} = useAuth0();
    const [userStatus, setUserStatus] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [currentActive, setCurrentActive] = useState(0);
    const [audioMap,setAudioMap] = useState();
    const [isAnimationDataLoaded, setIsAnimationDataLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg())
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

    const load = async () => {
      console.log("Started Loading");
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on('log', ({ message }) => {
          console.log(message);
      });
      await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setFfmpegLoaded(true);
      console.log("Loaded");
    }
  
    useEffect(() => {
      load();
    },[])


    const getScript = async () => {
        setIsLoading(true);
        console.log(projectId)
        const scriptDa = await fetchScript(projectId);
        setScriptData(scriptDa);
        setScript(scriptDa.scenes);
        setIsLoading(false);
     }

     const getSpeakerList = async () => {
        const sl = await fetchSpeakerList(projectId);
        setSpeakerList(sl);
     }

    const getAnimationScript = async () => {
        setIsLoading(true);
        const animationScriptData = await fetchAnimationScript(projectId);
        setAnimationScript(animationScriptData);
        setIsLoading(false);
    }

    const fetchAudio = async () => {
        console.log("Starting audio job creation...");
    
        const createResponse = await createAudioJob(projectId);
        
        if (createResponse.status === 1) {
            console.log("Audio job created successfully. Polling status...");
    
            let statusResponse = await fetchAudioCreationStatus(projectId);
            
            while (statusResponse.status !== 1) {
                if (statusResponse.status === -1) {
                    console.log("Audio creation not started.");
                    break;
                }
                console.log("Audio creation in progress...");
                await new Promise(resolve => setTimeout(resolve, 10000));
                statusResponse = await fetchAudioCreationStatus(projectId);
            }
    
            if (statusResponse.status === 1) {
                console.log("Audio created successfully!");
    
                const audioFileD = statusResponse.message;
                setAudioData(audioFileD);
                const audioMap = await processAudioFiles(audioFileD);
                setAudioMap(audioMap);
            }
        } else {
            console.error("Failed to create audio job:", createResponse.message);
        }
    }
      

     const getBackgroundImage = async () => {
        const urls = await getBackgroundImageUrls(projectId);
        console.log("urls",urls);
        const textureArray = await loadTextures(urls);
        setBackgroundTextureArray(textureArray);
     }

     const generateScript = async (prompt) => {
            setIsLoading(true);
            const scriptData = await fetchGeneratedScript(projectId,prompt);
            await updateVideoRecordStatus(projectId,false);
            setIsAnimationDataLoaded(false); 
            setScript(scriptData.scenes);
            setIsLoading(false);
     }

     const getAnimationData = async () => {
         if(isAnimationDataLoaded) return;
         setCanvasLoaded(false);
         await Promise.all([getAnimationScript(),fetchAudio(), getBackgroundImage()]);
         setIsAnimationDataLoaded(true);
         setCanvasLoaded(true);
     }

     const removeEmptySpeech = (scriptDataa) => {
        scriptDataa.scenes = scriptDataa.scenes.map(scene => {
          return {
            ...scene,
            script: scene.script.filter(item => item.Speech.trim() !== "")
          };
        });
        return scriptDataa;
      }

     const saveContentToServer = async () => {
        try{
            if(currentStage == 1)
            {
                let copySD = {...scriptData, scenes : script}  
                copySD = removeEmptySpeech(copySD);
                setSaveDisabled(true);   
                setAlert(true);
                setAlertMessage("Saving your Script!");
                await updateScript(projectId,copySD);
                await updateVideoRecordStatus(projectId,false);
                setIsAnimationDataLoaded(false);
                setAlert(true);
                setAlertMessage("Script Successfully Saved!");
                setSave(false);
                setSaveDisabled(false);   
                return;
            }

            if(currentStage == 2)
            {
                console.log(animationScript);
                setSaveDisabled(true);   
                setAlert(true);
                setAlertMessage("Saving your Animation Script!");
                await updateAnimationScript(projectId,animationScript);
                await updateVideoRecordStatus(projectId,false);
                setAlert(true);
                setAlertMessage("Animation Script Successfully Saved!");
                setSave(false); 
                setSaveDisabled(false); 
            }
        }
        catch(err){
            console.log(err);
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
         if(v == 2 && (script.length == 0 || isLoading === true))
         {
            setAlert(true);
            setAlertMessage("Please Create Script to proceed!");
            return;
         }
         if(v == 3 && !isAnimationDataLoaded)
         {
            setAlert(true);
            setAlertMessage("Animation Data Is Loading!");
            return;
         }
         setCurrentStage(v);
     }

     const userStatusFetch = async () => {
        const resp = await fetchIsNewStatus(user.email);
        setUserStatus(resp.status);
     }

     const updateUserStatus = async () => {
        await setIsNewToFalse(user.email);
     }

    
    useEffect(() => {
        if(projectId == undefined)
        {
            return;
        }
        if(currentStage == 1){
            getScript();
            userStatusFetch();
            return;
        }
        if(currentStage == 2){
            getAnimationData();
            getSpeakerList();
            if(userStatus == 1){updateUserStatus(user.email)}
            return;
        }
    },[currentStage,projectId])

    useEffect(() => {
        if(userStatus == 1)
        {
            setShowTooltip(true);
        }
        else{
            setShowTooltip(false);
        }
    },[userStatus, currentStage])

    useEffect(() => {
        setIsPageLoading(true);
        if(!isAuthenticated)
        {
            setError("You must be logged In");
            loginWithPopup();
            setIsPageLoading(false);
        }
        else{
            const validate = async () => {
                const res = await getProjectDetail(user.email, projectNo);
                setError("Fetching project")
                if(res.status == 0)
                {
                    setError(`Project with no ${projectNo} not found!`);
                    setIsPageLoading(false);
                }
                else{
                    setProjectName(res.projectName);
                    setProjectId(user.email+"_"+projectNo);
                    setError("");
                    setIsPageLoading(false);
                }
            } 
            validate();
        }
    },[isAuthenticated]);

    useEffect(()=>{
        const SpeakerListSet = async () => {
            if(projectId!="")
            {
                const sl = await fetchSpeakerList(projectId);
                if(sl.length != 0){
                    setSpeakerList(sl);
                }
            }
        }
        SpeakerListSet();
    },[projectId])

    return (
        <ProjectContext.Provider value={{
        currentStage,
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
        saveDisabled,
        saveContentToServer,
        resetContent,
        alert,
        setAlert,
        alertMessage,
        handleNext,
        isLoading,
        changesList,
        setChangesList,
        backgroundTextureArray,
        isPageLoading,
        error,
        projectName,
        projectId,
        userStatus,
        showTooltip,
        setShowTooltip,
        isRecording,
        setIsRecording,
        currentActive, 
        setCurrentActive,
        audioMap,
        isAnimationDataLoaded,
        ffmpegRef,
        ffmpegLoaded
        }}>
            {children}
        </ProjectContext.Provider>
    )
}