<template>
  <div class="main">
    <h6 class="title">多维统计</h6>
    <div class="top-div">
      <BizCard class="card-div" v-for="(item, index) in cardList"
        :key="index"
        :valid="index < filters.length || ( index === filters.length && activeRow !== null)"
        :index="index"
        :data="item"
        @click="enterPrev(index)"></BizCard>
    </div>
    <div class="content-div">
      <div class="nav-table-wrap">
        <div class="nav-table-left">
          <div class="dimension-name nav-table-item">
            <span>第{{ filters.length + 1 }}维度</span>
          </div>
          <div class="comp-name nav-table-item">
            <span>组件 : {{ dimensionName }}</span>
          </div>
          <div class="stat-select-div">
            <select class="cb-select multi-select"
                v-model="checkedOption" @change="submitSearch">
              <option v-for="(option, index) in optionList"
                :key="`multi-type-${index}`"
                :value="`${ option.key }`"
                v-show="option.show">
                {{ option.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="nav-table-right">
          <Pagesize class="page-size-div nav-table-item"
            :options="[10, 20, 50, 100, 0]"
            v-model="currentPagesize" @change="submitSearch"/>
          <CmBtn :disabled="!session$.newpermissions.trade_statistics_export || rows.length === 0" @click="exportCSV">导出CSV</CmBtn>
        </div>
      </div>
      <StTable class="search-tb multi-table" :cols="cols1" :rows="rows"
      :activeSort="activeSort"  :activeRow="activeRow"
      @sort="sortTable" @click-td="clickTable"
      ></StTable>
    </div>
    <AssoLi class="asso-div"
      :isShow="assoFlag"
      :heightNum="heightNum"
      :top="assoTop"
      :left="assoLeft"
      :options="assoOptionList"
      @handleClose="closeAsso"
      @click="selectAsso" @route-to="routeToTrack"></AssoLi>
  </div>
</template>

<script>
import _ from 'lodash';
import CmBtn from '@/components/common/CmBtn';
import BizCard from '@/components/stat/BizCard';
import AssoLi from '@/components/stat/AssoLi';
import StTable from '@/components/stat/StTable';
import { mapState, mapActions } from 'vuex';
import ScrollBar from '@/components/common/ScrollBar';
import Pagesize from '@/components/common/Pagesize';
import { getPanel, getAllDims, getMulti, exportMulti } from '../service';
// import { GET_ALLDIMS } from '../store';
import { formatMultiuTable } from '../utils';

export default {
  name: 'BizMulti',
  components: {
    BizCard,
    AssoLi,
    StTable,
    ScrollBar,
    CmBtn,
    Pagesize,
  },
  data() {
    return {
      dimensionName: '',
      ts: {},
      optionList: [],
      checkedOption: null,
      currentPagesize: 10,
      heightNum: 0,
      assoTop: 0,
      assoLeft: 0,
      assoFlag: false,
      cols1: [],
      rows: [],
      activeRow: null,
      activeSort: {
        key: 'trans_count',
        direction: 'down',
      },
      filters: [],
      cardList: [],
    };
  },
  computed: {
    ...mapState({
      appId: state => state.appId,
      intfId: state => state.intfId,
      cacheTime: state => state.cacheTime,
      tradeIndex: state => state.tradeIndex,
      currentDs: state => state.multi.currentDs,
      historyTb: state => state.multi.historyTb,
      activeId: state => state.multi.activeId,
      order: state => state.multi.order,
      // cardList: state => state.multi.cardList,
    }),
    assoOptionList() {
      const newOptions = _.cloneDeep(this.optionList);
      _.remove(newOptions, d => d.key === this.checkedOption);
      // console.log(newOptions);
      return newOptions;
    },
  },
  methods: {
    ...mapActions([
      'increment',
    ]),
    concatPostData() { // order_key+order_direction
      let filtersStr = '';
      this.filters.forEach((d, i) => {
        if (i > 0) {
          filtersStr += '&';
        }
        filtersStr += `${d.data.checkedOption}=${d.data.checkedValue === '--' ? null : d.data.checkedValue}`;
      });
      return Object.assign({}, this.ts, {
        filters: filtersStr,
        site: '',
        page_size: this.currentPagesize,
        selected_dim: this.checkedOption,
        groupby: this.checkedOption,
        order_key: this.activeSort.key,
        order_direction: this.activeSort.direction,
      });
    },
    getIcon(index) {
      let iconName = 'icon-bms-up';
      if (this.order.key === this.tradeIndex[index - 2].code) {
        iconName = this.order.direction === 'down' ? 'icon-bms-downfill' : 'icon-bms-upfill';
      }
      return iconName;
    },
    formatNum(val) {
      let newVal;
      if (val >= 0) {
        newVal = Number(val).toFixed(2) * 100 / 100;
      } else {
        newVal = '--';
      }
      return newVal;
    },
    enterPrev(index) {
      // 取消, 回退到当前维度， 并更新表格 回显选中项
      // console.log(index);
      if (_.has(this.filters[index], 'data')) {
        const data = this.filters[index].data;
        Object.assign(this, data);
        _.remove(this.filters, (n, i) => i >= index);
      }
    },
    clickOrder(index) {
      const curentKey = this.tradeIndex[index - 2].code;
      let flag = 'down';
      if (this.order.key === curentKey) {
        flag = this.order.direction === 'down' ? 'up' : 'down';
      }
      this.$store.state.multi.order = {
        key: curentKey,
        direction: flag,
      };
      // this.$store.dispatch('getMulti');
    },
    selectAsso(data) {
      // 钻取前, 保存当前表格数据
      const lastSelect = this.optionList.filter(d => d.key === this.checkedOption);
      const lastValue = this.cardList[this.filters.length]._id;
      // console.log(lastSelect);
      const newFilter = Object.assign({}, data, {
        data: {
          activeRow: this.activeRow,
          activeSort: this.activeSort,
          optionList: _.cloneDeep(this.optionList),
          checkedOption: lastSelect[0].key,
          checkedValue: lastValue,
          cols1: this.cols1,
          rows: this.rows,
        },
      });
      this.filters.push(newFilter);
      this.assoFlag = false;
      this.activeRow = null;
      this.rows = [];
      this.checkedOption = data.key;
      this.submitSearch();
      _.remove(this.optionList, n => n.key === newFilter.data.checkedOption);
    },
    closeAsso() {
      this.assoFlag = false;
    },
    getPosOfTd(index) {
      // console.log(this.$refs.multiTable.$el);
      const el = document.querySelector('.multi-table').querySelector('.stable-tbody').querySelector(`tr:nth-child(${index + 1})`).querySelector('td:nth-child(2)');
      const clientRect = el.getBoundingClientRect();
      // console.log(el, index, clientRect);
      this.assoTop = clientRect.y - clientRect.height / 2 - 35 * this.assoOptionList.length - 40;
      this.assoLeft = clientRect.x + clientRect.width;
    },
    clickTb(index, obj) {
      this.heightNum = index;
      this.getPosOfTd(index);
      this.assoFlag = true;
      this.cardList[this.filters.length] = Object.assign({}, obj, { text: `${obj.titleName}:${obj._id}` });
    },
    exportCSV() {
      location.href = exportMulti(this.appId, this.intfId, this.concatPostData());
      console.log('export', this.concatPostData());
    },
    initForRoute() {
      const params = this.$route.params;
      if (JSON.stringify() !== '{}' && _.has(params, 'key')) {
        const tmpIndex = _.findIndex(this.rows, d => d._id === params.label);
        // console.log(tmpIndex);
        this.activeRow = tmpIndex;
        this.cardList[0] = this.rows[tmpIndex];
        this.cardList[0].text = `${params.name}:${params.label}`;
      }
    },
    submitSearch() {
      getMulti(this.appId, this.intfId, this.concatPostData()).then((res) => {
        const data = res.data;
        [this.cols1, this.rows] = formatMultiuTable(data, this.optionList, this.checkedOption);
        if (this.filters.length === 0 && this.activeRow === null) {
          this.initForRoute();
        }
      });
    },
    sortTable(evt) {
      this.activeRow = null;
      // reset(this.cols1, 'sort', true);
      // set(this.cols1, evt.key, 'sort', evt.direction);
      this.activeSort = evt;
      this.submitSearch();
    },
    clickTable(data) {
      if (data.key === '_id') {
        this.activeRow = data.index;
        const param = Object.assign({}, data.data, {
          title: data.key,
          titleName: data.name,
        });
        this.clickTb(data.index, param);
      }
    },
    routeToTrack() {
      // 跳至业务追踪, 带参
      const key = this.checkedOption;
      let value = this.rows[this.activeRow]._id;
      value = value === '--' ? 'null' : value;
      const params = {};
      params[key] = value;
      localStorage.setItem('params', JSON.stringify(params));
      location.href = `/zh-cn/stat/${this.appId}/cap/${this.intfId}/#/BizTrack`;
    },
  },
  mounted() {
    this.cardList = Array.from({ length: 5 }, () => ({
      text: '----',
      duration: '--',
      req_count: null,
      resp_count: null,
      rr_rate: '--',
      succ_count: null,
      succ_rate: '--',
      trans_count: '--',
    }));
    getAllDims(this.appId, this.intfId).then((res) => {
      const data = res.data;
      // 选项
      this.dimensionName = data.comp_name;
      this.optionList = [];
      if (data.all_dims.length > 0) {
        data.all_dims.forEach((d) => {
          this.optionList.push({
            key: d.name,
            name: d.show_name,
            show: true,
          });
        });
      }
      this.checkedOption = this.optionList[0].key;
      // 内部跳转
      const params = this.$route.params;
      if (JSON.stringify() !== '{}' && _.has(params, 'key')) {
        console.info('统计中心跳入', params);
        this.checkedOption = params.key;
      }
      // commit
      this.$store.commit('GET_ALLDIMS', data);
      getPanel(this.appId, this.intfId, 'biz_overview_snapshot').then((panelRes) => {
        const paneldata = panelRes.data.data;
        this.ts = {
          ts_start: paneldata.earliest,
          ts_end: paneldata.latest,
        };
        if (this.cacheTime.length > 0) {
          this.ts = {
            ts_start: this.cacheTime[0],
            ts_end: this.cacheTime[1],
          };
        }
        // 请求
        this.submitSearch();
      });
    });
  },
};
</script>

<style lang="scss">
.cb-select{
  width: 150px;
}
.multi-table{
  position: absolute;
  left: 30px;
  right: 30px;
  width: calc(100% - 60px);
  top: 310px;
  bottom: 10px;
  height: auto;
  .stable-tr:nth-child(2) {
    cursor: pointer;
    &:hover{
      background-color: #1b3946 ;
    }
  }
}
</style>


<style lang="scss" scoped>

.main{
  width: 100%;
  height: 100%;
  .title{
    display: none;
  }
}
.top-div{
  height: 234px;
  border-bottom: solid 1px #071b2d;
}
.content-div{
  margin: 5px 0;
  padding: 0 30px;
  height: calc(100% - 244PX);  //234+10
}
.card-div{
  margin-top: 35px;
  width: 20%;
}

.nav-table-wrap{
  height: 68px;
  line-height: 68px;
  font-size: 16px;
  text-align: left;
  div{
    display: inline-block;
  }
  .nav-table-left{
    width: calc(100% - 300px);
  }
  .nav-table-item{
    padding-right: 10px;
  }
}

/*表格*/
.tb-div{
  width: 100%;
  height: calc(100% - 68px);
  color: #BEE2EB;
  font-size: 16px;
  text-align: left;
  span{
    display: inline-block;
    border: solid 1px rgba(14,47,51,0.4);
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
  }
  i{
    cursor: pointer;
  }
  span:first-child{
    width: 80px;
  }
  span:nth-child(n+2){
    width: calc(20% - 43px); // 16
  }

  .activeTr{
    background: #1b3946;
  }
}
.tb-head{
  background: #0a212c;
}
.tb-body{
  background: #010c11;
  span{
    margin-right: -4.7px;
  }
  span:nth-child(2){
    cursor: pointer;
    &:hover{
      background: #1b3946;
     }
  }
}

.no-data{
  height: 64px;
  line-height: 64px;
  text-align: center;
  border: solid 1px #0a212c;
}

.asso-div{
  z-index: 3;
}

// .search-tb{
//   position: absolute;
//   left: 15px;
//   width: calc(100% - 20px);
//   top: 306px;
//   bottom: 10px;
//   // bottom: 90px;
//   height: auto;
// }

</style>
