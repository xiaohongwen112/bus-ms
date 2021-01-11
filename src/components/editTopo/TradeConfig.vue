<template>
  <div class="trade-config-warp">
    <!-- 业务起止 -->
    <div class="time-range-div">
      <div class="time-range-head first-title">
        <i class="title-icon"></i>
        <span class="title">业务起止</span>
        <i class="triangle-icon" :class="{ 'triangle-spread' : !collapseTime }" @click="collapseTime = !collapseTime">▶</i>
      </div>
      <div class="time-range-main cm-border" v-show="!collapseTime">
        <div class="col-xs-3">
          <i class="title-icon-small"></i>
          <span class="title-small">开始时间</span>
          <!-- <input class="cm-input start-time" type="text" v-model="data.business.ts_start"> -->
          <TimePicker class="start-time" format="HH:mm" placeholder="Select time"
            style="width: 112px"
            transfer
            :editable="false" v-model="data.business.str_start" @on-change="changeStart"
          ></TimePicker>
        </div>
        <div class="col-xs-3">
          <i class="title-icon-small"></i>
          <span class="title-small">结束时间</span>
          <!-- <input class="cm-input end-time" type="text" v-model="data.business.ts_end"> -->
          <TimePicker class="end-time" format="HH:mm" placeholder="Select time" style="width: 112px"
            :editable="false" transfer v-model="data.business.str_end" @on-change="changeEnd"
          ></TimePicker>
        </div>
        <div class="col-xs-6">
          <i class="title-icon-small"></i>
          <span class="title-small">周期</span>
          <CmWeek class="biz-week" :require="true" v-model="data.business.week" @click="changeWeek"/>
        </div>
      </div>
    </div>
    <!-- 告警日程 -->
    <div class="alert-daily-div">
      <div class="alert-daily-head first-title">
        <div class="alert-daily-head-left">
          <i class="title-icon"></i>
          <span class="title">告警日程</span>
          <i class="triangle-icon" :class="{ 'triangle-spread' : !collapseAlert }" @click="collapseAlert = !collapseAlert">▶</i>
        </div>
        <button class="click-btn" title="添加" @click="addAlert">添加</button>
      </div>
      <div class="cm-border alert-schedule-main" v-show="!collapseAlert">
        <AlertEdit  v-if="!isEdit" :class="{'cm-border-tip': isEditTip}" :data="currentAlert"
        @change="changeAlert"/>
        <ScrollBar class="alert-table" :style="{'height': `${ isEdit ? 250 : 104}px`}">
          <div class="monitor-info-item"
            v-for="(alert, index) in data.alert" :key="`alert-${index}`"
            v-if="currentAlertIndex !== index">
            <div class="col-xs-3">
              <span class="title-small title-blue alert-type-name">{{ alertTypeMap[alert.alert_type] }}</span>
              <span class="alert-freq">{{ getFreq(index) }}</span>
            </div>
            <div class="col-xs-7">
              <span class="title-small">免监控时段</span>
              <span class="title-small title-blue alert-times">{{ getTimes(alert.ts) }}</span>
            </div>
            <div class="col-xs-2 title-blue">
              <i class="handler" @click="letRun(index, true)" v-if="alert.switch !== 'on'">运行</i>
              <i class="handler" @click="letRun(index, false)" v-else>停用</i>
              <span class="handler" @click="onEdit(index)">编辑</span>
              <span class="handler" @click="onDelete(index)">删除</span>
            </div>
          </div>
        </ScrollBar>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import moment from 'moment';

import { alertTypeMap, mins2str } from '@/pages/editTopo/utils';

import { TimePicker } from 'iview';

import ScrollBar from '@/components/common/ScrollBar';
import CmWeek from '@/components/common/CmWeek';
import AlertEdit from './AlertEdit';

export default {
  name: 'TradeConfig',
  components: {
    TimePicker,
    ScrollBar,
    CmWeek,
    AlertEdit,
  },
  model: {
    prop: 'data',
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      collapseTime: false,
      collapseAlert: false,
      stTime: '00:00',
      enTime: '00:00',
      currentAlert: {},
      currentAlertIndex: null,
      alertTypeMap,
      isEditTip: false,
    };
  },
  computed: {
    isEdit() { return JSON.stringify(this.currentAlert) === '{}'; },
    today() {
      const tmpStr = moment.unix(this.session$.ts).format('YYYY-MM-DD');
      return Number(moment(`${tmpStr} 0:0:0`).format('X'));
    },
  },
  methods: {
    validEdit() {
      const res = this.isEdit;
      if (!res) {
        // 红色框提示
        this.isEditTip = true;
        const timer1 = window.setTimeout(() => {
          this.isEditTip = false;
          window.clearTimeout(timer1);
        }, 3000);
      }
      return res;
    },
    getFreq(index) {
      let res = '';
      if (this.data.alert[index].type === 'repeat') {
        const weekMap = {
          0: '周一至周日',
          1: '周一',
          2: '周二',
          3: '周三',
          4: '周四',
          5: '周五',
          6: '周六',
          7: '周日',
        };
        const weekText = this.data.alert[index].week_days.map(d => weekMap[d]);
        res = weekText.join(' ');
      } else {
        const daysText = ['day_start', 'day_end'].map(key => moment.unix(this.data.alert[index][key]).format('YYYY-MM-DD'));
        res = daysText.join('~');
      }
      return res;
    },
    getTimes(ts) {
      // console.log(ts);
      const res = ts.map(d => `${mins2str(d.ts_start)}~${mins2str(d.ts_end)}`);
      return res.join(' ');
    },
    changeWeek() {},
    letRun(index, bool) {
      if (this.validEdit()) {
        Object.assign(this.data.alert[index], {
          switch: bool ? 'on' : 'off',
        });
      }
    },
    onEdit(index) {
      if (this.validEdit()) {
        this.currentAlert = {};
        this.currentAlertIndex = index;
        // 数据
        this.currentAlert = _.cloneDeep(this.data.alert[index]);
        if (!Object.prototype.hasOwnProperty.call(this.currentAlert, 'week_days')) {
          Object.assign(this.currentAlert, { week_days: [0] });
        }
        if (!Object.prototype.hasOwnProperty.call(this.currentAlert, 'day_start')) {
          Object.assign(this.currentAlert, {
            day_start: this.today,
            day_end: this.today,
          });
        }
      }
    },
    onDelete(index) {
      if (this.validEdit()) {
        this.data.alert.splice(index, 1);
      }
    },
    addAlert() {
      this.collapseAlert = false;
      // 一次和重复
      if (this.validEdit()) {
        this.currentAlert = {
          status: 'edit',
          switch: 'on', // 运行|停用
          alert_type: 'all',
          app_name: 'app1',
          ts: [],
          intf_name: 'intf1',
          type: 'repeat',
          day_start: this.today,
          day_end: this.today,
          week_days: [0],
        };
      }
    },
    changeAlert(val, type) {
      // val 具体信息
      // type true保存, false取消且index !== null 插入到源位置
      // 保存编译-删除
      if (this.currentAlertIndex !== null && type) {
        this.data.alert.splice(this.currentAlertIndex, 1);
      }
      // 保存新建或编辑
      if (type) {
        this.data.alert.unshift(val);
      }
      this.currentAlertIndex = null;
      this.currentAlert = {};
    },
    changeStart(val) {
      console.log(val);
    },
    changeEnd(val) {
      console.log(val);
    },
  },
  watch: {
    data() {
      this.currentAlertIndex = null;
      this.currentAlert = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.trade-container{

}
.time-range-main, .alert-schedule-head{
  height: 56px;
  line-height: 56px;
  padding-left: 20px;
}
.time-left, .time-right{
  display: inline-block;
  width: calc(50% - 10px);
  line-height: 30px;
}
.monitor-info-item{
  height: 30px;
  line-height: 30px;
  margin-bottom: 3px;
  &:nth-child(even){
    background-color: #212F39;
  }
}
.handler{
  padding: 0 6px;
  cursor: pointer;
}
.alert-schedule-main{
  height: 250px;
}
.alert-type-name, .alert-freq, .alert-times{
  display: inline-block;
}
.alert-type-name{
  width: 60px;
}
.alert-daily-head-left{
  display: inline-block;
  width: calc(100% - 88px);
}
.first-title{
  margin: 20px 0 10px 0;
}
</style>
