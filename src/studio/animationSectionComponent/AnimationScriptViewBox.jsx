import React, {useEffect, useState} from 'react';
import { Grid2 as Grid,Typography,TextField,MenuItem, IconButton,Tooltip,CircularProgress,Paper,useMediaQuery, useTheme} from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useProjectInfo } from '../../hooks/ProjectContext';



// const FCCorrespondingColors = {
//     "Smile": "#FFF8DC",   // Cornsilk - light and warm
//     "Happy": "#FFA07A",   // LightSalmon - soft and energetic
//     "Laughing": "#FFDAB9",  // PeachPuff - light and playful
//     "Neutral": "#D3D3D3", // LightGray - subtle and calm
//     "Curious": "#E0FFFF", // LightCyan - fresh and inquisitive
//     "Surprised": "#FFB6C1" // LightPink - gentle and expressive
//   }

  const FCCorrespondingColors = {
    "Smile": "#C2B280",   // Darker Cornsilk
    "Happy": "#D2691E",   // Chocolate - deeper shade of LightSalmon
    "Laughing": "#FF6347",  // Tomato - darker PeachPuff
    "Neutral": "#A9A9A9", // DarkGray - deeper shade of LightGray
    "Curious": "#66CDAA", // MediumAquaMarine - darker LightCyan
    "Surprised": "#FF1493" // DeepPink - darker LightPink
}

// const FCCorrespondingColors = {
//     "Smile": "#B49B6D",   // Muted Cornsilk - a more neutral beige
//     "Happy": "#CD5C5C",   // IndianRed - a deeper, less vibrant shade of LightSalmon
//     "Laughing": "#FF8C69",  // Salmon - softer shade of PeachPuff
//     "Neutral": "#8A8A8A", // Darker, muted gray - less bright than LightGray
//     "Curious": "#66B3B8", // Darker and softer LightCyan
//     "Surprised": "#D48FB1" // MediumRose - toned-down version of LightPink
// }




const SelectBtn = ({ val, data, updateValue, label }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is small (based on Material-UI's breakpoints)

    return (
        <TextField
            select
            value={val}
            InputProps={{
                style: {
                    height: isSmallScreen ? '22px' : '22px', // Adjust height based on screen size
                    fontFamily: 'karma',
                    fontSize: isSmallScreen ? '9px' : '12px', // Adjust font size for small screens
                },
            }}
            onChange={(event) => { updateValue(event.target.value, label); }}
        >
            {data.map((arr) => (
                <MenuItem key={arr} value={arr}>
                    {arr}
                </MenuItem>
            ))}
        </TextField>
    );
};



const DialogBox = ({obj}) => {
    return (
            <Paper elevation={1} style={{...styles.DialogBoxStyle, backgroundColor:FCCorrespondingColors[obj.FaceExpression]}}> 
            <p className='font-mono text-sm sm:text-base'>
                {obj.Text}
            </p>
            </Paper>
    )
}
const ExpandedDialogBox = ({obj,sind,sceneInd,scriptInd,isSelected,setIsSelected,animationScript,setAnimationScript}) => {

    const animationsList =["Talking_1", "Talking_2", "Introducing","Explaining"]
    const FaceExpressions=["Smile","Neutral", "Happy","Curious","Surprised","Laughing"]
    const {setSave} = useProjectInfo();

    const updateAnimationSpeechObject = (val,label) => {
        const updatedSceneAnimationScript = [...animationScript[sceneInd].Script];
        updatedSceneAnimationScript[scriptInd].Speech[sind][label]=val;
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
                    <p className='font-mono text-sm sm:text-base'>
                        {obj.Text}
                    </p>
                </Paper>

                {/* Animation and FaceExpression Select */}

                <Grid  container spacing={1} direction={'column'} sx={{ alignItems:'center',padding:'2px',width:{xs:'20%',sm: '20%',md: '20%', lg: '20%'}}}>
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

                <Grid  container spacing={1} direction={'column'} sx={{alignItems:'center',padding:'2px',width:'5%',zIndex:5}}>
                    <Tooltip title="Close" >
                        <Grid item >
                            <CancelRoundedIcon onClick={()=> setIsSelected(!isSelected)} sx={{ color: 'white', width: '20px', height: '20px' }}/>
                        </Grid>
                    </Tooltip>
                    <Tooltip title="Play">
                        <Grid item>
                            <PlayCircleFilledIcon sx={{ color: 'white', width: '20px', height: '20px' }}/>
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
    const view = ["Focused", "Normal"]
    const currentView = animationScript[sceneInd].Script[scriptInd].View ;
    const {setSave} = useProjectInfo();

    const updateAnimationScriptObj = (val,label) => {
        const updatedSceneAnimationScript = [...animationScript[sceneInd].Script];
        updatedSceneAnimationScript[scriptInd][label]=val;
        const updatedAnimationScript = [...animationScript];
        updatedAnimationScript[sceneInd].Script=updatedSceneAnimationScript;
        setAnimationScript(updatedAnimationScript);
        console.log(updatedAnimationScript);
        setSave(true);
    }

    // useEffect(() => {
    //     if(currentView != 'Focused'){
    //         updateAnimationScriptObj('Normal', 'View');
    //     }
    // },[])

    return (
      <Paper elevation={2} sx={styles.AnimationSpeechBoxStyle} className="bg-[#1e1f20]">

             {/* Head */}
            <Grid container sx={{ display: 'flex', alignItems: 'center',width:'100%' }}>
                <Grid item sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item>
                     <Typography style={{height: '25px', fontFamily:'karma', fontSize:'14px',padding:'2px',fontWeight:'600' }}>{animationScript[sceneInd].Script[scriptInd].Speaker}</Typography>
                    </Grid>
                    {/* View  */}
                        <Tooltip title="View Mode" placement="top" arrow>
                            <Grid item>
                                <SelectBtn val={(currentView == 'Focused')? currentView : "Normal"} data={view} label={"View"} updateValue={updateAnimationScriptObj}/>
                            </Grid>
                        </Tooltip>
                    {/* Character Look */}
                    { currentView != 'Focused' &&
                        <Tooltip title="Speakers Look" placement="top" arrow >
                            <Grid item>
                                <SelectBtn val={animationScript[sceneInd].Script[scriptInd].Look ?? 'Listener'} data={viewType} label={"Look"} updateValue={updateAnimationScriptObj}/>
                            </Grid>
                        </Tooltip>
                    }
                </Grid>
                </Grid>
                <Grid item>
                <IconButton>
                    <PlayCircleFilledIcon sx={{ color: 'white', width: '20px', height: '20px' }} />
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
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
        }, 500);

        return () => clearInterval(interval);
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center h-screen bg-[#181414]">
                <div className="loader mx-[50%] "></div>
                <p className="font-mono ml-[25%] sm:ml-[40%] py-4">{`Animation Script is being fetched${dots}`}</p>
            </div>
        );
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
        padding:'2px',
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
            marginBottom:'15px',
            backgroundColor:'#1f2937'
    }
  
  }

  export default AnimationScriptViewBox;