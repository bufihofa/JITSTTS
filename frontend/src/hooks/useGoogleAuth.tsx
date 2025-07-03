import { useGoogleLogin as useGoogleLoginOriginal } from "@react-oauth/google";
import { axiosInstance } from "../api/axiosInstance";
import storage from "../utils/storage";
import { useNavigate } from "react-router-dom";

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  
  const login = useGoogleLoginOriginal({
    onSuccess: async (tokenResponse) => {
      try {
        

        const response = await axiosInstance.post('/api/auth/google', {
          token: tokenResponse.access_token
        });
        
        storage.saveLoginData(
          response.data.token, 
          response.data.user.role, 
          response.data.user.username
        );
        
        navigate('/home');
      } catch (error) {
        console.error("Google login error:", error);
        return { error: "Google login failed" };
      }
    },
    onError: () => {
      console.error("Google login failed");
      return { error: "Google login failed" };
    }
  });
  
  return login;
};