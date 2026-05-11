import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      
      if (status === 403) {
        console.error("접근 권한이 없습니다.");
      } else if (status === 404) {
        console.error("리소스를 찾을 수 없습니다.");
      } else if (status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
    }
    
    return Promise.reject(error);
  }
);