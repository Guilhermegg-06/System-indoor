import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { visualizationConfig } from './config/visualization'

const localCampus = {
  ...visualizationConfig,
  modelUrl: import.meta.env.BASE_URL + 'models/Campus_Amelia_Uchoa.glb',
  walkUrl: import.meta.env.BASE_URL + 'models/campus-walk.bin',
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App visualization={localCampus} />
  </StrictMode>,
)
