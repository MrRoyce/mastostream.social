<script>
	import { Line } from 'svelte-chartjs';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	export let borderColor = 'rgb(49, 196, 141)';
	export let categories;
	export let data;
	export let entity = 'Account';
	export let total;

	// console.log('categories', JSON.stringify(categories, null, 2));
	// console.log('entity', entity);
	// console.log('data', JSON.stringify(data, null, 2));

	const chartData = {
		labels: categories,
		datasets: [
			{
				label: entity,
				fill: true,
				lineTension: 0.3,
				backgroundColor: 'rgba(225, 204,230, .3)',
				borderColor, // Line color
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: 'rgb(205, 130,1 58)',
				pointBackgroundColor: 'rgb(255, 255, 255)',
				pointBorderWidth: 10,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgb(0, 0, 0)',
				pointHoverBorderColor: 'rgba(220, 220, 220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: data
			}
		]
	};

	const options = {
		maintainAspectRatio: false,
		responsive: true,
		animation: true,
		scales: {
			x: {
				border: {
					color: 'grey'
				},
				title: {
					color: 'grey',
					display: true,
					text: 'Past Hours'
				}
			}
		},
		plugins: {
			legend: {
				display: true
			},
			tooltip: {
				enabled: true
			}
		}
	};
</script>

<Line data={chartData} {options} />
