import { Typography, CircularProgress, Grid2, Paper } from "@mui/material";
import Experience  from "../../canvas/Experience"
import { useProjectInfo } from "../../utility/ProjectContext";
import { BorderRight } from "@mui/icons-material";



const CanvasViewBox = () => {

    const {canavsLoaded,canavsLoadingMessage} = useProjectInfo();

    if(!canavsLoaded)
    {
        return (
            <div style={{display:'flex',flexDirection:'column',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <CircularProgress size={30}/>
                <Typography style={{height: '25px', fontFamily:'karma', fontSize:'14px',padding:'10px',fontWeight:'600'}}>
                    {canavsLoadingMessage}
                </Typography>
            </div> 
        )
    }

    return(
        <Paper elevation={3} style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'10px',margin:'10px', borderRadius:'10px'}}>
        <Experience/>
        </Paper>
    )
}

export default CanvasViewBox;