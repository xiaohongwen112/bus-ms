<template>
  <g class="node-group">
    <rect class="node-bg" :x="index * gridW" y="32" rx="0" ry="0" 
      :width="2 * gridW" height="42" :fill="active ? `#00616c` : `#193845`" fill-opacity="0.5"></rect>
    <line class="node-line" :x1="lineX1" y1="53" :x2="lineX1 + gridW" y2="53" stroke="#2392a9"></line>
    <g class="node-source">
      <rect :x="sNodeX" :y="sNodeY" rx="15" ry="15" :width="nodeW" :height="nodeH"
        fill="#083136" stroke="#2392a9"></rect>
      <foreignObject :x="lineX1 - 51" y="43" width="106" height="26">
        <div class="node-name" @mouseover="moveTip" @mouseout="showNameFlag = false">
          {{ node.source }}
        </div>
      </foreignObject>
    </g>
    <g class="node-target" :transform="`translate(${gridW}, 0)`">
      <rect :x="sNodeX" :y="sNodeY" rx="15" ry="15" :width="nodeW" :height="nodeH"
        fill="#083136" stroke="#2392a9"></rect>
      <!-- <text :x="lineX1" y="58" fill="#eee" text-anchor="middle">
        {{ node.target }}
      </text> -->
      <foreignObject :x="lineX1 - 51" y="43" width="106" height="26">
        <div class="node-name" @mouseover="moveTip" @mouseout="showNameFlag = false">
          {{ node.target }}
        </div>
      </foreignObject>
    </g>
    <TransAlaysisFlow :transform="`translate(0, ${15+60})`" 
        :width="allW" :start="node.start" :end="node.end"
        :text="`${node.time}ms`" :color="node.color"
        :hasTime="hasTime"
      />
      <foreignObject
        v-show="showNameFlag"
        :x="0"
        y="13"
        width="100%" height="120" 
        >
        <ShowNameBox :showTips="true"
        :showName = "showTipsName"
        :lefts = "tipX"
        :top = "-5">
          {{ showTipsName }}
        </ShowNameBox>
      </foreignObject>
  </g>
</template>

<script>
import { scaleLinear } from 'd3';
import TransAlaysisFlow from '@/components/stat/TransAlaysisFlow';
import ShowNameBox from '@/components/manageApp/main/ShowNameBox';

export default {
  name: 'TransAlaysisNode',
  components: {
    TransAlaysisFlow,
    ShowNameBox,
  },
  props: {
    index: {
      default: 0,
    },
    node: {
      default() {
        return {};
      },
    },
    allW: {
      default: 0,
    },
    gridW: {
      default: 0,
    },
    active: {
      default: false,
    },
  },
  data() {
    return {
      nodeW: 108,
      nodeH: 26,
      showNameFlag: false,
      showTipsName: '',
      tipX: 0,
      tipY: 0,
    };
  },
  computed: {
    scaleLinear() { return scaleLinear().domain([0, 100]).range([0, this.allW]); },
    lineX1() { return (0.5 + this.index) * this.gridW; },
    sNodeX() { return (0.5 + this.index) * this.gridW - 0.5 * this.nodeW; },
    sNodeY() { return 53 - 0.5 * this.nodeH; },
    hasTime() { return this.allW !== 2 * this.gridW; },
  },
  methods: {
    moveTip(e) {
      const ele = e.target;
      if (ele.clientWidth !== ele.scrollWidth) {
        // this.tipX = ele.getBoundingClientRect().left - ele.getBoundingClientRect().width / 2;
        // this.tipY = ele.getBoundingClientRect().top - 30;
        this.tipX = ele.getBoundingClientRect().left - ele.scrollWidth / 2 - ele.getBoundingClientRect().width / 2;
        this.showNameFlag = true;
        this.showTipsName = e.target.innerText;
      }
    },
  },
};
</script>

<style>
.node-name{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
