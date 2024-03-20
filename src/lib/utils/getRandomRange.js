export const getRandomRange = (upperRange, min) => {
	if (upperRange < min) {
		throw new Error('Upper range must be greater than or equal to 100.');
	}

	const minMinusOne = min - 1;

	const start = Math.floor(Math.random() * (upperRange - minMinusOne));
	const end = start + minMinusOne;

	return {
		start,
		end
	};
};
