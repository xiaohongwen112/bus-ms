<template>
  <div class="test-basic">
    <div>
      <CmBtn >保存</CmBtn>
      <CmBtn :disabled="true">保存</CmBtn>
      <CmBtn :disabled="false" @click-btn="clickBtn" >存储</CmBtn>
    </div>
    <div>
      <RectBtn @click-btn="clickRectBtn">bulalal</RectBtn>
    </div>
    <div>
      <RadioBtn @check-btn="checkBtn"/>
    </div>
    <div>
      <CheckWeek @check-btn="changeWeek" :activeWeek="activeWeek"/>
    </div>
    <div class="tooltip-demo-parent" id="hahah" v-tooltip="`文字提hahahahhahahhaha示`" >文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示</div>
    <div class="tooltip-demo-parent" v-tooltip.ellipsis="{title: `文字提示ooo`, placement: 'top', trigger: ['blur']}" >文字提示文字提示文字提示文字提示示文字提示示文字提示示文字提示示文字提示</div>
    <div class="tooltip-demo-parent" v-tooltip.ellipsis="{title: `文字提示ooo`, placement: 'bottom', trigger: ['blur']}" >文字提示文字</div>
    <div class="tooltip-demo-parent" v-tooltip.left.click="`文字提示`" >文字提示</div>
    <div class="tooltip-demo-parent" v-tooltip.right="`文字提示`" >文字提示</div>
    <div>
      <h4>5.1基础组件</h4>
      <BmsBtn type="main" @click="clickBtn">主要按钮</BmsBtn>
      <BmsBtn type="add" @click="clickBtn"><i class="add-icon"></i>新建按钮</BmsBtn>
      <BmsBtn type="danger" @click="clickBtn">危险按钮</BmsBtn>
      <BmsBtn type="popsUp" @click="clickBtn">弹窗按钮</BmsBtn>
      <BmsBtn type="add" :disabled="defaultDisable">灰色按钮</BmsBtn>
      <div class="icon-btn">
        <BmsBtn type="add" @click="clickBtn"><i class="add-icon"></i></BmsBtn>
      </div>
      <CmSimpleBtn type="main" @click="clickBtn">主要按钮</CmSimpleBtn>
      <CmSimpleBtn type="add" @click="clickBtn">新建按钮</CmSimpleBtn>
      <CmSimpleBtn type="danger" @click="clickBtn">危险按钮</CmSimpleBtn>
      <CmSimpleBtn type="popsUp" @click="clickBtn">弹窗按钮</CmSimpleBtn>
      <CmSimpleBtn type="add" :disabled="defaultDisable">灰色按钮</CmSimpleBtn>
      <Search v-model="value" @on-search="onSearch"></Search>
      <div class="wrapper">
        <Pagination :total="total" :current="current" @to-page="goTo"/>
      </div>
      <div>
        <CmInput v-model="curValue" :correctFlag="correctFlag" :errorFlag="errorFlag" :tipFlag="tipFlag" :tipMessage="tipMessage"
          @blur="onBlur" @keyUp="errorFlag = false" @change="changeInput"></CmInput>
        <CmSelect :list="selectLists" :disabledLi="disabledLi" :selectVal="selectVal" type="system"></CmSelect>
        <CmSelect :list="selectLists" :disabledLi="disabledLi" :selectVal="selectVal" :height="selectHeight" type="popsUp"></CmSelect>
        <CmSelect :list="selectLists" :disabledLi="disabledLi" :selectVal="selectVal" :height="selectHeight" type="popsUp" :scaleWidth="1.5"></CmSelect>
      </div>
      <div><input type="checkbox" @change="!checkedStatus" :checked="checkedStatus">复选框</div>
      <div><input type="checkbox" @change="!checkedStatus" :checked="checkedStatus1">复选框1</div>
      <div>
        <DistPicker
          class="dist-picker"
          @province="selectedProvince"
          @city="selectedCity"
          @area="selectedArea"
          :province="monitorAddress.province"
          :city="monitorAddress.city"
          :area="monitorAddress.area"
        ></DistPicker>
      </div>
      <div class="test-pops" @mouseover="showPopsTip" @mouseout="showPops = false">移上显示pops提示</div>
      <ScrollBar class="scroll-area" v-once :options="settings" @ps-scroll-y="scrollHandler">
        <img src="http://lorempixel.com/800/600/" height="720" width="1280" alt="">
      </ScrollBar>
      <PopsMsg type="common" :showTips="showPops" msg="这是一条普通信息提示" :lefts="lefts" :top="top"></PopsMsg>
      <PopsMsg type="correct" :showTips="showPops" msg="这是一条正确信息提示" :lefts="lefts + 150" :top="top"></PopsMsg>
      <PopsMsg type="alert" :showTips="showPops" msg="这是一条警告信息提示" :lefts="lefts + 300" :top="top"></PopsMsg>
      <PopsMsg type="error" :hasTriangle="hasTriangle" :showTips="showPops" msg="这是一条错误信息提示" :lefts="lefts + 450" :top="top"></PopsMsg>
      <ProMainTable class="pro-table" :cols="cols" :rows="tableData"
      :headSelect="headSelect" :selectList="selectList"
      @select="handleSelect"
      @MainDataChage="MainDataChage"
      style="width: 580px;"
      >
      </ProMainTable>
    </div>
  </div>
</template>
<script>

import _ from 'lodash';
import CmBtn from '@/components/common/CmBtn';
import RectBtn from '@/components/common/RectBtn';
import RadioBtn from '@/components/common/RadioBtn';
import CheckWeek from '@/components/common/CheckWeek';
import { BmsBtn, Search, Pagination, ScrollBar, CmInput, DistPicker, CmSelect, CmSimpleBtn, PopsMsg } from '@/components/basic';
import ProMainTable from '@/components/protocol/ProMainTable';

import tooltip from '@/directive/tooltip';
import '@/assets/css/tooltip.scss';

export default {
  name: 'test-basic',
  components: {
    CmBtn,
    RectBtn,
    RadioBtn,
    CheckWeek,
    BmsBtn,
    Search,
    Pagination,
    ScrollBar,
    CmInput,
    DistPicker,
    CmSelect,
    CmSimpleBtn,
    PopsMsg,
    ProMainTable,
  },
  directives: {
    tooltip,
  },
  methods: {
    showPopsTip(e) {
      const ele = e.target.getBoundingClientRect();
      this.top = ele.top;
      this.lefts = ele.left + ele.width / 2;
      this.showPops = true;
    },
    MainDataChage(data) {
      console.log(data);
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
    changeInput(val) {
      this.curValue = val;
    },
    selectedProvince(data) {
      this.monitorAddress.province = data.value;
    },
    selectedCity(data) {
      this.monitorAddress.city = data.value;
    },
    selectedArea(data) {
      this.monitorAddress.area = data.value;
    },
    onBlur() {
      if (this.curValue === '') this.errorFlag = true;
    },
    scrollHandler(evt) {
      console.log(evt);
    },
    goTo(page) {
      console.log(page);
      this.current = page;
    },
    onSearch(val) {
      console.log(val);
    },
    clickBtn() {
      console.log('点击按钮');
    },
    checkBtn(val) {
      console.log('radio', val);
    },
    changeWeek(val) {
      console.log('check-week', val);
    },
    clickRectBtn(val) {
      console.log('click-btn', val);
    },
  },
  data() {
    return {
      cols: [
        { key: 'select', name: '', type: 'select' },
        { key: 'num', name: '序号', type: 'num', widths: 50 },
        { key: 'protocol_name', type: 'listOne', name: '协议', widths: 200 },
        { key: 'desc', type: 'listTwo', name: '解码字段', widths: 200 },
        { key: 'delete', type: 'delete', name: '操作', widths: 80 },
      ],
      tableData: [
        { protocol_name: '', nowListOne: 1, nowListTwo: 3, listArrOne: [1, 3, 4, 5, 6], listArrTwo: [1, 3, 4, 5, 6], delete: '', desc: '24', selectable: false, editable: false, deleteable: false },
        { protocol_name: '', delete: '', desc: '25', selectable: false, editable: true },
        { protocol_name: '', delete: '', desc: '24' },
        { protocol_name: '', delete: '', desc: '25' },
        { protocol_name: '', delete: '', desc: '24' },
        { protocol_name: '', delete: '', desc: '24' },
        { protocol_name: '', delete: '', desc: '25' },
        { protocol_name: '', delete: '', desc: '24' },
        { protocol_name: '', delete: '', desc: '24' },
        { protocol_name: '', delete: '', desc: '25' },
        { protocol_name: '', delete: '', desc: '24' },
      ],
      defaultDisable: true,
      checkedStatus: true,
      checkedStatus1: false,
      activeWeek: [0, 3],
      value: '',
      total: 7,
      current: 1,
      currentPagesize: 10,
      settings: {
        maxScrollbarLength: 60,
      },
      correctFlag: false,
      errorFlag: false,
      tipFlag: false,
      tipMessage: '角色名称已存在，请重新输入',
      curValue: '',
      monitorAddress: {
        province: '请选择',
      },
      selectLists: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      selectList: [],
      disabledLi: ['b', 'c'],
      selectVal: 'a',
      selectHeight: 100,
      showPops: false,
      hasTriangle: false,
      top: 0,
      lefts: 0,
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
    headSelect() { return this.selectList.length === this.validIndexList.length; },
  },
};
</script>
<style lang="scss" scoped>
.test-basic{
  >div{
    margin: 5px 0;
    input[type="checkbox"]{
      height: 14px;
      vertical-align: middle;
      width: 14px;
      border: 1px solid #278c89;
      border-radius: 3px;
      margin: 0 4px;
      -webkit-appearance: none;
      outline: none;
      cursor: pointer;
      &:checked{
        background: #139d8c url(../../../../assets/common/checked.svg) 1px center;
        background-size: 180% 180%;
        background-position-x: -4.5px;
      }
    }
    .test-pops{
      width: 200px;
      height: 30px;
      box-sizing: border-box;
      border: 1px solid red;
      margin-top: 20px;
      text-align: center;
      line-height: 28px;
    }
  }
  .icon-btn{
    display: inline-block;
    .cm-btn{
      min-width: unset;
      i{
        margin: 0 0 3px 0;
      }
    }
  }
  .tooltip-demo-parent{
    width: 300PX;
    height: 40px;
    border: solid 1px red;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .add-icon{
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    margin: 0 5px 3px 0;
    background: url(../../../../assets/common/add.svg) no-repeat center;
  }
  .wrapper {
    position: relative;
    width: 800px;
    height: 100px;
  }
  .scroll-area {
    position: relative;
    margin: auto;
    width: 360px;
    height: 300px;
  }
  .ps--active-x > .ps__rail-x, .ps--active-y > .ps__rail-y {
    background-color: #070f16;
  }
  .ps__thumb-y, .ps__thumb-x {
    background: #1d5d82;
  }
}
</style>
