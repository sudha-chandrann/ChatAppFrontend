import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import OTPVerification from './pages/OTPVerification.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicOnlyRoute from './components/PublicOnlyRoute.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import Profile from './pages/Profile.jsx';
import NoChatOpenScreen from './components/NoChatOpenScreen.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: "",
            element: <LandingPage />,
          },
          {
            path: "register",
            element: <Register />
          },
          {
            path: "login",
            element: <Login />
          },
          {
            path: "verificationOTP",
            element: <OTPVerification />
          }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard/",
            element: <DashboardLayout />,
            children: [
              {
                path: "",
                element: <NoChatOpenScreen />,
              },
              {
                path: "profile",
                element: <Profile />,
              }
            ]
          },
        ]
      }

    ]

  },
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
  <RouterProvider router={router}/>
  </Provider>
   </StrictMode>,
)
