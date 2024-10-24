import {useState, useEffect} from 'react';
import Header from '../landingPageComponents/Header';
import Intro from '../landingPageComponents/Intro';
import Examples from '../landingPageComponents/Examples';


const LandingPage = () => {
    
    return(
      <div style={{ height:'100vh', width:'100%' }}>
        <Header />
        <Intro/>
        <Examples/>
      </div>
    )
}


export default LandingPage;