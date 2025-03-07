import React from 'react';
import { Platform, Text, View } from 'react-native';

export default function App() {
  console.log('Platform.OS:', Platform.OS); 

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>¡Hola, mundo!</Text>
    </View>
  );
}
