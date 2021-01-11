<template>
  <div class="time-axis-div">
    <div class="time-bg-rect">
      <div class="time-mark-rect"></div>
      <div class="time-mark">
        <div
          class="time-mark-line"
          v-for="i in 25"
          :key="i"
          :class="{'time-mark-number': (i-1) % 6 === 0}"
          :style="{left: ((i-1)*hourWidth + 13 - ((i-1) % 6 === 0 && i > 10 ? 8 : 0)) + 'px' }">{{ (i-1) % 6 === 0 ? i - 1 : '' }}
        </div>
      </div>
    </div>
    <div class="time-group" :class="{'time-disabled': whetherDisable}">
      <TimeGroup
        v-for="(item, index) in newTimeList"
        :key="index"
        :index="index"
        :start="item.ts_start"
        :end="item.ts_end"
        :min="index > 0 ? newTimeList[index - 1].ts_end : 0"
        :max="index < newTimeList.length - 1 ? newTimeList[index + 1].ts_start : 1440"
        :hourWidth="hourWidth"
        :offset="offset"
        :isClear="isClear"
        :type="type"
        @timeChange="timeChange"
      />
    </div>
    <div class="time-mark-click" :class="{'time-disabled': whetherDisable}" ref="mark"  @click="addTime" ></div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import TimeGroup from './TimeGroup';

  export default {
    name: 'time-axis',
    components: {
      TimeGroup,
    },
    props: {
      timeList: {
        type: Array,
        default() {
          return [];
        },
      },
      isClear: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: 'group',
      },
      whetherDisable: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        newTimeList: this.transList(this.timeList),
        clientWidth: 1000,
        clientHeight: 60,
        offset: 68 + 13,
      };
    },
    watch: {
      timeList() {
        this.newTimeList = this.transList(this.timeList);
      },
      isClear() {
        if (this.isClear) {
          this.newTimeList = this.transList(this.timeList);
        }
      },
    },
    computed: {
      hourWidth() {
        return (this.clientWidth - this.offset * 2) / 24;
      },
    },
    methods: {
      transList(arr) {
        return arr.length > 0 ? _.cloneDeep(arr).sort((a, b) => (a.ts_start < b.ts_start ? -1 : 1)) : [];
      },
      addTime(e) {
        if (this.newTimeList.length && this.type !== 'group') return;
        const box = e.target.getBoundingClientRect();
        const x = e.pageX - box.left;
        if (x > 0 && x < box.width) {
          const tsStart = Math.floor(x / this.hourWidth) * 60;
          const tsEnd = tsStart + (tsStart === 1380 ? 59 : 60);
          const index = _.findIndex(this.newTimeList, d => (tsStart >= d.ts_start && tsEnd <= d.ts_end));
          if (index === -1) {
            const ts = this.spliceTime(tsStart, tsEnd);
            if (this.type !== 'group') ts.tsEnd = 1440;
            this.newTimeList.push({ ts_start: ts.tsStart, ts_end: ts.tsEnd });
            this.newTimeList.sort((a, b) => (a.ts_start < b.ts_start ? -1 : 1));
            this.emit();
          }
        }
      },
      spliceTime(tsStart, tsEnd) {
        const index = _.findIndex(this.newTimeList, (d) => {
          const tmpStart = d.ts_end - tsStart;
          const tmpEnd = tsEnd - d.ts_start;
          return d.ts_end === tsStart || d.ts_start === tsEnd || (tmpStart >= 0 && tmpStart < 60) || (tmpEnd >= 0 && tmpEnd < 60);
        });
        if (index !== -1) {
          const tmp = this.newTimeList[index];
          const arr = [tsStart, tsEnd, tmp.ts_start, tmp.ts_end];
          this.newTimeList.splice(index, 1);
          return this.spliceTime(_.min(arr), _.max(arr));
        }
        return {
          tsStart,
          tsEnd,
        };
      },
      timeChange(data) {
        if (data.type === 'remove') {
          this.newTimeList.splice(data.index, 1);
        } else {
          this.$set(this.newTimeList, data.index, { ts_start: data.start, ts_end: data.end });
        }
        this.emit();
      },
      emit() {
        this.$emit('timeChange', { timeList: this.newTimeList });
      },
    },
    mounted() {
      this.clientWidth = this.$el.clientWidth || 1000;
      this.clientHeight = this.$el.clientHeight;
      window.addEventListener('resize', () => {
        this.clientWidth = this.$el.clientWidth;
        this.clientHeight = this.$el.clientHeight;
      });
    },
  };
</script>

<style lang="scss" scoped>
  .time-axis-div{
    width: 100%;
    height: 60px;
    position: relative;

    .time-bg-rect{
      width: calc(100% - 136px);
      height: 34px;
      border-radius: 50px;
      background: linear-gradient(to bottom, rgb(18, 43, 64) 0, rgb(5, 15, 23) 100%);
      display: flex;
      flex-wrap: wrap;
      position: relative;
      top: 13px;
      left: 68px;

      .time-mark-rect{
        align-self: center;
        margin-left: 13px;
        width: calc(100% - 26px);
        height: 12px;
        border-radius: 50px;
        background: linear-gradient(to bottom, rgb(18, 80, 126) 0, rgb(37, 141, 205) 100%);
        border: 1px solid #70a9c9;
      }
      .time-mark{
        width: 100%;
        height: 12px;
        align-self: flex-end;
        position: absolute;

        .time-mark-line{
          background: #4b677b;
          width: 1px;
          height: 100%;
          position: absolute;
          left: 0;
        }
        .time-mark-number{
          background: none;
          width: auto;
          height: 100%;
          line-height: 20px;
        }
      }
    }

    .time-disabled{
      pointer-events: none;
    }

    .time-group{
      position: absolute;
      top:0;
      bottom: 0;
      left: 0;
      right: 0;

      /*div{*/
        /*pointer-events: none;*/
      /*}*/
    }

    .time-mark-click{
      position: absolute;
      top: 24px;
      left: 81px;
      width: calc(100% - 162px);
      height: 12px;
      background: transparent;
      border-radius: 50px;
    }

  }
</style>
