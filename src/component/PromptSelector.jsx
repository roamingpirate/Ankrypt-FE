import React, {useState, useEffect} from 'react'
import promptList from '../data/PromptsList.json'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TopicButton = ({topic, setSelectedIndex, selectedIndex, index}) => {

    return (
        <div onClick={() => setSelectedIndex(index)} className={`rounded-xl m-2 w-[90%] p-2 h-auto ${selectedIndex == index ? 'border-white border-2':'border-gray-700 border-[1px]'} hover:border-white hover:cursor-pointer text-center`}>
            <p>{topic}</p>
        </div>
    )
}


const SubTopicButton = ({topic, setSelectedIndex, selectedIndex, index}) => {

    return (
            <div onClick={() => setSelectedIndex(index)}  class={`m-2 rounded-lg bg-gradient-to-r from-[#2b5876] to-[#4e4376] ${selectedIndex == index ? '':''}`}>
            <button className={`bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold m-[1px] py-2 px-4 rounded-lg ${selectedIndex == index ? 'bg-gray-500':''}`}>
                <p>{topic}</p>
            </button>
            </div>
    )
}




export const PromptSelector = ({setPrompt,setTone,setOpen}) => {

    const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
    const [selectedSubTopicIndex, setSelectedSubTopicIndex] = useState(0);

    return (
        <div className='flex w-full h-full rounded-xl'>
            <div className='w-[35%] rounded-l-3xl border-r-[1px] flex flex-col items-center py-8'>
                <p className="font-mono font-medium text-white text-lg pb-6">Categories</p>
                <div className="flex flex-col items-center w-full overflow-auto">
                    {
                        promptList.map( (obj, index) => (
                            <TopicButton topic={obj.topic} index={index} selectedIndex={selectedTopicIndex} setSelectedIndex={setSelectedTopicIndex}/>
                        ))
                    }
                </div>
            </div>
            <div className='w-[65%] flex flex-col'>
                {/* Prompt */}
                <div className=' flex flex-col justify-center p-[15%] h-[50%] bg-[#181414] rounded-3xl'>
                    <div className='p-[1.5px] rounded-xl bg-gradient-to-r from-[#2b5876] to-[#4e4376]'>
                    <div className='bg-gray-800 p-4 rounded-xl shadow-lg'>
                        <div className='border-[1px] flex justify-center items-center p-4 rounded-xl'>
                        <p>
                            {promptList[selectedTopicIndex].topics[selectedSubTopicIndex].prompt}
                        </p>
                        </div>
                        <div className='flex py-4 w-full justify-between px-2'>
                            <div className='flex border-[1px] rounded-md text-center p-2 my-1'>
                                <p> Tone <span className='rounded-md bg-gray-400 text-gray-800 p-1 ml-4'> {promptList[selectedTopicIndex].topics[selectedSubTopicIndex].tone} </span></p>
                            </div>
                            <IconButton>
                                <CheckCircleIcon sx={{fontSize:35, color:'white'}} 
                                    onClick={() => {
                                        setPrompt(promptList[selectedTopicIndex].topics[selectedSubTopicIndex].prompt)
                                        setOpen(false);
                                        }}/>
                            </IconButton>
                        </div>
                    </div>
                    </div>
                </div>
                {/* Sub topics */}
                <div className='border-t-[1px] p-4 h-[50%] flex flex-grow flex-col items-center'>
                    <p className='py-5 font-mono font-semibold'>Topics</p>
                    <div className='overflow-auto h-[100%]'>
                    <div className='flex flex-wrap'>
                    {
                        promptList[selectedTopicIndex].topics.map( (obj, index) => (
                            <SubTopicButton topic={obj.topic} index={index} selectedIndex={selectedSubTopicIndex} setSelectedIndex={setSelectedSubTopicIndex}/>
                        ))
                    }
                    </div>
                    </div>
                </div>

            </div>
        </div>
    )
}