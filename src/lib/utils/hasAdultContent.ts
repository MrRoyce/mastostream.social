function stringContainsFromArray(str, arr) {
	// Convert the string to lowercase for case-insensitive comparison
	const lowerCaseStr = str.toLowerCase();

	// Create regular expression pattern to match whole words from array
	const pattern = arr.map(item => '\\b' + item.toLowerCase() + '\\b').join('|');
	const regex = new RegExp(pattern, 'g');

	// Check if any whole word from array exists in the lowercase string
	return regex.test(lowerCaseStr);
}

export const hasAdultContent = (str, arr) => {
	return stringContainsFromArray(str, arr)
}