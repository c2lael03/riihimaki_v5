// ./frontend/screens/items/UserQueues.js

/*  EAS (Expo Application Services) mahdollistaa natiivimoduulien käytön Managed Workflow'ssa: EAS on Googlen 
    pilvipalvelu, joka auttaa sinua rakentamaan (build) omia versioita Expo-sovelluksestasi, jotka sisältävät 
    tarvitsemasi natiivimoduulit. Tämä yhdistää Managed Workflow'n helppouden natiivimoduulien joustavuuteen.

    Google ML Kit ja EAS: Jotta voit käyttää Google ML Kitiä (kuten @react-native-ml-kit/text-recognition) 
    Expo-projektissasi, sinun on käytettävä EAS Build -palvelua luodaksesi custom buildit Android- ja 
    iOS-sovelluksistasi, jotka sisältävät nämä natiivimoduulit.

    Miten teet sen EAS:n avulla (yleisellä tasolla):
    - Asenna tarvittavat natiivimoduulit: Olet jo asentanut @react-native-ml-kit/text-recognition-kirjaston 
    (npm install @react-native-ml-kit/text-recognition).
    - Konfiguroi Expo-projektisi EAS Buildia varten: Sinulla täytyy olla eas.json-tiedosto projektisi 
    juurikansiossa. Jos sinulla ei ole, voit luoda sen komennolla: 
      Bash
        npx eas init                      // jos ei toimi, niin sitten seuraava
        npm install -g @expo/eas-cli      // Sinun täytyy asentaa @expo/eas-cli globaalisti npm:n avulla. Suorita tämä komento pääteikkunassasi (ei välttämättä projektin kansiossa, jotta se asennetaan globaalisti):
        npx expo install expo-camera      // ihan vain jotta saat luvan käyttää kameraa

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
  //const [maahantulolupaStatus, setMaahantulolupaStatus] = useState(null); // Uusi tila luvan statukselle

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
      // const scannedId = result.text.trim(); // Määritellään täällä
      setRecognizedText(result.text);
      console.log('Tunnistettu teksti:', result.text);
      // Täällä voit suodattaa vain numerosarjat tarvittaessa
      //tarkistaMaahantulolupa(scannedId); // Kutsu funktiota tarkistamaan lupa
    } catch (error) {
      console.error('Tekstintunnistus epäonnistui:', error);
      //setMaahantulolupaStatus('virhe'); // Aseta status virheeksi tunnistuksessa
    }
  };
  // Yllä olevat Skanneritoiminnallisuudet koodit päättyy.
  
  /*
  const tarkistaMaahantulolupa = async (personId) => {
    // Tässä kohtaa tulisi tehdä API-kutsu tai kysely tietokantaan
    // tarkistaaksesi, onko annetulla personId:llä voimassaolevaa maahantulolupaa.
    // Oletetaan, että on funktio tai API-endpoint tätä varten.

    // Alla on simuloitu vastaus. Korvaa tämä oikealla logiikalla.
    const onkoLupaVoimassa = Math.random() > 0.5; // Simuoi satunnaista tulosta

    if (onkoLupaVoimassa) {
      setMaahantulolupaStatus('ok');
    } else {
      setMaahantulolupaStatus('ei_voimassa');
    }
  };
  */ //tietokantayhteys maahantulolupaan


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



/*
                {/* Maahantulolupa status -laatikko */ /*}
                {maahantulolupaStatus && (
                  <View style={[
                    styles.lupaContainer,
                    maahantulolupaStatus === 'ok' ? styles.lupaOk : (maahantulolupaStatus === 'ei_voimassa' ? styles.lupaEiVoimassa : styles.lupaVirhe),
                  ]}>
                    <Text style={styles.lupaText}>
                      {maahantulolupaStatus === 'ok'
                        ? 'Maahantulolupa ok.'
                        : (maahantulolupaStatus === 'ei_voimassa'
                          ? 'Ei voimassaolevaa maahantulolupaa'
                          : 'Luvantarkistuksessa tapahtui virhe')}
                    </Text>
                  </View>
                )}
        */