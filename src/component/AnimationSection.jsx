import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Grid2 as Grid, Paper, Container } from '@mui/material';
import Header from './Header';
import StoryInputComp from './scriptInputSectionComponent/ScriptInputBox';
import ScriptViewComp from './scriptInputSectionComponent/ScriptViewBox';
import AnimationScriptViewBox from './animationSectionComponent/AnimationScriptViewBox';
import CanvasViewBox from './animationSectionComponent/CanvasViewBox';
import { Height } from '@mui/icons-material';
import { PlayerController, usePlayer } from '../canvas/hooks/usePlayer';
import { useProjectInfo } from '../utility/ProjectContext';

{/* <Box sx={{height:'100vh',display: 'flex',flexDirection: 'column'}}>
<h1 style={{backgroundColor: FCCorrespondingColors['Smile']}}>Hello</h1>
<h1 style={{backgroundColor: FCCorrespondingColors['Happy']}}>Hello</h1>
<h1 style={{backgroundColor: FCCorrespondingColors['Laughing']}}>Hello</h1>
<h1 style={{backgroundColor: FCCorrespondingColors['Neutral']}}>Hello</h1>
<h1 style={{backgroundColor: FCCorrespondingColors['Curious']}}>Hello</h1>
<h1 style={{backgroundColor: FCCorrespondingColors['Surprised']}}>Hello</h1>
</Box> */}

const DesktopLayout = () => {
  return (
    <div className="flex flex-row h-[100%]  overflow-auto">
      <div className="w-[40%] bg-[#1e1f20] border-r-[0.5px]">
          <CanvasViewBox/>
      </div>
      <div className="bg-[#181414] h-[100%]  border-t-0 w-[60%] overflow-auto">
        <AnimationScriptViewBox/>
      </div>
    </div>
  );
};

const MobileTabletLayout = ({currentActive}) => {
  const {setVideoState} = usePlayer();

  React.useEffect(() => {
    if(currentActive == 1)
    {
      setVideoState("Paused");
    }
  },[currentActive])

  return (
    <div className="h-full w-full overflow-auto">
      {currentActive === 0 ? (
        <div className="bg-[#1e1f20] h-full" >
          <CanvasViewBox/>
        </div>
      ) : (
        <div className="bg-[#181414] h-full overflow-auto">
          <AnimationScriptViewBox/>
        </div>
      )}
    </div>
  );
};



const AnimationSection = () => {
  const {currentActive} = useProjectInfo();
  return (
    <PlayerController>
    <div className='h-[100%] bg-[#1e1f20] overflow-auto'>
      <div className="hidden md:block h-[100%] overflow-auto">
        <DesktopLayout />
      </div>
      <div className="block md:hidden h-full overflow-auto">
        <MobileTabletLayout currentActive={currentActive}/>
      </div>
    </div>
    </PlayerController>
  );
}


export default AnimationSection;




