import React, {useEffect,useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation, EffectCoverflow } from 'swiper/modules';

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
  


const ExampleCard = ({ heading, subheading, videoSrc}) => {
    return (
      <div className="flex p-4 w-[800px] h-[650px] flex-wrap">
        <div className="flex-1 flex flex-col items-center justify-center pr-4">
          <h2 className="text-4xl font-bold text-white">{heading}</h2>
          <p className="text-white mt-4">{subheading}</p>
        </div>
        <div className="flex-1 flex justify-center items-center min-w-[300px] p-2">
            <div className="overflow-hidden rounded-lg">
            <video className="rounded-lg" controls>
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            </div>
        </div>
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

    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <Swiper
            modules={[Navigation, EffectCoverflow]}
            spaceBetween={170}
            slidesPerView={1.5}
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
                     <div className="flex rounded-lg justify-center items-center w-full h-full" style={{ background: 'linear-gradient(to right, #83a4d4, #b6fbff)' }}>
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
        <><Carousel/><br/></>
    )
}



export default Examples