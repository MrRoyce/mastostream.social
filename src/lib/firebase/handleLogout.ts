import { signOut } from 'firebase/auth';
import { auth } from '$lib/firebase/client';
import { goto } from '$app/navigation';

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
      goto('/');
    })
    .catch((error) => {
      console.error('Error logging out', error);
    });
};