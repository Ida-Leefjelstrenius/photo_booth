import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import router from './router.jsx'
import { RouterProvider } from 'react-router-dom'
import { PhotoProvider } from './PhotoContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PhotoProvider>
      <RouterProvider router={router} />
    </PhotoProvider>
  </StrictMode>,
)
