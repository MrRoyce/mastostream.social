import { t } from '$lib/translations';

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
	const tootsPercent = calculateChange(stats?.counts?.toots['-1'], stats?.counts?.toots['-2']);
	const accountsPercent = calculateChange(
		stats?.counts?.accounts['-1'],
		stats?.counts?.accounts['-2']
	);
	const languagesPercent = calculateChange(
		stats?.counts?.languages['-1'],
		stats?.counts?.languages['-2']
	);
	const domainsPercent = calculateChange(
		stats?.counts?.domains['-1'],
		stats?.counts?.domains['-2']
	);
	const tagsPercent = calculateChange(stats?.counts?.tags['-1'], stats?.counts?.tags['-2']);

	const response = [
		{
			href: '/toots',
			statEntity: stats.routeTranslations.toots,
			statValue: stats.toots,
			statArrow: tootsPercent >= 0 ? 'up' : 'down',
			statPercent: tootsPercent,
			statsCount: stats?.counts?.toots['-1'] || 0,
			statPercentColor: 'text-emerald-500',
			statDescription: 'In the last hour',
			statIconName: 'fa-solid fa-bullhorn',
			statIconColor: 'bg-red-500'
		},
		{
			href: '/accounts',
			statEntity: stats.routeTranslations.accounts,
			statValue: stats.accounts,
			statArrow: accountsPercent >= 0 ? 'up' : 'down',
			statPercent: accountsPercent,
			statsCount: stats?.counts?.accounts['-1'] || 0,
			statPercentColor: 'text-emerald-500',
			statDescription: 'In the last hour',
			statIconName: 'fa-sharp fa-solid fa-users',
			statIconColor: 'bg-red-500'
		},
		{
			href: '/websites',
			statEntity: stats.routeTranslations.domains,
			statValue: stats.domains,
			statArrow: domainsPercent >= 0 ? 'up' : 'down',
			statPercent: domainsPercent,
			statsCount: stats?.counts?.domains['-1'] || 0,
			statPercentColor: 'text-emerald-500',
			statDescription: 'In the last hour',
			statIconName: 'fa-solid fa-network-wired',
			statIconColor: 'bg-red-500'
		},
		{
			href: '/tags',
			statEntity: stats.routeTranslations.tags,
			statValue: stats.tags,
			statArrow: tagsPercent >= 0 ? 'up' : 'down',
			statPercent: tagsPercent,
			statsCount: stats?.counts?.tags['-1'] || 0,
			statPercentColor: 'text-emerald-500',
			statDescription: 'In the last hour',
			statIconName: 'fa-solid fa-hashtag',
			statIconColor: 'bg-red-500'
		},
		{
			href: '/languages',
			statEntity: stats.routeTranslations.languages,
			statValue: stats.languages,
			statArrow: languagesPercent >= 0 ? 'up' : 'down',
			statPercent: languagesPercent,
			statsCount: stats?.counts?.languages['-1'] || 0,
			statPercentColor: 'text-emerald-500',
			statDescription: 'In the last hour',
			statIconName: 'fa-solid fa-globe',
			statIconColor: 'bg-red-500'
		}
	];

	return response;
};
