import { useEffect } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const Profile = () => {
  const { showToast } = useAppContext();

  // Fetch user data using the validateToken function
  const { data: userData, isLoading, isError } = useQuery("validateToken", apiClient.validateToken);

  useEffect(() => {
    // Show a toast message if there's an error fetching user data
    if (isError) {
      showToast({ message: "Error fetching user data", type: "ERROR" });
    }
  }, [isError, showToast]);
  console.log(userData);

  return (
    <div>
      <h2 className="text-3xl font-bold">My Profile</h2>
      {isLoading && <p>Loading...</p>}
      {userData && (
        <div>
          <p className="font-bold text-lg">First Name: {userData.user.firstName}</p>
          <p className="font-bold text-lg">Last Name: {userData.user.lastName}</p>
          <p className="font-bold text-lg">Email: {userData.user.email}</p>
          <p className="font-bold text-lg">Phone Number: {userData.user.phone}</p>

         
        </div>
      )}
    </div>
  );
};

export default Profile;
