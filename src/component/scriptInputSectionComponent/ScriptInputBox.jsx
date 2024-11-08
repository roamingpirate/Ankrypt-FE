import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SendIcon from '@mui/icons-material/Send';
import {
         Grid2,
         TextField,
         MenuItem,
         ButtonGroup,
         Avatar,
         Modal,
} from '@mui/material';
import { useProjectInfo } from '../../utility/ProjectContext';
import AvatarSelector from '../AvatarSelector';
import zIndex from '@mui/material/styles/zIndex';
import { updateSpeakerList } from '../../api/projectApi';
import AnimatedTextbox from '../UtilityComponents/AnimatedTextBox';


const toneD = ['funny', 'informative', 'narative']
const speakersListD = [
  {
    avatarName: "Jordan",
    avatar: "av",
    avatarUrl: "https://models.readyplayer.me/672e0f1bb1448fd6b482c385.glb?morphTargets=ARKit,Oculus%20Visemes",
    avatarId: "672e0f1bb1448fd6b482c385",
    gender: "male",
    vgender: "male",
  },
  {
    avatarName: "Anaya",
    avatar: "av",
    avatarUrl: "https://models.readyplayer.me/672e0f19f8bb2fcf50cc6409.glb?morphTargets=ARKit,Oculus%20Visemes",
    avatarId: "672e0f19f8bb2fcf50cc6409",
    gender:"female",
    vgender:"female",
  },
]

const ScriptTypeSelectBox = ({scriptType,setScriptType}) => {
   return(
       <Grid2 container spacing={2} className="bg-gray-800" sx={styles.scriptTypeBox}>
       {
          ["podcast","story"].map((val,ind) => (
            <Grid2 key={ind} size={5} 
              onClick={() => setScriptType(val)}
              sx={{...styles.scriptTypeSubBox, 
                  backgroundColor:(scriptType === val)? '#3F3A39': 'white',
                  color:(scriptType === val)? 'white': 'black', 
                  }}>
              <Typography sx={styles.scriptTypeSubBoxText}>{val}</Typography>
            </Grid2>
          ))
       }
       </Grid2>
   )
 }

 const SpeakersCountSelectBox = ({speakerCount, setSpeakerCount}) => {
   return (
      <Grid2>
        <Typography sx={{color:'white',fontSize:'12px',fontWeight:'80',paddingBottom:'3px'}}> Number of Speakers </Typography>
      <ButtonGroup variant="outlined" size="large" color="white">
        {
          [1, 2].map((num) => (
            <Button
              key={num}
              style={speakerCount === num ? { backgroundColor: '#161717', color: 'white', border: '1px solid white' } : { backgroundColor: '#1F2937', color: 'white', border: '1px solid white'}}
              onClick={() => setSpeakerCount(num)}
            >
              {num}
            </Button>
          ))
        }
      </ButtonGroup>
      </Grid2>
   )
 }


 const SpeakerListBox = ({speakerCount,speakerList,setSpeakerList}) => {

      const [open,setOpen] = useState(false);

      return(
        <>
        <Grid2 sx={{border:"1px solid white",borderRadius:'5px',marginTop:'10px'}}>
          {/* Heading and Edit Button*/}
          <Grid2 sx={{display:'flex', justifyContent:'space-between',padding:'10px'}}>
          <Typography sx={{color:'white',fontSize:'14px',fontWeight:'80',paddingBottom:'3px'}}>Speakers</Typography>
          <IconButton sx={{padding:'0px'}} onClick={() => setOpen(true)}>
          <EditIcon sx={{color:'white',width:'20px',height:'20px'}}/>
          </IconButton>
          </Grid2>
          {/* Speakers List */}
          <Grid2 sx={{display:'flex', flexWrap:'wrap',padding:'10px', gap:'10px'}}>
            {
              speakerList.map((obj,ind) => {
                if(ind < speakerCount)
                {
                  return(
                    <Grid2 sx={{width:'auto', 
                                height:'auto', 
                                padding : '5px 10px',
                                border:'1px solid white', 
                                borderRadius:'5px',
                                display:'flex', 
                                gap:'10px', 
                                justifyContent:'center',
                                alignItems:'center',
                                backgroundColor:'#111827'}}>
                      <Avatar sx={{width:'22px',height:'22px', blackgroundColor:'white'}}>
                        A
                      </Avatar>
                      <Typography sx={{color:'white',fontSize:'14px',fontWeight:'80',paddingBottom:'3px'}}>{obj.avatarName}</Typography>
                    </Grid2>
                  )
                }
                return null
              })
            }
          </Grid2>  
        </Grid2>
        {/* Modal for Avatar Selection */}
        <Modal  open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          BackdropProps={{
            style: { backgroundColor: 'rgba(0, 0, 0, 0.3)' }, 
          }}>
            <Grid2 style={styles.AvatarSelectorModal}>
                <AvatarSelector speakerList={speakerList} setSpeakerList={setSpeakerList}/>
            </Grid2>
        </Modal>
        </>
      )
 }


const ScriptInputBox = () => {

   const [scriptType, setScriptType] = useState('podcast')
   const [speakerCount,setSpeakerCount] = useState(2);
  // const [speakersList, setSpeakerList] = useState(speakersListD);
   const [speakerList, setSpeakerList] = useState(speakersListD)
   const [inputPrompt,setInputPrompt] = useState('');
   const [tone,setTone] = useState('Funny');
   const {generateScript, setSpeakerList : setProjectSpeakerList, speakerList: projectSpeakerList,projectId} = useProjectInfo();

   const handleChange = (event) => {
    setScriptType(event.value);
  };

  const createScript = async () => {
     const promptData = {
        prompt : inputPrompt,
        speakers : speakerList.filter((obj,ind) => ind < speakerCount).map((speaker) => speaker.avatarName),
        tone : tone
     }
     console.log(promptData);
     generateScript(promptData);
     setProjectSpeakerList(speakerList);
     await updateSpeakerList(projectId,speakerList);
  }

  return (
    <Box sx={styles.root}>
      <Box display= 'flex' flexDirection='column' alignItems='center' justifyContent='center'>
      <p className='font-semibold pt-5 pb-3 font-mono text-3xl text-gray-200'>Generate Script Using AI</p>
      {/* <ScriptTypeSelectBox scriptType={scriptType} setScriptType={setScriptType} /> */}
      </Box>
      <div className="mx-[12px]">
      <TextField variant='outlined' 
                  label="Prompt" 
                  onChange={(e) => setInputPrompt(e.target.value)}
                  value={inputPrompt}
                  placeholder='Enter your prompt' 
                  fullWidth multiline 
                  
                  maxRows={8} 
                  margin='normal'
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'white', // Input text color
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white', // Label color
                    },
                    '& .MuiInputBase-root.Mui-focused': {
                      '& .MuiInputBase-input': {
                        color: 'white', // Change text color to blue when focused
                      },
                      '& .MuiInputLabel-root': {
                        color: 'white', // Change label color to purple when focused
                      },
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white', // Set border color to white
                      },
                      '&:hover fieldset': {
                        borderColor: 'white', // Border color on hover
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white', // Border color when focused
                      },
                    },
                  }}/>
      <div style={styles.row}>
          <TextField
            select
            label="Tone"
            defaultValue="funny"
            margin='dense'
            onChange={(e)=> setTone(e.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                color: 'white', // Input text color
              },
              '& .MuiInputLabel-root': {
                color: 'white', // Label color
              },
              '& .MuiInputBase-root.Mui-focused': {
                '& .MuiInputBase-input': {
                  color: 'white', // Change text color to blue when focused
                },
                '& .MuiInputLabel-root': {
                  color: 'white', // Change label color to purple when focused
                },
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white', // Set border color to white
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Border color when focused
                },
              },
            }}
          >
            {toneD.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
          <SpeakersCountSelectBox speakerCount={speakerCount} setSpeakerCount={setSpeakerCount}/>

      </div>

     <SpeakerListBox speakerCount={speakerCount} 
                     speakerList={speakerList} 
                     setSpeakerList={setSpeakerList}/>

     <div style={{...styles.row,justifyContent:'space-between', marginTop:'20px',}}>
      <div onClick={()=>handleNext(currentStage+1)} class="p-[2px] rounded-3xl bg-gradient-to-r from-[#2b5876] to-[#4e4376] flex justify-center items-center">
            <div className="text-center">
              <button className="flex bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold m-[1px] py-2 px-4 rounded-3xl ">
              <Typography sx={styles.scriptTypeSubBoxText}>Browse Prompt</Typography>
              <ArrowDropDownIcon sx={{color:'white',width:'25px',height:'25px'}}/>
              </button>
      </div>
      </div>
      <div onClick={()=>handleNext(currentStage+1)} class="p-[3px] rounded-[50%] bg-gradient-to-r from-[#2b5876] to-[#4e4376] flex justify-center items-center">
            <div className="text-center">
            <IconButton className="shadow-lg" sx={{backgroundColor:'#111827'}} onClick={() => createScript()}>
                <SendIcon sx={{color:'white',width:'25px',height:'25px'}}/>
            </IconButton>
      </div>
      </div>
      </div> 
      </div>

    </Box>
  )
}


const styles = {
  root : {display: 'flex',flexDirection:'column',margin: 2,flexGrow:1,flexWrap: 1},
  genScriptTxt: {fontFamily:"Oswald",fontSize: 28,justifyContent:'space-between', fontWeight:'500'},
  scriptTypeBox: {
    minWidth: '70px',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: '5px',
    width: '70%',
    borderRadius: 2,
    backgroundColor: '#D9D9D9',
    marginTop: 2,
  },
  scriptTypeSubBox : {
    minWidth: '60px',
    borderRadius: 2,
    backgroundColor: 'white',
    border: '1px solid black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  scriptTypeSubBoxText: {fontFamily:'Hubballi',fontSize: '1rem',textAlign: 'center',},
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap:'20px',
    marginTop:'5px',
  },
  AvatarSelectorModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor:'white',
    borderRadius:'15px',
    //border: '0.5px solid grey',
    zIndex: 5,
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    width: '50%',
    height:'80%',
  }

}

export default ScriptInputBox;




/* 
  storing Project Data -> 
  {
    projectId,
    promptData,
    scriptData,
    animationScriptData,
    animationSceneData,
  }
*/