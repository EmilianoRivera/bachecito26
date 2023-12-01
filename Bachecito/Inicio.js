import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Modal, Animated, Image, Alert, TextInput, BackHandler, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { useFocusEffect,useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
import { updateDoc,collection, query, where, getDocs } from '@firebase/firestore';
import { Auth, db } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');

export default function Login() {
  const navigation = useNavigation();
 
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [CorreoPressed, CorreoPress] = useState(false);
  const [ContraseñaPressed, ContraseñaPress] = useState(false);
  const [isContraseñaInputPressed, setContraseñaInputPressed] = useState(false); 

  const [Correo, setCorreo] = useState('');
  const [Contraseña, setContraseña] = useState('');
  
  
  
  const CorreoFocus = () => {
    CorreoPress(true);
  };

  const CorreoBlur = () => {
    CorreoPress(false);
  };

  const ContraseñaFocus = () => {
    ContraseñaPress(true);
    setContraseñaInputPressed(true);
  };

  const ContraseñaBlur = () => {
    ContraseñaPress(false);
    setContraseñaInputPressed(false);
  };

  const handleCorreoChange = (text) => {
    if (text.length <= 100) {
      if (/^[A-Za-z0-9_@.-]*$/.test(text)){
        setCorreo(text);
      }
    } else {
      Alert.alert('¡Rayos!', `Tu correo no puede tener más de 100 caracteres 😥`);
    }
  };

  const handleContraseñaChange = (text) => {
    if (text.length <= 20) {
      if (/^[A-Za-z0-9-_]*$/.test(text)){
        setContraseña(text);
      }
    } else {
      Alert.alert('¡Wow!', `Tu contraseña no puede tener más de 20 caracteres 🔐`);
    }
  };
  let credentialsSaved = false;
  const [userDetails, setUserDetails] = useState(null);
  const saveLoginInfo = async (email, password) => {
    try {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
        console.log('Información de inicio de sesión guardada correctamente');
        credentialsSaved = true;
      
    } catch (error) {
      console.error('Error al guardar la información de inicio de sesión:', error);
    }
  };
  
  
  const checkLogin = async () => {
    try {
      if (!credentialsSaved) {
        const email = await AsyncStorage.getItem('email');
        const password = await AsyncStorage.getItem('password');
        if (email !== null && password !== null) {
          signInWithEmailAndPassword(Auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              const uid = user.uid;
              const userDocRef = collection(db, 'usuarios');
              const userQuery = query(userDocRef, where('uid', '==', uid));
              getDocs(userQuery)
                .then((querySnapshot) => {
                  querySnapshot.forEach((docSnap) => {
                    const userData = docSnap.data();
                    console.log('Datos del usuario:', userData);
                    if (userData.disabled) {
                      console.log('Esta cuenta ha sido inhabilitada.');
                      Alert.alert(
                        'Cuenta Borrada',
                        'Esta cuenta ha sido Borrada, ¿Deseas restablecerla?',
                        [
                          {
                            text: 'No',
                            onPress: () => {
                              console.log('Usuario optó por no restablecer la cuenta');
                            },
                            style: 'cancel',
                          },
                          {
                            text: 'Sí',
                            onPress: async () => {
                              const reportesRef = collection(db, 'usuarios');
                              const q = query(reportesRef, where('uid', '==', userData.uid));
                              const querySnapshot = await getDocs(q);
                              
                              querySnapshot.forEach(async (doc) => {
                                const docId = doc.id;
                                console.log('Documento encontrado:', doc.data()); 
                                await updateDoc(doc.ref, {
                                  disabled: false,
                                })
                                .then(() => {
                                  console.log('Campo disabled actualizado correctamente');
                                })
                                .catch((error) => {
                                  console.error('Error al actualizar el campo disabled:', error);
                                });
                              });
                              setUserDetails(userData);
                              navigation.navigate('bache', { userData });
                            },                      
                          },
                        ]
                      );
                    } else {
                      setUserDetails(userData);
                      navigation.navigate('bache', { userData: userData });
                    }
                  });
                })
                .catch((error) => {
                  console.error('Error al obtener datos del usuario:', error);
                  alert('Hubo un error al obtener datos del usuario');
                });
            })
            .catch((error) => {
              console.log(error);
              alert(error.message);
            });
          credentialsSaved = true;
        }
      }
    } catch (error) {
      console.error('Error al obtener información de inicio de sesión:', error);
    }
  };
  
  useEffect(() => {
    // Verifica si existen credenciales guardadas al cargar el componente
    checkLogin();
  }, []);
  

  const handleSignIn = () => {
    signInWithEmailAndPassword(Auth, Correo, Contraseña)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        const userDocRef = collection(db, 'usuarios');
        const userQuery = query(userDocRef, where('uid', '==', uid));
        getDocs(userQuery)
          .then((querySnapshot) => {
            querySnapshot.forEach((docSnap) => {
              const userData = docSnap.data();
              console.log('Datos del usuario:', userData);
              if (userData.disabled) {
                console.log('Esta cuenta ha sido inhabilitada.');
                Alert.alert(
                  'Cuenta Borrada',
                  'Esta cuenta ha sido Borrada, ¿Deseas restablecerla?',
                  [
                    {
                      text: 'No',
                      onPress: () => {
                        console.log('Usuario optó por no restablecer la cuenta');
                      },
                      style: 'cancel',
                    },
                    {
                      text: 'Sí',
                      onPress: async () => {
                        const reportesRef = collection(db, 'usuarios');
                        const q = query(reportesRef, where('uid', '==', userData.uid));
                        const querySnapshot = await getDocs(q);
  
                        querySnapshot.forEach(async (doc) => {
                          const docId = doc.id;
                          console.log('Documento encontrado:', doc.data());
                          await updateDoc(doc.ref, {
                            disabled: false,
                          })
                            .then(() => {
                              console.log('Campo disabled actualizado correctamente');
                            })
                            .catch((error) => {
                              console.error('Error al actualizar el campo disabled:', error);
                            });
                        });
                     
                        checkLogin();
                        saveLoginInfo(Correo, Contraseña);
                        navigation.navigate('bache', {userData});
                        // Mostrar el modal solo si el usuario no está deshabilitado
                
                        
                      },
                    },
                  ]
                );
              } else {
                checkLogin();
                saveLoginInfo(Correo, Contraseña);
                navigation.navigate('bache', {userData});
                
              }
            });
          })
          .catch((error) => {
            console.error('Error al obtener datos del usuario:', error);
            alert('Hubo un error al obtener datos del usuario');
          });
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };
  
  const [loading, setLoading] = useState(false);

  const getUserData = async () => {
    setLoading(true);
    const reportesRef = collection(db, 'usuarios');
    const q = query(reportesRef, where('uid', '==', userData.uid));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const docId = doc.id;
        console.log('Documento encontrado:', doc.data());
        await updateDoc(doc.ref, {
          disabled: false,
        })
          .then(() => {
            console.log('Campo disabled actualizado correctamente');
          })
          .catch((error) => {
            console.error('Error al actualizar el campo disabled:', error);
          });
      });
      setLoading(false);
      // Aquí podrías hacer algo con los datos obtenidos si es necesario
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      setLoading(false);
    }
  };

  
  const handleForgotPassword = () => {
    if (Correo) {
      setModalVisible(true); // Mostrar el modal al solicitar recuperar contraseña
    } else {
      Alert.alert('Correo requerido', 'Por favor, ingresa tu dirección de correo electrónico para restablecer tu contraseña.');
    }
  };

  const handleForgot = () => {
    sendPasswordResetEmail(Auth, Correo)
      .then(() => {
        Alert.alert('Correo enviado', 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.');
      })
      .catch((error) => {
        console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
        Alert.alert('Error', 'Hubo un problema al enviar el correo de restablecimiento de contraseña. Por favor, intenta de nuevo.');
      });
  
    setModalVisible(false); // Ocultar el modal después de enviar el correo
  };
  
  // Función que maneja la acción cuando se elige cancelar la recuperación de contraseña
  const handleCancel = () => {
    setModalVisible(false); // Ocultar el modal al cancelar
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
    IniciarPressed(false);
    Animated.spring(IniciarScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

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
      'Si regresas se borrarán tus datos del formulario de ingreso, ¿Estás seguro de continuar? 😢',
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

  const isButtonDisabled = !Correo || !Contraseña;
  const isTitleColorChanged = CorreoPress || ContraseñaPress;
  const isContraseñaTextColorChanged = isContraseñaInputPressed;

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.Main}>
          <View style={styles.container}>
            <View style={styles.image}>
              <Image source={require('./imgs/Login.png')} style={styles.backgroundImage} />
            </View>

            <View style={styles.form}>
              <View style={styles.components}>
                <Text style={[
                    styles.title,
                    isTitleColorChanged && {
                      color: isButtonDisabled ? '#6F6F6F' : '#FF0000', // Cambia el color del título
                    },
                  ]}>¡QUE BUENO ES TENERTE DE VUELTA!</Text>
                <TextInput
                  key="Correo"
                  onFocus={CorreoFocus}
                  onBlur={CorreoBlur}
                  value={Correo}
                  onChangeText={handleCorreoChange}
                  style={[
                    styles.input_txt,
                    CorreoPressed && { borderColor: '#FF9F49', color: '#1E1E1E', height: 'auto' },
                    { marginBottom: height * 0.03 },
                  ]}
                  placeholder="Correo electrónico"
                />

<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <TextInput
    secureTextEntry={!showPassword}
    key="Contraseña"
    onFocus={ContraseñaFocus}
    onBlur={ContraseñaBlur}
    value={Contraseña}
    onChangeText={handleContraseñaChange}
    style={[
      styles.input_txt,
      ContraseñaPressed && { borderColor: '#FF9F49', color: '#1E1E1E', height: 'auto' },
    ]}
    placeholder="Contraseña"
  />

  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}  style={{ position: 'absolute', right: 10}}>
    <Image
      source={showPassword ? require('./imgs/ojo.png') : require('./imgs/ojos-cruzados.png')}
      style={{ width: 24, height: 24}}
    />
  </TouchableOpacity>
</View>


                <View style={styles.txtContainer2}>
                  <Text style={[
                    styles.txt3,
                    isContraseñaTextColorChanged && {
                      color: '#FF0000', // Cambia el color del texto si el input de contraseña está presionado
                    },
                  ]} onPress={() => handleForgotPassword()}
                  > ¿Olvidaste tu contraseña?</Text>
                </View>

                <Modal visible={isModalVisible} animationType="slide" transparent>
  <View style={styles.MainAlert}>
    <View style={styles.alertContainer}>
      <Text style={styles.alertTitle2}>😰¡No pasa nada!</Text>
      <Text style={styles.alertText}>
        Te enviaremos un correo de recuperación a la direccion de correo con el que te registraste. ¡Por favor abre el link y sigue los pasos!
        </Text>

        <View style={styles.buttonContainer}>
    <TouchableOpacity
      onPress={handleForgot}
      style={[
        styles.btn_Vale2,
        { transform: [{ scale: ValeScale }] },
      ]}
    >
      <Text style={styles.btnTXT_Iniciar2}>
        Enviar
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={handleCancel}
      style={[
        styles.btn_Vale3,
        { transform: [{ scale: ValeScale }] },
      ]}
    >
      <Text style={styles.btnTXT_Iniciar3}>
        Cancelar
      </Text>
    </TouchableOpacity>
  </View>
</View>
  </View>
</Modal>
                <TouchableOpacity
                  activeOpacity={1}
                  onPressIn={IniciarPressIn}
                  onPressOut={IniciarPressOut}
                  onPress={() => {
                    // Solo permite iniciar sesión si los campos no están vacíos
                    if (!isButtonDisabled) {
                      // Lógica para iniciar sesión aquí
                      handleSignIn();
                    } else {
                      showAlert();
                    }
                  }}
                  style={[
                    styles.btn_Iniciar,
                    Iniciar_isPress && styles.btn_Iniciar_Press,
                    isButtonDisabled && styles.btn_Iniciar_Disabled,
                    { transform: [{ scale: IniciarScale }], marginTop: height * 0.045 },
                  ]}
                >
                  <Text style={[
                    styles.btnTXT_Iniciar,
                    Iniciar_isPress && styles.btnTXT_Iniciar_Press,
                    isButtonDisabled && styles.btnTXT_Iniciar_Disabled,
                  ]}>
                    Iniciar Sesión
                  </Text>
                </TouchableOpacity>
                
              </View>
            </View>



            <View style={styles.txtContainer}>
              <Text style={{ color: '#525252', fontFamily: 'Catamaran', fontSize: 16 }}>¿Aún no tienes una cuenta?
                <Text style={{ color: '#FF7A3E' }} onPress={() => navigation.navigate('TerminosYCondiciones')}> ¡Crea una!</Text>
              </Text>
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
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row', // Para que los botones estén en la misma fila
    justifyContent: 'space-between', // Para espaciar los botones igualmente
    marginTop: 20, // Ajusta el espaciado superior según sea necesario
  },

  Main: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    height: height * 0.75,
    backgroundColor: '#fff',
    top: '12.5%',
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
    position: 'absolute',
    zIndex: 1,
    width: width * .5,
    height: '100%',
  },
  form: {
    width: '100%',
    height: height * 0.58,
    backgroundColor: '#F1F1F1',
    top: '20%',
    borderRadius: 15,
    zIndex: 0,
    position: 'absolute',
  },
  components: {
    width: '100%',
    height: 'auto',
    top: '23%',
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    position: 'absolute',
  },
  title: {
    color: '#6F6F6F',
    fontFamily: 'Nunito',
    fontSize: width * 0.06,
    textAlign: 'center',
    width: '85%',
    marginBottom: height * 0.05,
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
  },
  input_txt1: {
    width: '72%',
    height: height * 0.06,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F1F1F1',
    fontFamily: 'CatamaranRegular',
    padding: '3%',
    color: '#606060',
    backgroundColor: '#fff',
  },
  
  txtContainer: {
    top: height * 0.74,
    zIndex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    position: 'absolute',
    alignItems: 'center',
  },
  txtContainer2: {
    position: 'relative',
    width: '50%',
    height: '5%',
    backgroundColor: '#F1F1F1',
    alignItems: 'baseline',
    alignSelf: 'flex-end',
    marginRight: '10%',
  },
  txt3: {
    position: 'absolute',
    fontFamily: 'CatamaranRegular',
    color: '#949494',
    alignSelf: 'flex-end',
    fontSize: 14,
  },
  btn_Iniciar: {
    backgroundColor: '#FF4D35',
    paddingBottom: height * 0.01,
    paddingTop: height * 0.01,
    width: '80%',
    height: height * 0.05,
    borderRadius: 10,
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  
  btn_Iniciar_Disabled: {
    backgroundColor: '#6F6F6F', // Cambia el color cuando el botón está desactivado
  },
  btnTXT_Iniciar: {
    color: '#fff',
    fontSize: height * 0.020,
    fontFamily: 'Hind',
  },
  btnTXT_Iniciar2: {
    color: '#fff',
    fontSize: height * 0.020,
    fontFamily: 'Hind',
  },
  btnTXT_Iniciar3: {
    fontSize: height * 0.020,
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
  alertTitle2: {
    color: '#9D9D9D',
    fontFamily: 'Nunito',
    fontSize: width * 0.06,
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
  btn_Vale2: {
    backgroundColor: '#FF4D35',
    paddingTop: height * 0.0125,
    width: width * 0.3,
    height: height * 0.06,
    borderRadius: 45,
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
  },
  btn_Vale3: {
    backgroundColor: '#FFFF',
    borderColor:'black',
    borderWidth:2,
    left:15,
    paddingTop: height * 0.0125,
    width: width * 0.3,
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