<template>
  <div class="baseline-setting">
    <div class="setting-header">
      <div>
        <span class="switch-name">基线</span>
        <FlatSwitch :switchStatus="baseStatus" @on-change="onBaseChange"></FlatSwitch>
      </div>
      <div>
        <span class="switch-name">基线参考时间</span>
        <CmSelect :list="referenceList" :selectVal="selectVal" @on-change="selectChange"></CmSelect>
      </div>
      <div>
        <span class="switch-name">使用业务起止时间</span>
        <FlatSwitch :switchStatus="businessStatus" @on-change="onBusinessChange"></FlatSwitch>
      </div>
    </div>
    <div class="setting-content">
      <div class="setting-mask" v-show="businessStatus"></div>
      <div class="base-setting" :class="{'edit-shadow': editShow}">
        <div class="left-content">
          <span class="baseline-name-all">采集时段</span>
        </div>
        <div>
          <span class="proImg nameTitle">名称</span>
          <input class="base-line-name" v-model="baselineName" type="text" id="baselineName"/>
        </div>
        <div class="add-week" :class="{'error-content': addWeekStatus}">
          <CheckWeek selectAll="全" :activeWeek="activeWeek" @click="getWeek" ref="checkweek"></CheckWeek>
        </div>
        <div class="btn-group">
          <span class="baseline-add" v-show="!editShow" @click="onAdd">添加</span>
          <span class="baseline-save" v-show="editShow" @click="onSave">保存</span>
          <span class="baseline-cancel" v-show="editShow" @click="onCancel">取消</span>
        </div>
      </div>
      <ScrollBar class="scroll-area">
        <div class="add-monitor-div">
          <div class="add-setting" v-if="addFlag">
            <span class="per-time-name">监控时段</span>
            <div class="time-div" :class="{'error-content': addTimeStatus}">
              <TimeScheduleAxis
                :isClear="false"
                :timeList="timeList"
                @timeChange="timeChange"
              />
            </div>
          </div>
          <MonitorDiv v-if="monitorData.length!=0"
          v-for="(x, index) in monitorData" :key="index" :data="x"
          ref="monitor" @change-edit="changeEdit(index)"
          @time-change="monitorTimeChange" @on-delete="delBaseline"></MonitorDiv>
        </div>
      </ScrollBar>
    </div>
    <Cmtip v-if="showTips" :closeFn="() => showTips = false"
      :tipContent="tipContent" :showFooter = "showFooter"
      @on-confirm="deleteBaseLine">
    </Cmtip>
  </div>
</template>
<script>
  import { FlatSwitch, CmSelect, CheckWeek, ScrollBar } from '@/components/common';
  import Cmtip from '@/components/common/CmTip';
  import TimeScheduleAxis from '@/components/common/TimeScheduleAxis';
  import * as api from '@/pages/manageApp/service';
  import MonitorDiv from './MonitorDiv';

  export default {
    props: ['appName'],
    computed: {
      postData() {
        return {
          data_precison: this.dataPrecison,
          baseline_time: parseInt(this.selectVal, 10),
        };
      },
      postBaseAddData() {
        return {
          time_range: JSON.stringify(this.timeList),
          name: this.baselineName,
          week: this.finalWeek.toString(),
          add: true,
        };
      },
      postBaseEditData() {
        return {
          time_range: JSON.stringify(this.editTimeRange),
          name: this.baselineName,
          week: this.finalWeek.toString(),
          baseline_time_id: this.baselineId,
        };
      },
    },
    watch: {
      activeWeek(newVal) {
        this.activeWeek = newVal;
      },
    },
    components: { FlatSwitch, CmSelect, MonitorDiv, CheckWeek, TimeScheduleAxis, ScrollBar, Cmtip },
    data() {
      return {
        tipContent: '',
        showFooter: false,
        showTips: false,
        editTimeRange: [],
        baselineId: '',
        editIndex: 0,
        baseStatus: true,
        editShow: false,
        addFlag: false,
        businessStatus: false,
        referenceList: ['4周', '6周', '8周', '10周', '12周'],
        selectVal: '6周',
        timeList: [],
        activeWeek: [-1],
        weekInit: [-1],
        finalWeek: ['week_mon', 'week_tue', 'week_wed', 'week_thu', 'week_fri', 'week_sat', 'week_sun'],
        currentStatus: false,
        baselineName: '',
        weekIndex: {
          1: 'week_mon',
          2: 'week_tue',
          3: 'week_wed',
          4: 'week_thu',
          5: 'week_fri',
          6: 'week_sat',
          0: 'week_sun',
        },
        indexWeek: {
          week_mon: 1,
          week_tue: 2,
          week_wed: 3,
          week_thu: 4,
          week_fri: 5,
          week_sat: 6,
          week_sun: 7,
        },
        addBaseLine: false,
        // monitorData: [
        //   {
        //     week: ['week_thu', 'week_fri'],
        //     _id: 'wdjivyo77awg',
        //     name: '123',
        //     time_range: [
        //       { ts_start: 480, ts_end: 600 },
        //       { ts_start: 780, ts_end: 840 },
        //       { ts_start: 240, ts_end: 300 },
        //     ],
        //   },
        //   {
        //     week: ['week_mon', 'week_tue', 'week_wed', 'week_thu', 'week_fri', 'week_sat', 'week_sun'],
        //     _id: 'pcesv77anqk2',
        //     name: '222',
        //     time_range: [
        //       { ts_start: 480, ts_end: 540 },
        //       { ts_start: 720, ts_end: 780 },
        //     ],
        //   },
        // ],
        monitorData: [],
        preMonitorData: [],
        addTimeStatus: false,
        addWeekStatus: false,
      };
    },
    methods: {
      monitorTimeChange(time) {
        this.editTimeRange = time;
      },
      changeEdit(index) {
        this.editShow = true;
        this.addFlag = false;
        this.addBaseLine = false;
        this.editIndex = index;
        this.baselineName = this.monitorData[index].name;
        this.editTimeRange = this.monitorData[index].time_range;
        let defaultWeek = [];
        if (this.monitorData[index].week.length !== 7) {
          this.monitorData[index].week.forEach((item) => {
            defaultWeek.push(this.indexWeek[item]);
          });
        } else {
          defaultWeek = [-1];
        }
        this.activeWeek = defaultWeek;
        this.$refs.checkweek.updateWeek(this.activeWeek);
        this.baselineId = this.monitorData[index]._id;
      },
      onAdd() {
        this.timeList = [];
        this.editShow = true;
        this.addFlag = true;
        this.addBaseLine = true;
        const target = document.getElementsByClassName('ps-container');
        target[1].scrollTop = 0;
      },
      onSave() {
        if (this.weekInit.length === 0 || (this.weekInit.length !== 0 && this.activeWeek.length === 0)) {
          this.addWeekStatus = true;
          setTimeout(() => {
            this.addWeekStatus = false;
          }, 300);
          return;
        }
        if (this.weekInit.length !== 0) {
          if (this.weekInit[0] !== -1) {
            this.finalWeek = [];
            this.weekInit.forEach((item) => {
              this.finalWeek.push(this.weekIndex[item]);
            });
          }
        }
        if (this.baselineName === '') {
          const baselineName = document.getElementById('baselineName');
          baselineName.style.border = '1px solid #f00';
          setTimeout(() => {
            baselineName.style.border = '1px solid #4e6e8c';
          }, 300);
          return;
        }
        if (this.addBaseLine) {
          if (JSON.stringify(this.timeList) === '[]') {
            this.addTimeStatus = true;
            setTimeout(() => {
              this.addTimeStatus = false;
            }, 300);
            return;
          }
          this.addBaseline(this.postBaseAddData);
        } else {
          if (JSON.stringify(this.editTimeRange) === '[]') {
            this.$refs.monitor[this.editIndex].changeTimeStatus();
            setTimeout(() => {
              this.$refs.monitor[this.editIndex].changeTimeStatus();
            }, 300);
          } else {
            this.editBaseline(this.postBaseEditData);
          }
        }
      },
      onCancel() {
        if (!this.addBaseLine) {
          this.$refs.monitor[this.editIndex].cancalEdit();
          this.$refs.monitor[this.editIndex].changeEditStatus();
        }
        this.editShow = false;
        this.baselineName = '';
        this.activeWeek = [-1];
        this.$refs.checkweek.returnInital();
        this.timeList = [];
        this.addFlag = false;
        this.addBaseLine = false;
      },
      getWeek(week) {
        this.weekInit = week;
      },
      timeChange(data) {
        this.timeList = data.timeList;
      },
      selectChange(val) {
        this.selectVal = val;
        this.setBaseline(this.postData);
      },
      onBaseChange(status) {
        if (status === true) {
          if (this.postData.enabled_baseline === undefined) {
            this.postData.enabled_baseline = 'on';
          }
        } else {
          if (this.postData.enabled_baseline !== undefined) {
            delete this.postData.enabled_baseline;
          }
        }
        this.setBaseline(this.postData);
      },
      async baselineDefault() {
        try {
          const res = await api.baselineDefault(this.appName);
          const data = res.data.form.initial;
          this.baselineTime = `${data.baseline_time}周`;
          this.dataPrecison = data.data_precison;
          this.baseStatus = data.enabled_baseline;
        } catch (e) {
          console.log('error', e);
        }
      },
      async baselineInit() {
        try {
          const res = await api.baselineInit(this.appName);
          const data = res.data.baseline_data[0];
          if (data.switch === 'true') {
            this.businessStatus = true;
          } else {
            this.businessStatus = false;
          }
          this.monitorData = data.work_range_time;
        } catch (e) {
          console.log('error', e);
        }
      },
      async setBaseline(data) {
        try {
          const res = await api.setBaseline(this.appName, data);
          console.log('setBaseline', res);
        } catch (e) {
          console.log('error', e);
        }
      },
      async setUseTime(status) {
        try {
          const res = await api.setUseTime(this.appName, status);
          console.log('setUseTime', res);
        } catch (e) {
          console.log('error', e);
        }
      },
      async addBaseline(data) {
        try {
          const res = await api.addBaseline(this.appName, data);
          console.log('addBaseline', res);
          if (res.data.status === 'ok') {
            this.addFlag = false;
            this.editShow = false;
            this.monitorData.push(res.data.work_range_time);
            this.baselineName = '';
            this.activeWeek = [-1];
            this.$refs.checkweek.returnInital();
          } else {
            this.addFlag = true;
            this.showTips = true;
            this.tipContent = res.data.errors;
            this.showFooter = false;
          }
        } catch (e) {
          console.log('error', e);
        }
      },
      async editBaseline(data) {
        try {
          const res = await api.editBaseline(this.appName, data);
          console.log('editBaseline', res);
          if (res.data.status === 'ok') {
            this.editShow = false;
            this.baselineName = '';
            this.activeWeek = [-1];
            this.monitorData[this.editIndex].work_range_time = res.data.work_range_time;
            this.$refs.checkweek.returnInital();
            this.$refs.monitor[this.editIndex].changeEditStatus();
          } else {
            this.showTips = true;
            this.tipContent = res.data.errors;
            this.showFooter = false;
          }
        } catch (e) {
          console.log('error', e);
        }
      },
      delBaseline(id) {
        this.showTips = true;
        this.showFooter = true;
        this.tipContent = '确定要删除该时段吗？';
        this.baselineId = id;
      },
      async deleteBaseLine() {
        try {
          const res = await api.deleteBaseLine(this.appName, this.baselineId);
          console.log('deleteBaseLine', res);
          if (res.data.status === 'ok') {
            console.log('删除成功', res.data.delete_id);
            this.monitorData.forEach((item, index) => {
              if (item._id === res.data.delete_id) {
                this.monitorData.splice(index, 1);
              }
            });
            this.showFooter = false;
            this.tipContent = '删除成功';
          } else {
            this.showFooter = false;
            this.tipContent = res.data.errors;
          }
        } catch (e) {
          console.log('error', e);
        }
      },
      onBusinessChange(status) {
        console.log(111, status);
        this.businessStatus = status;
        this.setUseTime(status);
      },
    },
    mounted() {
      this.currentStatus = true;
    },
  };
</script>
<style lang="scss">
.baseline-setting{
  .setting-header {
    >div{
      &:nth-of-type(2){
        .cm-select{
          width: 80px;
          .input-container{
            >input{
              height: 25px;
              font-size: 14px;
              border: 1px solid #4e6e8c;
              border-radius: 3px;
              color: #1ecdb5;
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
              &.selected, &:hover{
                color:#fff;
                background-color:#337ab7;
              }
            }
          }
        }
      }
    }
  }
  .base-setting{
    .add-week{
      margin-left: 10px;
      border: 1px solid transparent;
      .week-btn-wrap{
        min-width: 250px;
        font-size: 14px;
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
    }
    .time-div{
      .time-axis-div{
        .time-bg-rect {
          width: calc(100% - 136px);
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.baseline-setting{
  .error-content{
    border: 1px solid red !important;
	  box-shadow: 0 0 3px red;
  }
  .edit-shadow {
    background: #15334a;
    border-radius: 3px;
    box-shadow: 0 0 15px #43fbd5;
  }
  .setting-header {
    border: 1px solid #0c3755;
    padding: 15px 5% 15px calc(5% + 20px);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    >div{
      .switch-name{
        display:inline-block;
        margin-right: 3px;
        font-size: 16px;
        vertical-align: middle;
      }
    }
  }
  .setting-content {
    height: 450px;
    border: 1px solid #0c3755;
    background: #061521;
    margin-top: 20px;
    position: relative;
    .scroll-area {
      position: relative;
      width: 100%;
      height:335px;
    }
    .setting-mask{
      width:100%;
      height:100%;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(6, 21, 33, .7);
      z-index: 9;
    }
    >.base-setting {
      height: 96px;
      line-height: 56px;
      padding: 20px 10% 20px 5%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 5px;
      >div{
        white-space: nowrap;
      }
      .left-content{
        display:inline-block;
        vertical-align: middle;
        .baseline-name-all {
          font-size: 18px;
          color: #fff;
          margin-right: 30px;
          white-space: nowrap;
        }
      }
      .proImg {
        position: relative;
        font-size: 16px;
        &:after {
          content: '';
          background: url("../../../../assets/manageApp/beautyL.svg") 0 0 no-repeat;
          position: absolute;
          left: -20px;
          top: 5px;
          width: 10px;
          height: 12px;
        }
      }
      .nameTitle {
        margin-top: 4px;
      }
      .base-line-name{
        border: 1px solid #4e6e8c;
        color: #1ecdb5;
        background: #0a1f30;
        height: 25px;
        line-height: 20px;
        border-radius: 3px;
        font-size: 14px;
        padding-left: 2px;
        width: calc(73% - 200px);
        min-width: 70px;
        margin-left: 10px;
      }
      .btn-group{
        min-width: 125px;
        margin-left:20px;
        .baseline-add,.baseline-save,.baseline-cancel {
          display: inline-block;
          width: 40px;
          height: 27px;
          line-height: 27px;
          background: #38bab3;
          color: #192d40;
          font-size: 14px;
          text-align: center;
          border-radius: 3px;
          margin: 0 10px;
          color: #f9f9f9;
          cursor:pointer;
        }
      }
    }
    .add-monitor-div {
      margin-top: 20px;
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
          width: calc(100% - 66px);
          float: right;
          margin-left: 10px;
          border: 1px solid transparent;
        }
      }
    }
  }
  }
</style>