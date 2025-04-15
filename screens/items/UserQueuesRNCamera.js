// ./frontend/screens/items/UserQueuesRNCamera.js
// Tämä koodi toimi EXPO:lla muuten, mutta se ei osaa tunnistaa kameraa, kun painaa "Tunnista teksti"-nappulaa.
/* Selvä, virheilmoitus "(NOBRIDGE) ERROR Virhe kuvan ottamisessa: Camera handle cannot be null" viittaa siihen, 
   että RNCamera-komponentin sisäinen kameraobjekti (handle) ei ole vielä kunnolla alustettu, kun yrität ottaa 
   kuvan. Tämä on tyypillinen ongelma, kun natiivimoduuleja yritetään käyttää Expo Go:ssa ilman custom buildia.

    Vahvistus aiemmalle: Vaikka näkymäsi latautuu Expo Go:ssa, se ei tarkoita, että natiivimoduulit toimivat 
    oikein. Expo Go ei sisällä valmiiksi react-native-camera-moduulia.

    Miksi "Camera handle cannot be null" -virhe ilmenee Expo Go:ssa?

    Natiivimoduulin puuttuminen: Koska react-native-camera on natiivimoduuli, Expo Go ei tiedä, miten se tulisi 
    alustaa ja käyttää. Siksi cameraRef.current voi olla olemassa React-komponenttina, mutta sen natiivi-instanssi 
    (joka hallitsee kameran toimintaa) on null.

    Ainoat ratkaisut tähän ongelmaan Expo-ympäristössä natiivimoduulien kanssa ovat:
    - Luo custom dev client: Kuten aiemmin mainitsin, sinun täytyy rakentaa oma Expo Go -sovelluksen versio, joka 
    sisältää react-native-camera-moduulin. Tämä on ainoa tapa saada natiivimoduulit toimimaan Expo-ympäristössä.
    - Vaihda Expo-yhteensopivaan kamera-kirjastoon: Etsi Expo-moduuli tai JavaScript-kirjasto, joka tarjoaa 
    kameratoiminnallisuuden ilman natiivikoodin linkittämistä. Expo Camera API (expo-camera) on tähän tarkoitukseen 
    suunniteltu.

    Poista react-native-camera:
        Bash
            npm uninstall react-native-camera

    Asenna expo-camera:
        Bash
            npx expo install expo-camera
    
    Päivitä UserQueues.js-komponentti käyttämään expo-cameraa:
        Tässä on esimerkki, miten voit käyttää expo-cameraa tekstintunnistuksen kanssa (huomaa, että 
        @react-native-ml-kit/text-recognition ei myöskään toimi suoraan Expo Go:ssa):
        ....

    Mutta jos ei sekoiteta EXPOA tähän niin muista tehdä asennukset:
        Bash
            npm install @react-native-ml-kit/text-recognition rn-mlkit-object-detection
            npm install react-native-vision-camera      //virheitä...
            npm install react-native-camera
            npx react-native link react-native-camera
            npx react-native run-android
*/

//import { useNavigation } from "@react-navigation/native";
import useUserData from "../../hooks/useUserData";
//import React from "react";
import { BasicSection, Heading } from "../../components/CommonComponents";
//import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import globalStyles from "../../assets/styles/Styles";
//import Icon from "react-native-vector-icons/Ionicons";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { ItemCard } from "./ItemCard";

//Skanneritoiminnallisuudet koodit:
import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RNCamera } from 'react-native-camera'; // Jos käytät react-native-cameraa
import TextRecognition from '@react-native-ml-kit/text-recognition';
//import { globalStyles } from '../../assets/styles/Styles'; // Oletetaan, että sinulla on globaalit tyylit


export const UserQueues = () => {
  const navigation = useNavigation();
  const { queues, takersError, takersLoading } = useUserData();

  //alla Skanneritoiminnallisuudet koodit:
  const cameraRef = useRef(null);
  const [recognizedText, setRecognizedText] = useState('');

  const takePictureAndRecognize = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: false };
      try {
        const data = await cameraRef.current.takePictureAsync(options);
        console.log('Kuvan polku:', data.uri);
        handleTextRecognition(data.uri);
      } catch (error) {
        console.error('Virhe kuvan ottamisessa:', error);
      }
    }
  };

  const handleTextRecognition = async (imagePath) => {
    try {
      const result = await TextRecognition.recognize(imagePath);
      setRecognizedText(result.text);
      console.log('Tunnistettu teksti:', result.text);
      // Täällä voit suodattaa vain numerosarjat tarvittaessa
    } catch (error) {
      console.error('Tekstintunnistus epäonnistui:', error);
    }
  };
  // Yllä olevat Skanneritoiminnallisuudet koodit päättyy.

  return (
    <View style={globalStyles.homeScreenContainer}>
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Skannaa ID-numero" />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={globalStyles.iconContainer}
      >
        <View style={globalStyles.iconTextContainer}>
          <Icon name="arrow-back" size={30} color="#000" />
          <Text style={globalStyles.iconText}>Takaisin</Text>
        </View>
      </TouchableOpacity>

      <ErrorView error={takersError} />

      <View style={globalStyles.container}>
        {queues.length > 0 && !takersLoading ? (
          queues.map((item) => <ItemCard item={item} key={item.id} />)
        ) : (
          <BasicSection>
            <Text>Ei skannauksia tälle päivää</Text>
          </BasicSection>
        )}
        {takersLoading && <LoadingIndicator />}
        <Text style={{ textAlign: "center", marginTop: 16 }}>
          Tähän tulee skannauskuvaruutu
        </Text>




        <RNCamera
          ref={cameraRef}
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          androidCameraPermissionOptions={{
            title: 'Kameran käyttöoikeus',
            message: 'Sovellus tarvitsee luvan käyttää kameraasi tekstin tunnistamiseen.',
            buttonPositive: 'Ok',
            buttonNegative: 'Peruuta',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Äänen tallennusoikeus',
            message: 'Sovellus tarvitsee luvan tallentaa ääntä.',
            buttonPositive: 'Ok',
            buttonNegative: 'Peruuta',
          }}
        />
        <TouchableOpacity onPress={takePictureAndRecognize} style={styles.captureButton}>
          <Text style={styles.captureButtonText}>Tunnista Teksti</Text>
        </TouchableOpacity>
        {recognizedText ? (
          <Text style={styles.recognizedText}>Tunnistettu: {recognizedText}</Text>
        ) : (
          <Text style={styles.infoText}>Ota kuva tunnistaaksesi tekstiä</Text>
        )}



      </View>
    </ScrollView>
    </View>
  );
};

const ErrorView = ({ error }) =>
  error ? (
    <BasicSection>
      <Text>Virhe: {error.message}</Text>
    </BasicSection>
  ) : null;


    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  captureButtonText: {
    fontSize: 14,
  },
  recognizedText: {
    fontSize: 16,
    color: 'white',
    margin: 20,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: 'grey',
    margin: 20,
    textAlign: 'center',
  },
});