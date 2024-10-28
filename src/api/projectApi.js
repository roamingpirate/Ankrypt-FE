import axios from 'axios';


//const url = "http://192.168.152.238:3000";
const url = "";


export const fetchScript = async (projectId) => {
    const response = await axios.get(`${url}/script`);

    return response.data;
}

export const updateScript = async (projectId,script) => {
    try{
        //console.log(JSON.stringify(script));
        const response = await axios.post(`${url}/script/update`, script);
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
    const response = await axios.post(`${url}/script`,prompt);
    console.log(response.data);
    return response.data;
}
//http://localhost:3000/animationScript


export const fetchAnimationScript = async (projectId) => {
    const response = await axios.get(`${url}/animationScript`);
    console.log(response.data);
    return response.data;
}

export const updateAnimationScript = async (projectId,animationScript) => {
    try{
        console.log("opop");
        console.log(animationScript);
        const response = await axios.post(`${url}/animationScript/update`,animationScript);
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