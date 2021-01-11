<template>
  <div id="alert-wrap" v-if="isShow">
    <!-- 添加下层协议组件，需要props:isShow控制显示，当点击关闭或取消时，emit：showValue向父组件发送消息 -->
    <div id="alert-demo">
        <div class="header">
            <p>添加下层协议</p>
            <svg @click="close" width="10" height="10" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="0" x2="10" y2="10" style="stroke:rgb(255,255,255);stroke-width:2"/>
                <line x1="10" y1="0" x2="0" y2="10" style="stroke:rgb(255,255,255);stroke-width:2"/>
            </svg>
        </div>
        <div class="content">
            <div class="setting-condition">
                <p>设置条件</p>

                <div class="check-box-1">
                    <input name="settings" type="radio" value="no" v-model="radioValue"/>
                </div>
                <span>否</span>

                <div class="check-box-2">
                    <input name="settings" type="radio" value="yes" checked v-model="radioValue"/>
                </div>
                <span>是</span>
            </div>
            <div class="wrap">
                <ScrollBar class="box" v-if="radioValue=='yes'">
                  <div v-for="(items,indexs) in tolteDiv" :key="`f-${indexs}`">
                    <div class="box-header">
                        <input type="text"
                        v-model="items['@key']"/>
                        <span>类型</span>
                        <CmSelect class="selsct-sec"
                        :list="javeType" :selectVal="items['@type']" @on-change="(val) => { items['@type'] = val }" type="popsUp"></CmSelect>
                        <button class="button-1" @click="addPreData" :class="{'visibC':indexs === tolteDiv.length - 1 }">添加</button>
                        <button class="button-2" @click="clearTableDatas(indexs)" :style="{'visibility': tolteDiv.length === 1 ? 'hidden' : 'visible'}">删除</button>
                    </div>
                    <div class="box-table">

                        <div class="add-column" v-for="(item,index) in items.tabVa" :key="`z-${index}`">
                            <input type="text" v-model="item[0]"
                            />
                            <span>下层解码协议</span>
                            <CmSelect :key="index" class="selsct-sec" :list="optionData" :selectVal="item[1]" @on-change="(val) => { item[1] = val }" type="popsUp"></CmSelect>
                            <BmsBtn class="preZ-add" @click="addTableData(items, indexs)">+</BmsBtn>
                            <div v-show="index !== items.tabVa.length - 1" class="svg" @click="delTableData(indexs, index)">
                                <svg width="25" height="25" id="导航栏图标" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>删除</title><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#bd4630;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#c74630;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                            </div>
                        </div>

                    </div>
                  </div>
                </ScrollBar>
                <div class="box-2" v-if="radioValue=='no'">
                  <div class="box-2-wrap">
                    <span>设置下层协议</span>
                    <!-- <select name="" id="" v-model="couponSelected" @change="getCouponSelected">
                        <option v-for="(item, index) in optionData" :value="item" :key="index">{{ item }}</option>
                    </select> -->
                  <CmSelect class="selsct-sec" :list="optionData" :selectVal="couponSelectedNo" @on-change="getCouponSelectedNo" type="popsUp"></CmSelect>
                  </div>
                </div>
                <hr class="hr"/>
                <div class="save-or-cancel">
                    <button class="button-1" @click="save">保存</button>
                    <button class="button-2" @click="close">取消</button>
                </div>
            </div>
        </div>
    </div>
      <div class="alert-bc" v-if="isShow">
      </div>
    <CmTip v-show="delTipFlag" :tipContent="tipContent" :closeFn="() => delTipFlag = false" :showFooter="showFooter"></CmTip>
    </div>
</template>
<script>

import _ from 'lodash';
import { mapState } from 'vuex';
import { CmSelect, CmTip, BmsBtn } from '@/components/basic';
import ScrollBar from '@/components/common/ScrollBar';
import { validateProtocolData } from '@/helpers/configValidate';
import undefined from '../../pages/protocol/utils';

export default {
  components: { ScrollBar, CmSelect, CmTip, BmsBtn },
  data() {
    return {
      commitAll: {},
      delTipFlag: false,
      nameTitle: '协议解码规则',
      tipContent: '请填写完整',
      checkoutAas: true,
      showFooter: false,
      radioValue: 'yes',
      couponSelectedNo: '',
      couponSelectedYesTop: '',
      yesInput: '',
      ifP: false,
      allLastArr: [],
      tableValues: [], // 展示列表信息
      tolteDiv: [],
      javeType: ['Integer', 'Long', 'Short', 'Byte', 'Character', 'Double', 'Float', 'Boolean', 'BigInteger', 'BigDecmail', 'String'],
      property: { // shifou
        attribute: [
          {
            '@key': '',
            '@value': '',
            '@type': '',
          },
        ],
      },
      recordField: {
        '@allItem': 'false',
        '@template': 'xpath',
        field: [],
      },
      hasHandle: {}, // 设置条件为是
    };
  },
  props: {
    isShow: {
      default: false,
    },
    dataT: {
      default: {},
      type: Object,
    },
  },
  methods: {
    addTableData(itemD, inds) {
      const ifAdd = itemD['@type'] !== 'Boolean';
      const spaceArr = [];
      _.forEach(this.tolteDiv, (item, index) => {
        if (index === inds && ifAdd) {
          item.tabVa.push(['', 'ABOC NET ESSENTIA']);
        }
      });
      this.tolteDiv = spaceArr.concat(this.tolteDiv);
    },
    addPreData() {
      const attribute = {};
      attribute['@key'] = '';
      attribute['@value'] = '';
      attribute['@type'] = 'Boolean';
      attribute.tabVa = [['', '']];
      this.tolteDiv.push(attribute);
    },
    clearTableDatas(index) {
      this.tolteDiv.splice(index, 1);
      // this.tableValues = [];
    },
    delTableData(inds, ind) {
      _.forEach(this.tolteDiv, (item, index) => {
        if (index === inds) {
          item.tabVa.splice(ind + 1, 1);
        }
      });
    },
    one(arr) {
      return `${arr[0]}=${arr[1]}`;
    },
    keyInput() {
    },
    getTableData(datas) {
      console.log(datas);
      // datas['@value'] = this.tableValues.map(this.one).join(',');
    },
    save() {
      this.checkoutAas = true;
      const propertys = {};
      propertys.attribute = [];
      _.forEach(this.tolteDiv, (item) => {
        const itemV = _.cloneDeep(item);
        if (item.tabVa !== undefined) itemV['@value'] = item.tabVa.map(this.one).join(',');
        const dataAdd = itemV;
        if (this.radioValue === 'yes') {
          for (const a in dataAdd) {
            if (a === '@value') {
              const toolPreArrs = dataAdd['@value'].split(',');
              if (toolPreArrs !== undefined) {
                this.toolPreFn(toolPreArrs);
              } else {
                this.checkoutAas = false;
              }
            } else if (a === '@type') {
              const typeData = dataAdd['@type'];
              const preCheckType = validateProtocolData(typeData);
              if (!preCheckType.bool) {
                this.tipContent = preCheckType.tip;
                this.checkoutAas = false;
              }
            } else if (a === '@key') {
              const keyData = dataAdd['@key'];
              const preCheck = validateProtocolData(keyData);
              if (!preCheck.bool) {
                this.tipContent = preCheck.tip;
                this.checkoutAas = false;
              }
            }
          }
        }
        delete itemV.tabVa;
        if (this.checkoutAas) {
          this.dataAddFn(itemV);
          if (this.radioValue === 'yes') {
            propertys.attribute.push(itemV);
            this.commitAll.property = propertys;
          }
        }
      });
      if (this.checkoutAas) {
        this.$emit('showValue');
        this.$store.dispatch('addTool', this.commitAll);
      } else {
        // tankuang
        this.delTipFlag = true;
      }
      // this.$emit('showValue', checkoutAas);
    },
    toolPreFn(toolPreArrs) {
      toolPreArrs.forEach((item) => {
        const toolPreArr = item.split('=');
        if (toolPreArr.length > 1) {
          const oneCheck = validateProtocolData(toolPreArr[0]);
          if (!oneCheck.bool) this.checkoutAas = false;
        } else this.checkoutAas = false;
      });
    },
    dataAddFn(dataX) {
      this.commitAll = {};
      this.recordField.field = [];
      this.commitAll.id = this.dataT['@id'];
      if (this.radioValue === 'yes') { // important 规则下层计算
        const allLastTool = dataX['@value'].split(',');
        // const yesInputValue = this.yesInput; // pro
        // const yesSelsctValue = this.couponSelectedYesTop;
        // this.property.attribute[0]['@key'] = yesInputValue;
        // this.property.attribute[0]['@type'] = yesSelsctValue;
        allLastTool.forEach((item) => {
          const preObj = {};
          const toolPreArr = item.split('=');
          preObj['@id'] = toolPreArr[1];
          preObj['@baseProtocol'] = this.dataT['@id'];
          preObj.recordField = this.recordField;
          this.allLastArr.push(preObj);
        });
        this.commitAll.preObj = this.allLastArr;
      } else {
        const preObj = {};
        preObj['@id'] = this.couponSelectedNo;
        preObj['@baseProtocol'] = this.dataT['@id'];
        preObj.recordField = this.recordField;
        this.commitAll.preObj = preObj;
      }
    },
    close() {
      this.$emit('showValue');
    },
    dataStrToArr() {

    },
    getCouponSelectedTop(val) {
      this.couponSelectedYesTop = val;
    },
    getCouponSelectedNo(val) {
      this.couponSelectedNo = val;
    },
  },
  created() {
    this.couponSelectedNo = this.optionData[0];
    this.couponSelectedYesTop = this.optionData[0];
  },
  computed: {
    ...mapState({
      proTool: state => state.protocolData['dp.xml'],
      optionData: state => state.dataSelet.protocol_list,
    }),
  },
  watch: {
    tableValues(a) {
      console.log(a);
    },
    tolteDiv(a) {
      console.log(a);
    },
    checkoutAas(a) {
      console.log(a);
    },
    radioValue() {
      if (this.ifP) {
        this.couponSelectedNo = 'ABOC NET ESSENTIAL';
        this.couponSelectedYesTop = 'Boolean';
        // this.yesInput = '';
      }
      this.ifP = true;
    },
    isShow() {
      this.tolteDiv = [];
      this.allLastArr = [];
      const lastData = _.filter(this.proTool, e => e['@baseProtocol'] === this.dataT['@id']);
      this.couponSelectedNo = lastData[0] === undefined ? 'ABOC NET ESSENTIA' : lastData[0]['@id'];
      this.dataStrToArr();
      if (this.dataT.property !== undefined) {
        let norData = [];
        if (!(this.dataT.property.attribute instanceof Array)) {
          norData.push(this.dataT.property.attribute);
          // 增加多个
        } else norData = this.dataT.property.attribute;
        this.tolteDiv = norData;
        _.forEach(norData, (item, index) => {
          const itemVd = _.cloneDeep(item);
          const Arr = norData[index]['@value'].split(',');
          const newArr = [];
          Arr.forEach((items) => {
            const preNewArr = items.split('=');
            newArr.push(preNewArr);
          });
          itemVd.tabVa = newArr;
          this.tolteDiv[index] = itemVd;
        });
        // this.couponSelectedYesTop = norData[0]['@type'];
        // this.yesInput = norData[0]['@key'];
        const Arr = norData[0]['@value'].split(',');
        const newArr = [];
        Arr.forEach((item) => {
          const preNewArr = item.split('=');
          newArr.push(preNewArr);
        });
        // 增加多个
        this.radioValue = 'yes';
        this.hasHandle = this.dataT.property.attribute[0];
      } else {
        this.tolteDiv = [];
        const attribute = {};
        attribute['@key'] = '';
        attribute['@value'] = '';
        attribute['@type'] = 'Boolean';
        attribute.tabVa = [['', '']];
        this.tolteDiv.push(attribute);
        this.ifP = false;
        this.radioValue = 'no';
        this.tableValues = [['', '']];
      }
    },
  },
};
</script>
<style scoped lang="scss">
  .selsct-sec{
    margin: 8px;
  }
  input.error-input,select.error-input,.error-input{
    border: 1px solid red!important;
  }
  #alert-wrap{
      width: 100%;
      height: 100%;
      background: transparent;
      position: absolute;
      z-index: 1001;
  }
  .alert-bc{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #000000;
    opacity: 0.6;
  }
  #alert-demo{
      position: absolute;
      width: 627px;
      height: 460px;
      background-color: #183149;
      z-index: 999;
      left:0;right:0;
      top:0;bottom:65px;
      margin:auto;
      .header{
          height: 30px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          svg{
              margin-right: 15px;
              cursor: pointer;
          }
          p{
              margin: 0;
              padding: 0;
              margin-left: 20px;
              line-height: 30px;
          }
      }
      .content{
          width: 100%;
          height: 430px;
          border:1px solid #183149;
          background-color: #081a29;
          .setting-condition{
              display:flex;
              margin-left: 20px;
              margin-top: 20px;
              span{
                  margin-left: 5px;
              }
              .check-box-1{
                  margin-left: 55px;
                  
              }
              .check-box-2{
                  margin-left:70px;
              }
          }
          .box{
              width:585px;
              height:295px;
              box-sizing: border-box;
              border:1px solid #183149;
              margin-left: 20px;
              margin-top: 10px;
              overflow: hidden;
              .box-header{
                  display:flex;
                  width: 100%;
                  height: 45px;
                  border-bottom: 1px solid #183149;
                  box-sizing: border-box;
                  input{
                    width: 135px;
                    height: 28px;
                    margin-top: 7px;
                    border-radius: 3px;
                    border: 1px solid #183149;
                    background-color: #081a29;
                    margin-left: 20px;
                    padding: 0 10px;
                  }
                  span{
                      line-height: 45px;
                      margin:0 10px;
                      width: 35px;
                  }
                  select{
                      width:135px;
                      height: 25px;
                      margin-top: 10px;
                      border-radius: 3px;
                      border:1px solid #183149;
                      background-color: #081a29;
                      padding:0 10px;
                  }
                  .visibC{
                    visibility: visible !important;
                  }
                  .button-1{
                      width: 60px;
                      height: 30px;
                      border: 0;
                      background-color: #0ea4c3;
                      border-radius: 3px;
                      margin-top: 10px;
                      margin-left: 41px;
                      margin-right: 10px;
                      visibility: hidden;
                  }
                  .button-2{
                      width: 75px;
                      height: 30px;
                      border: 0;
                      background-color: #d04631;
                      border-radius: 3px;
                      margin-top: 10px;
                      margin-right: 20px;
                  }
              }
              .box-table{
                  // overflow-y: scroll;
                  height: 100%;
                  .add-column{
                      height: 45px;
                      display:flex;
                      border-bottom: 1px solid #183149;
                      box-sizing: border-box;
                      .preZ-add{
                        min-width: 40px;
                        height: 30px;
                        margin-top: 7px;
                      }
                      input{
                          width:135px;
                          height: 25px;
                          margin-top: 10px;
                          border-radius: 3px;
                          border:1px solid #183149;
                          background-color: #081a29;
                          margin-left: 20px;
                          padding:0 10px;
                      }
                      span{
                          line-height: 45px;
                          margin:0 10px;
                      }
                      select{
                          width:135px;
                          height: 25px;
                          margin-top: 10px;
                          border-radius: 3px;
                          border:1px solid #183149;
                          background-color: #081a29;
                          padding:0 10px;
                      }
                      .svg{
                          margin-top:10px;
                          margin-left:10px;
                          cursor: pointer;
                      }
                  }
              }
          }
          .box-2{
            width:585px;
            height:295px;
            box-sizing: border-box;
            margin-left: 20px;
            margin-top: 10px;
            .box-2-wrap{
              select{
                  width:200px;
                  height: 25px;
                  border-radius: 3px;
                  border:1px solid #183149;
                  background-color: #081a29;
                  padding:0 10px;
                  margin-left:20px;
              }
            }
          }
          .hr{
              margin-top: 10px;
              margin-bottom: 0;
              border-top: 1px solid #0e2437;
          }
          .save-or-cancel{
              width: 145px;
              margin: 15px auto;
              .button-1{
                  width: 60px;
                  height:30px;
                  border-radius: 3px;
                  background-color: #0ea4c3;
                  border: 0;
              }
              .button-2{
                  width: 60px;
                  height:30px;
                  border-radius: 3px;
                  background-color: #081a29;
                  border: 1px solid #0ea4c3;
                  margin-left: 20px;
              }
          }
      }
  }
</style>