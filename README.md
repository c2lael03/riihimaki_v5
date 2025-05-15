# IDIS-sovellus 

---------------------------------

### Tekijä
- Elina Lappalainen ([c2lael03](https://github.com/c2lael03))
  
---------------------------------

Tämä repositorio esittelee Oulun ammattikorkeakoulun tieto- ja viestintätekniikan opiskelijan tekemää sovellusta, joka kuuluu toteutukseen **Yrityslähtöinen sovellusprojekti** (30 op). 
Hankkeen tarkoituksena on oppia kokonaisvaltaista mobiilikehitystä ketteriä menetelmiä sekä versionhallintajärjestelmää käyttäen ja osoittaa omaa opittua osaamistaan.
  
---------------------------------

## Sovelluksen kuvaus
IDIS tarjoaa mobiililaitteille sopivan sovelluksen esimerkiksi ID-korttien numerosarjojen skannaukseen, tunnistamiseen ja tallentamiseen erilliseen tietokantaan. Tietokannasta käyttäjät voivat hakea tietoja henkilön lupien voimassaoloista tai lisätä tietokantaan uusia henkilöitä henkilötietoineen. 

### Ominaisuuksia
- Käyttäjä voi skannata ID-kortin numeron 
- Käyttäjä saa skannauksen jälkeen tietokannasta joko vihreää tai punaista valoa, riippuen löytyykö numerosarjalle voimassa oleva maahantulolupa
- Sovellus tallentaa ID-numerolle tietokantaan maahantulopäivämäärän, kellonajan sekä paikkakunnan
- Käyttäjä voi lisätä manuaalisesti henkilön, jonka osalta tietoa ei löydy.

---------------------------------

## Teknologiat
- Android-toteutus React nativella (Expo)
- Autentikointi Firebase
- Tietokanta Firestore
- Ajoympäristö Node.js

---------------------------------

## Sovelluksen rakenne

Sovellus sisältää seuraavat kansiot:

```./```: Sisältää sovelluksen käynnistymisessä olennaiset tiedostot kuten App.js

```./assets/```: Sisältää sovelluksen käyttämät kuvat

```./components/```: Sisältää sovelluksen käyttämiä komponentteja kuten ylä- ja alapalkit sekä painikkeet

```./context/```: Sisältää autentikaatioon, sisällön lataamiseen ja viestijärjestelmään liittyviä kontekstitiedostoja

```./screens/```: Sisältää sovelluksen eri näkymiä kuten tilinäkymä, chatnäkymä sekä kotinäkymä

```./services/```: Sisältää erilaisiin sovelluksen käyttämiin palveluihin liittyviä yhteystiedostoja kuten Firebase sekä Firestore


---------------------------------

## Sovelluksen käyttö
Kun sovellus avataan niin se avautuu kirjautumisnäkymään. Kirjautumisnäkymästä pääsee myös rekisteröitymään.

Kirjautumisen/Rekisteröitymisen jälkeen sovellus siirtyy kotinäkymään, jonka alareunasta pääsee siirtymään skannaustoimintoihin tai tilinhallintaan.

Yläreunan valikon kautta voi luoda omia ilmoituksia sekä tarkastella jo tehtyjä tallennuksia.

Tilinhallintanäkymässä puolestaan voi hallita tiliä sekä kirjautua ulos sovelluksesta.

| Kirjautumisnäkymä | Kotinäkymä | Skannaustoiminnallisuus | Tilinhallintanäkymä |
| ---------------------- | ---------------------- | ---------------------- | ---------------------- |
| 

---------------------------------
## Asennus

### Kloonaus
Voit kloonata repositorion käyttämällä valitsemassasi terminaalissa komentoa:

```
git clone https://github.com/c2lael03/riihimaki_v0
```

### Projektin käynnistäminen paikallisesti 
Projektin voi käynnistää paikallisesti valitsemassasi terminaalissa komennoilla:

```
cd frontend
npm install
npm start
```

Tämän jälkeen sovelluksen voi avata ja sitä voi käyttää älypuhelimen (Android tai iOS) Expo Go -sovelluksella

### Firebasen konfigurointi
Firebasen konfigurointiin löydät ohjeet [Firebasen dokumentaatiosta](https://firebase.google.com/docs/web/setup).

---------------------------------


