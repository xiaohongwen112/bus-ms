<template>
  <div class="dimension-tab">
    <header class="header">
      <div>
        <BmsBtn type="add" @click="settingDimension('add', '')"><i class="add-icon"></i>新建维度</BmsBtn>
        <BmsBtn type="danger" :disabled="canAllDelete" @click="deleteDimensions">批量删除</BmsBtn>
      </div>
      <Search v-model="searchKey" :placeholder="'请输入要查询的维度'" @on-search="goTo(1)"></Search>
    </header>
    <StTable class="role-table" :cols="colsOfDimension" :rows="tableData"
    :selectList="selectList" :headSelect="headSelect"
    @select="handleSelect"
    >
    <template slot="operation" slot-scope="slotData">
      <span  class="operation">
        <a @click="showDetail(slotData.data)">详情</a>
        <a  class="operation-edit" @click="settingDimension('edit', slotData.data)" v-if="slotData.data.selectshow && slotData.data.hasOwnProperty('selectshow')">编辑</a>
        <span v-if="slotData.data.selectshow && slotData.data.hasOwnProperty('selectshow')">|</span>
        <a class="delete" @click="showDelTip(slotData.data)" v-if="slotData.data.selectshow && slotData.data.hasOwnProperty('selectshow')">删除</a>
      </span>
    </template>
    </StTable>
    <footer class="footer">
      共计 <span class="record-number">{{ total }}</span> 条记录
      <Pagination v-if="total !== 0" :total="totalSize" :current="currentPage" @to-page="goTo"/>
    </footer>
    <CmTip v-show="delTipFlag" :tipContent="tipContent" :closeFn="() => delTipFlag = false" :showFooter="showFooter" @on-confirm="deleteItem" ></CmTip>
    <Operation v-if="settingFlag" :title="settingTitle" :dataId="dataId" :config="config" :data="settingData" @onSave="saveChange" @onClose="settingFlag = false"></Operation>
    <Detail v-if="detailFlag" title="详情" :data="detailData" @onClose="detailFlag = false"></Detail>
  </div>
</template>

<script>
import _ from 'lodash';
import { BmsBtn, Search, StTable, Pagination, CmTip } from '@/components/basic/index';
import { colsOfDimension, formatDimensionTable } from '../utils';
import { getDimension, deleteDimension, getDimenConfig, getDimenDetail } from '../service';
import Operation from '../components/DimensionOperation';
import Detail from '../components/DimensionDetail';

export default {
  components: {
    BmsBtn,
    Search,
    StTable,
    Pagination,
    CmTip,
    Operation,
    Detail,
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
      colsOfDimension,
      detailFlag: false,
      settingFlag: false,
      settingTitle: '',
      delTipFlag: false,
      tipTitle: '提示',
      tipContent: '删除已选维度？',
      delList: '',
      showFooter: true,
      settingData: {},
      detailData: {},
      dataId: '',
      config: {},
    };
  },
  methods: {
    saveChange() {
      this.settingFlag = false;
      this.initTableData();
    },
    deleteDimensions() {
      this.delTipFlag = true;
      const arr = [];
      this.selectList.forEach((x) => {
        arr.push(this.tableData[x]._id);
      });
      this.delList = arr;
    },
    settingDimension(type, data) {
      this.settingTitle = type === 'add' ? '新建维度' : '编辑';
      this.dataId = JSON.stringify(data) !== '{}' ? data._id : '';
      getDimenConfig().then((res) => {
        const configData = res.data;
        if (configData.code === 0) {
          this.config = configData.data;
          if (type === 'edit') {
            getDimenDetail({ _id: this.dataId }).then((response) => {
              if (response.data.code === 0) {
                this.settingData = response.data.data;
                this.settingFlag = true;
              }
            }).catch();
          } else {
            this.settingData = {};
            this.settingFlag = true;
          }
        }
      }).catch();
    },
    showDetail(data) {
      getDimenDetail({ _id: data._id }).then((res) => {
        if (res.data.code === 0) {
          this.detailFlag = true;
          this.detailData = res.data.data;
        }
      }).catch();
    },
    showDelTip(data) {
      this.delTipFlag = true;
      this.delList = [data._id];
    },
    deleteItem() {
      deleteDimension({ _id: JSON.stringify(this.delList) }).then(() => {
        this.delTipFlag = false;
        // console.log(this.currentPage, this.currentPage > 1, this.delList.length, this.delList.length === this.tableData.length);
        // 最后一页全部删除
        if (this.currentPage > 1 && this.delList.length === this.tableData.length) {
          this.currentPage -= 1;
        }
        // console.log(this.currentPage);
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
      getDimension({
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
          this.tableData = formatDimensionTable(data.dimensions);
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
  .operation-edit{
    margin-left: 15px;
  }
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