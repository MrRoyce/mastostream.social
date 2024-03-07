<script lang="ts" >

import { createCanvas } from 'canvas'
import cloud from 'd3-cloud'

const dimensions = {
  width: 840,
  height: 600,
  margin: {
    top: 24,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

const wordPadding = 2;

const cloudWords = [];

function wordcloud(data) {
  const words = ["Hello", "world", "normally", "you", "want", "more", "words", "than", "this"]
    .map(function (d) {
      return { text: d, size: 10 + Math.random() * 90 };
    });

  return cloud().size([960, 500])
    .canvas(() => createCanvas(1, 1, 'svg'))
    .words(words)
    .padding(5)
    .rotate(() => Math.floor(Math.random() * 2) * 90)
    .font("Impact")
    .fontSize((d) => Math.sqrt(d.size) * 20)
    // .on("end", words => console.log(JSON.stringify(words)))
    .on("word", ({ size, x, y, rotate, text }) => {
      cloudWords.push({ size, x, y, rotate, text })
        .start();

    }
</script>

      < svg
  width = { dimensions.width }
  height = { dimensions.height }
  viewBox = {`0 0 ${dimensions.width} ${dimensions.height}`}
text - anchor="middle"
font - family="Helvetica"
  >
  <g transform={ `translate(0 ${dimensions.margin.top})` }>
    { #each words as word }
    < text
font - size={ word.size }
transform = {`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
fill = "#CC2936" > { word.text } < /text
  >
  {/ each}
</g>
  < /svg>
