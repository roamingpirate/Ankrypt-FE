import React, {useState} from 'react';
import { Grid2 as Grid,Typography,TextField,MenuItem, IconButton, Button,CircularProgress} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import scriptData from '../../data/scriptData';
import { useProjectInfo } from '../../utility/ProjectContext';

// const SelectBtn = ({val,sceneInd,scriptInd}) => {

//     const {script, projectSpeakerList} = useProjectInfo();

//     return (
//         <TextField
//         select
//         value={script[sceneInd].script[scriptInd][val]}
//         // defaultValue={script[sceneInd].script[scriptInd][val]}
//         margin='dense'
//           InputProps={{
//             style: {
//               height: '25px',
//               fontFamily:'karma',
//               fontSize:'14px' 
//             }
//           }}
//         >
//         {(script[sceneInd].script).map((arr) => (
//         <MenuItem key={arr[val]} value={arr[val]}>
//             {arr[val]}
//         </MenuItem>
//         ))}
//         </TextField>
//     )
// }

const AddDialogLine = () => {
  return (
    <div className='justify-center items-center flex'>
    <div className="flex justify-center items-center text-center w-[93%]">
      <div className='flex-grow border-[1px] border-gray-600'/>
      <p className='text-lg px-2 font-bold text-gray-600'>+</p>
      <div className='flex-grow border-[1px] border-gray-600'/>
    </div>
    </div>
  )
}

const SelectBtn = ({val,data,updateValue,label}) => {

  return (
      <TextField
      select
      value={val}
        InputProps={{
          style: {
            height: '25px',
            fontFamily:'karma',
            fontSize:'14px' 
          }
        }}
        onChange={(event)=>{updateValue(label,event.target.value)}}
      >
      {data.map((arr) => (
      <MenuItem key={arr} value={arr}>
          {arr}
      </MenuItem>
      ))}
      </TextField>
  )
}



const DialogBox = ({sceneInd,scriptInd,script,setScript,setSave}) => {
  const {changesList, setChangesList,speakerList} = useProjectInfo();

  const updateScriptArray = (label,val) => {
    const scriptSceneDialogsCopy = [...script[sceneInd].script];
    scriptSceneDialogsCopy[scriptInd][label] = val;
    const scriptCopy = [...script];
    scriptCopy[sceneInd].script = scriptSceneDialogsCopy;
    setScript(scriptCopy);
    const changesListCopy = [...changesList];
    if (!changesListCopy.includes(`${sceneInd}${scriptInd}`)) {
      changesListCopy.push(`${sceneInd}${scriptInd}`);
    }
    console.log("Change Happened!");
    console.log(changesList);
    setChangesList(changesListCopy);
    setSave(true);
  }
    const speaker = script[sceneInd].script[scriptInd]["Speaker"];
   const speakerNames = speakerList.map((speaker) => speaker.avatarName);
   console.log(speakerNames);
    return (
      <div>
      <Grid container className=" p-[5px] rounded-lg mx-[10px] bg-gray-800">
             {/* Head */}

             <div className="flex items-center w-full">
                <div className="flex-grow">
                  <div className="flex space-x-2">
                    <div>
                      {/* <SelectBtn val={"Speaker"} sceneInd={sceneInd} scriptInd={scriptInd} /> */}
                      <SelectBtn val={script[sceneInd].script[scriptInd]["Speaker"]} data={speakerNames} updateValue={updateScriptArray} label={"Speaker"}/>
                    </div>
                    {/* TONE DROP DOWN IMPLEMENT */}
                    {/* <div>
                      <SelectBtn val={"Tone"} sceneInd={sceneInd} scriptInd={scriptInd} />
                    </div> */}
                  </div>
                </div>
                <div>
                  <button className="p-1" onClick={() => deleteScriptData(scriptInd,sceneInd,script,setScript,setSave,changesList,setChangesList)}>
                    <DeleteOutlineOutlinedIcon className="text-white w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>


             {/* Text */}
            <TextField
                       value={(script[sceneInd].script)[scriptInd].Speech}
                       placeholder='your dialogs goes here...'
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
                       onChange={(event) => changeScriptData(event,scriptInd,sceneInd,script,setScript,setSave,changesList,setChangesList)}
                       />
      </Grid>
          <div onClick={ () => {addScriptData(scriptInd,sceneInd,script,setScript,setSave,changesList,setChangesList,speaker)}} className="opacity-0 hover:opacity-100 transition-opacity duration-600 ease-in-out hover:cursor-pointer">
          <AddDialogLine/>
          </div>
      </div>

    )
}



const ScriptViewComp = () => {

    const {script,setScript,isLoading,setSave,changesList, setChangesList} = useProjectInfo(); 

    if(isLoading)
    {
      return (
        <div className='flex flex-col justify-center items-center h-screen bg-[#181414]'>
            <div class="loader"></div>
        </div>   
    )
    }


    return (
        <div style={{ marginTop: '20px',overflow: 'auto'}}>
           {script.map((sceneScript,sceneInd) => (
              <div class="p-[2px] rounded-xl bg-gradient-to-r from-[#2b5876] to-[#4e4376] m-[20px]">
              <div className="rounded-xl bg-[#1e1f20] p-[10px]">
                  <Typography style={{padding:'5px',fontWeight:'600',fontFamily:'Hubballi', color:'white'}}>
                     {sceneScript.sceneName}
                  </Typography>
                  <div className="mb-[10px]" />
                {(sceneScript.script).map((obj, scriptInd) => (
                    <>
                    <DialogBox sceneInd={sceneInd} scriptInd={scriptInd} script={script} setScript={setScript} setSave={setSave}/>
                    </>
                ))}
              </div>
              </div>
           ))
          }
        </div>
    )
}


const changeScriptData = (event,scriptInd,sceneInd,script,setScript,setSave,changesList,setChangesList) => {

    const updatedSceneScriptData = [...(script[sceneInd].script)];
    updatedSceneScriptData[scriptInd].Speech = event.target.value;
    const scriptData = [...script];
    scriptData[sceneInd].script = updatedSceneScriptData;
    setScript(scriptData); 
    const changesListCopy = [...changesList];
    if (!changesListCopy.includes(`${sceneInd}${scriptInd}`)) {
      changesListCopy.push(`${sceneInd}${scriptInd}`);
    }
    console.log("Change Happened!");
    console.log(changesList);
    setChangesList(changesListCopy);
    setSave(true);
}

const deleteScriptData = (scriptInd, sceneInd, script, setScript, setSave, changesList, setChangesList) => {
  const updatedSceneScriptData = [...script[sceneInd].script];
  updatedSceneScriptData.splice(scriptInd, 1);
  const scriptData = [...script];
  scriptData[sceneInd].script = updatedSceneScriptData;
  setScript(scriptData);

  const changesListCopy = [...changesList];
  const changeKey = `${sceneInd}${scriptInd}`;
  const updatedChangesList = changesListCopy.filter(item => item !== changeKey);
  setChangesList(updatedChangesList);

  console.log("Dialogue Deleted!");
  console.log(updatedChangesList);
  setSave(true);
};

const addScriptData = (scriptInd, sceneInd, script, setScript, setSave, changesList, setChangesList, speaker) => {
  const updatedSceneScriptData = [...script[sceneInd].script];
  const newDialogue = { Speech: '' , Speaker: speaker };
  updatedSceneScriptData.splice(scriptInd + 1, 0, newDialogue);

  const scriptData = [...script];
  scriptData[sceneInd].script = updatedSceneScriptData;
  setScript(scriptData);

  const changesListCopy = [...changesList];
  const changeKey = `${sceneInd}${scriptInd + 1}`;
  if (!changesListCopy.includes(changeKey)) {
    changesListCopy.push(changeKey);
  }
  setChangesList(changesListCopy);

  setSave(true);
};




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