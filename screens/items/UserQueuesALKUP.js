// ./frontend/screens/items/UserQueues.js

import { useNavigation } from "@react-navigation/native";
import useUserData from "../../hooks/useUserData";
import React from "react";
import { BasicSection, Heading } from "../../components/CommonComponents";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import globalStyles from "../../assets/styles/Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { ItemCard } from "./ItemCard";

export const UserQueues = () => {
  const navigation = useNavigation();
  const { queues, takersError, takersLoading } = useUserData();

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