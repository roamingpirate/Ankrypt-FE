import axios from 'axios';

// Helper function to convert ArrayBuffer to Base64 string
const arrayBufferToBase64 = (arrayBuffer) => {
    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = '';
    uint8Array.forEach(byte => {
        binaryString += String.fromCharCode(byte);
    });
    return window.btoa(binaryString); // Use the browser's btoa() function to convert binary to Base64
}

// Function to convert audio to Base64 using axios
const convertAudioToBase64 = async (audioUrl) => {
    try {
        const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        const base64String = arrayBufferToBase64(response.data);
        return base64String;
    } catch (error) {
        console.error('Error fetching audio:', error);
        return null;
    }
}

// Function to process audio files and convert them to Base64
export const processAudioFiles = async (array) => {
    const audioMap = new Map();
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            for (let k = 0; k < array[i][j].length; k++) {
                const audioFile = array[i][j][k];
                const audioUrl = audioFile.audio;
                const base64Audio = await convertAudioToBase64(audioUrl);
                if (base64Audio) {
                    const key = `${i}_${j}_${k}`;
                    audioMap.set(key, base64Audio);
                }
            }
        }
    }
    return audioMap;
}