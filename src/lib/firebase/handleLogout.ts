import { signOut } from 'firebase/auth';
import { auth } from '$lib/firebase/client';
import { goto } from '$app/navigation';
import { authUser } from '$lib/stores';

export const handleLogout = async () => {
  signOut(auth)
    .then(async () => {
      await fetch('/api/signin', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
          // 'CSRF-Token': csrfToken  // HANDLED by sveltekit automatically
        }
      });

      const dataToSetToStore = {
        email: null,
        displayName: null,
        uid: null
      };

      authUser.update((curr: any) => {
        return { ...curr, ...dataToSetToStore };
      });
      // Do not use goto!
      // window.location.assign will force a page refresh!
      window.location.assign('/');
    })
    .catch((error) => {
      console.error('Error logging out', error);
    });
};