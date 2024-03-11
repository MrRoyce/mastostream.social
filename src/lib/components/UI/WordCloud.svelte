<script lang="ts">
	import cloud from 'd3-cloud';
	import { scaleOrdinal } from 'd3-scale';
	import { Chart, Filler } from 'chart.js';
	import * as CS from 'd3-scale-chromatic';

	export let hashtags;
	export let scheme = 'schemeTableau10';

	Chart.register(Filler);

	const dimensions = {
		width: 1750,
		height: 275,
		margin: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}
	};

	const wordPadding = 3;
	const cloudWords: any[] = [];
	const color_scheme = {
		schemeCategory10: CS.schemeCategory10,
		schemeAccent: CS.schemeAccent,
		schemeDark2: CS.schemeDark2,
		schemePaired: CS.schemePaired,
		schemePastel1: CS.schemePastel1,
		schemePastel2: CS.schemePastel2,
		schemeSet1: CS.schemeSet1,
		schemeSet2: CS.schemeSet2,
		schemeSet3: CS.schemeSet3,
		schemeTableau10: CS.schemeTableau10
	};

	// text color scheme
	const fill = scaleOrdinal(color_scheme[scheme]);

	const maxWordCount = hashtags.reduce((prev, cur) =>
		prev.size < cur.size ? prev.size : cur.size
	);

	const onWordClick = (d) => console.log('click', d);

	const d3Cloud = cloud()
		.size([dimensions.width, dimensions.height])
		.words(hashtags)
		.padding(wordPadding)
		.rotate(() => Math.floor(Math.random() * 2) * 90)
		.font('Impact')
		.fontSize((d) => Math.sqrt(d.size) * 1.5)
		// .on("end", words => console.log(JSON.stringify(words)))
		.on('word', ({ size, x, y, rotate, text }) => {
			cloudWords.push({ size, x, y, rotate, text });
		});

	d3Cloud.start();
</script>

<svg
	width="100%"
	height="100%"
	viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
	text-anchor="middle"
	font-family="Arial"
>
	<g transform={`translate(0 ${dimensions.margin.top})`}>
		{#each cloudWords as word}
			<a href={`/tags/${word.text}`}>
				<text
					class=""
					font-size={word.size}
					transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
					fill="currentColor">{word.text}</text
				></a
			>
		{/each}
	</g>
</svg>

<style>
	a:hover {
		color: #089d6c;
	}
</style>
