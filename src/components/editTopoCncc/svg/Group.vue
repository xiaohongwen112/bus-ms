<template>
  <g class="group">
    <svg 
      :x="group.x - 1"
      :y="group.y - 1"
      :width="group.width + 4"
      :height="group.height + 4"
      @mouseover="buttonVisible = true"
      @mouseout="buttonVisible = false"
      xmlns="http://www.w3.org/2000/svg"
      opacity="0.5"
      class="container-group"
    >
      <rect x="0" y="0" :width="group.width + 2" :height="group.height + 2" fill="rgba(113, 156, 187, 0.15)" @click="onClickGroup" />
      <line y1="0" :x1="1" :x2="1" :y2="group.height" :stroke-width="lineWidth" stroke="#1367a2"></line>
      <line y1="1" :x1="0" :x2="group.width" :y2="1" :stroke-width="lineWidth" stroke="#1367a2"></line>
      <line y1="0" :x1="group.width + 1" :x2="group.width + 1" :y2="group.height" :stroke-width="lineWidth" stroke="#1367a2"></line>
      <line y1="0" :x1="group.width" :x2="group.width" :y2="group.height" stroke-width="20" stroke="transparent" ref="right"  class="col-line"></line>
      <line :y1="group.height + 1" :x1="0" :x2="group.width" :y2="group.height + 1" :stroke-width="lineWidth" stroke="#1367a2"></line>
      <line :y1="group.height" :x1="0" :x2="group.width + 2" :y2="group.height" stroke-width="20" stroke="transparent" ref="bottom"  class="row-line"></line>
    </svg>
    <svg
      :x="group.x + group.width - 25"
      :y="group.y"
    >
      <image
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xlink:href="../../../assets/topo-icon/containerCollapse.svg"
        width="25"
        height="25"
        x="0"
        y="0"
        :style="{cursor: 'pointer'}"
        @click="collapseGroup"
      ></image>
    </svg>
  </g>
</template>

<script>

// import _ from 'lodash';
import { drag as D3Drag } from 'd3-drag';
import { select as D3Select, event as D3Event } from 'd3-selection';

import * as u from '../../../pages/editTopoCncc/utils';
import GroupClass from '../models/Group';

const props = {
  group: {
    type: Object,
    default: () => new GroupClass({ x: 0, y: 0 }),
  },
};

export default {
  name: 'group',
  props,
  data() {
    return {
      buttonVisible: false,
      lineWidth: 3,
      dragRight: D3Drag().on('start', this.dragStarted).on('drag', this.draggedRight).on('end', this.dragEnded),
      dragBottom: D3Drag().on('start', this.dragStarted).on('drag', this.draggedBottom).on('end', this.dragEnded),
    };
  },
  computed: {
    // 找自己
    tContainer() {
      return u.getContainerByGroup(this.$store.state.nodes, this.group);
    },
    // 找爸爸
    parentGroup() {
      return u.getParent(this.$parent.groups, this.tContainer);
    },
    // 找兄弟
    siblings() {
      return u.getSiblings(this.$store.state.nodes, this.parentGroup, this.tContainer);
    },
    // 组右边的兄弟
    allRightSiblings() {
      return u.getNodeRightSiblings(this.siblings, this.tContainer);
    },
    // 组下边的兄弟
    allBottomSiblings() {
      return u.getNodeBottomSiblings(this.siblings, this.tContainer);
    },
    // 组正右边的兄弟
    rightSiblings() {
      return u.getGroupRightSiblings(this.siblings, this.group);
    },
    // 组正下边的兄弟
    bottomSiblings() {
      return u.getGroupBottomSiblings(this.siblings, this.group);
    },
    // 找儿子
    cNodes() {
      return u.getGroupChildren(this.$store.state.nodes, this.group);
    },
    // 找儿子
    cGroups() {
      return u.getGroupChildrenGroup(this.$parent.groups, this.cNodes);
    },
    minX() {
      return Math.max.apply(null, [200].concat(this.cNodes.map(cn => cn.x + 200), this.cGroups.map(cg => cg.x + cg.width)));
    },
    maxX() {
      if (!this.parentGroup) return Infinity;
      if (!this.rightSiblings.length) return this.parentGroup.x + this.parentGroup.width;
      return this.parentGroup.width - (this.rightSiblings[this.rightSiblings.length - 1].x - this.rightSiblings[0].x + 200) + this.parentGroup.x;
    },
    minY() {
      return Math.max.apply(null, [100].concat(this.cNodes.map(cn => cn.y + 100), this.cGroups.map(cg => cg.y + cg.height)));
    },
    maxY() {
      if (!this.parentGroup) return Infinity;
      if (!this.bottomSiblings.length) return this.parentGroup.y + this.parentGroup.height;
      return this.parentGroup.height - (this.bottomSiblings[this.bottomSiblings.length - 1].y - this.bottomSiblings[0].y + 100) + this.parentGroup.y;
    },
  },
  methods: {
    dragStarted() {
    },
    draggedRight() {
      let { x } = D3Event;
      if (x < 200) {
        x = 200;
      }
      let rw;
      let canDrag = true;
      // 向右
      if (x >= this.group.width) {
        rw = (x % 200 === 0 ? Math.ceil(x / 200) : Math.ceil(x / 200) - 1) * 200;
        canDrag = this.group.x + rw <= this.maxX;
      // 向左
      } else {
        rw = Math.ceil(x / 200) * 200;
        canDrag = this.group.x + rw >= this.minX;
      }
      const dw = rw - this.group.width;
      if (canDrag && dw !== 0) {
        this.$emit('draggedRight', this.group, dw, this.parentGroup, this.rightSiblings, this.allRightSiblings);
        this.group.setWidth(rw);
      }
    },
    draggedBottom() {
      let { y } = D3Event;
      if (y < 100) {
        y = 100;
      }
      let rh;
      let canDrag = true;
      // 向下
      if (y >= this.group.height) {
        rh = (y % 100 === 0 ? Math.ceil(y / 100) : Math.ceil(y / 100) - 1) * 100;
        canDrag = this.group.y + rh <= this.maxY;
      // 向上
      } else {
        rh = Math.ceil(y / 100) * 100;
        canDrag = this.group.y + rh >= this.minY;
      }
      const dh = rh - this.group.height;
      if (canDrag && dh !== 0) {
        this.$emit('draggedBottom', this.group, dh, this.parentGroup, this.bottomSiblings, this.allBottomSiblings);
        this.group.setHeight(rh);
      }
    },
    dragEnded() {
      this.$emit('expand', this.group);
    },
    collapseGroup() {
      this.$emit('collapse', this.group);
    },
    onClickGroup() {
      console.log('onClickGroup', this.$parent);
      this.$parent.cancelPreEdge();
    },
  },
  watch: {
  },
  mounted() {
    this.dragRight(D3Select(this.$refs.right));
    this.dragBottom(D3Select(this.$refs.bottom));
  },
};
</script>
<style>
line {
  shape-rendering: crispEdges;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 15, 5;
}

line.col-line {
  cursor: col-resize;
}

line.row-line {
  cursor: row-resize;
}

input {
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0);
  text-align: center;
  outline: none;
  border: 0;
}

::-webkit-input-placeholder { /* WebKit browsers */
    color:    #ddd;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color:    #ddd;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
    color:    #ddd;
}
:-ms-input-placeholder { /* Internet Explorer 10+ */
    color:    #ddd;
}
</style>

