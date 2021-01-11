<template>
  <div class="template-box" @click="$emit('create')">
    <svg class="createSvg" id="createSvg" viewBox="0,0,50,50" width="300" height="350">
      <defs>
        <g id="corner" class="corner">
          <polyline points="2,10 2,2 10,2"></polyline>
        </g>
        <g id="centerLine" class="centerLine">
          <line x1="-5" y1="0" x2="5" y2="0"></line>
        </g>
      </defs>
      <g class="svgContent">
        <use x="0" y="0" transform="rotate(0)" xlink:href="#corner"></use>
        <use x="50" y="0" transform="rotate(90,50,0)" xlink:href="#corner"></use>
        <use x="50" y="50" transform="rotate(180,50,50)" xlink:href="#corner"></use>
        <use x="0" y="50" transform="rotate(270,0,50)" xlink:href="#corner"></use>
        <circle class="svgCircle" cx="25" cy="25" r="10"></circle>
        <use xlink:href="#centerLine" x="25" y="25"></use>
        <use xlink:href="#centerLine" x="25" y="25" transform="rotate(90,25,25)"></use>
      </g>
    </svg>
  </div>
</template>
<script>
export default {
  name: 'create-template-card',
};
</script>
<style lang="scss" scoped>

.template-box {
  float: left;
  width: 300px;
  height: 380px;
  background: transparent;
  color: rgb(0,223,244);
  margin: 0 10px;
  border-radius: 5px;
  box-shadow: 1px 1px 15px #020B12;
  box-sizing: border-box;

  .corner {
    stroke-width: 1px;
    stroke: #0f8ca9;
    fill: transparent;
    transform: translate(7.3px, 7.3px);
    transition: transform 0.3s;
  }

  .centerLine {
    stroke-width: 1px;
    stroke: rgb(48,65,77);
    fill: transparent;
  }

  .svgCircle {
    fill: #031826;
  }

  svg:hover {
    .corner {
      transform: translate(1.666px, 1.666px);
      transition: transform 0.3s linear;
    }
  }
}

</style>
