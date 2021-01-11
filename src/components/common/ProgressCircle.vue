<template>
  <svg :width="`${radius * 2}`" :height="`${radius * 2}`">
    <g>
      <path v-for="(item, index) in path"
            :key="index"
            :d="calcPath(item)"
            :fill="item[3]"
            :transform="`translate(${radius},${radius})`"
            :filter="hasUrl(item[4])"></path>
      <text :x="`${radius}`"
            :y="`${radius}`">
        {{ text }}
      </text>
    </g>
  </svg>
</template>
<script>
  import * as d3 from 'd3';

  export default {
    name: 'ProgressCircle',
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
        type: String,
        default: '正常',
      },
      color: {
        type: String,
        default: 'red',
      },
    },
    data() {
      return {
        translate: 'translate(150,150)',
      };
    },
    mounted() {
      /* 转二维数组 */
      const arcInfo = this.path;
      if (!(arcInfo[0] instanceof Array)) {
        const tempArr = [];
        tempArr.push(arcInfo);
        this.path = tempArr;
      }
    },
    methods: {
      calcPath(d) {
        const arc = d3.arc()
          .innerRadius(d[0])
          .outerRadius(d[1])
          .startAngle(0)
          .endAngle(d[2] * Math.PI / 50);
        return arc();
      },
      hasUrl(blur) {
        let url = '';
        if (blur !== undefined) {
          url = `url(${blur})`;
        }
        return url;
      },
    },
  };
</script>
<style scoped>
  text {
    text-anchor: middle;
    /* dominant-baseline: middle; */
    fill: #fff;
    font-size: 17px;
  }
</style>
