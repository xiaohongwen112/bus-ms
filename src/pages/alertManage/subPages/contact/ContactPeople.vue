<template>
  <div id="contact-people">
    <Cmtip v-if="showTips" :closeFn="() => showTips = false"
      :tipContent="tipContent" :showFooter="showFooter"
      @on-confirm="deleteBaseLine">
    </Cmtip>
    <AddToGroup v-if="showAddToGroup" @close="showAddToGroup = false" @save="saveToGroup" :peopleIdList="peopleIdList"></AddToGroup>
    <EditPeople v-if="showEditPeople" :propData="peopleData" :operation="peopleEditActive" @close="showEditPeople = false" @save="editSave"></EditPeople>
    <div class="people-header">
      <div class="btn-list">
        <button class="btn-1" @click="addPeople"><i class="add-icon"></i>新建联系人</button>
        <button class="btn-1" @click="addToGroup" :style="selectNotNull ? '' : 'background-color:#7f8786;color:#d9e2e1;cursor: default;'" :disabled="!selectNotNull">添加到联系组</button>
        <button class="btn-2" @click="delMorePeople" :style="selectNotNull ? '' : 'background-color:#7f8786;color:#d9e2e1;cursor: default;'" :disabled="!selectNotNull">批量删除</button>
        <button class="btn-1" @click="changePSwitch(true)" :style="selectNotNull ? '' : 'background-color:#7f8786;color:#d9e2e1;cursor: default;'" :disabled="!selectNotNull">启用</button>
        <button class="btn-2" @click="changePSwitch(false)" :style="selectNotNull ? '' : 'background-color:#7f8786;color:#d9e2e1;cursor: default;'" :disabled="!selectNotNull">禁用</button>
      </div>
      <div class="search">
        <CmSelect :list="selectLists[0]" :selectVal="selectVal[0]" :width="100" type="popsUp" @on-change="(val) => { selectVal[0] = val; onSearch(); }"></CmSelect>
        <CmSelect :list="selectLists[1]" :selectVal="selectVal[1]" :width="100" type="popsUp" @on-change="(val) => { selectVal[1] = val; onSearch(); }"></CmSelect>
        <CmSelect :list="selectLists[2]" :selectVal="selectVal[2]" :width="100" type="popsUp" @on-change="(val) => { selectVal[2] = val }"></CmSelect>
        <div class="search-input">
          <Search v-model="searchKey" :placeholder="'请输入要查询的关键词'" @on-search="onSearch"></Search>
        </div>
      </div>
    </div>
    <!-- <div class="people-table"> -->
      <StTable class="sttable" :cols="colsOfRole" :rows="tableData"
      :selectList="selectList" :headSelect="headSelect"
      @select="handleSelect"
      >
        <template slot="operation" slot-scope="slotData">
          <span  class="operation">
            <a @click="showDetail(slotData)">详情</a>
            <span> |</span>
            <a  class="operation-edit" @click="editPeople(slotData)" v-if="slotData.data.editable || !slotData.data.hasOwnProperty('editable')">编辑</a>
            <span>|</span>
            <a @click="slotData.data.deleteable || !slotData.data.hasOwnProperty('deleteable') ? delOnePeople(slotData): null" 
            :class="{'delete': true, 'enable-delete': !slotData.data.selectshow || slotData.data.selectable}" 
            :style="slotData.data.deleteable || !slotData.data.hasOwnProperty('deleteable') ? '':'color:gray;'">删除</a>
          </span>
        </template>
      </StTable>
    <!-- </div> -->
    <footer class="footer">
      共计 <span class="record-number">{{ total }}</span> 条记录
      <Pagination v-if="total !== 0" :total="totalSize" :current="currentPage" @to-page="goTo"/>
    </footer>
  </div>
</template>
<script>
import _ from 'lodash';
import Cmtip from '@/components/basic/CmTip/CmTip';
import { Search, StTable, Pagination } from '@/components/basic/index';
import { getPeopleList, delPeople, changePeopleSwitch } from './../../service';
import CmSelect from './Select';
import EditPeople from './alert/EditPeople';
import AddToGroup from './alert/AddToGroup';

export default {
  name: 'contactPeople',
  components: { CmSelect, Search, StTable, Pagination, EditPeople, AddToGroup, Cmtip },
  data() {
    return {
      searchInfo: {},
      borderStyle: '',
      showFooter: false,
      showTips: false,
      tipContent: '确认删除已选联系人?',
      delIsList: false, // 用于判断是批量还是单个删除
      dealData: {}, // 用于删除时临时存储
      dealDataList: [], // 用于批量删除时临时存储
      peopleIdList: [],
      showEditPeople: false,
      peopleEditActive: 0,
      total: 1,
      totalSize: 5,
      page_size: 10,
      currentPage: 1,
      selectLists: [['全部', '系统用户', '其他用户'], ['全部', '启用', '禁用'], ['全部', '邮箱', '手机号', '姓名']], // 选项列表
      selectVal: ['全部', '全部', '全部'], // 选项默认值
      searchKey: '', // 搜索关键词
      colsOfRole: [
        { type: 'select' },
        { key: 'name', name: '姓名' },
        { key: 'classify', name: '分类' },
        { type: 'boolean', key: 'switch', name: '启用状态' },
        { key: 'tel', name: '手机号码' },
        { key: 'email', name: '邮箱地址' },
        { key: 'group', name: '所属组' },
        { type: 'operation', name: '操作' },
      ],
      tableData: [],
      selectList: [], // 这是表格的选择表
      peopleData: {}, // 传值给编辑弹窗
      showAddToGroup: false,
    };
  },
  watch: {
    tableData() {
      this.$nextTick(() => {
        this.setEllipsis();
      });
    },
  },
  created() {
    this.getPList();
  },
  methods: {
    // 监听到数据变化，进行dom操作, 变为省略号
    setEllipsis() {
      const wrapList = document.getElementsByClassName('stable-td-wrap');
      for (let i = 0; i < wrapList.length; i += 1) {
        if (document.getElementsByClassName('stable-td-wrap')[i].childNodes.length === 1) {
          break;
        }
        let str = document.getElementsByClassName('stable-td-wrap')[i].childNodes[6].childNodes[4].innerText;
        let str2 = document.getElementsByClassName('stable-td-wrap')[i].childNodes[5].childNodes[4].innerText;
        if (str.length > 10) {
          str = `${str.substr(0, 10)}......`;
          document.getElementsByClassName('stable-td-wrap')[i].childNodes[6].childNodes[4].innerText = str;
        }
        if (str2.length > 10) {
          str2 = `${str2.substr(0, 10)}......`;
          document.getElementsByClassName('stable-td-wrap')[i].childNodes[5].childNodes[4].innerText = str2;
        }
      }
    },
    addToGroup() {
      this.showAddToGroup = true;
    },
    saveToGroup(res) {
      this.showAddToGroup = false;
      if (res.code === 0) {
        this.getPList();
      }
    },
    changePSwitch(val) {
      const _this = this;
      const data = {
        id_list: JSON.stringify(this.selectList.map(item => _this.tableData[item]._id)),
        switch: val,
      };
      changePeopleSwitch(data).then((res) => {
        console.log(res.data);
        this.getPList();
      });
    },
    editSave(res) {
      // 更新table
      if (res.code === 0) {
        this.showEditPeople = false;
        this.getPList();
      }
    },
    editPeople(data) {
      this.showEditPeople = true;
      this.peopleEditActive = 1;
      this.peopleData = data.data;
    },
    showDetail(data) {
      this.showEditPeople = true;
      this.peopleEditActive = 2;
      this.peopleData = data.data;
    },
    deleteBaseLine() {
      this.showTips = false;
      if (this.delIsList === false) {
        const data = this.dealData;
        const obj = {};
        const lists = [];
        const mods = [];
        lists.push(data.data._id);
        mods.push(data.data.is_modify);
        obj.id_list = JSON.stringify(lists);
        obj.is_modify = JSON.stringify(mods);
        delPeople(obj).then((res) => {
          console.log(res.data);
          this.showTips = true;
          this.showFooter = false;
          this.tipContent = res.data.msg;
          this.getPList();
        });
      } else {
        const _this = this;
        const data = {
          id_list: JSON.stringify(this.selectList.map(item => _this.tableData[item]._id)),
          is_modify: JSON.stringify(this.selectList.map(item => _this.tableData[item].is_modify)),
        };
        delPeople(data).then((res) => {
          console.log(res.data);
          this.showTips = true;
          this.showFooter = false;
          this.tipContent = res.data.msg;
          this.getPList();
        });
      }
    },
    delOnePeople(data) {
      this.dealData = data;
      this.showTips = true;
      this.delIsList = false;
      this.showFooter = true;
      if (this.dealData.data.is_modify) {
        this.tipContent = '确认删除已选联系人?';
      } else {
        this.tipContent = '系统用户为不可删除对象，此操作只对其他用户生效，是否继续';
      }
    },
    delMorePeople() {
      this.showTips = true;
      this.delIsList = true;
      this.showFooter = true;
      const list = this.selectList.map(item => this.tableData[item].is_modify);
      let mod = 0;
      for (const i in list) {
        if (!list[i]) {
          mod += 1;
        }
      }
      if (mod === list.length) {
        this.tipContent = '系统用户或被引用用户不可被删除';
        this.showFooter = false;
        return;
      } else if (mod > 0) {
        this.tipContent = '系统用户和被引用用户不可删除，其余用户将被删除，是否继续';
        return;
      }
      this.tipContent = '确认删除已选联系人?';
    },
    getPList(searchObj, stepPage) {
      this.selectList = [];
      const _this = this;
      const data = {
        page_size: this.page_size,
        page: this.currentPage,
      };
      if (stepPage) {
        Object.assign(data, searchObj);
      }
      if (searchObj && !stepPage) {
        Object.assign(data, searchObj);
        data.page = 1;
        this.currentPage = 1;
      }
      getPeopleList(data).then((res) => {
        _this.tableData = [];
        _this.total = res.data.data.total;
        _this.totalSize = Math.ceil(_this.total / _this.page_size);
        // _this.page_size = _this.totalSize / _this.page_size;
        res.data.data.result.forEach((e) => {
          let newObj = {
            deleteable: false,
          };
          newObj = Object.assign({}, newObj, e);
          newObj.group = e.group.map(item => item.name).join(', ');
          if (!newObj.group) {
            newObj.group = '--';
          }
          if (e.is_modify === true) {
            newObj.deleteable = true;
          }
          _this.tableData.push(newObj);
        });
      });
    },
    addPeople() {
      // 新建联系人
      this.peopleEditActive = 0;
      this.showEditPeople = true;
      this.peopleData = {};
    },
    onSearch() {
      this.borderStyle = '';
      const flist = {
        邮箱: 'email',
        手机号: 'tel',
        姓名: 'name',
        全部: '',
      };
      this.searchInfo = {
        classify: this.selectVal[0],
        switch: this.selectVal[1] === '启用',
        field: flist[this.selectVal[2]],
        keyword: this.searchKey,
      };
      if (this.searchInfo.classify === '全部') {
        this.searchInfo.classify = '';
      }
      if (this.selectVal[1] === '全部') {
        delete this.searchInfo.switch;
      }
      if (this.searchInfo.field === '') {
        delete this.searchInfo.field;
      }
      this.getPList(this.searchInfo);
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
      this.peopleIdList = [];
      this.selectList.forEach((i) => {
        this.peopleIdList.push(this.tableData[i]._id);
      });
    },
    goTo(pageNumber) {
      this.currentPage = pageNumber;
      this.getPList(this.searchInfo, true);
    },
  },
  computed: {
    selectNotNull() {
      return this.selectList.length > 0;
    },
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
  },
};
</script>
<style lang="scss" scoped>
  #contact-people{
    .add-icon{
      margin: 0;
      margin-right: 5px;
    }
    width: 100%;
    .people-header{
      display: flex;
      margin-top: 15px;
      min-width: 1030px;
      // margin-left: 2px;
      .btn-list{
        display: flex;
        .btn-1{
          background-color: #1d73a8;
          color: white;
          height: 30px;
          padding: 0 15px;
          border: 0;
          border-radius: 3px;
          margin-right: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .btn-2{
          background-color: #d04631;
          color: white;
          height: 30px;
          padding: 0 15px;
          border: 0;
          border-radius: 3px;
          margin-right: 10px;
          cursor: pointer;
        }
      }
      .search{
        margin-left: auto;
        display: flex;
        .cm-select{
          margin-left: 10px;
        }
        .search-input{
          margin-left: 10px;
        }
      }
    }
    // .people-table{
    //   margin-top: 15px;
      // position: relative;
      .sttable{
        position: absolute;
        min-width: 1030px;
        top: 90px;
        bottom: 80px;
        width: 100%;
        .operation-edit{
          // margin-left: 15px;
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
    // }
    .footer {
        bottom: 0;
        height: 50px;
        width: 100%;
        line-height: 50px;
        position: absolute;
        .record-number {
          color: #4ab2a5;
        }
    }
  }
</style>


