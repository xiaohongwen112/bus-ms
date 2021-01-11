<template>
  <svg class="pie-3d-svg">
    <g class="focus" v-if="data.length > 0">
      <g :transform="`translate(${pieX},${pieY}) rotate(${rotate})`" class="slices">
        <path class="bottomSlice"
          v-for="(item, index) in pieData"
          :key="`slices${index}`"
          :fill="color[index]"
          :d="pieBottom(item, rx - .5, ry - .5, ir, h)"
        ></path>
        <path class="side"
          fill="#222"
          v-for="(item, index) in pieData"
          :key="`side${index}`"
          :d="pieSide(item, rx - .5, ry - .5, h)"
          ></path>
        <path class="outerSlice"
          v-for="(item, index) in pieData"
          :key="`outerSlice${index}`"
          fill-opacity="0.9"
          :fill="color[index]"
          :d="pieOuter(item, rx - .5, ry - .5, h)"
          @mouseover="tipOpen()"
          @mousemove="tipUpdate($event, index)"
          @mouseleave="tipClose()"
          ></path>
        <path class="topSlice"
          v-for="(item, index) in pieData"
          :key="`topSlice${index}`"
          :fill="color[index]"
          fill-opacity="0.8"
          :d="pieTop(item, rx, ry, ir)"
          @mouseover="tipOpen()"
          @mousemove="tipUpdate($event, index)"
          @mouseleave="tipClose()"
          @click="handleClick(index)"
          ></path>
        <image class="light-image"
          :width="2 * rx"
          :height="2 * ry"
          :x="-rx"
          :y="-ry"
          xlink:href="../../assets/sys-icon/pieLight.png"
      ></image>
      </g>
      <g :transform="`translate(${pieX},${pieY})`" class="labels">
        <text class="percent"
        v-for="(item, index) in pieData"
        :key="`percent${index}`"
        :x="lineX(item, rx, ry, rotate) - 15"
        :y="lineY(item, rx, ry, rotate)"
        > {{ Number(pieData[index].data.percent.toFixed(2)) }}% </text>
      </g>
      <g :transform="`translate(${pieX},${pieY})`" class="lines">
        <text class="labelsText"
        v-for="(item, index) in pieData"
        :key="`labelsText${index}`"
        :dx="getLabel(item, rx, ry, rotate)"
        dy=".35em"
        :fill="color[index]"
        :transform="`translate(${labelsTextTran(item, rx, ry, h, rotate, pieX, multi, extendLen)})`"
        :style="`text-anchor: ${getTextAnchor(item, rx, ry, rotate)}`"
        > {{ item.data.label }} </text>
        <polyline class="labelPolyline"
        v-for="(item, index) in pieData"
        :key="`labelPolyline${index}`"
        fill="none"
        :style="`stroke: ${color[index]}`"
        :points="piePolyline(item, rx, ry, h, rotate, pieX, multi, extendLen)"
        ></polyline>
      </g>
      <foreignObject
        v-show="tipShow"
        :x="tipX"
        :y="tipY"
        width="240" height="120"
        >
        <div class="tip-wrap">
          <div>{{tip.label}}:</div>
          <div>{{tip.value}}{{unit}}</div>
        </div>
      </foreignObject>
    </g>
    <image v-else
      :x="0.5 * width - 44"
      :y="0.5 * height - 65"
      class="no-data-image"
      xlink:href="../../assets/sys-icon/noStatDataImg.svg"
    ></image>
  </svg>
</template>
<script>
import { pie } from 'd3';
import { pieInner, pieBottom, pieSide, pieOuter, pieTop, lineX, lineY, labelsTextTran, piePolyline } from '@/helpers/Pie3D';

export default {
  name: 'Pie3D',
  props: {
    data: {
      type: Array,
      required: true,
      default() {
        return [{ label: '直接访问', value: '234' }, { label: '邮件营销', value: '130' }, { label: '电话营销', value: '120' }];
      },
    },
    unit: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      width: 960,
      height: 600,
      rotate: -30,
      multi: 1.3,
      h: 40,
      ir: 0,
      allPercent: 0,
      tipShow: false,
      tipX: 0,
      tipY: 0,
      tip: {
        label: '',
        value: '',
      },
    };
  },
  computed: {
    color() {
      const colorArr = ['#66e690', '#7bdb74', '#a1d271', '#82bf9a', '#e0e46e', '#c8ce81', '#83c89a', '#83c4b7', '#90a7bd',
        '#6dcde3', '#e66495', '#d46b6a', '#df8c5f', '#da9779', '#c4da77', '#b56ed2', '#a684be', '#7e7cc8', '#719ed5', '#408bd7'];
      colorArr.sort(() => 0.5 - Math.random());
      return colorArr;
    },
    pieData() {
      let total = 0;
      let currentPercent = 0;
      this.data.forEach((d) => {
        total += Number(d.value);
      });
      const isAllZero = this.data.every(d => Number(d.value) === 0);
      // console.log(isAllZero);
      if (isAllZero) {
        currentPercent = 100.0 / this.data.length;
        this.data.forEach((d, i) => {
          this.data[i].percent = currentPercent;
        });
      } else {
        this.data.forEach((d, i) => {
          currentPercent = Number(d.value) / total * 100;
          this.data[i].percent = currentPercent;
        });
      }
      let pieArr = [];
      pieArr = pie().value(d => d.percent)(this.data);
      return pieArr;
    },
    pieX() {
      return this.width * 0.6;
    },
    pieY() {
      return this.height * 0.6;
    },
    rx() {
      return (this.getMin(this.width, this.height) - 30) / 2;
    },
    ry() {
      return 0.618 * (this.getMin(this.width, this.height) - 30) / 2;
    },
    extendLen() {
      return (this.getMin(this.width, this.height) - 30) / 12;
    },
  },
  methods: {
    initPieData() {
      let total = 0;
      let currentPercent = 0;
      let percentCount = 0;
      this.data.forEach((d) => {
        total += Number(d.value);
      });
      this.data.forEach((d, i) => {
        if (i === this.data.length - 1) {
          this.data[i].percent = (100 - percentCount).toFixed(1);
        } else {
          currentPercent = (Number(d.value) / total * 100).toFixed(1);
          percentCount += Number(currentPercent);
          this.data[i].percent = currentPercent;
        }
      });
      let pieArr = [];
      pieArr = pie().value(d => d.value)(this.data);
      return pieArr;
    },
    getBox() {
      const box = this.$el.getBoundingClientRect();
      this.width = box.width * 0.8;
      this.height = box.height * 0.8;
    },
    getMin(a, b) {
      return a < b ? a : b;
    },
    pieInner(item, rx, ry, h, ir) {
      return pieInner(item, rx, ry, h, ir);
    },
    pieBottom(d, rx, ry, ir, h) {
      return pieBottom(d, rx, ry, ir, h);
    },
    pieSide(d, rx, ry, h) {
      return pieSide(d, rx, ry, h);
    },
    pieOuter(d, rx, ry, h) {
      return pieOuter(d, rx, ry, h);
    },
    pieTop(d, rx, ry, ir) {
      return pieTop(d, rx, ry, ir);
    },
    lineX(d, rx, ry, rotate) {
      return 0.5 * lineX(d, rx, ry, rotate);
    },
    lineY(d, rx, ry, rotate) {
      return 0.5 * lineY(d, rx, ry, rotate);
    },
    getLabel(d, rx, ry, rotate) {
      let strEm = '';
      if (lineX(d, rx, ry, rotate) > 0) {
        strEm = '.35em';
      } else {
        strEm = '-.35em';
      }
      return strEm;
    },
    labelsTextTran(d, rx, ry, h, rotate, pieX, multi, extendLen) {
      return labelsTextTran(d, rx, ry, h, rotate, pieX, multi, extendLen);
    },
    getTextAnchor(d, rx, ry, rotate) {
      return lineX(d, rx, ry, rotate) > 0 ? 'start' : 'end';
    },
    piePolyline(d, rx, ry, h, rotate, pieX, multi, extendLen) {
      return piePolyline(d, rx, ry, h, rotate, pieX, multi, extendLen);
    },
    tipOpen() {
      this.tipShow = true;
    },
    tipUpdate(e, index) {
      this.tipX = e.offsetX + 10;
      this.tipY = e.offsetY + 10;
      this.tip = this.data[index];
    },
    tipClose() {
      this.tipShow = false;
    },
    handleClick(index) {
      this.$emit('click', this.data[index]);
    },
  },
  mounted() {
    this.getBox();
    window.addEventListener('resize', () => this.getBox());
  },
};
</script>
<style lang="scss">
.pie-3d-svg{
  width: 100%;
  height: 100%;
  font-size: 14px;
  .slices path{
    cursor: pointer;
  }
  .light-image{
    pointer-events: none;
  }
  .tip-wrap{
    display: inline-block;
    width: auto;
    height: auto;   
    padding: 8px 15px;
    background-color: rgb(3, 16, 27);
    opacity: 0.75;
    border-radius: 2px;
    font-size: 14px;
    text-align: left;
    color: #bee2eb;
  }
}
</style>
