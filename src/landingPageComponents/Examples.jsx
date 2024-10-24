import { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const VideoBoxes = () => {
    const [currentVideo, setCurrentVideo] = useState(0); 
    const [isSingleVideo, setIsSingleVideo] = useState(false);

    const handleNext = () => {
        if (currentVideo < 1) setCurrentBox(currentVideo + 1);
    };

    const handleBack = () => {
        if (currentVideo > 0) setCurrentBox(currentVideo - 1);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) { // Example breakpoint for smaller screens
                setIsSingleVideo(true);
            } else {
                setIsSingleVideo(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="relative w-[90%] flex justify-center items-center bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                
                {/* Video Container */}
                <div className={`flex ${isSingleVideo ? 'w-full' : 'w-auto'} transition-all duration-300`}>
                    <div className={`bg-blue-500 h-[200px] w-[300px] rounded-md flex-shrink-0 flex justify-center items-center mx-2 ${isSingleVideo && currentVideo !== 0 ? 'hidden' : ''}`}>
                        <p className="text-white text-lg font-bold">Box 1</p>
                    </div>
                    <div className={`bg-green-500 h-[200px] w-[300px] rounded-md flex-shrink-0 flex justify-center items-center mx-2 ${isSingleVideo && currentVideo !== 1 ? 'hidden' : ''}`}>
                        <p className="text-white text-lg font-bold">Box 2</p>
                    </div>
                </div>

                {/* Back Button */}
                {isSingleVideo && (
                    <button onClick={handleBack} className="absolute left-0 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-800 text-white rounded-full">
                        <ArrowBackIcon />
                    </button>
                )}

                {/* Next Button */}
                {isSingleVideo && (
                    <button onClick={handleNext} className="absolute right-0 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-800 text-white rounded-full">
                        <ArrowForwardIcon />
                    </button>
                )}
            </div>
        </div>
    );
};


const Examples = () => {
    const Topics = ["Education Explainer","Business Insights","Travel Vlogs","Personal Development","Technology Reviews"]
    return (
        <div className="flex flex-col flex-grow items-center">
            <p className="text-center font-ks text-lg font-medium m-4">See What You Can Create</p>
            <div className="grid grid-cols-8 mx-4 rounded-lg w-[95%] px-3 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]">
                {/* Topics */}
                <div className="h-[600px] col-span-2 text-center flex flex-col items-center justify-center gap-3">
                    {Topics.map((topic) => {
                        return (
                            <div className="bg-white hover:bg-gray-800 mb-3 text-black font-bold py-2 px-2 w-[90%] rounded-xl">
                                <p className="font-karma text-sm font-medium text-center">{topic}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Videos */}
                <div className="col-span-6">
                     <VideoBoxes/>
                </div>
                

            </div>
        </div>
    )
}



export default Examples