<template>
  <g class="ring_bg">
    <text :x="`${radius}`"
          :y="`${radius}`"
          :fill="`${text.color}`">
      {{ text.text }}
    </text>
  </g>
</template>
<script>
  import * as d3 from 'd3';

  export default {
    name: 'SectorGauge',
    props: {
      radius: {
        type: Number,
        default: 150,
      },
      path: {
        type: Array,
        default() {
          return [[125, 150, 80, '#1b252d'], [110, 100, 89, '#32dc2a']];
        },
      },
      text: {
        type: Object,
        default() {
          return {
            text: '--',
            color: '#000',
          };
        },
      },
      bg: {
        type: Object,
        default() {
          return {
            innerR: 150,
            outerR: 100,
            num: 100,
            color: '#000',
          };
        },
      },
      circle: {
        type: Array,
        default() {
          return [{
            innerR: 149,
            outerR: 100,
            num: 100,
            color: '#eee',
            filter: null,
          }, {
            innerR: 150,
            outerR: 99,
            num: 84,
            color: '#000',
            filter: null,
          }];
        },
      },
      color: {
        default: 'red',
      },
    },
    data() {
      return {
        translate: 'translate(150,150)',
      };
    },
    mounted() {
      const _this = this;
      const arc = d3.arc();
      _this.circle.forEach((d) => {
        const url = d.filter === null ? '' : `url(#${d.filter})`;
        d3.select(_this.$el)
          .append('path')
          .attr('d', arc({
            innerRadius: d.innerR,
            outerRadius: d.outerR,
            startAngle: 0,
            endAngle: 0.02 * Math.PI * d.num,
          }))
          .attr('filter', url)
          .attr('fill', `${d.color}`)
          .attr('transform', `translate(${_this.radius},${_this.radius})`);
      });
    },
    methods: {
    },
  };
</script>
<style>
  text {
    text-anchor: middle;
    font-size: 17px;
  }
</style>
