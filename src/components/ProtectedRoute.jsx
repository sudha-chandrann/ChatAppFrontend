import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import Loader from './Loader';

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {

      const checkUserAuth = async () => {
        try {
          const response = await axios.get('/api/v1/users/getcurrentuser');
          
          if (response.data.success) {
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
    }, []);
  
    if (loading) {
      return <Loader/>
    }
  
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
 };
export default ProtectedRoute
