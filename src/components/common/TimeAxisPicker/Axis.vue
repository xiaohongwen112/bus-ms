<template>
  <g class="axis-group">
    <defs v-if="!hasFilter" >
      <filter id="circleBlueGaussian" width="800%" height="800%" x="-200%" y="-200%">
        <feColorMatrix in="SourceAlpha" type="matrix" width="800%" height="800%" x="-300%" y="-300%" values="0 0 0 0 0.239 0 0 0 0 0.608 0 0 0 0 0.875 0 0 0 1 0"></feColorMatrix>
        <feGaussianBlur stdDeviation="1" width="800%" height="800%" x="-300%" y="-300%"></feGaussianBlur>
        <feBlend in="SourceGraphic"></feBlend>
      </filter>
      <filter id="circleOrangeGaussian" width="800%" height="800%" x="-200%" y="-200%">
        <feColorMatrix in="SourceAlpha" type="matrix" width="800%" height="800%" x="-300%" y="-300%" values="0 0 0 0 0.91 0 0 0 0 0.192 0 0 0 0 0.078 0 0 0 1 0"></feColorMatrix>
        <feGaussianBlur stdDeviation="1" width="800%" height="800%" x="-300%" y="-300%"></feGaussianBlur>
        <feBlend in="SourceGraphic"></feBlend>
      </filter>
    </defs>
    <text class="axis-title" ref="title" :x="titleX" :y="titleY">{{ title }}</text>
    <g class="axis-line-group"  :transform="`translate(${titleWidth},${offsetY})`">
      <line class="axis-gray" :x1="0" :x2="axisWidth" :y1="axisY" :y2="axisY" stroke="#333"></line>
      <path class="axis-monitor" v-if="hasMonitor && minutesPathFlag" :d="monitorPath" stroke="#00a8ec" fill="#00a8ec"></path>
      <path class="axis-monitor" v-if="showOverPath" :d="overMonitorPath" stroke="#00a8ec" fill="#00a8ec"></path>
    </g>
    <g :class="{'axis-item': true, 'click-item': activeIndex === i, 'future-time': futureFlag(i), 'no-pointer': unMonitorFlag(i)}"
       v-for="(item, i) in range" :key="i"
       :transform="`translate(${i * itemWidth + titleWidth},0)`"
       @click="clickItem(i)"
    >
      <rect :height="height"
            :width="itemWidth"
            :fill="`transparent`"
            x="0"
            y="0"
      ></rect>
      <g class="mark-group" :transform="`translate(0,${offsetY})`" :class="{'un-monitor': !getMonitorStatus(i) || unMonitorFlag(i)}">
        <line class="axis-mark-line" :x1="cx" :x2="cx" :y1="axisYStart" :y2="axisY" stroke="#333"></line>
        <text class="axis-text" :class="{'future-time': futureFlag(i)}"
              v-show="showNum === 0 || i % showNum === 0"
              :x="textX(i)"
              :y="textY"
        >{{ i }}</text>
        <circle class="axis-circle" v-if="status(i)"
                :r="r"
                :cx="cx + 2"
                :cy="maxR"
                :fill="getCircleColor(i)"
                :filter="getFilter(i)"
        ></circle>
      </g>
    </g>
  </g>
</template>
<script>
import moment from 'moment';

export default {
  name: 'axis',
  components: {},
  props: {
    range: {
      type: Number,
      default: 24,
    },
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    active: {
      type: Number,
      default: undefined,
    },
    width: {
      type: Number,
      default: 1260,
    },
    height: {
      type: Number,
      default: 25,
    },
    r: {
      type: Number,
      default: 4,
    },
    showNum: {
      type: Number,
      default: 0,
    },
    hasMonitor: {
      type: Boolean,
      default: true,
    },
    monitorStart: {
      type: [Number, null],
      default: null,
    },
    monitorEnd: {
      type: [Number, null],
      default: null,
    },
    hasFilter: {
      type: Boolean,
      default: true,
    },
    currentTime: {
      type: String,
      default: '',
    },
    chooseTime: {
      type: [Number, String],
      default: 0,
    },
    applyTs: {
      type: Number,
      default: 0,
    },
    isOverday: {
      type: Boolean,
      default: false,
    },
    monitorStartTs: {
      type: Number,
      default: 0,
    },
    monitorHourEnd: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      maxR: this.r + 1.5,
      minNumWidth: 6,
      maxNumWidth: 14,
      numHeight: 16,
      markLineHeight: 3,
      markSide: 6,
      activeIndex: this.active,
      titleX: 0,
      titleY: 0,
      titleWidth: 0,
      axisHeight: 25,
    };
  },
  watch: {
    active() {
      this.activeIndex = this.active;
    },
    width() {
      this.layout();
    },
  },
  computed: {
    currentHour() {
      return Number(this.currentTime.split(' ')[1].split(':')[0]);
    },
    currentMinutes() {
      return Number(this.currentTime.split(' ')[1].split(':')[1].split(':')[0]);
    },
    monitorHour() {
      return moment.unix(this.applyTs).format('YYYY-MM-DD HH:mm:ss').split(' ')[1].split(':')[0];
    },
    applyTime() {
      return moment.unix(this.monitorHourEnd).format('YYYY-MM-DD HH:mm:ss');
    },
    finalMoniTime() {
      const finalMoniTime = {
        start: this.monitorStart,
        end: this.monitorEnd,
      };
      if (this.title === '小时' && this.monitorEnd < this.monitorStart) {
        if (this.selectTime.split(' ')[0] === this.applyTime.split(' ')[0]) finalMoniTime.start = Number(this.applyTime.split(' ')[1].split(':')[0]);
        else finalMoniTime.start = null;
        finalMoniTime.end = this.monitorEnd;
      } else if (this.title === '分钟') {
        if (this.selectTime.split(':')[0] === this.applyTime.split(':')[0]) {
          if (this.monitorEnd < this.monitorStart) finalMoniTime.start = Number(this.applyTime.split(' ')[1].split(':')[1].split(':')[0]);
          else finalMoniTime.start = this.monitorStart;
        } else {
          finalMoniTime.start = 0;
        }
        finalMoniTime.end = this.monitorEnd;
      }
      return finalMoniTime;
    },
    finalMoniEnd() {
      let finalMoniEnd = this.monitorEnd;
      if (this.title === '小时' && this.monitorEnd < this.monitorStart) finalMoniEnd = null;
      return finalMoniEnd;
    },
    selectTime() {
      return moment.unix(this.chooseTime).format('YYYY-MM-DD HH:mm:ss');
    },
    todayFlag() {
      return this.selectTime !== this.currentTime ? !moment(this.selectTime.split(' ')[0]).isBefore(this.currentTime.split(' ')[0]) : true;
    },
    minutesFlag() {
      return this.todayFlag && Number(this.selectTime.split(' ')[1].split(':')[0]) >= Number(this.currentTime.split(' ')[1].split(':')[0]);
    },
    showOverPath() {
      return this.hasMonitor && this.isOverday && this.monitorEnd !== null && this.monitorEnd <= this.monitorStart;
    },
    minutesPathFlag() {
      let flag = true;
      // 分钟轴： 监控小时之前的任意小时均为false
      if (this.title === '分钟') {
        const curSelectTs = Number(moment(this.selectTime.slice(0, -5)).format('X'));
        // const lastDataTs = Math.max(this.applyTs, this.monitorStartTs);
        // 向下取小时整数
        const lastDataFloorHouerTs = 3600 * Math.floor(this.monitorStartTs / 3600);
        // console.log(curSelectTs, lastDataFloorHouerTs, curSelectTs < lastDataFloorHouerTs);
        if (curSelectTs < lastDataFloorHouerTs) {
          flag = false;
        }
      }
      console.log('flag', flag);
      return flag;
    },
    axisWidth() {
      return this.width - this.titleWidth;
    },
    axisRange() {
      return this.data.length ? this.data.length : this.range;
    },
    offsetY() {
      return (this.height - this.axisHeight) / 2;
    },
    itemWidth() {
      return this.axisWidth / this.axisRange;
    },
    cx() {
      return this.itemWidth / 2;
    },
    textY() {
      return 2 * this.maxR + this.numHeight / 2 + this.markLineHeight;
    },
    axisY() {
      return this.maxR * 5 / 4;
    },
    axisYStart() {
      return this.axisY - this.markLineHeight;
    },
    markHeight() {
      return Math.sqrt(3) / 2 * this.markSide;
    },
    monitorPath() {
      let start = this.monitorStart;
      if (this.finalMoniTime.start !== 0 && this.title === '分钟') start = this.finalMoniTime.start;
      if (start === null && this.finalMoniEnd === null) {
        return `M${[0, this.axisY]}L${[this.axisWidth, this.axisY]}Z`;
      } else if (start === null) {
        const { x1, x3, x4, y1, y2, y3 } = this.calcPoint(0, this.finalMoniEnd);
        return `M${[x1, y2]}L${[x3, y2]}L${[x4, y1]}L${[x4, y3]}L${[x3, y2]}Z`;
      } else if (this.finalMoniEnd === null) {
        const { x1, x2, x4, y1, y2, y3 } = this.calcPoint(start, this.axisRange);
        return `M${[x2, y2]}L${[x1, y1]}L${[x1, y3]}L${[x2, y2]}L${[x4, y2]}Z`;
      }
      const { x1, x2, x3, x4, y1, y2, y3 } = this.calcPoint(start, start === this.finalMoniEnd ? this.finalMoniEnd : this.finalMoniEnd);
      return `M${[x1, y1]}L${[x2, y2]}L${[x3, y2]}L${[x4, y1]}L${[x4, y3]}L${[x3, y2]}L${[x2, y2]}L${[x1, y3]}Z`;
    },
    overMonitorPath() {
      if (this.finalMoniTime.start === null) {
        const { x1, x3, x4, y1, y2, y3 } = this.calcPoint(0, this.finalMoniTime.end);
        return `M${[x1, y2]}L${[x3, y2]}L${[x4, y1]}L${[x4, y3]}L${[x3, y2]}Z`;
      } else if (this.finalMoniTime.end === null) {
        const { x1, x2, x4, y1, y2, y3 } = this.calcPoint(this.finalMoniTime.start, this.axisRange);
        return `M${[x2, y2]}L${[x1, y1]}L${[x1, y3]}L${[x2, y2]}L${[x4, y2]}Z`;
      }
      const { x1, x2, x3, x4, y1, y2, y3 } = this.calcPoint(this.finalMoniTime.start, this.finalMoniTime.start === this.finalMoniTime.end ? this.finalMoniTime.end : this.finalMoniTime.end);
      return `M${[x1, y1]}L${[x2, y2]}L${[x3, y2]}L${[x4, y1]}L${[x4, y3]}L${[x3, y2]}L${[x2, y2]}L${[x1, y3]}Z`;
    },
  },
  methods: {
    dedupe(array) { // 数组去重
      return Array.from(new Set(array));
    },
    futureFlag(i) {
      let flag = true;
      if (this.title === '小时') flag = this.todayFlag && i > Number(this.currentTime.split(' ')[1].split(':')[0]);
      else flag = this.minutesFlag && i > Number(this.currentTime.split(' ')[1].split(':')[1].split(':')[0]);
      return flag;
    },
    unMonitorFlag(i) {
      let flag = true;
      if (!this.isOverday) {
        flag = i < this.monitorStart || i > this.finalMoniEnd;
      } else {
        if (this.title === '小时') {
          if (this.hasMonitor) {
            if (this.isOverday) {
              const start = this.finalMoniTime.start !== null ? this.finalMoniTime.start : 0;
              const end = this.finalMoniEnd !== null ? this.finalMoniEnd : 23;
              const arr = [this.finalMoniTime.start];
              for (let index = start; index <= this.finalMoniTime.end; index += 1) {
                arr.push(index);
              }
              arr.push(this.monitorStart);
              for (let index = this.monitorStart; index <= end; index += 1) {
                arr.push(index);
              }
              if (this.dedupe(arr).includes(i)) flag = false;
              else flag = true;
            } else {
              flag = i < this.monitorStart;
            }
          }
        } else {
          if (this.hasMonitor) {
            if (this.selectTime.split(' ')[0] === this.applyTime.split(' ')[0]) { // 选择的时间是否是应用日期
              if (Number(this.selectTime.split(' ')[1].split(':')[0]) > Number(this.applyTime.split(' ')[1].split(':')[0])) { // 小时比较
                flag = false;
              }
              if (Number(this.selectTime.split(' ')[1].split(':')[0]) === Number(this.applyTime.split(' ')[1].split(':')[0])) { // 小时比较
                if (i >= Number(this.applyTime.split(' ')[1].split(':')[1].split(':')[0])) flag = false;
              }
            } else {
              if (i < this.monitorStart) flag = true;
              else flag = false;
            }
          } else {
            flag = true;
          }
        }
      }
      return flag;
    },
    calcPoint(start, end) {
      const h = this.markHeight;
      const x1 = start * this.itemWidth;
      const x2 = x1 + h;
      const x3 = (end + 1) * this.itemWidth - h;
      const x4 = x3 + h;
      const y1 = this.axisY - this.markSide / 2;
      const y2 = y1 + this.markSide / 2;
      const y3 = y1 + this.markSide;
      return { x1, x2, x3, x4, y1, y2, y3 };
    },
    hasCircle(i) {
      if (this.data.length && this.data[i]) {
        const item = this.data[i];
        return this.getMonitorStatus(i) && (item.has_alert || item.has_data || item.has_located_alert);
      }
      return false;
    },
    status(i) {
      let flag = true;
      if (!this.todayFlag) {
        flag = this.hasCircle(i);
      } else {
        if (this.title === '小时') {
          flag = this.hasCircle(i) && i <= this.currentHour;
        } else {
          // flag = this.hasCircle(i) && i <= this.currentMinutes
          if (Number(this.selectTime.split(' ')[1].split(':')[0]) < this.currentHour) {
            flag = this.hasCircle(i);
          } else {
            flag = this.hasCircle(i) && i <= this.currentMinutes;
          }
        }
      }
      return flag;
    },
    getMonitorStatus(i) {
      if (this.data.length) {
        if (this.data[i]) {
          return this.data[i].monitor;
        }
      }
      return this.hasMonitor;
    },
    getCircleColor(i) {
      if (this.data.length) {
        const item = this.data[i];
        if (!item.monitor) {
          return '#161f28';
        }
        if (item.has_located_alert) {
          return '#f7331f';
        }
        if (item.has_alert) {
          return '#fe593e';
        }
        if (item.has_data) {
          return '#0fe2cc';
        }
      }
      return 'transparent';
    },
    getFilter(i) {
      if (this.data.length) {
        const item = this.data[i];
        if (item.has_alert) {
          return 'url(#circleOrangeGaussian)';
        }
        if (item.has_data) {
          return 'url(#circleBlueGaussian)';
        }
      }
      return '';
    },
    textX(i) {
      return this.cx - (i < 10 ? this.minNumWidth : this.maxNumWidth) / 2;
    },
    clickItem(i) {
      this.activeIndex = i;
      this.$emit('getIndex', { i });
    },
    layout() {
      const titleBox = this.$refs.title.getBoundingClientRect();
      this.titleY = this.axisY + titleBox.height / 2 + this.offsetY;
      this.titleWidth = titleBox.width + 10;
      if (this.$el.querySelector('.mark-group')) {
        this.axisHeight = this.$el.querySelector('.mark-group').getBoundingClientRect().height;
      }
    },
  },
  mounted() {
    this.layout();
    this.hasCircle();
  },
  destroy() {
  },
};

</script>
<style lang="scss" scoped>
  .axis-title{
    fill: #eee;
  }
  .axis-item {
    cursor: pointer;

    .un-monitor{
      text {
        cursor: default;
        fill: #333;
        pointer-events: none;
      }
    }

    text {
      font-size: 12px;
      fill: #eee;
    }
  }

  .click-item{
    text{
      display: block!important;
      fill: #eee!important;
    }
    rect{
      fill: rgba(10, 74, 103, .6);
    }
  }
  .axis-item:hover text {
    display: block !important;
  }

  .axis-item:hover circle {
    r: 6;
  }
  .axis-group{
    .no-pointer{
      cursor: default;
      pointer-events: none;
    }
    .future-time{
      fill: #333;
      cursor: default;
      pointer-events: none;
    }
  }
</style>


