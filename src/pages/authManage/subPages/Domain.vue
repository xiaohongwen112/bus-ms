<template>
  <div>
    <div class="domain-contain-disable" v-if="!session$.newpermissions.manage_domain_edit"></div>
    <h1 v-show="false" v-text="`域管理`"></h1>
    <header class="header">
      <div>
        <BmsBtn type="add" @click="handleModal()"><i class="add-icon"></i>新建域</BmsBtn>
        <BmsBtn type="danger" :disabled="canAllDelete"
        @click="handleSelectGroup">批量删除</BmsBtn>
      </div>
      <Search v-model="searchKey" :placeholder="'请输入要查询的域名'" @on-search="goTo(1)"></Search>
    </header>
    <StTable class="domain-table" :cols="colsOfDomain" :rows="tableData"
    :selectList="selectList" :headSelect="headSelect" :showHeadSelect="validIndexList.length > 0 "
    @select="handleSelect"
    >
    <template slot="operation" slot-scope="slotData">
      <span  class="operation">
        <a @click="handleEditItem(slotData)"  v-if="slotData.data.editable || !slotData.data.hasOwnProperty('editable')">编辑</a>
        |
        <a class="delete" @click="handleDeleteItem(slotData, slotData.data.selectable)" :class="{'delete-enable': !slotData.data.selectable}" v-if="slotData.data.deleteable || !slotData.data.hasOwnProperty('deleteable')">删除</a>
      </span>
    </template>
    </StTable>
    <footer class="footer">
      共计 <span class="record-number">{{ total }}</span> 条记录
      <Pagination v-if="total !== 0" :total="totalSize" :current="currentPage" @to-page="goTo"/>
    </footer>
    <CmTip v-show="delTipFlag" :tipTitle="tipTitle" :tipContent="tipContent" :closeFn="() => delTipFlag = false" :showFooter="true"
      @on-confirm="deleteConfirm" ></CmTip>
    <ModalDomain v-if="modalShow" :title="modalTittle" :data="modalData"
    @onClose="modalShow = false" @onSave="saveChange" />
  </div>
</template>

<script>
import _ from 'lodash';
import { BmsBtn, Search, StTable, Pagination, CmTip } from '@/components/basic/index';
import ModalDomain from '../components/ModalDomain';
import { retrieveDomain, deleteDomain } from '../service';
import { colsOfDomain, formatDomainTable } from '../utils';

export default {
  name: 'Domain',
  components: {
    BmsBtn,
    Search,
    StTable,
    Pagination,
    CmTip,
    ModalDomain,
  },
  data() {
    return {
      cols: [
        { type: 'select' },
        { key: 'name', name: '姓名' },
        { key: 'age', name: '年龄' },
        { type: 'operation', name: '操作' },
      ],
      tableData: [
        { name: '张茉莉', age: '24', selectable: false, editable: false, deleteable: false },
        { name: '赵四', age: '25', selectable: true, editable: true },
        { name: '张三', age: '24' },
        { name: '赵四', age: '25' },
        { name: '张三', age: '24' },
        { name: '赵四', age: '25' },
        { name: '张三', age: '24' },
        { name: '赵四', age: '25' },
      ],
      selectList: [],
      // headSelect: true,
      totalSize: 0,
      total: 0,
      currentPage: 1,
      pagesize: 10,
      searchKey: '',
      colsOfDomain,
      modalShow: false,
      modalTittle: '',
      delTipFlag: false,
      tipTitle: '提示',
      tipContent: '确认删除已选域？',
      deleteList: [],
      modalData: {},
    };
  },
  computed: {
    validIndexList() {
      const validIndexList = [];
      this.tableData.forEach((d, i) => {
        if (d.selectable || !_.has(d, 'selectable')) {
          validIndexList.push(i);
        }
      });
      return validIndexList;
    },
    headSelect() { return this.validIndexList.length > 0 && this.selectList.length === this.validIndexList.length; },
    canAllDelete() { return this.selectList.length === 0; },
  },
  methods: {
    handleEditItem(slotData) {
      // console.log(slotData.data._id);
      this.handleModal(slotData.data._id);
    },
    handleDeleteItem(slotData, deleteable = true) {
      // 删除条目
      if (deleteable) {
        this.delete([slotData.index]);
      }
    },
    handleSelectGroup() {
      // 删除组
      this.delete(this.selectList);
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
    delete(list) {
      this.deleteList = list.map(i => this.tableData[i]._id);
      // console.log('delete', this.deleteList);
      this.delTipFlag = true;
    },
    deleteConfirm() {
      // 调用删除接口
      deleteDomain({
        domain_id_list: JSON.stringify(this.deleteList),
      }).then((res) => {
        if (res.data.code === 0) {
          this.delTipFlag = false;
          // 最后一页全部删除
          if (this.currentPage !== 1 && this.deleteList.length === this.tableData.length) {
            this.currentPage -= 1;
          }
          this.initTableData();
        }
      }).catch();
    },
    initTableData() {
      this.tableData = [];
      this.selectList = [];
      retrieveDomain({
        page_size: this.pagesize,
        keyword: this.searchKey,
        page: this.currentPage,
      }).then((res) => {
        // console.log(res.data);
        const data = res.data.data;
        this.total = data.total;
        this.totalSize = Math.ceil(data.total / this.pagesize);
        // this.tableData = data.result;
        this.tableData = formatDomainTable(data.result);
      }).catch();
    },
    // onSearch() {
    //   this.initTableData();
    // },
    saveChange() {
      this.modalShow = false;
      this.initTableData();
    },
    goTo(pageNumber) {
      // console.log(pageNumber);
      this.currentPage = pageNumber;
      this.initTableData();
    },
    handleModal(id = null) {
      this.modalTittle = id ? '编辑域' : '新建域';
      this.modalData = {
        id,
      };
      this.modalShow = true;
    },
  },
  mounted() {
    this.initTableData();
  },
};
</script>

<style lang="scss">
.domain-contain-disable{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
}
.header{
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
.domain-table{
  // margin: 30px;
  position: absolute;
  top: 40px;
  bottom: 50px;
  width: 100%;
  // width: 1200px;
  // height: 200px;
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

