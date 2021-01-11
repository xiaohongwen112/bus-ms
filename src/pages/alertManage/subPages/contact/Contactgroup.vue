<template>
  <div id="contact-group">
    <Cmtip v-if="showTips" :closeFn="() => showTips = false"
      :tipContent="tipContent" :showFooter="false">
    </Cmtip>
    <AddGroup v-if="showAddGroup" @close="closeAddGroup" :editData="{}"></AddGroup>
    <div class="group-header">
      <div class="btn-list">
        <button class="btn-1" @click="showAddGroup = true"><i class="add-icon"></i>新建联系组</button>
      </div>
      <div class="search">
        <div class="search-input">
          <Search v-model="searchKey" :placeholder="'请输入要查询的联系组名'" @on-search="onSearch"></Search>
        </div>
      </div>
    </div>
    <ScrollBar class="group-content" v-if="groupData.length !== 0">
      <DropDownBox v-for="(item, index) in groupData" :key="index" 
      :showIndex="index" :isShow="openTable === index && item.contact_list.length > 0" :canOpen="item.contact_list.length > 0"
      :group="item" :defaultShow="item.default" 
      class="drop-box" 
      @update="updateBox" @showIndex="showIndex">
        <DropTable :width="DropTableWidth" :list="item.contact_list" :default="item.default" :groupId="item._id" @update="updataTable"></DropTable>
      </DropDownBox>
    </ScrollBar>
    <div class="bc" v-if="groupData.length === 0">
      <img src="../../../../assets/sys-icon/noStatDataImg.svg" alt="暂无内容" srcset="" width="160" height="220">
    </div>
    <footer class="footer">
      共计 <span class="record-number">{{ total }}</span> 条记录
      <Pagination v-if="total !== 0" :total="totalSize" :current="currentPage" @to-page="goTo"/>
    </footer>
  </div>
</template>
<script>
import Cmtip from '@/components/basic/CmTip/CmTip';
import { Search, StTable, Pagination, ScrollBar } from '@/components/basic/index';
import { getGroup } from './../../service';
import DropDownBox from './contactgroup/DropDownBox';
import DropTable from './contactgroup/DropTable';
import AddGroup from './alert/AddGroup';

export default {
  components: { Search, StTable, Pagination, DropDownBox, DropTable, AddGroup, ScrollBar, Cmtip },
  data() {
    return {
      showTips: false,
      tipContent: '',
      DropTableWidth: 0,
      searchKey: '', // 搜索关键词
      showAddGroup: false,
      total: 2,
      totalSize: 3,
      currentPage: 1,
      pageSize: 10,
      groupData: [],
      openTable: -1,
      groupHeight: 100,
      searchName: '',
    };
  },
  mounted() {
    this.DropTableWidth = window.screen.width;
    // this.groupHeight = window.screen.height - 190;
  },
  created() {
    this.getG();
  },
  methods: {
    showIndex(val) {
      this.openTable = val;
    },
    updataTable() {
      this.getG();
    },
    updateBox() {
      this.getG();
    },
    getG(val, step) {
      this.openTable = -1;
      const _this = this;
      const getdata = {
        page: this.currentPage,
        page_size: this.pageSize,
      };
      if (val && !step) {
        this.searchName = val;
      }
      if (val === '') {
        this.searchName = '';
      }
      getdata.name = this.searchName;
      getGroup(getdata).then((res) => {
        _this.groupData = res.data.data.result;
        _this.total = res.data.data.total;
        _this.totalSize = Math.ceil(_this.total / _this.pageSize);
        _this.openTable = 0;
      });
    },
    goTo(val) {
      // afafaf
      this.currentPage = val;
      this.getG(val, true);
    },
    onSearch(val) {
      this.currentPage = 1;
      this.getG(val);
    },
    closeAddGroup(res) {
      this.showAddGroup = false;
      if (res && res.code === 0) {
        this.getG();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  #contact-group{
    height: 100%;
    .add-icon{
      margin: 0;
      margin-right: 5px;
    }
    .group-header{
      display: flex;
      margin-top: 15px;
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
    .group-content{
      width: 100%;
      height: calc(100% - 130px);
      overflow: hidden;
      .drop-box{
        margin-top: 15px;
      }
    }
    .bc{
      width: 100%;
      height: calc(100% - 130px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      p{
        font-size: 30px;
        color: gray;
        margin-top: 20px;
      }
    }
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