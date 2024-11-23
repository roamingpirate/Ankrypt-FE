import React, {useEffect,useState,useRef} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { CircularProgress } from '@mui/material';

const VideoSection = ({ videoSrc, placeholderImage }) => {
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const togglePlayPause = (play) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: play ? "playVideo" : "pauseVideo",
        }),
        "*"
      );
      setIsPlaying(play);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting && isPlaying) {
          togglePlayPause(false); // Pause video when out of view
        }
      },
      { threshold: 0.5 }
    );

    const container = iframeRef.current?.parentElement;
    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [isPlaying]);

  return (
    <div
      className="relative rounded-lg"
      style={{
        width: "90%",
        maxWidth: "400px",
        aspectRatio: "4 / 5",
        margin: "auto",
      }}
    >
      {(!isPlaying || !isVisible) && (
        <div
          className="absolute inset-0 rounded-lg flex justify-center items-center bg-black bg-opacity-50 z-10"
          style={{
            backgroundImage: `url(${placeholderImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <button
            onClick={() => togglePlayPause(true)}
            className="p-3 bg-black bg-opacity-70 rounded-full text-white"
          >
            <PlayArrowIcon style={{ fontSize: 40 }} />
          </button>
        </div>
      )}

      <iframe
        ref={iframeRef}
        className='rounded-lg'
        style={{
          opacity: isPlaying && isVisible ? 1 : 0,
          pointerEvents: isPlaying && isVisible ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoSrc}?controls=1&modestbranding=1&showinfo=0&rel=0&autohide=1&enablejsapi=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};


const  exampleData = [
    {
      "heading": "Share Your Travel Experiences",
      "subheading": "Share your stories about your travel experiences to any destination, and watch as 3D avatars bring your adventures to life in captivating dialogues, all set against stunning AI-generated backgrounds!",
      "videoSrc": "WpxVy08a7fk",
      "placeHolder":"exampleVid/Trip.png"
    },
    {
      "heading": "Transform Business Concepts into Visuals",
      "subheading": "Turn your business ideas into engaging presentations! Just provide a text prompt, and let our 3D avatars explain and discuss your insights in contextually rich environments.",
      "videoSrc": "bVWuw3s-vJo",
      "placeHolder":"exampleVid/business.png"
    },
    {
      "heading": "Effortless Explainer Videos",
      "subheading": "Simplify complex topics with a single prompt! Our 3D avatars will create interactive dialogues, complemented by AI-generated backgrounds, making learning engaging and fun.",
      "videoSrc": "aWAk9GN2X5o",
      "placeHolder":"exampleVid/explainV.png"
    },
    {
      "heading": "Create Social Media Content",
      "subheading": "Generate eye-catching social media videos in seconds! Provide a text prompt, and 3D avatars will create dynamic interactions, perfectly suited for your audience.",
      "videoSrc": "67SO5wTOF64",
      "placeHolder":"exampleVid/social.png"
    },
    {
      "heading": "Engaging Storytelling Experiences",
      "subheading": "Bring your stories to life with just a text prompt! Our 3D avatars will engage in conversations, creating a vivid narrative enhanced by beautiful AI-generated scenes.",
      "videoSrc": "MtfOtpLxJEo",
      "placeHolder":"exampleVid/story.png"
    }
  ]
  


  const ExampleCard = ({ heading, subheading, videoSrc, placeholderImage }) => {
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
        <VideoSection videoSrc={videoSrc} placeholderImage={placeholderImage}/>
      </div>
    );
  };
  

const Carousel = () => {
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
                                videoSrc={example.videoSrc}
                                placeholderImage={example.placeHolder}
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