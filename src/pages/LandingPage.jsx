import {useState, useEffect} from 'react';
import Header from '../landingPage/Header';
import Intro from '../landingPage/Intro';
import Examples from '../landingPage/Examples';
import PromptInput from '../landingPage/PromptInput';
import {Features} from '../landingPage/Features';
import { fetchScript } from '../api/projectApi';

const Footer = () => {
  return(
    <footer class=" text-white py-6">
    <div class="container mx-auto text-center">
        <p class="mb-4">&copy; 2024 Ancript. All rights reserved.</p>
        {/* <ul class="flex justify-center space-x-4">
            <li><a href="#about" class="hover:underline">About Us</a></li>
            <li><a href="#services" class="hover:underline">Services</a></li>
            <li><a href="#contact" class="hover:underline">Contact</a></li>
            <li><a href="#privacy" class="hover:underline">Privacy Policy</a></li>
        </ul> */}
    </div>
    </footer>
  )
}


const LandingPage = () => {

    useEffect( () => {
      const fuc = async () => {
        console.log("calling...");
        const res = await fetchScript("1");
        console.log(res);
      }

      fuc();
      
    },[])
    
    return(
      <div style={{ height:'100vh', width:'100%' }}>
        <div className="bg-[#16222A]">
        <Header />
        <Intro/>
        <Examples/>
        <Features/>
        <PromptInput/>
        <Footer/>
        </div>
      </div>
    )
}


export default LandingPage;