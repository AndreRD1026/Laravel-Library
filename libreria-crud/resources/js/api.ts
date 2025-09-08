import axios, { AxiosInstance } from "axios";

// Creamos la instancia de Axios con tipado
const api: AxiosInstance = axios.create({
  baseURL: "/api", // todas las peticiones apuntarán a /api/...
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
