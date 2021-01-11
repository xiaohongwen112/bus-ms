<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="dount-svg">
    <g :transform="`translate(${width / 2}, ${height / 2})`">
      <path v-for="(item, index) in path"
        :key="index"
        :fill="color[index]"
        :d="item"></path>
      <text v-for="(item, index) in dataset"
        :key="`text${index}`"
        style=""
        :transform="`translate(${getTextPos(index)})`"
        >{{ item.name }}</text>
    </g>
  </svg>
</template>
<script>
import { pie, arc } from 'd3';

export default {
  name: 'DountChart',
  props: {
    dataset: {
      type: Array,
      default() {
        return [{ code: '', name: '德语', value: 5 },
        { code: '', name: '韩语', value: 10 },
        { code: '', name: '日语', value: 20 },
        { code: '', name: '中文', value: 45 },
        { code: '', name: '其他', value: 6 }];
      },
    },
  },
  data() {
    return {
      width: 300,
      height: 300,
      svgR: 150,
      outerR: 130,
      innerR: 90,
    };
  },
  computed: {
    color() {
      const colorArr = ['#66e690', '#7bdb74', '#a1d271', '#82bf9a', '#e0e46e', '#c8ce81', '#83c89a', '#83c4b7', '#90a7bd',
        '#6dcde3', '#e66495', '#d46b6a', '#df8c5f', '#da9779', '#c4da77', '#b56ed2', '#a684be', '#7e7cc8', '#719ed5', '#408bd7'];
      colorArr.sort(() => 0.5 - Math.random());
      return colorArr;
    },
    pies() { return pie().value(d => d.value)(this.dataset); },
    path() {
      const arcs = [];
      this.dataset.forEach((d, index) => {
        const arcData = arc().innerRadius(this.innerR).outerRadius(this.outerR)
          .startAngle(this.pies[index].startAngle)
          .endAngle(this.pies[index].endAngle)();
        arcs.push(arcData);
      });
      return arcs;
    },
  },
  methods: {
    getTextPos(index) {
      const pos = arc().innerRadius(this.outerR).outerRadius(this.outerR + 30).centroid(this.pies[index]);
      return pos;
    },
    getBox() {
      const box = this.$el.getBoundingClientRect();
      this.width = box.width;
      this.height = box.height;
      this.svgR = Math.min(this.width, this.height) / 2 - 16;
      this.outerR = this.svgR - 20;
      this.innerR = this.outerR / 2;
    },
  },
  mounted() {
    this.getBox();
    window.addEventListener('resize', () => this.getBox());
  },
};
</script>
<style lang="scss">
.dount-svg{
  width: 100%;
  height: 100%;
  text{
    fill: #fff;
    text-anchor: middle;
    font-size: 12px;
  }
}
</style>
