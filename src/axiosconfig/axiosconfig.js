
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

// Check master API request
const isMasterRequest = (url = "") =>
  url.includes("/master/") || url.includes("/master-data/");

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const isFormData = config.data instanceof FormData;

    if (isFormData) {
      delete config.headers["Content-Type"];
    } else if (config.data) {
      config.headers["Content-Type"] = "application/json";
    }

    const masterRequest = isMasterRequest(config.url);

    const token = masterRequest
      ? localStorage.getItem("masterToken")
      : localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("API URL:", config.url);
    console.log("Master Request:", masterRequest);
    console.log("Token Type:", masterRequest ? "Master" : "User");

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        const masterRequest = isMasterRequest(error.config?.url);

        if (masterRequest) {
          localStorage.removeItem("masterToken");
          localStorage.removeItem("masterUser");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    }

    return Promise.reject(
      error.response?.data || error.message || "Something went wrong"
    );
  }
);

export default axiosInstance;
