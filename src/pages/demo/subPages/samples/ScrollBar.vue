<template>
  <div>
<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <g id="Port">
      <circle style="fill: white;" r="10"/>
    </g>
  </defs>
 
  <text y="15">black</text>
  <use x="50" y="10" href="#Port" />
  <text y="35">red</text>
  <use x="50" y="30" href="#Port" class="classA"/>
  <text y="55">blue</text>
  <use x="50" y="50" href="#Port" style="fill: blue;"/>
</svg>

  <ScrollBar class="scroll-area" v-once :options="settings" @ps-scroll-y="scrollHandler">
    <img src="http://lorempixel.com/800/600/" height="720" width="1280" alt="">
  </ScrollBar>

  <ScrollBar class="scroll-area" v-once :options="settings" @ps-scroll-y="scrollHandler" :left="true">
    <img src="http://lorempixel.com/800/600/" height="720" width="1280" alt="">
  </ScrollBar>

  </div>

</template>
<script>
import ScrollBar from '@/components/common/ScrollBar';

export default {
  components: {
    ScrollBar,
  },
  name: 'scroll-bar',
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
      },
    };
  },
  methods: {
    scrollHandler(evt) {
      console.log(evt);
    },
  },
};

</script>
<style lang="scss">
.scroll-area {
  position: relative;
  margin: auto;
  width: 400px;
  height: 300px;
}
</style>
