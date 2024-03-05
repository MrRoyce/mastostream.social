/**
 * @param {number} latestCount
 * @param {number} previousCount
 */
function calculateChange(latestCount, previousCount) {
	let response = previousCount
		? ((latestCount - previousCount) / Math.abs(previousCount)) * 100
		: 0;

	response = Math.round(response * 1000) / 1000;
	return response;
}

export const calculateStats = (
	/** @type {{ locale: string; route: string; accounts: string | number; counts: {} | undefined; domains: string | number; languages: string | number; tags: string | number; toots: string | number; }} */ stats
) => {
	console.log('stats', JSON.stringify(stats, null, 2));
	const response = [
		{
			href: '/toots',
			statEntity: 'Toots',
			statValue: stats.toots,
			statArrow: 'up',
			statPercent: calculateChange(stats?.counts?.toots['-1'], stats?.counts?.toots['-2']),
			statPercentColor: 'text-emerald-500',
			statDescription: 'In the last hour',
			statIconName: 'far fa-chart-bar',
			statIconColor: 'bg-red-500'
		},
		{
			href: '/accounts',
			statEntity: 'Accounts',
			statValue: stats.accounts,
			statArrow: 'up',
			statPercent: calculateChange(stats?.counts?.accounts['-1'], stats?.counts?.accounts['-2']),
			statPercentColor: 'text-emerald-500',
			statDescription: 'In the last hour',
			statIconName: 'fa-sharp fa-solid fa-users',
			statIconColor: 'bg-red-500'
		},
		{
			href: '/languages',
			statEntity: 'Languages',
			statValue: stats.languages,
			statArrow: 'up',
			statPercent: calculateChange(stats?.counts?.languages['-1'], stats?.counts?.languages['-2']),
			statPercentColor: 'text-emerald-500',
			statDescription: 'In the last hour',
			statIconName: 'far fa-chart-bar',
			statIconColor: 'bg-red-500'
		},
		{
			href: '/websites',
			statEntity: 'Web Sites',
			statValue: stats.domains,
			statArrow: 'up',
			statPercent: calculateChange(stats?.counts?.domains['-1'], stats?.counts?.domains['-2']),
			statPercentColor: 'text-emerald-500',
			statDescription: 'In the last hour',
			statIconName: 'far fa-chart-bar',
			statIconColor: 'bg-red-500'
		},
		{
			href: '/tags',
			statEntity: 'Tags',
			statValue: stats.tags,
			statArrow: 'up',
			statPercent: calculateChange(stats?.counts?.tags['-1'], stats?.counts?.tags['-2']),
			statPercentColor: 'text-emerald-500',
			statDescription: 'In the last hour',
			statIconName: 'far fa-chart-bar',
			statIconColor: 'bg-red-500'
		}
	];

	return response;
};
