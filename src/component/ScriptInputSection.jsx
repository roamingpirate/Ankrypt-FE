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
import ScriptViewComp from './scriptInputSectionComponent/ScriptViewBox';
import ScriptInputBox from './scriptInputSectionComponent/ScriptInputBox';
 

const ScriptInputSection = () => {
  return (
       <Box sx={{display: 'flex', flexDirection:'row',overflow:'auto',height:'100%'}}>
          <Box className="w-[30%] bg-[#1e1f20] border-r-[0.5px]" >
            <ScriptInputBox/>
          </Box>
          <Box className='bg-[#181414] border-t-[0px]' sx={{width: '70%',overflow:'auto'}}>
            <ScriptViewComp/>
          </Box>
       </Box>
  )
}


export default ScriptInputSection;




