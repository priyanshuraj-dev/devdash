// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./index.css"
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById('root')!).render(
  // it helps react warn us about deprecated patterns, unsafe lifecycle patterns
  // <StrictMode>
    <AuthProvider>
      <App />
      </AuthProvider>
    
  // </StrictMode>,
)
