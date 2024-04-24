import { signOut } from 'firebase/auth';
import { auth } from '$lib/firebase/client';
import { goto } from '$app/navigation';
import { authUser } from '$lib/stores';
import { session } from '$lib/stores/authStore';

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
        admin: false,
        displayName: null,
        email: null,
        picture: null,
        uid: null
      };

      authUser.update((curr: any) => {
        return { ...curr, ...dataToSetToStore };
      });

      session.update((cur: any) => {
        return {
          ...cur,
          ...dataToSetToStore,
          loggedIn: false,
          loading: false
        };
      });
      // Do not use goto!
      // window.location.assign will force a page refresh!
      //await invalidate('/')
      await goto('/', { invalidateAll: true });
      //window.location.assign('/');
    })
    .catch((error) => {
      console.error('Error logging out', error);
    });
};