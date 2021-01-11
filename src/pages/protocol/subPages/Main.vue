<template>
  <div class="main">
    <ProRuleAlert 
    :isShow="ruleAlert"
    @showValue="showValue"
    :dataT="dataT"
    />
    <ProRulePopup
    :isShow="ruleStr"
    @closeValue="closeValue"
    :dataT="dataT"
    />
    <ThisProRule
    :isShow="thisAlert"
    @closeThisValue="closeThisValue"
    :dataT="dataT"
    />
    <DataDeal
    v-if="ruleThree"
    @showValueTherr="showValueTherr"
    :dataT="dataThree"
    :dataIndex="dataDealIndex"
    />
    <PreDataDeal
    v-if="rulePre"
    @proPopupClose="proPopupClose"
    :dataT="dataPre"
    />
    <div class="protocol-table">
    <header class="header">
      <div>
        <BmsBtn type="add" @click="settingpro()"><span class="add-icon">+</span>新建协议</BmsBtn>
        <BmsBtn type="danger" :disabled="canAllDelete" @click="deleteProtocols">批量删除</BmsBtn>
      </div>
      <div class="protocol-export">
        <BmsBtn type="main" class="input-file" :disabled="!VisitdecodeConfImport" @click="getProtocol">协议导入
          <form action="/zh-cn/baseConfig/protocol/import/" enctype="multipart/form-data" name="fileinfo" id="myForm">
            <input v-if="VisitdecodeConfImport" type="file" value=""  @change="getFile($event)"/>
            <input type="submit" value="" style="display:none;">
          </form>
        </BmsBtn>
        <BmsBtn type="main" @click="exportProtocol" ref="export" :disabled="!VisitdecodeConfExport">协议导出</BmsBtn>
        <Search v-model="searchKey" :placeholder="'请输入要查询的协议'" @on-search="searchFn"></Search>
      </div>
    </header>
    <h1 v-show="false" v-text="`协议管理`"></h1>
    <div class="pro-table-div">
      <div class="pro-table-dis" v-if="VisitEdit"></div>
      <StTable class="pro-table" :cols="cols" :rows="tableData"
      :selectList="selectList" :headSelect="headSelect"
      @select="handleSelect"
      >
      <template slot="operation" slot-scope="slotData">
        <span class="operation">
          <a @click="detailItem(slotData)"  v-if="slotData.data.editable || !slotData.data.hasOwnProperty('editable')">详情</a>
          <span>|</span>
          <a @click="handleEditItem(slotData)"  v-if="slotData.data.selectable || !slotData.data.hasOwnProperty('selectable')">编辑</a>
          <span v-if="slotData.data.selectable || !slotData.data.hasOwnProperty('editable')">|</span>
          <a style="color: #d04631" 
          @click="!slotData.data.selectshow || slotData.data.selectable ? showDelTip(slotData) : ''"
          v-if="slotData.data.selectable || !slotData.data.hasOwnProperty('selectable')">删除</a>
          <span v-if="slotData.data.selectable || !slotData.data.hasOwnProperty('selectable')">|</span>
          <a @click="cloneData(slotData)">克隆</a>
        </span>
      </template>
      </StTable>
    </div>
    <footer class="footer">
      共计 <span class="record-number">{{ total }}</span> 条记录
      <Pagination v-if="total !== 0" :total="totalSize" :current="currentPage" @to-page="goTo"/>
    </footer>
    <CmTip v-show="delTipFlag" :tipTitle="tipTitle" :tipContent="tipContent" :closeFn="() => delTipFlag = false" :showFooter="showFooter" @on-confirm="deleteItem" ></CmTip>
    </div>
    <div id="proto-opr">
      <div class="proto-config-container" v-if="showBox">
        <div class="config-main">
          <ul class="tabs">
            <li
              :class="[index === activeIndex ? 'active' : '' , ifClckArr.indexOf(index) === -1 ? 'no-nav-tab' : '']"
              v-for="(item,index) in tabs"
              :key="index"
              :id="item.id"
              @click="clickNav(index)">
              {{ item.text }}
            </li>
          </ul>
          <div class="CSBtn">
            <div class="right-icon-div boxClose" :title="closeText" @click="onClickCancel">{{closeText}}</div>
          </div>
          <div class="content">
            <ScrollBar class="nav-content" v-for="(item,index) in tabs" v-show="index === activeIndex"  :key="index">
              <ProInfo  
              v-if="item.id === 'proInfo'" @proInfoData="proInfoData"
              ref="ProInfo"
              ></ProInfo>
              <ProRule v-if="item.id === 'proRule'" 
              @changeRuleAlert="changeRuleAlert"
              @changeThisAlert="changeThisAlert"
              @changeRuleStr="changeRuleStr">
              </ProRule>
              <ProStr v-if="item.id === 'proStr'" 
              @popupDataT="popupDataT"
              @popupPreT="popupPreT">
              ></ProStr>
            </ScrollBar>
            <div class="nav-footer" v-if="hideStore">
              <div v-if="cancalBnt" class="footer-bnt cancel-bnt" title="取消" @click="onClickCancel" style="width:60px">取消</div>
              <div v-if="nextBnt" class="footer-bnt save-bnt" title="下一步" @click="onClickSave" style="width:93px">下一步</div>
              <div v-else class="footer-bnt save-bnt" title="保存" @click="SaveData" style="width:60px">保存</div>
              <div v-if="backBnt" class="footer-bnt back-bnt" title="上一步" @click="onClickBack" style="width:93px">上一步</div>
            </div>
          </div>  
        </div>
      </div>
    </div>
    <config-box v-if="detailConfig" :tabs="tabdeT" @closeConfig="closeConfigFn" :onlyConfirm="true" :scrollheight="436">
      <div slot="prodetail">
        <ProInfo
        @proInfoData="proInfoData"
        ref="ProInfo"
        >
        </ProInfo>
        <div class="pro-info-mask"></div>
        <span class="pro-name-tip" style="margin-left:52px"></span>
        <span class="pro-name-title">{{ nameTitle }}</span>
        <ProRule style="border:none;background:transparent;"
        :ifRuleDedail = false
        @changeRuleAlert="changeRuleAlert"
        @changeThisAlert="changeThisAlert"
        @changeRuleStr="changeRuleStr">
        </ProRule>
        <span class="pro-name-tip" style="margin-left:52px"></span>
        <span class="pro-name-title">{{ nameTitleT }}</span>
        <div class="xml-show" v-html='xlmShow'>
        </div>
      </div>
  </config-box>
    <!-- <form ref="exportForm" :action="'/zh-cn/baseConfig/protocol/download/'"  target="_blank" method="POST" style="display:none;">
        <input type="hidden" name="csrfmiddlewaretoken" :value="token">
        <input type="hidden" name="protocolname" :value="exprotName">
    </form> -->
  </div>
</template>
<script>

import jsCookie from 'js-cookie';
import { mapState } from 'vuex';
import ProInfo from '@/components/protocol/ProInfo';
import ProRule from '@/components/protocol/ProRule';
import ProStr from '@/components/protocol/ProStr';
import _ from 'lodash';
import { validateProtocolName, validateProtocoldis } from '@/helpers/configValidate';
import configBox from '@/components/basic/ConfigBox';
import { StTable, Pagination, BmsBtn, Search, CmTip } from '@/components/basic/index';
import ScrollBar from '@/components/basic/ScrollBar';
import ProRuleAlert from '@/components/protocol/ProRuleAlert';
import PreDataDeal from '@/components/protocol/PreDataDeal';
import ThisProRule from '@/components/protocol/ThisProRule';
import ProRulePopup from '@/components/protocol/ProRulePopup';
import DataDeal from '@/components/protocol/DataDeal';
import { getProtocolList, colneData, createProtocol, editProtocol, deleteProtocol, detailProtocol, downloadProtocol, searchProtocol, formProtocol } from '../service';
import { formatProtocolTable } from '../utils';


export default {
  components: {
    ProInfo,
    ProRule,
    ProStr,
    StTable,
    ScrollBar,
    ProRuleAlert,
    ProRulePopup,
    ThisProRule,
    DataDeal,
    Pagination,
    PreDataDeal,
    BmsBtn,
    Search,
    configBox,
    CmTip,
  },
  data() {
    return {
      VisitEdit: true,
      VisitdecodeConfImport: true,
      VisitdecodeConfExport: true,
      // exprotName: '',
      token: jsCookie.get('csrftoken'),
      tabdeT: [
        { id: 'prodetail', text: '详情' },
      ],
      tabs: [
        { id: 'proInfo', text: '①协议信息' },
        { id: 'proRule', text: '②解码规则' },
        { id: 'proStr', text: '③字段处理' },
      ],
      ifEdit: false,
      showBox: false,
      xlmShow: '', // xml展示
      closeText: '关闭',
      protocolList: {}, // 列表值
      activeIndex: 0,
      hideStore: true,
      ifClck: 0,
      ifClckArr: [0],
      backBnt: false,
      total: 0,
      totalSize: 0,
      currentPage: 1,
      tipTitle: '提示',
      onConFirm: 'deleteP', // 删除
      delTipFlag: false,
      nameTitle: '解码规则',
      nameTitleT: '字段处理',
      tipContent: '确认删除已选协议？该操作将同时删除引用该协议的指标和维度。',
      searchKey: '',
      pagesize: 10,
      cancalBnt: true,
      ifEditButton: false, // 是否编辑
      oldUpdataName: '', // 修改前名称
      delList: '',
      nextBnt: true,
      dataT: {},
      dataThree: {},
      dataPre: {},
      ruleAlert: false,
      thisAlert: false,
      showFooter: true,
      ruleStr: false,
      ruleThree: false,
      rulePre: false,
      uploadFileName: '',
      Form: new FormData(),
      detailConfig: false, // 详情
      proListData: [], // 返回全部列表
      diffName: '',
      hasDelete: false,
      infoObj: {
        name: '',
        desc: '',
      },
      cols: [
        { type: 'select' },
        { key: 'protocol_name', name: '协议' },
        { key: 'desc', name: '分类' },
        { key: 'decodeDesc', name: '解码字段' },
        { key: 'update_time', name: '更新时间' },
        { type: 'operation', name: '操作' },
      ],
      tableData: [
        {},
      ],
      selectList: [],
      dataDealIndex: 0,
      // headSelect: true,
    };
  },
  methods: {
    changeRuleAlert(data) {
      this.dataT = data;
      this.ruleAlert = true;
    },
    changeThisAlert(data) {
      this.dataT = data;
      this.thisAlert = true;
    },
    changeRuleStr(data) {
      this.dataT = data;
      this.ruleStr = true;
    },
    closeValue() {
      this.ruleStr = false;
    },
    closeThisValue() {
      this.thisAlert = false;
    },
    showValueTherr() {
      this.ruleThree = false;
    },
    popupDataT(data, index) {
      if (data) {
        this.dataThree = {};
        this.dataThree = data;
        this.dataDealIndex = index;
      } else {
        this.dataThree = {};
        this.dataDealIndex = index;
      }
      this.ruleThree = true;
    },
    popupPreT(data, index) {
      if (data) {
        this.dataPre = {};
        this.dataPre = data;
        this.dataPre.index = index;
      } else {
        this.dataPre = {};
        this.dataPre.index = index;
      }
      this.rulePre = true;
    },
    proPopupClose() {
      this.rulePre = false;
    },
    showValue() {
      this.ruleAlert = false;
    },
    prePotol() {
      this.showBox = true;
    },
    closeConfigFn() {
      this.detailConfig = false;
    },
    onClickCancel() { // 点击关闭取消，数据清空。
      this.tipContent = '关闭后全部配置信息将丢失';
      this.delTipFlag = true;
      this.showFooter = true;
      this.onConFirm = 'closePopup';
    },
    clearDataInit() {
      const newDname = this.proAllValue.name;
      this.ifClckArr = [0];
      this.$store.dispatch('basic');
      this.showBox = false;
      this.delTipFlag = false;
      this.activeIndex = 0;
      this.checkoutStates();
      if (!this.ifEdit) {
        deleteProtocol(newDname).then(() => {}).catch();
      }
    },
    showDelTip(slotData) {
      this.tipContent = '确认删除已选协议？该操作将同时删除引用该协议的指标和维度。';
      this.delTipFlag = true;
      this.showFooter = true;
      this.onConFirm = 'deleteP';
      this.delList = slotData.data.protocol_name;
    },
    onClickSave() {
      const ift = this.emitData();
      if (ift) {
        const nowIndex = this.activeIndex + 1;
        if (nowIndex === 2) {
          this.nextBnt = false;
        }
        this.ifClckArr.push(nowIndex);
        this.ifClckArr = Array.from(new Set(this.ifClckArr));
        this.activeIndex = nowIndex;
      }
    },
    emitData() { // 保存名称
      let ift = true;
      const eIndex = this.activeIndex;
      const protoNameV = this.protoNameV;
      if (eIndex === 0) {
        const nameVa = validateProtocolName(this.infoObj.name);
        const nameDisVa = validateProtocoldis(this.infoObj.desc);
        this.showFooter = false;
        if (protoNameV.indexOf(this.infoObj.name) === -1) {
          if (!nameVa.bool) {
            this.delTipFlag = true;
            this.tipContent = `协议名称：${nameVa.tip}`;
            ift = false;
          } else if (nameVa.bool && !nameDisVa.bool) {
            this.delTipFlag = true;
            this.tipContent = `协议描述：${nameDisVa.tip}`;
            ift = false;
          } else {
            ift = true;
            this.saveNameFn();
          }
        } else {
          this.delTipFlag = true;
          this.tipContent = '存在相同的协议名称';
          ift = false;
        }
      }
      return ift;
    },
    saveNameFn() {
      this.diffName = this.infoObj.name;
      this.$store.dispatch('setbasic', this.infoObj);
    },
    clickNav(index) {
      let ift = true;
      if (index !== 0) {
        ift = this.emitData();
      }
      if (ift) {
        this.ifClckArr.forEach((item) => {
          if (index === item) {
            this.activeIndex = index;
          }
        });
        this.checkoutStates();
      }
    },
    async detailItem(slotData) { // 每条数据详情
      try {
        const adata = await detailProtocol(slotData.data.protocol_name);
        if (adata.data.code === 0) {
          this.$store.dispatch('detailData', adata.data.data);
          this.detailConfig = true;
          const xlmDetail = adata.data.data.detail;
          this.xlmShow = xlmDetail;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async searchFn() { // 搜索
      const _this = this;
      try {
        const name = this.searchKey;
        const adata = await searchProtocol(name);
        if (adata.data.code === 0) {
          _this.proListData = adata.data.data.protocol_list;
          this.pageProtocol();
        }
      } catch (e) {
        console.log(e);
      }
    },
    deleteItem() {
      if (this.onConFirm === 'closePopup') {
        this.clearDataInit();
      } else {
        const _this = this;
        deleteProtocol(this.delList).then(() => {
          this.delTipFlag = false;
          _this.initProrocol();
          this.hasDelete = true;
          _this.handleSelect({ index: -1, checked: false });
        }).catch();
      }
    },
    deleteProtocols() {
      this.delTipFlag = true;
      const arr = [];
      this.selectList.forEach((x) => {
        arr.push(this.tableData[x].protocol_name);
      });
      this.delList = arr.join(',');
    },
    datagetEx() {
      const arr = [];
      this.selectList.forEach((x) => {
        arr.push(this.tableData[x].protocol_name);
      });
      this.delList = arr;
      // this.exprotName = arr.join(',');
    },
    async exportProtocol() { // 数据导出
      this.datagetEx();
      _.forEach(this.delList, (item) => {
        try {
          downloadProtocol(item, true).then((res) => {
            const content = res;
            const blob = new Blob([content.data], { type: 'application/octet-stream' });
            const fileName = `${item}.zip`;
            if ('download' in document.createElement('a')) { // 非IE下载
              const elink = document.createElement('a');
              elink.download = fileName;
              elink.style.display = 'none';
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else { // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          });
        } catch (e) {
          console.log(e);
        }
      });
    },
    getProtocol() {
    },
    onSearch() {
      this.currentPage = 1;
      this.initProrocol();
    },
    settingpro() {
      this.$store.dispatch('ititAllData');
      this.infoObj.name = this.proAllValue.name;
      this.infoObj.desc = this.proAllValue.desc;
      this.showBox = true;
      this.ifEdit = false;
      this.ifEditButton = false;
      this.oldUpdataName = '';
    },
    goTo(pageNumber) {
      this.hasDelete = false;
      this.handleSelect({ index: -1, checked: false });
      this.currentPage = pageNumber;
      this.pageProtocol();
    },
    checkoutStates() {
      if (this.activeIndex === 1) {
        this.nextBnt = true;
      } else if (this.activeIndex === 2) {
        this.nextBnt = false;
      } else {
        this.nextBnt = true;
      }
    },
    onClickBack() {
      this.activeIndex = this.activeIndex - 1;
      this.checkoutStates();
    },
    proInfoData(type, value) {
      if (type === 'input') this.infoObj.name = value;
      else this.infoObj.desc = value;
    },
    SaveData() { // 保存数据
      let canSave = true;
      const allDataV = this.$store.state.protocolData;
      _.forEach(allDataV['proto.xml'].normalizes.normalize, (item) => {
        if ((item.field !== undefined && item.field.length !== 0) || (item.if !== undefined && item.if.length !== 0)) console.log('ol');
        else canSave = false;
      });
      if (canSave) {
        const dataArr = [];
        _.forEach(this.protoColData['proto.xml'].prepare.field, (item) => {
          const dataFitle = item;
          delete dataFitle.show;
          dataArr.push(dataFitle);
        });
        this.protoColData['proto.xml'].prepare.field = dataArr;
        const actionType = this.ifEditButton ? 'update' : 'create';
        createProtocol(this.protoColData, actionType, this.oldUpdataName);
        this.$store.dispatch('NameDiff', this.diffName);
      } else {
        this.delTipFlag = true;
        this.showFooter = false;
        this.tipContent = '字段处理未配置完成';
      }
    },
    async handleEditItem(slotData) { // 每条数据编辑
      try {
        const adata = await editProtocol(slotData.data.protocol_name);
        if (adata.data.code === 0) {
          this.showBox = true;
          this.$store.dispatch('editAllData', adata.data.data);
          this.infoObj.name = this.proAllValue.name;
          this.infoObj.desc = this.proAllValue.desc;
          this.ifEdit = true;
          this.ifClckArr = [0, 1, 2];
          this.ifEditButton = true;
          this.oldUpdataName = this.proAllValue.name;
        }
      } catch (e) {
        console.log(e);
      }
    },
    cloneData(slotData) {
      colneData(slotData.data.protocol_name);
    },
    handleDeleteItem(slotData) {
      console.log(slotData.index);
    },
    handleSelect(data) {
      const [index, checked] = [data.index, data.checked];
      console.log(index, checked);
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
    async initProrocol() { // 初始化列表
      const _this = this;
      const protocolListData = await getProtocolList();
      getProtocolList({
        size: this.pagesize,
        query: this.searchKey,
        page: this.currentPage,
      }).then((res) => {
        this.protocolList = protocolListData.data;
        if (res.data.code === 0) {
          _this.proListData = res.data.data.protocol_list;
          this.pageProtocol();
          this.nameList(res.data.data);
        }
      }).catch();
    },
    nameList(data) {
      const nameAllArr = [];
      _.forEach(data.protocol_list, (item) => {
        nameAllArr.push(item.protocol_name);
      });
      this.$store.dispatch('protoNameL', nameAllArr);
    },
    pageProtocol() { // 分页
      if (this.hasDelete) this.currentPage = 1;
      const nowPa = this.currentPage;
      const leftPage = 10;
      const fristPage = (nowPa - 1) * 10;
      // if (nowPa === this.totalSize) {
      //   leftPage = this.total % 10;
      // }
      const NowPagedata = this.proListData.slice(fristPage, fristPage + leftPage);
      this.total = this.proListData.length;
      this.totalSize = Math.ceil(this.proListData.length / this.pagesize);
      this.tableData = formatProtocolTable(NowPagedata);
    },
    getFile(e) {
      const _this = this;
      this.Form = new FormData();
      this.Form.append('csrfmiddlewaretoken', this.token);
      this.Form.append('protocolfile', e.target.files[0]);
      this.uploadFileName = e.target.files[0].name;
      formProtocol(this.Form).then((res) => {
        if (res.data.code === 0) {
          _this.initProrocol();
        } else if (res.data.code === -3) {
          this.showFooter = false;
          this.delTipFlag = true;
          this.tipContent = res.data.msg;
        }
      });
    },
  },
  computed: {
    ...mapState({
      proAllValue: state => state.protocolData['proto.xml'].basic,
      protoColData: state => state.protocolData,
      protoNameV: state => state.protoName,
    }),
    validIndexList() {
      const validIndexList = [];
      this.tableData.forEach((d, i) => {
        if (d.selectable || !_.has(d, 'selectable')) {
          validIndexList.push(i);
        }
      });
      return validIndexList;
    },
    headSelect() { return this.selectList.length === this.validIndexList.length && this.selectList.length !== 0; },
    canAllDelete() { return this.selectList.length === 0; },
  },
  watch: {
    activeIndex(index) {
      if (index !== 0) {
        this.backBnt = true;
        this.cancalBnt = false;
      } else {
        this.backBnt = false;
        this.cancalBnt = true;
      }
    },
  },
  created() {
    this.initProrocol();
  },
  mounted() {
    this.VisitEdit = !this.session$.newpermissions.decode_conf_edit;
    this.VisitdecodeConfImport = this.session$.newpermissions.decode_conf_import;
    this.VisitdecodeConfExport = this.session$.newpermissions.decode_conf_export;
  },
};

</script>

<style lang="scss" scoped>
.input-file{
    display: inline-block;
    width: 76px;
    height: 30px;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    text-align: center;
    width: 78px;
    background-color: #2c7;
    border-radius: 4px;
    border: 1px solid #139d8c;
    font-weight: normal;
    line-height: 30px;
    color:#fff;
    text-decoration: none;
}
.input-file input[type="file"] {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    font-size: 14px;
    background-color: #fff;
    transform: translate(-300px, 0px) scale(4);
    height: 40px;
    opacity: 0;
    filter: alpha(opacity=0);
 }
.xml-show{
  background: #0a1925;
  border: 1px solid #0f3f62;
  margin: 10px 60px;
  overflow: hidden;
  word-break: break-all;
}
.pro-info-mask{
  position: absolute;
  top: 0;
  left: 0;
  width: 94%;
  height: 655px;
  z-index: 105;
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
.header{
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  .protocol-export{

  }
}
.protocol-table{
  position: absolute;
  top: 58px;
  bottom: 0;
  left: 15px;
  right: 10px;
}
.pro-table-div{
  position: relative;
  width: 100%;
  height: 95%;
  .pro-table{
    position: absolute;
    top: -5px;
    bottom: 80px;
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
  .pro-table-dis{
    position: absolute;
    width: 100%;
    height:100%;
    top: 0;
    left: 0;
    z-index: 200;
  }
}
.add-bnt{
  font-size: 17px;
  float: left;
  line-height: 27px;
  margin-right: 3px;
}
.proto-config-container {
    overflow: auto;
    z-index: 12;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    display: block;

    .config-main{
      width: 1150px;
      height: 500px;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
    }

    ul.tabs {
      min-width: 260px;
      text-align: left;
      position: absolute;
      left: calc(50% - 575px);
      width: auto;
      height: 50px;
      line-height: 50px;
      color: #ffffff;
      bottom: 0;
      top: calc(50% - 250px - 25px);

      li {
        background: url(../../../assets/topo-nav/nav-tab.png) no-repeat;
        background-size: initial;
        background-position-y: 5px;
        margin-right: -10px;
        width: 158px;
        font-size: 18px;
        text-align: center;
        float: left;
        cursor: pointer;
      }

      li.active {
        background: url(../../../assets/topo-nav/nav-tab-active.png) no-repeat;
        background-size: initial;
        background-position-y: 5px;
      }

      li.no-nav-tab {
        background: url(../../../assets/protocol/gragPo.png) no-repeat;
        background-size: initial;
        background-position-y: 5px;
      }

      li.error {
        background: url(../../../assets/topo-nav/nav-tab-error.png) no-repeat;
        background-size: initial;
        background-position-y: 5px;
      }

      li.error-active {
        background: url(../../../assets/topo-nav/nav-tab-error-active.png) no-repeat;
        background-size: initial;
        background-position-y: 5px;
      }

      li.custom {
        position: absolute;
        top: -4px;
        width: 265px;
        height: 52px;
        line-height: 60px;
        color: #e0e9f1;
        background: url(../../../assets/topo-nav/tag.svg) no-repeat;
        background-size: 100% 100%;
        background-position-y: 5px;
      }
    }

    .CSBtn {
      position: absolute;
      right: calc(50% - 575px);
      background-repeat: no-repeat;
      top: calc(50% - 250px - 15px);
      width: 130px;
      height: 40px;
      color:#fff;

      div{
        cursor: pointer;
      }

      .right-icon-div {
        width: 75px;
        right: 1px;
        cursor: pointer;
        height: 40px;
        line-height: 40px;
        text-align: center;
        float: right;

        &.boxStore {
          background: url(../../../assets/manageApp/navSave.png) 5px 0 no-repeat;
          margin-right: -22px;
        }

        &.boxClose {
          background: url(../../../assets/manageApp/navClose.png) 0 0 no-repeat;
        }
      }
    }

    .content {
      width: 1150px;
      height: 500px;
      position: absolute;
      left: 50%;
      color: white;
      transform: translate(-50%, -50%);
      overflow-y: auto;
      overflow-x: hidden;
      background: rgb(8, 25, 40);
      box-sizing: border-box;
      border: 1px solid rgb(21, 193, 227);
      top: calc(50% + 25px);
      .nav-content {
        border-top: 1px solid rgb(11, 36, 56);
        margin-top: 30px;
        padding: 0px 50px;
        width: 100%;
        top: 0;
        position: absolute;
        display: inline-block;
        padding-bottom: 0;
        height: calc(100% - 90px);
      }
      .nav-footer{
        width: 100%;
        box-sizing: border-box;
        height: 60px;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px #0b2438 solid;

        .footer-bnt{
          text-align: center;
          width: 60px;
          height: 30px;
          line-height: 30px;
          border-radius: 3px;
          font-size: 14px;
          cursor: pointer;
          float: right;
          margin-top: 15px;
          border: #12c2e9 1px solid;
          color: #12c2e9;
        }
        .save-bnt{
          margin-right: 20px;
          background:  #0ea4c3;
          color: #fff;
          &:hover{
            background: #0fb9db;
          }
        }
        .cancel-bnt{
          margin-right: 32px;
          line-height: 29px;
          &:hover{
            border: #14d8ff 1px solid;
            color: #14d8ff;
          }
        }
        .back-bnt{
          box-sizing: border-box;
          width: 93px;
          margin-right: 10px;
          line-height: 29px;
          &:hover{
            border: #14d8ff 1px solid;
            color: #14d8ff;
          }
        }
      }
    }
  }

  input::-webkit-input-placeholder{
    color: #777;
  }
  input::-moz-placeholder{
    color: #777;
  }
  input:-ms-input-placeholder{
    color: #777;
  }
</style>

