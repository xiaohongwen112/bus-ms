<template>
  <line
    :x1="p1.x"
    :x2="p2.x"
    :y1="p1.y"
    :y2="p2.y"
    :cursor="cursorStyle"
    :style="edgeStyle"
    :data-status="status"
    ></line>
</template>
<script>

import * as d3 from 'd3';

const props = {
  p1: {
    type: Object,
    default: () => ({
      x: 1,
      y: 1,
    }),
  },
  p2: {
    type: Object,
    default: () => ({
      x: 1,
      y: 2,
    }),
  },
  size: {
    type: Number,
    default: 2,
  },
  status: {
    type: String,
    default: 'normal',
  },
};

const stats = {
  normal: '#333e42',
  blur: '#333e42',
  highlight: '#f1782d',
};

export default {
  name: 'edge',
  props,
  data() {
    return {
      timer: null,
      drag: d3.drag().on('start', this.dragStarted).on('drag', this.dragged).on('end', this.dragended),
      startPos: {},
    };
  },
  computed: {
    edgeStyle() {
      return {
        stroke: stats[this.status],
        'stroke-width': `${this.size}px`,
      };
    },
    cursorStyle() {
      return this.status === 'highlight' ? 'move' : 'auto';
    },
  },
  methods: {
    dragStarted() {
      this.$emit('dargStart');
      this.startPos = {
        x: d3.event.x,
        y: d3.event.y,
      };
    },
    dragged() {
      if (this.status !== 'highlight') return;
      if (!this.timer) {
        const currentPos = {
          x: d3.event.x,
          y: d3.event.y,
        };
        const pos = {
          x: currentPos.x - this.startPos.x,
          y: currentPos.y - this.startPos.y,
        };
        this.startPos = currentPos;
        this.timer = setTimeout(() => {
          this.timer = null;
          this.$emit('dragged', pos);
        }, 20);
      }
    },
    dragended() {
      this.timer = null;
    },
  },
  mounted() {
    const wrapper = d3.select(this.$el);
    this.drag(wrapper);
  },
};

</script>
