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

const AnimationEditor = () => {
  const { setAnimationState, setVideoState, videoState,currentSceneIndex,setCurrentSceneIndex,updateAnimationState} = usePlayer();

  return(
    <Paper elevation={3} sx={{backgroundColor:'#3F3A39'}}>
    {/* Play Button */}
    <IconButton variant="contained"   onClick={() => {
          if(videoState != "playing"){
            setVideoState("Playing")
          }
      }}><PlayArrowIcon sx={{color:'white'}} /></IconButton>
      {/* Pause Button */}
      <IconButton variant="contained" onClick={() => {
        setVideoState("Paused")
      }}><PauseIcon sx={{color:'white'}} /></IconButton>

      {/* Reset Button */}
      <IconButton variant="contained" onClick={() => {
        setVideoState("Reset");
        if(currentSceneIndex)
          {
            setCurrentSceneIndex(0);
          }
          else{
          updateAnimationState(0,0,0);
          }
      }}><RestartAltIcon sx={{color:'white'}} /></IconButton>
  </Paper>
  )
}

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


const Experience = () => {
  const cameraRef = useRef();
  return (
    <>
    <ErrorBoundary>
    <PlayerController>
    <Paper elevation={5} style={{display:'grid', width:'82%', aspectRatio: '4/5', margin:'7px',backgroundColor:'white', borderRadius:'10px'}}>
    <Canvas style={{borderRadius:'10px'}} shadows>
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
      <AnimationEditor/>
    </Grid2>
    {/* <AnimationEditor/> */}
    </PlayerController>
    </ErrorBoundary>
    </>
  );
}

export default Experience;
