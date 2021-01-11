<template>
  <div class="role-manage">
    <div class="role-contain-disable" v-if="!session$.newpermissions.manage_role_edit"></div>
    <header class="header">
      <div>
        <BmsBtn type="add" @click="settingRole('add', '')"><i class="add-icon"></i>新建角色</BmsBtn>
        <BmsBtn type="danger" :disabled="canAllDelete" @click="deleteRoles">批量删除</BmsBtn>
      </div>
      <Search v-model="searchKey" :placeholder="'请输入要查询的角色名称'" @on-search="goTo(1)"></Search>
    </header>
    <StTable class="role-table" :cols="colsOfRole" :rows="tableData"
    :selectList="selectList" :headSelect="headSelect"
    @select="handleSelect"
    >
    <template slot="operation" slot-scope="slotData">
      <span  class="operation">
        <a @click="showDetail(slotData)">详情</a>
        <a  class="operation-edit" @click="settingRole('edit', slotData)" v-if="slotData.data.editable || !slotData.data.hasOwnProperty('editable')">编辑</a>
        <span v-if="slotData.data.deleteable || !slotData.data.hasOwnProperty('deleteable')">|</span>
        <a class="delete" :class="{'enable-delete': !slotData.data.selectshow || slotData.data.selectable}" @click="!slotData.data.selectshow || slotData.data.selectable ? showDelTip(slotData) : ''" v-if="slotData.data.deleteable || !slotData.data.hasOwnProperty('deleteable')">删除</a>
      </span>
    </template>
    </StTable>
    <footer class="footer">
      共计 <span class="record-number">{{ total }}</span> 条记录
      <Pagination v-if="total !== 0" :total="totalSize" :current="currentPage" @to-page="goTo"/>
    </footer>
    <CmTip v-show="delTipFlag" :tipTitle="tipTitle" :tipContent="tipContent" :closeFn="() => delTipFlag = false" :showFooter="showFooter" @on-confirm="deleteItem" ></CmTip>
    <Setting v-if="settingFlag" :title="settingTitle" :data="settingData" :num="settingNum" @onSave="saveChange" @onClose="settingFlag = false"></Setting>
    <AuthDetail v-if="detailFlag" :data="detail" @onClose="detailFlag = false"></AuthDetail>
  </div>
</template>

<script>
import _ from 'lodash';
import { BmsBtn, Search, StTable, Pagination, CmTip } from '@/components/basic/index';
import { colsOfRole, formatRoleTable } from '../utils';
import { getRoleList, deleteRole, getPerssion } from '../service';
import Setting from '../components/Setting';
import AuthDetail from '../components/AuthDetail';

export default {
  components: {
    BmsBtn,
    Search,
    StTable,
    Pagination,
    CmTip,
    Setting,
    AuthDetail,
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
  data() {
    return {
      cols: [
        { type: 'select' },
        { key: 'name', name: '角色名称' },
        { key: 'type', name: '角色分类' },
        { key: 'update_user', name: '修改人' },
        { key: 'update_time', name: '更新时间' },
        { key: 'desc', name: '描述' },
        { type: 'operation', name: '操作' },
      ],
      tableData: [
        // { name: '张茉莉', type: '系统默认', update_user: 'admin', update_time: 1552017615, desc: '超级管理员', selectable: false, editable: false, deleteable: false },
        // { name: '赵四', type: '自定义', update_user: 'admin', update_time: 1552017615, desc: '超级管理员' },
      ],
      selectList: [],
      total: 0,
      totalSize: 0,
      currentPage: 1,
      pagesize: 10,
      searchKey: '',
      colsOfRole,
      detailFlag: false,
      settingFlag: false,
      settingTitle: '',
      delTipFlag: false,
      tipTitle: '提示',
      tipContent: '确认删除已选角色？',
      deleteList: '',
      showFooter: true,
      detail: {},
      settingNum: '',
      settingData: {},
    };
  },
  methods: {
    saveChange() {
      this.settingFlag = false;
      this.initTableData();
    },
    deleteRoles() {
      this.delTipFlag = true;
      const arr = [];
      this.selectList.forEach((x) => {
        arr.push(this.tableData[x].num);
      });
      this.deleteList = arr;
    },
    settingRole(type, data) {
      this.settingTitle = type === 'add' ? '新建角色' : '编辑';
      this.settingNum = data !== '' ? data.data.num : '';
      getPerssion({ num: this.settingNum }).then((res) => {
        if (res.data.code === 0) {
          this.settingData = res.data.data;
          this.settingFlag = true;
        }
      }).catch();
    },
    showDetail(data) {
      this.detailFlag = true;
      this.detail = data.data.detail;
    },
    showDelTip(slotData) {
      this.delTipFlag = true;
      this.deleteList = [slotData.data.num];
    },
    deleteItem() {
      deleteRole({ roles: JSON.stringify(this.deleteList) }).then(() => {
        this.delTipFlag = false;
        // 最后一页全部删除
        if (this.currentPage !== 1 && this.deleteList.length === this.tableData.length) {
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
      this.tableData = [];
      this.selectList = [];
      getRoleList({
        size: this.pagesize,
        query: this.searchKey,
        page: this.currentPage,
      }).then((res) => {
        const data = res.data.data;
        this.total = data.count;
        this.totalSize = Math.ceil(data.count / this.pagesize);
        this.tableData = formatRoleTable(data.roles);
      }).catch();
    },
    // onSearch() {
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
  .role-contain-disable{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
  }
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
  .operation{
    .delete{
      color: rgb(84, 84, 84);
      cursor: default;
    }
    .enable-delete{
      color: #d04631;
      cursor: pointer;
    }
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