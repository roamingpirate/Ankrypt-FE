import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

self.onmessage = async (e) => {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load();

    const webmBlob = e.data;
    const arrayBuffer = await webmBlob.arrayBuffer();
    console.log("lol ");
    // Write WebM data to FFmpeg's virtual file system
    await ffmpeg.writeFile("input.webm", new Uint8Array(arrayBuffer));

    // Run the conversion command to MP4
    await ffmpeg.exec(['-i', 'input.webm', 'output.mp4']);

    // Read the converted MP4 file from FFmpeg's virtual file system
    const data = await ffmpeg.readFile('output.mp4');

    // Create a Blob from the MP4 data
    const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });

    // Post the MP4 Blob back to the main thread
    self.postMessage(mp4Blob);
};
