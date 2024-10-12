import React, {useState} from 'react';
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
} from '@mui/material';
import { useProjectInfo } from '../../utility/ProjectContext';


const toneD = ['funny', 'informative', 'narative']
const speakersListD = [
  {
    name: "Jordan",
    avatar: "av"
  },
  {
    name: "Michael",
    avatar: "av"
  },
  {
    name: "Don",
    avatar: "av" 
  }
]

const ScriptTypeSelectBox = ({scriptType,setScriptType}) => {
   return(
       <Grid2 container spacing={2} sx={styles.scriptTypeBox}>
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
        <Typography sx={{color:'grey',fontSize:'12px',fontWeight:'80',paddingBottom:'3px'}}> Number of Speakers </Typography>
      <ButtonGroup variant="outlined" size="large" color="grey">
        {
          [1, 2, 3].map((num) => (
            <Button
              key={num}
              style={speakerCount === num ? { backgroundColor: '#3F3A39', color: 'white', border: '1px solid black' } : {}}
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


 const SpeakerListBox = ({speakerCount,speakersList,setSpeakerList}) => {
      return(
        <Grid2 sx={{border:"1px solid grey",borderRadius:'5px',marginTop:'10px'}}>
          {/* Heading and Edit Button*/}
          <Grid2 sx={{display:'flex', justifyContent:'space-between',padding:'10px'}}>
          <Typography sx={{color:'grey',fontSize:'14px',fontWeight:'80',paddingBottom:'3px'}}>Speakers</Typography>
          <IconButton sx={{padding:'0px'}}>
          <EditIcon sx={{color:'grey',width:'20px',height:'20px'}}/>
          </IconButton>
          </Grid2>
          {/* Speakers List */}
          <Grid2 sx={{display:'flex', flexWrap:'wrap',padding:'10px', gap:'10px'}}>
            {
              speakersList.map((obj,ind) => {
                if(ind < speakerCount)
                {
                  return(
                    <Grid2 sx={{width:'auto', 
                                height:'auto', 
                                padding : '5px 10px',
                                border:'1px solid black', 
                                borderRadius:'5px',
                                display:'flex', 
                                gap:'10px', 
                                justifyContent:'center',
                                alignItems:'center',
                                backgroundColor:'#3F3A39'}}>
                      <Avatar sx={{width:'22px',height:'22px', blackgroundColor:'white'}}>
                        A
                      </Avatar>
                      <Typography sx={{color:'white',fontSize:'14px',fontWeight:'80',paddingBottom:'3px'}}>{obj.name}</Typography>
                    </Grid2>
                  )
                }
                return null
              })
            }
          </Grid2>  
        </Grid2>
      )
 }


const ScriptInputBox = () => {

   const [scriptType, setScriptType] = useState('podcast')
   const [speakerCount,setSpeakerCount] = useState(null);
   const [speakersList, setSpeakerList] = useState(speakersListD);
   const [inputPrompt,setInputPrompt] = useState('');
   const [tone,setTone] = useState('Funny');
   const {generateScript} = useProjectInfo();

   const handleChange = (event) => {
    setScriptType(event.value);
  };

  const createScript = async () => {
     const promptData = {
        prompt : inputPrompt,
        speakers : speakersList.filter((obj,ind) => ind < speakerCount).map((speaker) => speaker.name),
        tone : tone
     }
     console.log(promptData);
     generateScript(promptData);
  }

  return (
    <Box sx={styles.root}>
      <Box display= 'flex' flexDirection='column' alignItems='center' justifyContent='center'>

      <Typography sx={styles.genScriptTxt}>Generate Script Using AI</Typography>
      <ScriptTypeSelectBox scriptType={scriptType} setScriptType={setScriptType}/>

      <TextField variant='outlined' 
                  label="Prompt" 
                  onChange={(e) => setInputPrompt(e.target.value)}
                  value={inputPrompt}
                  placeholder='Enter your prompt' 
                  fullWidth multiline 
                  maxRows={5} 
                  height={'80px'}
                  margin='normal'/>
      </Box>

      <div style={styles.row}>
          <TextField
            select
            label="Tone"
            defaultValue="funny"
            margin='dense'
            onChange={(e)=> setTone(e.target.value)}
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
                     speakersList={speakersList} 
                     setSpeakerList={setSpeakerList}/>

     <div style={{...styles.row,justifyContent:'space-between', marginTop:'20px',}}>
      <Grid2 size={5} 
                sx={{...styles.scriptTypeSubBox, 
                    backgroundColor:'#3F3A39',
                    color:'white', 
                    width:'60%'
                    }}>
        <Typography sx={styles.scriptTypeSubBoxText}>Browse Prompt</Typography>
          <ArrowDropDownIcon sx={{color:'white',width:'25px',height:'25px'}}/>
      </Grid2>
      <IconButton sx={{backgroundColor:'#3F3A39'}} onClick={() => createScript()}>
          <SendIcon sx={{color:'white',width:'25px',height:'25px'}}/>
      </IconButton>
      </div> 

    </Box>
  )
}


const styles = {
  root : {display: 'flex',flexDirection:'column',margin: 2,flexGrow:1,flexWrap: 1},
  genScriptTxt: {fontFamily:'karma',fontSize: 28,justifyContent:'space-between'},
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
    backgroundColor: '#FFFBFB',
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