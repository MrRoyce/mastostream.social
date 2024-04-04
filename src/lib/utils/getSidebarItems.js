export const getSidebarItems = ({ group, page }) => {
	const sidebarItems = {
		legal: {
			toc: {
				groups: [
					{
						name: 'Terms and Conditions',
						items: []
					},
					{
						name: 'Table of Contents',
						items: [
							{
								label: '1. OUR SERVICES',
								href: '#services',
								url: '#services'
							},
							{
								label: '2. INTELLECTUAL PROPERTY RIGHTS',
								href: '#ip',
								url: '#ip'
							},
							{
								label: '3. USER REPRESENTATIONS',
								href: '#userreps',
								url: '#userreps'
							},
							{
								label: '4. USER REGISTRATION',
								href: '#userreg',
								url: '#userreg'
							},
							{
								label: '5. PROHIBITED ACTIVITIES',
								href: '#prohibited',
								url: '#prohibited'
							},
							{
								label: '6. USER GENERATED CONTRIBUTIONS',
								href: '#ugc',
								url: '#ugc'
							},
							{
								label: '7. CONTRIBUTION LICENSE',
								href: '#license',
								url: '#license'
							},
							{
								label: '8. SOCIAL MEDIA',
								href: '#socialmedia',
								url: '#socialmedia'
							},
							{
								label: '9. THIRD-PARTY WEBSITES AND CONTENT',
								href: '#thirdparty',
								url: '#thirdparty'
							},
							{
								label: '10. ADVERTISERS',
								href: '#advertisers',
								url: '#advertisers'
							},
							{
								label: '11. SERVICES MANAGEMENT',
								href: '#sitemanage',
								url: '#sitemanage'
							},
							{
								label: '12. PRIVACY POLICY',
								href: '#ppno',
								url: '#ppno'
							},
							{
								label: '13. COPYRIGHT INFRINGEMENTS',
								href: '#copyrightyes',
								url: '#copyrightyes'
							},
							{
								label: '14. TERM AND TERMINATION',
								href: '#terms',
								url: '#terms'
							},
							{
								label: '15. MODIFICATIONS AND INTERRUPTIONS',
								href: '#modifications',
								url: '#modifications'
							},
							{
								label: '16. GOVERNING LAW',
								href: '#law',
								url: '#law'
							},
							{
								label: '17. DISPUTE RESOLUTION',
								href: '#disputes',
								url: '#disputes'
							},
							{
								label: '18. CORRECTIONS',
								href: '#corrections',
								url: '#corrections'
							},
							{
								label: '19. DISCLAIMER',
								href: '#disclaimer',
								url: '#disclaimer'
							},
							{
								label: '20. LIMITATIONS OF LIABILITY',
								href: '#liability',
								url: '#liability'
							},
							{
								label: '21. INDEMNIFICATION',
								href: '#indemnification',
								url: '#indemnification'
							},
							{
								label: '22. USER DATA',
								href: '#userdata',
								url: '#userdata'
							},
							{
								label: '23. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES',
								href: '#electronic',
								url: '#electronic'
							},
							{
								label: '24. CALIFORNIA USERS AND RESIDENTS',
								href: '#california',
								url: '#california'
							},
							{
								label: '25. MISCELLANEOUS',
								href: '#misc',
								url: '#misc'
							},
							{
								label: '26. CONTACT US',
								href: '#contact',
								url: '#contact'
							}
						]
					}
				]
			},
			privacy: {
				groups: [
					{
						name: 'Privacy Notice',
						items: []
					},
					{
						name: 'Table of Contents',
						items: [
							{
								label: 'SUMMARY OF KEY POINTS',
								href: '#summary',
								url: '#summary'
							},
							{
								label: '1. WHAT INFORMATION DO WE COLLECT',
								href: '#infocollect',
								url: '#infocollect'
							},
							{
								label: '2. HOW DO WE PROCESS YOUR INFORMATION?',
								href: '#infouse',
								url: '#infouse'
							},
							{
								label: '3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?',
								href: '#whoshare',
								url: '#whoshare'
							},
							{
								label: '4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?',
								href: '#cookies',
								url: '#cookies'
							},
							{
								label: '5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?',
								href: '#sociallogins',
								url: '#sociallogins'
							},
							{
								label: '6. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?',
								href: '#intltransfers',
								url: '#intltransfers'
							},
							{
								label: '7. HOW LONG DO WE KEEP YOUR INFORMATION?',
								href: '#inforetain',
								url: '#inforetain'
							},
							{
								label: '8. DO WE COLLECT INFORMATION FROM MINORS?',
								href: '#infominors',
								url: '#infominors'
							},
							{
								label: '9. WHAT ARE YOUR PRIVACY RIGHTS?',
								href: '#privacyrights',
								url: '#privacyrights'
							},
							{
								label: '10. CONTROLS FOR DO-NOT-TRACK FEATURES',
								href: '#DNT',
								url: '#DNT'
							},
							{
								label: '11. DO WE MAKE UPDATES TO THIS NOTICE?',
								href: '#policyupdates',
								url: '#policyupdates'
							},
							{
								label: '12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?',
								href: '#contact',
								url: '#contact'
							},
							{
								label: '13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?',
								href: '#request',
								url: '#request'
							}
						]
					}
				]
			}
		}
	};

	return sidebarItems[group][page];
};
