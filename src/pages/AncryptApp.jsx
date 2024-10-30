import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress } from '@mui/material';
import Dashboard from './Dashboard';
import { addNewUser } from '../api/projectApi';

const AncryptApp = () => {
    const { logout, user, isAuthenticated, isLoading, loginWithPopup, error } = useAuth0();
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            loginWithPopup();
            setIsDone(true);
        }
        else{
            const addUser = async () => {
                await addNewUser(user.email);
                setIsDone(true);
            };
            addUser();
        }
    }, [isAuthenticated]);

    if (isLoading || error) {
        return(
            <div className='flex flex-col justify-center items-center h-screen'>
                <CircularProgress/>
                <p className='font-semibold font-karma text-center p-3'>Complete Login in the popup to continue</p>
                <div className='bg-gray-800 rounded-lg text-center p-3 hover:cursor-pointer' onClick={() => {loginWithPopup()}}>
                    <p className='font-medium font-karma text-white'>
                        Open Pop-Up
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {isDone ? (
                <>
                    <Dashboard/>
                </>
            ) : (
                <div>Please log in.</div>
            )}
        </>
    );
};

export default AncryptApp;
