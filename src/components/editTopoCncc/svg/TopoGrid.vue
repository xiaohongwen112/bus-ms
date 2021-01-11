<template>
  <g class="container topo-grid">
    <g class="x axis" style="pointer-events: none">
      <line v-for="(x, key) in axisXArr" :key="key" y1=0 :x1="x" :x2="x" :y2="yEnd"></line>
    </g>
    <g class="y axis" style="pointer-events: none">
      <line v-for="(y, key) in axisYArr" :key="key" x1=0 :y1="y" :y2="y" :x2="xEnd"></line>
    </g>
  </g>
</template>
<script>
import _ from 'lodash';

const props = {
  link: {
    type: Object,
    default: null,
  },
  parentWidth: 0,
  parentHeight: 0,
  translateX: {
    type: Number,
    default: 0,
  },
  translateY: {
    type: Number,
    default: 0,
  },
  scale: {
    type: Number,
    default: 1,
  },
  node: {
    type: Object,
    default: () => ({
      class_name: 'node',
      marginLeft: 35,
      width: 200,
      height: 100,
      marginTop: 10,
      textHeight: 15,
      iconPos: {
        left: 15,
        bottom: 10,
      },
      iconSize: {
        width: 40,
        height: 40,
      },
      logoPos: {
        right: 15,
        bottom: 10,
      },
      logoSize: {
        width: 40,
        height: 40,
      },
    }),

  },
  scroll: {
    type: Object,
    default: () => ({
      step: 20,
      left: 0,
      right: 30,
      top: 0,
      bottom: 30,
    }),
  },
};

export default {
  name: 'topo-grid',
  props,
  data() {
    return {
      xys: {
        axisX: 0,
        axisY: 0,
        scale: this.scale,
      },
    };
  },
  watch: {
    scale() {
      this.xys.scale = this.scale;
    },
  },
  computed: {
    xEnd() {
      const { axisX } = this.xys;
      return (this.parentWidth + this.translateX) / 1 + axisX;
    },
    yEnd() {
      const { axisY } = this.xys;
      return (this.parentHeight + this.translateY) / 1 + axisY;
    },
    axisXArr() {
      const { axisX } = this.xys;
      return _.range(0, this.xEnd, axisX);
    },
    axisYArr() {
      const { axisY } = this.xys;
      return _.range(0, this.yEnd, axisY);
    },
  },
  methods: {
  },
  mounted() {
//    this.xys.scale = 0.5;
    this.xys.axisX = this.node.width;
    this.xys.axisY = this.node.height;
  },

};
</script>
<style scoped>
.axis line {
    fill: none;
    stroke: #5F6075;
    shape-rendering: crispEdges;
    vector-effect: non-scaling-stroke;
    stroke-dasharray: 0.5,1;
}
</style>
