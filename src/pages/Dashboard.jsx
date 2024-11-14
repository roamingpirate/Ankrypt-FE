// Dashboard.js
import React, { useEffect, useState } from 'react';
import { Menu } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { addProjectToUser, getProjectList } from '../api/projectApi';
import { Button, Grid2, Modal, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';


const ProjectCard = ({ name, id, img }) => {

    const navigate = useNavigate();

    console.log(img)
    return (
      <div class="p-[2px] rounded-xl bg-gradient-to-r from-[#2b5876] to-[#4e4376] hover:cursor-pointer flex justify-center items-center hover:scale-105 transition duration-500">
      <div onClick={()=> navigate(`/app/${id}`,{ state: { projectName : name } })} className="rounded-xl w-[20%] min-w-[150px]  sm:min-w-[200px] h-[200px] sm:h-[350px] hover:cursor-pointer shadow-md p-4 bg-gray-800 hover:shadow-lg transform transition duration-500 ">
        {img ? (
          <img
            src={img}
            alt={name}
            className="w-full h-[70%] rounded-md object-cover mb-4"
          />
        ) : (
          <div className="w-full h-[70%] rounded-md bg-gray-700"></div>
        )}
        <div className='sm:p-2'>
        <h2 className="text-lg sm:text-xl text-white font-semibold mt-2">{name}</h2>
        <p className="text-[12px] text-white sm:text-sm">Project ID: {id}</p>
        </div>
      </div>
      </div>
    );
  };

const CreateNew = () => {

  const [open, setOpen] = useState(false);
  const {user,logout} = useAuth0();
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();

  const addProject = async () => {
    const pid=await addProjectToUser(user.email,projectName);
      navigate(`/app/${pid}`,{ state: { projectName } });
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
              <Grid2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg z-50 shadow-md pt-2 px-4 pb-3 w-[200px] h-[200px] sm:w-[400px] sm:h-[200px]">
               <div className="w-full h-full flex flex-col justify-center items-center ">
                 <TextField
                  label="Project Name" 
                  variant="outlined" 
                  onChange={e => setProjectName(e.target.value)}
                  fullWidth 
                
              />
              <div 
                  onClick={() => addProject()}
                  className="bg-gray-800 text-white rounded-xl mt-4 p-3 hover:cursor-pointer" 
              >
                  <p>Create Project</p>
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
            <div className=" mt-20 flex-grow hidden sm:block">
                <h3 className="text-3xl font-karma font-semibold px-4 py-2">Projects</h3>
                <ul>
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
                <div className='flex flex-wrap gap-8 overflow-y-auto pb-10 pt-2 pl-2 pr-5'>
                    <CreateNew/>
                    {projectsList.map((project) => (
                        <ProjectCard name={project.projectName} id={project.projectId} img={project.img}/>
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