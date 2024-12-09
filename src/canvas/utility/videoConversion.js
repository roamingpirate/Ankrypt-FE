import axios from 'axios'
import { updateVideoRecordStatus } from '../../api/projectApi';

const baseUrl = 'https://video.ancript.com'

export const uploadWebmVideo = async (blob,projectId) => {
    try {
      const response = await axios.post(`${baseUrl}/generate-signed-url/${projectId}.webm`);
      const { url } = response.data;

      const res = await fetch(url, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });
      await updateVideoRecordStatus(projectId,true);
      console.log('WebM video uploaded successfully');
    } catch (error) {
      console.error('Error uploading WebM video:', error);
    }
}

export const startConversionPolling = async (projectId) => {
    return new Promise(async (resolve, reject) => {
      let intervalId;
      const checkConversionStatus = async () => {
        try {
          const response = await axios.get(`${baseUrl}/video/convert/${projectId}`);
          const { status, link } = response.data;
          console.log("video Conversion Status", response.data);
          if (status === 1 && link) {
            clearInterval(intervalId);
            resolve(link);
          }
        } catch (error) {
          clearInterval(intervalId);
          reject(new Error("Error fetching video conversion info"));
        }
      };
  
      await checkConversionStatus();
      intervalId = setInterval(checkConversionStatus, 5000);
    });
};