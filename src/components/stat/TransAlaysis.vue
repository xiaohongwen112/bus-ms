<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
    class="alaysis-svg">
    <rect class="bg" x="0" y="0" rx="0" ry="0"
     :width="width" :height="height" fill="#1a2732"></rect>
    <line class="right-line"
      :x1="allW" :x2="allW" y1="0" :y2="height"
      fill="none" stroke="#57516e" stroke-dasharray="18px 2px"></line>
    <line class="middle-line"
      v-for="(item, index) in nodeList" :key="`middle-line${index}`"
      :x1="gridW + gridW * index" y1="0"
      :x2="gridW + gridW * index" :y2="28 + 60 * length"
      stroke="#585d61" stroke-dasharray="18px 2px"></line>    
    <TransAlaysisFlow transform="translate(0, 15)" 
      :width="allW" :text="`${time}ms`" :totalFlag="totalFlag"
    />  
    <TransAlaysisNode v-for="(node, index) in nodeList" :key="`node-group${index}`"
    :transform="`translate(0, ${ 60 * index })`"
    :index="index" :node="node"
    :allW="allW" :gridW="gridW"
    :active="index === data.active"
    />
  </svg>
</template>

<script>
import { getHealthStatus } from '@/helpers/utils';
import { scaleLinear } from 'd3';

import TransAlaysisNode from '@/components/stat/TransAlaysisNode';
import TransAlaysisFlow from '@/components/stat/TransAlaysisFlow';

export default { // Gantt chart
  name: 'TransAlaysis',
  components: {
    TransAlaysisNode,
    TransAlaysisFlow,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {
          flow: [],
          active: 0,
        };
      },
    },
  },
  data() {
    return {
      width: 1247,
      height: 219,
      gridH: 60,
      titH: 8,
      flowH: 16,  //  时间条高度,固定.node高60,
      allFlowH: 30,
      allX: 0,
      nodeW: 108,
      nodeH: 26,
      totalW: 0,
      totalFlag: true,
    };
  },
  computed: {
    scaleLinear() { return scaleLinear().domain([0, 100]).range([0, this.allW]); },
    allW() { return this.width - 18; },
    allH() {
      return this.data.flow.length * this.gridH + this.titH + this.allFlowH;
    },
    gridW() {
      const width = this.allW / (this.data.flow.length + 1);
      return width;
    },
    allY() { return this.titH + (this.allFlowH - this.flowH) / 2; },
    nodeBasisTop() { return this.titH + this.allFlowH; },
    sNodeX() { return (this.gridW - this.nodeW) / 2; },
    tNodeX() { return (this.gridW - this.nodeW) / 2 + this.gridW; },
    length() { return this.data.flow.length; },
    time() {
      let totalTime = 0;
      this.data.flow.forEach((d) => {
        totalTime += d.time;
      });
      return totalTime.toFixed(2);
    },
    nodeList() {
      const list = [];
      this.data.flow.forEach((d, i) => {
        const tmpObj = {
          source: d.source,
          target: d.target,
          time: Number(d.time.toFixed(2)),
          percent: 100 * d.time / this.time,
        };
        tmpObj.start = 100 / (this.length + 1) * i;
        tmpObj.end = tmpObj.start + tmpObj.percent;
        tmpObj.color = getHealthStatus(100 - tmpObj.percent).color;
        list.push(tmpObj);
      });
      return list;
    },
  },
  methods: {
    getClientRect() {
      const box = this.$el.getBoundingClientRect();
      this.width = box.width === 0 ? 960 : box.width;
      this.height = box.height;
    },
    init() {
      this.getClientRect();
      if (this.allH > this.height) {
        this.height = this.allH;
      }
    },
  },
  watch: {
    nodeList() {
      this.init();
    },
  },
  mounted() {
    this.init();
    window.addEventListener('resize', () => this.init());
  },
  updated() {
    this.getClientRect();
  },
};
</script>

<style scoped>
.alaysis-svg{
  width: 100%;
  height: 100%;
}
</style>
