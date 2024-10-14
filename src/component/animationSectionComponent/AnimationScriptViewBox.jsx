import React, {useState} from 'react';
import { Grid2 as Grid,Typography,TextField,MenuItem, IconButton, Button, Divider,Tooltip,CircularProgress,Paper} from '@mui/material';
import animationScriptData from '../../data/animationScriptData';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useProjectInfo } from '../../utility/ProjectContext';
import { updateAnimationScript } from '../../api/projectApi';


const FCCorrespondingColors = {
    "Smile": "#FFF8DC",   // Cornsilk - light and warm
    "Happy": "#FFA07A",   // LightSalmon - soft and energetic
    "Laughing": "#FFDAB9",  // PeachPuff - light and playful
    "Neutral": "#D3D3D3", // LightGray - subtle and calm
    "Curious": "#E0FFFF", // LightCyan - fresh and inquisitive
    "Surprised": "#FFB6C1" // LightPink - gentle and expressive
  }


const SelectBtn = ({val,data,updateValue,label}) => {

    return (
        <TextField
        select
        value={val}
          InputProps={{
            style: {
              height: '22px',
              fontFamily:'karma',
              fontSize:'12px' 
            }
          }}
          onChange={(event)=>{updateValue(event,label)}}
        >
        {data.map((arr) => (
        <MenuItem key={arr} value={arr}>
            {arr}
        </MenuItem>
        ))}
        </TextField>
    )
}


const DialogBox = ({obj}) => {
    return (
            <Paper elevation={1} style={{...styles.DialogBoxStyle,backgroundColor:FCCorrespondingColors[obj.FaceExpression]}}> 
            <Typography>
                {obj.Text}
            </Typography>
            </Paper>
    )
}
const ExpandedDialogBox = ({obj,sind,sceneInd,scriptInd,isSelected,setIsSelected,animationScript,setAnimationScript}) => {

    const animationsList =["Talking_1", "Talking_2", "Introducing","Explaining"]
    const FaceExpressions=["Smile","Neutral", "Happy","Curious","Surprised","Laughing"]
    const {setSave} = useProjectInfo();

    const updateAnimationSpeechObject = (event,label) => {
        const updatedSceneAnimationScript = [...animationScript[sceneInd].Script];
        updatedSceneAnimationScript[scriptInd].Speech[sind][label]=event.target.value;
        const updatedAnimationScript = [...animationScript];
        updatedAnimationScript[sceneInd].Script=updatedSceneAnimationScript;
        setAnimationScript(updatedAnimationScript);
        console.log(updatedAnimationScript);
        setSave(true);
    }



    return (
        <Grid container sx={styles.ExpandedDialogBoxStyle}>

                {/* Dialog */}

                <Paper style={{...styles.DialogBoxStyle,backgroundColor:FCCorrespondingColors[obj.FaceExpression],width:'70%'}}>
                    <Typography>
                        {obj.Text}
                    </Typography>
                </Paper>

                {/* Animation and FaceExpression Select */}

                <Grid  container spacing={1} direction={'column'} sx={{ alignItems:'center',padding:'2px',width:'20%'}}>
                    <Tooltip title="Animation">
                    <Grid item>
                        <SelectBtn val={obj.Animation} data={animationsList} updateValue={updateAnimationSpeechObject} label={"Animation"}/>
                    </Grid>
                    </Tooltip>
                    <Tooltip title="Face Expression">
                    <Grid item>
                        <SelectBtn val={obj.FaceExpression} data={FaceExpressions} updateValue={updateAnimationSpeechObject} label={"FaceExpression"}/>
                    </Grid>
                    </Tooltip>
                </Grid>

                {/* Play Done Icons */}

                <Grid  container spacing={1} direction={'column'} sx={{alignItems:'center',padding:'2px',width:'5%'}}>
                    <Tooltip title="Close" >
                        <Grid item >
                            <CancelRoundedIcon onClick={()=> setIsSelected(!isSelected)} sx={{ color: 'black', width: '20px', height: '20px' }}/>
                        </Grid>
                    </Tooltip>
                    <Tooltip title="Play">
                        <Grid item>
                            <PlayCircleFilledIcon sx={{ color: 'black', width: '20px', height: '20px' }}/>
                        </Grid>
                    </Tooltip>
                </Grid>

        </Grid>
    )
}


const DynamicDialogBox = ({obj,sind,sceneInd,scriptInd,animationScript,setAnimationScript}) => {
    const [isSelected, setIsSelected] = useState(false);

    return (
        <>
            {   
                isSelected? 
                (<div style={{width:'100%'}}>
                    <ExpandedDialogBox obj={obj} 
                                       sind={sind}
                                       sceneInd={sceneInd}
                                       scriptInd={scriptInd}
                                       setIsSelected={setIsSelected} 
                                       isSelected={isSelected} 
                                       animationScript={animationScript} 
                                       setAnimationScript={setAnimationScript}/>
                  </div>): 
                (<div style={{display:'flex', flexWrap:'wrap'}} onClick={()=>setIsSelected(true)}><DialogBox obj={obj}/></div>)
            }
        </>
    )
}



const AnimationSpeechBox = ({sceneInd,scriptInd,animationScript,setAnimationScript}) => {

    const viewType = ["Listener", "Character"]
    const {setSave} = useProjectInfo();
    const updateAnimationScriptObj = (event,label) => {
        const updatedSceneAnimationScript = [...animationScript[sceneInd].Script];
        updatedSceneAnimationScript[scriptInd][label]=event.target.value;
        const updatedAnimationScript = [...animationScript];
        updatedAnimationScript[sceneInd].Script=updatedSceneAnimationScript;
        setAnimationScript(updatedAnimationScript);
        console.log(updatedAnimationScript);
        setSave(true);
    }

    return (
      <Paper elevation={2} sx={styles.AnimationSpeechBoxStyle}>

             {/* Head */}
            <Grid container sx={{ display: 'flex', alignItems: 'center',width:'100%' }}>
                <Grid item sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item>
                     <Typography style={{height: '25px', fontFamily:'karma', fontSize:'14px',padding:'2px',fontWeight:'600' }}>{animationScript[sceneInd].Script[scriptInd].Speaker}</Typography>
                    </Grid>
                    <Grid item>
                        <SelectBtn val={animationScript[sceneInd].Script[scriptInd].Look} data={viewType} label={"Look"} updateValue={updateAnimationScriptObj}/>
                    </Grid>
                </Grid>
                </Grid>
                <Grid item>
                <IconButton>
                    <PlayCircleFilledIcon sx={{ color: 'black', width: '20px', height: '20px' }} />
                </IconButton>
                </Grid>
            </Grid>

             {/* Speech Dialogs */}
            <Grid sx={{width:'100%',display:'flex',flexWrap:'wrap' }}>
                {
                    animationScript[sceneInd].Script[scriptInd].Speech.map((obj,indi) => 
                         <DynamicDialogBox obj={obj} sind={indi} sceneInd={sceneInd} scriptInd={scriptInd} animationScript={animationScript} setAnimationScript={setAnimationScript}/>
                        )
                }
            </Grid>

      </Paper>
    )
}

const AnimationScriptViewBox = () => {

    const {animationScript, setAnimationScript,isLoading} = useProjectInfo(); 
   // console.log(animationScript);

    if(isLoading)
    {
        return <div style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center'}}><CircularProgress /></div>;
    }

    return (
        <div style={{ marginTop: '15px',overflow: 'auto'}}>
            {
                animationScript.map((sceneAnimationScript,sceneInd) => (
                    <>
                    {
                        sceneAnimationScript.Script.map((obj, scriptInd) => (
                        <AnimationSpeechBox sceneInd={sceneInd} scriptInd={scriptInd} animationScript={animationScript} setAnimationScript={setAnimationScript} />
                    ))}
                    </>
                ))
            }
        </div>
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
    },
    DialogBoxStyle : {
      //  border:'1px solid grey',
        cursor: 'pointer',
        borderRadius:'5px',
        margin:'5px',
        padding:'2px'
    },
    ExpandedDialogBoxStyle : {
            width:'100%', 
            borderRadius:'10px', 
            border:'1px solid grey',
            marginTop: '5px', 
            padding:'5px',
            alignItems:'center'
    },
    AnimationSpeechBoxStyle: { 
            padding: '8px', 
            paddingLeft:'10px', 
           // border:'1px solid grey', 
            borderRadius:'5px',
            margin:'10px',
            marginBottom:'15px'
    }
  
  }

  export default AnimationScriptViewBox;