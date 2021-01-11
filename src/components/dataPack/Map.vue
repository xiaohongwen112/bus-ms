<template>
<div class="svg-container" ref="svgContainer">
  <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`">
    <g :transform="transform">
      <Edge v-for="(edge, k) in edges"
        :key="k"
        :p1="getNodeById(edge.nodeA)"
        :p2="getNodeById(edge.nodeB)"
        :size="getEdgeSize(edge)"
        :status="edge.drawProperties.status"
        @dragged="handleEdgeDrag"
      />
      <Node v-for="(node, key) in circles"
        :key="`c${key}`"
        :node="node"
        :index="key"
        :status="node.drawProperties.status"
        :radius="node.size / 2"
        @dargStart="handleNodeDragStart"
        @dragged="handleNodeDrag" />
    </g>
  </svg>
  <!-- <div class="breadcrumb-right">
      <slot name="btnGroup"></slot>
  </div> -->
  <div class="no-data" v-if="nodes.length === 0">该数据包无拓扑关系</div>
</div>
</template>
<script>

import * as d3 from 'd3';
import _ from 'lodash';

import Node from '@/components/dataPack/Node';
import Edge from '@/components/dataPack/Edge';

const props = {
  nodes: {
    type: Array,
    default: () => [],
  },
  edges: {
    type: Array,
    default: () => [],
  },
  ipDevices: {
    type: Object,
    default: () => ({}),
  },
  showMode: {
    type: String,
    default: 'ip',
  },
};

export default {
  name: 'pack-map',
  props,
  components: {
    Node,
    Edge,
  },
  data() {
    return {
      width: 500,
      height: 500,
      radius: 32,
      circles: [],
      wrapper: null,
      color: d3.scaleOrdinal().range(d3.schemeCategory20),
      transform: '',
      zoom: d3.zoom().scaleExtent([1 / 2, 8]).on('zoom', this.handleZoom),
      resizeTimer: null,
      buttons: [
        '源数据包状态',
        '梳理结果1',
        '梳理结果2',
      ],
      nodeSizeConsts: {
        minNodeSize: 8,
        maxNodeSize: 30,
        zeroNodeSize: 12,
      },
      activeButton: 0,
    };
  },
  computed: {
    edgeSizeRage() {
      const weights = _.map(this.edges, e => e.weight);
      const r1 = 0.6;
      const r2 = 0.2;

      weights.sort((a, b) => (a > b ? 1 : -1));

      return {
        low: weights[Math.floor(weights.length * r1)],
        middle: weights[Math.floor(weights.length * (r1 + r2))],
        high: weights[weights.length - 1],
      };
    },
    nodeSizeRanges() {
      const { maxNodeSize, minNodeSize } = this.nodeSizeConsts;
      const deltaSize = maxNodeSize - minNodeSize;
      const lowEdgeSize = minNodeSize + deltaSize * 0.2;
      const middleEdgeSize = lowEdgeSize + deltaSize * 0.4;
      const highEdgeSize = middleEdgeSize + deltaSize * 0.3;
      return [[minNodeSize, lowEdgeSize], [lowEdgeSize, middleEdgeSize], [middleEdgeSize, highEdgeSize], [highEdgeSize, maxNodeSize]];
    },
    nodeWeightRanges() {
      const weights = _.map(this.nodes, e => e.weight);
      let minWeight = weights[0];
      let maxWeight = weights[0];
      let totalWeight = 0;
      _.forEach(weights, (w) => {
        totalWeight += w;
        if (w < minWeight) {
          minWeight = w;
        } else if (w > maxWeight) {
          maxWeight = w;
        }
      });
      const highEdgeWeight = maxWeight + (totalWeight - maxWeight) * 0.6;
      return [[0, minWeight], [minWeight, maxWeight], [maxWeight, highEdgeWeight], [highEdgeWeight, totalWeight]];
    },
    ipDeviceObj() {
      const ipDeviceObj = {};
      if (this.ipDevices &&
        this.ipDevices.include_ips &&
        this.ipDevices.normal_ips) {
        _.forEach(this.ipDevices.include_ips, (p) => {
          ipDeviceObj[p.ip] = p.device;
        });
        _.forEach(this.ipDevices.normal_ips, (p) => {
          ipDeviceObj[p.ip] = p.device;
        });
      }
      return ipDeviceObj;
    },
  },
  methods: {
    updateSvg() {
      this.width = this.$refs.svgContainer.clientWidth;
      this.height = this.$refs.svgContainer.clientHeight;
    },
    circleHasIp(ipObj, circle) {
      return circle.raw && circle.ip_ports.length === 1 && _.get(ipObj, circle.ip_ports[0][0]);
    },
    toggleIpDevices() {
      this.circles = _.map(this.circles, (c) => {
        let name;
        let dName;
        if (this.showMode === 'device') {
          if (this.circleHasIp(this.ipDeviceObj, c)) {
            dName = c.name;
            name = this.ipDeviceObj[c.name];
            return { ...c, name, dName };
          }
        } else {
          if (c.dName) return { ...c, name: c.dName };
        }
        return { ...c };
      });
    },
    resizeHandler() {
      if (!this.resizeTimer) {
        this.resizeTimer = setTimeout(() => {
          this.resizeTimer = null;
          this.updateSvg();
        }, 66);
      }
    },
    initCircles() {
      if (this.nodes.length) {
        this.circles = _.map(this.nodes, n => ({
          ...n,
          x: 50,
          y: 50,
          size: this.getNodeSize(n),
        }));
        this.toggleIpDevices();
        this.setNodesPosition();
      }
    },
    getEdgeSize(edge) {
      if (edge.weight <= this.edgeSizeRage.low) {
        return 2;
      } else if (edge.weight <= this.edgeSizeRage.middle) {
        return 3;
      }
      return 4;
    },
    getNodeSize(node) {
      const defaultV = 12;
      const nodeWeight = node.weight;
      if (nodeWeight === undefined || this.nodeWeightRanges.length === 0 || this.nodeSizeRanges === 0) return defaultV;
      if (nodeWeight === 0) {
        return this.nodeSizeConsts.zeroNodeSize;
      }
      const weightRangeCount = this.nodeWeightRanges.length;
      let weightRangeIndex = weightRangeCount - 1;

      for (let i = 0; i < this.nodeWeightRanges.length; i += 1) {
        if (nodeWeight < this.nodeWeightRanges[i][1]) {
          weightRangeIndex = i;
          break;
        }
      }

      const sizeRangeCount = this.nodeSizeRanges.length;
      let sizeRangeIndex = sizeRangeCount - 1;

      if (weightRangeIndex < sizeRangeCount) {
        sizeRangeIndex = weightRangeIndex;
      }

      const weightRange = this.nodeWeightRanges[weightRangeIndex];
      const sizeRange = this.nodeSizeRanges[sizeRangeIndex];
      let ratio = 0;
      if (weightRange[1] !== weightRange[0]) {
        ratio = Math.min((nodeWeight - weightRange[0]) / (weightRange[1] - weightRange[0]), 1);
      }

      return Math.round(sizeRange[0] + ratio * (sizeRange[1] - sizeRange[0]));
    },
    setNodesPosition() {
      const d3Circles = [];
      const d3CirclesMap = {};
      const d3Edges = [];
      const nodeCount = _.keys(this.nodes).length;

      _.forEach(this.nodes, (n, i) => {
        const tn = {
          id: n.id,
          x: i / nodeCount * this.width + 5 * (i % 2),
          y: i / nodeCount * this.height + 5 * ((i + 1) % 2),
          fixed: false,
        };
        d3Circles.push(tn);
        d3CirclesMap[tn.id] = tn;
      });

      _.forEach(this.edges, (edge) => {
        d3Edges.push({
          source: d3CirclesMap[edge.nodeA],
          target: d3CirclesMap[edge.nodeB],
        });
      });

      const k = Math.sqrt(d3Circles.length * 1.0 / (this.width * this.height));
      const linkDistance = this.nodeSizeConsts.maxNodeSize + 40;
      const charge = -10 / k;
      const gravity = 100 * k;
      const layoutHeight = this.height;
      const layoutWidth = this.width;

      const maxLoop = nodeCount * nodeCount;

      const force = window.d3.layout.force()
        .charge(charge)
        .gravity(gravity)
        .linkDistance(linkDistance)
        .nodes(d3Circles)
        .links(d3Edges)
        .size([layoutWidth, layoutHeight]);
      // xiao 两个点报错问题点
      force.start();
      for (let i = 0; i < maxLoop + 10; i += 1) {
        force.tick();
      }
      force.stop();

      const offsetX = 0;
      const offsetY = 0;
      const factor = 1.0;

      const poses = [];
      force.nodes().forEach((node) => {
        const pos = {
          x: node.x / factor + offsetX,
          y: node.y / factor + offsetY,
        };
        poses.push(pos);
      });

      this.circles = _.map(this.circles, (c, i) => ({ ...c, ...poses[i] }));
    },
    initDom() {
      this.updateSvg();
      this.wrapper = d3.select(this.$el);
      this.initCircles();
      this.zoom(this.wrapper);
      window.addEventListener('resize', this.resizeHandler, false);
    },
    handleZoom() {
      this.transform = d3.event.transform;
    },
    handleNodeDragStart(index) {
      if (index !== this.circles.length - 1) {
        const theNode = this.circles[index];
        this.circles.splice(index, 1);
        this.circles.push(theNode);
      }
    },
    handleNodeDrag(node, pos) {
      const theNode = { ...this.circles[this.circles.length - 1], ...pos };

      this.$set(this.circles, this.circles.length - 1, theNode);
    },
    handleEdgeDrag(pos) {
      _.forEach(this.circles, (c) => {
        if (c.drawProperties.status === 'normal') {
          c.x += pos.x; // eslint-disable-line
          c.y += pos.y; // eslint-disable-line
        }
      });
    },
    getNodeById(id) {
      const result = _.find(this.circles, { id });
      return result;
    },
  },
  watch: {
    nodes(newVal) {
      if (newVal) {
        this.initCircles();
      }
    },
    showMode(newV, oldV) {
      if (newV !== oldV) this.toggleIpDevices();
    },
  },
  mounted() {
    this.initDom();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler, false);
  },
};
</script>
<style lang="scss" scoped>

div.svg-container{
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
}
.no-data {
  position: absolute;
  border: 1px solid rgb(26, 78, 92);
  background: rgb(5, 21, 34);
  font-size: 26px;
  color: rgb(238, 238, 238);
  text-align: center;
  width: 350px;
  height: 100px;
  line-height: 100px;
  left: calc(50% - 175px);
  top: calc(50% - 50px);
  border-radius: 15px;
}
</style>
