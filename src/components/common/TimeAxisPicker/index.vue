<template>
  <div class="time-axis-container" @mouseover="overShow" @mouseout="outHide">
    <transition name="time">
      <div class="simplify" v-if="showSimplify" transiton="time">
        <DefaultAxis :data="data" :currentTime="currentTime" :chooseTime="tsNow === '' ? ts : tsNow"></DefaultAxis>
      </div>
    </transition> 
    <transition name="time">
      <div class="normal" v-if="!showSimplify" transiton="time">
        <date-time-axis v-if="type='date'" :data="data" :currentTime="currentTime" :chooseTime="tsNow === '' ? ts : tsNow" @timeChange="timeChange"></date-time-axis>
        <time-axis v-else :data="data" @timeChange="timeChange"></time-axis>
      </div>
    </transition>
  </div>

</template>
<script>
  import moment from 'moment';
  import TimeAxis from '@/components/common/TimeAxisPicker/TimeAxis';
  import DateTimeAxis from '@/components/common/TimeAxisPicker/DateTimeAxis';
  import DefaultAxis from './DefaultAxis';

  export default {
    name: 'time-axis-picker',
    components: {
      TimeAxis,
      DateTimeAxis,
      DefaultAxis,
    },
    props: {
      type: {
        type: String,
        default: 'date',
      },
      currentTs: {
        type: Number,
        default: 0,
      },
      currentTime: {
        type: String,
        default: '',
      },
      showDefault: {
        type: Boolean,
        default: true,
      },
      data: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    watch: {
      currentTime(newV) {
        if (newV !== '') this.ts = moment(this.currentTime).format('X');
      },
      currentTs(newV) {
        if (newV !== 0) this.tsNow = newV;
      },
    },
    data() {
      return {
        tsNow: '',
        showSimplify: this.showDefault,
        hoverFlag: true,
        ts: '',
      };
    },
    methods: {
      overShow() {
        if (this.hoverFlag && this.data.ts !== undefined) {
          this.showSimplify = false;
        }
      },
      outHide() {
        if (this.hoverFlag) {
          this.showSimplify = true;
        }
      },
      timeChange({ type, time, timestamp }) {
        this.hoverFlag = false;
        let ts = timestamp;
        if (type === 'time') {
          const t = new Date(this.tsNow * 1000);
          const year = t.getFullYear();
          const month = t.getMonth() + 1;
          const date = t.getDate();
          ts = Date.parse(new Date(`${year}-${month}-${date} ${time}:00`)) / 1000;
        }
        this.tsNow = ts;
        this.$nextTick(() => this.emit());
      },
      emit() {
        this.$emit('timeChange', { ts: this.tsNow });
      },
    },
    mounted() {
    },
    destroy() {
    },
  };

</script>
<style lang="scss" scoped>
.time-axis-container{
  display: inline-block;
  width: 100%;
  height:100%;
  position: relative;
  .simplify, .normal{
    position: absolute;
    top: 0;
    display: block;
    width: 100%;
  }
  .simplify{
    height:12px;
    margin: 24px 0;
    cursor:pointer;
  }
  .normal{
    height: 100%;
  }
  .time-enter-active, .time-leave-active{
    transition: all .5s;
  }

  .time-enter, .time-leave-active{
    opacity: 0;
  }
}
</style>

