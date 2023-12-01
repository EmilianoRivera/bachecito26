import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function TerminosYCondiciones({ navigation }) {
  const [isChecked, setChecked] = useState(false);
  const [buttonColor, setButtonColor] = useState('#6F6F6F');
  const [isAlertVisible, setAlertVisible] = useState(false);

  const toggleCheckBox = () => {
    setChecked(!isChecked);
    setButtonColor(isChecked ? '#6F6F6F' : '#FF9F49');
  };

  const showAlert = () => {
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const navigateToNextScreen = () => {
    if (isChecked) {
      navigation.navigate('Registro');
    } else {
      showAlert();
    }
  };

  const [Vale_isPress, ValePressed] = useState(false);
  const ValeScale = new Animated.Value(1);

  const ValePressIn = () => {
    ValePressed(true);
    Animated.spring(ValeScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const ValePressOut = () => {
    setTimeout(() => {
      ValePressed(false);
      Animated.spring(ValeScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }, 50);
  };

  return (
    <View style={styles.Main}>
      <View style={styles.container}>
        <View style={styles.image}>
          <Image source={require('./imgs/TerminosYCondiciones.png')} style={styles.backgroundImage} />
        </View>

        <View style={styles.aviso}>
          <Text style={styles.txtaviso}>
            ANTES DE REGISTRARTE NECESITAS ACEPTAR EL {' '}
            <Text style={{ color: '#FF9F49' }} onPress={() => navigation.navigate('AvisoPrivacidad')}>
              AVISO DE PRIVACIDAD
            </Text>{' '}
          </Text>
        </View>

        <View style={styles.checkAlign}>
          <TouchableOpacity style={styles.checkBox} onPress={toggleCheckBox}>
            <Image
              source={isChecked ? require('./assets/check.png') : require('./assets/uncheck.png')}
              style={styles.checkboxImage}
            />
          </TouchableOpacity>
          <Text style={styles.checkBoxTXT}>
            ACEPTO LOS {' '}
            <Text style={{ color: '#FF9F49' }} onPress={() => navigation.navigate('AvisoPrivacidad')}>
              TÉRMINOS Y CONDICIONES
            </Text>{' '}
            Y AUTORIZO EL USO DE MIS DATOS DE ACUERDO AL{' '}
            <Text style={{ color: '#FF9F49' }} onPress={() => navigation.navigate('AvisoPrivacidad')}>
              AVISO DE PRIVACIDAD
            </Text>
            .
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={navigateToNextScreen}
        >
          <Text style={styles.buttonText}>¡Estoy Listo!</Text>
        </TouchableOpacity>

        <Modal visible={isAlertVisible} animationType="slide" transparent>
          <View style={styles.MainAlert}>
            <View style={styles.alertContainer}>
              <Text style={styles.alertTitle}>😢 ¡Lo Sentimos!</Text>
              <Text style={styles.alertText}>
                No puedes continuar con el proceso de registro sin antes leer y aceptar los términos y condiciones así como el aviso de privacidad.
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={hideAlert}
                onPressIn={ValePressIn}
                onPressOut={ValePressOut}
                style={[
                  styles.btn_Vale,
                  Vale_isPress && styles.btn_Vale_Press,
                  { transform: [{ scale: ValeScale }] },
                ]}
              >
                <Text style={[styles.btnTXT_Iniciar, Vale_isPress && styles.btnTXT_Iniciar_Press]}>
                  Vale
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  container: {
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    position: 'relative',
    alignItems: 'center',
  },

  image: {
    position: 'relative',
    width: '100%',
    height: '40%',
    top: '3%'
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  aviso: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#F1F1F1',
    borderRadius: 15,
    zIndex: 1,
    paddingTop: '10%',
    paddingBottom: '10%',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '5%',
    position: 'relative',
    
  },
  txtaviso: {
    fontFamily: 'AlegreyaExtraBold',
    fontSize: width * 0.065,
    textAlign: 'center',
    marginRight: '5%',
    marginLeft: '5%',
    color: '#6F6F6F',
  },

  checkAlign: {
    backgroundColor: '#fff',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: '5%',
    marginTop: '5%',
    position: 'relative',
    width: '100%'
  },
  checkBox: {
    position: 'absolute',
    alignSelf: 'flex-start',
  },
  checkBoxTXT: {
    alignSelf: 'flex-end',
    marginLeft: '10%',
    marginTop: '3%',
    fontFamily: 'Baloo',
    lineHeight: 18,
    fontSize: width * 0.034,
    color: '#525252',
    textAlign: 'justify',
  },

  checkboxImage: {
    marginTop: '50%',
    width: width * 0.065,
    height: width * 0.065,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#FF9F49',
    borderWidth: 2,
  },
  button: {
    marginTop: '5%',
    paddingTop: '4%',
    borderRadius: 45,
    width: '60%',
    height: '8%',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.05,
    textAlign: 'center',
    fontFamily: 'Hind',
  },

  //Alerta
  MainAlert: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  alertContainer: {
    width: '80%',
    height: 'auto',
    backgroundColor: 'white',
    paddingLeft: '10%',
    paddingRight: '10%',
    paddingBottom: '5%',
    paddingTop: '5%',
    borderRadius: 20,
  },

  alertTitle: {
    color: '#9D9D9D',
    fontFamily: 'Nunito',
    fontSize: width * 0.07,
    marginBottom: '5%',
  },

  alertText: {
    color: '#1E1E1E',
    fontFamily: 'Baloo',
    fontSize: width * 0.04,
    lineHeight: width * 0.05,
    textAlign: 'justify',
  },

  btn_Vale: {
    backgroundColor: '#FF4D35',
    paddingTop: height * 0.0125,
    width: width * 0.4,
    height: height * 0.06,
    borderRadius: 45,
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
  },

  btnTXT_Iniciar: {
    color: '#fff',
    fontSize: width * 0.05,
    fontFamily: 'Hind',
  },

  btn_Vale_Press: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF4D35',
  },

  btnTXT_Iniciar_Press: {
    color: '#FF4D35',
  },
});