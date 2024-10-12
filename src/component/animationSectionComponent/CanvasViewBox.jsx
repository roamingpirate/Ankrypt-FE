import { Typography, CircularProgress } from "@mui/material";
import Experience  from "../../canvas/Experience"
import { useProjectInfo } from "../../utility/ProjectContext";



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
        <Experience/>
    )
}

export default CanvasViewBox;