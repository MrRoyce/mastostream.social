import { convertToK } from './convertToK';

export const calculateCharts = (counts) => {
	const response = [
		{
			entity: 'Toots',
			data: Object.values(counts?.toots),
			categories: Object.keys(counts?.toots),
			total: convertToK(Object.values(counts?.toots).reduce((a, b) => a + b, 0))
		},
		{
			entity: 'Accounts',
			data: Object.values(counts?.accounts),
			categories: Object.keys(counts?.accounts),
			total: convertToK(Object.values(counts?.accounts).reduce((a, b) => a + b, 0))
		},
		{
			entity: 'Languages',
			data: Object.values(counts?.languages),
			categories: Object.keys(counts?.languages),
			total: convertToK(Object.values(counts?.languages).reduce((a, b) => a + b, 0))
		},
		{
			entity: 'Web Sites',
			data: Object.values(counts?.domains),
			categories: Object.keys(counts?.domains),
			total: convertToK(Object.values(counts?.domains).reduce((a, b) => a + b, 0))
		},
		{
			entity: 'Tags',
			data: Object.values(counts?.tags),
			categories: Object.keys(counts?.tags),
			total: convertToK(Object.values(counts?.tags).reduce((a, b) => a + b, 0))
		}
	];

	return response;
};
