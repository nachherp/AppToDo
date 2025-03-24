import { Stack } from "expo-router";
import { useSession, SessionProvider } from "../utils/ctx";

function RootLayoutInner() {
  const { session } = useSession();

  return (
    <Stack>
      
      {!session ? (
        <Stack.Screen 
          name="sign-in" 
          options={{ headerShown: false }} 
        />
      ) : (
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootLayoutInner />
    </SessionProvider>
  );
}