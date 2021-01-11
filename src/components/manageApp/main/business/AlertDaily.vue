<template>
  <div class="alert-daily">
    <div class="setting-header">
      <span>
        <span class="switch-name proImg">告警类型</span>
        <CmSelect :list="alertTypeList" :selectVal="alertVal"></CmSelect>
      </span>
      <span class="repeat-box">
        <span class="switch-name proImg repeat">重复</span>
        <div><CmRadio :value="radioOnce" :model="currentRadio" @change="radioChange"></CmRadio>一次</div>
        <div><CmRadio :value="radioRepeat" :model="currentRadio" @change="radioChange"></CmRadio>重复</div>
      </span>
      <span>
        <span class="switch-name proImg" v-html="currentRadio=='一次'?'日期':'排期'"></span>
        <DatePicker :value="timeVal" 
          @on-change="onTimeChange" 
          :editable="false" 
          type="datetimerange" 
          format="yyyy-MM-dd HH:mm" 
          placeholder="请选择时间"
          v-if="currentRadio=='一次'">
        </DatePicker>
        <CheckWeek v-else selectAll="全" :activeWeek="activeWeek"></CheckWeek>
        <input class="remark" placeholder="备注"/>
      </span>
      <span class="btn-group">
        <span class="baseline-add" v-show="!editShow" @click="onAdd">+</span>
        <span class="baseline-save" v-show="editShow">保存</span>
        <span class="baseline-cancel" v-show="editShow" @click="onCancel">取消</span>
      </span>
    </div>
    <div class="add-monitor-div">
      <div class="add-setting" v-if="editShow">
        <span class="per-time-name">监控时段</span>
        <div class="time-div">
          <TimeScheduleAxis
            v-show="currentStatus"
            :isClear="false"
            :timeList="timeList"
            @timeChange="timeChange"
          />
        </div>
      </div>
      <MonitorDiv v-for="(x, index) in monitorData" :key="index" :data="x"></MonitorDiv>
    </div>
  </div>
</template>
<script>
  import { CmSelect, CheckWeek } from '@/components/common';
  import TimeScheduleAxis from '@/components/common/TimeScheduleAxis';
  import '@/assets/css/date-picker.scss';
  import { DatePicker } from 'iview';
  import MonitorDiv from './MonitorDiv';
  import CmRadio from './CmRadio';

  export default {
    components: { CmSelect, MonitorDiv, CheckWeek, TimeScheduleAxis, DatePicker, CmRadio },
    data() {
      return {
        editShow: false,
        alertTypeList: ['系统告警', '基线告警', '返回码告警', '健康度告警'],
        alertVal: '系统告警',
        timeList: [],
        timeVal: [],
        radioOnce: '一次',
        radioRepeat: '重复',
        currentRadio: '一次',
        activeWeek: [0],
        currentStatus: false,
        monitorData: [
          {
            week: ['week_thu', 'week_fri'],
            _id: 'wdjivyo77awg',
            name: '123',
            time_range: [
              { ts_start: 480, ts_end: 600 },
              { ts_start: 780, ts_end: 840 },
              { ts_start: 240, ts_end: 300 },
            ],
          },
          {
            week: ['week_mon', 'week_tue', 'week_wed', 'week_thu', 'week_fri', 'week_sat', 'week_sun'],
            _id: 'pcesv77anqk2',
            name: '222',
            time_range: [
              { ts_start: 480, ts_end: 540 },
              { ts_start: 720, ts_end: 780 },
            ],
          },
        ],
      };
    },
    methods: {
      onAdd() {
        this.editShow = true;
      },
      onCancel() {
        this.editShow = false;
      },
      timeChange(data) {
        console.log('data', data);
        this.timeList = data.timeList;
      },
      onTimeChange(val) {
        this.timeVal = val;
      },
      radioChange(val) {
        console.log(val);
        this.currentRadio = val;
      },
    },
    mounted() {
      this.currentStatus = true;
    },
  };
</script>
<style lang="scss">
.alert-daily{
  .setting-header {
    .week-btn-wrap{
      margin:0;
      min-width: 300px;
      font-size:14px;
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
          font-size:14px;
        }
      }
    }
    >span{
      &:nth-of-type(1){
        .cm-select{
          width: 100px;
          margin:0;
          .input-container{
            >input{
              height: 25px;
              font-size: 14px;
              border: 1px solid #4e6e8c;
              border-radius: 3px;
              color: #1ecdb5;
              padding-left: 6px;
            }
            .icon-bms-tridown{
              top: 4px;
            }
          }
          .skill{
            border: 1px solid #4e6e8c;
            li{
              font-size:14px;
              line-height: 20px;
              height: 20px;
              text-align:center;
              padding:0;
              &.selected, &:hover{
                color:#fff;
                background-color:#337ab7;
              }
            }
          }
        }
      }
      &:nth-of-type(3){
        .ivu-date-picker{
          .ivu-input{
            height:25px;
            line-height:25px;
            font-size:14px;
            border: 1px solid #4e6e8c;
            background-color:#081928;
            border-radius: 3px;
            color: #1ecdb5;
          }
          .ivu-icon-ios-calendar-outline{
            top:3px;
          }
          .ivu-icon-ios-close{
            top:4px;
          }
        } 
      }
    }
  }
  .add-monitor-div {
    margin-top: 20px;
    height: 450px;
    border: 1px solid #0c3755;
    background: #061521;
    .add-setting{
      background: #15334a;
      border-radius: 3px;
      box-shadow: 0 0 15px #43fbd5;
      margin: 5px;
      color: #efefef;
      height: 85px;
      line-height: 40px;
      padding: 15px 1% 5px 5%;
      .per-time-name {
        display: inline-block;
        font-size: 14px;
        color: #efefef;
        margin-top: 10px;
      }
      .time-div{
        width: calc(94% - 19px);
        float: right;
      }
    }
  }
}  
</style>
<style lang="scss" scoped>
.alert-daily{
  .setting-header {
    border: 1px solid #0c3755;
    padding: 15px 5% 15px calc(5% + 20px);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .repeat-box{
      min-width:100px;
      margin:0 15px;
      >div{
        display:inline-block;
        vertical-align: middle;
      }
    }
    >span{
      vertical-align:middle;
      .switch-name{
        display:inline-block;
        margin-right: 3px;
      }
      .remark{
        width: 80px;
        height:25px;
        line-height:25px;
        color: #1ecdb5;
        font-size:14px;
        padding-left:6px;
        vertical-align: middle;
        background-color:#081928;
        border-radius:3px;
        border: 1px solid #4e6e8c;
        &:focus{
          outline:none;
        }
      }
      &.btn-group{
        margin-left:20px;
        .baseline-add,.baseline-save,.baseline-cancel {
          display: inline-block;
          width: 40px;
          height: 27px;
          line-height: 27px;
          background: #38bab3;
          color: #192d40;
          font-size: 15px;
          text-align: center;
          border-radius: 3px;
          margin: 0 10px;
          color: #f9f9f9;
          cursor:pointer;
          &.baseline-add{
            width: 27px;
            font-weight:600;
            color:#081928;
            font-size:18px;
          }
        }
      }
    }
    .proImg {
      position: relative;
      font-size: 16px;
      vertical-align: middle;
      &:after {
        content: '';
        background: url("../../../../assets/manageApp/beautyL.svg") 0 0 no-repeat;
        position: absolute;
        left: -15px;
        top: 5px;
        width: 10px;
        height: 12px;
      }
    }
  }
}
</style>