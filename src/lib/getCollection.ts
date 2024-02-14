import {
  getDocs,
  query,
  collection,
  type DocumentData,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '$lib/firebase/client';

export const getData = async (entity: string) => {
  try {

    const responseData: DocumentData[] = [];
    const collectionRef = collection(db, entity)

    const data = await getDocs(
      query(collectionRef)
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

export const getOrders = async (uid: string) => {
  try {

    const responseData: DocumentData[] = [];
    const ordersCollectionRef = collection(db, 'users', uid, 'orders');

    const data = await getDocs(
      query(ordersCollectionRef)
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
    console.error('Error fetching orders in getOrders:', error);
    throw error; // Propagate the error to the caller
  }
};

export const getOrdersCount = async (uid: string) => {
  try {

    const collectionRef = collection(db, 'users', uid, 'orders');
    const snapshot = await getCountFromServer(collectionRef);

    return snapshot?.data().count || 0;

  } catch (error) {
    console.error('Error fetching data in getOrdersCount:', error);
    throw error; // Propagate the error to the caller
  }
};
