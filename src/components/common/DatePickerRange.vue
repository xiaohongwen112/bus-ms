<template>
    <div id="date-picker-range">
        <input id="start-time" v-model="timeVal[0]" type="text" @click="selectTime('start')" readonly>
        <input id="end-time" v-model="timeVal[1]" type="text" @click="selectTime('end')" readonly>
    </div>
</template>
<script>
    import DatePicker from '../../../static/js/DatePicker';

    export default {
      props: {
        value: {
          type: Array,
          default: [null, null],
        },
      },
      data() {
        return {
          timeVal: [null, null],
        };
      },
      watch: {
        value: {
          deep: true, // 深度监听
          handler() {
            this.timeVal = this.value;
          },
        },
        timeVal: {
          deep: true, // 深度监听
          handler() {
            this.$emit('on-change', this.timeVal);
          },
        },
      },
      methods: {
        selectTime(type) {
          if (type === 'start') {
            this.select.setLimit(null, new Date(this.timeVal[1]).getTime() / 1000);
            this.select.actionDatePicker('start-time', true, 'bottom');
          } else if (type === 'end') {
            this.select.setLimit(new Date(this.timeVal[0]).getTime() / 1000, null);
            this.select.actionDatePicker('end-time', true, 'bottom');
          }
        },
      },
      mounted() {
        this.select = new DatePicker();
        this.select.timeSelect();
        this.select.setSysTime(Math.floor(this.session$.ts));
      },
    };
</script>
<style lang="scss" scoped>
#date-picker-range{
    display: inline-block;
    height: 32px;
    line-height: 32px;
}
#start-time, #end-time{
  border: 1px solid #0cdad4;
  height: 32px;
  width: 190px;
  background-color: rgba(11, 59, 80, 0.37);
  color: #bbd6d6;
  padding: 0 13px;
  font-size: 16px;
  vertical-align: bottom;
  cursor: pointer;
}
#end-time{
  margin-left: 5px;
  margin-right: 10px;
}
</style>
<style lang="scss">
.data-picker-con{
    position: absolute;
    width: auto;
    height: auto;
    display: none;
    z-index: 50;
}
.date-picker-div{
    width: 258px;
    position: absolute;
    background-color: #0b3b50;
    height: 214px;
    padding: 8px;
}
.picker-year,.picker-month{
    position: absolute;
    width: 119px;
    height: 30px;
    appearance: none;
    background-color: #0b3b50;
    border: 1px solid #2FA3AA;
    font-size: 14px;
    color: #bbd6d6;
    font-Weight: bold;
    padding-left: 26px;
    cursor: pointer;
    background: url(../../assets/sys-icon/arrow-w.svg) no-repeat calc(100% - 5px) 0% rgb(10, 31, 48) !important;
}
.picker-month{
    left:50%;
}
.picker-year option,.picker-month option{
    font-size: 14px;
    color: #bbd6d6;
    background: #0b3b50;
}
.day-num-table{
    border: none;
    position: absolute;
    top: 65px;
    cursor: pointer;
    left: 0;
    border-spacing: 0;
}

.week-table{
    border: none;
    position: absolute;
    top: 43px;
    left: 0;
    border-spacing: 0;
    font-family: -webkit-pictograph;
    font-size: 13px;
    background-color: #072a39;
    color: #bbd6d6;
    /* padding-left: 10px; */
}
.week-table td{
    text-align: center;
}
.hour-picker{
    left: 258px;
    height: 214px;
    width: 84px;
    position: absolute;
    display: inline-block;
    border-left: 1px solid #161b1d;
}
#hour-div,#minu-div{
    position: absolute;
    width: 40px;
    height: 100%;
    background-color: #0b3b50;
    cursor: pointer;
    border: none;
}

#minu-div{
    left: 40px;
    border-left: 1px solid #161b1d;
}

.hour-scroll,.minu-scroll{
    position: absolute;
    width: 5px;
    height: 35px;
    right: 1px;
    top: 1px;
    background-color: #3f6f91;
    cursor: pointer;
    border-radius: 50px;
    z-index: 1;
}
.hour-num,.minu-num{
    position: absolute;
    width: 95%;
    height: 23px;
    border: none;
    color: #bbd6d6;
    line-height: 23px;
    vertical-align: middle;
    text-align: center;
    font-size: 14px;
    font-family: "黑体";
}
.hour-num:hover{
    background-color: #33d5c8;
}
.minu-num:hover{
    background-color: #33d5c8;
}
.day-num{
    font-size: 14px;
    height: 20px;
    vertical-align: middle;
    text-align: center;
    width: 36.5px;
    color: #bbd6d6;
    padding: 0;
    border: 2px solid rgba(0, 0, 0, 0);
    font-family: "黑体";
}
.day-num-tr .day-num:hover{
    border: 2px solid #33d5c8;
    border-radius: 50%;
}
.no-data{
    color:#52585A;
    pointer-events : none;
}
.day-num-tr .no-data:hover{
    border: 2px solid rgba(0,0,0,0);
}
.clicked-day{
    border: 2px solid #33d5c8;
    border-radius: 50%;
}
.clicked-time{
    background-color: #33d5c8;
}
</style>