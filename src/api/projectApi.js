import axios from 'axios';


const url = "http://localhost:3000";


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

