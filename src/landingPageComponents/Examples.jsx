import React, {useEffect,useState,useRef} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const VideoSection = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle video going out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            videoRef.current.pause();
            setIsPlaying(false); // Update state when video is paused
          }
        });
      },
      { threshold: 0.5 } // Pause when 50% of the video is out of view
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect(); // Clean up observer on unmount
    };
  }, []);

  return (
    <div className="flex-1 flex justify-center items-center p-2 relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="overflow-hidden rounded-lg relative">
        <video
          ref={videoRef}
          className="rounded-lg"
          controls={false} // Disable the default controls
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div
          className={`absolute inset-0 bg-gray-800 transition-all duration-300 ${isPlaying ? (isHovered? 'opacity-30' : 'opacity-0') : 'opacity-30'}`}
        ></div>
        
        {/* Custom Play/Pause Button with Material UI Icon */}
        <button
          onClick={togglePlayPause}
          className={`absolute bottom-1 left-[50%] transform -translate-x-1/2 -translate-y-1/2 p-2 bg-black rounded-full text-white ${isPlaying ? (isHovered? 'opacity-100' : 'opacity-0') :'opacity-100'}`}
        >
          {isPlaying ? (
            <PauseIcon style={{ fontSize: 40 }} />
          ) : (
            <PlayArrowIcon style={{ fontSize: 40 }} />
          )}
        </button>
      </div>
    </div>
  );
};

const  exampleData = [
    {
      "heading": "Share Your Travel Experiences",
      "subheading": "Share your stories about your travel experiences to any destination, and watch as 3D avatars bring your adventures to life in captivating dialogues, all set against stunning AI-generated backgrounds!"
    },
    {
      "heading": "Transform Business Concepts into Visuals",
      "subheading": "Turn your business ideas into engaging presentations! Just provide a text prompt, and let our 3D avatars explain and discuss your insights in contextually rich environments."
    },
    {
      "heading": "Effortless Explainer Videos",
      "subheading": "Simplify complex topics with a single prompt! Our 3D avatars will create interactive dialogues, complemented by AI-generated backgrounds, making learning engaging and fun."
    },
    {
      "heading": "Create Social Media Content",
      "subheading": "Generate eye-catching social media videos in seconds! Provide a text prompt, and 3D avatars will create dynamic interactions, perfectly suited for your audience."
    },
    {
      "heading": "Engaging Storytelling Experiences",
      "subheading": "Bring your stories to life with just a text prompt! Our 3D avatars will engage in conversations, creating a vivid narrative enhanced by beautiful AI-generated scenes."
    }
  ]
  


  const ExampleCard = ({ heading, subheading, videoSrc }) => {
    return (
      <div className="flex flex-col lg:flex-row md:flex-row p-4">
        {/* Text Section */}
        <div className="flex-1 flex flex-col items-center sm:justify-center lg:pr-4 mb-4 md:mb-0 lg:mb-0">
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-3xl font-bold text-white">
            {heading}
          </h2>
          <p className="text-white mt-4 text-sm sm:text-base md:text-lg lg:text-lg">
            {subheading}
          </p>
        </div>
  
        {/* Video Section */}
        {/* <div className="flex-1 flex justify-center items-center p-2">
          <div className="overflow-hidden rounded-lg">
            <video className="rounded-lg" controls>
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div> */}
        <VideoSection videoSrc={videoSrc}/>
      </div>
    );
  };
  

const Carousel = () => {
    const slides = [
        {
            image: '/background/back1.jpg',
            title: 'Customer Story 1',
            description: 'Description for Customer Story 1',
            logo: 'path/to/logo1.png',
        },
        {
            image: '/background/back1.jpg',
            title: 'Customer Story 2',
            description: 'Description for Customer Story 2',
            logo: 'path/to/logo2.png',
        },
        {
            image: '/background/back1.jpg',
            title: 'Customer Story 3',
            description: 'Description for Customer Story 3',
            logo: 'path/to/logo3.png',
        },
        {
            image: '/background/back1.jpg',
            title: 'Customer Story 4',
            description: 'Description for Customer Story 4',
            logo: 'path/to/logo4.png',
        },
        // Add more slides as needed
    ];

    const [spaceBetween, setSpaceBetween] = useState(150); 
    const [pagePerScreen, setPagePerScreen] = useState(1.5);
    const [activeIndex, setActiveIndex] = useState(0);
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth <= 510) {
          setSpaceBetween(50); 
          setPagePerScreen(1.1);
        } else if (window.innerWidth <= 1024) {
          setSpaceBetween(100); 
          setPagePerScreen(1.3)
        } else {
          setSpaceBetween(150); 
          setPagePerScreen(1.5);
        }
      };
  
      
      handleResize(); 
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Swiper
            modules={[Navigation, EffectCoverflow]}
            spaceBetween={spaceBetween}
            slidesPerView={pagePerScreen}
            centeredSlides={true}
            navigation
            loop={true}
            effect="coverflow"
            coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="mySwiper w-full"
        >
            {exampleData.map((example, index) => (
                <SwiperSlide
                    key={index}
                    className={`shadow-lg transition-opacity duration-300 ease-in-out ${
                        index === activeIndex ? 'opacity-100 scale-100' : 'opacity-60 scale-95'
                    }`}
                >
                     <div className="flex rounded-lg justify-center items-center bg-[#0b374d]">
                            <ExampleCard
                                heading={example.heading}
                                subheading={example.subheading}
                                videoSrc="/JapanTrip.mp4"
                            />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};




const Examples = () => {
    const Topics = ["Education Explainer","Business Insights","Travel Vlogs","Personal Development","Technology Reviews"]

    return (
        <><Carousel/><br/><div className='mb-[150px]'/></>
    )
}



export default Examples