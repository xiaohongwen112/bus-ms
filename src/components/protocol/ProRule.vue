<template>
  <div class="pro-rule">
    <div class="all-rule-show">
      <ul v-if="popupOut" class="popup-opt" :style="`top: ${poTop}px; left: ${poLeft}px`">
        <li @click="configDecode">配置解码字段</li>
        <li @click="thisproAttr">本层协议属性</li>
        <li @click="LowproAttr">下层协议属性</li>
      </ul>
      <RuleTool v-for="(item, index) in handleArr" :key="item.key" 
      :ifshowPng="index !==  0" 
      :marLeft="marginCom(item.classDp)"
      :preRuleName="item['@id']"
      :ifSelect="index ===  0"  
      :toolWidth="index === 0 ? 276 : index === handleArr.length - 1 ? 228 : 196" 
      :ifDelete ="index === 0 ? false : index === handleArr.length - 1 ? true : false"
      :ifDedail = ifRuleDedail
      :ProData="item"
      @RulepopupOut="RulepopupOut"
      @deleteOne="deleteOne"
      ref="rule"/>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex';
import _ from 'lodash';
import RuleTool from './RuleTool';
import ProRuleAlert from './ProRuleAlert';


export default{
  components: { RuleTool, ProRuleAlert },
  data() {
    return {
      popupOut: false, // 操作弹框
      poLeft: 0,
      poTop: 0,
      classDp: 1,
      baseDp: 1,
      toolW: 174,
      lineNum: 0,
      toolLeft: 200,
      toolClick: 0, // 点击节点
      dpAllArr: [],
      allDPArr: [],
      sameArr: [],
      neObj: {},
      ruleDataPupop: {},
    };
  },
  props: {
    ifRuleDedail: {
      default: true,
      type: Boolean,
    },
  },
  methods: {
    deleteOne() {
      this.popupOut = false;
    },
    creatTool() { // 找到基层传递到下层
      this.allDPArr = [];
      this.classDp = 1;
      this.baseDp = 1;
      this.lineNum = 0;
      _.forEach(this.dpAllArr, (item) => {
        if (item['@baseProtocol'] === 'tcp') {
          let baseDp = {};
          baseDp.key = 1;
          this.lineNum = this.lineNum + 1;
          baseDp.classDp = this.classDp;
          baseDp.lineNum = this.lineNum;
          baseDp = Object.assign(item, baseDp);
          const fatherN = this.lineNum;
          this.allDPArr.push(baseDp);
          const proId = item['@id'];
          this.setPosition(proId, fatherN);
        }
      });
    },
    setPosition(proId, fatherN) { // 形成树
      _.forEach(this.dpAllArr, (item) => {
        if (item['@baseProtocol'] === proId) {
          this.lineNum = this.lineNum + 1;
          if (this.sameArr.indexOf(proId) === -1) {
            this.classDp = this.classDp + 1;
          } else {
            this.classDp = this.neObj[proId];
          }
          this.baseDp = this.baseDp + 1;
          let baseDp = {};
          baseDp.key = this.baseDp;
          baseDp.classDp = this.classDp;
          baseDp.lineNum = this.lineNum;
          baseDp.parentNum = fatherN;
          baseDp = Object.assign(item, baseDp);
          this.allDPArr.push(baseDp);
          const proIds = item['@id'];
          // const delArr = newArr.filter(items => items['@baseProtocol'].match(reg));
          this.dpAllArr = _.filter(this.dpAllArr, items => items['@baseProtocol'] !== proId);
          const fatherNs = this.lineNum;
          this.setPosition(proIds, fatherNs);
          this.allDPArr = _.uniqWith(this.allDPArr, _.isEqual);
          this.neObj[proId] = baseDp.classDp;
          this.sameArr.push(proId);
        }
      });
    },
    configDecode() {
      this.popupOut = false;
      this.$emit('changeRuleStr', this.ruleDataPupop);
    },
    thisproAttr() {
      this.popupOut = false;
      this.$emit('changeThisAlert', this.ruleDataPupop);
    },
    LowproAttr() {
      this.popupOut = false;
      this.$emit('changeRuleAlert', this.ruleDataPupop);
    },
    RulepopupOut(poLeft, poTop, whichTool) {
      this.ruleDataPupop = whichTool;
      this.popupOut = !this.popupOut;
      this.poLeft = poLeft;
      this.poTop = poTop;
    },
    marginCom(whickClass) {
      switch (whickClass) {
        case 1:
          return 40;
        case 2:
          return this.toolW;
        case 3:
          return this.toolW + this.toolLeft;
        case 4:
          return this.toolW + this.toolLeft * 2;
        case 5:
          return this.toolW + this.toolLeft * 3;
        case 6:
          return this.toolW + this.toolLeft * 4;
        case 7:
          return this.toolW + this.toolLeft * 5;
        case 8:
          return this.toolW + this.toolLeft * 6;
        case 9:
          return this.toolW + this.toolLeft * 7;
        default:
          return this.toolW + this.toolLeft * 8;
      }
    },
  },
  mounted() {
    this.dpAllArr = _.cloneDeep(this.prRuleData);
    this.creatTool();
  },
  watch: {
    prRuleData(a) {
      console.log(a);
      this.dpAllArr = _.cloneDeep(this.prRuleData);
      this.creatTool();
    },
  },
  computed: {
    ...mapState({
      prRuleData: state => state.protocolData['dp.xml'],
    }),
    handleArr() {
      let toolArr = [];
      if (this.allDPArr.length > 1 && this.allDPArr[0].key === this.allDPArr[1].key) this.allDPArr.shift();
      _.forEach(this.allDPArr, (item, index) => {
        console.log(item, index);
        if (item.length > 1) { // 同层数据
          _.forEach(item, (itemS, indexS) => {
            console.log(itemS, indexS);
            toolArr.push(itemS);
          });
        } else { // 层级关系
          toolArr.push(item);
        }
      });
      toolArr = _.uniqWith(toolArr, _.isEqual);
      return toolArr;
    },
  },
};
</script>


<style lang="scss" scoped>
.pro-rule{
  height: 406px;
  background: #0a1925;
  border: 1px solid #0f3f62;
  overflow: auto;
  .all-rule-show{
    position: relative;
    box-sizing: border-box;
    ul.popup-opt{
      position: absolute;
      background: #1f3c55;
      width: 140px;
      left: 256px;
      z-index: 101;
      top: 59px;
      font-size: 12px;
      >li{
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        padding-left: 10px;
        &:hover{
          background: #3c6895;
        }
      }
    }
  }
}
</style>