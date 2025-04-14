// ./frontend/services/firestorePax.js

import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp,
    orderBy,
    limit,
    startAfter,
    collectionGroup,
    documentId,
} from 'firebase/firestore';

import { firestore } from './firebaseConfig';
import { Timestamp } from 'firebase/firestore';
import regionsAndCities from '../components/Sorted-maakunnat.json';
import { getUserData } from './firestoreUsers';

    export const addPaxToFirestore = async (uid, paxname, paxdescription, city, imageUrl, image ) => {

        if (!paxname || !paxdescription || !city || !imageUrl) {
            console.error('Virhe: Yksi tai useampi kenttä on tyhjä!');
            throw new Error('Täytä puuttuvat kentät.');
        }

        const allCities = Object.values(regionsAndCities).flat();
        const isCityValid = allCities.includes(city.trim());

        if (!isCityValid) {
            throw new Error('Tarkista kaupungin oikeinkirjoitus.');
        }


        try {
            const giverRef = doc(firestore, 'users', uid);
            const userDoc = await getDoc(giverRef); 
            const giverUsername = userDoc.data().username;
            const now = Timestamp.now();

            const expiresInOneWeekSeconds = now.seconds + (7 * 24 * 60 * 60);
            const expiresInOneWeek = new Timestamp(expiresInOneWeekSeconds, 0); // nanosekunnit = 0

           // for testing: 2 minutes
           //const expiresInOneWeek = new Timestamp(now.seconds + 2 * 60, now.nanoseconds);

            const paxData = {
            paxname,
            paxdescription,
            imageUrl,
            image,
            city,
            giverid: giverRef,
            givername: giverUsername,
            createdAt: serverTimestamp(),
            expiration: expiresInOneWeek,
            };

            const docRef = await addDoc(collection(firestore, 'pax'), paxData);
            console.log(`UID: ${uid} lisännyt:`, docRef.id);

            const takersRef = collection(firestore, `pax/${docRef.id}/takers`);
            await addDoc(takersRef, { placeholder: true });
            console.log(`Lisätty alikokoelma (takers) tuotteelle ${docRef.id}`);

            return docRef.id;
        } catch (error) {
            console.error('Virhe lisättäessä tuotetta:', error);
            throw error;
        }
    };

    export const getPaxFromFirestore = async () => {
        try {
            const paxRef = collection(firestore, 'pax');
            const paxSnapshot = await getDocs(paxRef);
            const pax = [];

            paxSnapshot.forEach((doc) => {
            pax.push({ id: doc.id, ...doc.data() });
            });

            return pax;
        } catch (error) {
            console.error('Virhe haettaessa tuotteita:', error);
            throw error;
        }
    };

    export const paginatePax = async (
        lastDoc,
        pageSize,
        filter = undefined,
        city = undefined,
        refToCollection = () => collection(firestore, 'pax'),
        idFieldHandler = (pax) => pax.id
    ) => {
        try {
            let paxRef = refToCollection();
            let q;

            if (lastDoc) {
                q = query(paxRef, orderBy('createdAt'), startAfter(lastDoc), limit(pageSize));
            } else {
                q = query(paxRef, orderBy('createdAt'), limit(pageSize));
            }
            if (city) {
                q = query(q, where('city', '==', city));
            }

            if (filter) {
                q = query(q, filter());
            }

            const paxSnapshot = await getDocs(q);
            const pax = [];

            paxSnapshot.forEach((doc) => {
                pax.push({ id: idFieldHandler(doc), ...doc.data() });
            });

            const lastVisibleDoc = paxSnapshot.docs[paxSnapshot.docs.length - 1];
            return { pax, lastDoc: lastVisibleDoc };
        } catch (error) {
            throw error;
        }
    };

    export const getCurrentUserPax = async (uid, lastDoc, pageSize) => {
        return paginatePax(lastDoc, pageSize, () => where('giverid', '==', doc(firestore, 'users', uid)));
    };

    export const getTotaPax = async () => {

        const count = await getDocs(collection(firestore, 'pax')).then((snapshot) => {
            return snapshot.size;
        }
        );
        return count;
    };

    export const getCurrentUserPaxQueues = async (uid, lastDoc, pageSize) => {
        try {
            const {pax: takerDocs, lastDoc: newLastDoc} = await paginatePax(
                lastDoc,
                pageSize,
                () => where('takerId', '==', doc(firestore, 'users', uid)),
                undefined,
                () => collectionGroup(firestore, 'takers'),
                (doc) => doc.ref.parent.parent
            );

            if (takerDocs.length === 0) {
                return { pax: [], lastDoc: null };
            }

            const paxIds = takerDocs.map((ref) => ref.id);
            const {pax} = await paginatePax(
                null,
                paxIds.length,
                () => where(documentId(), 'in', paxIds)
            );

            return { pax, lastDoc: newLastDoc };
        } catch (error) {
            console.error('getCurrentUserPaxQueues error:', error)
            throw error;
        }
    }

    export const getPaxFromFirestore = async (paxId) => {
        try {
            const paxRef = doc(firestore, 'pax', paxId);
            const paxSnapshot = await getDoc(paxmRef);

            if (paxSnapshot.exists()) {
            const paxData = paxSnapshot.data();
            const paxId = paxSnapshot.id;
            const giverRef = paxData.giverid;
            const takersRef = collection(firestore, `pax/${paxId}/takers`);

            return { paxId, ...paxData, giverRef, takersRef };
            } else {
            return null;
            }

        } catch (error) {
            console.error('Virhe haettaessa tuotetta:', error);
            throw error;
        }
    };

    export const deletePaxFromFirestore = async (uid, paxId) => {
        try {
            const paxRef = doc(firestore, 'pax', paxId);

            if (!(await checkIfMyPax(uid, paxId))) {
                console.error("Virhe: Et voi poistaa toisen tuotteita.");
                throw new Error("Et voi poistaa toisten tuotteita.");
            }

            await deleteSubcollection(paxRef, 'takers');
            await deleteDoc(paxRef);
            console.log(`UID: ${uid} poistanut: ${paxId}`);

        } catch (error) {
            console.error('Virhe poistettaessa paxiä Firestoresta:', error);
            throw error;
        }
      };

    export const deleteExpiredPax = async () => {
        try {
            const paxRef = collection(firestore, 'pax');
            const q = query(paxRef, where('expiration', '<=', Timestamp.now()));
            const snapshot = await getDocs(q);

            for (const docSnapshot of snapshot.docs) {
                const paxId = docSnapshot.id;

                await deleteSubcollection(docSnapshot.ref, 'takers');
                await deleteDoc(docSnapshot.ref);
                console.log(`Poistettu vanhentunut pax ja sen takers: ${paxId}`);
            }

        } catch (error) {
            console.error('Virhe poistettaessa vanhentuneita paxeja:', error);
            throw error;
        }
    }

    const deleteSubcollection = async (parentRef, subcollectionName) => {
        try {
            const subcollectionRef = collection(parentRef, subcollectionName);
            const snapshot = await getDocs(subcollectionRef);

            for (const docSnapshot of snapshot.docs) {
                await deleteDoc(docSnapshot.ref);
                console.log(`Poistettu ${subcollectionName} alikokoelmasta: ${docSnapshot.id}`);
            }
        } catch (error) {
            console.error(`Virhe poistettaessa ${subcollectionName} alikokoelmaa:`, error);
            throw error;
        }
    }

    export const checkIfMyPax = async (uid, paxId) => {
        try {
            const paxData = await getPaxFromFirestore(paxId); 
            const { giverRef } = paxData; 

            return giverRef.id === uid;
        } catch (error) {
            console.error("Error checking pax permits:", error);
            return false;
        }
    };

   export const fetchQueueCount = async (paxId) => {
        
        try {
            const takersRef = collection(firestore, `pax/${paxId}/takers`);
            const snapshot = await getDocs(takersRef);
            return snapshot.size -1;
        } catch (error) {
            console.error('Virhe jonottajien määrän hakemisessa:', error);
        }
      };

      export const fetchFirstInQueue = async (paxId) => {
        try {
            const takersRef = collection(firestore, `pax/${paxId}/takers`);
            const snapshot = await getDocs(query(takersRef, orderBy('createdAt')));

            if (snapshot.empty) {
                return null;
            }

            const firstInQueueDoc = snapshot.docs[0];
            const userRef = firstInQueueDoc.data().takerId;

            if (!userRef) {
                return null;
            }

            const userSnapshot = await getDoc(userRef);
            if (!userSnapshot.exists()) {
                return null;
            }

            const username = userSnapshot.data().username;
            return username;

        } catch (error) {
            console.error('Virhe jonossa ensimmäisen hakemisessa:', error);
            return null;
        }
    };
