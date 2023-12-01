import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as React from 'react';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_KEY } from '@env';
import { useRoute } from '@react-navigation/native';

const bacheImage = require('./assets/marcador.png');
const { width, height } = Dimensions.get('window');

const getFormattedAddress = async (latitude, longitude, apiKey) => {
  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Error al obtener la dirección desde las coordenadas');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;
      const city = addressComponents.find(component => component.types.includes('locality'));

      if (city && city.long_name.includes('Ciudad de México')) {
        const formattedAddress = data.results[0].formatted_address;
        console.log('Dirección:', formattedAddress);
        return formattedAddress;
      } else {
        Alert.alert('¡Lo sentimos!','Bachecito 26 está diseñado para el reporte de baches dentro de la CDMX, no puedes reportar baches en otro lugar');
        // Aquí puedes devolver las coordenadas predeterminadas o realizar otra acción
      }
    } else {
      throw new Error('No se encontró ninguna dirección para las coordenadas dadas.');
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};



const Mapita = ({ navigation,onDireccionChange}) => {
  const route = useRoute();
  const userData = route.params?.userData;
  const mapRef = React.useRef(null);

  const [origin, setOrigin] = React.useState({
    latitude: 19.45307972757693,
    longitude: -99.17540187695712,
  });

  const [originAddress, setOriginAddress] = React.useState('');

  React.useEffect(() => {
    getLocationPermission();
  }, []);

  async function getLocationPermission() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
  
      if (status !== 'granted') {
        throw new Error('Permission denied');
      }
  
      const location = await Location.getCurrentPositionAsync({});
      const current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
  
      setOrigin(current);
  
      // Obtener dirección para la posición actual
      const originAddress = await getFormattedAddress(current.latitude, current.longitude, GOOGLE_MAPS_KEY);
      setOriginAddress(originAddress);
  
      // Ajustar el mapa al usuario una vez que se obtiene la dirección
      if (mapRef.current) {
        mapRef.current.fitToCoordinates([current], {
          edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
          animated: true,
        });
      }
    } catch (error) {
      console.error('Error al obtener la ubicación:', error.message);
      // Puedes mostrar un mensaje de error al usuario
    }
  }  

  React.useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const originAddress = await getFormattedAddress(origin.latitude, origin.longitude, GOOGLE_MAPS_KEY);
        setOriginAddress(originAddress);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchAddresses();
  }, [origin.latitude, origin.longitude]);

 
  
  const handleReportPress = () => {
    // Crear un objeto con las partes de la dirección separada
    const direccionSeparada = originAddress;
  
    if (direccionSeparada) {
      onDireccionChange(originAddress);
      // Navegar al componente Reporte y pasar la dirección separada como parámetro
      navigation.navigate('reporte', { direccion: originAddress, userData});
    } else {
      console.log('No se puede hacer el reporte debido al formato de dirección incorrecto.');
      // Aquí puedes manejar el caso en el que la dirección no tenga el formato esperado
    }
  };

 // Reemplaza tu función handleMarkerDragEnd con esta:
const handleMarkerDragEnd = (event) => {
  setOrigin(event.nativeEvent.coordinate);
  if (mapRef.current) {
    const newRegion = {
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
      latitudeDelta: 0.0006, // Ajusta estos valores según tu preferencia de zoom
      longitudeDelta: 0.0006, // Ajusta estos valores según tu preferencia de zoom
    };
    mapRef.current.animateToRegion(newRegion, 500); // 500 es la duración de la animación en milisegundos
  }
};

  
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={mapStyle}
      >
        <Marker
          draggable
          coordinate={origin}
          onDragEnd={handleMarkerDragEnd}
        >
          <Image source={bacheImage} style={styles.markerImage} />
        </Marker>

        <MapViewDirections origin={origin} apikey={GOOGLE_MAPS_KEY} />
      </MapView>

      <Text style={styles.addressText}>Origen: {originAddress}</Text>

      <TouchableOpacity
  style={[styles.reportButton, { top: height * 0.01 }]} // Ajusta la posición del botón
  onPress={handleReportPress}
>
  <Text style={styles.buttonText}>Hacer reporte</Text>
</TouchableOpacity>

    </View>
  );
};
const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#ebe3cd', // Color del fondo del mapa
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#523735', // Color del texto en el mapa
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f1e6', // Color del borde del texto en el mapa
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#c9b2a6', // Color de las fronteras administrativas
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#dcd2be', // Color de las fronteras de parcelas de tierra administrativas
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae', // Color de puntos de interés
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#93817c', // Color del texto de puntos de interés
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#a5b076', // Color de parques
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#447530', // Color del texto en parques
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f1e6', // Color de carreteras
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#fdfcf8', // Color de carreteras arteriales
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f8c967', // Color de autopistas
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#e9bc62', // Color del borde de autopistas
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e98d58', // Color de acceso controlado a autopistas
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#db8555', // Color del borde de acceso controlado a autopistas
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#806b63', // Color del texto de carreteras locales
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae', // Color de líneas de tránsito
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8f7d77', // Color del texto de líneas de tránsito
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#ebe3cd', // Color del borde del texto de líneas de tránsito
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae', // Color de estaciones de tránsito
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#b9d3c2', // Color de agua
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#92998d', // Color del texto en agua
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#ebe3cd', // Color del borde del texto en agua
      },
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  map: {
    width: '100%',
    height: '70%',
  },
  markerImage: {
    width: 30,
    height: 30,
  },
  addressText: {
    marginTop: 10,
    left:'auto'
  },
  reporte: {
    position: 'absolute',
    top: 20,
    right: 20,
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
  }
});

export default Mapita;