import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../ctx';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const { session, isLoading } = useSession();

 
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      {session ? (
       
        <Stack.Screen 
          name="sign-in" 
          options={{ headerShown: false }} 
        />
      ) : (
        
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
      )}
    </Stack>
  );
}