import React, { useState } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, BackHandler, Alert } from 'react-native';
import NavigationBar from './barra';
import Mapita from './mapa';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Home({ navigation, route }) {
  const userData = route.params?.userData;
  const [direccion, setDireccion] = useState('');

  // Prohibir el detrás
  const handleBackPress = () => {
    Alert.alert(
      '¡Hey!',
      'Si regresas se cerrará tu cuenta, podrás volver a iniciar sesión cuando quieras, pero no se mantendrá abierta tu sesión. ¿Aún así quieres volver? 😕',
      [
        {
          text: 'Cancelar',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Volver',
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
    return true;
  };

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      backHandler.remove();
    };
  });

  const handleDireccionChange = (newDireccion) => {
    // Actualizar la dirección cuando cambie en Mapita
    setDireccion(newDireccion);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cont}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Hey! ¿Has visto un bache cerca de tu zona?</Text>
        </View>

        <View style={styles.reportContainer}>
          <Mapita navigation={navigation} onDireccionChange={handleDireccionChange}  userData={userData}/>
        </View>

        <View style={styles.infoContainer}>
          <Image
            source={require('./imgs/CarroInicio.png')}
            style={styles.carImage}
          />

          <Text style={styles.infoText}>
            ¡Asegúrate de estar en un lugar seguro antes de reportar cualquier bache y no lo hagas mientras conduces o siguen circulando los autos!
          </Text>
        </View>
      </View>
      <NavigationBar navigation={navigation} userData={userData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cont: {
    backgroundColor: '#fff',
    width: '100%',
    height: '80%',
    top: '9%',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 0,
    justifyContent: 'center',
  },
  messageContainer: {
    height: height * 0.055,
    width: width * 0.8,
    backgroundColor: '#F1F1F1',
    borderRadius: height * 0.015,
    justifyContent: 'center',
  },
  messageText: {
    fontSize: height * 0.018,
    textAlign: 'center',
    color: '#1E1E1E',
  },
  reportContainer: {
    marginTop: height * 0.025,
    height: height * 0.45,
    width: width * 0.8,
    backgroundColor: '#F1F1F1',
    borderRadius: height * 0.025,
  },
  reportButton: {
    top: -height * 0.02,
    marginLeft: width * 0.35,
    height: height * 0.035,
    width: width * 0.35,
    backgroundColor: '#FF7A3E',
    borderRadius: height * 0.02,
    justifyContent: 'center',
    zIndex: 1,
  },
  buttonText: {
    color: '#FFF',
    fontSize: height * 0.015,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: height * 0.03,
    height: height * 0.14,
    width: width * 0.8,
    backgroundColor: '#F1F1F1',
    borderRadius: height * 0.025,
    flexDirection: 'row',
  },
  carImage: {
    marginTop: height * 0.011,
    marginLeft: width * 0.025,
    height: height * 0.118,
    width: width * 0.3,
    borderRadius: height * 0.02,
  },
  infoText: {
    marginTop: height * 0.03,
    marginLeft: width * 0.035,
    height: height * 0.12,
    width: width * 0.4,
    fontSize: height * 0.0145,
    color: '#1E1E1E',
    textAlign: 'justify',
  },
});
