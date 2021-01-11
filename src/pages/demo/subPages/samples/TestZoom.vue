<template>
<div>
  <svg :width="width" :height="height">
    <g :transform="transform">
      <circle v-for="(point, key) in points" :cx="point.x" :cy="point.y" :r="2.5" :key="key"></circle>
    </g>
  </svg>
</div>
</template>
<script>
import * as d3 from 'd3';

export default {
  name: 'zoom',
  data() {
    return {
      width: 960,
      height: 500,
      transform: '',
      zoom: d3.zoom().scaleExtent([1 / 2, 8]).on('zoom', this.handleZoom),
      points: [],
    };
  },
  methods: {
    handleZoom() {
      this.transform = d3.event.transform;
    },
    phyllotaxis(radius) {
      const theta = Math.PI * (3 - Math.sqrt(5));
      return (i) => {
        const r = radius * Math.sqrt(i);
        const a = theta * i;
        return {
          x: this.width / 2 + r * Math.cos(a),
          y: this.height / 2 + r * Math.sin(a),
        };
      };
    },
    initPoints() {
      this.points = d3.range(2000).map(this.phyllotaxis(10));
    },
  },
  mounted() {
    this.initPoints();
    this.wrapper = d3.select(this.$el);
    this.zoom(this.wrapper);
  },
};
</script>
