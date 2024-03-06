import { convertToK } from './convertToK';

export const calculateCharts = (counts) => {
	const response = [
		{
			entity: 'Toots',
			data: Object.values(counts?.toots).slice().reverse(),
			categories: Object.keys(counts?.toots).slice().reverse(),
			total: convertToK(Object.values(counts?.toots).reduce((a, b) => a + b, 0))
		},
		{
			entity: 'Accounts',
			data: Object.values(counts?.accounts).slice().reverse(),
			categories: Object.keys(counts?.accounts).slice().reverse(),
			total: convertToK(Object.values(counts?.accounts).reduce((a, b) => a + b, 0))
		},
		{
			entity: 'Languages',
			data: Object.values(counts?.languages).slice().reverse(),
			categories: Object.keys(counts?.languages).slice().reverse(),
			total: convertToK(Object.values(counts?.languages).reduce((a, b) => a + b, 0))
		},
		{
			entity: 'Web Sites',
			data: Object.values(counts?.domains).slice().reverse(),
			categories: Object.keys(counts?.domains).slice().reverse(),
			total: convertToK(Object.values(counts?.domains).reduce((a, b) => a + b, 0))
		},
		{
			entity: 'Tags',
			data: Object.values(counts?.tags).slice().reverse(),
			categories: Object.keys(counts?.tags).slice().reverse(),
			total: convertToK(Object.values(counts?.tags).reduce((a, b) => a + b, 0))
		}
	];

	return response;
};
