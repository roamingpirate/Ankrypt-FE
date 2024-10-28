import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ src , ar}) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    videoElement.play();
                } else {
                    videoElement.pause();
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1, // Adjust the threshold as needed
        });

        if (videoElement) {
            observer.observe(videoElement);
        }

        return () => {
            if (videoElement) {
                observer.unobserve(videoElement);
            }
        };
    }, [videoRef]);

    return (
        <div className={`overflow-hidden rounded-lg ${ar == 2? `w-[65%]`: `w-[85%]`}`} >
            <video
                ref={videoRef}
                className="rounded-lg"
                loop
                muted 
            >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};


const Feature = ({heading, subtext, videoSrc,ar}) => {
    return(
        <div className="flex py-[50px] mx-auto w-[70%] h-[600px]">
            <div className="flex flex-col flex-1 justify-center">
                <p className="font-bold pb-3 text-4xl pr-[80px]">{heading}</p>
                <p className="font-semibold font-karma text-sm pr-[80px]">{subtext}</p>
            </div>
            <div className="flex-1 rounded-lg flex justify-center items-center" style={{  'background' : 'linear-gradient(to right, #9796f0, #fbc7d4)'}}>
                     <VideoPlayer src={videoSrc} ar={ar}/>
            </div>
        </div>
    )
}

const featuresData = [
    {
      heading: "Generate and Edit Scripts",
      subtext: "Leverage AI to generate engaging scripts tailored to your topic. Edit and refine the content to ensure it resonates with your audience and conveys your message effectively.",
      VN : "/video/GSV.mp4",
      ar: 1,
    },
    {
      heading: "Custom 3D Avatars",
      subtext: "Choose and customize your own 3D avatars to give a personal touch to your videos. Make your characters relatable and engaging for your viewers!",
       VN : "/video/CAV.mp4",
       ar:1,
    },
    {
      heading: "AI-Generated Backgrounds",
      subtext: "Experience seamless integration with AI-generated backgrounds that perfectly fit the context of your video. Enhance the visual appeal and storytelling of your project!",
       VN : "/video/ABV.mp4",
       ar:2,
    },
    {
      heading: "Create Animated Videos",
      subtext: "Transform your scripts into dynamic animated videos with lifelike avatars. Our platform ensures your content is both visually captivating and easy to follow!",
       VN : "/video/ASV.mp4",
       ar:1
    }
  ];
  

  export const Features = () => {
    return (
      <>
        {featuresData.map((feature, index) => (
          <Feature 
            key={index} 
            heading={feature.heading} 
            subtext={feature.subtext} 
            videoSrc={feature.VN}
            ar={feature.ar}
          />
        ))}
      </>
    );
  };
  
