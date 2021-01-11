<template>
  <div id="alert-wrap">
    <Cmtip :tipContent="cmtipMessage" v-if="showcmTips" :closeFn="() => showcmTips = false"
           :showFooter="false">
    </Cmtip>
    <!-- 添加下层协议组件，需要props:isShow控制显示，当点击关闭或取消时，emit：showValue向父组件发送消息 -->
    <div id="alert-demo">
        <div class="header">
            <p>字段预处理</p>
            <svg @click="close" width="10" height="10" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="0" x2="10" y2="10" style="stroke:rgb(255,255,255);stroke-width:2"/>
                <line x1="10" y1="0" x2="0" y2="10" style="stroke:rgb(255,255,255);stroke-width:2"/>
            </svg>
        </div>
        <div class="content">
          <div class="row1">
            <p>定义预处理输出字段名称</p>
            <input type="text" v-model="text"/>
          </div>
          <div class="row2">
            <p>预处理规则</p>
            <Field :delLookup="true" class="field-box" :fieldData="field" @opData="(data) => { field = data.reData }"></Field>
          </div>
          <hr class="hr"/>
          <div class="save-or-cancel">
              <button class="button-1" @click="save">保存</button>
              <button class="button-2" @click="close">取消</button>
          </div>
        </div>
    </div>
      <div class="alert-bc">
      </div>
    </div>
</template>
<script>

import ScrollBar from '@/components/common/ScrollBar';
import Field from './field/Index';
import Cmtip from '../basic/CmTip/CmTip';

export default {
  components: { ScrollBar, Field, Cmtip },
  data() {
    return {
      cmtipMessage: '请填写完整',
      showcmTips: false,
      text: '',
      field: {
        '@op': 'str_trim',
        '@item1': '',
        '#text': '123',
      },
    };
  },
  props: {
    dataT: {
      type: Object,
      default: () => {},
    },
  },
  // watch: {
  //   dataT(data) {
  //     if (data) {
  //       this.field = data;
  //       this.text = data['#text'];
  //     }
  //   },
  // },
  created() {
    if (this.dataT['@op']) {
      this.field = Object.assign({}, this.dataT);
      delete this.field.index;
      this.text = this.dataT['#text'];
    }
  },
  methods: {
    save() {
      const FieldDatas = this.field;
      if (this.text === 'max_span') {
        FieldDatas['@type'] = 'int';
      }
      this.field['#text'] = this.text;
      // 这里便利一遍是否为空
      let isOk = true;
      for (const i in this.field) {
        if (this.field[i] === '') {
          isOk = false;
          break;
        }
      }
      if (!isOk || this.text === '') {
        this.showcmTips = true;
        return;
      }

      // 下面写保存操作
      if (this.dataT['@op']) {
        this.$store.dispatch('preData', { field: FieldDatas, index: this.dataT.index });
      } else {
        this.$store.dispatch('preData', { field: FieldDatas, index: 0 - 1 - this.dataT.index });
      }
      this.$emit('proPopupClose');
    },
    close() {
      this.$emit('proPopupClose');
    },
  },
};
</script>
<style scoped lang="scss">
    .alert-bc{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #000000;
      opacity: 0.6;
      z-index: 998;
    }
    #alert-demo{
        position: absolute;
        width: 627px;
        height: 200px;
        background-color: #183149;
        z-index: 999;
        left:0;right:0;
        top:0;bottom:0;
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
            height: 170px;
            border:1px solid #183149;
            background-color: #081a29;
            .row1{
              display: flex;
              margin-left: 20px;
              margin-top: 30px;
              p{
                line-height: 25px;
              }
              input{
                width: 200px;
                height: 25px;
                border:1px solid #183149;
                background-color: #081a29;
                border-radius:5px;
                margin-left: 10px;
                padding-left: 10px;
                padding-right: 10px;
              }
            }
            .row2{
              display: flex;
              margin-left: 20px;
              p{
                line-height: 25px;
              }
              .field-box{
                margin-left: 10px;
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