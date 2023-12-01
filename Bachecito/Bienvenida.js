import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Bienvenida({ navigation }) {
  const [Iniciar_isPress, IniciarPressed] = useState(false);
  const [Registrarse_isPress, RegistrarsePressed] = useState(false);

  const IniciarScale = new Animated.Value(1);
  const RegistrarseScale = new Animated.Value(1);

  const IniciarPressIn = () => {
    IniciarPressed(true);
    Animated.spring(IniciarScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const IniciarPressOut = () => {
    setTimeout(() => {
      IniciarPressed(false);
      Animated.spring(IniciarScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }, 50);
  };

  const RegistrarsePressIn = () => {
    RegistrarsePressed(true);
    Animated.spring(RegistrarseScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const RegistrarsePressOut = () => {
    setTimeout(() => {
      RegistrarsePressed(false);
      Animated.spring(RegistrarseScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }, 50);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imgBienvenida}>
        <Image source={require('./imgs/Bienvenida.png')} style={styles.backgroundImage} />
      </View>

      <View style={styles.whiteBox}>
        <View style={styles.header}>
          <Text style={styles.title}>
            TE DAMOS LA BIENVENIDA A {'\n'}
            <Text style={{color: '#FF9F49',  }}>
            BACHECITO 26
            </Text>
            </Text>

            <Text style={styles.text}>
            Aquí podrás enviar tus reportes sobre los baches que encuentres durante tu trayecto o estancia en la alcaldía Azcapotzalco, fomentando así su reparación por parte de las autoridades y a su vez obtener una experiencia más agradable para ti y las demás personas al transitar por estas calles. 😎 🐜
            </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('Inicio')}
            onPressIn={IniciarPressIn}
            onPressOut={IniciarPressOut}
            style={[
              styles.btn_Iniciar,
              Iniciar_isPress && styles.btn_Iniciar_Press,
              { transform: [{ scale: IniciarScale }] },
            ]}
          >
            <Text style={[styles.btnTXT_Iniciar, Iniciar_isPress && styles.btnTXT_Iniciar_Press]}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('TerminosYCondiciones')}
            onPressIn={RegistrarsePressIn}
            onPressOut={RegistrarsePressOut}
            style={[
              styles.btn_Registrarse,
              Registrarse_isPress && styles.btn_Registrarse_Press,
              { transform: [{ scale: RegistrarseScale }] },
            ]}
          >
            <Text style={[styles.btnTXT_Registrarse, Registrarse_isPress && styles.btnTXT_Registrarse_Press]}>
              Registrarme
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  imgBienvenida: {
    width: '100%',
    height: height * 0.55,
  },
  backgroundImage: {
    width: '100%',
    height: '75%',
  },
  whiteBox: {
    width: '100%',
    height: height * 0.65,
    top: '35%',
    position: 'absolute',
    backgroundColor: '#fff',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    zIndex: 1,
    paddingTop: height * 0.07,
    paddingLeft: width * 0.1,
    paddingRight: width * 0.1,
  },
  header: {
    alignItems: 'left',
  },
  title: {
    //fontSize: 38, 
    fontFamily: 'Alegreya', 
    color: '#6F6F6F', 
    marginBottom: '7%',
    fontSize: width * .09
  },
  text: {
    //fontSize: 16.5, 
    fontFamily: 'Baloo', 
    color: '#1E1E1E', 
    textAlign: 'justify',
    lineHeight: 18.5,  
    fontSize: width * 0.04
  },
  buttonsContainer: {
    marginTop: height * 0.05,
    alignItems: 'center',
  },
  btn_Iniciar: {
    backgroundColor: '#fff',
    paddingBottom: height * 0.020,
    width: width * 0.38,
    paddingTop: height * 0.020,
    borderRadius: height * 0.06,
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'flex-end',
    borderColor: '#6F6F6F',
    borderWidth: 2,
  },
  btnTXT_Iniciar: {
    color: '#FF9F49',
    fontSize: height * 0.025,
    fontFamily: 'Hind',
  },
  btn_Iniciar_Press: {
    backgroundColor: '#6F6F6F',
  },
  btnTXT_Iniciar_Press: {
    color: 'white',
  },
  btn_Registrarse: {
    backgroundColor: '#FF9F49',
    paddingBottom: height * 0.020,
    width: width * 0.37,
    paddingTop: height * 0.020,
    borderRadius: height * 0.06,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  btnTXT_Registrarse: {
    color: 'white',
    fontSize: height * 0.025,
    fontFamily: 'Hind',
  },
  btn_Registrarse_Press: {
    backgroundColor: '#FF7A3E',
  },
  btnTXT_Registrarse_Press: {
    color: 'white',
  },
});