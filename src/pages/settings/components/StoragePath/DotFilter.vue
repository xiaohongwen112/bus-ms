<template>
  <svg width="0" height="0" class="dot-filter-svg">
    <filter id="circle_blur" width="300%" height="300%" x="-50%" y="-50%">
      <feGaussianBlur stdDeviation="2"></feGaussianBlur>
    </filter>
  </svg>
</template>
<script>
export default {
  name: 'DotFilter',
};
</script>
<style scoped>
</style>
