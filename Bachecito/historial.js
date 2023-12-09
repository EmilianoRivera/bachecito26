import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Animated, Alert} from 'react-native';
import {collection, query, where, getDocs } from 'firebase/firestore';
import Modal from 'react-native-modal';
import NavigationBar from './barra';
import { db } from './firebase';

const { width, height } = Dimensions.get('window');
export default function Historial({ navigation,route }) {
  const userData = route.params?.userData;
  const [reportes, setReportes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    const obtenerReportes = async () => {
      const reportesRef = collection(db, 'reportes');
      const q = query(reportesRef, where('uidUsuario', '==', userData.uid));

      try {
        const querySnapshot = await getDocs(q);
        const fetchedReportes = [];
        querySnapshot.forEach((doc) => {
          fetchedReportes.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setReportes(fetchedReportes);
      } catch (error) {
        console.error('Error al obtener reportes:', error);
      }
    };

    obtenerReportes();
  }, [userData.uid]);
  console.log('Reportes obtenidos:', reportes);

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
    <View style={styles.container}>
       {reportes.length === 0 ? ( // Verifica si no hay reportes
       <View style={styles.cont}>
       <View style={{ height: height * 0.35, width: width * 0.8, backgroundColor: '#F1F1F1', borderRadius: 15, alignItems: 'center', justifyContent: 'center', padding: '5%' }}>
         <Text style={{ fontSize: width * 0.1, color: '#949494', marginBottom: 10 }}>¿🐜?</Text>

         <Text style={{ fontSize: width * 0.04, color: '#6F6F6F', textAlign: 'center', textAlign: 'justify' }}>
           ¡Vaya! Parece que aún no realizas ningún reporte. ¡Pero puedes crear uno en este momento!{'\n'}
         </Text>
         <TouchableOpacity
           activeOpacity={1}
           onPress={() => navigation.navigate('bache', {userData})}
           onPressIn={ValePressIn}
           onPressOut={ValePressOut}
           style={[
             styles.btn_Vale,
             Vale_isPress && styles.btn_Vale_Press,
             { transform: [{ scale: ValeScale }] },
           ]}
         >
           <Text style={[styles.btnTXT_Iniciar, Vale_isPress && styles.btnTXT_Iniciar_Press]}>
             ¡Reportar un bache!
           </Text>
         </TouchableOpacity>
       </View>
       </View>
    ) : (
      <View style={styles.cont}>
      <Text>Listado de Reportes</Text>
      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <View style={{ height: height * 0.19, width: width * 0.8, backgroundColor: '#F1F1F1', borderRadius: 15, alignItems: 'center', justifyContent: 'center', padding: '5%',marginBottom: 10, marginTop:10}}>
            <Image
            source={{ uri: item.imagenURL }}
            style = {{ top: height * 0.06 ,alignSelf: 'flex-start' ,height: height * 0.15, width: width * 0.37, borderRadius: width * 0.03 }}/>
                  
            <Text style = {{top: height * -0.090, left: width * 0.2, backgroundColor: '#FFF', height: height * 0.02, width: width * 0.305, borderRadius: width * 0.03, fontSize: height * 0.0145, fontWeight: 'bold', color: '#1E1E1E', textAlign: 'center', justifyContent: 'center',}}>
            {item.fechaReporte}
            </Text>

            <Text style = {{top: height* -0.08, left: width * 0.2, backgroundColor: '#FFF', height: height * 0.1, width: width * 0.305, borderRadius: width * 0.03, fontSize: height * 0.0127, textAlign: 'justify', paddingTop: height * 0.005, paddingLeft: width * 0.02, paddingRight: width * 0.02, }}>
            {item.ubicacion}
            </Text>

            <TouchableOpacity 
                      style = {{top: height * -0.07, left: width * 0.2, height: 16, width: 67, backgroundColor: '#Fff', borderRadius: width * 0.03}}
                      onPress={() =>  {setSelectedItem(item); // Establece el elemento seleccionado
                      setModalVisible(true);}}
            >
                  <Text style = {{fontSize: height * 0.013, left: '5%' }}>Ver más ▶</Text>
                  
            </TouchableOpacity>
             
        </View>  )}
      />
     </View>)}
      <Modal
                  isVisible={modalVisible} // Controla la visibilidad del modal
                  backdropColor="#000000" // Color de fondo del modal
                  backdropOpacity={0.4} // Opacidad del fondo
              >
                 {selectedItem && (
                  <View style={styles.modalContent}>
                     
                      <Text style = {{top: '4%', left: '38%', fontStyle: 'italic', fontSize: width * 0.04}}>UBICACIÓN</Text>

                      <Text style={{color: '#525252', fontSize: height * 0.014, paddingLeft: '2.5%', paddingRight: '2.5%', paddingTop: '0.7%', height: '25%', width: '80%', backgroundColor: '#FFF', top: '5%',left: '10%', borderRadius: width * 0.03, textAlign:'justify'}}>
                      {selectedItem.ubicacion}
                      </Text>
              
                      <Text style={{top: '9%', left: '10%', fontSize: width * 0.04, fontStyle: 'italic', color: '#1E1E1E'}}>DESCRIPCIÓN</Text>
                      <Text style = {{top: '10%', left: '10%', height: '30.5%', width: '35%', backgroundColor: '#FFF', borderRadius: width * 0.03, paddingLeft: '2.5%', paddingRight: '2.5%', paddingTop: '0.7%', textAlign:'justify'}}>
                      {selectedItem.descripcion}
                      </Text>

                      <Text style = {{top: '11%', left: '10%', fontStyle: 'italic', fontSize: width * 0.04}}>ESTADO</Text>
                      <Image 
                      source={selectedItem.estado === 'Publicado' ? require('./imgs/BanderaVerdeConFondo.png') : require('./imgs/BanderaRojaConFondo.png')}
                      style={{ top: '12.5%', left: '10%', height: '3%', width: '5%' }}
                      />
                      <Text style={{ top: '9%', left: '19%', height: '3.8%', width: '26.5%', backgroundColor: '#FFF', borderRadius: width * 0.03, fontSize: height * 0.014, textAlign: 'center', paddingBottom: '1.3%' }}>
                       {selectedItem.estado}
                      </Text>

                      <Text style={{ top: '-38%', left: '52%', fontSize: width * 0.04, fontStyle: 'italic', color: '#1E1E1E' }}>FOTOGRAFÍA</Text>
                      <View style={{ top: '-37%', left: '50%', width: '40%', height: '40%', backgroundColor: '#FFF', borderRadius: width * 0.03, justifyContent: 'center', alignItems: 'center', }}>
                        <Image
                          source={{ uri: selectedItem.imagenURL }}
                          style={{ width: '90%', height: '95%', borderRadius: width * 0.03, }}
                          resizeMode="contain" />
                      </View>

                      <TouchableOpacity
                          style={{top: '-30%', left: '31.5%', height: '6%', width: '38%', backgroundColor: '#FF7A3E', borderRadius: width * 0.045, justifyContent: 'center',}}
                          onPress={() => setModalVisible(false)} // Cierra el modal
                      >
                          <Text style={{color: '#FFF', fontSize: width * 0.035, fontWeight: 'bold', textAlign: 'center',}}>Vale</Text>
                      </TouchableOpacity>
                  </View>)}
              </Modal>
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
    height: '70%',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 0,
    justifyContent: 'center',
  },
  btn_Vale: {
    backgroundColor: '#FFB72C',
    paddingTop: height * 0.0125,
    width: width * 0.45,
    height: height * 0.055,
    borderRadius: 45,
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
  },

  btnTXT_Iniciar: {
    color: '#fff',
    fontSize: width * 0.04,
    fontFamily: 'Hind',
  },

  btn_Vale_Press: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FFB72C',
  },

  btnTXT_Iniciar_Press: {
    color: '#FFB72C',
  },
  modalContent: {
    height: height * 0.65,
    width: width * 0.835,
    left: width * 0.033,
    backgroundColor: '#F1F1F1',
    borderRadius: width * 0.05,
},
});