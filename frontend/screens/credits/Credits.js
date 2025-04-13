// ./frontend/screens/credits/Credits.js

import React, { } from 'react';
import { ScrollView } from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';

const Credits = () => {

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Mikä on IDIS?" />

      <BasicSection>
        IDIS on innovatiivinen ID-Skanenrisovellus, joka tekee henkilöiden tunnistamisesta ja lupien selvittämisestä helppoa ja nopeaa! {"\n\n"} 

        Tavoitteemme on auttaa Puolustusvoimien henkilöstöä tunnistamaan arjenvälineillä henkilöitä ja saamaan nopeasti vahvistuksen 
        tietokannasta, onko kyseisellä henkilöllä voimassaolevaa maahatulo- tai vierailulupaa alueelle. {"\n\n"}
        
        Jatkossa kehitämme sovellusta tunnistamaan myös ajoneuvojen rekisterinumerot sekä aseiden numerot. {"\n\n"}
        Tutustu palvelun käyttöohjeisiin ja aloita numerosarjojen tunnistaminen mobiiliskannerillamme jo tänään! {"\n\n"}
      </BasicSection>

      <Heading title="Käyttöohjeet" />

      <BasicSection>
        Kirjautunut käyttäjä voi tehdä
        {"\n\n"}
        
        Kirjautunut käyttäjä voi tehdä ilmoituksen, joka tallentuu tietokantaan. Näin palvelun 
        rekisteröityneille käyttäjille saadaan päivitettyä tiedot joukon mukana esimerkiksi 
        maahansaapuneista henkilöistä ja ajoneuvoista.
        {"\n\n"}
        
        Ilmoituksessa annetaan tiedot tuotteesta, sen sijainti ja mahdollinen kuva tuotteesta. {"\n"}
        Listautumiset julkaisuihin asettavat käyttäjän jonoon tuotteen saamiseksi. Ensimmäisellä sijalla oleva käyttäjä on noutovuorossa ja saa viestiyhteyden ilmoittajaan sopiakseen noudosta. {"\n\n"}
        Varaus on voimassa 6h. Mikäli ilmoittaja ei ole varauksen voimassaoloaikana merkinnyt tuotetta luovutetuksi, siirtyy noutovuoro se seuraavalle käyttäjälle jonossa. {"\n\n"}
        
        Ilmoitukset vanhenevat automaattisesti viikon kuluttua julkaisusta ja poistetaan palvelusta. {"\n"}
        Käyttäjä voi tarvittaessa julkaista ilmoituksensa uudelleen, mutta hänen tulee antaa tuotetiedot uudelleen. {"\n\n"}
      </BasicSection>

      <Heading title="Sovelluksen tausta" />
      <BasicSection>
          IDIS on Oulun Ammattikorkeakoulun tietotekniikan opiskelijan kehittämä sovellus, joka 
          kuuluu opintojaksoon Yrityslähtöinen sovellusprojekti. Sovellus on kehitetty osana 
          PVPELOGOS digitaalityöryhmän konenäköhanketta opiskelijatyönä. {"\n\n"}

          Sovelluksen kehittäjä: {"\n\n"}
          • Elina Lappalainen {"\n"}
      </BasicSection>

      <Heading title="Assettien käyttö" />
      <BasicSection>
        Palveluun sisällytetyt assetit, mm. kuvat ja fontit ovat tekijänoikeudellisesti suojattuja.{"\n"}
        Kiitos kaikkille assettien tarjoajille asseteista tämän projektin hyväksi.{"\n\n"}
      </BasicSection>

    </ScrollView>
  );
};

export default Credits;
