import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '$lib/firebase/client';

export const getData = async ({ entity, max }) => {
  try {

    const responseData: DocumentData[] = [];
    const collectionRef = collection(db, entity)

    const data = await getDocs(
      query(collectionRef, orderBy("timestamp", "desc"), limit(max))
    );

    data.docs.map((doc) => {
      const docData = doc.data();
      responseData.push({
        id: doc.id, // Get the id from doc, not doc.data()!
        ...docData
      });
    });

    return responseData;

  } catch (error) {
    console.error('Error fetching data in getData:', error);
    throw error; // Propagate the error to the caller
  }
};

export const getDocument = async ({ entity, id }) => {
  const docRef = doc(db, entity, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log(`Document ${id} not found`);
    return ({})

  }
}

export const getCount = async (entity: string) => {
  try {

    const collectionRef = collection(db, entity)
    const snapshot = await getCountFromServer(collectionRef);

    return snapshot?.data().count || 0;

  } catch (error) {
    console.error('Error fetching data in getCount:', error);
    throw error; // Propagate the error to the caller
  }
};

