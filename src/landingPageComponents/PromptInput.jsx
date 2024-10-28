import React, { useState } from 'react';

const PromptInput = () => {
  const [prompt, setPrompt] = useState('');

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleStart = () => {
    // Handle the start button click
    console.log('Prompt:', prompt);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-[120px] p-4 py-[150px]">
      <h1 className="text-2xl font-semibold mb-4  font-karma">
        Excited? Create your Own Video in minutes
      </h1>
      <div className="rounded-lg shadow-lg p-8 w-[60%]" style={{ 'background': 'linear-gradient(to right, #0f2027, #203a43, #2c5364)'}}>
        <p className="mb-2 text-center font-karma font-medium text-lg text-white">
          Enter your prompt
        </p>
        <textarea
          id="prompt"
          className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring focus:ring-blue-500"
          value={prompt}
          onChange={handlePromptChange}
        />
        <div className="flex justify-center mt-4">
          <button
            className="bg-white shadow-md hover:bg-gray-300 text-black font-semibold font-karma py-2 px-4 rounded-md mr-2"
          >
            Browse Prompt
          </button>
          <button
            className="bg-white shadow-md hover:bg-gray-300 text-black font-semibold font-karma py-2 px-4 rounded-md"
            onClick={handleStart}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default PromptInput;
