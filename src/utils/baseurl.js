const apiBaseUrl = import.meta.env.VITE_PROD 
  ? import.meta.env.VITE_API_URL 
  : '';
export default apiBaseUrl;
