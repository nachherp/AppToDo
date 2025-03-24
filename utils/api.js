import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Función para obtener el token de Secure Store
const getToken = async () => {
  try {
    return await SecureStore.getItemAsync("session_token");
  } catch (error) {
    console.error("Error obteniendo el token:", error);
    return null;
  }
};


const api = axios.create({
  baseURL: " https://f625-189-174-190-67.ngrok-free.app.app",
  timeout: 10000, // Timeout de 10 segundos
});


api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      console.log("Token:", `Bearer ${token}`);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    if (error.response) {
      const { status } = error.response;

      
      if (status === 401) {
        console.log("Token expirado, redirigiendo a login...");
        await SecureStore.deleteItemAsync("token");
       
      }

      // Manejo de otros errores
      if (status === 500) {
        console.error("Error interno del servidor");
      }
    }

    return Promise.reject(error);
  }
);

export default api;