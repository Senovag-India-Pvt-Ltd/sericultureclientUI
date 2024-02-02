// authService.js
import axios from "axios";
import Swal from "sweetalert2/src/sweetalert2.js";


const API_URL = process.env.REACT_APP_API_BASE_URL_AUTH_LOGIN; // Replace with your server URL

// const login = async (username, password) => {
//   const response = await axios.post(`${API_URL}/auth/login`, { username, password });
//   return response.data.token;
// };

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}auth/login`, {
      username,
      password,
    });
    // let isSuccess = false;
    if (response.data.error === 0) {
      // Success
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("username");
      localStorage.removeItem("userMasterId");
      localStorage.removeItem("roleId");
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("marketId");
      localStorage.removeItem("godownId");

      localStorage.setItem("jwtToken", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userMasterId", response.data.userMasterId);
      localStorage.setItem("roleId", response.data.roleId);
      localStorage.setItem("phoneNumber", response.data.phoneNumber);
      localStorage.setItem("marketId", response.data.marketId);
      localStorage.setItem("godownId", response.data.godownId)
      console.log(response);
      return true;
    } else {
      // Error
      Swal.fire({
        icon: "warning",
        title: response.data.message,
      })
      // alert(response.data.message);
      return false;
    }
  } catch (error) {
    // alert("Invalid Username and Password")
    return false;
  }
};

const logout = () => {
  // Clear the token from local storage or a secure storage mechanism
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("username");
  localStorage.removeItem("userMasterId");
  localStorage.removeItem("roleId");
  localStorage.removeItem("phoneNumber");
  localStorage.removeItem("marketId");
  localStorage.removeItem("godownId");
};

export { login, logout };
