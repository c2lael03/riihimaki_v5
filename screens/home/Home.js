// ./frontend/screens/home/Home.js

import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthenticationContext";
import { ScrollView, Text, View } from "react-native";
import { Heading } from "../../components/CommonComponents";
import AuthScreen from "../auth/AuthScreen.js";
import globalStyles from "../../assets/styles/Styles.js";
import { Image } from "react-native";

const Home = () => {
  const authState = useAuth();
    const [imageSource, setImageSource] = useState(require('../../assets/images/tehostekuva1.jpg'));

    useEffect(() => {
      const random = Math.random();
      if (random < 0.6) {
        setImageSource(require('../../assets/images/tehostekuva2.jpg'));
      } else {
        setImageSource(require('../../assets/images/tehostekuva3.jpg'));
      }
    }, []);

    return (
      <ScrollView style={globalStyles.homeScreenContainer} contentContainerStyle={{ padding: 8 }}>
          {authState ? (
            <>
              <View style={globalStyles.separatorThin} />
                <Text style={globalStyles.defText, globalStyles.whiteText}>
                  {`Olet kirjautunut käyttäjänä:`}
                </Text>
                <Text style={globalStyles.defTitle, globalStyles.whiteText}>
                  {`${authState.user.username}`}
                </Text>
              <View style={globalStyles.separatorBold} />

              <Image 
                source={imageSource}
                style={globalStyles.image} 
                resizeMode="contain"
              />
           </>
        ) : (
            <AuthScreen />
        )}
    </ScrollView>
    );
};

export default Home;
