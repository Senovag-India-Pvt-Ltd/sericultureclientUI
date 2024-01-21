import axios from 'axios';

const instance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
    // Add any other headers required by your API
  },
});

instance.interceptors.request.use(
  (config) => {
    // Add your authorization token or other authentication logic here
    // Example using a JWT token stored in localStorage:
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
