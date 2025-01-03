import { Grid2, Typography, TextField,CircularProgress,IconButton,useMediaQuery, Button } from "@mui/material";
import AvatarDisplay from"../canvas/AvatarDisplay";
import {useState, useEffect, Suspense} from "react";
import { AvatarCreator } from '@readyplayerme/react-avatar-creator';
import EditIcon from '@mui/icons-material/Edit';
import { useProjectInfo } from "../hooks/ProjectContext";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { getAvatarToken } from "../api/projectApi";
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';



const GenderTypeSelectBox = ({ index, speakerData, setSpeakerData, disabled = false }) => {
    return (
        <div className="w-full flex justify-center border-[1px] border-gray-500 p-1 rounded-lg">
            <p className="flex-grow text-[12px] text-gray-300 w-[150px] p-3">Avatar Voice</p>
            <Grid2 container spacing={1} className="min-w-[100px] flex items-center justify-center flex-wrap p-1 w-[100%] rounded-md mt-1">
                {["male", "female"].map((val, ind) => (
                    <Grid2
                        key={ind}
                        size={6}
                        className={`min-w-[60px] rounded-md bg-[#FFFBFB] border border-black flex items-center justify-center hover:cursor-pointer`}
                        sx={{
                            backgroundColor: (speakerData[index]?.vgender === val) ? '#1e9487' : 'white',
                            color: (speakerData[index]?.vgender === val) ? 'white' : 'black', 
                        }}
                        onClick={() => {
                            if (!disabled) {
                                const newSpeakerData = [...speakerData];
                                newSpeakerData[index] = { ...newSpeakerData[index], vgender: val };
                                setSpeakerData(newSpeakerData);
                            }
                        }}
                    >
                        <Typography className="font-hubballi text-base text-center">{val}</Typography>
                    </Grid2>
                ))}
            </Grid2>
        </div>
    );
};



const fetchAvatarBodyType = async (avatarId) => {
    const response = await axios.get(`https://models.readyplayer.me/${avatarId}.json`);
    console.log("avatarodyRes");
    console.log(response);
    const isMale = (response.data.outfitGender == 'feminine')? false: true;
    return isMale ? "male" : "female";
}

const style = { width: '100%', height: '100%', borderRadius: '24px' };



const LoadingCircle = () => {
    return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'300px'}}><CircularProgress /></div>
}


const AvatarBox = ({index, speakerList, setSpeakerList, startAvatarCreation,disabled}) => {
    const [avatarUrl, setAvatarUrl] = useState(speakerList[index].avatarUrl);
    const [avatarName, setAvatarName] = useState(speakerList[index].avatarName);
    const [avatarGender, setAvatarGender] = useState(speakerList[index].gender);

    const changeAvatarName = (avatarName) => {
        const speakerListCopy = [...speakerList];
        speakerListCopy[index].avatarName = avatarName;
        setSpeakerList(speakerListCopy);
    }

    useEffect(() => {
        setAvatarName(speakerList[index].avatarName);
        setAvatarUrl(speakerList[index].avatarUrl);
        setAvatarGender(speakerList[index].gender);
    }, [speakerList]);

    return (
        <Grid2 style={{border:'1px solid grey', borderRadius: '10px', margin: '10px',padding:'20px',display:'flex',flex:'1',flexDirection:'column'}}>
            <Suspense fallback={<LoadingCircle/>}>
            <AvatarDisplay avatarUrl={avatarUrl} avatarGender={avatarGender} speakerList={speakerList}/>
            </Suspense>
            <div>
            <Grid2 size={5} 
                sx={{...styles.scriptTypeSubBox, 
                    backgroundColor:'#1e9487',
                    color:'white', 
                    width:'100%'
                }}
                onClick={() => startAvatarCreation(index)}
                >
            <Typography sx={styles.scriptTypeSubBoxText}>Edit Model</Typography>
                <div style={{marginLeft:'10px'}}>
                    <EditIcon sx={{color:'white',width:'20px',height:'20px'}}/>
                </div>
            </Grid2>
            </div>
            <TextField variant='outlined' 
                  label="Avatar Name" 
                  onChange={(e) => changeAvatarName(e.target.value)}
                  value={avatarName}
                  fullWidth 
                  disabled={disabled}
                  margin='normal'/>
            <GenderTypeSelectBox index={index} speakerData={speakerList} setSpeakerData={setSpeakerList} disabled={disabled}/>
        </Grid2>
    )
}



const AvatarSelector = ({speakerList,setSpeakerList, setIsOpen, disabled = false}) => {
    //const {speakerList, setSpeakerList} = useProjectInfo();
   // const [speakerList, setSpeakerList] = useState(speakersListD)
    const [creatorMode, setCreatorMode] = useState(false);
    const [avatarCreateIndex, setAvatarCreateIndex] = useState(0);
    const {user} = useAuth0();
    const [token, setToken] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isMobile = useMediaQuery('(max-width:600px)'); // Direct media query for mobile screens
  
    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % speakerList.length); // Loop back to start
    };
  
    const handlePrev = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + speakerList.length) % speakerList.length); // Loop back to end
    };

    useEffect(() => {
        const fetchToken = async () => {
            const tokendata = await getAvatarToken(user.email);
            setToken(tokendata);
            console.log(tokendata,"token");
        }
        fetchToken();
    },[])

    const config= {
        quickStart: true,
        token: token
     };

    const startAvatarCreation = (index) => {
        setCreatorMode(true);
        setAvatarCreateIndex(index);
    }

    const changeAvatarData = async (index, avatarUrl,avatarId) => {
        const speakerListCopy = [...speakerList];
        speakerListCopy[index].avatarUrl =avatarUrl;
        speakerListCopy[index].avatarId =avatarId;
        speakerListCopy[index].gender =await fetchAvatarBodyType(avatarId);
        console.log(speakerListCopy[index].avatarUrl);
        setSpeakerList(speakerListCopy);  
    }

    const handleOnAvatarExported = (event) => {
        console.log(event.data);
        setCreatorMode(false);
        changeAvatarData(avatarCreateIndex,event.data.url,event.data.avatarId);
        console.log(`Avatar URL is: ${event.data.url}`);
      };

    if(creatorMode )
    {
        return(
           <AvatarCreator subdomain="ankrypt" config={config} style={style} onAvatarExported={handleOnAvatarExported} />
        )
    }

    return (
        <Grid2 className='bg-[#1e1f20] rounded-3xl p-4' style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center',position:'relative'}}>
        <IconButton 
            onClick={() =>setIsOpen(false)}
            style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: 'white',
            }}
        >
            <CloseIcon fontSize={isMobile?"medium":"large"}/>
        </IconButton>

        <Typography sx={styles.genScriptTxt}>Edit Speakers Avatars</Typography>
        <Grid2 
            container 
            style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}
            >
            {isMobile ? (
                <>
                {/* Display only one AvatarBox with navigation arrows */}
                <IconButton 
                    onClick={handlePrev} 
                    style={{ position: 'absolute', left: '10px', zIndex: 1 }}
                    disabled={currentIndex === 0} // Disable left arrow if first item
                >
                    <ArrowBack />
                </IconButton>

                <AvatarBox 
                    key={currentIndex} 
                    index={currentIndex} 
                    speakerList={speakerList} 
                    setSpeakerList={setSpeakerList} 
                    startAvatarCreation={startAvatarCreation} 
                    disabled={disabled} 
                />

                <IconButton 
                    onClick={handleNext} 
                    style={{ position: 'absolute', right: '10px', zIndex: 1 }}
                    disabled={currentIndex === speakerList.length - 1} // Disable right arrow if last item
                >
                    <ArrowForward />
                </IconButton>
                </>
            ) : (
                // For larger screens, display all AvatarBoxes
                speakerList.map((speaker, index) => (
                <AvatarBox 
                    key={index} 
                    index={index} 
                    speakerList={speakerList} 
                    setSpeakerList={setSpeakerList} 
                    startAvatarCreation={startAvatarCreation} 
                    disabled={disabled}
                />
                ))
            )}
        </Grid2>
        <div className="flex justify-end items-end w-[100%]">
        <Button 
            variant="contained" 
            onClick={() =>setIsOpen(false)}
            sx={{ backgroundColor: '#15191f', color: 'white',border: '1px solid white', '&:hover': { backgroundColor: '#04b39f' } } }
            >
            Done
        </Button>
        </div>
        </Grid2>
    )
}



const styles = {
    scriptTypeSubBox : {
        width : '100%',
        height : '40px',
        margin:'5px',
        borderRadius: 2,
        backgroundColor: '#FFFBFB',
        border: '1px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      },
    scriptTypeSubBoxText: {fontFamily:'Hubballi',fontSize: '1rem',textAlign: 'center',},
    genScriptTxt: {fontFamily:'karma',fontSize: 24}
}

export default AvatarSelector;