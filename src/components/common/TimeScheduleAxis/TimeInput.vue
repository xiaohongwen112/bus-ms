<template>
  <div class="time-input-div" :class="{'end-time-input' : type === 'end'}">
    <template v-if="type === 'start'">
        <div class="remove-icon" @mousedown="timeRemove"></div>
        <div class="alert_wrap">
          <div class="alert_tip" v-if="showTip && (startError || startErrorIN)">
            {{tipContent}}
          </div>
          <div class="alert_after" v-if="showTip && (startError || startErrorIN)"></div>
          <input type="text"
                maxlength="5"
                :style="startError || startErrorIN ? 'border:1px solid red !important;' : ''"
                readonly
                class="time-input"
                v-model="newTime"
                @focus="inputDisable"
                @blur="inputTime"
                @keyup.enter="inputTime"
                @mouseenter="showTip = true"
                @mouseleave="showTip = false"
                ref="startT"
          >
        </div>
      <div class="pointer-icon start-pointer"></div>
    </template>
    <template v-else>
      <div class="pointer-icon end-pointer"></div>
      <div class="alert_wrap alert-end">
          <div class="alert_tip" v-if="showTip && (endError || endErrorIN)">
            {{tipContent}}
          </div>
          <div class="alert_after" v-if="showTip && (endError || endErrorIN)"></div>
          <input type="text"
                maxlength="5"
                readonly
                class="time-input end"
                :style="endError || endErrorIN ? 'border:1px solid red !important;' : ''"
                v-model="newTime"
                @focus="inputDisable"
                @blur="inputTime"
                @keyup.enter="inputTime"
                @mouseenter="showTip = true"
                @mouseleave="showTip = false"
                ref="endT"
          >
      </div>
      <div class="remove-icon" @mousedown="timeRemove"></div>
    </template>
  </div>
</template>

<script>
  // import { checkError } from '@/helpers/configValidate';

  export default {
    name: 'time-input',
    props: {
      type: {
        type: String,
        default: 'start',
      },
      time: {
        type: String,
        default: '',
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
        showTip: false,
        isInput: false,
        newTime: this.time,
        startErrorIN: false,
        endErrorIN: false,
        tipContent: '输入时间格式或范围错误',
      };
    },
    watch: {
      time() {
        this.newTime = this.time;
      },
      isInput() {
        const input = this.$el.querySelector('input');
        if (input) {
          if (this.isInput) {
            input.removeAttribute('readOnly');
          } else {
            input.setAttribute('readOnly', true);
          }
        }
      },
    },
    computed: {},
    methods: {
      inputDisable() {
        if (!this.isInput) {
          this.isInput = true;
        }
      },
      inputTime(e) {
        const reg = /^((1|0?)[0-9]|2[0-3]):([0-5][0-9])/;
        const val = e.target.value;
        const timeS = this.timeToMinute(val);
        const ifFist = e.target.className.match(new RegExp('(\\s|^)end(\\s|$)'));
        let endTvTime = 0;
        let startTvTime = 0;
        const res = {
          bool: reg.test(val) || val === '24:00',
          tip: this.tip,
        };
        if (!res.bool) {
          this.startErrorIN = true;
          this.endErrorIN = true;
          return;
        }
        if (ifFist === null) { // 开始
          const endTv = this.$refs.startT.parentElement.parentElement.nextElementSibling.nextElementSibling.childNodes[2].childNodes[4];
          endTvTime = this.timeToMinute(endTv.value);
          res.bool = timeS < endTvTime;
        } else {
          const startTv = this.$refs.endT.parentElement.parentElement.previousElementSibling.previousElementSibling.childNodes[2].childNodes[4];
          startTvTime = this.timeToMinute(startTv.value);
          res.bool = startTvTime < timeS;
        }
        // checkError(res, e.target);
        if (res.bool) {
          this.isInput = false;
          this.timeChange();
          this.startErrorIN = false;
          this.endErrorIN = false;
        } else {
          this.startErrorIN = true;
          this.endErrorIN = true;
        }
      },
      hourToTime(allHour) {
        const allHours = Number(allHour).toFixed(2) * 100 / 100;
        const hour = Math.floor(allHours);
        if (hour >= 0) {
          const min = (allHours * 60 - hour * 60).toFixed(0);
          return `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}`;
        }
        return '00:00';
      },
      timeToMinute(time) {
        const hour = parseInt(time.split(':')[0], 10);
        const minute = parseInt(time.split(':')[1], 10);
        return hour * 60 + minute;
      },
      timeRemove() {
        this.$emit('timeRemove');
      },
      timeChange() {
        this.$emit('timeChange', { time: this.newTime });
      },
    },
    mounted() {
    },
  };
</script>

<style lang="scss" scoped>
  .alert_wrap{
    position: relative;
    display: flex;
    .alert_tip{
      position: absolute;
      top: -35px;
      left: -50px;
      min-width: 175px;
      height: 30px;
      background-color: #442326;
      color: #b84144;
      border: 0;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: left;
      padding-left: 10px;
      padding-right: 10px;
      box-sizing: border-box;
      z-index: 999;
    }
    .alert_after{
      content: "";
      width:0;
      height:0;
      border-width:5px 5px 0;
      border-style:solid;
      border-color:#442326 transparent transparent;/*灰 透明 透明 */
      margin:40px auto;
      position: absolute;
      top: -47px;
      left: 20px;
    }
  }
  .alert-end{
    align-self: flex-end;
  }

  .time-input-div {
    cursor: pointer;
    width: 76px;
    height: 40px;
    display: flex;
    margin-right: -7px;
  }

    .pointer-icon{
      width: 13px;
      height: 50px;
      cursor: pointer;
    }
    .start-pointer{
      background: url(../../../assets/common/startPointer.svg) no-repeat center center;
      background-size: 100% 100%;
      margin-top: 5px;
    }
    .end-pointer{
      background: url(../../../assets/common/endPointer.svg) no-repeat center center;
      background-size: 100% 100%;
      margin-top: -15px;
    }
    .remove-icon{
      background: url(../../../assets/common/remove.svg) no-repeat center center;
      background-size: 100% 100%;
      visibility: hidden;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    .time-input{
      border: 1px solid #2b7fb8;
      font-size: 12px;
      color: rgb(238, 238, 238);
      background: rgb(43, 127, 184);
      border-radius: 10px;
      height: 18px;
      line-height: 18px;
      padding: 0 7px;
      width: 32px;
      box-sizing: content-box;
      outline: 0;
    }

  .time-input-div:hover .remove-icon{
    visibility: visible;
  }
  .end-time-input{
    margin-right: 0;
    margin-left: -5px;
    margin-top: 25px;

    .time-input{
      margin-left: -5px;
    }
    .remove-icon, .time-input{
      align-self: flex-end;
    }
  }
</style>
