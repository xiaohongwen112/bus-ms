<template>
  <svg viewBox="0,0,225,200" width="225" height="200" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(112.5,100)">
      <!-- <img src="../../assets/stat/snap_circle.svg" width="200" height="200"> -->
      <image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../assets/stat/snap_circle.svg" width="200" height="200" x="-100" y="-100" class="lightImage" preserveAspectRatio="none meet" style="pointer-events: none;">
      </image>
    <text class="snap-data-content" text-anchor="middle" dx="0" dy="-6"> {{ data.digit }} </text>
    <text class="snap-data-tit" text-anchor="middle" dx="0" dy="20"> {{ data.text }} </text>
    </g>
  </svg>
</template>
<script>
export default {
  name: 'SawtoothCircle',
  props: {
    data: {
      type: Object,
      default() {
        return {
          digit: '--',
          text: '--',
        };
      },
    },
  },
};
</script>
<style lang="scss" scoped>
  .snap-data-tit,.snap-data-content{
    fill:#4bd0ec;
  }
  .snap-data-tit {
    font-size: 16px;
  }
  .snap-data-content {
    font-size: 26px;
    font-weight: 600;
  }
</style>
