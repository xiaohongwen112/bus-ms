<template>
  <div class="date-picker">
    <DatePicker :value="timeVal" @on-change="onTimeChange" :editable="false" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择时间"></DatePicker>
    <span>选择的时间：{{timeVal}}</span>
    <div class="year-box">
      <DatePicker :value="timeYear" @on-change="onYearChange" :options="optionsYear" :editable="false" type="year" placeholder="请选择"></DatePicker>
      <span>选择的年份：{{timeYear}}</span>
    </div>
    <div class="season-box">
      <div class="season-con">
        <DatePicker @on-change="onSeaChange" :editable="false" type="year" :value="seaTime"></DatePicker>
        <div class="sea-unit">年</div>
        <CmSelect :list="list" :selectVal="selectVal" @on-change="onChange"></CmSelect>
      </div>
      <span class="choose">选择的季度是：{{chooseSeaTime}}</span>
    </div>
    <div class="month-box">
      <DatePicker :value="timeMonth" format="yyyy-MM" @on-change="onMonthChange" :options="options1" :editable="false" type="month" placeholder="请选择"></DatePicker>
      <span>选择的月份：{{timeMonth}}</span>
    </div>
    <div class="month-box">
      <DatePicker :value="timeMonth1" format="yyyy-MM" @on-change="onMonthChangeA" :options="options2" :editable="false" type="month" placeholder="请选择"></DatePicker>
      <span>选择的月份：{{timeMonth1}}</span>
    </div>
    <div class="month-box">
      <DatePicker :value="timeMonth2" format="yyyy-MM" @on-change="onMonthChangeB" :options="options3" :editable="false" type="month" placeholder="请选择"></DatePicker>
      <span>选择的月份：{{timeMonth2}}</span>
    </div>
    <div class="month-box">
      <DatePicker :value="timeMonth3" format="yyyy-MM" @on-change="onMonthChangeC" :options="options4" :editable="false" type="month" placeholder="请选择"></DatePicker>
      <span>选择的月份：{{timeMonth3}}</span>
    </div>
  </div>
</template>

 <script>
  import { DatePicker } from 'iview'; // 从iview引入DatePicker
  import CmSelect from '@/components/common/CmSelect';
  import '@/assets/css/date-picker.scss'; // 引入样式
  import moment from 'moment';

  export default {
    name: 'date-picker',
    components: { DatePicker, CmSelect },
    computed: {
      chooseSeaTime() {
        return `${this.seaTime}年${this.selectVal}`;
      },
    },
    data() {
      return {
        seaTime: moment().format('YYYY-MM-DD').split('-')[0],
        list: ['第一季度', '第二季度', '第三季度', '第四季度'],
        selectVal: '第一季度',
        timeVal: ['2018-03-24 15:12:10', '2018-05-24 15:12:10'], // 默认时间
        timeYear: '',
        timeMonth: '2018-08',
        timeMonth1: '',
        timeMonth2: '',
        timeMonth3: '',
        options1: {
          disabledDate(date) {
            const disabledMonth = date.getMonth();
            return disabledMonth < 5;
          },
        },
        options2: {
          disabledDate(date) {
            const disabledYear = date.getYear();
            const disabledMonth = date.getMonth();
            return disabledYear === 118 && disabledMonth === 6;
          },
        },
        options3: {
          disabledDate(date) {
            const disabledMonth = date.getMonth();
            return disabledMonth !== 5 && disabledMonth !== 6;
          },
        },
        options4: {
          disabledDate(date) {
            const disabledYear = date.getYear();
            return disabledYear !== 118;
          },
        },
        optionsYear: {
          disabledDate(date) {
            const disabledYear = date.getYear();
            return disabledYear !== 118;
          },
        },
      };
    },
    methods: {
      onChange(val) {
        console.log(val);
        this.selectVal = val;
      },
      onTimeChange(val) {
        this.timeVal = val;
      },
      onMonthChange(val) {
        this.timeMonth = val;
      },
      onMonthChangeA(val) {
        this.timeMonth1 = val;
      },
      onMonthChangeB(val) {
        this.timeMonth2 = val;
      },
      onMonthChangeC(val) {
        this.timeMonth3 = val;
      },
      onYearChange(val) {
        this.timeYear = val;
      },
      onSeaChange(val) {
        this.seaTime = val;
      },
    },
  };
 </script>
<style lang="scss">
.year-box, .season-box, .month-box{
  margin: 10px 0;
  .ivu-date-picker{
    width: 180px;
    .ivu-date-picker-cells{
      width: 210px;
      text-align: center;
      margin: 0;
      span{
        &.ivu-date-picker-cells-cell{
          width:35px;
          margin: 3px 5px;
          em{
            width: 35px;
          }
        }
      }
    }
    .ivu-date-picker-next-btn-arrow-double{
      margin-right: 10px;
    }
    .ivu-picker-panel-content{
      text-align: center;
    }
  }
}
.season-con{
  display:inline-block;
  width: 180px;
  box-sizing: border-box;
  border: 1px solid #0cdad4;
  font-size: 0;
  position: relative;
  vertical-align: middle;
  .ivu-date-picker{
    width: 73px;
    font-size: 14px;
    vertical-align: middle;
    background-color:transparent;
    input{
      padding: 4px 0;
      text-align:right;
      cursor: text;
    }
    .ivu-input{
      padding-right:0;
      border:none;
      padding-right:25px;
    }
    i{
      display:none;
    }
    .ivu-date-picker-cells{
      width:100px;
    }
  }
  .sea-unit{
    display: inline-block;
    font-size:16px;
    position: absolute;
    top: 5px;
    left: 50px;
  }
  .cm-select{
    width:100px !important;
    margin:-1px 0 0 0 !important;
    .input-container{
      input{
        background-color:transparent !important;
        color:#c6d0e2 !important;
        padding-left:0 !important;
        padding-right: 25px !important;
        border: none !important;
        cursor:text !important;
      }
      .icon-bms-tridown{
        font-size:14px !important;
        top: 10px !important;
        right: 7px !important;
      }
    }
    .skill{
      border: none !important;
      top:37px !important;
      right:23px !important;
      li{
        font-size:14px !important;
        line-height: 28px !important;
        height: 28px !important;
        text-align: center !important;
        padding-left: 0 !important;
      }
    }
  }
}
</style>
 <style lang="scss" scoped>
   .date-picker{
     margin: 20px;
   }
   .season-con{
     .choose{
       vertical-align:middle;
     }
   }
 </style>