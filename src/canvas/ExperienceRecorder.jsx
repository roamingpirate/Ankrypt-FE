import { Canvas, useThree} from "@react-three/fiber";
import {PerspectiveCamera,ContactShadows } from "@react-three/drei";
import { Leva } from "leva";
import React, { useEffect,useRef } from "react";
// import { AnimationEditor } from "./components/AnimationEditor";
import { Podcast2 } from "./components/Scenes/PodcastScene2";
import { Podcast1 } from "./components/Scenes/PodcastScene1";
import { ScriptEditPage } from "./pages/ScriptEditPage";
import { PodcastTransition } from "./components/Scenes/PodcastTransition";
import { PlayerController, usePlayer } from './hooks/usePlayer'
import { Grid2, Paper , Button, IconButton} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useProjectInfo } from "../utility/ProjectContext";
import { getConvertedVideo } from "../api/projectApi";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught an Error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}


const RecordingController = ({ canvasRef, setVideoURL }) => {
    const {
        setAnimationState,
        setVideoState,
        videoState,
        currentSceneIndex,
        setCurrentSceneIndex,
        updateAnimationState,
        mediaStreamAudioDestinationRef,
        audioContextRef
    } = usePlayer();
    const { isRecording, setIsRecording,projectId } = useProjectInfo();
    const recorderRef = useRef();
    const chunksRef = useRef([]);
    const isPausedDueToTabSwitch = useRef(false); // Track pause due to tab switch

    const startRecording = () => {
        const videoStream = canvasRef.current.captureStream(60); // 60 FPS
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

        mediaStreamAudioDestinationRef.current = audioContextRef.current.createMediaStreamDestination();

        const combinedStream = new MediaStream([
            ...videoStream.getTracks(),
            ...mediaStreamAudioDestinationRef.current.stream.getTracks(),
        ]);

        const mimeType = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
            ? "video/webm; codecs=vp9"
            : "video/webm";
        const recorder = new MediaRecorder(combinedStream, { mimeType });
        chunksRef.current = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunksRef.current.push(event.data);
            }
        };

        recorder.onstop = async () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setVideoURL(url);
        };

        recorderRef.current = recorder;
        recorder.start();
        setVideoState("Playing");
    };

    const stopRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.stop();
            recorderRef.current = null;
        }
    };

    const pauseRecording = () => {
        if (recorderRef.current && recorderRef.current.state === "recording") {
            recorderRef.current.pause();
        }
    };

    const resumeRecording = () => {
        if (recorderRef.current && recorderRef.current.state === "paused") {
            recorderRef.current.resume();
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (isRecording) {
                    isPausedDueToTabSwitch.current = true;
                    pauseRecording();
                    setVideoState("Paused")
                }
            } else {
                if (isPausedDueToTabSwitch.current) {
                    isPausedDueToTabSwitch.current = false;
                    setVideoState("Playing");
                    resumeRecording();
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isRecording]);

    useEffect(() => {
        if (isRecording) {
            startRecording();
            
        } else {
            stopRecording();
        }
    }, [isRecording]);

    // return(
    //     <>
    //   <IconButton variant="contained" onClick={() => {
    //     setVideoState("Paused")
    //     setIsRecording(false)
    //   }}><PauseIcon sx={{color:'white'}} /></IconButton>
    //     </>
    // )
};



const ExperienceRecorder = ({setVideoURL}) => {
  const cameraRef = useRef();
  const canvasRef = useRef();

  return (
    <>
    <ErrorBoundary>
    <Paper elevation={5} style={{display:'grid',width:'100%' ,aspectRatio: '4/5',backgroundColor:'gray', borderRadius:'10px'}}>
    <Canvas frameloop="always" dpr={[3,3]} ref={canvasRef} style={{borderRadius:'10px'}} shadows>
    <PerspectiveCamera
        makeDefault
        position={[0, 0, 2]}
        fov={50}
        near={0.1}
        far={1000}
        ref={cameraRef}
      />
      <Podcast1/>
    </Canvas>
    </Paper>
    <Grid2>
      <RecordingController canvasRef={canvasRef} setVideoURL={setVideoURL}/>
    </Grid2>
    </ErrorBoundary>
    </>
  );
}

export default ExperienceRecorder;
