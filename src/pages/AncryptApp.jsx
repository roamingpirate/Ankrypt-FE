import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress, IconButton } from '@mui/material';
import Dashboard from './Dashboard';
import { addNewUser, addUserRequest } from '../api/projectApi';
import { LogoutOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AncryptApp = () => {
    const { logout, user, isAuthenticated, isLoading, loginWithPopup, error } = useAuth0();
    const [isDone, setIsDone] = useState(false);
    const [isAddScreen, setIsAddScreen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            loginWithPopup();
            //setIsDone(true);
        }
        else{
            const addUser = async () => {
                const res = await addNewUser(user.email);
                // it send status if user is in beta list in response
                // if(res.status)
                // {
                //     setIsDone(true);
                // }
                // else{
                //     setIsAddScreen(true);
                // }
                setIsDone(true);
            };
            addUser();
        }
    }, [isAuthenticated]);

    if (isLoading || error) {
        return(
            <div className='flex flex-col justify-center items-center h-screen bg-[#16222A]'>
                <div class="loader"></div>
                <p className='font-medium text-lg font-karma text-center p-3 text-white'>Complete Login in the popup to continue</p>
                <div className='bg-gray-800 rounded-lg text-center p-3 hover:cursor-pointer' onClick={() => {loginWithPopup()}}>
                    <p className='font-medium font-karma text-white'>
                        Open Pop-Up
                    </p>
                </div>
            </div>
        );
    }

    const WaitScreen = () => {
        return (
            <div className='flex flex-col justify-center items-center h-screen bg-[#16222A]'>
                <div class="loader"></div>
            </div>   
        )
    };

    const AddScreen = () => {

        const [isAdd, setIsAdd] = useState(false);
        const navigate = useNavigate();
        const [message, setMessage] = useState("");

        const handleAdd = async () => {
            const res = await addUserRequest(user.email,user.name);
            if(res.status == 1)
            {
                setMessage("Your request has been sent! You will be notified when you are added.!🎉 ")
            }
            else{
                setMessage("Your request has already been sent! You will be notified when you are added.!🎉 ")
            }
            setIsAdd(true);
        }

        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#16222A] to-[#3A6073] px-4">
                <div className="w-full max-w-[400px] md:max-w-[600px] bg-[#1E293B] shadow-2xl rounded-lg p-6 md:p-8 space-y-6">
                    <p className="text-xl md:text-2xl font-karma font-bold text-white text-center">
                        We're thrilled to have you here! 🚀
                    </p>
                    {/* Placeholder for Circular Logo */}
                    <div className="flex justify-center">
                        <img
                            src="/logo.png"
                            alt="Ancript Logo"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-md"
                        />
                    </div>
                    <p className="text-sm md:text-base font-karma text-gray-300 text-center">
                        Ancript is under development, and we'd love for you to be among the first to experience it. Help us shape the future of Ancript by trying it before its official release.
                    </p>
                    {isAdd ? (
                        <>
                            <p className="text-sm md:text-base font-karma text-green-400 text-center">
                                {message}
                            </p>
                            <div className="flex justify-center">
                            <button
                                onClick={() => logout()}
                                className="px-8 py-3 bg-[#51c4b7] text-white font-karma font-semibold rounded-lg shadow-md hover:bg-blue-500 transition duration-200"
                            >
                                Home
                            </button>
                           </div>
                        </>
                        ) : (
                            <>
                                <p className="text-sm md:text-base font-karma text-gray-300 text-center">
                                    Click the button below to send a request and join our exclusive early access list.
                                </p>
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => { handleAdd()}}
                                        className="px-8 py-3 bg-[#51c4b7] text-white font-karma font-semibold rounded-lg shadow-md hover:bg-blue-500 transition duration-200"
                                    >
                                        Add Me
                                    </button>
                                </div>
                            </>
                    )}
                    <p className="text-xs md:text-sm font-karma text-gray-400 text-center">
                        We can’t wait to have you onboard!
                    </p>
                </div>
            </div>
        );
    };
    
    
    

    return (
        <>
            {isDone ? 
                (
                    <>
                        <Dashboard/>
                    </>
                ) :
             isAddScreen ?    (
                <AddScreen/>
            ): 
            (
                <WaitScreen/>
            )
            }
        </>
    );
};

export default AncryptApp;
