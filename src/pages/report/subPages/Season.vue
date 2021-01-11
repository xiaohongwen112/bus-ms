<template>
  <div class="charts-main">
    <NavBar :title="'季度报表'" />
    <Breadcrumb :title="'季度报表'" :crumbList="crumbList" />
    <div class="report-content-div season">
      <div class="config-box">
        <div class="season-con">
          <DatePicker @on-change="onSeaChange" :editable="false" type="year" :value="seaTime" :options="optionsYear"></DatePicker>
          <div class="sea-unit">年</div>
          <CmSelect :list="list" :selectVal="selectVal" @on-change="onChange" :disabledLi="disabledLi"></CmSelect>
        </div>
        <i class="icon-bms-reset" @click="backToday"></i>
        <CmBtn :disabled="finalExport || !session$.newpermissions.statement_export" @click="exportBtn" >导出报表</CmBtn>
      </div>
      <div class="report-title-div">
        <div class="title-wrap">
          <div :class="{'main-title': true, 'no-export': !exportable}">{{seaTime}}年{{selectVal}}报表</div>
        </div>
        <i :class="`icon-bms-report${toggle ? 'on' : 'off'}`" @click="toggleAllShow"></i>
      </div>
      <FixTit v-show="fixFlag" :choseStatus="choseStatus" :currentIndex="currentIndex" :currentNode="currentNode" :toggleStatus="toggleStatus" :curChildFlag="curChildFlag"
      :curTableFlag="curTableFlag" :currentTable="currentTable" :currentChild="currentChild" :currentKey="currentKey" :currentChildTable="currentChildTable"
      @on-toggle="toggleContent" @on-chose="choseContent" @on-childtoggle="toggleChild" @on-childchose="choseChild"/>
      <ScrollBar class="scroll-area" @ps-scroll-up="handleScroll" @ps-scroll-down="handleScroll">
        <div class="report-content" id="day_report_content" @mousewheel="handleScroll">
          <CmAlert type="season" source="common" v-if="JSON.stringify(data)!='{}'" ref="alert" title="1.当季告警预警信息统计一览表" :toggleStatus="toggleStatus" :choseStatus="choseStatus" :data="data.alert"
          @toggle-content="toggleContent" @chose-content="choseContent"/>
          <HealthTable ref="health" v-if="JSON.stringify(data)!='{}'" title="2.当季业务健康态势关键指标统计一览表" :toggleStatus="toggleStatus" :choseStatus="choseStatus" :data="data.intf_list"
          @toggle-content="toggleContent" @chose-content="choseContent"/>
          <Division type="season" source="common" ref="division"  v-if="JSON.stringify(data)!='{}'" title="3.当季单项业务分时表" :toggleStatus="toggleStatus" :choseStatus="choseStatus" :data="data.intf_list"
          @toggle-content="toggleContent" @chose-content="choseContent" @on-childtoggle="toggleChild" @on-childchose="choseChild"/>
          <Growth v-if="JSON.stringify(data)!='{}'" type="season" source="common" ref="growth" title="4.业务增长率" :toggleStatus="toggleStatus" :choseStatus="choseStatus" :data="data.intf_list"
          @toggle-content="toggleContent" @chose-content="choseContent" @on-childtoggle="toggleGrowthChild" @on-childchose="choseGrowthChild"/>
          <Business type="season" source="common" ref="business" v-if="JSON.stringify(data)!='{}'" title="5.当季业务统计一览表" :toggleStatus="toggleStatus" :choseStatus="choseStatus"
          :data="data.intf_list" @toggle-content="toggleContent" @chose-content="choseContent"/>
        </div>
      </ScrollBar>
      <span class="totop" :class="showToTop?'show':'hide'" @click="toTop"><i class="icon-bms-totop"></i></span>
      <form ref="exportForm" action="/zh-cn/report/seaexport/" target="_blank" method="GET" style="display:none;">
        <input type="hidden" name="fields" :value="JSON.stringify(fields)">
        <input type="hidden" name="ts" :value="timestamp">
        <input type="hidden" name="csrfmiddlewaretoken" :value="token">
      </form>
    </div>
  </div>
</template>
<script>
import jsCookie from 'js-cookie';
import { ScrollBar, CmBtn, CmSelect, NavBar, Breadcrumb } from '@/components/common';
import AreaChart from '@/components/common/AreaChart/index';
import { FixTit, CmAlert, HealthTable, Division, Business, Growth } from '@/components/report';
import moment from 'moment';
import Vue from 'vue';
import { DatePicker } from 'iview'; // 从iview引入DatePicker
import '@/assets/css/date-picker.scss'; // 引入样式
import * as api from '../service';

export default {
  name: 'Season',
  data() {
    const self = this;
    return {
      crumbList: ['index', 'manageapp', '查看报表', '季度报表'],
      showToTop: false,
      fields: {},
      timestamp: '',
      token: jsCookie.get('csrftoken'),
      disabledLi: [],
      seaTime: '',
      list: ['第一季度', '第二季度', '第三季度', '第四季度'],
      selectVal: '',
      optionsYear: {
        disabledDate(date) {
          const time = [];
          const disabledYear = date.getYear();
          self.timeRange.forEach((item) => {
            time.push(moment.unix(item).format('YYYY-MM').split('-')[0] - 1900);
          });
          return disabledYear < self.dedupe(time)[0] || disabledYear > self.dedupe(time)[self.dedupe(time).length - 1];
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
      currentNode: '1.当季告警预警信息统计一览表',
      currentChild: '',
      currentKey: '',
      data: {},
      division: [],
      divisionArr: [],
      growth: [],
      growthArr: [],
      finalTs: '',
      changeYear: false,
      fixFlag: true,
    };
  },
  computed: {
    getMonth() {
      switch (this.selectVal) {
        case '第一季度':
          return ['01月', '02月', '03月'];
        case '第二季度':
          return ['04月', '05月', '06月'];
        case '第三季度':
          return ['07月', '08月', '09月'];
        case '第四季度':
          return ['10月', '11月', '12月'];
        default:
          return this.selectVal;
      }
    },
    exportFlag() { // eslint-disable-line
      if (!this.choseStatus.alert && !this.choseStatus.health && !this.choseStatus.division && !this.choseStatus.growth && !this.choseStatus.business) {
        return true;
      }
      return false;
    },
    finalExport() {
      return this.exportable ? this.exportFlag : true;
    },
  },
  watch: {
    choseStatus: {
      handler(newVal) {
        if (newVal.division || newVal.growth) {
          this.dealData();
        }
      },
      deep: true,
    },
  },
  components: { ScrollBar, AreaChart, DatePicker, CmBtn, FixTit, CmAlert, HealthTable, Division, Business, Growth, CmSelect, NavBar, Breadcrumb },
  methods: {
    toTop() {
      const target = document.getElementsByClassName('ps-container');
      target[0].scrollTop = 0;
      this.showToTop = false;
      this.currentIndex = 'alert';
      this.currentNode = '1. 当日告警预警信息统计一览表';
      this.currentChild = '';
      this.currentKey = '';
      this.curTableFlag = true;
      this.currentTable = ['告警指标/类型', '基线告警', '健康度告警', '返回码告警'];
    },
    dedupe(array) { // 数组去重
      return Array.from(new Set(array));
    },
    arr(a, b) {
      const c = [];
      const tmp = a.concat(b);
      const o = {};
      for (var i = 0; i < tmp.length; i ++) (tmp[i] in o) ? o[tmp[i]] ++ : o[tmp[i]] = 1; // eslint-disable-line
      for (const x in o) if (o[x] == 1) c.push(x); // eslint-disable-line
      return c;
    },
    onSeaChange(val) {
      this.seaTime = val.split('-')[0];
      this.changeYear = true;
      this.changeTime();
    },
    onChange(val) {
      this.selectVal = val;
      this.changeYear = false;
      this.changeTime();
    },
    changeTime() {
      this.dealSeaTime();
      this.$nextTick(() => {
        const month = parseInt(this.getMonth[0], 10) < 10 ? `0${parseInt(this.getMonth[0], 10)}` : parseInt(this.getMonth[0], 10);
        this.finalTs = `${this.seaTime}-${month}`;
        sessionStorage.setItem('freahFlag', false);
        sessionStorage.setItem('chooseTime', moment(this.finalTs).format('X'));
        this.getSeaReport(this.finalTs);
      });
    },
    getSeason(month) {
      let selected = '';
      if (month === '01' || month === '02' || month === '03') {
        selected = '第一季度';
      } else if (month === '04' || month === '05' || month === '06') {
        selected = '第二季度';
      } else if (month === '07' || month === '08' || month === '09') {
        selected = '第三季度';
      } else {
        selected = '第四季度';
      }
      return selected;
    },
    dealSeaTime() {
      const self = this;
      const finalTime = [];
      this.timeRange.forEach((item) => {
        const time = moment.unix(item).format('YYYY-MM');
        const timeData = {
          year: time.split('-')[0],
          sea: self.getSeason(time.split('-')[1]),
        };
        finalTime.push(timeData);
      });
      self.disabledLi = [];
      const disableOption = [];
      finalTime.forEach((item) => {
        if (item.year === self.seaTime) {
          disableOption.push(item.sea);
        }
      });
      self.disabledLi = self.arr(disableOption, self.list);
      const chooseAble = this.arr(this.disabledLi, this.list);
      if (this.changeYear) this.selectVal = chooseAble[0];
    },
    async getTime() {
      try {
        const res = await api.seaInit();
        if (res.data.code === 0) {
          this.timeRange = res.data.data.time_range;
          this.$nextTick(() => {
            let ts = '';
            if (JSON.parse(sessionStorage.getItem('freahFlag'))) {
              ts = this.timeRange[this.timeRange.length - 1];
            } else {
              ts = sessionStorage.getItem('chooseTime');
            }
            this.timeVal = moment.unix(ts).format('YYYY-MM');
            this.seaTime = this.timeVal.split('-')[0];
            this.dealSeaTime();
            this.selectVal = this.getSeason(this.timeVal.split('-')[1]);
            this.getSeaReport(this.timeVal);
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getSeaReport(finalts) {
      try {
        Object.keys(this.choseStatus).forEach((item) => {
          this.choseStatus[item] = true;
        });
        this.dealData();
        const ts = moment(finalts).startOf('month').format('X');
        const res = await api.getSeaReport(ts);
        if (res.data.code === 0) {
          this.data = res.data.data;
          if (res.data.is_exeport !== undefined) this.exportable = res.data.is_exeport;
        }
      } catch (e) {
        console.log(e);
      }
    },
    backToday() {
      const ts = this.timeRange[this.timeRange.length - 1];
      this.timeVal = moment.unix(ts).format('YYYY-MM');
      this.seaTime = this.timeVal.split('-')[0];
      this.selectVal = this.getSeason(this.timeVal.split('-')[1]);
      this.getSeaReport(this.timeVal);
    },
    exportBtn() {
      this.fields = {
        alert: this.choseStatus.alert,
        health: this.choseStatus.health,
        transcount: this.choseStatus.business,
        division: this.division,
        growth: this.growth,
      };
      this.timestamp = this.finalTs !== '' ? parseInt(moment(this.finalTs).startOf('month').format('X'), 10) : this.data._id;
      this.$nextTick(() => {
        this.$refs.exportForm.submit();
      });
    },
    toggleAllShow() {
      this.toggle = !this.toggle;
      if (this.toggle) {
        this.curTableFlag = false;
        this.curChildFlag = false;
        Object.keys(this.toggleStatus).forEach((item) => {
          this.toggleStatus[item] = false;
        });
        this.fixFlag = false; // 全部折叠
      } else {
        Object.keys(this.toggleStatus).forEach((item) => {
          this.toggleStatus[item] = true;
        });
        this.fixFlag = true;
      }
    },
    toggleContent(id) {
      this.curTableFlag = false;
      this.toggleStatus[id] = !this.toggleStatus[id];
      if (this.toggleStatus[id] && this.toggle) {
        this.toggle = false;
        this.fixFlag = true;
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
        const growthH = this.$refs.growth.$el.offsetHeight;
        const businessH = this.$refs.business.$el.offsetHeight;
        const diviChildH = [];
        const growthChildH = [];
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
        if (this.$refs.growth.$refs.growthChildren !== null) {
          this.$refs.growth.$refs.growthChildren.forEach((item, index) => {
            const child = {
              index,
              height: item.offsetHeight,
            };
            growthChildH.push(child);
          });
        }
        // console.log('scroll', scrollTop, 'alert', alertH, 'health', healthH, 'division', divisionH, 'growthH', growthH, 'businessH', businessH);
        if (delta > 0) {
          if ((alertH + healthH + divisionH + growthH) < scrollTop) {
            // if (businessH < 765) this.fixFlag = false;
            // else this.fixFlag = true;
            this.showToTop = true;
            this.curTableFlag = false;
            this.currentIndex = 'business';
            this.currentNode = '5.当季业务统计一览表';
            this.currentChild = '';
            this.currentKey = '';
            this.curTableFlag = false;
          } else if ((alertH + healthH + divisionH) < scrollTop) {
            this.fixFlag = true;
            this.curTableFlag = false;
            this.currentIndex = 'growth';
            this.currentNode = '4.业务增长率';
            if (growthChildH.length !== 0) {
              let totalH = 0;
              for (const item of growthChildH.reverse()) { // eslint-disable-line
                totalH = item.height * item.index;
                if (scrollTop - (alertH + healthH + divisionH + totalH - 80) >= 0) {
                  const currKey = this.$refs.growth.$refs.growthChildren[item.index].id.split('_')[1];
                  this.currentChild = `(${item.index + 1})当季${currKey}业务增长率`;
                  this.currentKey = currKey;
                  return;
                }
              }
            }
          } else if ((alertH + healthH + 40) < scrollTop) {
            this.curTableFlag = false;
            this.currentIndex = 'division';
            this.currentNode = '3.当季单项业务分时表';
            if (diviChildH.length !== 0) {
              let currDiviH = 0;
              let totalH = 0;
              for (const item of diviChildH.reverse()) { // eslint-disable-line
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
                if (scrollTop - (alertH + healthH + totalH - 40) >= 0) {
                  const currKey = this.$refs.division.$refs.diviChildren[item.index].id.split('_')[1];
                  this.currentChild = `(${item.index + 1})当季${currKey}业务分时表`;
                  this.currentKey = currKey;
                  return;
                }
              }
            }
          } else if (alertH + 40 < scrollTop) {
            this.showToTop = false;
            this.currentIndex = 'health';
            this.currentNode = '2.当季业务健康态势关键指标统计一览表';
            this.currentChild = '';
            this.currentKey = '';
            if (scrollTop < alertH + healthTableH + 40) {
              this.curTableFlag = true;
              this.currentTable = ['编号', '业务名称', '交易量（笔）', '响应率（%）', '成功率（%）', '成功交易量（笔）', '响应时间（ms）'];
            } else {
              this.curTableFlag = false;
            }
          } else if (scrollTop <= alertH) {
            this.currentIndex = 'alert';
            this.currentNode = '1.当季告警预警信息统计一览表';
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
            this.currentNode = '1.当季告警预警信息统计一览表';
            this.currentChild = '';
            this.currentKey = '';
            if (scrollTop <= (alertH - 500)) {
              this.curTableFlag = true;
            } else {
              this.curTableFlag = false;
            }
          } else if (scrollTop <= (alertH + healthH) + 42) {
            this.currentIndex = 'health';
            this.currentNode = '2.当季业务健康态势关键指标统计一览表';
            this.currentChild = '';
            this.currentKey = '';
            this.currentTable = ['编号', '业务名称', '交易量（笔）', '响应率（%）', '成功率（%）', '成功交易量（笔）', '响应时间（ms）'];
            if (scrollTop <= (alertH + healthTableH - 160)) {
              this.curTableFlag = true;
            } else {
              this.curTableFlag = false;
            }
          } else if (scrollTop <= (alertH + healthH + divisionH) + 42) {
            this.showToTop = true;
            this.curTableFlag = false;
            this.currentIndex = 'division';
            this.currentNode = '3.当季单项业务分时表';
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
                  this.currentChild = `(${item.index + 1})当季${currKey}业务分时表`;
                  this.currentKey = currKey;
                  return;
                }
              }
            }
          } else if (scrollTop <= (alertH + healthH + divisionH + growthH + 40)) {
            this.curTableFlag = false;
            this.currentIndex = 'growth';
            this.currentNode = '4.业务增长率';
            if (growthChildH.length !== 0) {
              let totalH = 0;
              for (const item of growthChildH) { // eslint-disable-line
                totalH += item.height;
                if ((alertH + healthH + divisionH + totalH + 30) - scrollTop >= 0) {
                  const currKey = this.$refs.growth.$refs.growthChildren[item.index].id.split('_')[1];
                  this.currentChild = `(${item.index + 1})${currKey}业务增长率`;
                  this.currentKey = currKey;
                  return;
                }
              }
            }
          } else if (scrollTop <= (alertH + healthH + divisionH + growthH + businessH)) {
            // if (businessH < 765) this.fixFlag = false;
            // else this.fixFlag = true;
            this.curTableFlag = false;
            this.currentIndex = 'business';
            this.currentNode = '5.当季业务统计一览表';
            this.currentChild = '';
            this.currentKey = '';
          }
        }
      }
    },
    dealData() {
      this.divisionArr = [];
      this.division = [];
      if (this.$refs.division !== undefined && this.choseStatus.division) {
        this.divisionArr = this.$refs.division.$refs.diviChildren;
        if (this.divisionArr !== undefined) {
          this.divisionArr.forEach((item) => {
            this.division.push(item.id.split('_')[0]);
          });
        }
      }
      this.growthArr = [];
      this.growth = [];
      if (this.$refs.growth !== undefined && this.choseStatus.growth) {
        this.growthArr = this.$refs.growth.$refs.growthChildren;
        if (this.growthArr !== undefined) {
          this.growthArr.forEach((item) => {
            this.growth.push(item.id.split('_')[0]);
          });
        }
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
.report-content-div.season{
  .config-box{
    .ivu-date-picker{
      width: 73px;
      font-size: 14px;
      vertical-align: middle;
      background-color:transparent;
      .ivu-date-picker-next-btn-arrow-double{
        margin-right: 10px;
      }
      input{
        padding: 4px 0;
        text-align:right;
        cursor: text;
      }
      .ivu-input{
        padding-right:0;
        border:none;
        height: 26px;
        line-height: 26px;
        padding-right:25px;
        background-color:transparent;
        color: #4ab2a4;
        &:focus{
          outline: none;
        }
      }
      .ivu-input-wrapper{
        i{
          display:none;
        }
      }
      .ivu-date-picker-cells{
        width:100px;
        span{
          em{
            width: 40px;
          }
          &.ivu-date-picker-cells-cell{
            width: 42px;
            height: 28px;
            margin: 0 3px;
          }
        }
      }
      .ivu-date-picker-header{
        >span:nth-of-type(2){
          pointer-events: none;
        }
      }
    }
    .cm-select{
      width:100px !important;
      margin:-1px 0 0 0 !important;
      .input-container{
        input{
          height:26px !important;
          line-height:26px !important;
          background-color:transparent !important;
          padding-left:0 !important;
          padding-right: 25px !important;
          border: none !important;
          cursor:text !important;
          color: #4ab2a4 !important;
        }
        .icon-bms-tridown{
          font-size:14px !important;
          top: 6px !important;
          right: 7px !important;
        }
      }
      .skill{
        border: none !important;
        top:32px !important;
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
    button{
      line-height: 26px;
      padding: 0px 18px;
    }
  }
}
</style>
<style lang="scss" scoped>
@import '../../../assets/css/report.scss';
.report-content-div.season{
  .config-box{
    width:350px;
    text-align:left;
    .season-con{
      display:inline-block;
      width: 175px;
      box-sizing: border-box;
      border: 1px solid #0cdad4;
      font-size: 0;
      position: relative;
      vertical-align: middle;
      border-radius: 15px;
      height: 26px;
      .sea-unit{
        display: inline-block;
        font-size:16px;
        position: absolute;
        top: 1px;
        left: 50px;
        color: #4ab2a4;
      }
    }
  }
}
</style>
