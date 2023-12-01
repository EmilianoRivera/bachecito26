import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';

// Importar pantallas
import Bienvenida from './Bienvenida';
import Inicio from './Inicio';
import TerminosYCondiciones from './TerminosYCondiciones';
import AvisoPrivacidad from './AvisoPrivacidad';
import Registro from './Registroo';
import bache from './bache';
import reporte from './reporte';
import perfil from './perfil';
import Historial from './historial';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Alegreya: require('./assets/fonts/AlegreyaSansSC-Black.ttf'),
    AlegreyaBold:   require('./assets/fonts/AlegreyaSansSC-Bold.ttf'),
    AlegreyaExtraBold: require('./assets/fonts/AlegreyaSansSC-ExtraBold.ttf'),
    Baloo: require('./assets/fonts/BalooThambi2-Regular.ttf'),
    BalooSemiBold: require('./assets/fonts/BalooThambi2-SemiBold.ttf'),
    Nunito: require('./assets/fonts/Nunito-Black.ttf'),
    NunitoSemiBoldItalic: require('./assets/fonts/Nunito-SemiBoldItalic.ttf'),
    Catamaran: require('./assets/fonts/Catamaran-SemiBold.ttf'),
    Hind: require('./assets/fonts/Hind-Bold.ttf'),
    CatamaranRegular: require('./assets/fonts/Catamaran-Regular.ttf'),
  });
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bienvenida">
        <Stack.Screen name="Bienvenida" component={Bienvenida} options={{ headerShown: false }} />
        <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }} />
        <Stack.Screen name="TerminosYCondiciones" component={TerminosYCondiciones} options={{ headerShown: false }} />
        <Stack.Screen name="AvisoPrivacidad" component={AvisoPrivacidad} options={{ headerShown: false }} />
        <Stack.Screen name="Registro" component={Registro} options={{ headerShown: false }} />
        <Stack.Screen name="bache" component={bache} options={{ headerShown: false }}/>
        <Stack.Screen name="reporte" component={reporte} options={{ headerShown: false }}/>
        <Stack.Screen name="perfil" component={perfil} options={{ headerShown: false }}/>
        <Stack.Screen name="historial" component={Historial} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}