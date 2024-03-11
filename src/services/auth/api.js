import axios from "axios";
import { jwtDecode } from "jwt-decode";

const baseURLAuth = process.env.REACT_APP_API_BASE_URL_AUTH_LOGIN;

const instance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    // Add any other headers required by your API
  },
});

const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp < Date.now() / 1000;
  } catch (error) {
    return true; // Token is considered expired if there's an error decoding it
  }
};

instance.interceptors.request.use(
  async (config) => {
    // Add your authorization token or other authentication logic here
    // Example using a JWT token stored in localStorage:
    const token = localStorage.getItem("jwtToken");
    if (token) {
      // config.headers.Authorization = `Bearer ${token}`;

      if (isTokenExpired(token)) {
        try {
          // Attempt to refresh the token
          const response = await axios.post(
            baseURLAuth + `auth/refresh-token`,
            {
              token: token,
            }
          );

          // Set the new token from the response
          const newToken = response.data.token;
          console.log(response.data.token);
          localStorage.setItem("jwtToken", newToken);

          // Update the Authorization header with the new token
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Handle refresh error, e.g., redirect to login page or logout the user
        }
      } else {
        // Set the Authorization header with the valid token
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// TODO Refresh Token Code
/*
const instance = axios.create({
    baseURL: '',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Use refresh token to get a new access token
            try {
                const response = await instance.post('/auth/refresh', { refreshToken: 'your_refresh_token' });
                const newAccessToken = response.data.accessToken;

                // Update the original request with the new access token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Retry the original request
                return axios(originalRequest);
            } catch (refreshError) {
                // Handle refresh error, e.g., redirect to login page
                console.error('Token refresh failed:', refreshError);
                // Logout the user or redirect to login page
            }
        }

        return Promise.reject(error);
    }
);
*/

export default instance;
