<template>
  <div class="search_div">  
    <div class="search_item"
      v-for="(item, index) in selectList"
      :key="index"
    >
      <span class="title">{{ item.disp_name }}</span>
      <select class="cb-select" v-model="selectList[index].checkValue">
        <option value="*">所有</option>
        <option :value="index === 0 ? subItem.trans_type : subItem.sub_trans_type"
          v-for="(subItem, subIndex) in item.options"
          :key="subIndex"
        >
          {{ index === 0 ? subItem.trans_type : subItem.sub_trans_type }}
        </option>
      </select>
    </div>
    <div class="search_item">
      <DatePicker
      :value="dateInit"
      type="datetimerange"
      format="yyyy-MM-dd HH:mm" 
      :editable="false"
      :options="disableTime"
      @on-change="changeDate"
      ></DatePicker>
    </div>
    
    <div class="search_item" v-show="isStep">
        <span class="title">颗粒度</span>
        <select class="cb-select" v-model="metric">
            <option v-for="(item, index) in stepSize" :key="index" :value="`${item.value}`">{{ item.text }}</option>     
        </select>
    </div>
    <div class="search_item">
      <CmBtn @click="search">搜索</CmBtn>
    </div>
  </div>
</template>
<script>
import DatePicker from '@/components/common/DatePickerRange';
import { mapState } from 'vuex';
import CmBtn from '@/components/common/CmBtn';
import { ts2str, str2ts } from '@/helpers/utils';
import '@/assets/css/date-picker.scss';


export default {
  name: 'SearchBar',
  components: {
    DatePicker,
    CmBtn,
  },
  props: {
    isStep: { // 颗粒度下拉框
      type: Boolean,
      default: false,
    },
    panel: {  //  'biz_overview_chart'|'biz_overview_snapshot'|'biz_overview_time_trade'
      type: String,
      default: '',
    },
    currentTime: {
      type: Number,
      default: 0,
    },
  },
  data() {
    // const currentTime = this.session$.ts;
    const _this = this;
    return {
      formData: {
        dim_trans_type: '*',
        dim_sub_trans_type: '*',
        tsStart: null,
        tsEnd: null,
      },
      metric: '0',
      disableTime: {
        disabledDate(date) {
          return Date.parse(date) / 1000 > _this.currentTime;
        },
      },
    };
  },
  mounted() {
    this.init();
  },
  updated() {
    if (this.formData.tsStart === null) {
      [this.formData.tsStart, this.formData.tsEnd] = [this.tsStart, this.tsEnd];
    }
  },
  computed: {
    ...mapState({
      selectList: state => state.panel.selectList,
      tsStart: state => state.panel.tsStart,
      tsEnd: state => state.panel.tsEnd,
      strStart: state => ts2str(state.panel.tsStart, 'yyyy-MM-dd HH:mm'),
      strEnd: state => ts2str(state.panel.tsEnd, 'yyyy-MM-dd HH:mm'),
      currentIp: state => state.currentIp,
    }),
    dateInit() {
      return [this.strStart, this.strEnd];
    },
    stepSize() {
      const mapStepName = {
        0: '缺省',
        1: '1分钟',
        5: '5分钟',
        15: '15分钟',
        60: '1小时',
        1440: '1天',
      };
      let stepList = ['0', '1', '5', '15'];
      const timeRange = (this.formData.tsEnd - this.formData.tsStart) / (60 * 60);
      if (timeRange < 0) {
        stepList = [0, 1440];
      } else if (timeRange < 1) {
        stepList = [0, 1, 5, 15];
      } else if (timeRange < 24) {
        stepList = [0, 1, 5, 15, 60];
      } else if (timeRange < 120) {
        stepList = [0, 5, 15, 60, 1440];
      } else if (timeRange < 360) {
        stepList = [0, 15, 60, 1440];
      } else if (timeRange < 1440) {
        stepList = [0, 60, 1440];
      } else {
        stepList = [0, 1440];
      }
      // console.log(timeRange, stepList);
      const res = stepList.map(d => ({
        value: d,
        text: mapStepName[d],
      }));
      return res;
    },
  },
  methods: {
    init() {
      if (this.panel !== '') {
        this.$store.dispatch('getPanel', this.panel);
      }
    },
    search() {
      // 参数
      this.formData.dim_trans_type = this.selectList[0].checkValue;
      this.formData.dim_sub_trans_type = this.selectList[1].checkValue;
      if (this.panel === 'biz_overview_chart' || this.panel === 'biz_overview_time_trade') {
        this.formData.metric = this.metric === '0' ? '' : Number(this.metric);
      } else if (this.panel === 'biz_overview_snapshot') {
        this.formData.metric = 1;
      }
      if (this.formData.tsStart === null) {
        this.formData.tsStart = this.tsStart;
      }
      if (this.formData.tsEnd === null) {
        this.formData.tsEnd = this.tsEnd;
      }
      console.log(this.formData);
      this.$emit('search', this.formData);
    },
    changeDate(val) {
      this.formData.tsStart = str2ts(val[0]);
      this.formData.tsEnd = str2ts(val[1]);
      this.metric = '0';
    },
  },
  watch: {
    currentIp() {
      console.log('change-ip');
      this.init();
    },
  },
};
</script>
<style lang="scss" scoped>
.search_div{
  height: 57px;
  display: flex;
  align-items: center;
  text-align: left;
}
.search_item{
  float: left;
  padding: 0 10px;
}
@media screen and (max-width: 1200px){
  .search_item{
    padding: 0 5px;
    select{
      width: 60px;
      padding-left: 0px;
    }
  }
} 
@media screen and (max-width: 992px){
  .title{
      display: none;
  }
}
@media screen and (max-width: 768px){
    
}   
</style>