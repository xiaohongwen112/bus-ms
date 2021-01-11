<template>
  <div class="charts-main">
    <NavBar :title="'自定义报表'" />
    <Breadcrumb :title="'自定义报表'" :crumbList="crumbList" />
    <div class="report-content-div custom">
      <div class="config-box">
        <div class="custom-con">
        <DatePicker ref="datePicker" @on-change="onTimeChange" :editable="false" :options="options" type="datetimerange" 
          format="yyyy-MM-dd" :value="timeVal" placement="bottom"></DatePicker>
        <CmSelect :list="graininessList" :selectVal="grainChoosed" :disabledLi="disabledLi" @on-change="onGrainChange" @on-click="showTip"/>
        </div>
        <i class="icon-bms-reset" @click="backToday"></i>
        <CmBtn :disabled="finalExport || !session$.newpermissions.statement_export" @click="exportBtn">
          导出报表
        </CmBtn>
      </div>
      <div class="report-title-div">
        <div class="title-wrap">
          <div :class="{'main-title': true, 'no-export': !exportable}">{{data._id}}</div>
        </div>
        <i :class="`icon-bms-report${toggle ? 'on' : 'off'}`" @click="toggleAllShow"></i>
      </div>
      <FixTit v-show="!toggle" :choseStatus="choseStatus" :currentIndex="currentIndex" :currentNode="currentNode" :toggleStatus="toggleStatus" :curChildFlag="curChildFlag"
      :curTableFlag="curTableFlag" :currentTable="currentTable" :currentChild="currentChild" :currentKey="currentKey" :currentChildTable="currentChildTable"
      @on-toggle="toggleContent" @on-chose="choseContent" @on-childtoggle="toggleChild" @on-childchose="choseChild"/>
      <ScrollBar class="scroll-area" @ps-scroll-up="handleScroll" @ps-scroll-down="handleScroll">
        <div class="report-content" id="day_report_content" @mousewheel="handleScroll">
          <CmAlert :type="chartType[grainChoosed]" source="custom" v-if="JSON.stringify(data)!='{}'" ref="alert"
            :title="`1.告警预警信息统计一览表`" :toggleStatus="toggleStatus" :choseStatus="choseStatus" 
            :data="data" :time="data.time" @toggle-content="toggleContent" @chose-content="choseContent"/>
          <HealthTable v-if="JSON.stringify(data)!='{}'" ref="health" :title="`2.业务健康态势关键指标统计一览表`" :toggleStatus="toggleStatus"
            :choseStatus="choseStatus" :data="data.intf_list" @toggle-content="toggleContent" @chose-content="choseContent"/>
          <Division :type="chartType[grainChoosed]" source="custom" ref="division" :title="`3.单项业务${reportType}阶段表`" 
            :toggleStatus="toggleStatus" :choseStatus="choseStatus" :data="data.intf_list" :time="data.time" @toggle-content="toggleContent"
            @chose-content="choseContent" @on-childtoggle="toggleChild" @on-childchose="choseChild"/>
          <Growth v-if="grainChoosed!=='天'&&grainChoosed!=='周'&&JSON.stringify(data)!='{}'" :type="chartType[grainChoosed]" source="custom" ref="growth" title="4.业务增长率"
            :toggleStatus="toggleStatus" :choseStatus="choseStatus" :data="data.intf_list" :time="data.time" @toggle-content="toggleContent"
            @chose-content="choseContent" @on-childtoggle="toggleGrowthChild" @on-childchose="choseGrowthChild"/>
          <Business v-if="JSON.stringify(data)!='{}'" :type="chartType[grainChoosed]" source="custom"
            ref="business" :title="`${businessIndex}.业务统计一览表`" :toggleStatus="toggleStatus"
            :choseStatus="choseStatus" :data="data.intf_list" :time="data.time" @toggle-content="toggleContent" @chose-content="choseContent"/>
        </div>
      </ScrollBar>
      <span class="totop" :class="showToTop?'show':'hide'" @click="toTop"><i class="icon-bms-totop"></i></span>
      <form ref="exportForm" action="/zh-cn/report/custom/export/"  target="_blank" method="GET" style="display:none;">
        <input type="hidden" name="fields" :value="JSON.stringify(fields)">
      </form>
    </div>
  </div>
</template>
<script>
import jsCookie from 'js-cookie';
import { ScrollBar, CmBtn, CmSelect, NavBar, Breadcrumb } from '@/components/common';
import AreaChart from '@/components/common/AreaChart/index';
import { FixTit, CmAlert, HealthTable, Division, Business, Growth } from '@/components/report';
import { checkError } from '@/helpers/configValidate';
import moment from 'moment';
import Vue from 'vue';
import { DatePicker } from 'iview'; // 从iview引入DatePicker
import '@/assets/css/date-picker.scss'; // 引入样式
import * as api from '../service';

export default {
  name: 'Custom',
  computed: {
    reportType() { // ['日', '周', '月', '季', '年']
      return this.grainChoosed === '天' ? '日' : this.grainChoosed;
    },
    businessIndex() {
      return this.grainChoosed === '年' || this.grainChoosed === '季' || this.grainChoosed === '月' ? '5' : '4';
    },
    exportFlag() { // eslint-disable-line
      if (['天', '周'].includes(this.grainChoosed)) {
        if (!this.choseStatus.alert && !this.choseStatus.health && !this.choseStatus.division && !this.choseStatus.business) {
          return true;
        }
        return false;
      } else { // eslint-disable-line
        if (!this.choseStatus.alert && !this.choseStatus.health && !this.choseStatus.division && !this.choseStatus.growth && !this.choseStatus.business) {
          return true;
        }
        return false;
      }
    },
    finalExport() {
      return this.exportable ? this.exportFlag : true;
    },
  },
  data() {
    const self = this;
    return {
      crumbList: ['index', 'manageapp', '查看报表', '自定义报表'],
      graininessList: ['天', '周', '月', '季', '年'],
      chartType: {
        天: 'day',
        周: 'week',
        月: 'month',
        季: 'season',
        年: 'year',
      },
      grainChoosed: JSON.parse(sessionStorage.getItem('freahFlag')) ? JSON.parse(sessionStorage.getItem('chooseVal')).type : sessionStorage.getItem('chooseFormatSpan'),
      showToTop: false,
      fields: {},
      token: jsCookie.get('csrftoken'),
      options: {
        disabledDate(date) {
          return date && (date.valueOf() / 1000) < self.timeRange[0] || (date.valueOf() / 1000) > self.timeRange[self.timeRange.length - 1];
        },
      },
      timeRange: JSON.parse(sessionStorage.getItem('chooseVal')).abledTime,
      timeVal: JSON.parse(sessionStorage.getItem('freahFlag')) ? JSON.parse(sessionStorage.getItem('chooseVal')).time : sessionStorage.getItem('chooseFormatTime').split(','), // 默认时间
      curChildFlag: false,
      currentChildTable: ['时间', '交易量（笔）', '响应率（%）', '成功率（%）', '成功交易量（笔）', '响应时间（ms）'],
      curTableFlag: true,
      currentTable: ['日期', '基线告警总数', '健康度告警总数', '返回码告警总数', '小计'],
      toggleStatus: {
        alert: true,
        health: true,
        division: true,
        growth: true,
        business: true,
      },
      choseStatus: {
        alert: true,
        health: true,
        division: true,
        growth: true,
        business: true,
      },
      toggle: false,
      exportable: true,
      currentIndex: 'alert',
      currentNode: '',
      currentChild: '',
      currentKey: '',
      textToStr: {
        天: 'DAY',
        周: 'WEEK',
        月: 'MON',
        季: 'SEA',
        年: 'YEAR',
      },
      data: {},
      disabledLi: JSON.parse(sessionStorage.getItem('chooseVal')).disabledLi,
      listIndex: {
        WEEK: '周',
        YEAR: '年',
        DAY: '天',
        SEA: '季',
        MON: '月',
      },
      division: [],
      divisionArr: [],
      growth: [],
      growthArr: [],
      timeStart: '',
      timeEnd: '',
      backTodayFlag: false,
      backParam: {},
    };
  },
  components: { ScrollBar, AreaChart, DatePicker, CmBtn, FixTit, CmAlert, HealthTable, Division, Business, Growth, CmSelect, NavBar, Breadcrumb },
  watch: {
    timeVal(newVal) {
      if (newVal !== '' && newVal[0] !== '' && !this.backTodayFlag) {
        const data = {
          ts_start: moment(newVal[0]).format('X'),
          ts_end: moment(newVal[1]).format('X'),
        };
        this.getSpan(data).then(() => {
          this.backTodayFlag = false;
          this.grainChoosed = this.subSet(this.graininessList, this.disabledLi)[0];
          sessionStorage.setItem('chooseSpan', this.textToStr[this.grainChoosed]);
          this.getCustomData({});
        });
      }
      this.showTip();
    },
    choseStatus: {
      handler(newVal) {
        if (newVal.division || newVal.growth) {
          this.dealData();
        }
      },
      deep: true,
    },
  },
  methods: {
    async getCustomData(param) {
      try {
        Object.keys(this.choseStatus).forEach((item) => {
          this.choseStatus[item] = true;
        });
        // this.dealData();
        let data = {};
        if (JSON.parse(sessionStorage.getItem('freahFlag')) || this.backTodayFlag) {
          data = param;
        } else {
          const time = sessionStorage.getItem('chooseTime').split(',');
          data = {
            ts_start: moment(parseInt(time[0], 10) * 1000).format('X'),
            ts_end: moment(parseInt(time[1], 10) * 1000).format('X'),
          };
          data.span = sessionStorage.getItem('chooseSpan');
        }
        const res = await api.getCustomData(data);
        if (res.data.code === 0) {
          this.toggle = false;
          this.data = res.data.data;
          if (res.data.data.is_exeport !== undefined) this.exportable = res.data.data.is_exeport;
        }
      } catch (e) {
        console.log(e);
      }
    },
    onGrainChange(val) {
      this.backTodayFlag = false;
      this.grainChoosed = val;
      this.toggle = true;
      Object.keys(this.choseStatus).forEach((item) => {
        this.choseStatus[item] = true;
      });
      sessionStorage.setItem('freahFlag', false);
      sessionStorage.setItem('chooseTime', [moment(this.timeVal[0]).format('X'), moment(this.timeVal[1]).format('X')]);
      sessionStorage.setItem('chooseFormatTime', this.timeVal);
      sessionStorage.setItem('chooseSpan', this.textToStr[this.grainChoosed]);
      sessionStorage.setItem('chooseFormatSpan', this.listIndex[this.textToStr[this.grainChoosed]]);
      if (!this.backTodayFlag) this.getCustomData({});
      this.toTop();
      this.curTableFlag = false;
    },
    toTop() {
      const target = document.getElementsByClassName('ps-container');
      target[0].scrollTop = 0;
      this.showToTop = false;
      this.currentIndex = 'alert';
      this.currentNode = '1.告警预警信息统计一览表';
      this.currentChild = '';
      this.currentKey = '';
      this.curTableFlag = true;
      this.currentTable = ['日期', '基线告警总数', '健康度告警总数', '返回码告警', '小计'];
    },
    dedupe(array) {
      return Array.from(new Set(array));
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
    backToday() {
      this.backTodayFlag = true;
      this.grainChoosed = JSON.parse(sessionStorage.getItem('chooseVal')).type;
      this.timeVal = JSON.parse(sessionStorage.getItem('chooseVal')).time;
      this.backParam = {
        ts_start: moment(this.timeVal[0]).format('X'),
        ts_end: moment(this.timeVal[1]).format('X'),
      };
      this.getSpan(this.backParam).then(() => {
        // this.backTodayFlag = false;
        // this.grainChoosed = this.subSet(this.graininessList, this.disabledLi)[0];
        this.backParam.span = this.textToStr[this.grainChoosed];
        this.getCustomData(this.backParam);
      });
    },
    exportBtn() {
      this.fields = {
        alert: this.choseStatus.alert,
        health: this.choseStatus.health,
        transcount: this.choseStatus.business,
        division: this.division,
      };
      if (this.grainChoosed !== '天' && this.grainChoosed !== '周') {
        this.fields.growth = this.growth;
      }
      this.$nextTick(() => {
        this.$refs.exportForm.submit();
      });
    },
    onTimeChange(val) {
      this.timeVal = val;
      this.timeStart = moment(this.timeVal[0]).format('X');
      this.timeEnd = moment(this.timeVal[1]).format('X');
      this.backTodayFlag = false;
      sessionStorage.setItem('freahFlag', false);
      sessionStorage.setItem('chooseTime', [this.timeStart, this.timeEnd]);
      sessionStorage.setItem('chooseFormatTime', [moment.unix(this.timeStart).format('YYYY-MM-DD'), moment.unix(this.timeEnd).format('YYYY-MM-DD')]);
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
        this.currentNode = '1.告警预警信息统计一览表';
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
      if (this.choseStatus.growth === false) {
        this.growth = [];
      } else {
        if (this.growth.length === 0) {
          this.growthArr.forEach((item) => {
            this.growth.push(item.id.split('_')[0]);
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
    toggleGrowthChild(param) {
      if (this.data.intf_list[param.key].division[0].growth === undefined) {
        Object.keys(this.data.intf_list).forEach((item) => {
          if (item.app_name !== undefined) {
            Vue.set(this.data.intf_list[item].division[0], 'growth', true);
          }
        });
        Vue.set(this.data.intf_list[param.key].division[0], 'growth', false);
      } else {
        this.data.intf_list[param.key].division[0].growth = !this.data.intf_list[param.key].division[0].growth;
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
    choseGrowthChild(param) {
      if (this.data.intf_list[param.key].division[0].chooseGrowth === undefined) {
        Object.keys(this.data.intf_list).forEach((item) => {
          if (item.app_name !== undefined) {
            Vue.set(this.data.intf_list[item].division[0], 'chooseGrowth', true);
          }
        });
        Vue.set(this.data.intf_list[param.key].division[0], 'chooseGrowth', false);
      } else {
        this.data.intf_list[param.key].division[0].chooseGrowth = !this.data.intf_list[param.key].division[0].chooseGrowth;
      }
      this.$nextTick(() => {
        this.growthArr.forEach((item) => {
          if (item.children[0].classList.contains('child-unselected')) {
            this.growth.splice(this.growth.indexOf(item.id.split('_')[0]), 1);
          }
        });
        if (this.growth.length === 0) this.choseStatus.growth = false;
        else this.choseStatus.growth = true;
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
        let growthH = 0;
        const growthChildH = [];
        if (this.$refs.growth) {
          growthH = this.$refs.growth.$el.offsetHeight;
          if (this.$refs.growth.$refs.growthChildren !== null) {
            this.$refs.growth.$refs.growthChildren.forEach((item, index) => {
              const child = {
                index,
                height: item.offsetHeight,
              };
              growthChildH.push(child);
            });
          }
        }
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
        if (delta > 0) {
          if ((alertH + healthH + divisionH + growthH + 40) < scrollTop) {
            this.showToTop = true;
            this.curTableFlag = false;
            this.currentIndex = 'business';
            this.currentNode = `${this.businessIndex}.业务统计一览表`;
            this.currentChild = '';
            this.currentKey = '';
            this.curTableFlag = false;
          } else if ((alertH + healthH + divisionH + 25) < scrollTop) {
            this.curTableFlag = false;
            this.currentIndex = 'growth';
            this.currentNode = '4.业务增长率';
            if (growthChildH.length !== 0) {
              let totalH = 0;
              for (const item of growthChildH.reverse()) { // eslint-disable-line
                totalH = item.height * item.index;
                if (scrollTop >= (alertH + healthH + divisionH + totalH + 40)) {
                  const currKey = this.$refs.growth.$refs.growthChildren[item.index].id.split('_')[1];
                  this.currentChild = `(${item.index + 1})${currKey}业务增长率`;
                  this.currentKey = currKey;
                  return;
                }
              }
            }
          } else if ((alertH + healthH + 40) < scrollTop) {
            this.curTableFlag = false;
            this.currentIndex = 'division';
            this.currentNode = `3.单项业务${this.reportType}阶段表`;
            if (diviChildH.length !== 0) {
              let currDiviH = 0;
              let totalH = 0;
              for (const item of diviChildH.reverse()) { // eslint-disable-line
                // console.log('diviChildH', item);
                totalH = item.height * item.index;
                if (item.index === diviChildH.length - 1) {
                  if (scrollTop <= this.$refs.division.$refs.diviChildren[item.index].offsetHeight + this.$refs.division.$refs.diviTable[item.index].offsetHeight + 1208) {
                    this.curChildFlag = true;
                  } else {
                    this.curChildFlag = false;
                  }
                } else {
                  for (let x = 0; x < item.index; x += 1) {
                    currDiviH += this.$refs.division.$refs.diviChildren.reverse()[x].offsetHeight;
                  }
                  if (scrollTop <= currDiviH + this.$refs.division.$refs.diviTable[item.index].offsetHeight + 1215) {
                    this.curChildFlag = true;
                  } else {
                    this.curChildFlag = false;
                  }
                }
                if (scrollTop - (alertH + healthH + totalH) >= 0) {
                  const currKey = this.$refs.division.$refs.diviChildren[item.index].id.split('_')[1];
                  this.currentChild = `(${item.index + 1})${currKey}业务${this.reportType}阶段表`;
                  this.currentKey = currKey;
                  return;
                }
              }
            }
          } else if (alertH < scrollTop) {
            this.showToTop = false;
            this.currentIndex = 'health';
            this.currentNode = '2.业务健康态势关键指标统计一览表';
            this.currentChild = '';
            this.currentKey = '';
            if (scrollTop < alertH + healthTableH) {
              this.curTableFlag = true;
              this.currentTable = ['编号', '业务名称', '交易量（笔）', '响应率（%）', '成功率（%）', '成功交易量（笔）', '响应时间（ms）'];
            } else {
              this.curTableFlag = false;
            }
          } else {
            this.currentIndex = 'alert';
            this.currentNode = '1.告警预警信息统计一览表';
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
          if (scrollTop < (alertH)) {
            this.currentIndex = 'alert';
            this.currentNode = '1.告警预警信息统计一览表';
            this.currentChild = '';
            this.currentKey = '';
            if (scrollTop <= (alertH - 500)) {
              this.curTableFlag = true;
            } else {
              this.curTableFlag = false;
            }
          } else if (scrollTop <= (alertH + healthH - 150)) {
            this.currentIndex = 'health';
            this.currentNode = '2.业务健康态势关键指标统计一览表';
            this.currentChild = '';
            this.currentKey = '';
            this.currentTable = ['编号', '业务名称', '交易量（笔）', '响应率（%）', '成功率（%）', '成功交易量（笔）', '响应时间（ms）'];
            if (scrollTop <= (alertH + healthTableH - 160)) {
              this.curTableFlag = true;
            } else {
              this.curTableFlag = false;
            }
          } else if (scrollTop >= (alertH + healthH + 88) && scrollTop <= (alertH + healthH + divisionH - 140)) {
            this.showToTop = true;
            this.curTableFlag = false;
            this.currentIndex = 'division';
            this.currentNode = `3.单项业务${this.reportType}阶段表`;
            if (diviChildH.length !== 0) {
              let currDiviH = 0;
              let totalH = 0;
              for (const item of diviChildH) { // eslint-disable-line
                totalH += item.height;
                if (item.index === 0) {
                  if (scrollTop <= alertH + healthH + this.$refs.division.$refs.diviTable[0].offsetHeight - 150 && scrollTop >= alertH + healthH + 150) {
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
                if ((alertH + healthH + totalH + 80) - scrollTop >= 0) {
                  const currKey = this.$refs.division.$refs.diviChildren[item.index].id.split('_')[1];
                  this.currentChild = `(${item.index + 1})${currKey}业务${this.reportType}阶段表`;
                  this.currentKey = currKey;
                  return;
                }
              }
            }
          } else if (scrollTop <= (alertH + healthH + divisionH + growthH) && scrollTop > (alertH + healthH + divisionH) + 25) {
            this.curTableFlag = false;
            this.currentIndex = 'growth';
            this.currentNode = '4.业务增长率';
            this.curTableFlag = false;
            if (growthChildH.length !== 0) {
              let totalH = 0;
              for (const item of growthChildH) { // eslint-disable-line
                totalH += item.height;
                if (scrollTop < (alertH + healthH + divisionH + totalH + 40)) {
                  const currKey = this.$refs.growth.$refs.growthChildren[item.index].id.split('_')[1];
                  this.currentChild = `(${item.index + 1})${currKey}业务增长率`;
                  this.currentKey = currKey;
                  return;
                }
              }
            }
          } else if (scrollTop <= (alertH + healthH + divisionH + growthH + businessH - 120) && scrollTop > (alertH + healthH + divisionH + growthH + 40)) {
            this.curTableFlag = false;
            this.currentIndex = 'business';
            this.currentNode = `${this.businessIndex}业务统计一览表`;
            this.currentChild = '';
            this.currentKey = '';
            this.curTableFlag = false;
          }
        }
      }
    },
    async getSpan(data) {
      try {
        const res = await api.getSpan(data);
        if (res.data.code === 0) {
          const listData = res.data.data;
          this.disabledLi = [];
          Object.keys(listData).forEach((key) => {
            if (!listData[key]) this.disabledLi.push(this.listIndex[key]);
          });
          this.selectFlag = false;
        } else {
          this.selectFlag = true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    showTip() {
      checkError({ bool: this.timeVal !== '' && this.timeVal[0] !== '', tip: this.timeVal !== '' && this.timeVal[0] !== '' ? '' : '请先选择时间范围' }, this.$refs.datePicker.$children[0].$el.children[1]);
    },
    dealData() {
      this.divisionArr = [];
      this.division = [];
      this.divisionArr = this.$refs.division.$refs.diviChildren;
      if (this.$refs.division !== undefined && this.choseStatus.division) {
        this.divisionArr.forEach((item) => {
          this.division.push(item.id.split('_')[0]);
        });
        if (this.$refs.growth !== undefined && this.choseStatus.growth) {
          this.growthArr = [];
          this.growth = [];
          this.growthArr = this.$refs.growth.$refs.growthChildren;
          this.growthArr.forEach((item) => {
            this.growth.push(item.id.split('_')[0]);
          });
        }
      }
    },
  },
  created() {
    this.currentNode = '1.告警预警信息统计一览表';
    const postData = {
      ts_start: moment(JSON.parse(sessionStorage.getItem('chooseVal')).time[0]).format('X'),
      ts_end: moment(JSON.parse(sessionStorage.getItem('chooseVal')).time[1]).format('X'),
      span: this.textToStr[this.grainChoosed],
    };
    if (JSON.parse(sessionStorage.getItem('freahFlag'))) {
      this.getCustomData(postData);
    } else {
      const freashParam = {
        ts_start: moment(this.timeVal[0]).format('X'),
        ts_end: moment(this.timeVal[1]).format('X'),
      };
      this.getSpan(freashParam).then(() => {
        const oldTime = sessionStorage.getItem('chooseFormatTime').split(',');
        const latestTime = JSON.parse(sessionStorage.getItem('chooseVal')).time;
        if (oldTime[0] === latestTime[0] && oldTime[1] === latestTime[1]) this.grainChoosed = sessionStorage.getItem('chooseFormatSpan');
        else this.grainChoosed = this.subSet(this.graininessList, this.disabledLi)[0];
        this.getCustomData({});
      });
    }
  },
  updated() {
    this.dealData();
  },
};
</script>
<style lang="scss">
.charts-main{
  .report-content-div.custom{
    .config-box{
      .custom-con{
        display:inline-block;
        width: 320px;
        box-sizing: border-box;
        font-size: 0;
        vertical-align: middle;
        .ivu-date-picker{
          width: 220px;
          font-size: 14px;
          vertical-align: middle;
          background-color:transparent;
        }
        .ivu-date-picker-next-btn-arrow-double{
          margin-right: 10px;
        }
        input{
          text-align:left;
          cursor: text;
        }
        .ivu-input{
          padding-right:0;
          height: 28px;
          line-height: 26px;
          padding-left: 8px;
          background-color:transparent;
          color: #4ab2a4;
          border-radius:13px;
          &:focus{
            outline:none;
          }
        }

        .ivu-picker-confirm{
          display:none;
        }
        .ivu-input-icon{
          top: 4px;
        }
        .cm-select{
          width: 70px !important;
          margin: 0 10px 0 !important;
          .input-container{
            input{
              height:28px !important;
              line-height:26px !important;
              background-color:transparent !important;
              color: #4ab2a4 !important;
              border-radius: 13px;
            }
            .icon-bms-tridown{
              font-size:14px !important;
              top: 8px !important;
              right: 7px !important;
            }
          }
          .skill{
            width: 60px;
            border: none !important;
            top:32px !important;
            right:5px !important;
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
}
</style>
<style lang="scss" scoped>
@import '../../../assets/css/report.scss';
.charts-main{
  .report-content-div.custom{
    .config-box{
      width:500px;
      .custom-con{
        .icon-bms-tridown{
          position: absolute;
          top: 7px;
          right: 8px;
          color: #4ab2a4;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
