import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import { PlayerController, usePlayer } from '../canvas/hooks/usePlayer'
import { Podcast1 } from '../canvas/components/Scenes/PodcastScene1';
import {PerspectiveCamera,ContactShadows } from "@react-three/drei";
import { Grid2, Paper , Button, IconButton} from "@mui/material";

const RotatingBox = () => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const CaptureFrames = ({ capturing, setFrames }) => {
  const { gl } = useThree();
  const delta = useRef(0); // Accumulator for deltaTime
  const frameRate = 30; // Desired frame rate
  const timePerFrame = 1 / frameRate; // Time per frame in seconds (1/30)

  useEffect(() => {
      setFrames([]);
  }, [capturing] );

  useFrame((state, deltaTime) => {
    delta.current += deltaTime; // Accumulate the deltaTime

    if (delta.current >= timePerFrame) {
      // Enough time has passed, render the frame
      delta.current = 0; // Reset accumulator
      // Place your scene update logic here
      if(capturing){
      const dataURL = gl.domElement.toDataURL();
      setFrames((prevFrames) => [...prevFrames, dataURL]);
      console.log("Frame rendered"); // Example: log every frame rendered at 30 FPS
      }
    }
  });

  return null;
};


export const CanvasRecorder = () => {
  const [frames, setFrames] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const ffmpegRef = useRef(new FFmpeg())
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    console.log("Started Loading");
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
       // messageRef.current.innerHTML = message;
        console.log(message);
    });

    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    setLoaded(true);
    console.log("Loaded");
  }

  useEffect(() => {
    load();
  },[])

  const handleCaptureToggle = () => {
    setCapturing((prev) => !prev);
  };


  const downloadFrames = async () => {
    console.log("Downloading frames");
    if (frames.length === 0) {
      alert('No frames captured. Please start capturing first.');
      return;
    }
  
    if (!loaded) {
      console.log("not loaded");
      return;
    }
  
    console.log("loaded - downloading frames");
    const promises = frames.map(async (frame, index) => {
      const response = await fetch(frame);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
  
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `frame_${index}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // Remove the anchor element after the download
  
      console.log("Frame downloaded:", index);
    });
  
    await Promise.all(promises);
    console.log("All frames have been downloaded.");
  };
  

  const createVideo = async () => {
    console.log("creating video");
      if (frames.length === 0) {
        alert('No frames captured. Please start capturing first.');
        return;
      }
      setCapturing(false);
      if(!loaded)
      {
        console.log("not loaded");
        return;
      }

    console.log("loaded - creating video ");
    const ffmpeg = ffmpegRef.current;

    for (let index = 0; index < frames.length; index++) {
      const frame = frames[index];
      
      const response = await fetch(frame);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      
      await ffmpeg.writeFile(`frame_${index}.png`, new Uint8Array(arrayBuffer));
      console.log("Frame processed:", index);
    }
    
    console.log("All frames have been processed.");

    // Generate a video from the frames
    await ffmpeg.exec(
      ['-framerate', '60',
      '-i', 'frame_%d.png',
      '-pix_fmt', 'yuv420p',
      'output.mp4']
    );

    // Retrieve the video file
    const data = await ffmpeg.readFile('output.mp4');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);

    setVideoUrl(videoUrl);
  };

  const { setAnimationState, setVideoState, videoState,currentSceneIndex,setCurrentSceneIndex,updateAnimationState} = usePlayer();

  return (
    <>
      <button onClick={() => {
          handleCaptureToggle();     
          if(videoState != "playing"){
            setVideoState("Playing")
          }}}>
        {capturing ? 'Stop Capture' : 'Start Capture'}
      </button>

      <button onClick={() => {createVideo();setVideoState("Paused")}} disabled={frames.length === 0}>
        Create Video
      </button>

        {videoUrl && (
          <video controls style={{width:'800px'}}>
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
         
              <Paper elevation={5} style={{display:'grid', width:'800px', height:'1000px', margin:'7px',backgroundColor:'white', borderRadius:'10px'}}>
              <Canvas gl={{ preserveDrawingBuffer: true }} style={{borderRadius:'10px'}} shadows>
              <PerspectiveCamera
                  makeDefault
                  position={[0, 0, 2]}
                  fov={50}
                  near={0.1}
                  far={1000}
                  // ref={cameraRef}
                />
                <Podcast1/>
                 {/* <RotatingBox/> */}
                <CaptureFrames capturing={capturing} setFrames={setFrames} />
              </Canvas>
              </Paper>
              <Grid2>
                {/* <AnimationEditor/> */}
              </Grid2>
                {/* <AnimationEditor/> */}
    </>
  );
}
