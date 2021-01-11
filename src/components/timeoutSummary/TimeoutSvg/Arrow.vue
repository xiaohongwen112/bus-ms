<template>
  <g>
    <line x1="102.7" y1="90" class="top-arrow" x2="222.4" y2="90"/>
    <polyline class="top-arrow" transform="translate(46.5, 0)" points="172.6,94.1 176.2,90.5 172.6,87"/>
    <line x1="102.7" y1="101" class="bottom-arrow" x2="223.4" y2="101"/>
    <polyline class="bottom-arrow" points="107.1,104.7 103.5,101.1 107.1,97.6 		"/>
  </g>
</template>

<script>
export default {
  name: 'Arrow',
};
</script>

<style <style lang="scss" scoped>
line{
  stroke-width:1.8; stroke:rgba(255,255,255, 0.2);
}
polyline{
  fill:none;stroke:rgba(255,255,255, 0.2);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;
}
.arrow-1 .top-arrow{
  stroke:#6FC5C3;
}
.arrow-2 .bottom-arrow{
  stroke:#34A1DC;
}
</style>
