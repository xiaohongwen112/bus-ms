<template>
  <div class="charts-main">
    <NavBar :title="'月报表'" />
    <Breadcrumb :title="'月报表'" :crumbList="crumbList" />
    <div class="report-content-div month">
      <div class="config-box">
        <DatePicker :value="timeVal" format="yyyy-MM" @on-change="onTimeChange" :editable="false" :options="options" type="month" placeholder="请选择时间"></DatePicker>
        <i class="icon-bms-reset" @click="backToday"></i>
        <CmBtn :disabled="finalExport || !session$.newpermissions.statement_export" @click="exportBtn" >导出报表</CmBtn>
      </div>
      <div class="report-title-div">
        <div class="title-wrap">
          <div :class="{'main-title': true, 'no-export': !exportable}">{{titleTime}}报表</div>
        </div>
        <i :class="`icon-bms-report${toggle ? 'on' : 'off'}`" @click="toggleAllShow"></i>
      </div>
      <FixTit v-show="!toggle" :choseStatus="choseStatus" :currentIndex="currentIndex" :currentNode="currentNode" :toggleStatus="toggleStatus" :curChildFlag="curChildFlag"
      :curTableFlag="curTableFlag" :currentTable="currentTable" :currentChild="currentChild" :currentKey="currentKey" :currentChildTable="currentChildTable"
      @on-toggle="toggleContent" @on-chose="choseContent" @on-childtoggle="toggleChild" @on-childchose="choseChild"/>
      <ScrollBar class="scroll-area" @ps-scroll-up="handleScroll" @ps-scroll-down="handleScroll">
        <div class="report-content" id="day_report_content" @mousewheel="handleScroll">
          <CmAlert type="month" source="common" v-if="JSON.stringify(data)!='{}'" ref="alert" title="1.当月告警预警信息统计一览表" :toggleStatus="toggleStatus" :choseStatus="choseStatus" :data="data.alert"
          @toggle-content="toggleContent" @chose-content="choseContent"/>
          <HealthTable ref="health" v-if="JSON.stringify(data)!='{}'" title="2.当月业务健康态势关键指标统计一览表" :toggleStatus="toggleStatus" :choseStatus="choseStatus" :data="data.intf_list"
          @toggle-content="toggleContent" @chose-content="choseContent"/>
          <Division type="month" source="common" ref="division" title="3.当月单项业务分时表" :toggleStatus="toggleStatus" :choseStatus="choseStatus" :data="data.intf_list"
          @toggle-content="toggleContent" @chose-content="choseContent" @on-childtoggle="toggleChild" @on-childchose="choseChild"/>
          <Business type="month" source="common" v-if="JSON.stringify(data)!='{}'" ref="business" title="4.当月业务统计一览表" :toggleStatus="toggleStatus" :choseStatus="choseStatus"
          :data="data.intf_list" @toggle-content="toggleContent" @chose-content="choseContent"/>
        </div>
      </ScrollBar>
      <span class="totop" :class="showToTop?'show':'hide'" @click="toTop"><i class="icon-bms-totop"></i></span>
      <form ref="exportForm" action="/zh-cn/report/monexport/" target="_blank" method="GET" style="display:none;">
        <input type="hidden" name="fields" :value="JSON.stringify(fields)">
        <input type="hidden" name="ts" :value="timestamp">
        <input type="hidden" name="csrfmiddlewaretoken" :value="token">
      </form>
    </div>
  </div>
</template>
<script>
import jsCookie from 'js-cookie';
import { ScrollBar, CmBtn, NavBar, Breadcrumb } from '@/components/common';
import AreaChart from '@/components/common/AreaChart/index';
import { FixTit, CmAlert, HealthTable, Division, Business } from '@/components/report';
import moment from 'moment';
import Vue from 'vue';
import { DatePicker } from 'iview'; // 从iview引入DatePicker
import '@/assets/css/date-picker.scss'; // 引入样式
import * as api from '../service';

export default {
  name: 'Month',
  data() {
    const self = this;
    return {
      crumbList: ['index', 'manageapp', '查看报表', '月报表'],
      showToTop: false,
      fields: {},
      timestamp: '',
      token: jsCookie.get('csrftoken'),
      options: {
        disabledDate(date) {
          return date && (date.valueOf() / 1000) < self.timeRange[0] || (date.valueOf() / 1000) > self.timeRange[self.timeRange.length - 1];
        },
      },
      timeRange: [],
      timeVal: '', // 默认时间
      curChildFlag: false,
      currentChildTable: ['时间', '交易量（笔）', '响应率（%）', '成功率（%）', '成功交易量（笔）', '响应时间（ms）'],
      curTableFlag: true,
      currentTable: ['日期', '基线告警总数', '健康度告警总数', '返回码告警总数', '小计'],
      toggleStatus: {
        alert: true,
        health: true,
        division: true,
        business: true,
      },
      choseStatus: {
        alert: true,
        health: true,
        division: true,
        business: true,
      },
      toggle: false,
      exportable: true,
      currentIndex: 'alert',
      currentNode: '1.当月告警预警信息统计一览表',
      currentChild: '',
      currentKey: '',
      data: {},
      division: [],
      divisionArr: [],
    };
  },
  watch: {
    choseStatus: {
      handler(newVal) {
        if (newVal.division) {
          this.dealData();
        }
      },
      deep: true,
    },
  },
  computed: {
    titleTime() {
      let title = '';
      if (this.data._id && this.data._id !== undefined) {
        const time = moment.unix(this.data._id).format('YYYY-MM-DD');
        title = `${time.split('-')[0]}年${time.split('-')[1]}月`;
      }
      return title;
    },
    exportFlag() { // eslint-disable-line
      if (!this.choseStatus.alert && !this.choseStatus.health && !this.choseStatus.division && !this.choseStatus.business) {
        return true;
      }
      return false;
    },
    finalExport() {
      return this.exportable ? this.exportFlag : true;
    },
  },
  components: { ScrollBar, AreaChart, DatePicker, CmBtn, FixTit, CmAlert, HealthTable, Division, Business, NavBar, Breadcrumb },
  methods: {
    toTop() {
      const target = document.getElementsByClassName('ps-container');
      target[0].scrollTop = 0;
      this.showToTop = false;
      this.currentIndex = 'alert';
      this.currentNode = '1.当日告警预警信息统计一览表';
      this.currentChild = '';
      this.currentKey = '';
      this.curTableFlag = true;
      this.currentTable = ['告警指标/类型', '基线告警', '健康度告警', '返回码告警'];
    },
    async getTime() {
      try {
        const res = await api.monthInit();
        if (res.data.code === 0) {
          this.timeRange = res.data.data.time_range;
          let ts = '';
          if (JSON.parse(sessionStorage.getItem('freahFlag'))) {
            ts = this.timeRange[this.timeRange.length - 1];
          } else {
            ts = sessionStorage.getItem('chooseTime');
          }
          this.timeVal = moment.unix(ts).format('YYYY-MM');
          this.$nextTick(() => {
            this.getMonReport(ts);
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getMonReport(ts) {
      try {
        Object.keys(this.choseStatus).forEach((item) => {
          this.choseStatus[item] = true;
        });
        this.dealData();
        const res = await api.getMonReport(ts);
        if (res.data.code === 0) {
          this.data = res.data.data;
          if (res.data.data.is_exeport !== undefined) {
            this.exportable = false;
          } else {
            this.exportable = true;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    backToday() {
      const ts = this.timeRange[this.timeRange.length - 1];
      this.timeVal = moment.unix(ts).format('YYYY-MM');
      this.getMonReport(ts);
    },
    exportBtn() {
      this.fields = {
        alert: this.choseStatus.alert,
        health: this.choseStatus.health,
        transcount: this.choseStatus.business,
        division: this.division,
      };
      this.timestamp = moment(this.timeVal).format('X');
      this.$nextTick(() => {
        this.$refs.exportForm.submit();
      });
    },
    onTimeChange(val) {
      this.timeVal = val;
      sessionStorage.setItem('freahFlag', false);
      if (val !== '') {
        const ts = moment(val).format('X');
        sessionStorage.setItem('chooseTime', ts);
        this.getMonReport(ts);
      }
    },
    toggleAllShow() {
      this.toggle = !this.toggle;
      if (this.toggle) {
        this.curTableFlag = false;
        this.curChildFlag = false;
        Object.keys(this.toggleStatus).forEach((item) => {
          this.toggleStatus[item] = false;
        });
      } else {
        Object.keys(this.toggleStatus).forEach((item) => {
          this.toggleStatus[item] = true;
        });
        this.currentNode = '1.当月告警预警信息统计一览表';
        this.currentChild = '';
      }
    },
    toggleContent(id) {
      this.curTableFlag = false;
      this.toggleStatus[id] = !this.toggleStatus[id];
      if (this.toggleStatus[id] && this.toggle) {
        this.toggle = false;
      }
    },
    choseContent(id) {
      this.choseStatus[id] = !this.choseStatus[id];
      if (this.choseStatus.division === false) {
        this.division = [];
      } else {
        if (this.division.length === 0) {
          this.divisionArr.forEach((item) => {
            this.division.push(item.id.split('_')[0]);
          });
        }
      }
    },
    toggleChild(param) {
      if (this.data.intf_list[param.key].division[0].active === undefined) {
        Object.keys(this.data.intf_list).forEach((item) => {
          if (item.app_name !== undefined) {
            Vue.set(this.data.intf_list[item].division[0], 'active', true);
          }
        });
        Vue.set(this.data.intf_list[param.key].division[0], 'active', false);
      } else {
        this.data.intf_list[param.key].division[0].active = !this.data.intf_list[param.key].division[0].active;
      }
    },
    choseChild(param) {
      if (this.data.intf_list[param.key].division[0].choose === undefined) {
        Object.keys(this.data.intf_list).forEach((item) => {
          if (item.app_name !== undefined) {
            Vue.set(this.data.intf_list[item].division[0], 'choose', true);
          }
        });
        Vue.set(this.data.intf_list[param.key].division[0], 'choose', false);
      } else {
        this.data.intf_list[param.key].division[0].choose = !this.data.intf_list[param.key].division[0].choose;
      }
      this.$nextTick(() => {
        this.divisionArr.forEach((item) => {
          if (item.children[0].classList.contains('child-unselected')) {
            this.division.splice(this.division.indexOf(item.id.split('_')[0]), 1);
          }
        });
        if (this.division.length === 0) this.choseStatus.division = false;
        else this.choseStatus.division = true;
      });
    },
    handleScroll(event) {
      if (!this.toggle) {
        let delta = '';
        let scrollTop = '';
        if (event.type === 'mousewheel') {
          delta = event.wheelDelta;
          scrollTop = document.getElementsByClassName('ps-container')[0].scrollTop;
        } else if (event.type === 'ps-scroll-down') {
          delta = -1;
          scrollTop = event.target.scrollTop;
        } else if (event.type === 'ps-scroll-up') {
          delta = 1;
          scrollTop = event.target.scrollTop;
        }
        const alertH = this.$refs.alert.$el.offsetHeight;
        const healthH = this.$refs.health.$el.offsetHeight;
        const divisionH = this.$refs.division.$el.offsetHeight;
        const businessH = this.$refs.business.$el.offsetHeight;
        const diviChildH = [];
        const healthTableH = this.$refs.health.$refs.healthTable.offsetHeight;
        if (this.$refs.division.$refs.diviChildren !== null) {
          this.$refs.division.$refs.diviChildren.forEach((item, index) => {
            const child = {
              index,
              height: item.offsetHeight,
            };
            diviChildH.push(child);
          });
        }
        // console.log('scroll', scrollTop, 'alert', alertH, 'health', healthH, 'division', divisionH, 'business', businessH);
        if (delta > 0) {
          if ((alertH + healthH + divisionH + 40) < scrollTop) {
            this.showToTop = true;
            this.curTableFlag = false;
            this.currentIndex = 'business';
            this.currentNode = '4.当月业务统计一览表';
            this.currentChild = '';
            this.currentKey = '';
            this.curTableFlag = false;
          } else if ((alertH + healthH) < scrollTop) {
            this.showToTop = true;
            this.curTableFlag = false;
            this.currentIndex = 'division';
            this.currentNode = '3.当月单项业务分时表';
            if (diviChildH.length !== 0) {
              let currDiviH = 0;
              let totalH = 0;
              for (const item of diviChildH.reverse()) { // eslint-disable-line
                totalH = item.height * item.index;
                if (item.index === diviChildH.length - 1) {
                  if (scrollTop <= this.$refs.division.$refs.diviChildren[item.index].offsetHeight + this.$refs.division.$refs.diviTable[item.index].offsetHeight + 2308) {
                    this.curChildFlag = true;
                  } else {
                    this.curChildFlag = false;
                  }
                } else {
                  for (let x = 0; x < item.index; x += 1) {
                    currDiviH += this.$refs.division.$refs.diviChildren.reverse()[x].offsetHeight;
                  }
                  if (scrollTop <= alertH + healthH + currDiviH + this.$refs.division.$refs.diviTable[item.index].offsetHeight + 40) {
                    this.curChildFlag = true;
                  } else {
                    this.curChildFlag = false;
                  }
                }
                if (scrollTop >= (alertH + healthH + totalH)) {
                  const currKey = this.$refs.division.$refs.diviChildren[item.index].id.split('_')[1];
                  this.currentChild = `(${item.index + 1})当月${currKey}业务分时表`;
                  this.currentKey = currKey;
                  return;
                }
              }
            }
          } else if (alertH + 40 < scrollTop) {
            this.showToTop = false;
            this.currentIndex = 'health';
            this.currentNode = '2.当月业务健康态势关键指标统计一览表';
            this.currentChild = '';
            this.currentKey = '';
            if (scrollTop < alertH + healthTableH - 160) {
              this.curTableFlag = true;
              this.currentTable = ['编号', '业务名称', '交易量（笔）', '响应率（%）', '成功率（%）', '成功交易量（笔）', '响应时间（ms）'];
            } else {
              this.curTableFlag = false;
            }
          } else if (scrollTop <= alertH) {
            this.currentIndex = 'alert';
            this.currentNode = '1.当月告警预警信息统计一览表';
            this.currentChild = '';
            this.currentKey = '';
            if (scrollTop <= alertH - 500) {
              this.curTableFlag = true;
              this.currentTable = ['日期', '基线告警总数', '健康度告警总数', '返回码告警总数', '小计'];
            } else {
              this.curTableFlag = false;
            }
          }
        }
        if (delta < 0) {
          if (scrollTop <= (alertH)) {
            this.currentIndex = 'alert';
            this.currentNode = '1.当月告警预警信息统计一览表';
            this.currentChild = '';
            this.currentKey = '';
            if (scrollTop <= (alertH - 500)) {
              this.curTableFlag = true;
            } else {
              this.curTableFlag = false;
            }
          } else if (scrollTop <= (alertH + healthH)) {
            this.currentIndex = 'health';
            this.currentNode = '2.当月业务健康态势关键指标统计一览表';
            this.currentChild = '';
            this.currentKey = '';
            this.currentTable = ['编号', '业务名称', '交易量（笔）', '响应率（%）', '成功率（%）', '成功交易量（笔）', '响应时间（ms）'];
            if (scrollTop <= (alertH + healthTableH - 370)) {
              this.curTableFlag = true;
            } else {
              this.curTableFlag = false;
            }
          } else if (scrollTop <= (alertH + healthH + divisionH + 40)) {
            this.showToTop = true;
            this.curTableFlag = false;
            this.currentIndex = 'division';
            this.currentNode = '3.当月单项业务分时表';
            if (diviChildH.length !== 0) {
              let currDiviH = 0;
              let totalH = 0;
              for (const item of diviChildH) { // eslint-disable-line
                totalH += item.height;
                if (item.index === 0) {
                  if (scrollTop <= alertH + healthH + this.$refs.division.$refs.diviTable[0].offsetHeight) {
                    this.curChildFlag = true;
                  } else {
                    this.curChildFlag = false;
                  }
                } else {
                  for (let x = 0; x < item.index; x += 1) {
                    currDiviH += this.$refs.division.$refs.diviChildren[x].offsetHeight;
                  }
                  if (scrollTop <= alertH + healthH + currDiviH + this.$refs.division.$refs.diviTable[item.index].offsetHeight + 40) {
                    this.curChildFlag = true;
                  } else {
                    this.curChildFlag = false;
                  }
                }
                if (scrollTop <= (alertH + healthH + totalH)) {
                  const currKey = this.$refs.division.$refs.diviChildren[item.index].id.split('_')[1];
                  this.currentChild = `(${item.index + 1})当月${currKey}业务分时表`;
                  this.currentKey = currKey;
                  return;
                }
              }
            }
          } else if (scrollTop <= (alertH + healthH + divisionH + businessH)) {
            this.curTableFlag = false;
            this.currentIndex = 'business';
            this.currentNode = '4.当月业务统计一览表';
            this.currentChild = '';
            this.currentKey = '';
          }
        }
      }
    },
    dealData() {
      this.divisionArr = [];
      this.division = [];
      this.divisionArr = this.$refs.division.$refs.diviChildren;
      if (this.divisionArr !== undefined && this.choseStatus.division) {
        this.divisionArr.forEach((item) => {
          this.division.push(item.id.split('_')[0]);
        });
      }
    },
  },
  created() {
    this.getTime();
  },
  updated() {
    this.dealData();
  },
};
</script>
<style lang="scss">
.report-content-div.month{
  .config-box{
    .ivu-date-picker{
      width: 132px;
      height: 28px;
      border-radius: 14px;
      .ivu-input{
        width: 100%;
        height: 28px;
        line-height:29px;
        padding: 0 7px;
        border-radius: 14px;
        color: #4ab2a4;
        &:focus{
          outline: none;
        }
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
      .ivu-date-picker-cells-header{
        span{
          font-size: 12px;
        }
      }
      .ivu-date-picker-cells{
        span.ivu-date-picker-cells-cell{
          font-size: 12px;
          width: 30px;
        }
        span{
          em {
            width:34px;
          }
        }
      }
    }
    button{
      line-height: 26px;
      padding: 0px 18px;
    }
  }
  .report-time-chart{
      .legend-group{
      li {
        span{
          font-size: 14px;
          margin: 0 2px;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import '../../../assets/css/report.scss';
</style>
