import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PromptInput = () => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handlePromptChange = (event) => {
    // setPrompt(event.target.value);
     navigate("/studio")
  };

  const handleStart = () => {
    // Handle the start button click
    console.log('Prompt:', prompt);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-[120px] p-4 md:py-[150px]">
      <h1 className="text-2xl font-semibold mb-4 text-white  font-karma">
        Excited? Create your Own Video in minutes
      </h1>
      <div className="rounded-lg shadow-lg p-8 md:w-[60%] bg-gradient-to-tl from-[#536976] to-[#292E49]" >
        <p className="mb-2 text-center font-karma font-medium text-lg">
          <span className="bg-gradient-to-r from-[#e6e9f0] to-[#eef1f5] bg-clip-text text-transparent"> Enter your prompt </span>
        </p>
        <textarea
          id="prompt"
          className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring focus:ring-blue-500"
          value={prompt}
          onChange={handlePromptChange}
        />
        <div className="flex justify-center mt-4">
          <button onClick={() => navigate("/studio")}
            className="bg-gray-800 shadow-md hover:bg-gray-300 text-white font-semibold font-karma py-2 px-4 rounded-md mr-2"
          >
            Browse Prompt
          </button>
          <button onClick={() => navigate("/studio")}
            className="bg-gray-800 shadow-md hover:bg-gray-300 text-white font-semibold font-karma py-2 px-4 rounded-md"
            // onClick={handleStart}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default PromptInput;
