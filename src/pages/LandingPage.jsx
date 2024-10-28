import {useState, useEffect} from 'react';
import Header from '../landingPageComponents/Header';
import Intro from '../landingPageComponents/Intro';
import Examples from '../landingPageComponents/Examples';
import PromptInput from '../landingPageComponents/PromptInput';
import {Features} from '../landingPageComponents/Features';

const Footer = () => {
  return(
    <footer class="bg-white text-black py-6">
    <div class="container mx-auto text-center">
        <p class="mb-4">&copy; 2024 Ancript. All rights reserved.</p>
        <ul class="flex justify-center space-x-4">
            <li><a href="#about" class="hover:underline">About Us</a></li>
            <li><a href="#services" class="hover:underline">Services</a></li>
            <li><a href="#contact" class="hover:underline">Contact</a></li>
            <li><a href="#privacy" class="hover:underline">Privacy Policy</a></li>
        </ul>
    </div>
    </footer>
  )
}


const LandingPage = () => {
    
    return(
      <div style={{ height:'100vh', width:'100%' }}>
        <Header />
        <Intro/>
        <Examples/>
        <Features/>
        <PromptInput/>
        <Footer/>
      </div>
    )
}


export default LandingPage;