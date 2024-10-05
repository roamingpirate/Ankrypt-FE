import axios from 'axios';


const url = "http://localhost:3000";


export const fetchScript = async (projectId) => {
    const response = await axios.get(`${url}/script`);

    return JSON.parse(response.data);
}

export const fetchGeneratedScript = async (projectId, prompt) => {
    const response = await axios.post(`${url}/script`,prompt);
    console.log(response.data);
    return JSON.parse(response.data);
}
//http://localhost:3000/animationScript

export const fetchAnimationScript = async (projectId) => {
    const response = await axios.get(`${url}/animationScript`);
    console.log(response.data);
    return response.data;
}