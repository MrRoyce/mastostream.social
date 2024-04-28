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
  startAfter,
} from 'firebase/firestore';
import { db } from '$lib/firebase/client';

type Options = {
  entity: string;
  max: number;
  orderByField: string;
  sourceType: string;
};

export const getData = async (options: Options) => {
  try {
    const { entity, max, orderByField, sourceType } = options

    const responseData: DocumentData[] = [];
    const collectionRef = collection(db, entity)

    let queryCollectionRef

    if (sourceType === 'human') {
      queryCollectionRef = query(collectionRef, where('bot', '==', false), orderBy(orderByField, "desc"), limit(max))
    } else if (sourceType === 'bot') {
      queryCollectionRef = query(collectionRef, where('bot', '==', true), orderBy(orderByField, "desc"), limit(max))
    } else {
      queryCollectionRef = query(collectionRef, orderBy(orderByField, "desc"), limit(max))
    }

    const data = await getDocs(
      queryCollectionRef
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
    console.log(`Document ${id} not found for entity ${entity}`);
    return null
  }
}

export const getGroups = async ({ entity, id }) => {
  const responseData: DocumentData[] = [];
  const collectionRef = collection(db, entity, id, 'groups');

  const queryCollectionRef = query(collectionRef, limit(50))

  const data = await getDocs(
    queryCollectionRef
  );

  data.docs.map((doc) => {
    const docData = doc.data();
    responseData.push({
      id: doc.id, // Get the id from doc, not doc.data()!
      ...docData
    });
  });

  return responseData;
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

export const getWords = async ({ start, max }) => {
  try {
    const responseData: DocumentData[] = [];
    const collectionRef = collection(db, 'tags')

    const data = await getDocs(
      query(collectionRef, orderBy('count', "desc"), startAfter(start), limit(max))
    );

    data.docs.map((doc) => {
      const docData = doc.data();
      responseData.push({
        id: doc.id, // Get the id from doc, not doc.data()!
        size: docData.count,
        name: docData.name,
        text: docData.name,
      });
    });

    return responseData;

  } catch (error) {
    console.error('Error fetching data in getWords:', error);
    throw error; // Propagate the error to the caller
  }
}

export const getToots = async ({ entity, id, max, orderByField, tootType }) => {
  try {
    const reference = (entity && id) ? `${entity}/${id}/toots` : `toots`
    const responseData: DocumentData[] = [];
    const collectionRef = collection(db, reference)

    let queryCollectionRef

    if (tootType === 'human') {
      queryCollectionRef = query(collectionRef, where('bot', '==', false), orderBy(orderByField, "desc"), limit(max))
    } else if (tootType === 'bot') {
      queryCollectionRef = query(collectionRef, where('bot', '==', true), orderBy(orderByField, "desc"), limit(max))
    } else {
      queryCollectionRef = query(collectionRef, orderBy(orderByField, "desc"), limit(max))
    }

    const data = await getDocs(
      queryCollectionRef
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

    const response = snapshot?.data().count || 0;

    return response

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