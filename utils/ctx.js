import { useContext, createContext } from 'react';
import { useStorageState } from './useStorageState';
import axios from 'axios';

const AuthContext = createContext({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});


export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }) {
  const [[isLoading, session], setSession] = useStorageState('session_token');

  return (
    <AuthContext.Provider
      value={{
        signIn: async (username, password) => {
          try {
            console.log("🔐 Intentando iniciar sesión con:", username, password);

            const response = await axios.post(
              'https://f625-189-174-190-67.ngrok-free.app/auth',
              { username, password }
            );

            console.log(" Respuesta del servidor:", response.data);

            const token = response.data?.data?.token;

            if (token) {
              await setSession(token);
              console.log(" Token guardado exitosamente.");
              return true;
            } else {
              console.log(" No se recibió un token válido.");
              return false;
            }

          } catch (error) {
            console.error(" Error durante login:", error.message);
            return false;
          }
        },

        signOut: () => {
          console.log("🚪 Cerrando sesión...");
          setSession(null);
        },

        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
