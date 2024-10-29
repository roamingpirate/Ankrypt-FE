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

{/* <Box sx={{height:'100vh',display: 'flex',flexDirection: 'column'}}>
<h1 style={{backgroundColor: FCCorrespondingColors['Smile']}}>Hello</h1>
<h1 style={{backgroundColor: FCCorrespondingColors['Happy']}}>Hello</h1>
<h1 style={{backgroundColor: FCCorrespondingColors['Laughing']}}>Hello</h1>
<h1 style={{backgroundColor: FCCorrespondingColors['Neutral']}}>Hello</h1>
<h1 style={{backgroundColor: FCCorrespondingColors['Curious']}}>Hello</h1>
<h1 style={{backgroundColor: FCCorrespondingColors['Surprised']}}>Hello</h1>
</Box> */}




const AnimationSection = () => {
  return (
    <Box sx={{display: 'flex', flexDirection:'row',overflow:'auto',height:'100%'}}>
         <Box className="w-[40%] border-t-2 border-t-gray-200" >
          <CanvasViewBox/>
          </Box>
          <Box className="border-t-2 border-t-gray-200 border-l-2 border-l-gray-200" sx={{width: '65%',overflow:'auto'}}>
            <AnimationScriptViewBox/>
          </Box>
       </Box>
  )
}


export default AnimationSection;




