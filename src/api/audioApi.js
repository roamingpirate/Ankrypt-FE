import api from 'axios';

const axios = api.create({
    //baseURL: "https://api.ancript.com",
    baseURL: "http://35.192.90.186:8081",
    timeout: 0,
});


const url = "http://35.192.90.186:8081";


export const createAudioJob = async (projectId) => {
    try{
        const response = await axios.post(`${url}/audio/create/${projectId}`)
        return {message: "job created", status: 1}
    }
    catch(err)
    {
        return {message: err, status: -2}
    }
}

export const fetchAudioCreationStatus = async (projectId) => {
    try{
        const response = await axios.get(`${url}/audio/status/${projectId}`)
        return response.data;
    }
    catch(err)
    {
        return {message: err, status: -2}
    }   
}