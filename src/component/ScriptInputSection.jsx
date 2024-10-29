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
          <Box className="w-[35%] border-t-2 border-t-gray-200" >
            <ScriptInputBox/>
          </Box>
          <Box className='border-t-2 border-t-gray-200 border-l-2 border-l-gray-200' sx={{width: '65%',overflow:'auto'}}>
            <ScriptViewComp/>
          </Box>
       </Box>
  )
}


export default ScriptInputSection;




