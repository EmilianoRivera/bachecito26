import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, TextInput, Modal, TouchableOpacity, ScrollView, BackHandler, TouchableWithoutFeedback, Keyboard, Animated, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, addDoc} from 'firebase/firestore';
import { db, Auth } from './firebase';

const { width, height } = Dimensions.get('window');

export default function Registro() {
  const navigation = useNavigation();
  const [NamePressed, NamePress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const NameFocus = () => {
    NamePress(true);
  };

  const NameBlur = () => {
    NamePress(false);
  };

  const handleNameChange = (text) => {
    if (text.length <= 50) {
      if (/^[A-Za-z ]*$/.test(text)) {
        setNombre(text);
      }
    } else {
      Alert.alert('¡Increíble!', `Tu(s) nombre(s) no pueden tener tantos caracteres 🤨`);
    }
  };

  const [AppatPressed, AppatPress] = useState(false);

  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const AppatFocus = () => {
    AppatPress(true);
  };

  const AppatBlur = () => {
    AppatPress(false);
  };

  const handleAppatChange = (text) => {
    if (text.length <= 20) {
      if (/^[A-Za-z]*$/.test(text)) {
        setApellidoPaterno(text);
      }
    } else {
      Alert.alert('¡Increíble!', `Tu apellido no puede tener tantos caracteres 🤨`);
    }
  };

  const [ApmatPressed, ApmatPress] = useState(false);

  const ApmatFocus = () => {
    ApmatPress(true);
  };

  const ApmatBlur = () => {
    ApmatPress(false);
  };

  const handleApmatChange = (text) => {
    if (text.length <= 20) {
      if (/^[A-Za-z]*$/.test(text)) {
        setApellidoMaterno(text);
      }
    } else {
      Alert.alert('¡Increíble!', `Tu apellido no puede tener tantos caracteres 🤨`);
    }
  };

  const [BirthPressed, BirthPress] = useState(false);
  const [Birth, setBirth] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const BirthFocus = () => {
    BirthPress(true);
  };

  const BirthBlur = () => {
    BirthPress(false);
  };

  const [FechaNacimiento, setFechaNacimiento] = useState('');

  const handleFechaNacimientoChange = (date) => {
    const currentDate = new Date();
    const minDate = new Date(1963, 0, 1);
    const maxDate = new Date(2005, 11, 31);
  
    // Verifica si la fecha de nacimiento está dentro del rango permitido
    if (date >= minDate ) {
      if (date <= maxDate){
        setBirth(date); 
        setFechaNacimiento(date.toDateString()); 
      }
      else{
      Alert.alert('Uy...', 'No puedes registrarte siendo menor de edad 🐒');
        
      }
    } else {
      // Muestra una alerta si la fecha de nacimiento no está dentro del rango permitido
      Alert.alert('¡WOW!', 'Esa es una edad muy alta 🦕');
    }
  
    setDatePickerVisible(false); // Oculta el selector de fecha
  };

  const [CorreoPressed, CorreoPress] = useState(false);

  const CorreoFocus = () => {
    CorreoPress(true);
  };

  const CorreoBlur = () => {
    CorreoPress(false);
  };

  const handleCorreoChange = (text) => {
    if (text.length <= 100) {
      if (/^[A-Za-z0-9_@.-]*$/.test(text)){
        setEmail(text);
      }
    } else {
      Alert.alert('¡Rayos!', `Tu correo no puede tener más de 100 caracteres, pero puedes registrarte con uno más corto 😥`);
    }
  };

  const [ContraseñaPressed, ContraseñaPress] = useState(false);

  const ContraseñaFocus = () => {
    ContraseñaPress(true);
  };

  const ContraseñaBlur = () => {
    ContraseñaPress(false);
  };

  const handleContraseñaChange = (text) => {
    if (text.length <= 20) {
      if (/^[A-Za-z0-9-_]*$/.test(text)){
        setPassword(text);
      }
    } else {
      Alert.alert('¡Wow!', `Tu contraseña no puede tener más de 20 caracteres 🔐`);
    }
  };

  const [Iniciar_isPress, IniciarPressed] = useState(false);
  const IniciarScale = new Animated.Value(1);

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

  const isButtonDisabled = !nombre || !apellidoPaterno || !apellidoMaterno || !FechaNacimiento || !email || !password;
  const isTitleColorChanged = NamePressed || AppatPressed || ApmatPressed || BirthPressed || CorreoPressed || ContraseñaPressed;

  const handleCreateAccount = () => {
    // Crear la cuenta de usuario con email y contraseña
    createUserWithEmailAndPassword(Auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
  
        // Enviar correo de verificación
        sendEmailVerification(user)
          .then(() => {
            // Email de verificación enviado
            console.log('Email de verificación enviado');
  
            const usuariosCollection = collection(db, 'usuarios');
  
            const nuevoUsuario = {
              uid: uid,
              nombre: nombre,
              apellidoPaterno: apellidoPaterno,
              apellidoMaterno: apellidoMaterno,
              fechaNacimiento: FechaNacimiento,
              correo: email,
            };
  
            // Guardar los datos del nuevo usuario en la base de datos
            addDoc(usuariosCollection, nuevoUsuario)
              .then(() => {
                console.log('Datos del nuevo usuario guardados en la base de datos');
                Alert.alert('Registro exitoso','Se ha enviado un correo de verificación');
                navigation.navigate('Inicio');
              })
              .catch((error) => {
                console.error('Error al guardar los datos del nuevo usuario: ', error);
                Alert.alert('Error','Hubo un error');
              });
          })
          .catch((error) => {
            console.error('Error al enviar el correo de verificación: ', error);
            Alert.alert('Error','Hubo un error al enviar el correo de verificación');
          });
      })
      .catch((error) => {
        console.error('Error al crear la cuenta: ', error);
        alert(error.message);
      });
  };
  


  // Define el estado para el margen inferior
  const [bottomMargin, setBottomMargin] = useState(0);

  useEffect(() => {
    // Agrega oyentes de teclado para ajustar manualmente el margen inferior
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setBottomMargin(100); // Ajusta este valor según tus necesidades
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setBottomMargin(0);
    });

    // Limpia los oyentes cuando el componente se desmonta
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const [isAlertVisible, setAlertVisible] = useState(false);
  const showAlert = () => {
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
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

  //Prohibir el detrás
  const handleBackPress = () => {
    Alert.alert(
      '¡Hey!',
      'Si regresas se perderá tu registro, ¿Estás seguro de continuar? 😢',
      [
        {
          text: 'Cancelar',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Salir',
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

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.Main, { marginBottom: bottomMargin }]}>
          <View style={styles.container}>
            <View style={styles.image}>
              <Image source={require('./imgs/Registro.png')} style={styles.backgroundImage} />
            </View>

            <View style={styles.form}>
              <View style={styles.components}>
                <Text style={[
                    styles.title,
                    isTitleColorChanged && {
                      color: isButtonDisabled ? '#6F6F6F' : '#FF0000', // Cambia el color del título
                    },
                  ]}>¡QUE FELICIDAD QUE TE NOS UNAS! </Text>

                <TextInput
                  onFocus={NameFocus}
                  onBlur={NameBlur}
                  value={nombre}
                  onChangeText={handleNameChange}
                  style={[
                    styles.input_txt,
                    NamePressed && { borderColor: '#FF9F49', color: '#1E1E1E', height: 'auto' },
                  ]}
                  placeholder="Nombre(s)"
                />

                <View style={styles.apsCont}>
                  <TextInput
                    onFocus={AppatFocus}
                    onBlur={AppatBlur}
                    value={apellidoPaterno}
                    onChangeText={handleAppatChange}
                    style={[
                      styles.input_txt2,
                      AppatPressed && { borderColor: '#FF9F49', color: '#1E1E1E' },
                    ]}
                    placeholder="Apellido Paterno"
                  />

                  <TextInput
                    onFocus={ApmatFocus}
                    onBlur={ApmatBlur}
                    value={apellidoMaterno}
                    onChangeText={handleApmatChange}
                    style={[
                      styles.input_txt3,
                      ApmatPressed && { borderColor: '#FF9F49', color: '#1E1E1E' },
                    ]}
                    placeholder="Apellido Materno"
                  />
                </View>

                <TextInput
                  onPressIn={() => {
                    setDatePickerVisible(true);
                  }}
                  onFocus={BirthFocus}
                  onBlur={BirthBlur}
                  value={FechaNacimiento}
                  // No se necesita onChangeText para este campo
                  style={[
                    styles.input_txt,
                    BirthPressed && { borderColor: '#FF9F49', color: '#1E1E1E', height: 'auto' },
                  ]}
                  placeholder="Fecha de nacimiento"
                />

                {isDatePickerVisible && (
                  <DateTimePicker
                  onFocus={BirthFocus}
                  onBlur={BirthBlur}
                    value={Birth || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      if (selectedDate !== undefined) {
                        handleFechaNacimientoChange(selectedDate); // Llama a la función para manejar el cambio de fecha
                        setDatePickerVisible(false);
                      } else {
                        setDatePickerVisible(true);
                      }
                    }}
                  />
                )}


                <TextInput
                  onFocus={CorreoFocus}
                  onBlur={CorreoBlur}
                  value={email}
                  onChangeText={handleCorreoChange}
                  style={[
                    styles.input_txt,
                    CorreoPressed && { borderColor: '#FF9F49', color: '#1E1E1E', height: 'auto' },
                  ]}
                  placeholder="Correo electrónico"
                />

                <TextInput
               secureTextEntry={!showPassword}
                  onFocus={ContraseñaFocus}
                  onBlur={ContraseñaBlur}
                  value={password}
                  onChangeText={handleContraseñaChange}
                  style={[
                    styles.input_txt,
                    ContraseñaPressed && { borderColor: '#FF9F49', color: '#1E1E1E', height: 'auto' },
                  ]}
                  placeholder="Contraseña"
                />
                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)}  style={{ position: 'absolute', right: 45, top: height * 0.43}}>
    <Image
      source={showPassword ? require('./imgs/ojo.png') : require('./imgs/ojos-cruzados.png')}
      style={{ width: 24, height: 24}}
    />
  </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={1}
                onPressIn={IniciarPressIn}
                onPressOut={IniciarPressOut}
                onPress={() => {
                  // Solo permite iniciar sesión si los campos no están vacíos
                  if (!isButtonDisabled) {
                    handleCreateAccount();
                  } else {
                    showAlert();
                  }
                }}
                style={[
                  styles.btn_Iniciar,
                  Iniciar_isPress && styles.btn_Iniciar_Press,
                  isButtonDisabled && styles.btn_Iniciar_Disabled,
                  { transform: [{ scale: IniciarScale }], marginTop: height * 0.06 },
                ]}
              >
                <Text style={[styles.btnTXT_Iniciar, Iniciar_isPress && styles.btnTXT_Iniciar_Press, isButtonDisabled && styles.btnTXT_Iniciar_Disabled,]}>
                  Registrarse
                </Text>
              </TouchableOpacity>

              <View style={styles.txtContainer}>
                <Text style={{ color: '#525252', fontFamily: 'Catamaran', fontSize: 16 }}>¿Ya tienes una cuenta? 
                  <Text style={{ color: '#FF7A3E' }} onPress={() => navigation.navigate('Inicio')}> ¡Ingresa con ella!</Text>
                </Text>
              </View>
            </View>

            <Modal visible={isAlertVisible} animationType="slide" transparent>
              <View style={styles.MainAlert}>
                <View style={styles.alertContainer}>
                  <Text style={styles.alertTitle}>🚘 ¡Con calma!</Text>
                  <Text style={styles.alertText}>
                  Aún hay algunos campos que te faltan por llenar para poder completar tu registro y crear tu cuenta. ¡Verifícalos e intenta de nuevo!
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
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },

  Main: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    height: height * 0.85,
    backgroundColor: '#fff',
    top: '8%',
    borderRadius: 15,
    zIndex: 0,
  },
  image: {
    zIndex: 1,
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: height * 0.25,
  },
  backgroundImage: {
    zIndex: 1,
    width: width * .5,
    height: '100%',
  },
  form: {
    width: '100%',
    height: height * 0.70,
    backgroundColor: '#F1F1F1', //#F1F1F1
    top: '15%',
    borderRadius: 15,
    zIndex: 0,
    position: 'absolute',
  },
  components: {
    width: '100%',
    height: 'auto',
    top: '20%',
    backgroundColor: '#F1F1F1', //#F1F1F1
    alignItems: 'center',
    borderRadius: 15,
    position: 'absolute',
  },
  title: {
    color: '#6F6F6F',
    fontFamily: 'Nunito',
    fontSize: width * 0.06,
    textAlign: 'center',
    width: '85%',
    marginBottom: height * 0.025,
  },
  input_txt: {
    width: '80%',
    height: height * 0.06,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F1F1F1',
    fontFamily: 'CatamaranRegular',
    padding: '3%',
    color: '#606060',
    backgroundColor: '#fff',
    marginBottom: height * 0.015,
  },
  input_txt2: {
    width: '47%',
    height: height * 0.06,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F1F1F1',
    fontFamily: 'CatamaranRegular',
    paddingLeft: '3%',
    textAlign: 'left',
    color: '#606060',
    backgroundColor: '#fff',
    position: 'absolute',
    alignSelf: 'flex-start',
  },
  input_txt3: {
    width: '47%',
    height: height * 0.06,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F1F1F1',
    fontFamily: 'CatamaranRegular',
    color: '#606060',
    backgroundColor: '#fff',
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  apsCont: {
    position: 'relative',
    alignItems: 'baseline',
    width: '80%',
    height: height * 0.06,
    marginBottom: height * 0.015,
  },
  txtContainer: {
    top: height * 0.705,
    zIndex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    position: 'absolute',
    alignItems: 'center'
  },
  txt: {
    position: 'absolute',
    fontFamily: 'Catamaran',
    color: '#525252',
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  txt2: {
    position: 'absolute',
    fontFamily: 'Catamaran',
    color: '#FF7A3E',
    alignSelf: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#FF7A3E',
    fontSize: 16,
  },
  btn_Iniciar: {
    backgroundColor: '#FF4D35',
    paddingTop: 5,
    width: '80%',
    height: height * 0.05,
    borderRadius: 10,
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: -height * 0.035,
    zIndex: 1,
    marginBottom: height * 0.06,
  },
  btn_Iniciar_Disabled: {
    backgroundColor: '#6F6F6F', // Cambia el color cuando el botón está desactivado
  },
  btnTXT_Iniciar: {
    color: '#fff',
    fontSize: height * 0.020,
    paddingTop: height * 0.005,
    fontFamily: 'Hind',
  },
  btnTXT_Iniciar_Disabled: {
    color: '#fff', // Cambia el color del texto cuando el botón está desactivado
  },
  btn_Iniciar_Press: {
    backgroundColor: '#fff',
    borderColor: '#FF4D35',
    borderWidth: 2
  },
  btnTXT_Iniciar_Press: {
    color: '#FF4D35',
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
    fontSize: width * 0.035,
    lineHeight: width * 0.05,
    textAlign: 'justify',
    marginBottom: '7%'
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