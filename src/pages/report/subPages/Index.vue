<template>
  <div class="report-content-div report-index-div">
    <NavBar :title="'report'" />
    <Breadcrumb :title="'查看报表'" :crumbList="crumbList" />
    <img class="report-index-bg" usemap="#reportMap" :src="require(`../../../assets/report/listBg_${bgIndex}.png`)">
    <map name="reportMap" id="reportIndexMap">
      <area id="day-area" shape="rect" coords="52,28,242,223"
        :href="`${bgIndex > 0 ? '#/day' : '#'}`" :class="{'pointer': bgIndex > 0}">
      <area id="custom-area" shape="rect" coords="272,164,469,356"
        :class="{'pointer': bgIndex > 1}" @click="customChoose">
      <area id="month-area" shape="rect" coords="44,295,248,485"
        :href="`${bgIndex > 1 ? '#/month' : '#'}`" :class="{'pointer': bgIndex > 1}">
      <area id="season-area" shape="rect" coords="501,30,693,226"
        :href="`${bgIndex > 2 ? '#/season' : '#'}`" :class="{'pointer': bgIndex > 2}">
      <area id="year-area" shape="rect" coords="496,296,695,495"
        :href="`${bgIndex > 3 ? '#/year' : '#'}`" :class="{'pointer': bgIndex > 3}">
    </map>
    <ConfigBox v-if="showTime" :tabs="tabs" closeText="取消" :hideStore="false" :width="768" :height="200" :ulTop="ulTop" :ulLeft="ulLeft"
      :csBtnTop="csBtnTop" @closeConfig="closeBox">
      <div slot="customTime" class="customTime">
        <div>
          <span>时间范围</span>
          <DatePicker ref="datePicker" :value="timeVal" 
          @on-change="onTimeChange" 
          :editable="false"
          :options="options"
          :disabled="disTimeFlag"
          :start-date="startDate"
          type="datetimerange" 
          format="yyyy-MM-dd" 
          transfer/>
         </div>
         <div>
          <span class="graininess">颗粒度</span>
          <CmSelect :list="graininessList" :selectVal="grainChoosed" :disabledSelect="selectFlag" :disabledLi="disabledLi" @on-change="onGrainChange" @on-click="showTip"/>
         </div>
        <div class="btn-container">
         <CmBtn :disabled="confirmFlag" @click="clickBtn" >确认</CmBtn>
        </div>
      </div>
    </ConfigBox>
  </div>
</template>
<script>
import moment from 'moment';
import { ConfigBox, CmSelect, CmBtn, NavBar, Breadcrumb } from '@/components/common';
import { checkError } from '@/helpers/configValidate';
import '@/assets/css/date-picker.scss';
import { getSysTime } from '@/pages/areaMonitor/service';
import { DatePicker } from 'iview';
import * as d3 from 'd3';
import { indexInit, dayInit, getSpan } from '../service/';

export default {
  name: 'Index',
  components: { ConfigBox, CmSelect, DatePicker, CmBtn, NavBar, Breadcrumb },
  watch: {
    timeVal(newVal) {
      if (newVal !== '' && newVal[0] !== '') {
        const data = {
          ts_start: moment(newVal[0]).format('X'),
          ts_end: moment(newVal[1]).format('X'),
        };
        this.getSpan(data);
      }
      this.showTip();
    },
  },
  data() {
    const self = this;
    return {
      crumbList: ['index', 'manageapp', '查看报表'],
      bgIndex: 0,
      tabs: [
        { id: 'customTime', text: '自定义时间段' },
      ],
      ulTop: 'calc(40% - 125px)',
      ulLeft: 'calc(50% - 384px)',
      csBtnTop: 'calc(40% - 115px)',
      graininessList: ['天', '周', '月', '季', '年'],
      grainChoosed: '',
      timeVal: '',
      showTime: false,
      timeRange: [],
      options: {
        disabledDate(date) {
          return date && (date.valueOf() / 1000) < self.timeRange[0] || (date.valueOf() / 1000) > self.timeRange[self.timeRange.length - 1];
        },
      },
      selectFlag: true,
      disabledLi: [],
      listIndex: {
        WEEK: '周',
        YEAR: '年',
        DAY: '天',
        SEA: '季',
        MON: '月',
      },
      disTimeFlag: true,
      confirmFlag: true,
      startDate: '',
    };
  },
  methods: {
    async getSysTime() {
      try {
        const res = await getSysTime();
        if (res.data.code === 0) {
          const date = res.data.data.systime;
          const time = date.split(' ')[0];
          this.startDate = new Date(time);
        }
      } catch (e) {
        console.error(e);
      }
    },
    // 数组取差集
    subSet(arr1, arr2) {
      const set1 = new Set(arr1);
      const set2 = new Set(arr2);
      const subset = [];
      for (const item of set1) {
        if (!set2.has(item)) {
          subset.push(item);
        }
      }
      return subset;
    },
    closeBox() {
      this.showTime = false;
      this.timeVal = '';
      this.grainChoosed = '';
    },
    onGrainChange(val) {
      this.grainChoosed = val;
      if (this.timeVal !== '') this.confirmFlag = false;
    },
    onTimeChange(val) {
      this.timeVal = val;
      if (val === '' || val[0] === '') {
        this.confirmFlag = true;
      } else if (this.grainChoosed !== '') {
        this.confirmFlag = false;
      }
    },
    customChoose() {
      this.showTime = this.bgIndex > 0 ? true : ''; // eselint-disable-line
    },
    clickBtn() {
      const chosedValue = {
        type: this.grainChoosed,
        time: this.timeVal,
        abledTime: this.timeRange,
        disabledLi: this.disabledLi,
      };
      sessionStorage.setItem('chooseVal', JSON.stringify(chosedValue));
      window.location.href = '/zh-cn/report/index/#/custom/';
    },
    async getTime() {
      try {
        const res = await dayInit();
        if (res.data.code === 0) {
          this.timeRange = res.data.data.time_range;
          this.disTimeFlag = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getSpan(data) {
      try {
        const res = await getSpan(data);
        if (res.data.code === 0) {
          const listData = res.data.data;
          this.disabledLi = [];
          Object.keys(listData).forEach((key) => {
            if (!listData[key]) this.disabledLi.push(this.listIndex[key]);
          });
          this.grainChoosed = this.subSet(this.graininessList, this.disabledLi)[0];
          this.selectFlag = false;
          this.confirmFlag = false;
        } else {
          this.selectFlag = true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    resizeMapArea() {
      const coords = {
        season: {
          path: '501, 30, 693, 226',
        },
        year: {
          path: '496, 296, 695, 495',
        },
        day: {
          path: '52, 28, 242, 223',
        },
        month: {
          path: '44, 295, 248, 485',
        },
        custom: {
          path: '272, 164, 469, 356',
        },
      };
      d3.selectAll('#reportIndexMap area').each(function () { // eslint-disable-line
        const id = this.id.split('-')[0];
        const oldWidth = 747;
        const newWidth = d3.select('.report-index-bg')._groups[0][0].clientWidth;
        const oldCoords = coords[id].path.split(' ');
        const tmpCoords = [];

        for (let i = 0; i < oldCoords.length; i += 1) {
          const pointX = Math.round(parseInt(oldCoords[i].split(',')[0], 10) * newWidth / oldWidth);
          tmpCoords.push(`${pointX}`);
        }
        this.setAttribute('coords', tmpCoords.join(' '));
      });
    },
    showTip() {
      checkError({ bool: this.timeVal !== '' && this.timeVal[0] !== '', tip: this.timeVal !== '' && this.timeVal[0] !== '' ? '' : '请先选择时间范围' }, this.$refs.datePicker.$children[0].$el.children[1]);
    },
  },
  mounted() {
    indexInit()
      .then((res) => {
        if (res.data.code === 0) {
          const tmp = Object.values(res.data.data.time_range);
          this.bgIndex = tmp.reduce((a, c) => { // eslint-disable-line
            return a + c;
          }, 0);
        }
      });
    this.getTime();
    this.resizeMapArea();
    window.onresize = () => {
      this.resizeMapArea();
    };
    sessionStorage.setItem('freahFlag', true);
  },
  created() {
    this.getSysTime();
  },
};
</script>
<style lang="scss">
.report {
  .ivu-picker-confirm{
    display:none;
  }
  .customTime{
    .ivu-date-picker{
      width: 65%;
      margin-left: 10px;
      .ivu-input{
        width: 100%;
        height: 28px;
        line-height:29px;
        padding: 0 7px;
      }
      .ivu-icon-ios-calendar-outline{
        top: 5px;
        right: 7px;
      }
      .ivu-icon-ios-close{
        top: 5px;
      }
      .ivu-date-picker-next-btn-arrow-double{
        margin-right: 10px;
      }
    }
    .ivu-input{
      border: 1px solid #4e6e8c;
      background-color:#081928;
      color: #eee;
      &:focus{
        outline: none;
      }
    }
    .cm-select{
      width: 65%;
      margin-left: 0;
      .input-container{
        input{
          border: 1px solid #4e6e8c;
          color:#eee;
          background-color:#081928;
        }
        .icon-bms-tridown{
          font-size: 12px;
          color: #3acfc3;
          top: 11px;
          right: 7px;
        }
      }
    }
  }
  .ivu-select-dropdown{
    .ivu-date-picker-cells-header{
      span{
        font-size: 12px;
      }
    }
    .ivu-date-picker-cells{
      color: #d7e8e8;
      span.ivu-date-picker-cells-cell{
        font-size: 12px;
      }
    }
  }
  .report-index-div{
    .config-container{
      .config-main{
        width: auto;
      }
      .content{
        top: calc(40% + 25px) !important;
        overflow: visible;
        .nav-content{
          box-sizing: border-box;
          position: static !important;
          padding: 35px 50px 0 50px!important;
        }
      }
      .tabs{
        li {
          list-style:none;
        }
      }
      .CSBtn{
        .boxClose{
          color:#fff;
          font-size:14px;
          padding-left: 2px;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.report-index-bg{
    top: 50%;
    left: 50%;
    transform: translate(-50%,-35%);
    position: absolute;
    width: 40%;
    height: auto;
    
}
@media screen and (max-height: 780px) {
    .report-index-bg{
        transform: translate(-50%,-30%);
    }
}
@media screen and (max-height: 402px) {
    .report-index-bg{
        transform: translate(-50%,-25%);
    }
}
area{
  pointer-events: none;
  cursor: default;
}
.pointer{
  cursor: pointer;
}
.customTime{
  font-size:0;
  >div{
    display:inline-block;
    width: 100%;
    font-size: 16px;
    text-align: center;
    margin: 10px 0;
    .graininess{
      letter-spacing: 9px;
      margin-left: 9px;
    }
    &.btn-container{
      width: 55%;
      text-align: right;
      margin-top: 15px;
      padding-right: 5px;
      float: right;
      button{
        border: 1px solid #15c1e3;
        color: #eee;
        font-size: 14px;
        height: 30px;
        line-height: 24px;
        &:hover{
          color: #15c1e3;
          background-color:transparent;
        }
        &.disabled-btn{
          border: 1px solid #373737;
          color: #9d9c9c;
          &:hover{
            background: #373737;
            color: #9d9c9c;
          }
        }
      }
    }
  }
}
</style>
