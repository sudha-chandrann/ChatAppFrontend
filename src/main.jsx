import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import OTPVerification from './pages/OTPVerification.jsx';

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
          path:"",
          element:<LandingPage/>,
      },
      {
        path:"register",
        element:<Register/>
      },
      {
        path:"verificationOPT",
        element:<OTPVerification/>
      },
      {
        path:"login",
        element:<Login/>
      },

    ]

  },
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={router}/>
   </StrictMode>,
)
