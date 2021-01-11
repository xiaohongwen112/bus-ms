<template>
  <svg class="" width="0" height="0">
    <defs>
      <filter id="ringFilter" x="-10" y="-10" width="20" height="20">
        <feGaussianBlur stdDeviation="5" in="SourceGraphic" result="Gau1"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="Gau1"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    </defs>
  </svg>
</template>

<script>
export default {
  name: 'ServerGaugeDefs',
};
</script>

<style scoped>
</style>
