import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "./pages/VerifyEmail";
import Explore from "./pages/Explore";
import PublicPortfolio from "./pages/PublicPortFolio";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";


function App() {
  return (
    // it watches browser url and decides what component to show
    <BrowserRouter>
    <Toaster position="bottom-right" toastOptions={{duration:3000}}/>
    <Routes>
      <Route path="/" element={<Home/>} />

      <Route path="/login" element={
        <PublicRoute>
        <Login/>
        </PublicRoute>
        } />

      <Route path="/signup" element={
        <PublicRoute>
        <Signup />
        </PublicRoute>
        } />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute> 
        } />

      <Route path="/verify-email" element={<VerifyEmail/>} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/portfolio/:username" element={<PublicPortfolio />} />
    </Routes>
    </BrowserRouter>
  )
}
export default App
