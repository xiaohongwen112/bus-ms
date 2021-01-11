<template>
  <div>
    <NavBar :title="'rulelist'" />
    <Breadcrumb :title="'rulelist'" :crumbList="crumbList">
      <div slot="btnGroup" class="btn-group">
        <input type="button" class="current" value="规则列表" />
        <input type="button" value="规则模板" @click="$router.push('template')" />
      </div>
    </Breadcrumb>
    <div class="main-content">
      <div class="search">
        <label>
          <span>业务名称</span>
          <input @input="setSearchApp">
        </label>
        <label>
          <span>节点名称</span>
          <input @input="setSearchNode">
        </label>
        <div>
          <button>搜索</button>
        </div>
      </div>
      <div class="rule-list-content">
        <div class="table-container" ref="tableContainer">
          <ScrollBar class="scroll-area" :options="{useBothWheelAxes: true}">
            <table>
              <thead ref="tableHead">
                <tr class="head-row-1">
                  <td rowspan="2">序号</td>
                  <td rowspan="2">业务名称</td>
                  <td rowspan="2">节点名称</td>
                  <td rowspan="2">健康度</td>
                  <td colspan="3">基线告警</td>
                  <td colspan="5">阈值告警</td>
                  <td rowspan="2">返回码</td>
                  <td colspan="2" rowspan="2">操作</td>
                </tr>
                <tr class="head-row-2">
                  <td>成功率</td>
                  <td>响应时间</td>
                  <td>交易量</td>
                  <td>交易量</td>
                  <td>无交易请求</td>
                  <td>成功率</td>
                  <td>响应时间</td>
                  <td>响应率</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-if="filteredRows.length === 0"
                >
                  <td class="no-data" colspan="14">暂无数据</td>
                </tr>
                <tr
                  v-for="(r, k) in visisbleRows"
                  :key="k"
                  :class="{selected: selectedRow === k }"
                  @click="onEdit(r, k)"
                >
                  <td>{{ k+1 }}</td>
                  <td>{{ r.appName }}</td>
                  <td>{{ r.nodeName }}</td>
                  <td>{{ r.healthTxt }}</td>
                  <td>{{ r.baselineTxt.succ }}</td>
                  <td>{{ r.baselineTxt.duration }}</td>
                  <td>{{ r.baselineTxt.trans }}</td>
                  <td>{{ r.thresholdTxt.trans }}</td>
                  <td>{{ r.thresholdTxt.noReq }}</td>
                  <td>{{ r.thresholdTxt.succ }}</td>
                  <td>{{ r.thresholdTxt.duration }}</td>
                  <td>{{ r.thresholdTxt.rr }}</td>
                  <td style="max-width: 80px; text-overflow: ellipsis; overflow: hidden;">{{ r.returnCodeTxt }}</td>
                  <td>
                    <button @click.stop="deleteRule(r, k)" class="delete" title="删除规则"></button>
                  </td>
                  <td v-if="r.count > 0" :rowspan="r.count">
                    <button @click.stop="toTopoEdit(r, k)" class="edit" title="可视化服务图设计"></button>
                    <button @click.stop="toTopoOverview(r, k)" class="overview" title="可视化服务图"></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </ScrollBar>
        </div>
      </div>
      <div class="page-container">
        <Pagination
          :total="totalPage"
          :current="currentPage"
          @to-page="toPage"
        />
      </div>
      <RuleConfigModal
        v-if="showEdit"
        @close="closeModal"
        @save="saveEdting"
        :rule="currentNode.rule"
        :nodeInfo="currentNode"
      />
      <CmTip
        v-if="showTip"
        :tipContent="tipContent"
        :autoClose="true"
        :closeFn="() => {showTip = false}"
      />
    </div>
  </div>
</template>
<script>

/* eslint-disable no-param-reassign */

import _ from 'lodash';
import NavBar from '@/components/common/NavBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import RuleConfigModal from '@/components/ruleList/RuleConfigModal';
import ScrollBar from '@/components/common/ScrollBar';
import CmTip from '@/components/common/CmTip';
import Pagination from '@/components/common/Pagination';
import { ruleInstance } from '../utils';

import * as api from '../service/';

const buildRows = (someData, appObj) => {
  const result = [];
  // 处理嵌套的十分恶心的不知道干什么用的数据
  _.forEach(someData, (data) => {
    _.forOwn(data, (v, name) => {
      _.forEach(v, (l) => {
        if (l.alarmrules && l.alarmrules.threshold) {
          const row = {
            app: name,
            appName: appObj[name].disp_name,
            node: l.level,
            nodeName: (_.find(appObj[name].levels, n => n.name === l.level) || {}).disp_name,
            rule: l.alarmrules,
          };
          result.push(row);
        }
      });
    });
  });
  return result;
};

const toReadableRows = rows => rows.map((row) => {
  const { app, appName, node, nodeName, rule } = row;
  const { health, baseline: b, return_code: r, threshold: t } = rule;
  return {
    app,
    appName,
    node,
    nodeName,
    rule,
    healthTxt: health.on ? (`${health.duration ? (`响应时间正常值:${health.duration}ms, `) : ''}健康度低于:${health.health_set}%, ${health.ts_hold}分钟`) : '未设置',
    baselineTxt: {
      succ: b.succ_rate.on ? (`超出:${b.succ_rate.up}%, 低于:${b.succ_rate.down}%, ${b.succ_rate.time}分钟`) : '未设置',
      duration: b.duration.on ? (`超出:${b.duration.up}ms, 低于:${b.duration.down}ms, ${b.duration.time}分钟`) : '未设置',
      trans: b.trans_count.on ? (`超出:${b.trans_count.up}, 低于:${b.trans_count.down}, ${b.trans_count.time}分钟`) : '未设置',
    },
    returnCodeTxt: r.on ? r.val : '未设置',
    thresholdTxt: {
      noReq: t.no_req.on ? `${t.no_req.time}分钟` : '未设置',
      succ: t.succ_rate.on ? (`低于:${t.succ_rate.down.value}%, ${t.succ_rate.down.time}分钟`) : '未设置',
      duration: t.duration.on ? (`超出:${t.duration.up.value}ms, ${t.duration.up.time}分钟`) : '未设置',
      trans: t.trans_count.on ? (`低于:${t.trans_count.down.value}%, ${t.trans_count.down.time}分钟`) : '未设置',
      rr: t.rr_rate.on ? (`低于:${t.rr_rate.down.value}%, ${t.rr_rate.down.time}分钟`) : '未设置',
    },
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
  components: {
    NavBar,
    Breadcrumb,
    RuleConfigModal,
    ScrollBar,
    CmTip,
    Pagination,
  },
  data() {
    return {
      crumbList: ['index', 'manageapp', 'rulelist'],
      appObj: {},
      datapaths: [],
      rows: [],
      selectedRow: -1,
      search: {
        app: '',
        node: '',
      },
      showEdit: false,
      currentNode: {},
      showTip: false,
      tipContent: '',
      perPageCount: 1,
      currentPage: 1,
    };
  },
  methods: {
    toPage(page) {
      this.currentPage = page;
    },
    saveEdting(r, nodeInfo, delOp) {
      if (process.env.NODE_ENV === 'development') console.log(r, nodeInfo);
      const datapath = _.clone(_.find(this.datapaths, p => p.name === nodeInfo.app));
      const i = _.findIndex(datapath.trade, t => t.settings.name === nodeInfo.node);
      if (i > -1) datapath.trade[i].alarmrules = r;
      else throw new Error('index Error');
      api.saveDataPath(nodeInfo.app, datapath).then(() => {
        this.tipContent = delOp ? '删除成功' : '保存成功';
        this.showTip = true;
        this.getData();
      });
    },
    closeModal() {
      this.selectedRow = -1;
      this.showEdit = false;
    },
    setSearchApp(ev) {
      this.currentPage = 1;
      this.search.app = ev.target.value.replace(/(^\s*)|(\s*$)/g, '');
    },
    setSearchNode(ev) {
      this.currentPage = 1;
      this.search.node = ev.target.value.replace(/(^\s*)|(\s*$)/g, '');
    },
    onEdit(row, k) {
      this.selectedRow = k;
      this.showEdit = true;
      this.currentNode = row;
    },
    getDataPath(appName) {
      return api.getDataPath(appName);
    },
    deleteRule(row) {
      const blankRule = ruleInstance();
      this.saveEdting(blankRule, row, true);
    },
    toTopoEdit(row) {
      window.open(`/zh-cn/${row.app}/datapath/edit/`);
    },
    toTopoOverview(row) {
      if (this.datapaths.some(d => d.name === row.app && d.state === 'apply')) {
        window.open(`/zh-cn/overview/${row.app}/`);
      }
    },
    async getData() {
      try {
        const res = await api.getAllApps();

        const appObj = _.reduce(res.data, (p, app) => {
          const { name, disp_name, areas } = app;
          const levels = areas.length < 1 ? [] : areas[0].levels.map(l => ({ name: l.name, disp_name: l.disp_name }));
          p[name] = { disp_name, levels };
          return p;
        }, {});

        this.appObj = appObj;

        const rs = await Promise.all(Object.keys(appObj)
          .map(k => this.getDataPath(k)));
        this.datapaths = rs.map(r => r.data.datapath);

        const { data: dontKnownWhatItIs } = await api.getRules();
        const rows = buildRows(dontKnownWhatItIs, appObj);

        console.log(rows);
        this.rows = toReadableRows(rows);
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
      const { app, node } = this.search;
      return _.filter(this.rows, r => r.appName.indexOf(app) > -1 && r.nodeName.indexOf(node) > -1);
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
    this.getData();
    this.calcPage();
    window.addEventListener('resize', this.calcPage);
  },
  destroyed() {
    window.removeEventListener('resize', this.calcPage);
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
  padding: 0 5%;

  .search {
    padding: 25px 0 30px 0;
    line-height: 40px;
    display: flex;
    align-items: center;

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
    width: 95%;
    height: auto;
    bottom: 20px;
    top: 170px;

    .table-container {
      position: absolute;
      width: 95%;
      height: auto;
      bottom: 40px;
      top: 0;
      overflow: auto;

      table {
        min-width: 2200px;
        width: 100%;
        border-collapse: separate;
        border-spacing: 2px;

        tr.selected td {
          background: #1c4365;
        }

        td {
          border-right: 0px #0b0e16 solid;
          background: #0f1925;
          color: #e6f4f2;
          font-size: 14px;
          text-align: center;
          height: 43px;
          max-height: 43px;

          &.no-data {
            height: 60px;
            font-size: 20px;
            font-weight: 300;
          }
        }

        thead {

          td {
            background: #061e33;
            min-width: 90px;
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

  &.delete {
    background: url(../../../assets/ruleList/deleteRule.png) no-repeat;
  }
  
  &.edit {
    background: url(../../../assets/ruleList/topo-edit.svg) no-repeat;
  }

  &.overview {
    background: url(../../../assets/ruleList/overview.svg) no-repeat;
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
