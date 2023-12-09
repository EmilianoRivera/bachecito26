import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native';
import Modal from 'react-native-modal';
import NavigationBar from './barra';
import * as ImagePicker from 'expo-image-picker';
import {  signOut } from 'firebase/auth';
import {  updateDoc,collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Auth,db } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Cuenta({ navigation, route }) {
  const userData = route.params?.userData;
  const [isCerrarSesionPressed, setIsCerrarSesionPressed] = useState(false);
  const [isEliminarCuentaPressed, setIsEliminarCuentaPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [imageUri, setImageUri] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isEditingData, setIsEditingData] = useState(false);
  const [isCerrarSesionVisible, setIsCerrarSesionVisible] = useState(true);
  const [isEliminarCuentaVisible, setIsEliminarCuentaVisible] = useState(true);

 
  const [Nombre, setNombre] = useState('');
  const [nombreOriginal, setNombreOriginal] = useState('');


  const handleChangeNombre = (text) => {
    if (text.length <= 50) {
      if (/^[A-Za-z ]*$/.test(text)) {
        setNombre(text);
      }
    } else {
      Alert.alert('¡Increíble!', `Tu(s) nombre(s) no pueden tener tantos caracteres 🤨`);
      setNombre(nombreOriginal);
    }
  };
 
  const [APPAT, setPat] = useState('');
  const [APPATOg, setAPPATOg] = useState('');

  const handleChangePat = (Text) => {
    if (Text.length <= 20) {
      if (/^[A-Za-z]*$/.test(Text)) {
        setPat(Text);
      }
    } else {
      Alert.alert('¡Increíble!', `Tu apellido no puede tener tantos caracteres 🤨`);
      setPat(APPATOg);
    }
  };
  const [APMAT, setMat] = useState('');
  const [APMATOg, setAPMATOg] = useState('');
 

    const handleChangeMat = (Text) => {
      if (Text.length <= 20) {
        if (/^[A-Za-z]*$/.test(Text)) {
          setMat(Text);
        }
      } else {
        Alert.alert('¡Increíble!', `Tu apellido no puede tener tantos caracteres 🤨`);
        setMat(APMATOg);
      }
    };
  const [correo, setCorreo] = useState('');


  const handleChangeCor = (newCor) => {
  setCorreo(newCor);
  };

  const [originalUserData, setOriginalUserData] = useState(null); 
  useEffect(() => {
    if (userData) {
      setNombre(userData.nombre);
      setNombreOriginal(userData.nombre);
      setPat(userData.apellidoPaterno);
      setAPPATOg(userData.apellidoPaterno);
      setMat(userData.apellidoMaterno);
      setAPMATOg(userData.apellidoMaterno);
      setCorreo(userData.correo);
      setOriginalUserData(userData); 
      const getImageUrl = async () => {
        const reportesRef = collection(db, 'usuarios');
        const q = query(reportesRef, where('uid', '==', userData.uid));
        const querySnapshot = await getDocs(q);
  
        querySnapshot.forEach(async (doc) => {
          const userImageUrl = doc.data().imagen; 
          setImageUri(userImageUrl); 
        });
      };
  
      getImageUrl(); 
    }
  }, [userData]);

  const cancelarEdicion = () => {
    setNombre(originalUserData.nombre);
    setPat(originalUserData.apellidoPaterno);
    setMat(originalUserData.apellidoMaterno);
    setCorreo(originalUserData.correo);
    setIsEditing(false);
    setIsEditEnabled(true);
    setIsCerrarSesionVisible(true); // Muestra el botón "Cerrar Sesión"
    setIsEliminarCuentaVisible(true); // Muestra el botón "Eliminar Cuenta"
  };

  const pickImage = async () => {
    if (isEditing) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setIsEditing(true);
      }
    }else{
      console.log("Edit mode is disabled");
    }
  };

  const handleCerrarS = async () => {
    try {
      // Limpiar los datos guardados al cerrar sesión
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');
  
      signOut(Auth)
        .then(() => {
          console.log('Sesión cerrada exitosamente');
          navigation.navigate('Inicio');
        })
        .catch((error) => {
          console.error('Error al cerrar sesión:', error);
        });
    } catch (error) {
      console.error('Error al limpiar datos al cerrar sesión:', error);
    }
  };
  

  const eliminarCuenta = async () => {
    try {
      const reportesRef = collection(db, 'usuarios');
      const q = query(reportesRef, where('uid', '==', userData.uid));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach(async (doc) => {
        const docId = doc.id;
  
        await updateDoc(doc.ref, { disabled: true });
  
        console.log('cuenta desactivada');
        handleCerrarS();
  
      });
    } catch (error) {
      console.error('Error al desactivar la cuenta:', error);
    }
  };
  
  const [isEditEnabled, setIsEditEnabled] = useState(true);
  const toggleEdit = () => {
    if (!isEditing) { // Si no está en modo de edición
      setIsEditing(true); // Activar modo de edición
      setIsEditingData(true);
      setIsEditEnabled(false); // Deshabilitar botón de edición
      setIsCerrarSesionVisible(false); // Ocultar el botón "Cerrar Sesión"
      setIsEliminarCuentaVisible(false); // Ocultar el botón "Eliminar Cuenta"
      console.log("Modo de edición activado");
    } else {
      setIsEditing(false); // Salir del modo de edición
    setIsEditEnabled(true); // Habilitar botón de edición
    setIsCerrarSesionVisible(true); // Mostrar el botón "Cerrar Sesión"
    setIsEliminarCuentaVisible(true); // Mostrar el botón "Eliminar Cuenta"
    console.log("Modo de edición desactivado");// Muestra el botón "Eliminar Cuenta"
    }
  };
  
  

const updateUserProfile = async () => {
  try {
    const reportesRef = collection(db, 'usuarios');
    const q = query(reportesRef, where('uid', '==', userData.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      const docId = doc.id;

      await updateDoc(doc.ref, {
        nombre: Nombre,
        apellidoPaterno: APPAT,
        apellidoMaterno: APMAT,
      });

      console.log('Datos actualizados exitosamente en Firestore');

      if (imageUri) {
        const storage = getStorage();
        const imageRef = ref(storage, `imagenesPerfil/${userData.uid}/profilePic.jpg`);
        
        const response = await fetch(imageUri);
        const blob = await response.blob();

        await uploadBytes(imageRef, blob);

        const imageUrl = await getDownloadURL(imageRef);

        await updateDoc(doc.ref, { imagen: imageUrl });
        console.log('Imagen subida a Storage y URL actualizada en Firestore');
      }
    });
  } catch (error) {
    console.error('Error al actualizar datos en Firestore:', error);
  }
  setIsEditingData(false); // Establecer el estado de edición de datos en falso
  setIsEditing(false); // Salir del modo de edición
  setIsEditEnabled(true); // Habilitar botón de edición nuevamente
  setIsCerrarSesionVisible(true); // Mostrar el botón "Cerrar Sesión"
  setIsEliminarCuentaVisible(true); // Mostrar el botón "Eliminar Cuenta"
  Alert.alert(
    'Aviso',
    'Para ver estos cambios reflejados, te recomendamos volver a iniciar sesión');
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

 return (
  <ScrollView contentContainerStyle={styles.scrollView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { marginBottom: bottomMargin }]}>
      <View style={styles.containerDatos}>
        <View style = {{height: height * .25, width: height * .25, zIndex: 1, borderRadius: 100, backgroundColor: '#fff'}}>
      
        <TouchableOpacity
  style={{
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.25,
    width: height * 0.25,
    zIndex: 1,
    borderRadius: 100,
    backgroundColor: '#D1D1D1',
  }}
  onPress={pickImage}
>
  {imageUri ? (
    <Image source={{ uri: imageUri }} style={{ height: height * 0.25, width: height * 0.25, zIndex: 2, borderRadius: 100 }} />
  ) : (
    <Image
      source={require('./imgs/Cuenta.png')} // O la imagen predeterminada que quieras usar
      style={{ resizeMode: 'cover', borderRadius: 1000, height: height * 0.25, width: height * 0.25 }}
    />
  )}
</TouchableOpacity>

        <TouchableOpacity 
                style={{height: width*0.035, width: width*0.1, top: -width*0.1, left: '85%', alignItems: 'center', justifyContent: 'center',  display: isEditEnabled ? 'flex' : 'none',}} 
                onPress={toggleEdit}
            >
                <Image 
                    source={require('./imgs/editar.png')} 
                    style={{top: '300%', left: '50%', height: width*0.045, width: width*0.045,}}
                />
                </TouchableOpacity>
                {isEditing && (
  <>

      <TouchableOpacity 
                style={{height: width*0.035, width: width*0.1, top: -width*0.08, left: '85%', alignItems: 'center', justifyContent: 'center'}} 
                onPress={() => {
                  toggleEdit();
                  setIsEditingData(false);
                  cancelarEdicion(); // Llamada a la función para revertir los cambios

                }}
            >
                <Image 
                    source={require('./imgs/cancelar.png')} 
                    style={{top: '180%', left: '-530%', height: width*0.045, width: width*0.045, zIndex: 5}}
                />
                </TouchableOpacity>

    <TouchableOpacity
      style={{ 
        left: '18%',
        marginTop: '-1%', 
        backgroundColor: '#FFD557', 
        borderRadius: 45, 
        height: '20%', 
        width: '60%', 
        justifyContent: 'center', 
        alignItems: 'center',
        zIndex: 2,
        top: '134%',
      }}
      onPress={() => {
        // Aquí podrías agregar lógica para guardar los cambios
        updateUserProfile(); 
       
      }}
    >
      <Text style={{color: '#FFF', fontSize: width * 0.035, fontWeight: 'bold', textAlign: 'center'}}>
        Guardar Cambios
      </Text>
    </TouchableOpacity>
  </>
)}

        </View>
        <View style={styles.innerContainer}>
            <View style = {{backgroundColor: '#F1F1F1', top: '28%', height: '50%', width: '80%', alignItems: 'flex-start', alignContent: 'center'}}>
            <TextInput style={{
                width: '100%',
                backgroundColor: '#FFF',
                borderRadius: 10,
                height: width*0.110,
                fontSize: width*0.035,
                paddingTop: '4.5%',
                paddingLeft: '3.5%',
                color: '#606060',
                marginBottom: '1%',
              }}
                value={Nombre}
                onChangeText={handleChangeNombre}
                editable={isEditing}> 
            </TextInput>
            

            <TextInput style={{
                top: '-1%',
                marginTop: '5%',
                width: '48%',
                backgroundColor: '#FFF',
                borderRadius: 10, 
                height: width*0.110,
                fontSize: width*0.035,
                paddingTop: '4.5%',
                paddingLeft: '3.5%',
                color: '#606060',
                alignSelf: 'flex-start'
                }} 
                value={APPAT}
                editable={isEditing}
                onChangeText={handleChangePat}
                >
            </TextInput>
            <TextInput style={{
                top: height*.070, 
                width: '48%',
                alignSelf: 'flex-end',
                position: 'absolute',
                backgroundColor: '#FFF',
                borderRadius: 10,
                height: width*0.110,
                fontSize: width*0.035,
                paddingTop: '4.5%',
                paddingLeft: '3.5%',
                color: '#606060',
                }}  
                value={APMAT}
                editable={isEditing}
                onChangeText={handleChangeMat}
                >
            </TextInput>
            <Text style={{
                top: '-1%',
                marginTop: '5%',
                width: '100%',
                backgroundColor: '#FFF',
                borderRadius: 10,
                height: width*0.110,
                fontSize: width*0.035,
                paddingTop: '4.5%',
                paddingLeft: '3.5%',
                color: '#606060',
                marginBottom: '1%',}}>  {userData.fechaNacimiento}
            </Text> 
            <Text style={{
                top: '-2%',
                marginTop: '5%',
                width: '100%',
                backgroundColor: '#FFF',
                borderRadius: 10,
                height: width*0.120,
                fontSize: width*0.035,
                paddingTop: '4.5%',
                paddingLeft: '3.5%',
                color: '#606060',
                marginBottom: '1%',}}  
                > {userData.correo}
            </Text>
            </View>

          <View style = {{top: '11%',height:height * 0.05, width:'75%', marginTop: '30%', backgroundColor: '#F1F1F1'}}>
          <TouchableOpacity
            style={{
              display: isCerrarSesionVisible ? 'flex' : 'none',
              height: '100%',
              width: '46%',
              backgroundColor: '#FFD557',
              borderWidth: 2,
              borderColor: '#FFD557',
              borderRadius: 50,
              justifyContent: 'center',
            }}
            onPress={() => {
            //  handlePress('cerrarSesion');
              setModalVisible(true);
            }}
          >
            <Text style={{ color: '#FFF', fontSize: width*0.035, fontWeight: 'bold', textAlign: 'center' }}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              display: isEliminarCuentaVisible ? 'flex' : 'none',
              height: '100%',
              width: '50%',
              backgroundColor: '#FFf',
              borderWidth: 2,
              borderColor: '#FFD557',
              borderRadius: 50,
              justifyContent: 'center',
              position: 'absolute',
              alignSelf: 'flex-end'
            }}
            onPress={() => {
             // handlePress('eliminarCuenta');
              setModalVisible2(true);
            }}
          >
            <Text style={{ color: '#FFD557', fontSize: width*0.035, fontWeight: 'bold', textAlign: 'center' }}>
              Eliminar Cuenta
            </Text>
          </TouchableOpacity>
          </View>
        </View>

        {/* Modal 1 */}
        <Modal isVisible={modalVisible} backdropColor="#000000" backdropOpacity={0.4}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText2}>¿Seguro que deseas cerrar sesión?</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                handleCerrarS();
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>¡Segurísimo!🐜</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton2}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText2}>Nop👀</Text>
            </TouchableOpacity>
            
          </View>
        </Modal>

        {/* Modal 2 */}
        <Modal isVisible={modalVisible2} backdropColor="#000000" backdropOpacity={0.4}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>¿De verdad quieres eliminar tu cuenta?</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                eliminarCuenta();
                setModalVisible2(false);
              }}
            >
              <Text style={styles.modalButtonText}>¡Segurísimo!🐜</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton2}
              onPress={() => {
            //    handlePress('eliminarCuenta');
                setModalVisible2(false);
              }}
            >
              <Text style={styles.modalButtonText2}>Nop👀</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      <NavigationBar navigation={navigation} userData={userData}/>
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

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerDatos: {
    top: '18%',
    height: '75%',
    width: width * 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 0,
  },
  innerContainer: {
    top: '-15%',
    height: '75%',
    width: '80%',
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    alignItems: 'center'
  },
  modalContainer: {
    height: '25%',
    width: width*.8,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  modalText: {
    top: '25%',
    left: '10%',
    height: '50%',
    width: '35%',
    textAlign: 'right',
    fontSize: width*0.045,
    fontWeight: 'bold',
    color: '#9D9D9D',
    textAlign: 'justify'
  },
  modalText2: {
    top: '30%',
    left: '10%',
    height: '50%',
    width: '35%',
    textAlign: 'right',
    fontSize: width*0.045,
    fontWeight: 'bold',
    color: '#9D9D9D',
    textAlign: 'justify'
  },
  modalButton: {
    top: '-25%',
    left: '50%',
    height: '20%',
    width: '40%',
    marginBottom: '2%',
    backgroundColor: '#FFD557',
    borderWidth: 2,
    borderColor: '#FFD557',
    borderRadius: 50,
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: width*0.035,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButton2: {
    top: '-20%',
    left: '50%',
    height: '20%',
    width: '40%',
    marginBottom: '2%',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FFD557',
    borderRadius: 50,
    justifyContent: 'center',
  },
  modalButtonText2: {
    color: '#FFD557',
    fontSize: width*0.035,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});