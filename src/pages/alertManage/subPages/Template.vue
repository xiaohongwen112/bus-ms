<template>
  <div class="alert-template">
    <h3 v-show="false" v-text="'规则模板'"></h3>
    <header class="header">
      <div>
        <BmsBtn type="add" @click="handleCreatItem()" :disabled="addDisabled"><i class="add-icon"></i>新建模板</BmsBtn>
        <BmsBtn type="danger" :disabled="canAllDelete"
        @click="handleSelectGroup">批量删除</BmsBtn>
      </div>
      <div>
        <Search v-model="searchKey" :placeholder="'请输入要查询的模板'" @on-search="goTo(1)"></Search>
      </div>
    </header>
    <StTable class="template-table" :cols="colsOfTemplate" :rows="tableData"
    :selectList="selectList" :headSelect="headSelect" :showHeadSelect="validIndexList.length > 0"
    @select="handleSelectItem"
    >
    <template slot="operation" slot-scope="slotData">
      <span  class="operation">
        <a @click="handleDetailItem(slotData)">详情</a>
          |
        <template v-if="slotData.data.editable || !slotData.data.hasOwnProperty('editable')">
          <a @click="handleEditItem(slotData)"  v-if="slotData.data.editable || !slotData.data.hasOwnProperty('editable')">编辑</a>
          |
        </template>
        <a @click="handleCloneItem(slotData)">克隆</a>
        <template v-if="slotData.data.deleteable || !slotData.data.hasOwnProperty('deleteable')">
          |
          <a class="delete"
          @click="handleDeleteItem(slotData, slotData.data.selectable)" 
          :class="{'delete-enable': !slotData.data.selectable}" 
          >删除</a>
        </template>
          
      </span>
    </template>
    </StTable>
    <footer class="footer">
      共计 <span class="record-number">{{ total }}</span> 条记录
      <Pagination v-if="total !== 0" :total="totalSize" :current="currentPage" @to-page="goTo"/>
    </footer>
    <CmTip v-show="delTipFlag" :tipTitle="tipTitle" :tipContent="tipContent" :closeFn="() => delTipFlag = false" :showFooter="true"
      @on-confirm="deleteConfirm" ></CmTip>
    <ModalTemplateDetail v-if="modalShowStatus === 'detail'" :data="modalData"
    @onClose="closeModal"/>
    <ModalTemplateEdit v-if="['creat', 'edit'].includes(modalShowStatus)" :title="modalTittle" :data="modalData"
    @onClose="closeModal" @onSave="saveChange"/>
   
  </div>
</template>
<script>
import _ from 'lodash';
import { BmsBtn, Search, StTable, Pagination, CmTip } from '@/components/basic/index';
import ModalTemplateDetail from '../components/ModalTemplateDetail';
import ModalTemplateEdit from '../components/ModalTemplateEdit';
import defaultTemplate from '../defaultTemplate';
import { colsOfTemplate, formatTemplateTable, formatTemplateReq } from '../utils';
import { getTemplateTable, deleteTemplate, cloneTemplate, saveTemplate } from '../service';
// import { colsOfTemplate, formatTemplateTable } from '../utils';

export default {
  name: 'template',
  components: {
    BmsBtn,
    Search,
    StTable,
    Pagination,
    CmTip,
    ModalTemplateDetail,
    ModalTemplateEdit,
  },
  data() {
    return {
      // canAllDelete: false,
      currentPage: 1,
      pagesize: 10,
      searchKey: '',
      modalShowStatus: null, // creat|edit|detail
      // modalTittle: '新建',
      modalData: defaultTemplate,
      colsOfTemplate,
      tableData: [],
      originData: [],
      totalSize: 0,
      total: 0,
      selectList: [],
      // headSelect: true,
      delTipFlag: false,
      tipTitle: '提示',
      tipContent: '删除已选模板？',
    };
  },
  computed: {
    modalTittle() {
      return this.modalShowStatus === 'edit' ? '编辑' : '新建模板';
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
    canAllDelete() { return this.selectList.length === 0; },
    addDisabled() { return this.session$.newpermissions.rule_template_edit === false; },
    headSelect() { return this.validIndexList.length > 0 && this.selectList.length === this.validIndexList.length; },
  },
  methods: {
    initTableData() {
      this.selectList = [];
      // const tags = JSON.stringify(this.searchKey !== '' ? [this.searchKey] : []);
      getTemplateTable({
        page_size: this.pagesize,
        // tags,
        keyword: this.searchKey,
        page: this.currentPage,
      }).then((res) => {
        // console.log(res.data);
        if (res.data.code === 0) {
          const data = res.data.data;
          this.total = data.total;
          this.totalSize = Math.ceil(data.total / this.pagesize);
          this.originData = data.result;
          this.tableData = [];
          this.tableData = formatTemplateTable(data.result);
          // this.modalData = this.tableData[0];
        }
      }).catch();
    },
    closeModal() {
      this.modalShowStatus = null;
    },
    // onSearch() {
    //   this.currentPage = 1;
    //   this.initTableData();
    // },
    saveChange(reqData) {
      const isCreat = this.modalShowStatus === 'creat';
      this.modalShowStatus = null;
      // save
      const _this = this;
      saveTemplate({
        document: JSON.stringify(formatTemplateReq(reqData)),
      }, isCreat).then((res) => {
        if (res.data.code === 0) {
          _this.initTableData();
        }
      });
    },
    handleDetailItem(data) {
      this.modalShowStatus = 'detail';
      this.modalData = this.originData[data.index];
    },
    handleEditItem(data) {
      this.modalShowStatus = 'edit';
      this.modalData = this.originData[data.index];
    },
    handleCreatItem() {
      this.modalShowStatus = 'creat';
      this.modalData = defaultTemplate;
    },
    handleCloneItem(data) {
      // console.log(data);
      cloneTemplate({
        _id: data.data._id,
      }).then((res) => {
        if (res.data.code === 0) {
          this.initTableData();
        }
      });
    },
    handleSelectGroup() {
      // 删除组
      this.delete(this.selectList);
    },
    handleSelectItem(data) {
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
    handleDeleteItem(slotData, deleteable = true) {
      // 删除条目
      if (deleteable) {
        this.delete([slotData.index]);
      }
    },
    delete(list) {
      this.deleteList = list.map(i => this.tableData[i]._id);
      // console.log('delete', this.deleteList);
      this.delTipFlag = true;
    },
    deleteConfirm() {
      // 调用删除接口
      deleteTemplate({
        id_list: JSON.stringify(this.deleteList),
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
    goTo(pageNumber) {
      // console.log(pageNumber);
      this.currentPage = pageNumber;
      this.initTableData();
    },
  },
  mounted() {
    this.initTableData();
  },
};
</script>

<style>

</style>
