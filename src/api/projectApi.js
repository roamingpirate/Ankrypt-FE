import api from 'axios';

const axios = api.create({
    baseURL: "https://api.ancript.com",
    //baseURL: "http://localhost:8080",
    headers: {
        'ngrok-skip-browser-warning': 'true' // Skip ngrok's warning page by default

    }
});


//const url = "http://localhost:8080";
const url = "https://api.ancript.com";


export const fetchScript = async (projectId) => {
    const response = await axios.get(`${url}/script/${projectId}`);

    return response.data;
}

export const updateScript = async (projectId,script) => {
    try{
        //console.log(JSON.stringify(script));
        const response = await axios.post(`${url}/script/update/${projectId}`, script);
    }
    catch(err)
    {
        console.log("error");
    }
}

export const fetchSpeakerList = async (projectId) => {
    const response = await axios.get(`${url}/speaker/${projectId}`);
    return response.data;
}

export const updateSpeakerList = async (projectId,speakerList) => {
    try{
        //console.log(JSON.stringify(script));
        const response = await axios.post(`${url}/speaker/update/${projectId}`, {speakerList: speakerList});
    }
    catch(err)
    {
        console.log("error");
    }
}

export const fetchChangesList = async (projectId) => {
    const response = await axios.get(`${url}/script/changes/${projectId}`);
    return response.data;
}

export const updateChangesList = async (projectId,changesList) => {
    const response = await axios.post(`${url}/script/changes/${projectId}`,{changesList: changesList});
}

export const fetchGeneratedScript = async (projectId, prompt) => {
    const response = await axios.post(`${url}/script/${projectId}`,prompt);
    console.log(response.data);
    return response.data;
}
//http://localhost:3000/animationScript


export const fetchAnimationScript = async (projectId) => {
    const response = await axios.get(`${url}/animationScript/${projectId}`);
    console.log(response.data);
    return response.data;
}

export const updateAnimationScript = async (projectId,animationScript) => {
    try{
        console.log("opop");
        console.log(animationScript);
        const response = await axios.post(`${url}/animationScript/update/${projectId}`,animationScript);
    }
    catch(err)
    {
        console.log("error");
    }
}


export const createAudioRequest = async (projectId) => {
    try{
        console.log("sending request to create audio for AS");
        const response = await axios.get(`${url}/audio/create/${projectId}`);
        return 1;
    }
    catch(err){
        return 0;
    }
}

export const updateAudioRequest = async (projectId) => {
    try{
        console.log("sending request to update audio for AS");
        const response = await axios.get(`${url}/audio/update/${projectId}`);
        return 1;
    }
    catch(err){
        return 0;
    }
}


export const getAudioCreationStatus = async (projectId) => {
    try{
        console.log("Getting Status");
        const response = await axios.get(`${url}/audio/status/${projectId}`);
        return response.data;
    }
    catch(err)
    {
        return {status : 0};
    }
}

export const fetchAudioData = async (projectId) => {
    try{
        console.log("Trying to get Audio Data");
        const response = await axios.get(`${url}/audio/${projectId}`);
        return response.data;
    }
    catch(err)
    {
        return {status : -1};
    }
}

export const createPartAudio  = async (projectId, sceneIndex, scriptIndex) => {
    try{
        console.log("Trying to create Part Audio ");
        const response = await axios.get(`${url}/audio/createPart/${projectId}/${sceneIndex}/${scriptIndex}`);
        return response.data;
    }
    catch(err)
    {
        return {status : -1};
    }
}

export const createAudioFile = async (projectId) => {
    try{
        console.log("Getting Audio File");
        const response = await axios.get(`${url}/audio/createAudioFile/${projectId}`);
        return response.data;
    }
    catch(err)
    {
        return {status : -1};
    }
}

export const getBackgroundImageStatus = async (projectId) => {
    try{
        console.log("Trying to get Image Data");
        const response = await axios.post(`${url}/background/${projectId}`);
        return response.data;
    }
    catch(err)
    {
        //return {status : -1};
        throw err;
    }   
};

export const getBackgroundImageUrls = async (projectId) => {
    try{
        console.log("Trying to get Image Urls");
        const response = await axios.get(`${url}/background/${projectId}`);
        return response.data;
    }
    catch(err)
    {
        //return {status : -1};
        throw err;
    }   
}

export const getBackgroundCoverUrl = async (projectId) => {
    try{
        console.log("Trying to get Backgroud image Url");
        const response = await axios.get(`${url}/background/cover/${projectId}`);
        console.log("opo",response)
        return response.data;
    }
    catch(err)
    {
        //return {status : -1};
        throw err;
    }   
}

export const addNewUser = async (userId) => {
    try {
        console.log("Trying to add new user");
        const response = await axios.post(`${url}/user/add/${userId}`);
        return response.data;
    } catch (err) {
        console.error("Error adding new user:", err);
        throw err;
    }
};

export const addUserRequest = async (userId,userName) => {
    try {
        console.log("Trying to add user request...");
        const response = await axios.post(`${url}/user/request/${userId}/${userName}`);
        return response.data;
    } catch (err) {
        console.error("Error adding new user:", err);
        throw err;
    }  
}

export const addProjectToUser = async (userId, projectName) => {
    try {
        console.log("Trying to add project to user");
        const response = await axios.post(`${url}/user/${userId}/add/${projectName}`);
        return response.data;
    } catch (err) {
        console.error("Error adding project to user:", err);
        throw err;
    }
};

export const getProjectList = async (userId) => {
    try {
        console.log("Trying to get project list");
        const response = await axios.get(`${url}/user/${userId}/projects`);
        return response.data.projectList;
    } catch (err) {
        console.error("Error fetching project list:", err);
        throw err;
    }
};


export const getProjectDetail = async (userId, projectId) => {
    try {
        console.log("Trying to get project Data");
        const response = await axios.get(`${url}/project/${userId}/${projectId}`);
        return response.data;
    } catch (err) {
        console.error("Error fetching project list:", err);
        throw err;
    }
}

export const getAvatarToken = async (userId) => {
    try {
        console.log("Trying to get Avatar Token Data");
        const response = await axios.get(`${url}/user/${userId}/avatarToken`);
        return response.data.token;
    } catch (err) {
        console.error("Error fetching project list:", err);
        throw err;
    }    
}

export const fetchIsNewStatus = async (userId) => {
    try {
        console.log(`Fetching isNew status for user: ${userId}`);
        const response = await axios.get(`${url}/user/status/${userId}`);
        return response.data; // Return the full response (status object)
    } catch (err) {
        console.error("Error fetching isNew status:", err);
        throw err;
    }
};

export const setIsNewToFalse = async (userId) => {
    try {
        console.log(`Setting isNew to false for user: ${userId}`);
        const response = await axios.post(`${url}/user/setIsNewFalse/${userId}`);
        return response.data; // Return the server response
    } catch (err) {
        console.error("Error setting isNew to false:", err);
        throw err;
    }
};

export const getConvertedVideo = async (projectId,data) => {
    console.log(projectId)
    try {
        const response = await api.post(`${url}/video/create/${projectId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.videoURL;
    } catch (error) {
        console.error("Error uploading video:", error);
    }
}