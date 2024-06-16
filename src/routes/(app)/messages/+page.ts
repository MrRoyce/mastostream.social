import { browser } from '$app/environment';
import type { PageLoad } from './$types';


export const load: PageLoad = (async ({ data }) => {

  let userClickedData = {}
  const userClickedDataStorage = browser ? localStorage.getItem('userClicked') : null;

  if (userClickedDataStorage) {
    try {
      userClickedData = JSON.parse(userClickedDataStorage)
    } catch (error) {
      console.error(`Invalid userClickedData: ${userClickedDataStorage}`)
    }
  }

  return {
    ...data,
    userClickedData
  }
});