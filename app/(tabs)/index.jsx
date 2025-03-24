import { Redirect } from "expo-router";
import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, ActivityIndicator } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useSession } from '../../utils/ctx';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Index() {
 
  const { session, isLoading, signOut } = useSession();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

 
  useEffect(() => {
    if (session) {
      registerForPushNotificationsAsync().then(token => {
        if (token) setExpoPushToken(token);
      });

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

      return () => {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
      };
    }
  }, [session]);

  // ✅ 3. CONDICIONALES DESPUÉS DE TODOS LOS HOOKS
  if (!isLoading && !session) {
    return <Redirect href="/sign-in" />;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
      <Text>Tu token de notificaciones:</Text>
      <Text selectable>{expoPushToken}</Text>

      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
        <Text>Título: {notification?.request?.content?.title || ''}</Text>
        <Text>Mensaje: {notification?.request?.content?.body || ''}</Text>
        <Text>Datos: {notification ? JSON.stringify(notification.request.content.data) : ''}</Text>
      </View>

      <Button
        title="Programar notificación"
        onPress={async () => {
          await schedulePushNotification();
        }}
        style={{ marginTop: 20 }}
      />

      <Button
        title="Cerrar sesión"
        onPress={signOut}
        color="red"
        style={{ marginTop: 10 }}
      />
    </View>
  );
}


async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "¡Tienes un mensaje! 📬",
      body: 'Este es el cuerpo de la notificación',
      data: { data: 'goes here', test: { test1: 'more data' } },
      sound: 'default',
    },
    trigger: { seconds: 10 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'Canal de notificaciones',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Permiso denegado para notificaciones push');
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) throw new Error('Project ID no encontrado');

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Debes usar un dispositivo físico para notificaciones push');
  }

  return token;
}