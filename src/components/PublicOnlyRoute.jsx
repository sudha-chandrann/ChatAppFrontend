import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";
import { useDispatch } from "react-redux";
import { authlogin } from "../redux/userslice";
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const PublicOnlyRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch=useDispatch();


  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/users/getcurrentuser`);
        if (response.data.success) {
          setIsAuthenticated(true);
          dispatch(authlogin(response.data.user));
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
    return <Loader />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicOnlyRoute;
