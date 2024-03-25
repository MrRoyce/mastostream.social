import { goto } from '$app/navigation';

export const redirectPage = (/** @type {number} */ seconds, /** @type {string | URL} */ page) => {
	setTimeout(function () {
		goto(page);
	}, seconds * 1000);
};
