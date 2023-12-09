import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, Animated, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {  addDoc, collection } from 'firebase/firestore';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import NavigationBar from './barra';
import { db, app} from './firebase';
const { width, height } = Dimensions.get('window');
export default function Reporte({ route }) {

  const navigation = useNavigation();
  const { direccion, userData } = route.params; 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [descripcion, setDescripcion] = React.useState('');
    // Agrega un estado para controlar la visibilidad del modal
    const [modalVisible, setModalVisible] = useState(false);
    const [reportVisible, setReportVisible] = useState(true);
    const ocultarB = () => {
      setReportVisible(false);
    };
    //Agregar fotografía
    const [imageUri, setImageUri] = React.useState(null);

   
    const subirImagenFirebaseStorage = async (imageUri) => {
      try {
        if (!imageUri) {
          console.log('No se proporcionó una URI de imagen válida.');
          return null;
        }
    
        const response = await fetch(imageUri);
        const blob = await response.blob();
    
        const storage = getStorage(app);
        const randomId = Math.random().toString(36).substring(7);
        const extension = imageUri.split('.').pop();
        const imageName = `reporte_${randomId}.${extension}`;
        const storageRef = ref(storage, `ImagenesBaches/${userData.uid}/${imageName}`);
    
        await uploadBytes(storageRef, blob);
    
        const downloadURL = await getDownloadURL(storageRef);
        console.log('URL de descarga de la imagen:', downloadURL);
        return downloadURL;
      } catch (error) {
        console.error('Error al subir la imagen a Firebase:', error);
        throw error;
      }
    };
    
    const pickImage = async () => {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [9, 16],
          quality: 1,
        });
  
        if (!result.canceled) {
          const selectedImage = result.assets[0]; // Acceder a la primera imagen seleccionada
          setImageUri(selectedImage.uri);
          await subirImagenFirebaseStorage(selectedImage.uri);
        }
      } catch (error) {
        console.error('Error al seleccionar una imagen:', error);
      }
    };
  
    const takePhoto = async () => {
      try {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [9, 16],
          quality: 1,
        });
    
        if (!result.canceled) {
          const selectedImage = result.assets[0]; // Acceder a la primera imagen seleccionada
          setImageUri(selectedImage.uri);
          await subirImagenFirebaseStorage(selectedImage.uri);
        }
      } catch (error) {
        console.error('Error al tomar una foto:', error);
      }
    };


        // Define el estado para el margen inferior
        const [bottomMargin, setBottomMargin] = useState(0);

        useEffect(() => {
            // Agrega oyentes de teclado para ajustar manualmente el margen inferior
            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
              setBottomMargin(-100); // Ajusta este valor según tus necesidades
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

  const [Vale_isPress2, ValePressed2] = useState(false);
  const ValeScale2 = new Animated.Value(1);

  const ValePressIn2 = () => {
    ValePressed2(true);
    Animated.spring(ValeScale2, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const [direccionCompleta, setDireccionCompleta] = useState('');
   //Función para validar el botón reportar
   const isButtonDisabled =
   !direccionCompleta.trim() ||
   !imageUri 
  useEffect(() => {
    setDireccionCompleta(direccion);
  }, [direccion]); 
  const enviarReporteABaseDeDatos = async () => {
    try {
      const imageURL = await subirImagenFirebaseStorage(imageUri);
      const reporte = {
        uidUsuario: userData.uid,
        nombre: userData.nombre,
        apellidoPaterno: userData.apellidoPaterno,
        descripcion: descripcion,
        ubicacion: direccionCompleta,
        imagenURL: imageURL,
        fechaReporte: new Date().toISOString().split('T')[0],
      };
  
      const docRef = await addDoc(collection(db, 'reportes'), reporte);
      console.log('UID del reporte:', docRef.id);
      Alert.alert('¡Que genial!','¡Reporte enviado con éxito!');
  
      setDescripcion('');
      setImageUri(null);
      setDireccionCompleta('');
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      Alert.alert('Error','Hubo un error al enviar el reporte. Por favor, inténtalo de nuevo.');
    }
  };
  
 
  const handleReport = async () => {
    if (!isButtonDisabled) {
      setIsSubmitting(true); // Marcar como proceso en curso
      try {
        if (imageUri) {
          await enviarReporteABaseDeDatos(imageUri);
          navigation.navigate('historial', { userData });
        } else {
          Alert.alert('Imagen','Por favor, selecciona una imagen antes de continuar.');
        }
      } catch (error) {
        console.error('Error al enviar el reporte:', error);
        Alert.alert('Error','Hubo un error al enviar el reporte. Por favor, inténtalo de nuevo.');
      } finally {
        setIsSubmitting(false); // Reiniciar el estado una vez completado el proceso
      }
    } else {
      Alert.alert('Campos en Blanco','Por favor, llena todos los campos antes de reportar');
    }
  };
  
    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { marginBottom: bottomMargin }]}>
                <View style = {styles.cont}>
                
            
            <View style={styles.Remitente}>
                <Text style={{fontSize: width * 0.04, fontFamily: 'NunitoSemiBoldItalic', color: '#1E1E1E', textAlign: 'center', top: 12,}}>
                    REPORTE HECHO POR:
                </Text>
                <Text style={styles.Nombre}> {userData.nombre} {userData.apellidoPaterno} {userData.apellidoMaterno}</Text>
            </View>
            
            <View style={styles.Ubicacion}>
                <Text style = {{top: '6.5%', left: '5%', fontSize: width * 0.04, fontFamily: 'NunitoSemiBoldItalic', color: '#1E1E1E', }}>UBICACIÓN</Text>


               
                <TextInput
                    style={{padding: 10, fontSize: width*0.035, paddingLeft: 5, height: '66%', width: '89.5%', backgroundColor: '#FFF', top: '5%', left: '5%', borderRadius: 10,  marginTop: 10}}
                    onChangeText={(text) => setDireccionCompleta(text)}
                    editable={false}
                    value={direccionCompleta}
                    multiline={true}
                    textAlignVertical="top"
                />     
            </View>

            <View style = {styles.alineacion}>
            <View style = {styles.Descripcion}>
                <Text style={{top:10, fontSize: width*0.035, fontFamily: 'NunitoSemiBoldItalic', color: '#1E1E1E'}}>DESCRIPCIÓN</Text>
                <TextInput
                    style={styles.textoInput}
                    onChangeText={(text) => setDescripcion(text)}
                    value={descripcion}
                    placeholder="He aquí un bache..."
                    textAlignVertical="top"
                    multiline={true}
                />
            </View>

            <TouchableOpacity isVisible={reportVisible}
  onPress={() => {
    if (!isButtonDisabled) {
      // Mostrar un modal de confirmación para decidir si enviar o seguir editando
      ocultarB();
  setConfirmationModalVisible(true);
     
    } else {
      // Mostrar una ventana emergente si los campos no están llenos
      setModalVisible(true);
    }
  }}
  style={[
    styles.botonReportar,
    isButtonDisabled && styles.isButtonDisabled,
    !reportVisible && { display: 'none' }
  ]}
>
  <Text
    style={[
      styles.textoBotonReportar,
      isButtonDisabled && styles.isButtonDisabled_txt,
    ]}
  >
    ¡REPORTAR!
  </Text>
</TouchableOpacity>

{/* Modal para confirmar enviar el reporte */}
<Modal
  isVisible={confirmationModalVisible}
  animationIn="slideInUp"
  animationOut="slideOutDown"
  onBackdropPress={() => setConfirmationModalVisible(false)}
>
  <View style={styles.modalContent}>
    <Text style={{fontSize: height * 0.035, fontWeight: 'bold', color: '#9D9D9D', top: '0%'}}>Confirmación ✔️</Text>
    <Text style={{fontSize: height * 0.017, top: '5%', textAlign: 'justify', color: '#1E1E1E', paddingLeft:7, paddingEnd:7}}>¿Deseas enviar el reporte? Recuerda que no podrás borrar este reporte después de envíarlo. 👀</Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
      <TouchableOpacity
        onPress={() => {
          setConfirmationModalVisible(false);
          handleReport(); // Aquí se llama a la función para enviar el reporte
        }}
        style={styles.confirmationButton}
      >
        <Text  style={styles.confirmationButtonText}>Enviar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setConfirmationModalVisible(false)}
        style={styles.confirmationButton2}
      >
        <Text style={styles.confirmationButtonText2}>Seguir editando</Text>
      </TouchableOpacity>
      </View>
  </View>
</Modal>


            <Modal
              isVisible={modalVisible}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              onBackdropPress={() => setModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <Text style={{fontSize: height * 0.035, fontWeight: 'bold', color: '#9D9D9D', top: '0%'}}>🚗 ¡Con calma!</Text>
                <Text style={{fontSize: height * 0.017, top: '8%', textAlign: 'justify', color: '#1E1E1E'}}>
                  Aún hay algunos campos que te faltan por 
                  llenar para poder completar tu reporte. 
                  ¡Verifícalos e intenta de nuevo!
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Vale</Text>
                </TouchableOpacity>
              </View>
            </Modal>

             <View style={{ alignItems: 'center', position:'absolute', alignSelf: 'flex-end', width: '45%', height: '60%', backgroundColor: '#F1F1F1', borderRadius: 15, top: '5.5%'}}>

                <Text style={{ top: 10, fontFamily: 'NunitoSemiBoldItalic', fontSize: width*0.035, color: '#1E1E1E' }}>FOTOGRAFÍA</Text>
                
                <View style={{ alignItems: 'center', justifyContent: 'center', top: 20, width: '80%', height: '75%', backgroundColor: '#FFF', borderRadius: 10, }}
                onPress={pickImage}>
                    <TouchableOpacity
                        style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 45, }}
                        onPress={() => { showAlert();
                        }}
                    >
                        {imageUri ? (
                            //A  Si se selecciona una imagen, muestra la imagen seleccionada
                            <Image source={{ uri: imageUri }} style={{ height: '100%', width: '100%', borderRadius: 10, zIndex: 1 }} />
                        ) : (
                            // Si no hay imagen seleccionada, muestra el icono para agregar
                            <Image source={require('./imgs/agregar.png')} style={styles.iconoAgregar} />
                        )}
                    </TouchableOpacity>
                </View>
                
            </View>
            </View>
            <Modal visible={isAlertVisible} animationType="slide" transparent>
              <View style={styles.MainAlert}>
                <View style={styles.alertContainer}>
                    <TouchableOpacity onPress={hideAlert} activeOpacity={1} style = {{alignSelf:'flex-end', position: 'absolute', top: '15%', right: '15%', zIndex: 1}} >
                    <Image source={require('./imgs/cancelar.png')} style={styles.iconoCancelar} />
                  </TouchableOpacity>
                  <Text style={styles.alertTitle}>🥳 ¡Ya casi!</Text>
                  <Text style={styles.alertText}>
                  ¿Como te gustaría añadir la foto del bache reportado? ¡Recuerda que es súper importante la foto de evidencia así que asegurate de que se vea bien!
                  </Text>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => pickImage()}
                    onPressIn={ValePressIn}
                    onPressOut={hideAlert}
                    style={[
                      styles.btn_Vale,
                      Vale_isPress && styles.btn_Vale_Press,
                      { transform: [{ scale: ValeScale }] },
                    ]}
                  >
                    <Text style={[styles.btnTXT_Iniciar, Vale_isPress && styles.btnTXT_Iniciar_Press]}>
                    🏜 Galería
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => takePhoto()}
                    onPressIn={ValePressIn2}
                    onPressOut={hideAlert}
                    style={[
                      styles.btn_Vale2,
                      Vale_isPress2 && styles.btn_Vale_Press2,
                      { transform: [{ scale: ValeScale2 }] },
                    ]}
                  >
                    <Text style={[styles.btnTXT_Iniciar2, Vale_isPress2 && styles.btnTXT_Iniciar_Press2]}>
                    📸 Cámara 
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
                </View>
                <NavigationBar navigation={navigation} userData={userData} direccion={direccion} />
            </View>
            </TouchableWithoutFeedback>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  scrollView: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: '#000'
    },
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
  },

  cont: {
      backgroundColor: '#fff',
      width: '100%',
      height: height * 0.8,
      alignContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 0,
      top: '7%'
  },

  Remitente: {
      top: '10%',
      width: '80%',
      height: '14%',
      backgroundColor: '#F1F1F1',
      borderRadius: 15,
      alignItems: 'center',
  },
  Nombre: {
      top: 18, 
      borderRadius: 10, 
      backgroundColor: '#FFF', 
      width: '90%',
      height: '40%', 
      fontSize: width * 0.035,
      color: '#606060',
      textAlign: 'center',
      textAlignVertical: 'center',
  },
  Ubicacion: {        
      width: '80%',
      height: '27%',
      backgroundColor: '#F1F1F1',
      borderRadius: 15,
      top: height*.105,
  },
  Mapa: {
      top: '10%',
      height: '75%',
      left: '5%',
      width: '40%',
      backgroundColor: '#FFF',
      borderRadius: 10,
  },
  alineacion: {
      alignItems: 'baseline',
      width: '80%',
      top: height*.100,
      height: '67%'
  },
  Descripcion: {
      width: '45%',
      height: '45%',
      backgroundColor: '#F1F1F1',
      borderRadius: 15,
      alignItems: 'center',
      top: '5.5%',
  },
  textoInput: {
      top: 20,
      width: '80%',
      height: '70%',
      backgroundColor: '#FFF',
      borderRadius: 10,
      padding: 10,
      fontSize: width*0.03,
  },

  //Boton
  isButtonDisabled: {
      backgroundColor: '#FFF',
      borderRadius: 45,
      borderWidth: 1, 
      borderColor: '#D1D1D1',
      height: '9%',
      width: '45%',
      top: '9%',
      alignItems: 'center',
      marginTop: 10,
      left: 0
  },
  isButtonDisabled_txt: {
      top: '20%',
      color: '#D1D1D1',
      fontSize: width*0.04,
      fontFamily: 'Hind-Bold',
      fontWeight: 'bold',
  },
  botonReportar: {
      backgroundColor: '#FF9F49',
      borderRadius: 45,
      height: '9%',
      width: '45%',
      left: 0,
      alignItems: 'center',
      marginTop: 50,
  },
  textoBotonReportar: {
      top: '18%',
      color: '#fff',
      fontSize: width*0.04,
      fontFamily: 'Hind-Bold',
      fontWeight: 'bold',
  },

  iconoAgregar: {
      height: 25,
      width: 25,
  },
  
  //VENTANA EMERGENTE DE CAMPOS INCOMPLETOS
  modalContent: {
      height: '28%',
      width: '90%',
      backgroundColor: '#F1F1F1',
      padding: 15,
      alignItems: 'center',
      borderRadius: 15,
      alignSelf: 'center'
  },
  closeButton: {
      top: '20%',
      height: '18%',
      width: '40%',
      backgroundColor: '#FFB72C',
      borderRadius: 45,
      justifyContent: 'center',  
  },
  closeButtonText: {      
      color: '#FFF',       
      fontSize: width*0.035,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  confirmationButton: {
    backgroundColor: '#FF4D35',
    paddingTop: height * 0.0125,
    width: width * 0.3,
    height: height * 0.06,
    right:12,
    borderRadius: 45,
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
},

confirmationButtonText: {      
    color: '#FFF',       
    fontSize: width*0.035,
    fontWeight: 'bold',
    textAlign: 'center',
},
confirmationButton2: {
  backgroundColor: '#FFFF',
  borderColor:'black',
  borderWidth:2,
  left:12,
  paddingTop: height * 0.0125,
  width: width * 0.3,
  height: height * 0.06,
  borderRadius: 45,
  alignItems: 'center',
  alignContent: 'center',
  textAlign: 'center',
  alignSelf: 'center',
},
confirmationButtonText2: {      
  color: '#000',       
  fontSize: width*0.035,
  fontWeight: 'bold',
  textAlign: 'center',
},
//Alerta
MainAlert: {
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  width: width * 1,
  height: height* 1,
  alignSelf: 'center',
  alignContent:'center',
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
  width: width * 0.25,
  height: height * 0.05,
  borderRadius: 45,
  alignItems: 'center',
  alignContent: 'center',
  textAlign: 'center',
  left: '7%'

},

btnTXT_Iniciar: {
  color: '#fff',
  fontSize: width * 0.035,
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

btn_Vale2: {
  backgroundColor: '#FF4D35',
  paddingTop: height * 0.0125,
  width: width * 0.25,
  height: height * 0.05,
  borderRadius: 45,
  alignItems: 'center',
  alignContent: 'center',
  textAlign: 'center',
  alignSelf: 'flex-end',
  position: 'absolute',
  bottom: '10%',
  right: '20%'
},

btnTXT_Iniciar2: {
  color: '#fff',
  fontSize: width * 0.035,
  fontFamily: 'Hind',
},

btn_Vale_Press2: {
  backgroundColor: '#fff',
  borderWidth: 2,
  borderColor: '#FF4D35',
},

btnTXT_Iniciar_Press2: {
  color: '#FF4D35',
},

iconoCancelar: {
  height: 20,
  width: 20,
},
});