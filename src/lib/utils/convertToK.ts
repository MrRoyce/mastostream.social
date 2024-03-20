export const convertToK = (/** @type {number} */ number: number) => {
	if (typeof number !== 'number') {
		return '0';
	}
	if (number <= 1000) {
		return number.toString();
	}
	const kValue = Math.round((number / 1000) * 10) / 10;
	return kValue + 'k';
};
