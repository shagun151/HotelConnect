import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {HotelType} from "../../backend/src/shared/types"


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
console.log("API_BASE_URL:", API_BASE_URL);
export const register = async (formData:RegisterFormData) => {
    console.log("API_BASE_URL:", API_BASE_URL);
    const response = await fetch (`${API_BASE_URL}/api/users/register`,{
        method: "POST",
        credentials:"include",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify(formData),
    });

    const responseBody = await response.json();

    if (!response.ok){
        throw new Error(responseBody.message);
    }
   
};

export const signIn = async (formData: SignInFormData) => {
  try{   
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const body = await response.json();
   
    if(!response.ok){
        throw new Error(body.message)
    }
    return body;
}catch (error) {
    console.error("Error during sign-in:", error);
    throw new Error("Failed to sign in");
  }
};


export const validateToken = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
            credentials: "include",
        });

        console.log('Response Status:', response.status);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (jsonError) {
                console.error('Error parsing JSON from server:', jsonError);
            }

            const errorMessage = errorData ? errorData.message : 'Unknown error';
            console.error('Server Error:', errorData);
            throw new Error(`Token invalid. Server message: ${errorMessage}`);
        }

        return response.json();
    } catch (error:any) {
        console.error('Error during token validation:', error.message);
        throw error;
    }
};

//

export const signOut = async ()=>{
    const  response = await fetch (`${API_BASE_URL}/api/auth/logout`,{
        credentials:"include",
        method:"POST"
    });

    if(!response.ok){
        throw new Error("Error during sign out");
    }
   
    
    try {
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
            // Parse the response only if it is in JSON format
            const userData = await response.json();
            return userData;
        } else {
            return { message: "Sign-out successful." };
        }
    } catch (error) {
        // Handle parsing errors
        console.error("Error parsing response:", error);
        throw new Error("Unexpected response format during sign-out");
    }
   
};

export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
      method: "POST",
      credentials: "include",
      body: hotelFormData,
    });
    if (!response.ok) {
        throw new Error("Failed to add hotel");
      }
    
      return response.json();
    };

export const fetchMyHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        credentials: "include"
    });

    if(!response.ok){
        throw new Error("Error fetching hotels");
    }

    return response.json();
};