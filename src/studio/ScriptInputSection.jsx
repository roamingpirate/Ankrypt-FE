import React from 'react';
import { useState } from 'react';
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

 
const DesktopLayout = () => {
  return (
    <div className="flex flex-row h-[100%]  overflow-auto">
      <div className="w-[30%] bg-[#1e1f20] border-r-[0.5px]">
        <ScriptInputBox />
      </div>
      <div className="bg-[#181414] border-t-0 w-[70%] overflow-auto">
        <ScriptViewComp />
      </div>
    </div>
  );
};

const MobileTabletLayout = ({currentActive}) => {


  return (
    <div className="h-full w-full overflow-auto">
      {currentActive === 0 ? (
        <div className="bg-[#1e1f20]">
          <ScriptInputBox />
        </div>
      ) : (
        <div className="bg-[#181414] overflow-auto">
          <ScriptViewComp />
        </div>
      )}
    </div>
  );
};


const ScriptInputSection = ({currentActive}) => {
  return (
    <div className='h-[100%] bg-[#1e1f20] overflow-auto'>
      <div className="hidden md:block h-[100%] overflow-auto">
        <DesktopLayout />
      </div>
      <div className="block md:hidden overflow-auto">
        <MobileTabletLayout currentActive={currentActive}/>
      </div>
    </div>
  );
};


export default ScriptInputSection;




