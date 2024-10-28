import { Grid2, Typography, TextField,CircularProgress} from "@mui/material";
import AvatarDisplay from"../canvas/AvatarDisplay";
import {useState, useEffect, Suspense} from "react";
import { AvatarCreator } from '@readyplayerme/react-avatar-creator';
import EditIcon from '@mui/icons-material/Edit';
import { useProjectInfo } from "../utility/ProjectContext";
import axios from "axios";
const config= {
  clearCache: true,
  bodyType: 'fullbody',
  quickStart: true,
  language: 'en',

};




const fetchAvatarBodyType = async (avatarId) => {
    const response = await axios.get(`https://models.readyplayer.me/${avatarId}.json`);
    console.log("avatarodyRes");
    console.log(response);
    const isMale = (response.data.outfitGender == 'feminine')? false: true;
    return isMale ? "male" : "female";
}

const style = { width: '100%', height: '80vh', borderRadius: '10px' };



const LoadingCircle = () => {
    return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'300px'}}><CircularProgress /></div>
}


const AvatarBox = ({index, speakerList, setSpeakerList, startAvatarCreation}) => {
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
        <Grid2 style={{border:'1px solid grey', borderRadius: '10px', margin: '10px',padding:'20px',display:'flex',flex:'1',flexDirection:'column',height:'480px'}}>
            <Suspense fallback={<LoadingCircle/>}>
            <AvatarDisplay avatarUrl={avatarUrl} avatarGender={avatarGender} speakerList={speakerList}/>
            </Suspense>
            <TextField variant='outlined' 
                  label="Avatar Name" 
                  onChange={(e) => changeAvatarName(e.target.value)}
                  value={avatarName}
                  fullWidth 
                  height={'80px'}
                  margin='normal'/>
            <Grid2 size={5} 
                sx={{...styles.scriptTypeSubBox, 
                    backgroundColor:'#3F3A39',
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
        </Grid2>
    )
}



const AvatarSelector = ({speakerList,setSpeakerList}) => {
    //const {speakerList, setSpeakerList} = useProjectInfo();
   // const [speakerList, setSpeakerList] = useState(speakersListD)
    const [creatorMode, setCreatorMode] = useState(false);
    const [avatarCreateIndex, setAvatarCreateIndex] = useState(0);

    const startAvatarCreation = (index) => {
        setCreatorMode(true);
        setAvatarCreateIndex(index);
    }

    const changeAvatarData = async (index, avatarUrl,avatarId) => {
        const speakerListCopy = [...speakerList];
        speakerListCopy[index].avatarUrl = avatarUrl + "?morphTargets=ARKit,Oculus%20Visemes";
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

    if(creatorMode)
    {
        return(
           <AvatarCreator subdomain="ankrypt" config={config} style={style} onAvatarExported={handleOnAvatarExported} />
        )
    }

    return (
        <Grid2 style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center',height:'100%'}}>
        <Typography sx={styles.genScriptTxt}>Edit Speakers Avatars</Typography>
        <Grid2 style={{color:'white', display: 'flex', flexDirection:'row', justifyContent: 'center', alignItems:'center'}}>
            {
            speakerList.map((speaker,index) => (
               <AvatarBox key={index} index={index} speakerList={speakerList} setSpeakerList={setSpeakerList} startAvatarCreation={startAvatarCreation}/>
             ))
            }
        </Grid2>
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