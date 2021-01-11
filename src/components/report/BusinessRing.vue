<template>
  <div class="buisness-ring-chart">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
      class="circle-svg"
      :width="outRadius * 2"
      :height="outRadius * 2"
    >
      <g :transform="`translate(${outRadius},${outRadius})`">
        <path class="slice" v-for="(item, index) in dataset" :key="`slice${index}`"
              :d="dataPath[index]"
              :fill="nodataFlag ? '#14242e' : color[index]"
        ></path>
        <circle :r="innerRadius" fill="transparent"/>
        <text text-anchor="middle" fill="#fff">
          <tspan font-size="14" x="0" dy="-14">{{ center.main }}({{ transCount(center.sub).unit }})</tspan>
          <tspan font-size="36" x="0" dy="36">{{ transCount(center.sub).value }}</tspan>
        </text>
      </g>
    </svg>
    <ul class="legend-wrap" :style="`width: ${legendWidth}px`">
      <li class="legend-item" v-for="(item, index) in dataset" :key="`legend${index}`">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0,0,12,12" preserveAspectRatio="none" width="12"
             height="12" class="legend">
             <rect width="12" height="12" :fill="color[index]" rx="2" ry="2"></rect>
        </svg>
        <span class="ring-name">{{ item.name }}</span>
        <span class="ring-count">{{ transCount(item.count).value }}{{ transCount(item.count).unit }}</span>
        <span class="ringPercent">({{ item.value }}%)</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { formatTransCount } from '@/helpers/utils';
import { pie, arc } from 'd3';

export default {
  name: 'BusinessRing',
  props: {
    dataset: {
      type: Array,
      default() {
        return [{ code: '', name: '基线', count: 56, value: 56 },
        { code: '', name: '健康度', count: 56, value: 45 },
        { code: '', name: '健康度', count: 56, value: 45 },
        { code: '', name: '健康度', count: 56, value: 45 },
        { code: '', name: '健康度', count: 56, value: 45 },
        { code: '', name: '健康度', count: 56, value: 45 },
        { code: '', name: '健康度', count: 56, value: 45 },
        { code: '', name: '返回码', count: 56, value: 30 }];
      },
    },
    center: {
      type: Object,
      default() {
        return {
          main: '',
          sub: '',
        };
      },
    },
  },
  data() {
    return {
      wrap: { width: 960, height: 600 },
      margin: {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40,
      },
      noDataset: [
        {
          value: 100,
        },
      ],
    };
  },
  computed: {
    nodataFlag() {
      const nodataFlag = this.dataset.every(d => d.value === 0);
      // this.dataset.map((item) => { // eslint-disable-line
      //   nodataFlag = item.value === 0;
      // });
      // console.log('nodataFlag', nodataFlag);
      return nodataFlag;
    },
    color() {
      const colorArr = ['#66e690', '#7bdb74', '#a1d271', '#82bf9a', '#e0e46e', '#c8ce81', '#83c89a', '#83c4b7', '#90a7bd',
        '#6dcde3', '#e66495', '#d46b6a', '#df8c5f', '#da9779', '#c4da77', '#b56ed2', '#a684be', '#7e7cc8', '#719ed5', '#408bd7'];
      colorArr.sort(() => 0.5 - Math.random());
      return colorArr;
    },
    width() {
      return this.wrap.width - this.margin.left - this.margin.right;
    },
    height() {
      return this.wrap.height - this.margin.top - this.margin.bottom;
    },
    legendWidth() {
      const maxRows = Math.floor(this.height / 30);
      const cols = Math.ceil(this.dataset.length / maxRows);
      return 185 * cols;
    },
    svgWidth() {
      return this.width - this.legendWidth;
    },
    svgHeight() {
      return this.height;
    },
    outRadius() {
      return Math.min(this.svgWidth, this.height) / 2;
    },
    innerRadius() {
      return this.outRadius * 0.3 > 35 ? this.outRadius * 0.7 : this.outRadius - 35;
    },
    pie() {
      if (this.nodataFlag) return pie().value(d => d.value)(this.noDataset);
      return pie().value(d => d.value)(this.dataset);
    },
    dataPath() {
      return this.pie.map(d => arc()({
        innerRadius: this.innerRadius,
        outerRadius: this.outRadius,
        startAngle: d.startAngle,
        endAngle: d.endAngle,
      }));
    },
  },
  methods: {
    transCount(data) {
      return formatTransCount(data);
    },
    getBox() {
      const box = this.$el.getBoundingClientRect();
      this.wrap = {
        width: box.width,
        height: box.height,
      };
    },
    onResize() {
      this.getBox();
    },
  },
  mounted() {
    this.onResize();
    window.addEventListener('resize', () => this.onResize());
  },
};
</script>

<style lang="scss">
.buisness-ring-chart{
  width: 100%;
  height: 100%;
  border: solid 1px red;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  .circle-svg{
    margin: auto;
  }
  ul,li{
    margin: 0 auto;
  }
  .legend-wrap{
    display: inline-block;
    margin: auto;
  }
  .legend-item{
    list-style-type: none;
    display: inline-block;
    width: 185px;
    height: 30px;
    .ring-name, .ring-count{
      font-size: 14px;
      color:#e0eef1;
    }
    .ringPercent{
      color:#fff;
      font-size: 14px;
      font-weight:600;
    }
    .ring-count{
      margin: 0 10px;
    }
  }
  
}
</style>
