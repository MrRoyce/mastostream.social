import { functions } from "$lib/firebase/client";
import { httpsCallable } from 'firebase/functions';

const instance = httpsCallable(functions, 'isUserAdmin');

export const isUserAdmin = async (email: string): Promise<boolean> => {
  try {
    const response = await instance({ email })
    if (!response.data) {
      throw new Error(`Failed to fetch data. Status: ${response.status || false}`);
    }

    const data = response.data;

    // Assuming the API response is a boolean value
    return Boolean(data.admin);
  } catch (error) {
    console.error('Error fetching data in isUserAdmin:', error);
    throw error; // Propagate the error to the caller
  }
};
