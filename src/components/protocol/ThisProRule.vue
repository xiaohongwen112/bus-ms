<template>
  <div id="alert-wrap" v-if="isShow">
    <!-- 添加下层协议组件，需要props:isShow控制显示，当点击关闭或取消时，emit：showValue向父组件发送消息 -->
    <div id="alert-demo">
        <div class="header">
            <p>本层协议属性</p>
            <svg @click="close" width="10" height="10" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="0" x2="10" y2="10" style="stroke:rgb(255,255,255);stroke-width:2"/>
                <line x1="10" y1="0" x2="0" y2="10" style="stroke:rgb(255,255,255);stroke-width:2"/>
            </svg>
        </div>
        <div class="content">
          <div class="content-lay">
            <div class="pre-data" v-for="(item, index) in showLay" :key="'this'+index">
              <input type="checkbox" :checked="item.ifHasCheck" @change="changeBox($event, index)"/>
              <span>{{ item.name }}</span>
              <i class="prode"
              @mouseenter="onMousteIn(index)"
              @mouseleave="onMousteOut()">
                <div class="pro-tip" v-show="seen&&current===index" :style="`width: ${item.Lwidth}px`">
                  <div class="tip-main">{{ item.detail }}</div>
                  <div class="tip-delta"></div>
                </div>
              </i>
              <CmSelect class="selsct-sec this-Selet" v-if="item.type==='select'" v-show="showRight.indexOf(index) !== -1"
              :list="item.thisList" :width="270" :selectVal="item.initS" @on-change="(val) => { item.initS = val }" type="popsUp">
              </CmSelect>
              <input v-else class="this-input" v-model="item.initS" type="phone" maxlength="5" placeholder="请输入0-65535的数字" v-show="showRight.indexOf(index) !== -1" />
            </div>
          </div>
          <div class="save-or-cancel">
            <button class="button-1" @click="save">保存</button>
            <button class="button-2" @click="close">取消</button>
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
import { valiproLay } from '@/helpers/configValidate';
import { CmSelect, CmTip, BmsBtn } from '@/components/basic';
import ScrollBar from '@/components/common/ScrollBar';
import undefined from '../../pages/protocol/utils';

export default {
  components: { ScrollBar, CmSelect, CmTip, BmsBtn },
  data() {
    return {
      layList: [{ name: 'byteOrder', toName: '@byteOrder', ifHasCheck: false, type: 'select', Lwidth: 126, initS: 'big_endian', detail: 'byteOrder：字节序', thisList: ['big_endian', 'little_endian'] },
                { name: 'encoding', toName: '@encoding', ifHasCheck: false, type: 'select', Lwidth: 224, initS: 'encoding', detail: 'encoding：将buffer包装为对应的类型', thisList: ['encoding', 'normal', 'url', 'xmlEscape', 'deflate', 'gzip'] },
                { name: 'payloadOffset', toName: '@payloadOffset', ifHasCheck: false, type: 'text', Lwidth: 234, initS: '', detail: 'payloadOffset : buffer的position偏移量' },
                { name: 'wrapLengthOffset', toName: '@wrapLengthOffset', ifHasCheck: false, type: 'text', Lwidth: 334, initS: '', detail: 'wrapLengthOffset : 将buffer根据encoding处理后的偏移量' },
                { name: 'wrapLengthType', toName: '@wrapLengthType', ifHasCheck: false, type: 'select', Lwidth: 465, initS: 'none', detail: 'wrapLengthType : buffer偏移类型，类型指定的是获取wrapLength需要的字节个数', thisList: ['none', 'int4', 'int3', 'int2', 'ascii4hex', 'ascii4dec', 'ascii6dec', 'ascii8dec', 'ascii10dec'] },
                { name: 'wrapLengthBiasSize', toName: '@wrapLengthBiasSize', ifHasCheck: false, type: 'text', Lwidth: 428, initS: '', detail: 'wrapLengthBiasSize：该属性用于指定wrapLength和paddinglength的关系' },
                { name: 'charset', toName: '@charset', ifHasCheck: false, type: 'select', Lwidth: 136, initS: 'ASCII', detail: 'charset ： 按格式编码', thisList: ['ASCII', 'ANSI', 'GBK', 'GB2312', 'UTF-8', 'GB18030', 'UNICODE'] },
                { name: 'forceCharset', toName: '@forceCharset', ifHasCheck: false, type: 'select', Lwidth: 166, initS: 'ASCII', detail: 'forceCharset ： 按格式编码', thisList: ['ASCII', 'ANSI', 'GBK', 'GB2312', 'UTF-8', 'GB18030', 'UNICODE'] },
                { name: 'payloadCompletePending', toName: '@payloadCompletePending', ifHasCheck: false, type: 'select', Lwidth: 444, initS: 'false', detail: 'payloadCompletePending : bool值,是否延迟判断payload是否完整，默认false', thisList: ['true', 'false'] },
      ],
      seen: false,
      current: 0, // 复制成功提示显示或者隐藏
      showRight: [],
      showLay: [],
      delTipFlag: false,
      tipContent: '',
      showFooter: false,
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
    save() {
      const layerProperty = [];
      const allData = {};
      let ifTur = true;
      _.forEach(this.showLay, (item) => {
        if (item.ifHasCheck) {
          const { initS, toName } = item;
          if (item.type === 'text') {
            const nameDisVa = valiproLay(item.initS);
            if (!nameDisVa.bool) {
              ifTur = false;
              this.delTipFlag = true;
              this.tipContent = nameDisVa.tip;
            }
          }
          const initObj = {};
          initObj[toName] = initS;
          layerProperty.push(initObj);
        }
      });
      if (ifTur) {
        allData.layerProperty = layerProperty;
        allData.id = this.dataT['@id'];
        this.$store.dispatch('addLay', allData);
        this.$emit('closeThisValue');
      }
    },
    close() {
      this.$emit('closeThisValue');
    },
    onMousteIn(index) {
      this.seen = true; // 鼠标移入显示
      this.current = index;
    },
    onMousteOut() {
      this.seen = false; // 鼠标移出隐藏
      this.current = null;
    },
    changeBox(e, index) {
      const ifChecked = e.target.checked;
      if (ifChecked) {
        // problem!
        this.showLay[index].ifHasCheck = true;
        this.showRight.push(index);
        this.showRight = _.uniqWith(this.showRight, _.isEqual);
      } else {
        this.showLay[index].ifHasCheck = false;
        if (this.showRight.indexOf(index) !== -1) this.showRight.splice(this.showRight.findIndex(item => item === index), 1);
      }
    },
  },
  created() {
  },
  computed: {
    ...mapState({
      vuexLay: state => state.protocolData['dp.xml'],
    }),
    // layListEdit() {
    //   const thisProR = _.filter(this.vuexLay, item => item['@id'] === this.dataT['@id']);
    //   console.log(thisProR);
    //   const layListData = _.cloneDeep(this.layList);
    //   if (thisProR[0].layerProperty !== undefined) {
    //     _.forEach(thisProR[0].layerProperty, (item) => {
    //       _.forEach(layListData, (items, index) => {
    //         if (item.name === items.name) {
    //           layListData[index].ifHasCheck = true;
    //           this.showRight.push(index);
    //           this.showRight = _.uniqWith(this.showRight, _.isEqual);
    //           layListData[index].initS = item.initS;
    //         } else {
    //           if (this.showRight.indexOf(index) !== -1) this.showRight.splice(this.showRight.findIndex(itemz => itemz === index), 1);
    //         }
    //       });
    //     });
    //   } else this.showRight = [];
    //   return layListData;
    // },
  },
  watch: {
    isShow() {
      const thisProR = _.filter(this.vuexLay, item => item['@id'] === this.dataT['@id']);
      console.log(thisProR);
      const layListData = _.cloneDeep(this.layList);
      if (thisProR[0].layerProperty !== undefined) {
        this.showRight = [];
        if (!(thisProR[0].layerProperty instanceof Array)) {
          const Arr = [];
          Arr.push(thisProR[0].layerProperty);
          thisProR[0].layerProperty = _.cloneDeep(Arr);
        }
        _.forEach(thisProR[0].layerProperty, (item) => {
          _.forIn(item, (values, key) => {
            _.forEach(layListData, (items, index) => {
              if (key === items.toName) {
                layListData[index].ifHasCheck = true;
                this.showRight.push(index);
                this.showRight = _.uniqWith(this.showRight, _.isEqual);
                layListData[index].initS = values;
              }
            });
          });
        });
      } else this.showRight = [];
      this.showLay = layListData;
    },
    layList(a) {
      console.log(a);
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
          .content-lay{
            padding: 6px 0;
            margin: 20px;
            border: 1px #0d3555 solid;
            height: 340px;
            background: #061522;
            .pre-data{
              margin: 7px 20px;
              height: 30px;
              color: #ddd;
              .this-input{
                margin: 0;
                float: right;
                margin-right: 35px;
                width: 270px;
                height: 30px;
                padding: 7px;
                border-radius: 3px;
                background: #061522;
                border: 1px #223f5d solid;
              }
              .this-Selet{
                margin: 0;
                float: right;
                margin-right: 35px;
              }
              input{
                margin-top: 3px;
                float: left;
              }
              span{
                margin-top: 3px;
                margin-left: 5px;
                float: left;
                line-height: 14px;
              }
              .prode{
                margin-top: 3px;
                font-size: 12px;
                font-style: normal;
                position: relative;
                cursor: pointer;
                width: 20px;
                height: 20px;
                display: inline-block;
                margin-left: 5px;
                background: url(../../assets/protocol/prode.png) no-repeat;
                .pro-tip{
                  padding-left: 8px;
                  position: absolute;
                  top: -38px;
                  left: -14px;
                  background: #1b3b50;
                  border-radius: 3px;
                  height: 32px;
                  line-height: 32px;
                  color: #bbb;
                  cursor: default;
                  .tip-delta{
                    margin-left: 10px;
                    float: left;
                    width: 0; 
                    height: 0;
                    border-width: 5px;
                    border-style: solid;
                    border-color:#1b3b50 transparent transparent transparent;
                  }
                }
              }
            }
            
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