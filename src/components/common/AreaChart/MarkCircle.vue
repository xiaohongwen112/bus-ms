<template>
  <g class="mark-circle">
    <circle :cx="cx" :cy="cy" :r="r" :fill="color" :stroke="color" :fill-opacity="isCircle ? 1 : 0.2" class="out-circle"></circle>
    <circle v-if="!isCircle" :cx="cx" :cy="cy" :r="r-7" :fill="color" stroke="none" class="in-circle"></circle>
  </g>
</template>

<script>

  export default {
    name: 'mark-circle',
    components: {
    },
    props: {
      r: {
        type: Number,
        default: 10,
      },
      cx: {
        type: Number,
        default: 0,
      },
      cy: {
        type: Number,
        default: 0,
      },
      type: {
        type: String,
        default: 'ring', // circle
      },
      color: {
        type: String,
        default: 'red',
      },
    },
    data() {
      return {
      };
    },
    watch: {
    },
    computed: {
      isCircle() {
        return this.type === 'circle';
      },
    },
    methods: {
    },
    mounted() {
    },
  };
</script>

<style lang="scss">
</style>
