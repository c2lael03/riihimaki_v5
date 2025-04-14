// ./frontend/screens/account/AccountComponents.js

import React, { useContext } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { auth } from "../../services/firebaseConfig";
import { Heading, BasicSection } from "../../components/CommonComponents";
import { ButtonNavigate } from "../../components/Buttons.js";
import {
  DeleteAccountOfThisUser,
  LogoutFromThisUser,
  MessagingSystem,
  AccountSystem,
  ChangeUsernameOfThisUser,
} from "./FindUser";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../../assets/styles/Styles";
import { IconChat, IconMyItemList, IconNewDocument, IconMyQueueList, IconLogout, IconRemoveUser } from '../../components/Icons';
import { signOut } from "firebase/auth";

export const AccountLoggedIn = () => {
  const authState = useContext(AuthenticationContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log(`UID: ${authState.user.id} uloskirjautui`);
      navigation.navigate("AccountMain");
    } catch (error) {
      console.error("Virhe uloskirjautumisessa:", error);
      Alert.alert(
        "Virhe",
        "Uloskirjautumisessa tapahtui virhe. Yritä uudelleen."
      );
    }
  };

  // handleUsernameChange

  if (!authState) {
    return <Text>Ei käyttäjätietoja saatavilla.</Text>;
  }

  return (
    <ScrollView style={globalStyles.homeScreenContainer} contentContainerStyle={{ padding: 8 }}>

      <Heading title="Tilin hallinta" />
      <View style={globalStyles.viewIcons}>

      <View style={[globalStyles.viewIcons, { flexDirection: 'column', alignItems: 'stretch' }]}>
        <TouchableOpacity style={globalStyles.navyBlueContainer} onPress={() => navigation.navigate('AccountMaintain')}>
          <IconRemoveUser size={24} color={'#ffffff'} />
          <Text style={globalStyles.whiteText}>Poista tili</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={globalStyles.navyBlueContainer} onPress={() => navigation.navigate('AccountUsername')}>
          <IconRemoveUser size={24} color={'#ffffff'} />
          <Text style={globalStyles.whiteText}>Vaihda käyttäjänimi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.navyBlueContainer} onPress={handleLogout}>
          <IconLogout size={24} color={'#ffffff'} />
          <Text style={globalStyles.whiteText}>Kirjaudu ulos</Text>
        </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
};

export const AccountMaintain = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <DeleteAccountOfThisUser />
    </ScrollView>
  );
};

//käyttäjänimen koodia
export const AccountUsername = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <ChangeUsernameOfThisUser />
    </ScrollView>
  );
};
