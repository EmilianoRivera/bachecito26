import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, ScrollView, } from 'react-native';
//
export default function AvisoPrivacidad({ navigation }) {
  const [Iniciar_isPress, IniciarPressed] = useState(false);
  const IniciarScale = new Animated.Value(1);
  const IniciarPressIn = () => {
    IniciarPressed(true);
    Animated.spring(IniciarScale, {
      toValue: 0.9,
      useNativeDriver: true, //SIEMPRE EN TRUE O NO JALA EN TÉLEFONO
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
  return (
    <View style={styles.Main}>
      <View style={styles.container}>
        <View style={styles.image}>
          <Image source={require('./imgs/icon.png')} style={styles.backgroundImage} />
        </View>

        <View style={styles.form}>
          <View style={styles.components}>
          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.name}>BACHECITO 26</Text>
            <Text style={styles.title}>AVISO DE PRIVACIDAD</Text>
            <Text style={styles.txt}>
            Este aviso de privacidad describe cómo Bachecito 26 recopila, utiliza y protege 
            la información personal de sus usuarios, así como las reglas y políticas que deben 
            seguirse al utilizar nuestra aplicación, de acuerdo con las leyes de protección de 
            datos vigentes en México.
            {'\n'}
            Con la entrada en vigor de la Ley General de Protección de Datos Personales en 
            Posesión de Sujetos Obligados (en lo sucesivo, "Ley General") y los Lineamientos 
            Generales de Protección de Datos Personales para el Sector Público (en lo sucesivo, 
            "Lineamientos Generales"), existe la obligación de atender las disposiciones que 
            dichos ordenamientos establecen, entre ellas el cumplimiento del principio de información, 
            el cual se materializa a través de la puesta a disposición del Aviso de Privacidad. 
            {'\n'}
            {'\n'}
            Este Aviso de Privacidad se emite de conformidad con la Ley de Protección de Datos
            Personales en Posesión de Sujetos Obligados de la Ciudad de México (en adelante, "la Ley") 
            y tiene como objetivo informarle sobre el tratamiento de sus datos personales por parte de 
            GEMMA, con domicilio en Mar Mediterráneo 227, Popotla, 11400 Ciudad de México, CDMX.
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                Datos Personales Recopilados:
                </Text>{'\n'}
            En el proceso de registro y uso de la aplicación móvil, recopilamos los siguientes datos personales:{'\n'}
            {'     '}• Nombre completo{'\n'}
            {'     '}• Fecha de nacimiento{'\n'}
            {'     '}• Dirección de correo electrónico{'\n'}
            {'     '}• Ubicación geográfica{'\n'}
            {'     '}• Acceso a la cámara{'\n'}
            {'     '}• Acceso a contenido multimedia{'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                Finalidad del Tratamiento de Datos:
                </Text>{'\n'}
            Los datos personales que recopilamos serán utilizados para los siguientes fines:{'\n'}
            {'     '}• Permitir el acceso y el uso de {'\n'}{'       '}nuestra aplicación móvil.{'\n'}
            {'     '}• Facilitar la comunicación entre{'\n'}{'      '} GEMMA y el usuario.{'\n'}
            {'     '}• Procesar y gestionar los reportes{'\n'}{'      '} de baches realizados a través de la 
            {'\n'}{'       '}aplicación.{'\n'}
            {'     '}• Enviar notificaciones relacionadas{'\n'}{'      '} con el estado de sus reportes.{'\n'}
            {'     '}• Dar seguimiento a los reportes{'\n'}{'      '} de baches realizados.{'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                Transferencia de Datos:
                </Text>{'\n'}
            Sus datos personales no serán transferidos, compartidos ni vendidos a terceros sin su 
            consentimiento expreso, a menos que así lo requiera la ley o una autoridad competente.
            {'\n'}
            La confidencialidad es nuestra prioridad, y nos comprometemos a proteger sus datos 
            personales de acuerdo con las regulaciones vigentes y a informarle en caso de cualquier 
            excepción a esta norma.
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                Medidas de Seguridad:
                </Text>{'\n'}
            Hemos implementado medidas de seguridad técnicas y organizativas adecuadas para proteger 
            sus datos personales contra el acceso no autorizado, la divulgación, la alteración y la 
            destrucción.
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                Fundamento legal:
                </Text>{'\n'}
            Integral: Artículos 26, 27, 28 y 57 Ley General de Protección de Datos Personales en 
            Posesión de Sujetos Obligados, Artículos 28, 30, 31, 32, 33, 35, 36, 37, 38, 40, 41 
            y 42 de los Lineamientos Generales de Protección de Datos Personales para el Sector Público.
            {'\n'}
            Artículos 11, 14, 15, 16 y 19 de los Lineamientos que establecen los parámetros, modalidades 
            y procedimientos de portabilidad de datos personales (en lo sucesivo Lineamientos de Portabilidad).
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                Derechos ARCO:
                </Text>{'\n'}
            De acuerdo con la Ley, usted tiene derecho a:{'\n'}
            {'     '}• Acceder a sus datos personales.{'\n'}
            {'     '}• Rectificar sus datos en caso de ser {'\n'}{'       '}inexactos o incompletos.{'\n'}
            {'     '}• Cancelar sus datos cuando{'\n'}{'      '} considere que no son necesarios{'\n'}{'      '} para los fines establecidos en {'\n'}{'       '} este Aviso de Privacidad.{'\n'}
            {'     '}• Oponerse al tratamiento de sus {'\n'}{'       '}datos para fines específicos.{'\n'}
            {'\n'}
            Para ejercer cualquiera de los derechos ARCO, puede ponerse en contacto con nosotros a través de (correo de la empresa), proporcionando la siguiente información:
            {'\n'}
            {'     '}• Nombre completo{'\n'}
            {'     '}• Correo electrónico de contacto.{'\n'}
            {'     '}• Descripción de su solicitud.{'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                Negativa del consentimiento:
                </Text>
            {'\n'}
            Con el propósito de llevar a cabo estas finalidades y posibles transferencias, requerimos de su 
            consentimiento. Si usted está en desacuerdo con los términos y condiciones de privacidad expresados 
            en este aviso y opta por no otorgar su consentimiento para que sus datos sean recopilados o 
            utilizados de la manera establecida anteriormente, se le sugiere no utilizar los servicios proporcionados 
            dentro de Bachecito 26. Al no dar su consentimiento se comprende que existe la posibilidad de que no 
            pueda acceder a ciertas funciones de la aplicación.
            {'\n'}
            En caso de que no desee que sus datos personales sean procesados con dichos fines o transferidos después 
            de haber aceptado el aviso de privacidad, es decir, que cambie de opinión sobre el manejo de sus datos, 
            le brindamos la oportunidad de expresar su negativa al momento en que se le proporcione el formulario 
            correspondiente.
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                Cambios en el Aviso de Privacidad:
                </Text>
            {'\n'}
            Nos reservamos el derecho de realizar cambios o actualizaciones a este Aviso de Privacidad para cumplir 
            con cambios en la legislación o para reflejar las actualizaciones en nuestras prácticas de manejo de datos.
            La versión más reciente estará disponible dentro de nuestra aplicación.
            {'\n'}
            Al registrarse y utilizar nuestra aplicación móvil, usted acepta los términos y condiciones establecidos 
            en este Aviso de Privacidad.
            {'\n'}
            Si tiene alguna pregunta o inquietud sobre este Aviso de Privacidad o el manejo de sus datos personales, 
            no dude en ponerse en contacto con nosotros.
            {'\n'}
            {'\n'}
            {'\n'}
            <Text style={styles.title2}>TÉRMINOS Y CONDICIONES</Text>
            {'\n'}
            {'\n'}
            Por favor, lea atentamente los siguientes términos y condiciones antes de utilizar nuestra aplicación móvil. 
            Al acceder y utilizar la aplicación, usted acepta cumplir con estos términos y condiciones así como dar 
            autorización al manejo y almacenamiento de sus datos personales solicitados para el funcionamiento de la 
            aplicación.
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                1. Uso Aceptable:
                </Text>
            {'\n'}
            Usted se compromete a utilizar la aplicación de manera responsable y de acuerdo con todas las leyes y regulaciones aplicables.
            {'\n'}
            No está permitido utilizar la aplicación con fines ilegales o fraudulentos. 
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                2. Registro de Usuario:
                </Text>
            {'\n'}
            Para utilizar ciertas funciones de la aplicación, debe crear una cuenta y proporcionar información precisa y actualizada.
            {'\n'}
            Es su responsabilidad mantener la confidencialidad de su contraseña y cuenta.
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                3. Reportes de Baches:
                </Text>
            {'\n'}
            Usted acepta que los reportes de baches que presente a través de la aplicación deben ser verídicos.
            {'\n'}
            La aplicación se utiliza para fines de reporte y seguimiento de baches en vías secundarias de la alcaldía Azcapotzalco.
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                4. Propiedad Intelectual:
                </Text>
            {'\n'}
            Todos los derechos de propiedad intelectual relacionados con la aplicación, incluyendo software, diseño y contenido, son propiedad de GEMMA.
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                5. Privacidad y Protección de Datos:
                </Text>
            {'\n'}
            Sus datos personales se manejan de acuerdo con nuestro Aviso de Privacidad, el cual puede revisar en la aplicación.
            {'\n'}
            Usted acepta recibir notificaciones y comunicaciones relacionadas con su cuenta y el uso de la aplicación.
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                6. Limitación de Responsabilidad:
                </Text>
            {'\n'}
            La aplicación se proporciona "tal cual" y GEMMA  no garantiza su funcionamiento ininterrumpido o libre de errores.
            {'\n'}
            GEMMA no será responsable por daños directos o indirectos derivados del uso de la aplicación.
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                7. Cambios en los Términos y Condiciones:
                </Text>
            {'\n'}
            Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Se le notificará sobre cualquier cambio importante realizado.
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                8. Terminación de Cuenta:
                </Text>
            {'\n'}
            Podemos suspender o dar de baja su cuenta en caso de incumplimiento de estos términos y condiciones así como por cualquier otra razón a nuestra discreción.
            {'\n'}
            {'\n'}
            <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                9. Precaución con el uso de la aplicación:
                </Text>
            {'\n'}
            GEMMA se deslinda de cualquier tipo de accidente que el usuario pueda sufrir durante el uso de BACHECITO 26, es completa responsabilidad del usuario tomar las 
            precauciones necesarias al utilizar el télefono celular en las vías transitadas por cualquier tipo de vehículos y personas.
            {'\n'}
            {'\n'}
                <Text style={{ fontFamily:'BalooSemiBold', fontSize:17}} onPress={() => navigation.navigate('AvisoPrivacidad')}>
                10. Ley Aplicable:
                </Text>
            {'\n'}
            Estos términos y condiciones se rigen por las leyes de la Ciudad de México y cualquier disputa se resolverá en los tribunales de la Ciudad de México. Si tiene alguna pregunta o inquietud con respecto a estos términos y condiciones, comuníquese con nosotros a través de somos.gemma.01@gmail.com
            {'\n'}
            {'\n'}
                <Text style={styles.txt2}>
                Fecha de última actualización: 09/10/2023 {'                                           '}
                GEMMA{'\n'}
                Mar Mediterráneo 227, Popotla, 11400 Ciudad de México, CDMX. {'\n'}  
                somos.gemma.01@gmail.com {'\n'}55 8412 8938
                </Text>
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate('TerminosYCondiciones')}
              onPressIn={IniciarPressIn}
              onPressOut={IniciarPressOut}
              style={[
                styles.btn_Iniciar,
                Iniciar_isPress && styles.btn_Iniciar_Press,
                { transform: [{ scale: IniciarScale }] },
              ]}
            >
              <Text style={[styles.btnTXT_Iniciar, Iniciar_isPress && styles.btnTXT_Iniciar_Press]}>
                Volver
              </Text>
            </TouchableOpacity>
          </ScrollView>
          </View>
        </View>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  Main: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },

  //Formulario
  container: {
    width: '80%',
    height: '85%',
    backgroundColor: '#fff',
    top: '5%',
    borderRadius: 15,
    zIndex:0, 
    position: 'absolute',
  },

  image: {
    zIndex: 1, 
    alignContent: 'center',
    alignItems: 'center',
    with: '100%',
    height: '15%',
    top: '7.5%'
  },
  backgroundImage: {
    position: 'absolute',
    zIndex: 1, 
    width: '35%',
    height: '100%'
  },

  form: {
    width: '100%',
    height: '85%',
    backgroundColor: '#F1F1F1',
    top: '15%',
    borderRadius: 20,
    zIndex:0,
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center'
  },

  components: {
    width: '100%',
    height: '85%',
    top: '12%',
    backgroundColor: '#F1F1F1',
    position: 'absolute',
    textAlign:'justify',
    paddingLeft: '10%',
    paddingRight: '10%'
  },
  name: {
    color: '#FF9F49',
    fontFamily: 'AlegreyaBold',
    fontSize: 30,
    textAlign: 'center',
    width: '100%',
    marginBottom: '5%',
  },

  title: {
    color: '#FFB72C',
    fontFamily: 'NunitoSemiBoldItalic',
    fontSize: 22,
    textAlign: 'left',
    width: '100%',
    marginBottom: '5%',
  },
  title2: {
    color: '#FFB72C',
    fontFamily: 'NunitoSemiBoldItalic',
    fontSize: 20,
    textAlign: 'left',
    width: '100%',
    marginBottom: '5%',
  },
  txt:{
    color: '#1E1E1E',
    fontFamily: 'Baloo',
    fontSize: 16,
    lineHeight:18,
    textAlign: 'justify',
  },

  txt2:{
    color: '#FF7A3E',
    fontFamily: 'BalooSemiBold',
    fontSize: 16,
    lineHeight:18,
  },

  btn_Iniciar: /*Iniciar */ {
    backgroundColor: '#FFB72C',
    paddingTop: 20,
    width: 155,
    height: 70,
    borderRadius: 45,
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    position: 'relative', 
    alignSelf: 'center',
    marginBottom: '20%',
    marginTop: '-10%'
  },

  btnTXT_Iniciar: /*Iniciar */ {
    color: '#fff',
    fontSize: 20,
    fontFamily: "Hind"
  },

  btn_Iniciar_Press: /*Iniciar */ {
    backgroundColor: '#FF4D35',
  },

  btnTXT_Iniciar_Press:/*Iniciar */ {
    color: 'white',
  },
});