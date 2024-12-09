import React, { useEffect, useState } from 'react';
import { Menu } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { addProjectToUser, getBackgroundCoverUrl, getProjectList } from '../api/projectApi';
import { Button, CircularProgress, Grid2, Modal, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CoverImagesUrls from '../data/coverImages.json'


const generateRandomName = () => {
  const adjectives = [
    "Vibrant", "Epic", "Whimsical", "Cosmic", "Dynamic", 
    "Inspiring", "Radiant", "Innovative", "Dramatic", "Timeless",
    "Ethereal", "Legendary", "Majestic", "Playful", "Bold",
    "Infinite", "Ingenious", "Mystical", "Enchanting", "Luminous"
  ];
  
  const nouns = [
    "Chronicle", "Saga", "Odyssey", "Vision", "Frame", 
    "Narrative", "Journey", "Adventure", "Realm", "Spectacle",
    "Tale", "Storyline", "Arc", "Perspective", "Episode",
    "Creation", "Masterpiece", "Verse", "Drama", "Sequence"
  ];

  const getRandomItem = array => array[Math.floor(Math.random() * array.length)];
  
  return `${getRandomItem(adjectives)} ${getRandomItem(nouns)}`;
};

const ProjectCard = ({ name, id, projectNo, img, index }) => {

    const navigate = useNavigate();
    const [imageUrl, setImageUrl] =useState(undefined);

    useEffect(() => {
      const coverUrl = CoverImagesUrls[index % CoverImagesUrls.length];
      setImageUrl(coverUrl);
    },[])

    console.log(img)
    return (
      <div class="p-[2px] rounded-xl bg-gradient-to-r from-[#2b5876] to-[#4e4376] hover:cursor-pointer flex w-[140px] sm:w-[220px] justify-center items-center hover:scale-105 transition duration-500">
      <div onClick={()=> navigate(`/app/${projectNo}`,{ state: { projectName : name } })} className="rounded-xl w-[140px] sm:w-[220px]  h-[200px] sm:h-[350px] hover:cursor-pointer shadow-md p-4 bg-gray-800 hover:shadow-lg transform transition duration-500 ">
        {imageUrl? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-[70%] rounded-lg object-cover mb-4 brightness-75 border-2 border-gray-100" 
          />
        ) : (
          <div className="w-full h-[70%] rounded-md bg-gray-700 border-2 brightness-75 border-gray-100"></div>
        )}
        <div className='sm:p-2'>
        <h2 className="text-md sm:text-lg text-white font-semibold mt-2 truncate">{name}</h2>
        <p className="text-[10px] text-white sm:text-sm">Project No: {projectNo}</p>
        </div>
      </div>
      </div>
    );
  };

const CreateNew = () => {

  const [open, setOpen] = useState(false);
  const {user,logout} = useAuth0();
  const [projectName, setProjectName] = useState(generateRandomName());
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const addProject = async () => {
    const pno=await addProjectToUser(user.email,projectName);
      navigate(`/app/${pno}`,{ state: { projectName } });
  }

    return (
      <>
        <div onClick={() => setOpen(true)} className="flex flex-col justify-center hover:cursor-pointer items-center rounded-xl w-[15%] sm:w-[20%] min-w-[150px] sm:min-w-[200px] h-[200px] sm:h-[350px] shadow-md p-4 bg-gray-800 hover:shadow-lg transform transition duration-500 hover:scale-105">
            <AddIcon style={{width:'120px', height:'120px', color:'grey'}}/>
            <h2 className="text-lg sm:text-xl font-bold mb-2 font-karma text-gray-500">Create New Project</h2>
        </div> 
        <Modal  open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        BackdropProps={{
          style: { backgroundColor: 'rgba(0, 0, 0, 0.05)' }, 
        }}>
              <Grid2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg z-50 shadow-md pt-2 px-4 pb-3 w-[200px] h-[200px] sm:w-[400px] sm:h-[200px]">
               <div className="w-full h-full flex flex-col justify-center items-center ">
                 <TextField
                  label="Project Name" 
                  value= {projectName}
                  variant="outlined" 
                  onChange={e => setProjectName(e.target.value)}
                  fullWidth   
                />
              <div 
                  onClick={() => {if(!isDisabled){addProject(); setIsDisabled(true);}}}
                  className="bg-white text-gray-700 rounded-xl mt-4 p-3 hover:cursor-pointer" 
              >
                  {isDisabled ? (
                    <>
                      Creating Project...
                    </>
                    ) : (
                      'Create Project'
                    )}
              </div>
              </div>
          </Grid2>
      </Modal> 
      </>
    );
}

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projectsList, setProjectsList] = useState([]);

  const {user,logout} = useAuth0();

  const updateProjectList = async () => {
    const pl=await getProjectList(user.email);
    setProjectsList(pl)
  }

  useEffect(() => {
    console.log('User:', user);
    updateProjectList();
  },[]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigate = useNavigate();

  return (
      <div className ="flex flex-col h-screen bg-gray-800">
      <div className="flex  flex-col sm:flex-row flex-1 h-full bg-gray-800">
        {/* Sidebar */}
        <div className={`flex flex-row flex-wrap sm:flex-col  hover:cursor-pointer text-white sm:w-[20%] sm:min-w-[250px] py-0 sm:py-6 p-2 ${isSidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
          <div className="sm:hidden flex items-center justify-between p-4 bg-gray-800">
            <button onClick={toggleMenu} className="text-white">
              <MenuIcon fontSize="medium" />
            </button>
          </div>
          <p onClick={() => navigate('/')} className="font-ks text-xl py-3 sm:py-0 sm:text-4xl mx-1 sm:mx-4 text-center">Ancript</p>

          {menuOpen && (
        <div className="sm:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10" onClick={toggleMenu}>
          <div className="absolute top-0 right-0 w-3/4 max-w-sm bg-gray-900 text-white p-6 shadow-lg h-full">
            {/* User Info Section */}
            <div className="flex items-center p-0">
              <img
                src={user.picture}
                alt="User"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="ml-3">
                <p className="font-bold">{user.name}</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
            {/* Logout Section */}
            <div
              className="flex items-center p-1 mt-6 cursor-pointer hover:bg-gray-700 rounded-md"
              onClick={() => { toggleMenu(); logout(); }}
            >
              <LogoutIcon className="mr-2" />
              <p className="font-medium">Sign Out</p>
            </div>
          </div>
        </div>
      )}

         {/* Projects */}
            <div className=" mt-[30px] flex-grow hidden sm:block">
                <h3 className="text-3xl font-karma font-semibold px-4 py-2">Projects</h3>
                <ul className="max-h-72 overflow-y-scroll">
                  {projectsList.map((project) => (
                    <li key={project.id} className="px-4 py-2 hover:bg-gray-700">
                      {project.projectName}
                    </li>
                  ))}
                </ul>

            </div>
          {/* user info */}
          <div className="hidden sm:flex flex-wrap items-center p-1">
            <img
              src={user.picture}
              alt="User "
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="ml-0 xl:ml-2">
              <p className="font-bold">{user.name}</p>
              <p className="text-sm">{user.email}</p>
            </div>
          </div>
          {/* log out */}
          <div className='hidden sm:flex  p-3 px-6' onClick={()=>{logout();}}>
            <LogoutIcon/>
            <p className='font-medium text-gray-50 mx-3'>Sign Out</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full h-full bg-[#16222A]">
              {0 ? 
                <div className='flex flex-col h-full justify-center items-center'>
                    <p className='text-2xl text-gray-400 font-karma text-center p-3'>Get Started by Creating Your First Project</p>
                    <div className='bg-gray-800 rounded-lg text-center p-3 hover:cursor-pointer' onClick={() => {loginWithPopup()}}>
                        <p className='font-medium font-karma text-white'>
                            Create Project
                        </p>
                    </div>
                </div>
                :
                <div className='flex flex-col h-full ml-[5%] '>
                  <p className='text-xl sm:text-3xl font-karma font-semibold pt-10 pb-5 text-white'>Recent Projects</p>
                <div className='flex flex-wrap gap-8 overflow-y-auto pb-10 pt-2 md:pl-2 md:pr-5'>
                    <CreateNew/>
                    {projectsList.map((project,index) => (
                        <ProjectCard name={project.projectName} id={project.projectId} projectNo={project.projectNo} img={project.img} index={index}/>
                    ))}                   
                </div>
                </div>
              }
        </div>

        </div>
      </div>
  );
};

export default Dashboard;