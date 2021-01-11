<template>
  <g
    :data-status="status"
  >
    <circle
      :cx="node.x"
      :cy="node.y"
      :r="radius"
      :style="nodeStyle"
      cursor="pointer"
      @click="editNode"
      ></circle>
    <text
      v-if="showText"
      :x="node.x - 2"
      :y="node.y - radius- 3"
      text-anchor="middle"
      stroke="none" fill="#777777"
      font-family="SourceHanSansCN-Normal"
      font-size="12px"
      pointer-events="none"
      stroke-width="1.5"
    >{{node.name}}</text>
  </g>
</template>

<script>

import * as d3 from 'd3';

const props = {
  showText: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    default: 'normal',
  },
  node: {
    type: Object,
    default: () => ({
      x: 100,
      y: 100,
      id: 0,
    }),
  },
  radius: {
    type: Number,
    default: 10,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: 'red',
  },
  index: {
    type: Number,
    default: 0,
  },
};

// const fillStats = {
//   normal: '#0086a6',
//   blur: '#042c38',
// };

const strokeStats = {
  normal: 'white',
  blur: '333e42',
};

export default {
  name: 'map-node',
  props,
  data() {
    return {
      timer: null,
      drag: d3.drag().on('start', this.dragStarted).on('drag', this.dragged).on('end', this.dragended),
    };
  },
  methods: {
    dragStarted() {
      this.$emit('dargStart', this.index, this.node);
    },
    dragged() {
      if (!this.timer) {
        const pos = {
          x: d3.event.x,
          y: d3.event.y,
        };
        this.timer = setTimeout(() => {
          this.timer = null;
          this.$emit('dragged', this.node, pos);
        }, 20);
      }
    },
    dragended() {
      this.timer = null;
    },
    editNode() {
      const aa = 'fill: rgb(63, 155, 47); stroke: white; stroke-width: 2px';
      this.$el.childNodes[0].attributes.style.nodeValue = aa;
      const nodeName = this.$el.childNodes[2].innerHTML;
      console.log(nodeName);
    },
  },
  computed: {
    nodeStyle() {
      return {
        // fill: fillStats[this.status],
        fill: this.node.raw ? '#0086a6' : '#3f9b2f', // 判断是否为已编辑节点
        stroke: strokeStats[this.status],
        'stroke-width': '2px',
      };
    },
  },
  mounted() {
    const wrapper = d3.select(this.$el);
    this.drag(wrapper);
  },
};

</script>
