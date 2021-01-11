<template>
  <svg :x="startPos" :width="200" height="3000" xmlns="http://www.w3.org/2000/svg" @click="onClick">
    <rect x="0" y="0" :width="200" height="30" fill="purple" filter="url(#inShadow)" />
    <text x="100" y="15" fill="#fff">+添加分组</text>
  </svg>

</template>
<script>

const props = {
  startPos: {
    type: Number,
    default: 0,
  },
};

export default {
  name: 'group-ctrl',
  props,
  methods: {
    onClick() {
      this.$emit('create-group', this.startPos);
    },
  },
};

</script>

<style scoped>
  text{
    text-anchor: middle;
    dominant-baseline: middle;
    cursor: pointer;
  }
  rect{
    cursor: pointer;
  }
</style>


