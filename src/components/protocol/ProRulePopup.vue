<template>
  <div id="alert-str-wrap" v-if="isShow">
    <!-- 添加下层协议组件，需要props:isShow控制显示，当点击关闭或取消时，emit：showValue向父组件发送消息 -->
    <div id="alert-str">
        <div class="header">
            <p>配置解码字段</p>
            <svg @click="close" width="10" height="10" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="0" x2="10" y2="10" style="stroke:rgb(255,255,255);stroke-width:2"/>
                <line x1="10" y1="0" x2="0" y2="10" style="stroke:rgb(255,255,255);stroke-width:2"/>
            </svg>
        </div>
        <div class="content">
          <header class="header">
            <div>
              <BmsBtn type="add" @click="addData()"><i class="add-icon"></i>新建</BmsBtn>
              <BmsBtn type="danger" :disabled="canAllDelete" @click="deleteProtocols">删除</BmsBtn>
            </div>
          </header>
          <ProMainTable class="pro-table" :cols="cols" :rows="TpyeData"
          :selectList="selectList" :headSelect="headSelect"
          @select="handleSelect"
          @MainDataChage="MainDataChage"
          ref="inputDom"
          >
          </ProMainTable>
          <div class="opt-bnt">
            <BmsBtn style="margin-left:245px" type="popsUp" @click="save">保存</BmsBtn>
            <CmSimpleBtn style="margin-left:10px" type="popsUp" @click="close">取消</CmSimpleBtn>
          </div>
        </div>
    </div>
      <div class="alert-bc" v-if="isShow">
      </div>
      <CmTip v-show="delTipFlag" :tipContent="tipContent" :closeFn="() => delTipFlag = false" :showFooter="showFooter" @on-confirm="deleteItem"></CmTip>
    </div>
</template>
<script>

import { validateProtocolDecode } from '@/helpers/configValidate';
import _ from 'lodash';
import { mapState } from 'vuex';
import ScrollBar from '@/components/common/ScrollBar';
import { BmsBtn, CmSimpleBtn, CmTip } from '@/components/basic/index';
import ProMainTable from './ProMainTable';

export default {
  components: { ScrollBar, ProMainTable, BmsBtn, CmSimpleBtn, CmTip },
  data() {
    return {
      totilNum: 0,
      rememberT: true,
      rememberArr: [],
      changeType: false,
      showFooter: false,
      delTipFlag: false,
      nameTitle: '协议解码规则',
      nameTitleT: '解码字段',
      tipContent: '请配置信息',
      radioValue: 'yes',
      tableValues: [], // 展示列表信息
      changeInputData: [],
      property: { // shifou
        attribute: [
          {
            '@key': '',
            '@value': '',
            '@type': '',
          },
        ],
      },
      hasHandle: {}, // 设置条件为是
      cols: [
        { key: 'select', name: '', type: 'select', widths: 42 },
        { key: 'protocol_name', name: '原始字段', widths: 300 },
        { key: 'desc', name: '解码字段', widths: 220 },
      ],
      tableData: [
        { protocol_name: '张茉莉', desc: '24', selectable: false, editable: false, deleteable: false },
        { protocol_name: '赵四', desc: '25', selectable: false, editable: true },
      ],
      preSpace: { '#text': '', '@item': '' },
      selectList: [],
      addDataf: false,
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
    addData() {
      this.addDataf = true;
      const Preobj = {};
      Preobj.data = _.cloneDeep(this.preSpace);
      Preobj.id = this.dataT['@id'];
      this.dataT.recordField.field.push(this.preSpace);
      this.$store.dispatch('addProDecode', Preobj);
      setTimeout(() => {
        this.focus();
      }, 100);
    },
    deleteProtocols() {
      this.addDataf = false;
      this.delTipFlag = true;
      this.showFooter = true;
      this.tipContent = '是否删除该解码配置';
    },
    deleteItem() {
      const DeaArr = [];
      const DataLen = this.changeInputData.length;
      const fun = Array.from(new Array(DataLen).keys());
      this.selectList.forEach((x) => {
        fun.splice(fun.findIndex(v => v === x), 1);
      });
      fun.forEach((x) => {
        DeaArr.push(this.changeInputData[x]);
      });
      this.changeInputData = _.cloneDeep(DeaArr);
      this.selectList = [];
      const stroeObj = {};
      stroeObj.id = this.dataT['@id'];
      stroeObj.recordField = this.changeInputData;
      this.$store.dispatch('proDecode', stroeObj);
      this.delTipFlag = false;
    },
    save() {
      let check = true;
      console.log(this.changeInputData);
      _.forEach(this.changeInputData, (item) => {
        const firstInput = validateProtocolDecode(item['@item']);
        const secInput = validateProtocolDecode(item['#text']);
        console.log(item, firstInput, secInput);
        if (!firstInput.bool || !secInput.bool) {
          if (!firstInput.bool) this.tipContent = firstInput.tip;
          else this.tipContent = secInput.tip;
          check = false;
        }
      });
      if (!check) {
        this.delTipFlag = true;
        this.showFooter = false;
      } else {
        const stroeObj = {};
        stroeObj.id = this.dataT['@id'];
        stroeObj.recordField = this.changeInputData;
        const newListArr = [];
        _.forEach(this.selectList, (item) => {
          newListArr.push(this.changeInputData[item - 19]);
        });
        this.$store.dispatch('proDecode', stroeObj);
        this.$store.dispatch('decodeList', stroeObj.recordField);
        // this.$store.dispatch('reDecodeList', stroeObj.recordField);
        this.$emit('closeValue');
      }
    },
    close() {
      const stroeObj = {};
      stroeObj.id = this.dataT['@id'];
      stroeObj.recordField = this.rememberArr;
      this.$store.dispatch('proDecode', stroeObj);
      this.$emit('closeValue');
      this.handleSelect({ index: -1, checked: false });
    },
    dataStrToArr() {
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
    MainDataChage(data) {
      const changeArr = [];
      const id = this.dataT['@id'];
      _.forEach(this.dataT.recordField.field, (item, index) => {
        const preObj = _.cloneDeep(item);
        if (index === data.index) {
          preObj['@item'] = data.first;
          preObj['#text'] = data.sec;
          preObj.id = id;
          preObj.index = index;
          this.$store.dispatch('updateProDecode', preObj);
        }
        changeArr.push(preObj);
      });
      this.changeInputData = _.cloneDeep(changeArr);
      console.log(this.dataT.recordField.field);
      this.changeType = false;
    },
    focus() {
      const ele = this.$refs.inputDom;
      console.log(ele, this.totilNum);
      if (ele !== undefined) {
        const eleDom = ele.$el.children[1].children[0].children[this.totilNum - 1];
        eleDom.children[1].click();
        setTimeout(() => {
          eleDom.children[0].children[0].focus();
        }, 100);
      }
    },
  },
  computed: {
    TpyeData() {
      this.changeType = true;
      const TpyeDataArr = [];
      let dataArr = [];
      const vueXdata = this.$store.state.protocolData['dp.xml'];
      _.forEach(vueXdata, (item) => {
        let neArr = [];
        if (!(item.recordField.field instanceof Array)) {
          const Arr = [];
          Arr.push(item.recordField.field);
          neArr = _.cloneDeep(Arr);
        } else neArr = item.recordField.field;
        if (item['@id'] === this.dataT['@id']) dataArr = neArr;
      });
      // this.changeInputData = _.cloneDeep(this.dataT.recordField.field);
      // if (this.changeInputData.length === 0 || this.addDataf) {
      //   this.changeInputData = _.cloneDeep(dataArr);
      // }
      this.changeInputData = _.cloneDeep(dataArr);
      this.totilNum = this.changeInputData.length;
      if (this.rememberT) this.rememberArr = _.cloneDeep(dataArr);
      const InputData = this.changeInputData;
      _.forEach(InputData, (item) => {
        const TpyeDataObj = {};
        TpyeDataObj.protocol_name = item['@item'];
        TpyeDataObj.desc = item['#text'];
        TpyeDataArr.push(TpyeDataObj);
      });
      this.rememberT = false;
      this.addDataf = false;
      const ArtArr = TpyeDataArr;
      this.tableData = ArtArr;
      return ArtArr;
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
    headSelect() {
      return this.selectList.length === this.validIndexList.length && this.selectList.length !== 0;
    },
    ...mapState({
      optionData: state => state.dataSelet.protocol_list,
    }),
  },
  watch: {
    isShow(bool) {
      this.rememberT = bool;
    },
    tableValues() {
      this.changeInputData = [];
    },
    dataT(data) {
      this.dataStrToArr();
      const ifProperty = data.recordField['@allItem'];
      if (ifProperty === 'true') {
        const Arr = data.property.attribute[0]['@value'].split(',');
        const newArr = [];
        Arr.forEach((item) => {
          const preNewArr = item.split('=');
          newArr.push(preNewArr);
        });
        this.tableValues = newArr;
        this.radioValue = 'yes';
        this.hasHandle = data.property.attribute[0];
      } else {
        this.radioValue = 'no';
        this.tableValues = [];
      }
    },
  },
};
</script>
<style scoped lang="scss">
    #alert-str-wrap{
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
    #alert-str{
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
            .header{
              margin: 20px 28px;
              margin-bottom: 15px;
              display: flex;
              justify-content: space-between;
            }
            .pro-table{
              margin: 20px 30px 12px 30px;
              height: 300px;
            }
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
                    .button-1{
                        width: 60px;
                        height: 30px;
                        border: 0;
                        background-color: #0ea4c3;
                        border-radius: 3px;
                        margin-top: 10px;
                        margin-left: 80px;
                    }
                    .button-2{
                        width: 75px;
                        height: 30px;
                        border: 0;
                        background-color: #d04631;
                        border-radius: 3px;
                        margin-top: 10px;
                        margin-left: 10px;
                    }
                }
                .box-table{
                    // overflow-y: scroll;
                    height: 100%;
                    height: 247.9px;
                    .add-column{
                        height: 45px;
                        display:flex;
                        border-bottom: 1px solid #183149;
                        box-sizing: border-box;
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
                            margin-left:20px;
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