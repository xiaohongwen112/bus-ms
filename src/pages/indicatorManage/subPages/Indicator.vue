<template>
  <div class="indicator-tab">
    <header class="header">
      <div>
        <BmsBtn type="add" @click="settingIndicator('add', '')"><i class="add-icon"></i>新建指标</BmsBtn>
        <BmsBtn type="danger" :disabled="canAllDelete" @click="deleteIndicators">批量删除</BmsBtn>
      </div>
      <Search v-model="searchKey" :placeholder="'请输入要查询的指标'" @on-search="goTo(1)"></Search>
    </header>
    <StTable class="role-table" :cols="colsOfIndicator" :rows="tableData"
    :selectList="selectList" :headSelect="headSelect"
    @select="handleSelect"
    >
    <template slot="operation" slot-scope="slotData">
      <span  class="operation">
        <a @click="showDetail(slotData.data)">详情</a>
        <span v-if="slotData.data.selectshow && slotData.data.hasOwnProperty('selectshow') || slotData.data.name === '健康度'">|</span>
        <a  class="operation-edit" @click="settingIndicator('edit', slotData.data)" v-if="slotData.data.selectshow && slotData.data.hasOwnProperty('selectshow') || slotData.data.name === '健康度'">编辑</a>
        <span v-if="slotData.data.selectshow && slotData.data.hasOwnProperty('selectshow')">|</span>
        <a class="delete" @click="showDelTip(slotData.data)" v-if="slotData.data.selectshow && slotData.data.hasOwnProperty('selectshow')">删除</a>
      </span>
    </template>
    </StTable>
    <footer class="footer">
      共计 <span class="record-number">{{ total }}</span> 条记录
      <Pagination v-if="total !== 0" :total="totalSize" :current="currentPage" @to-page="goTo"/>
    </footer>
    <CmTip v-show="delTipFlag" :tipTitle="tipTitle" :tipContent="tipContent" :closeFn="() => delTipFlag = false" :showFooter="showFooter" @on-confirm="deleteItem" ></CmTip>
    <Operation ref="opration" v-if="settingFlag" :title="settingTitle" :data="settingData" :config="config" :num="settingNum" @editSingleLine="editSingle" @onSave="saveChange" @onClose="settingFlag = false"></Operation>
    <Health v-if="healthFlag" :title="healthTitle" :data="healthData" @onSave="saveHealth" @onClose="healthFlag = false" />
    <Detail v-if="detailFlag" title="详情" :data="detail" @onClose="detailFlag = false"></Detail>
    <DataDeal
      v-if="ruleThree"
      @showValueTherr="showValueTherr"
      @close="close"
      :dataT="dataThree"
      :dataIndex="dataDealIndex"
      :setType="setType"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import { BmsBtn, Search, StTable, Pagination, CmTip } from '@/components/basic/index';
import DataDeal from '@/components/indicatorManage/DataDeal';
import { mapState } from 'vuex';
import { colsOfIndicator, formatIndicatorTable } from '../utils';
import { getIndicator, getIndiConfig, deleteIndicator, getIndiDetail, getHealth, setHealth } from '../service';
import Operation from '../components/IndicatorOperation';
import Detail from '../components/IndicatorDetail';
import Health from '../components/HealthRelative';

export default {
  components: {
    BmsBtn,
    Search,
    StTable,
    Pagination,
    CmTip,
    Operation,
    Detail,
    DataDeal,
    Health,
  },
  computed: {
    validIndexList() {
      const validIndexList = [];
      this.tableData.forEach((d, i) => {
        if (d.selectshow || !_.has(d, 'selectshow')) {
          validIndexList.push(i);
        }
      });
      return validIndexList;
    },
    headSelect() { return this.validIndexList.length > 0 && this.selectList.length === this.validIndexList.length; },
    canAllDelete() { return this.selectList.length === 0; },
    ...mapState({
      normalize: state => state.protocolData.normalizes.normalize,
    }),
  },
  data() {
    return {
      tableData: [],
      selectList: [],
      total: 0,
      totalSize: 0,
      currentPage: 1,
      pagesize: 10,
      searchKey: '',
      colsOfIndicator,
      detailFlag: false,
      settingFlag: false,
      settingTitle: '',
      delTipFlag: false,
      tipTitle: '提示',
      tipContent: '',
      delList: '',
      showFooter: true,
      detail: {},
      settingNum: '',
      settingData: {},
      ruleThree: false,
      dataThree: {},
      dataDealIndex: 0,
      config: {},
      setType: '',
      healthFlag: false,
      healthTitle: '',
      healthData: {},
    };
  },
  methods: {
    saveHealth(data) {
      this.healthFlag = false;
      this.showFooter = false;
      setHealth(data.data).then((res) => {
        if (res.data.code === 0) {
          this.delTipFlag = true;
          data.type === '' ? this.tipContent = '保存成功' : this.tipContent = '健康度指标已恢复为默认值'; // eslint-disable-line
        }
      }).catch();
    },
    editSingle(e, type) {
      this.setType = type;
      this.dataDealIndex = e;
      this.$store.dispatch('editAllData', e);
      this.ruleThree = true;
      console.log(222, e, type);
      let norData = [];
      if (!(this.normalize instanceof Array)) {
        norData.push(this.normalize);
      } else norData = this.normalize;
      this.dataThree = _.cloneDeep(norData[e]);
    },
    showValueTherr() {
      this.ruleThree = false;
      this.$refs.opration.dealData(this.$store.state.protocolData.normalizes.normalize, this.dataDealIndex);
    },
    close() {
      this.ruleThree = false;
    },
    saveChange() {
      this.settingFlag = false;
    },
    deleteIndicators() {
      this.delTipFlag = true;
      this.showFooter = true;
      this.tipContent = '删除已选指标，该操作将同时删除引用该指标的其他指标。';
      const arr = [];
      this.selectList.forEach((x) => {
        arr.push(this.tableData[x]._id);
      });
      this.delList = arr;
    },
    settingIndicator(type, data) {
      if (data.name !== '健康度') {
        this.settingTitle = type === 'add' ? '新建指标' : '编辑';
        this.settingNum = JSON.stringify(data) !== '{}' ? data._id : '';
        getIndiConfig().then((res) => {
          const configData = res.data;
          if (configData.code === 0) {
            this.config = configData.data;
            if (type === 'edit') {
              getIndiDetail({ _id: data._id, status: 'edit' }).then((response) => {
                if (response.data.code === 0) {
                  this.settingData = response.data.data;
                  response.data.data.normalizes.normalize.forEach((e, index) => {
                    this.settingData.normalizes.normalize[index] = e[0];
                  });
                  this.settingFlag = true;
                }
              }).catch();
            } else {
              this.$store.dispatch('ititAllData');
              this.settingData = {};
              this.settingFlag = true;
            }
          }
        });
      } else {
        this.healthTitle = '编辑';
        this.getHealthDetail();
      }
    },
    getHealthDetail() {
      getHealth().then((res) => {
        if (res.data.code === 0) {
          this.healthData = res.data.data;
          this.healthFlag = true;
        }
      }).catch();
    },
    showDetail(data) {
      if (data.name !== '健康度') {
        getIndiDetail({ _id: data._id, status: 'protected' }).then((res) => {
          if (res.data.code === 0) {
            this.detailFlag = true;
            this.detail = res.data.data;
          }
        }).catch();
      } else {
        this.healthTitle = '详情';
        this.getHealthDetail();
      }
    },
    showDelTip(data) {
      this.delTipFlag = true;
      this.tipContent = '删除已选指标？该操作将同时删除引用该指标的其他指标。';
      this.delList = [data._id];
    },
    deleteItem() {
      this.delTipFlag = false;
      deleteIndicator({ _id: JSON.stringify(this.delList) }).then(() => {
        this.delTipFlag = false;
        // 最后一页全部删除
        if (this.currentPage !== 1 && this.delList.length === this.tableData.length) {
          this.currentPage -= 1;
        }
        this.initTableData();
      }).catch();
    },
    handleSelect(data) {
      const [index, checked] = [data.index, data.checked];
      if (index === -1 && !checked) {
        this.selectList = [];
      } else if (index === -1 && checked) {
        this.selectList = this.validIndexList;
      } else if (this.selectList.includes(index) && !checked) {
        this.selectList = _.filter(this.selectList, d => d !== index);
      } else if (!this.selectList.includes(index) && checked) {
        this.selectList.push(index);
      }
    },
    initTableData() {
      getIndicator({
        num: this.pagesize,
        query: this.searchKey,
        page: this.currentPage,
      }).then((res) => {
        this.tableData = [];
        this.selectList = [];
        if (res.data.code === 0) {
          const data = res.data.data;
          this.total = data.num;
          this.totalSize = Math.ceil(data.num / this.pagesize);
          this.tableData = formatIndicatorTable(data.indicators);
        }
      }).catch();
    },
    // onSearch() {
    //   this.currentPage = 1;
    //   this.initTableData();
    // },
    goTo(pageNumber) {
      this.currentPage = pageNumber;
      this.initTableData();
    },
  },
  created() {
    this.initTableData();
  },
};
</script>
<style lang="scss">
  .role-table{
    td.stable-tr:last-child, th.stable-th:last-child {
      text-align: left;
    }
    .stble-nodata{
      td.stable-tr{
        text-align: center;
      }
    }
  }
</style>
<style lang="scss" scoped>
.header{
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
.role-table{
  position: absolute;
  top: 40px;
  bottom: 50px;
  width: 100%;
}
.footer{
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  .record-number{
    color: #4ab2a5;
  }
}
</style>