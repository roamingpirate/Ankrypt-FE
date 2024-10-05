import React, {useState} from 'react';
import { Grid2 as Grid,Typography,TextField,MenuItem, IconButton, Button,CircularProgress} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import scriptData from '../../data/scriptData';
import { useProjectInfo } from '../../utility/ProjectContext';

const SelectBtn = ({val,sceneInd,scriptInd}) => {

    const {script} = useProjectInfo();

    return (
        <TextField
        select
        value={script[sceneInd].script[scriptInd][val]}
        // defaultValue={script[sceneInd].script[scriptInd][val]}
        margin='dense'
          InputProps={{
            style: {
              height: '25px',
              fontFamily:'karma',
              fontSize:'14px' 
            }
          }}
        >
        {(script[sceneInd].script).map((arr) => (
        <MenuItem key={arr[val]} value={arr[val]}>
            {arr[val]}
        </MenuItem>
        ))}
        </TextField>
    )
}


const DialogBox = ({sceneInd,scriptInd,script,setScript}) => {
    return (
      <Grid container sx={{ padding: '5px', border:'1px solid grey', borderRadius:'5px',margin:'10px'}}>
             {/* Head */}

            <Grid container sx={{ display: 'flex', alignItems: 'center',width:'100%' }}>
                <Grid item sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item>
                    <SelectBtn val={"Speaker"} sceneInd={sceneInd} scriptInd={scriptInd} />
                    </Grid>
                    <Grid item>
                    <SelectBtn val={"Tone"} sceneInd={sceneInd} scriptInd={scriptInd} />
                    </Grid>
                </Grid>
                </Grid>
                <Grid item>
                <IconButton>
                    <DeleteOutlineOutlinedIcon sx={{ color: 'black', width: '18px', height: '18px' }} />
                </IconButton>
                </Grid>
            </Grid>

             {/* Text */}
            <TextField
                       value={(script[sceneInd].script)[scriptInd].Speech}
                       sx={{padding:'3px', fontFamily:'Hubballi',fontSize:'16px',width:'100%',
                        '& .MuiInputBase-root': {
                            border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: 'none',
                            },
                        },
                       }}
                       multiline
                       onChange={(event) => changeScripData(event,scriptInd,sceneInd,script,setScript)}
                       />
      </Grid>
    )
}

const ScriptViewComp = () => {

    const {script,setScript,isLoading} = useProjectInfo(); 

    if(isLoading)
    {
      return <div style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center'}}><CircularProgress /></div>;
    }

    return (
        <div style={{ marginTop: '20px',overflow: 'auto'}}>
           {script.map((sceneScript,sceneInd) => (
              <Grid style={{border:'1px solid black', padding: '5px',margin:'20px'}}>
                  <Typography style={{padding:'5px',fontWeight:'600',fontFamily:'Hubballi'}}>
                     {sceneScript.sceneName}
                  </Typography>
                {(sceneScript.script).map((obj, scriptInd) => (
                    <DialogBox sceneInd={sceneInd} scriptInd={scriptInd} script={script} setScript={setScript} />
                ))}
              </Grid>
           ))
          }
        </div>
    )
}


const changeScripData = (event,scriptInd,sceneInd,script,setScript) => {
    const updatedSceneScriptData = [...(script[sceneInd].script)];
    updatedSceneScriptData[scriptInd].Speech = event.target.value;
    const scriptData = [...script];
    scriptData[sceneInd].script = updatedSceneScriptData;
    setScript(scriptData); 
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

  export default ScriptViewComp;