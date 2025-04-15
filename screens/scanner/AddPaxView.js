// ./frontend/screens/scanner/ScannerMain.js

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthenticationContext";
import Toast from "react-native-toast-message";
import {
  Keyboard,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image,
  Pressable,
} from "react-native";
import globalStyles from "../../assets/styles/Styles";
import { Heading } from "../../components/CommonComponents";
import { ButtonAdd } from "../../components/Buttons";
import useItemStore from "../../store/useItemStore";
import regionsAndCities from "../../components/Sorted-maakunnat.json";
import placeholderImage from "../../assets/images/kiertis-icon.png";
import { storage } from "../../appwrite";
import { Role, Permission } from "react-native-appwrite";
import * as ImagePicker from "expo-image-picker";

export const AddPaxView = () => {
  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    city: "",
  });
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pickedImage, setPickedImage] = useState(null);
  const allCities = Object.values(regionsAndCities).flat();
  const navigation = useNavigation();
  const { user } = useAuth();
  const addPax = usePaxStore((state) => state.addPax);
  const placeholderImageUrl = Image.resolveAssetSource(placeholderImage).uri;

  const handleAddPax = async () => {
    if (!itemData.city) {
      Toast.show({
        type: "error",
        text1: "Valitse paikkakunta ennen tallentamista",
      });
      return;
    }

    console.log("pickedImage", pickedImage);

    try {
      let uploaded = await storage.createFile(
        "images",
        "unique()",
        pickedImage,
        [Permission.read(Role.any())]
      );

      const url = storage.getFileView("images", uploaded.$id);
      console.log("Uploaded file:", uploaded);
      console.log("File URL:", url);

      await addPax({
        userId: user.id,
        itemname: itemData.name,
        itemdescription: itemData.description,
        city: itemData.city,
        imageUrl: placeholderImageUrl,
        image: url.href,
      });
      Toast.show({ type: "success", text1: "Julkaisu lisätty!" });

      navigation.goBack();
    } catch (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: "Virhe henkilöä lisättäessä",
        text2: error.message,
      });
    }
  };

  let pickFile = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.assets) return;
    console.log("Result:", result);

    const asset = result.assets[0];
    if (!result.canceled) {
      let image = {
        name: asset.fileName,
        type: asset.mimeType,
        uri: asset.uri,
        size: asset.fileSize,
      };
      setPickedImage(image);
    }
    console.log("Picked images:", pickedImage);
  };

  const handleChange = (name, value) => {
    setItemData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "city") handleCityInputChange(value);
  };

  const handleCityInputChange = (input) => {
    if (input.trim() === "") {
      setFilteredCities([]);
      setShowSuggestions(false);
    } else {
      const filtered = allCities.filter((c) =>
        c.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowSuggestions(true);
    }
  };

  const handleCitySelection = (selectedCity) => {
    setItemData((prevData) => ({ ...prevData, city: selectedCity }));
    setFilteredCities([]);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        <Heading title="Lisää uusi henkilö" />
        <PaxForm
          itemData={itemData}
          handleChange={handleChange}
          onPress={handleAddPax}
          handleCityInputChange={handleCityInputChange}
          showSuggestions={showSuggestions}
          filteredCities={filteredCities}
          handleCitySelection={handleCitySelection}
          pickedImage={pickedImage}
          pickFile={pickFile}
        />
      </ScrollView>
    </View>
  );
};

const ItemForm = ({
  itemData,
  handleChange,
  onPress,
  handleCitySelection,
  showSuggestions,
  filteredCities,
  pickedImage,
  pickFile,
}) => {
  return (
    <>
      <TextInput
        style={globalStyles.textPaxTitle}
        placeholder="ID-numero"
        value={paxData.number}
        onChangeText={(value) => handleChange("number", value)}
      />
      <TextInput
        style={globalStyles.textPaxTitle}
        placeholder="Sukunimi"
        value={paxData.lastname}
        onChangeText={(value) => handleChange("lastname", value)}
      />
      <TextInput
        style={globalStyles.textPaxTitle}
        placeholder="Etunimi"
        value={paxData.firstname}
        onChangeText={(value) => handleChange("firstname", value)}
      />
      <TextInput
        style={globalStyles.textPaxTitle}
        placeholder="Sotilasarvo"
        value={paxData.rank}
        onChangeText={(value) => handleChange("rank", value)}
      />
      <TextInput
        style={globalStyles.textItemTitle}
        placeholder="Paikkakunta (maahantulopiste)"
        value={paxData.city}
        onChangeText={(value) => handleChange("city", value)}
      />
      {showSuggestions && (
        <ScrollView style={globalStyles.suggestionsList}>
          {filteredCities.map((pax, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCitySelection(pax)}>
              <Text style={globalStyles.autocompletePax}>{pax}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <ButtonAdd title="Tallenna" onPress={onPress} color="#4CAF50" />
    </>
  );
};
