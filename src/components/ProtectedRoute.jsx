import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import Loader from './Loader';
import { useDispatch } from 'react-redux';
import { authlogin } from '../redux/userslice';
import apiBaseUrl from '../utils/baseurl';

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch=useDispatch();
    useEffect(() => {

      const checkUserAuth = async () => {
        try {
          const response = await axios.get(`${apiBaseUrl}/api/v1/users/getcurrentuser`, {
            withCredentials: true
          });
          
          if (response.data.success) {
            dispatch(authlogin(response.data.user))
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch {
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };
  
      checkUserAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    if (loading) {
      return <Loader/>
    }
  
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
 };
export default ProtectedRoute
