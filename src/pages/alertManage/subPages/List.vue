<template>
  <div>
    <div class="main-content">
      <div class="search">
        <Search v-model="searchKey" :placeholder="'请输入要查询的业务名或节点名'" @on-search="searchFn" :iconStyle="'top:8px'" :borderStyle="'border:1px solid #4ab2a5;width:300px'"></Search>
      </div>
      <div class="rule-list-content">
        <div class="table-container" ref="tableContainer">
          <div class="table-container-disable" v-if="!session$.newpermissions.rule_list_edit"></div>
          <ScrollBar class="scroll-area" :options="{useBothWheelAxes: true}">
            <table>
              <thead ref="tableHead">
                <tr class="head-row-1">
                  <td>序号</td>
                  <td>业务名称</td>
                  <td>节点名称</td>
                  <td>健康度</td>
                  <td>交易量上基线</td>
                  <td>交易量下基线</td>
                  <td>成功率</td>
                  <td>响应时间</td>
                  <td>响应率</td>
                  <td>网口</td>
                  <td>协议</td>
                  <td colspan="2" class="last-col">操作</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-if="filteredRows.length === 0"
                >
                  <td class="no-data" colspan="14">暂无数据</td>
                </tr>
                <tr
                  v-for="(r, k) in visisbleRowsData"
                  :key="k"
                  @click="onEdit(r, k)"
                  :class="{selected: selectedRow === k }"
                  @mousemove="selectedRow = k"
                  @mouseout="!showEdit ? selectedRow = -1 : null"
                >
                  <td>{{ k + 1 }}</td>
                  <td>{{ r.appName }}</td>
                  <td>{{ r.nodeName }}</td>
                  <td>{{ r.healthTxt }}</td>
                  <td>{{ r.transCountUpTxt }}</td>
                  <td>{{ r.transCountDownTxt }}</td>
                  <td>{{ r.succRateTxt }}</td>
                  <td>{{ r.durationTxt }}</td>
                  <td>{{ r.rrRateTxt }}</td>
                  <td>{{ r.nic }}</td>
                  <td>{{ protocols[r.protocol].config.display_name }}</td>
                  <td>
                    <button @click.stop="toTopoOverview(r, k)" :class="{'overview': true, 'disabled': r.state == 'edit'}" title="可视化服务图"></button>
                    <button @click.stop="toTopoEdit(r, k)" class="edit" title="可视化服务图设计"></button>
                    <button @click.stop="copyBnt(r, k)" class="copy" title="复制"></button>
                    <button @click.stop="pasteRule(r, k)" class="paste" title="粘贴"></button>
                    <button @click.stop="deleteRule(r, k)" class="delete" title="删除规则"></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </ScrollBar>
        </div>
      </div>
      <footer class="footer">
        共计 <span class="record-number">{{ filteredRows.length }}</span> 条记录
        <Pagination v-if="totalPage !== 0" :total="totalPage" :current="currentPage" @to-page="toPage"/>
      </footer>
      <RuleConfigModal
        v-if="showEdit"
        @close="closeModal"
        @save="saveEdting"
        :rule="currentNode.rule"
        :trades="currentNode.tradeData"
        :nodeInfo="currentNode"
      />
      <CmTip
        v-if="showTip"
        :tipContent="tipContent"
        :autoClose="true"
        :showFooter="showFooter"
        @on-confirm="() => whichFun ? applyApp() : copyRule()"
        :closeFn="() => {showTip = false}"
      />
      <DialogModal
        :show="showApply"
        :percent="percent"
        :msg="msg"
        :finish="finish"
        :showApplyOk="showApplyOk"
        @clickOk="onApplyOk"
      />
    </div>
  </div>
</template>
<script>

/* eslint-disable no-param-reassign, prefer-template, no-unused-vars, no-nested-ternary */

import _ from 'lodash';
import { Search } from '@/components/basic/index';
import RuleConfigModal from '@/components/ruleList/RuleConfigModal';
import ScrollBar from '@/components/basic/ScrollBar';
import CmTip from '@/components/basic/CmTip';
import Pagination from '@/components/basic/Pagination';
import DialogModal from '@/components/editTopo/DialogModal';
import { getBaseLine } from '@/pages/editTopo/service';
import { genV4 as uuidV4 } from 'uuidjs';
import ad from '@/helpers/alertAdapters';
import { serverNode } from '@/helpers/nodeObject';
// import { ruleInstance } from '../utils_list';
import * as api from '../service';


/**
 * 建议，除非后端改接口，否则不要轻易修改此函数
 */
const buildRows = (someData, appObj, datapaths, workTimes) => {
  const result = [];
  // 处理嵌套的十分恶心的不知道干什么用的数据
  _.forEach(someData, (data) => {
    _.forOwn(data, (v, name) => {
      _.forEach(v, (l) => {
        if (l.alarmrules && l.alarmrules.threshold) {
          const datapathTrade = _.find(datapaths, d => d.name === name);
          const trade = _.find(datapathTrade.trade, t => t.settings.name === l.level);
          const workTime = _.find(workTimes, wt => wt.app === name);
          // const intfWorkTime = _.find(workTime.data, wt => wt.intf_name === trade.collector[0].name);
          const row = {
            app: name,
            appName: appObj[name].disp_name,
            state: appObj[name].state,
            intfName: trade.collector[0].name,
            node: l.level,
            nodeName: (_.find(appObj[name].levels, n => n.name === l.level) || {}).disp_name,
            rule: l.alarmrules,
            nic: trade.collector[0].nic_addr,
            protocol: trade.collector[0].target_prot,
            // workTimeOn: intfWorkTime.switch,
          };
          result.push(row);
        }
      });
    });
  });
  return result;
};

const genTxt = (obj, index, unit) => { // eslint-disable-line
  return obj.baseOn ? '自动' : (obj.values[index].val !== null ? obj.values[index].val + unit : '未设置');
};

const toReadableRows = rows => rows.map((row) => {
  const { app, appName, state, intfName, node, nodeName, rule, nic, tradeData, protocol, workTimeOn } = row;
  const { health, threshold: t } = rule;

  const obj = {
    health,
    transCount: t.trans_count,
    succRate: t.succ_rate,
    duration: t.duration,
    rrRate: t.rr_rate,
  };

  obj.health = ad.health.db2view(obj.health);
  obj.transCount = ad.trans_count.db2view(obj.transCount);
  obj.succRate = ad.succ_rate.db2view(obj.succRate);
  obj.duration = ad.duration.db2view(obj.duration);
  obj.rrRate = ad.rr_rate.db2view(obj.rrRate);

  return {
    workTimeOn,
    protocol,
    nic,
    app,
    appName,
    state,
    node,
    nodeName,
    rule,
    tradeData,
    healthTxt: genTxt(obj.health, 1, '%'),
    transCountUpTxt: genTxt(obj.transCount, 0, '笔'),
    transCountDownTxt: genTxt(obj.transCount, 1, '笔'),
    succRateTxt: genTxt(obj.succRate, 0, '%'),
    durationTxt: genTxt(obj.duration, 0, 'ms'),
    rrRateTxt: genTxt(obj.rrRate, 0, '%'),
  };
});

const addCountToRows = (rows) => {
  let tempRow = {};
  const results = _.cloneDeep(rows);
  _.forEach(results, (row) => {
    if (tempRow.app !== row.app) {
      row.count = 1;
      tempRow = row;
    } else {
      tempRow.count += 1;
    }
  });
  return results;
};


export default {
  name: 'list',
  components: {
    RuleConfigModal,
    ScrollBar,
    CmTip,
    Pagination,
    DialogModal,
    Search,
  },
  data() {
    return {
      nav: ['manageapp', 'alert', 'index', 'indexmore'],
      crumbList: ['index', 'manageapp', 'rulelist'],
      appObj: {},
      datapaths: [],
      tradeData: [],
      rows: [],
      selectedRow: -1,
      search: {
        app: '',
        node: '',
      },
      showEdit: false,
      currentNode: {},
      showTip: false,
      whichFun: false,
      copyData: [],
      copyNum: 1,
      showFooter: true,
      tipMessage: '',
      showApply: false,
      percent: 0,
      msg: [],
      finish: '',
      showApplyOk: false,
      applyData: [],
      tipContent: '',
      perPageCount: 1,
      currentPage: 1,
      workTimes: [],
      tmpNode: null,
      searchKey: '',
      protocols: null,
      visisbleRowsData: [], // 过滤数据
      serverNode,
    };
  },
  methods: {
    toPage(page) {
      this.currentPage = page;
    },
    saveEdting(r, nodeInfo, delOp, ifParse) {
      if (process.env.NODE_ENV === 'development') console.log('saving', r, nodeInfo);
      const datapath = _.clone(_.find(this.datapaths, p => p.name === nodeInfo.app));
      const i = _.findIndex(datapath.trade, t => t.settings.name === nodeInfo.node);
      const scheduleData = {};
      if (i > -1) {
        if (ifParse) {
          datapath.trade[i].collector[0].disp_name = r[1].disp_name;
          datapath.trade[i].collector[0].server_id = r[1].server_id;
          datapath.trade[i].collector[0].nic_addr = r[1].nic_addr;
          datapath.trade[i].collector[0].target_prot = r[1].target_prot;
          datapath.trade[i].settings.correlated_group_name = r[2].correlated_group_name;
          datapath.trade[i].settings.correlated_trade_group_name = r[2].correlated_trade_group_name;
          datapath.trade[i].settings.is_double_live = r[2].is_double_live;
          datapath.trade[i].settings.is_master = r[2].is_master;
          datapath.trade[i].settings.is_slave = r[2].is_slave;
          datapath.trade[i].settings.is_twoway_trade = r[2].is_twoway_trade;
        }
        datapath.trade[i].alarmrules = r[0];
      } else throw new Error('index Error');
      this.applyData = datapath;
      api.saveDataPath(nodeInfo.app, datapath, scheduleData).then((res) => {
        if (res.data.code === 0) {
          this.tipContent = delOp ? '删除成功' : '保存成功,是否应用';
          this.showFooter = !delOp;
          this.showTip = true;
          this.whichFun = true;
          this.getData();
        }
      });
    },
    applyApp() {
      const appName = this.currentNode.app;
      this.showTip = false;
      let count = 0;
      const all = 28;
      const taskId = uuidV4().hexString;
      const event = new EventSource(`/zh-cn/events/task/${taskId}/`);
      this.finish = '正在应用您做的修改，请稍候。可能会需要几分钟...';
      this.showApply = true;
      const _this = this;
      const aLdataPath = this.applyData;
      event.addEventListener('ack', () => {
        this.applyDataPath(appName, aLdataPath, taskId);
      }, false);
      event.addEventListener('event', (e) => {
        count += 1;
        const time = window.getServerTime();
        _this.percent = Number((count / all).toFixed(2));
        _this.msg.push(`${time}  ${JSON.parse(e.data).msg}`);
      }, false);
      event.addEventListener('eof', () => {
        event.close();
        _this.showApplyOk = true;
        _this.percent = 1;
      }, false);
    },
    async applyDataPath(appName, datapath, taskId) {
      try {
        const res = await api.applyDataPath(appName, datapath, taskId);
        const time = window.getServerTime();
        if (res.data.error && res.data.error === 1) {
          this.finish = res.data.error_msg;
        } else {
          this.finish = `${time} 应用已经完成！可关闭窗口`;
        }
      } catch (e) {
        console.log('error', e);
      }
    },
    onApplyOk() {
      this.showApply = false;
    },
    closeModal() {
      this.selectedRow = -1;
      this.showEdit = false;
    },
    setSearchApp(ev) {
      this.currentPage = 1;
      this.search.app = ev.target.value.replace(/(^\s*)|(\s*$)/g, '');
    },
    onEdit(row, k) {
      getBaseLine(this.currentNode.app, this.currentNode.intfName, true)
        .then((res) => {
          const data = res.data.data;
          // console.log(data);
          this.$store.commit('setBaseline', data);
          // set data of modal
          this.selectedRow = k;
          this.showEdit = true;
          this.currentNode = row;
          // 新建采集器配置数据粘贴
          this.currentNode.tradeData = this.tradeData;
        });
    },
    copyBnt(row, k) {
      this.showTip = true;
      this.whichFun = false;
      this.showFooter = true;
      this.tipContent = '复制成功，请粘贴配置';
      this.copyData = row;
      this.copyNum = k;
    },
    copyRule() {
      // 新建采集器配置数据复制
      const retTrade = [];
      const row = this.copyData;
      const whichApp = row.app;
      const k = this.copyNum;
      const traDeChooce = [];
      const tradeD = this.tradeData;
      tradeD.forEach((item, index) => {
        if (tradeD[index].datapath.name === whichApp) {
          traDeChooce.push(tradeD[index]);
        }
      });
      const traDe = traDeChooce[0].datapath.trade;
      traDe.forEach((item, index) => {
        if (traDe[index].settings !== undefined) {
          if (traDe[index].settings.name === row.node) {
            retTrade.push(traDe[index]);
          }
        }
      });
      row.tradeData = retTrade[0].collector[0];
      row.settingData = retTrade[0].settings;
      this.tmpNode = row;
    },
    searchFn() { // 搜索
      // const _this = this;
      // try {
      //   const name = this.searchKey;
      //   const adata = await searchProtocol(name);
      //   if (adata.data.code === 0) {
      //     _this.proListData = adata.data.data.protocol_list;
      //     this.pageProtocol();
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
      this.currentPage = 1;
      const name = this.searchKey;
      this.search.app = name.replace(/(^\s*)|(\s*$)/g, '');
    },
    pasteRule(row, k) {
      if (this.tmpNode) {
        const r = [];
         // 新建采集器配置数据粘贴
        r.push(this.tmpNode.rule);
        r.push(this.tmpNode.tradeData);
        r.push(this.tmpNode.settingData);
        this.saveEdting(r, row, false, false);
        this.currentNode.app = row.app;
        this.tmpNode = null;
      }
    },
    getDataPath(appName) {
      return api.getDataPath(appName);
    },
    deleteRule(row) {
      // const blankRule = ruleInstance();
      const blankRule = _.cloneDeep(serverNode.alarmrules);
      const retTrade = [];
      const whichApp = row.app;
      const tradeD = this.tradeData;
      const traDeChooce = [];
      tradeD.forEach((item, index) => {
        if (tradeD[index].datapath.name === whichApp) {
          traDeChooce.push(tradeD[index]);
        }
      });
      const traDe = traDeChooce[0].datapath.trade;
      traDe.forEach((item, index) => {
        if (traDe[index].settings !== undefined) {
          if (traDe[index].settings.name === row.node) {
            retTrade.push(traDe[index]);
          }
        }
      });
      row.tradeData = retTrade[0].collector[0];
      row.settingData = retTrade[0].settings;
      const r = [];
        // 新建采集器配置数据粘贴
      r.push(blankRule);
      r.push(row.tradeData);
      r.push(this.initsettingData());
      this.saveEdting(r, row, true, false);
    },
    initsettingData() {
      // 重置删除采集器中的汇集模式与双向配置
      const initData = {};
      initData.correlated_group_name = '';
      initData.correlated_trade_group_name = '';
      initData.is_double_live = false;
      initData.is_master = true;
      initData.is_slave = true;
      initData.is_twoway_trade = false;
      return initData;
    },
    toTopoEdit(row) {
      window.open(`/zh-cn/edit/datapath/${row.app}/`);
    },
    toTopoOverview(row) {
      if (this.datapaths.some(d => d.name === row.app && d.state === 'apply')) {
        window.open(`/zh-cn/overview/${row.app}/`);
      }
    },
    async getData() {
      try {
        const res = await api.getAllApps();
        const appObj = _.reduce(res.data.data, (p, app) => {
          const { name, disp_name, state, areas } = app;
          const levels = areas.length < 1 ? [] : areas[0].levels.map(l => ({ name: l.name, disp_name: l.disp_name }));
          p[name] = { disp_name, state, levels };
          return p;
        }, {});

        this.appObj = appObj;

        const rs = await Promise.all(Object.keys(appObj)
          .map(appName => api.getDataPath(appName)));
        this.datapaths = rs.map(r => r.data.data.datapath);
        this.tradeData = rs.map(r => r.data.data);
        // const workTimes = await Promise.all(Object.keys(appObj)
        //   .map(async appName => ({ app: appName, data: (await api.getWorkTime(appName)).data.data.result })));
        // this.workTimes = workTimes;
        const rlues = await api.getRules();
        const { data: dontKnownWhatItIs } = rlues.data;
        const rows = buildRows(dontKnownWhatItIs, appObj, this.datapaths, this.workTimes);


        this.rows = toReadableRows(rows);

        if (rs.length > 0) {
          this.protocols = rs[0].data.data.protocols;
        }
      } catch (e) {
        console.error('error', e);
      }
    },
    calcPage() {
      const oldPerPageCount = this.perPageCount;
      const rowHeight = 47;
      const bottomPadding = 20;
      const { tableContainer, tableHead } = this.$refs;
      const height = tableContainer.clientHeight - tableHead.clientHeight;
      const perPageCount = Math.max(Math.floor((height - bottomPadding) / rowHeight), 1);
      this.perPageCount = perPageCount;
      if (oldPerPageCount < perPageCount) {
        this.$nextTick(() => {
          this.currentPage = Math.max(Math.min(this.totalPage, this.currentPage), 1);
        });
      }
    },
  },
  computed: {
    filteredRows() {
      const { app } = this.search;
      return _.filter(this.rows, r => r.appName.indexOf(app) > -1 || r.nodeName.indexOf(app) > -1);
    },
    totalPage() {
      return Math.ceil(this.filteredRows.length / this.perPageCount);
    },
    visisbleRows() {
      const { filteredRows, currentPage, perPageCount } = this;
      return addCountToRows(filteredRows.slice((currentPage - 1) * perPageCount, currentPage * perPageCount));
    },
  },
  mounted() {
    const VisitAlert = this.session$.newpermissions.alert_detail;
    if (!VisitAlert) this.nav = ['manageapp', 'index', 'indexmore'];
    this.getData();
    this.calcPage();
    window.addEventListener('resize', this.calcPage);
  },
  destroyed() {
    window.removeEventListener('resize', this.calcPage);
  },
  watch: {
    visisbleRows(errorData) { // 判断错误的拓扑图信息
      this.visisbleRowsData = [];
      const nowData = [];
      errorData.forEach((item, index) => {
        if (item.protocol !== '') {
          nowData.push(item);
        }
      });
      this.visisbleRowsData = nowData;
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-group {
  padding-right: 37px;

  input[type="button"] {
    padding: 0 15px;
    margin: 6px 20px 6px 0;
    border-radius: 15px;
    border: 1px solid #3dd9c4 !important;
    color: #3dd9c4;
    height: 30px;
    display: inline-block;
    line-height: 28px;
    font-size: 16px;
    background: transparent;
    outline: none;

    &.current,
    &:hover {
      background: rgba(61, 217, 196, 0.8);
      color: #eee;
    }
  }
}

.main-content {
  padding: 0;
  .search {
    padding: 12px 0 22px 0;
    line-height: 40px;
    float: right;

    label {
      font-weight: normal;
      margin: 0;

      span {
        font-size: 16px;
        color: #c9e9e6;
        margin-right: 10px;
        height: 24px;
        line-height: 24px;
        margin-left: 20px;
      }

      input {
        color: white;
        appearance: none;
        border: 1px rgb(39,162,155) solid !important;
        height: 24px;
        line-height: 24px;
        background: #071119;
        padding: 0 5px;
      }
    }

    div {
      display: table-cell;

      button {
        cursor: pointer;
        padding: 0 15px;
        margin: 6px 20px 6px 0;
        border-radius: 15px;
        border: 1px solid #3dd9c4;
        color: #3dd9c4;
        height: 32px;
        display: inline-block;
        line-height: 28px;
        font-size: 16px;
        background: none;
        margin-left: 50px;
        vertical-align: middle;
      }
    }
  }

  .rule-list-content {
    position: absolute;
    width: 100%;
    height: auto;
    bottom: 20px;
    top: 60px;

    .table-container {
      position: absolute;
      width: 100%;
      height: auto;
      bottom: 40px;
      top: 0;
      overflow: auto;
      .table-container-disable{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 200;
      }

      table {
        min-width: 100%;
        width: 100%;
        border-collapse: separate;
        border-spacing: 0px;

        tbody{
          tr:nth-child(odd){
            background: #0b1b29;
          }
          tr:nth-child(even){
            background: #092535;
          }
        }

        tr.selected td {
          background: #1a5275;
        }

        td {
          color: #e6f4f2;
          font-size: 14px;
          text-align: center;
          height: 34px;
          max-height: 34px;
          &.no-data {
            height: 60px;
            font-size: 20px;
            font-weight: 300;
          }
        }

        thead {

          td {
            background: #11364b;
            min-width: 90px;

            &.last-col {
              min-width: 162px;
            }
          }

          .head-row-2 td {
            border-top: 0px #0b0e16 solid;
          }
        }
      }
    }

  }

  .page-container {
    width: 90%;
    position: absolute;
    bottom: -15px;
  }
}

td button {
  width: 18px;
  height: 18px;
  margin: 0 5px;
  border: 0;
  cursor: pointer;
  &.delete {
    background: url(../../../assets/ruleList/deleteRule.png) no-repeat;
  }

  &.copy {
    background: url(../../../assets/ruleList/copy.png) no-repeat;
    background-size: contain;
  }

  &.paste {
    background: url(../../../assets/ruleList/paste.png) no-repeat;
    background-size: contain;
  }
  
  &.edit {
    background: url(../../../assets/ruleList/topo-edit.svg) no-repeat;
  }

  &.overview {
    background: url(../../../assets/ruleList/icon-datapath-view.png) no-repeat;
    background-size: contain;
  }

  &.overview.disabled {
    background: url(../../../assets/ruleList/icon-datapath-view-disabled.png) no-repeat;
    background-size: contain;
    cursor: default;
  }
}

.scroll-area {
  width: 100%;
  height: 100%;
}

</style>
<style>

.table-container .ps--active-x > .ps__rail-x {
  height: 16px !important;
  border-radius: 7px;
}

.table-container .ps--active-x > .ps__rail-x .ps__thumb-x {
  height: 14px !important;
}

</style>
