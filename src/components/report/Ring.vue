<template>
  <div class="ring-chart">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="ring-svg"
         :width="width"
         :height="svgHeight"
    >
      <g :transform="`translate(${wrap.width / 2},${svgHeight / 2})`">
        <path class="slice" v-for="(item, index) in dataset" :key="`slice${index}`"
              :d="dataPath[index]"
              :fill="nodataFlag ? '#14242e' : color[index]"
        ></path>
      </g>
    </svg>
    <ul>
      <li v-for="(item, index) in dataset" :key="`legend${index}`">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0,0,12,12" preserveAspectRatio="none" width="12"
             height="12" class="legend">
          <path transform="translate(0,12)" :fill="color[index]"
                d="M7.347880794884119e-16,-12A12,12 0 0,1 12,0L8,0A8,8 0 0,0 4.898587196589413e-16,-8Z"></path>
        </svg>
        <span :style="`color: ${color[index]};`">{{ item.name }}告警总数</span>
        <span class="ringPercent" style="color: rgb(204, 204, 204);">({{ item.value }}%)</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { pie, arc } from 'd3';

export default {
  name: 'Ring',
  props: {
    dataset: {
      type: Array,
      default() {
        return [{ code: '', name: '基线', value: 56 },
        { code: '', name: '健康度', value: 45 },
        { code: '', name: '返回码', value: 30 }];
      },
    },
    legend: {
      type: Object,
      default() {
        return {
          type: 'rect', // arc
          direction: 'bottom', // right|top|left
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
      let nodataFlag = false;
      let arr = [];
      this.dataset.map((item) => { // eslint-disable-line
        arr.push(item.value);
      });
      arr = this.dedupe(arr);
      if (arr.length === 1 && arr[0] === 0) nodataFlag = true;
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
    legendHeight() {
      const rowCount = Math.ceil(this.dataset.length / (this.width / 185));
      return rowCount * 35;
    },
    svgHeight() {
      return this.height - this.legendHeight;
    },
    outRadius() {
      return Math.min(this.width, this.svgHeight) / 2;
    },
    innerRadius() {
      return this.outRadius * 0.3 > 35 ? this.outRadius - 35 : this.outRadius * 0.7;
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
    dedupe(array) {
      return Array.from(new Set(array));
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
.ring-chart{
  width: 100%;
  height: 100%;
  // .ring-svg{
  //   width: 100%;
  //   height: 100%;
  // }
  ul,li{
    margin: 0 auto;
  }
  li{
    list-style-type: none;
    display: inline-block;
    width: 185px;
    height: 30px;
  }
}
</style>
