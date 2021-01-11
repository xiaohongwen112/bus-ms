<template>
  <div class="time-group-div" :style="{height: '0px', width: groupWidth +'px', 'left': left + 'px'}">
    <TimeInput
      ref="start"
      :type="'start'"
      :startError="startError"
      :time="minuteToTime(startTime)"
      @timeChange="startChange"
      @timeRemove="timeRemove"
    />
    <div v-if="type === 'group'" class="time-full"></div>
    <TimeInput
      ref="end"
      :type="'end'"
      :endError="endError"
      :time="minuteToTime(endTime)"
      @timeChange="endChange"
      @timeRemove="timeRemove"
      v-if="type === 'group'"
    />
  </div>
</template>

<script>
  import { drag as D3Drag } from 'd3-drag';
  import { select as D3Select, event as D3Event } from 'd3-selection';
  import TimeInput from './TimeInput';

  export default {
    name: 'time-group',
    components: {
      TimeInput,
    },
    props: {
      type: {
        type: String,
        default: 'group',
      },
      start: {
        type: Number,
        default: 0,
      },
      end: {
        type: Number,
        default: 0,
      },
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
      hourWidth: {
        type: Number,
        default: 37,
      },
      offset: {
        type: Number,
        default: 81,
      },
      index: {
        type: Number,
        default: 0,
      },
      startError: {
        type: Boolean,
        default: false,
      },
      endError: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isInput: false,
        startTime: this.start,
        endTime: this.end,
        dragStart: D3Drag().on('start', this.dragStarted).on('drag', this.startDragged).on('end', this.dragEnded),
        dragEnd: D3Drag().on('start', this.dragStarted).on('drag', this.endDragged).on('end', this.dragEnded),
      };
    },
    watch: {
      start() {
        this.startTime = this.start;
      },
      end() {
        this.endTime = this.end;
      },
    },
    computed: {
      left() {
        return this.startTime / 60 * this.hourWidth + 13;
      },
      groupWidth() {
        return (this.endTime - this.startTime) / 60 * this.hourWidth + 152;
      },
    },
    methods: {
      minuteToTime(minute) {
        const hour = Math.floor(parseInt(minute, 10) / 60);
        const min = minute - hour * 60;
        return `${hour < 10 ? '0' : ''}${hour}:${min < 10 ? '0' : ''}${min}`;
      },
      timeToMinute(time) {
        const hour = parseInt(time.split(':')[0], 10);
        const minute = parseInt(time.split(':')[1], 10);
        return hour * 60 + minute;
      },
      tsMinute(pageX) {
        const x = pageX - this.$el.parentNode.getBoundingClientRect().left - this.offset;
        let minute = Math.round(x / this.hourWidth * 60);
        minute = minute < 0 ? 0 : minute;
        minute = minute > 1440 ? 1440 : minute;
        return minute;
      },
      dragStarted() {
        if (D3Event.sourceEvent.target.tagName === 'INPUT') {
          this.noDrag = true;
        } else {
          this.noDrag = false;
        }
      },
      dragEnded() {
        this.emit();
      },
      startDragged() {
        if (this.noDrag) return;
        const startTime = this.tsMinute(D3Event.sourceEvent.pageX);
        if (startTime < this.endTime && startTime >= this.min) {
          this.startTime = startTime;
        }
      },
      endDragged() {
        if (this.noDrag) return;
        const endTime = this.tsMinute(D3Event.sourceEvent.pageX);
        if (endTime > this.startTime && endTime <= this.max) {
          this.endTime = endTime;
        }
      },
      startChange(data) {
        const startTime = this.timeToMinute(data.time);
        if (startTime < this.endTime && startTime >= this.min) {
          this.startTime = startTime;
          this.emit();
        }
      },
      endChange(data) {
        const endTime = this.timeToMinute(data.time);
        if (endTime > this.startTime && endTime <= this.max) {
          this.endTime = endTime;
          this.emit();
        }
      },
      timeRemove() {
        // this.$emit('remove', this.index);
        this.emit('remove');
      },
      emit(type) {
        this.$emit('timeChange', {
          start: this.startTime,
          end: this.endTime,
          index: this.index,
          type: type || 'change',
        });
      },
    },
    mounted() {
      this.dragStart(D3Select(this.$refs.start.$el));
      if (this.type === 'group') this.dragEnd(D3Select(this.$refs.end.$el));
    },
  };
</script>

<style lang="scss" scoped>
  .time-group-div{
    display: flex;
    position: absolute;

    .time-full{
      width: calc(100% - 152px);
      height: 10px;
      background: linear-gradient(to bottom, rgb(106, 109, 19) 0, rgb(212, 183, 27) 100%);
      align-self: center;
      margin-top: 61px;
      border-radius: 50px;
    }
  }

</style>
