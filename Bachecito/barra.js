import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

const NavigationBar = ({ navigation, userData}) => {
  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Image source={require('./imgs/Logo.png')} style={styles.imagenEstilo} />
        <Text style={styles.textEstilo}>BACHECITO 26</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.iconoHistorial}
          onPress={() => navigation.navigate('historial', { userData: userData })}
        >
          <Image source={require('./imgs/reloj.png')} style={styles.iconoHistorial} />
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.iconoInicio}
          onPress={() => navigation.navigate('bache', { userData: userData })}
        >
          <Image source={require('./imgs/Inicio.png')} style={styles.iconoInicio} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconoUsuario}
          onPress={() => navigation.navigate('perfil', { userData: userData })}
        >
          <Image source={require('./imgs/usuario.png')} style={styles.iconoUsuario} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    },
    header: {
        position: 'absolute',
        alignSelf: 'center',
        height: width*0.08, // y un alto para tu imagen
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:1, 
        top: '7%',
        backgroundColor: '#fff'
    },
    imagenEstilo: {
        position: 'absolute',
        width: width*0.15,  // Puedes definir un ancho
        height: width*0.08, // y un alto para tu imagen
        left: '10%'
    },
    textEstilo:{
        fontSize: width*0.04,
        marginLeft: '30%',
        color: '#FF9F49',
        fontFamily: 'AlegreyaRegular',
    },
    footer: {
        alignSelf: 'center',
        width: '80%',
        height: '7%',
        backgroundColor: '#F1F1F1',
        borderRadius: 25,
        flexDirection: 'row', // Esto asegura que los elementos estén en una fila
        alignItems: 'center', // Esto alineará verticalmente los elementos al centro
        position: 'absolute',
        bottom: '4%',
        zIndex: -1
    },
    iconoHistorial: {
        flex:1,
        marginLeft:'10%',
        height: 30,
        width: 30,
    },
    iconoInicio: {
        flex:1,
        marginLeft:'13%',
        height: 30,
        width: 31,
    },
    iconoUsuario: {
        flex:1,
        marginLeft:'13%',
        marginRight:'10%',
        height: 30,
        width: 30,
    },
});

export default NavigationBar;