<template>
  <div>
    <div class="edit-top cm-high-bg">
      <div class="col-xs-4">
        <span class="title-small">免告警配置</span>
        <select class="cm-selct alert-type" v-model="newData.alert_type">
          <option
            v-for="(opt, index) in alertTypeList"
            :key="`alert-opt-${index}`"
            :value="opt.val"
          >
            {{ opt.name }}
          </option>
        </select>
        <CmTrigger class="alert-swtich" :text="['一次', '重复']" :val="alertFreqMap[newData.type]" @click="changeFreq"/>
      </div>
      <div class="col-xs-4" v-if="newData.type === 'concrete'">
        <span class="title-small">日期</span>
        <DatePicker 
          :value="[ts2str(newData.day_start), ts2str(newData.day_end)]"
          type="datetimerange"
          format="yyyy-MM-dd" 
          :editable="false"
          @on-change="changeDate"
          transfer
          ></DatePicker>
      </div>
      <div class="col-xs-4" v-else >
        <span class="title-small">星期</span>
        <CmWeek class="alert-week" :require="true" :weekValue="newData.week_days" @click="changeWeek"/>
      </div>
      <div class="col-xs-4 btns-wrap">
        <button class="click-btn" @click="onSave">保存</button>
        <button class="click-btn" @click="onCancel">取消</button>
      </div>
    </div>
    <div class="edit-main cm-high-bg" :class="{'cm-border-tip': !validTimeRange}">
      <div class="col-xs-2">
        <span class="title-small">免监控时段</span>
      </div>
      <div class="col-xs-10">
        <TimeAxis :timeList="newData.ts" @timeChange="timeChange"/>
      </div>
    </div>
  </div>
</template>

<script>

import moment from 'moment';
import _ from 'lodash';
import { alertTypeList, alertFreqMap } from '@/pages/editTopo/utils';

import CmWeek from '@/components/common/CmWeek';
import RectBtn from '@/components/common/RectBtn';
import CmTrigger from '@/components/common/CmTrigger';
import { DatePicker } from 'iview';

import TimeAxis from '@/components/common/TimeScheduleAxis';
import '@/assets/css/date-picker.scss';

export default {
  name: 'AlertEdit',
  components: {
    CmWeek,
    RectBtn,
    TimeAxis,
    DatePicker,
    CmTrigger,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    hasWeek: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      validTimeRange: true,
      newData: {},
      // newData: {
      //   status: 'edit',
      //   switch: 'on', // 运行|停用
      //   alert_type: 'all',
      //   app_name: 'app1',
      //   ts: [],
      //   intf_name: 'intf1',
      //   type: 'concrete',
      //   day_start: 1541779200,
      //   day_end: 1542211200,
      // },
      timeList: [],
      rangDays: {},
      alertTypeList,
      alertFreqMap,
    };
  },
  methods: {
    ts2str(ts) {
      return moment.unix(ts).format('YYYY-MM-DD');
    },
    str2ts(str) {
      return Number(moment(`${str} 0:0:0`).format('X'));
    },
    timeChange(val) {
      this.newData.ts = val.timeList;
    },
    changeFreq(name) {
      this.newData.type = name === '一次' ? 'concrete' : 'repeat';
    },
    changeWeek(val) {
      this.newData.week_days = val;
      // console.log(val);
    },
    changeDate(val) {
      // console.log(val);
      this.newData.day_start = this.str2ts(val[0]);
      this.newData.day_end = this.str2ts(val[1]);
    },
    onSave() {
      // 校验不为空
      if (this.newData.ts.length === 0) {
        // 红色框提示
        this.validTimeRange = false;
        const timer1 = window.setTimeout(() => {
          this.validTimeRange = true;
          window.clearTimeout(timer1);
        }, 3000);
      } else {
        this.$emit('change', this.newData, true);
      }
    },
    onCancel() {
      this.$emit('change', this.data, false);
    },
  },
  beforeMount() {
    this.newData = _.cloneDeep(this.data);
  },
};
</script>

<style lang="scss">
.edit-top{
  .rect-btn{
    padding: 0 8px !important;
  }
}
</style>

<style lang="scss" scoped>
.edit-top, .edit-main{
  height: 60px;
  line-height: 60px;
  margin-bottom: 10px;
  .alert-type{
    width: 100px;
  }
  .alert-week{
    vertical-align: -8px;
  }
}
.btns-wrap{
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .click-btn{
    margin-left: 20px;
  }
}
</style>
