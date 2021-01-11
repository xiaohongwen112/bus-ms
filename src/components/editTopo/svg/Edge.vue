<template>
  <g style="cursor: pointer" @mouseover="onMouseOver" @mouseout="onMouseout">
    <path :d="attrs.path" stroke="transparent" :stroke-width="strokeWidth * 5" fill="none" :style="isPre ? {pointerEvents: 'none'} : null"></path>
    <path class="linkArrow" :d="attrs.path" :stroke="lineStroke" :stroke-width="strokeWidth" fill="none" marker-end="url(#linkArrow)" :style="isPre ? {pointerEvents: 'none'} : null"></path>  
    <g style="pointer-events: none; visibility: visible;">
      <circle :cx="attrs.x1" :cy="attrs.y1" :r="r * 7 / 8" :fill="dotFill" :stroke-width="r / 4" :stroke="dotStroke"></circle>
      <circle :cx="attrs.x1" :cy="attrs.y1" :r="r * 3 / 8" :fill="dotFill" :stroke-width="r / 4" :stroke="dotStroke"></circle>
    </g>
    <g style="pointer-events: none; visibility: visible;">
      <circle :cx="attrs.x2" :cy="attrs.y2" :r="r * 7 / 8" :fill="dotFill" :stroke-width="r / 4" :stroke="dotStroke"></circle>
      <circle :cx="attrs.x2" :cy="attrs.y2" :r="r * 3 / 8" :fill="dotFill" :stroke-width="r / 4" :stroke="dotStroke"></circle>
    </g>
    <g class="linkBtnGroup" v-show="buttonVisible">
      <rect fill="transparent" width="34" height="20" :x="attrs.delX - delSize -1" :y="attrs.delY - delSize"></rect>
      <image @click="onDeleteEdge" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../../assets/deleteLink.svg" :width="delSize" :height="delSize" :x="attrs.delX + 1" :y="attrs.delY - delSize"></image>
      <image v-if="edge.sourceNodeType !== 'container' && edge.targetNodeType !== 'container' " @click="onConfigure" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../../assets/sourceConfig.svg" :width="delSize" :height="delSize" :x="attrs.delX - delSize - 1" :y="attrs.delY - delSize"></image>
    </g>
  </g>
</template>

<script>

import EdgeClass from '../models/Edge';

const props = {
  edge: {
    type: Object,
    default: new EdgeClass(-1),
  },
  hasDot: {
    type: Boolean,
    default: true,
  },
  isPre: {
    type: Boolean,
    default: false,
  },
  dotFill: {
    type: String,
    default: '#153344',
  },
  dotStroke: {
    type: String,
    default: '#00E1CD',
  },
  strokeWidth: {
    type: Number,
    default: 3,
  },
  bugleDirection: {
    type: String,
    default: null, // 连线的凸起方向，值为"right","left","null";
  },
  textHeight: {
    type: Number,
    default: 16,
  },
  markerWidth: {
    type: Number,
    default: 3,
  },
  className: {
    type: String,
    default: 'link',
  },
};

export default {
  name: 'edge',
  props,
  data() {
    return {
      delSize: 16,
      buttonVisible: false,
      r: EdgeClass.r,
      bugleDistance: EdgeClass.bugleDistance,
      lineStroke: '#00DFC4',
    };
  },
  computed: {
    attrs() {
      const { bugleDirection, source, target } = this.edge;
      const { r, bugleDistance } = this;
      const { x: x1, y: y1 } = source;
      const { x: x2, y: y2 } = target;
      const d = Math.pow((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1), 0.5);
      const _x1 = d ? ((x2 - x1) * (r / d) + x1) : (x1);
      const _y1 = d ? ((y2 - y1) * (r / d) + y1) : (y1);
      const _x2 = (x2 - x1 > 0 ? -1 : 1) * r + x2;
      const _y2 = y2;
      const delX = (x2 - x1) / 2 + x1;
      const delY = (y2 - y1) / 2 + y1;
      let dx;
      if (_x1 <= _x2) { // 默认为左向
        if (bugleDirection === 'right') {
          dx = _x2 + bugleDistance;
        } else {
          dx = _x2 - bugleDistance;
        }
      } else { // 默认为右向
        if (bugleDirection === 'left') {
          dx = _x2 - bugleDistance;
        } else {
          dx = _x2 + bugleDistance;
        }
      }
      const path = `M${_x1},${_y1}L${dx},${_y2}L${_x2},${_y2}`;
      return { d, dx, delX, delY, path, x1, x2, y1, y2 };
    },
  },
  methods: {
    onMouseOver() {
      // TO-DO: 调整edges顺序
      this.buttonVisible = true;
      this.lineStroke = '#CFF1EE';
    },
    onMouseout() {
      this.buttonVisible = false;
      this.lineStroke = '#00DFC4';
    },
    onDeleteEdge() {
      // console.log('Delete Edge');
      this.$emit('delete-edge', this.edge);
    },
    onConfigure() {
      // console.log('Configure Edge', this.edge);
      // this.$store.dispatch('showSourceConfig', this.edge);
      this.$store.commit('SHOW_SOURCE_CONFIG', {
        srcId: this.edge.sourceNodeId,
        dstId: this.edge.targetNodeId,
      });
      // this.$emit('edit-edge', {
      //   srcId: this.edge.sourceNodeId,
      //   dstId: this.edge.targetNodeId,
      // });
    },
  },
};
</script>
