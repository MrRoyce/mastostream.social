import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '$lib/firebase/client';

type Options = {
  entity: string;
  max: number;
  orderByField: string;
  direction: string | 'desc';
};

export const getData = async (options: Options) => {
  try {
    const { entity, max, orderByField, direction } = options


    const responseData: DocumentData[] = [];
    const collectionRef = collection(db, entity)

    const data = await getDocs(
      query(collectionRef, orderBy(orderByField, direction), limit(max))
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
    return null
  }
}

// Function to get documents from Firebase based on keys array
export const getDocuments = async ({ entity, keysArray }) => {
  const documents = [];

  try {
    // Fetch documents based on keys
    for (const key of keysArray) {
      const docRef = doc(db, entity, key);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        documents.push({
          ...docSnap.data(),
          id: key,
        });
      } else {
        console.error(`Document ${key} not found`);
        return []
      }
    }

    return documents;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

export const getToots = async ({ entity, id, max, orderByField }) => {
  try {
    const responseData: DocumentData[] = [];
    const collectionRef = collection(db, `${entity}/${id}/toots`)

    const data = await getDocs(
      query(collectionRef, orderBy(orderByField, "desc"), limit(max))
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
    console.error('Error fetching data in getToots:', error);
    throw error; // Propagate the error to the caller
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

export const getCounts = async (hours: number) => {
  try {

    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000)
    const responseData: DocumentData[] = []

    const collectionRef = collection(db, 'timeseries')
    const data = await getDocs(
      query(collectionRef, where('timestamp', '>=', hoursAgo), orderBy('timestamp', 'desc'))
    );

    data.docs.map((doc) => {
      const docData = doc.data();
      responseData.push({
        ...docData
      });
    });

    // console.log('responseData', JSON.stringify(responseData, null, 2))

    return responseData;
  } catch (error) {
    console.error('Error getting counts:', error);
    throw error; // Propagate the error to the caller
  }
};