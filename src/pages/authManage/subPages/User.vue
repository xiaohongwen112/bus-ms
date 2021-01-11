<template>
  <div class="user-manage">
    <div class="user-contain-disable" v-if="!session$.newpermissions.manage_user_edit"></div>
    <h1 v-show="false" v-text="`用户管理`"></h1>
    <header class="header">
      <div>
        <BmsBtn type="add" @click="openModal()"><i class="add-icon"></i>新建用户</BmsBtn>
        <BmsBtn type="danger" :disabled="canAllDelete"
        @click="handleSelectGroup">批量删除</BmsBtn>
      </div>
      <div>
        <label>所属角色</label>
        <CmSelect :list="roleList" :selectVal="selectRole" @on-change="changeRole"/>
        <label>所属域</label>
        <CmSelect :list="domainList" :selectVal="selectDomain" @on-change="changeDomain"/>
        <Search v-model="searchKey" :placeholder="'请输入要查询的用户名'" @on-search="onSearch"></Search>
      </div>
    </header>
    <StTable class="user-table" :cols="colsOfUser" :rows="tableData"
    :selectList="selectList" :headSelect="headSelect"
    @select="handleSelect"
    >
    <template slot="operation" slot-scope="slotData">
      <span  class="operation">
        <a @click="handleEditItem(slotData)"  v-if="slotData.data.editable || !slotData.data.hasOwnProperty('editable')">编辑</a>
        |
        <a class="delete" @click="handleDeleteItem(slotData)"  v-if="slotData.data.deleteable || !slotData.data.hasOwnProperty('deleteable')">删除</a>
      </span>
    </template>
    </StTable>
    <footer class="footer">
      共计 <span class="record-number">{{ total }}</span> 条记录
      <Pagination v-if="total !== 0" :total="totalSize" :current="currentPage" @to-page="goTo"/>
    </footer>
    <CmTip v-show="delTipFlag" :tipTitle="tipTitle" :tipContent="tipContent" :closeFn="() => delTipFlag = false" :showFooter="true"
      @on-confirm="deleteConfirm" ></CmTip>
    <ModalUser v-if="modalShow" :title="modalTittle" :data="modalData"
    @onClose="modalShow = false" @onSave="saveChange"/>
  </div>
</template>


<script>
import _ from 'lodash';
import { BmsBtn, CmSelect, Search, StTable, Pagination, CmTip } from '@/components/basic/index';
import ModalUser from '../components/ModalUser';
import { getDomainRole, getUserList, deleteUser } from '../service';
import { colsOfUser, formatUserTable, mapToId } from '../utils';


export default {
  name: 'User',
  components: {
    BmsBtn,
    CmSelect,
    Search,
    StTable,
    Pagination,
    CmTip,
    ModalUser,
  },
  data() {
    return {
      cols: [
        { type: 'select' },
        { key: 'name', name: '姓名' },
        { key: 'age', name: '年龄' },
        { type: 'operation', name: '操作' },
      ],
      tableData: [],
      selectList: [],
      // headSelect: true,
      totalSize: 0,
      total: 0,
      currentPage: 1,
      pagesize: 10,
      searchKey: '',
      colsOfUser,
      modalShow: false,
      modalTittle: '',
      delTipFlag: false,
      tipTitle: '提示',
      tipContent: '确认删除已选用户？',
      deleteList: [],
      modalData: {},
      domainRole: [],
      domainList: ['所有'],
      selectDomain: '所有',
      roleList: ['所有'],
      selectRole: '所有',
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
      this.openModal(slotData.data.id);
    },
    handleDeleteItem(slotData) {
      // 删除条目
      this.delete([slotData.index]);
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
      this.deleteList = list.map(i => this.tableData[i].id);
      // console.log('delete', this.deleteList);
      this.delTipFlag = true;
    },
    deleteConfirm() {
      // 调用删除接口
      deleteUser({
        users: JSON.stringify(this.deleteList),
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
      // consoel.log('---查找---');
      const [role, domain] = [mapToId(this.selectRole, this.domainRole.roles), mapToId(this.selectDomain, this.domainRole.domains)];
      this.tableData = [];
      this.selectList = [];
      getUserList({
        page: this.currentPage,
        size: this.pagesize,
        keywords: this.searchKey,
        role,
        domain,
      }).then((res) => {
        // console.log(res.data);
        const data = res.data.data;
        this.total = data.total;
        this.totalSize = Math.ceil(data.total / this.pagesize);
        this.tableData = formatUserTable(data.result);
      }).catch();
    },
    changeRole(newV) {
      // console.log(newV);
      this.selectRole = newV;
      this.initTableData();
    },
    changeDomain(newV) {
      // console.log(newV);
      this.selectDomain = newV;
      this.initTableData();
    },
    onSearch() {
      this.currentPage = 1;
      this.initTableData();
    },
    saveChange() {
      this.modalShow = false;
      this.initTableData();
    },
    goTo(pageNumber) {
      // console.log(pageNumber);
      this.currentPage = pageNumber;
      [this.selectDomain, this.selectRole] = ['所有', '所有'];
      this.initTableData();
    },
    openModal(id = null) {
      this.modalTittle = id ? '编辑' : '新建用户';
      this.modalData = {
        id,
      };
      this.modalShow = true;
    },
  },
  mounted() {
    getDomainRole().then((res) => {
      // console.log(res);
      const data = res.data.data;
      this.domainRole = data;
      this.domainList = ['所有', ...data.domains.map(d => d.name)];
      this.roleList = ['所有', ...data.roles.map(d => d.name)];
      this.initTableData();
    });
  },
};
</script>

<style lang="scss" scoped>
.user-contain-disable{
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
.user-table{
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


