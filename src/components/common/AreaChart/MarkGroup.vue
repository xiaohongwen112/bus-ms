<template>
  <g class="mark-item" :transform="`translate(${x},${y})`"
     @mouseover="hover($event)"
     @mousemove="move($event)"
     @mouseleave="out($event)"
  >
    <line v-if="line" v-show="show" class="line-show" stroke-width="2" :stroke="lineColor" fill="none" x1="0" y1="0" x2="0" :y2="height"></line>
    <slot :name="id"></slot>
    <!--<mark-circle :cx="0" :cy="cy" :color="circleColor"></mark-circle>-->
    <rect class="line-rect" x="0"  y="0" :width="width" :height="height" fill="transparent"></rect>
  </g>
</template>

<script>

  export default {
    name: 'mark-group',
    components: {
    },
    props: {
      id: {
        type: String,
        default: 'red',
      },
      index: {
        type: Number,
        default: 0,
      },
      x: {
        type: Number,
        default: 0,
      },
      y: {
        type: Number,
        default: 0,
      },
      show: {
        type: Boolean,
        default: false,
      },
      line: {
        type: Boolean,
        default: true,
      },
      width: {
        type: Number,
        default: 0,
      },
      height: {
        type: Number,
        default: 0,
      },
      lineColor: {
        type: String,
        default: '#3a4b5c',
      },
    },
    data() {
      return {};
    },
    watch: {},
    computed: {},
    methods: {
      hover(e) {
        this.$emit('hover', { e, index: this.index });
      },
      move(e) {
        this.$emit('move', { e, index: this.index });
      },
      out(e) {
        this.$emit('out', { e, index: this.index });
      },
    },
    mounted() {
    },
  };
</script>

<style lang="scss" scoped>
  .mark-item{
    cursor: pointer;
  }
</style>
