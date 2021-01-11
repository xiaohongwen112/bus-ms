<template>
  <div class="time-range">
    <div class="timeRange-pick" :class="{'edit-shadow': editShow}">
      <span class="proImg nameTitle">执行时间</span>
      <CheckWeek selectAll="全" :activeWeek="activeWeek"></CheckWeek>
      <div class="store-edit-button" v-show="editShow">
        <button @click="saveSetting">保存</button>
        <button @click="cancelSetting">取消</button>
      </div>
    </div>
    <div class="timeRange-setting">
      <div class="time-setting" :class="{'edit-shadow': editShow}">
        <div>
          <div>
            <p class="timeSettingName">起始</p>
            <p>关键时点</p>
          </div>
          <div>
            <p class="rebackDefault">恢复默认</p>
            <div class="time-container">
              <TimeScheduleAxis 
                :isClear="false"
                :timeList="timeListStart"
                @timeChange="timeChangeStart"
                :type="'single'">
              </TimeScheduleAxis>
            </div>
          </div>
        </div>
        <div>
          <div>
            <p class="timeSettingName">结束</p>
            <p>关键时点</p>
          </div>
          <div>
            <p class="rebackDefault">恢复默认</p>
            <div class="time-container">
              <TimeScheduleAxis 
                :isClear="false"
                :timeList="timeListEnd"
                @timeChange="timeChangeEnd"
                :type="'single'">
              </TimeScheduleAxis>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { CheckWeek } from '@/components/common/';
import TimeScheduleAxis from '@/components/common/TimeScheduleAxis';

export default {
  components: { TimeScheduleAxis, CheckWeek },
  data() {
    return {
      editShow: false,
      timeListStart: [{ ts_start: 0, ts_end: 1440 }],
      timeListEnd: [{ ts_start: 60, ts_end: 1440 }],
      activeWeek: [0],
    };
  },
  methods: {
    timeChangeStart(data) {
      this.editShow = true;
      this.timeListStart = data.timeList;
      console.log(this.timeListStart);
    },
    timeChangeEnd(data) {
      this.editShow = true;
      this.timeListEnd = data.timeList;
      console.log(this.timeListStart);
    },
    saveSetting() {
      this.editShow = false;
    },
    cancelSetting() {
      this.editShow = false;
    },
  },
};
</script>
<style lang="scss">
.time-range{
  .timeRange-pick{
    .week-btn-wrap{
      margin:0;
      li{
        width: 31px;
        height:30px;
        border: 1px solid #192d40;
        &.active{
          color:#fff;
          border: 1px solid #38bab3;
        }
        &:nth-child(1){
          border-radius: 5px 0 0 5px;
        }
        &:last-child{
          border-radius: 0 5px 5px 0;
        }
        span{
          font-size: 14px;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.time-range{
  .edit-shadow {
    background: #15334a;
    border-radius: 3px;
    box-shadow: 0 0 15px #43fbd5;
  }
  .proImg {
    position: relative;
    font-size: 12px;
    &:after {
      content: '';
      background: url("../../../../assets/manageApp/beautyL.svg") 0 0 no-repeat;
      position: absolute;
      left: -20px;
      top: 9px;
      width: 10px;
      height: 12px;
    }
  }
  .nameTitle {
    font-size: 16px;
    line-height: 30px;
    margin-right:10px;
  }
  .store-edit-button {
      text-align: right;
      flex: 1;
    >button {
      height: 30px;
      line-height: 30px;
      background: #1ecdb5;
      color: #192d40;
      font-size: 14px;
      text-align: center;
      border-radius: 3px;
      padding: 0 10px;
      border: none;
      outline: none;
    }
  }
  .timeRange-pick {
    border: 1px solid #0c3755;
    padding: 15px 5% 15px calc(5% + 20px);
    display: flex;
  }
  .timeRange-setting {
    height: 450px;
    border: 1px solid #0c3755;
    background: #061521;
    margin-top: 20px;
    >.time-setting {
      padding: 15px 5%;
      >div {
        display: flex;
        >div{
          &:nth-child(1) {
            flex: 0 0 150px;
          }
          &:nth-child(2) {
            flex: 1;
          }
          p {
            font-size:14px;
          }
          >.timeSettingName {
            color: #38bab3;
            margin-bottom: 30px;
            font-size: 16px;
          }
          >.rebackDefault {
            color: #38bab3;
            font-style: italic;
            cursor: pointer;
            font-size: 16px;
          }
          .time-container{
            width: 100%; 
            height: 100px;
          }
        }
      }
    }
  }
}
</style>
