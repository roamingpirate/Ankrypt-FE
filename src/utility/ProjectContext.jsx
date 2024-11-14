import React, {useState, useContext, createContext, useEffect} from "react";
import { fetchGeneratedScript, fetchScript, fetchAnimationScript, updateScript, updateAnimationScript, fetchAudioData, createAudioRequest, getAudioCreationStatus, fetchChangesList, updateChangesList, updateAudioRequest, getBackgroundImageStatus, fetchSpeakerList, getBackgroundImageUrls, getProjectDetail } from "../api/projectApi";
//import scriptData from "../data/scriptData";
//import AudioData from "../data/audioData.json";
//import animationScriptData from "../data/animationScriptData";

import SampleAudioData from "../DevSampleData/audio.json";
import SampleSpeakerData from "../DevSampleData/speaker.json"
import SampleAnimationScript from "../DevSampleData/animationScript.json"
import { useLocation,useParams } from "react-router-dom";

import { TextureLoader } from "three";
import { useAuth0 } from "@auth0/auth0-react";
const ProjectContext = createContext();

export const useProjectInfo= () => {
    return useContext(ProjectContext);
}

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


export const ProjectInfoProvider = ({children}) => {

    //var projectId = 1;
    // download test
    const test=0;
    const [currentStage, setCurrentStage] = useState(1);
    const { projectId } = useParams();
    //
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
    const [backgroundTextureArray,setBackgroundTextureArray] = useState([]);
    const [error, setError] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [projectName, setProjectName] = useState("");
    const {user, isAuthenticated, loginWithPopup} = useAuth0();



    const getScript = async () => {
        //console.log(scriptData.scenes);
        const scriptDa = await fetchScript(projectId);
        const changesListDa = await fetchChangesList(projectId);
        //console.log(scriptDa);
        setScriptData(scriptDa);
        setChangesList(changesListDa);
        setScript(scriptDa.scenes);
     }

     const getSpeakerList = async () => {
        const sl = await fetchSpeakerList(projectId);
        console.log("Sl",sl);
        setSpeakerList(sl);
     }

    const getAnimationScript = async () => {
        setIsLoading(true);
        const animationScriptData = await fetchAnimationScript(projectId);
        console.log(animationScriptData);
        setAnimationScript(animationScriptData);
        setIsLoading(false);
     }

     const getAudio = async () => {
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

     const getBackgroundImage = async () => {

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

            //download sample

            if(test){

            const urls = [
                "https://ankript-web-app-storage.s3.us-east-1.amazonaws.com/1/back0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQ7X4LCX37B4KPIW6%2F20241022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241022T151919Z&X-Amz-Expires=36000&X-Amz-Signature=699cd7c1af69b75a70c6db5a2815108387e4cf7858d64db3fe29190184238062&X-Amz-SignedHeaders=host&x-id=GetObject",
                "https://ankript-web-app-storage.s3.us-east-1.amazonaws.com/1/back1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQ7X4LCX37B4KPIW6%2F20241022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241022T151919Z&X-Amz-Expires=36000&X-Amz-Signature=8e4c099f8a7ddd630428c4a94c80a06f85a057babcd5d793a2bdaada0fa4d93c&X-Amz-SignedHeaders=host&x-id=GetObject",
                "https://ankript-web-app-storage.s3.us-east-1.amazonaws.com/1/back2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQ7X4LCX37B4KPIW6%2F20241022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241022T151919Z&X-Amz-Expires=36000&X-Amz-Signature=231c1a1d882c29606ed1c899c093b175c6b66a101639d098ae05e733ed63e4c4&X-Amz-SignedHeaders=host&x-id=GetObject",
                "https://ankript-web-app-storage.s3.us-east-1.amazonaws.com/1/back3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQ7X4LCX37B4KPIW6%2F20241022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241022T151919Z&X-Amz-Expires=36000&X-Amz-Signature=6e205060a5812c341af6c3b2577da7bd48728381a16c4b7ebd1c460f6c6f4232&X-Amz-SignedHeaders=host&x-id=GetObject",
                "https://ankript-web-app-storage.s3.us-east-1.amazonaws.com/1/back4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQ7X4LCX37B4KPIW6%2F20241022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241022T151919Z&X-Amz-Expires=36000&X-Amz-Signature=8c085a4b372f6373110d02d61afd70f542d050b35ceedd4f78923c1b60271b51&X-Amz-SignedHeaders=host&x-id=GetObject",
                "https://ankript-web-app-storage.s3.us-east-1.amazonaws.com/1/back5.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQ7X4LCX37B4KPIW6%2F20241022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241022T151919Z&X-Amz-Expires=36000&X-Amz-Signature=ceb881c92bff7af559c75b782c67bb3b39c739194123011082c151ff7ad0dc0e&X-Amz-SignedHeaders=host&x-id=GetObject"
            ]
                        console.log(urls);
                        const textureArray = await loadTextures(urls);
                        setBackgroundTextureArray(textureArray);

        console.log("creating background image");
            }
            else{
        return new Promise((resolve, reject) => {
            try {
                const fetchStatus = setInterval(async () => {
                    const response = await getBackgroundImageStatus(projectId);
                    const status = response.status;
    
                    console.log("background image status:" + status);
                    
                    if (status === 1) {
                        clearInterval(fetchStatus); 
                        const urls = await getBackgroundImageUrls(projectId);
                        console.log(urls);
                        const textureArray = await loadTextures(urls);
                        setBackgroundTextureArray(textureArray);
                         
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
     }

     const generateScript = async (prompt) => {
            setIsLoading(true);
            const scriptData = await fetchGeneratedScript(projectId,prompt);
            await updateChangesList(projectId, []);
            setScript(scriptData.scenes);
            setChangesList([]);
            setIsLoading(false);
     }

     const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

     const getAnimationData = async () => {
         setCanvasLoaded(false);
         console.log("pelo pelo");
         //download test
         if(!test){
         Promise.all([getAnimationScript(),getAudio(), getBackgroundImage()]).then(
            () => {
                console.log("bale bale");
                setCanvasLoaded(true);
            }
         )
         }
         else{
        setAudioData(SampleAudioData);
        setAnimationScript(SampleAnimationScript);
        console.log(SampleAnimationScript);
        setSpeakerList(SampleSpeakerData.speakerList);
        await getBackgroundImage(1);
        setCanvasLoaded(true);
         }
     }

     const saveContentToServer = async () => {
        try{
            if(currentStage == 1)
            {
                const copySD = {...scriptData, scenes : script}
                await updateScript(projectId,copySD);
                await updateChangesList(projectId,changesList);
                setAlert(true);
                setAlertMessage("Script Successfully Saved!");
                setSave(false);
                return;
            }

            if(currentStage == 2)
            {
                console.log(animationScript);
                await updateAnimationScript(projectId,animationScript);
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
            getSpeakerList();
            return;
        }
        if(currentStage == -1)
        {
            getAnimationData();
        }
       //setScript(getScript());
    },[currentStage,projectId])

    useEffect(() => {
        console.log("pwpwpwp");
       // console.log(projectId,projectName);
       if(!isAuthenticated)
       {
          setError("You must be logged In");
          loginWithPopup();
          setIsPageLoading(false);
       }
       else{
          const validate = async () => {
             const res = await getProjectDetail(user.email, projectId);
             if(res.status == 0)
             {
                setError(`Project with id ${projectId} not found!`);
                setIsPageLoading(false);
             }
             else{
                setProjectName(res.projectName);
                setError("");
                setIsPageLoading(false);
             }
          } 
          validate();
       }

    },[isAuthenticated]);

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
        backgroundTextureArray,
        isPageLoading,
        error,
        projectName,
        projectId}}>
            {children}
        </ProjectContext.Provider>
    )
}