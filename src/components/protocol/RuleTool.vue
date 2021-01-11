<template>
  <div class="pre-rule-tool" :style="`margin-left: ${marLeft}px`">
    <div v-if="ifshowPng" class="connect-png">
      <RuleLine 
      :ProData="ProData"
      ref="rLs"
      />
    </div>
    <div class="fisrt-rule rule-all" :style="`width: ${toolWidth}px;`"  @mouseover="checkName" 
      @mouseout="showNameFlag = false">
      <!-- <select 
      v-if="ifSelect"
      name="fisrt-rule"
      id="fisrt-rule"
      class="select-all" 
      v-model="idName"
      @change="firstDataChange"
      >
          <option v-for="(item, index) in optionData" :value="item" :key="index">{{ item }}</option>
      </select> -->
      <CmSelect
      id="fisrt-rule"
      ref="firstSelet"
      v-if="ifSelect" class="selsct-sec select-all" :list="optionData" :selectVal="idName" @on-click="clickEvent" @on-change="firstDataChange" type="popsUp"></CmSelect>
      <span v-else class="second-rule">{{ preRuleName }}</span>
      <span v-if="ifDelete && ifDedail" class="delete-bnt" @click="deleteTool(ProData)"></span>
      <span class="opt-bnt" @click="popupOut($event, ProData)"></span>
      <div class="blue-bo"></div>
      <ShowNameBox 
      :showTips = "showNameFlag"
      :showName = "showTipsName"
      :lefts = "tipsLeft"
      :top = "tipsTop"
      style="width: 180px;text-align: center;left: 18px;top: -23px;"
    ></ShowNameBox>
    </div>
    <CmTip v-show="delTipFlag" :tipTitle="tipTitle" :tipContent="tipContent" :closeFn="closeFn" :showFooter="showFooter" @on-confirm="clickSelet" ></CmTip>
    
  </div>
</template>

<script>

import { mapState } from 'vuex';
import { CmSelect, CmTip } from '@/components/basic';
import ShowNameBox from '@/components/manageApp/main/ShowNameBox';
import RuleLine from './RuleLine';


export default{
  name: 'rule-tool',
  components: { RuleLine, CmSelect, CmTip, ShowNameBox },
  props: {
    ifshowPng: {
      default: false,
      type: Boolean,
    },
    ifSelect: {
      default: false,
      type: Boolean,
    },
    ifDelete: {
      default: false,
      type: Boolean,
    },
    ifDedail: {
      default: true,
      type: Boolean,
    },
    preRuleName: {
      default: '',
      type: String,
    },
    toolWidth: {
      default: 276,
      type: Number,
    },
    marLeft: {
      default: 76,
      type: Number,
    },
    ProData: {
      default: {},
      type: Object,
    },
  },
  data() {
    return {
      numL: 0,
      delTipFlag: false,
      tipTitle: '提示',
      tipContent: '确认删除该解码规则？',
      showFooter: true,
      dataDelete: [],
      deleteType: 'main',
      changeName: '',
      changeAFter: '',
      tipsLeft: 10,
      tipsTop: 0,
      showNameFlag: false, // 提示框
      showTipsName: 'tishi111',
      confimType: 'firstS',
    };
  },
  created() {
    this.idName = this.ProData['@id'];
  },
  methods: {
    closeFn() {
      this.delTipFlag = false;
      this.idName = this.changeAFter;
    },
    deleteTool(preData) {
      // 弹框
      this.deleteType = 'pre';
      this.delTipFlag = true;
      this.dataDelete = preData;
      this.confimType = 'other';
    },
    clickSelet() {
      this.delTipFlag = false;
      if (this.confimType === 'firstS') {
        const dom = this.$refs.firstSelet;
        const uiDom = dom.$el.children[0].nextElementSibling;
        const timer = setTimeout(() => {
          clearTimeout(timer);
          uiDom.style.display = 'block';
        }, 100);
      } else {
        this.deleteItem();
      }
    },
    deleteItem() {
      if (this.deleteType === 'main') {
        this.idName = this.changeName;
        this.$store.dispatch('initRule', this.idName);
      } else {
        this.$emit('deleteOne');
        this.$store.dispatch('deleteTool', this.dataDelete);
      }
      this.delTipFlag = false;
    },
    clickEvent() {
      this.changeAFter = this.idName;
      this.delTipFlag = true;
      this.tipContent = '更换此次协议会导致下层协议出现变动, 是否继续?';
    },
    firstDataChange(val) {
      const _this = this;
      console.log(val);
      this.changeName = val;
      const dom = this.$refs.firstSelet;
      const uiDom = dom.$el.children[0].nextElementSibling;
      const timer = setTimeout(() => {
        clearTimeout(timer);
        uiDom.style.display = 'none';
        _this.deleteItem();
      }, 100);
      console.log(dom, uiDom);
    },
    popupOut(e, whickTool) {
      const ele = e.target;
      const suprtEle = ele.parentNode;
      const thEle = suprtEle.parentNode;
      const AllLeft = ele.offsetLeft + suprtEle.offsetLeft + thEle.offsetLeft + 20;
      const AllTop = ele.offsetTop + suprtEle.offsetTop + thEle.offsetTop + 25;
      this.$emit('RulepopupOut', AllLeft, AllTop, whickTool);
    },
    checkName(e) {
      if (e.target.localName === 'input') {
        const ele = e.target;
        if (ele.clientWidth !== ele.scrollWidth) {
          this.showNameFlag = true;
          this.showTipsName = ele.value;
        } else {
          // this.showNameFlag = false;
        }
      }
    },
  },
  computed: {
    ...mapState({
      optionData: state => state.dataSelet.protocol_list,
    }),
    deleteFn() {
      const ifDeleteT = this.ProData.classDp > this.numL;
      this.numL = this.ProData.classDp;
      return (ifDeleteT && this.ifDelete);
    },
  },
  watch: {
    ProData() {
      console.log(this.$rLs);
    },
  },
};
</script>


<style lang="scss" scoped>
  .all-rule-show{
    position: relative;
    box-sizing: border-box;
    .pre-rule-tool{
      position: relative;
      width: 420px;
      height: 70px;
      margin: 0 0 0 46px;
      .connect-png{
        float: left;
        width: 102px;
        height: 80px;
        position: relative;
        background: url(../../assets/protocol/protoLine.png) no-repeat;
        background-size: contain;
        margin-top: -20px;
      }
      .rule-all{
        background: #102c44;
        border: 1px #457695 solid;
        border-radius: 3px;
        height: 46px;
      }
      .fisrt-rule{
        float: left;
        position: relative;
        margin-top: 24px;
        z-index: 100;
        .second-rule{
          font-size: 14px;
          max-width: 125px;
          height: 100%;
          text-overflow: ellipsis;
          float: left;
          white-space: nowrap;
          overflow: hidden;
          line-height: 40px;
          margin-left: 20px;
        }
      }
      .select-all{
        box-sizing: border-box;
        width: 200px;
        height: 26px;
        margin: 7px 10px 0 19px;
        border-radius: 3px;
        cursor: pointer;
      }
      .opt-bnt{
        cursor: pointer;
        float: right;
        height: 25px;
        width: 25px;
        margin: 10px;
        background: url(../../assets/protocol/pro-mune.svg);
      }
      .delete-bnt{
        cursor: pointer;
        float: right;
        height: 25px;
        width: 25px;
        margin: 10px 10px 10px 0;
        background: url(../../assets/protocol/pro-delete.svg);
      }
      .blue-bo{
        width: 46px;
        height: 4px;
        background: #2184c2;
        position: absolute;
        left: 0;
        right: 0;
        bottom: -2px;
        margin: auto;
      }
    }
  }
</style>