<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="pieSvg" viewBox="0 0 250 250">
    <g id="pie_content_g" transform="translate(125,125)">
      <g class="slices">
        <path class="slice" v-for="(item, index) in data" :key="`slice${index}`"      
              :d="dataPath[index]"
              :fill="item.color"
              ></path>
      </g>
      <g class="labels"></g>
      <g class="lines"></g>
      <image xlink:href="../../../../assets/settings/generatePieLight.png" width="180" height="180" x="-90"
             y="-90" preserveAspectRatio="none meet"></image>
    </g>
  </svg>
</template>

<script>
import { pie, arc } from 'd3';

export default {
  name: 'StorageSvg',
  props: {
    data: {
      type: Array,
      default() {
        return [
          { name: '可用空间', code: '', value: 123333, str: '12.34GB', color: '#519a4c' },
          { name: '业务流数据', code: '', value: 823333, str: '12Gb', color: '#BC1B67' },
          { name: '数据库', code: '', value: 323333, str: '12Kb', color: '#54b5b3' },
        ];
      },
    },
  },
  data() {
    return {
      radius: 45,
    };
  },
  computed: {
    pie() {
      return pie().value(d => d.value)(this.data);
    },
    dataPath() {
      return this.pie.map(d => arc()({
        innerRadius: 50,
        outerRadius: 85,
        startAngle: d.startAngle,
        endAngle: d.endAngle,
      }));
    },
  },
};
</script>

<style>
</style>
