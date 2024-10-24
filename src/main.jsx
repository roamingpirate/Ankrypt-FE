import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProjectInfoProvider } from './utility/ProjectContext.jsx'
import App from './App.jsx'
import './index.css'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ProjectInfoProvider> */}
    <App />
    {/* </ProjectInfoProvider> */}
  </StrictMode>,
)
