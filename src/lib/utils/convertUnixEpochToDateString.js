export const convertUnixEpochToDateString = (/** @type {number} */ unixEpoch) => {
	// Create a new Date object using the Unix epoch (convert seconds to milliseconds)
	const date = new Date(unixEpoch * 1000);

	// Extract the date components
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
	const day = String(date.getDate()).padStart(2, '0');

	// Extract the time components
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	// Format the date and time as YYYY-MM-DD HH:MM:SS
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
