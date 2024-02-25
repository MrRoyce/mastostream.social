export const calculateStats = (stats) => {
	const response = [
		{
			href: '/toots',
			statEntity: 'Toots',
			statValue: stats.toots,
			statArrow: 'up',
			statPercent: '3.481',
			statPercentColor: 'text-emerald-500',
			statDescription: 'Since last month',
			statIconName: 'far fa-chart-bar',
			statIconColor: 'bg-red-500'
		},
		{
			href: '/accounts',
			statEntity: 'Accounts',
			statValue: stats.accounts,
			statArrow: 'up',
			statPercent: '3.482',
			statPercentColor: 'text-emerald-500',
			statDescription: 'Since last month',
			statIconName: 'fa-sharp fa-solid fa-users',
			statIconColor: 'bg-red-500'
		},
		{
			href: '/languages',
			statEntity: 'Languages',
			statValue: stats.languages,
			statArrow: 'up',
			statPercent: '3.483',
			statPercentColor: 'text-emerald-500',
			statDescription: 'Since last month',
			statIconName: 'far fa-chart-bar',
			statIconColor: 'bg-red-500'
		},
		{
			href: '/websites',
			statEntity: 'Web Sites',
			statValue: stats.domains,
			statArrow: 'up',
			statPercent: '3.484',
			statPercentColor: 'text-emerald-500',
			statDescription: 'Since last month',
			statIconName: 'far fa-chart-bar',
			statIconColor: 'bg-red-500'
		},
		{
			href: '/tags',
			statEntity: 'Tags',
			statValue: stats.tags,
			statArrow: 'up',
			statPercent: '3.485',
			statPercentColor: 'text-emerald-500',
			statDescription: 'Since last month',
			statIconName: 'far fa-chart-bar',
			statIconColor: 'bg-red-500'
		}
	];

	return response;
};
