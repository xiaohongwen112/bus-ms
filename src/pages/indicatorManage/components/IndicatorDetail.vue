<template>
  <config-box :tabs="tabs" :width='755' :height='465' :scrollheight="scrollheight"
    :onlyConfirm="onlyConfirm" @closeConfig="close" @handleScroll="handleScroll">
    <div slot="detail" class="detail-container">
      <div class="dimension-info">
        <div class="baes-info">
          <div>
            <span class="title">名称</span>
            <CmInput :value="curValue" :width="inputWidth" type="popsUp"
            :maxlength="20" :disable="disable"></CmInput>
          </div>
          <div>
            <span class="title">描述</span>
            <CmTextarea v-model="curDescrip" :width="textWidth" type="popsUp" :disable="disable"></CmTextarea>
          </div>
          <div class="rule-content">
            <span class="title">计算方式</span>
            <div class="rule-box">
              <CmSelect :selectVal="ruleIndex[data.related]" :disable="disable" type="popsUp"/>
            </div>
            <!--<div class="protable-box fix-title">
              <table>
                <thead>
                  <tr v-if="data.related === 'protocol'">
                    <td v-for="(x, i) in cols" :key="i"><div :style="`width: ${x.widths}px`">{{x.name}}</div></td>
                  </tr>
                  <tr v-else>
                    <td v-for="(x, i) in indicatorCols" :key="i"><div :style="`width: ${x.widths}px`">{{x.name}}</div></td>
                  </tr>
                </thead>
              </table>
            </div>-->
            <div class="protable-box table-content">
              <table v-if="data.related === 'protocol'">
                <thead>
                  <tr>
                    <td v-for="(x, i) in cols" :key="i">{{x.name}}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(x, i) in data.config" :key="i">
                    <td><div style="width: 50px">{{i + 1}}</div></td>
                    <td><div style="width: 140px">{{x.name}}</div></td>
                    <td><div style="width: 140px">{{x.field.join(',')}}</div></td>
                    <td><div v-html='x.normalizes' style="width: 230px"></div></td>
                  </tr>
                </tbody>
              </table>
              <table v-else>
                <thead>
                  <tr>
                    <td v-for="(x, i) in indicatorCols" :key="i">{{x.name}}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(x, i) in data.config" :key="i">
                    <td><div style="width: 50px">{{i + 1}}</div></td>
                    <td><div style="width: 230px">{{x.field.join(',')}}</div></td>
                    <td><div v-html='x.normalizes' style="width: 281px"></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </config-box>
</template>

<script>
  import { ConfigBox, CmInput, CmTextarea, BmsBtn, CmSelect } from '@/components/basic';
  import ProMainTable from '@/components/protocol/ProMainTable';

  export default {
    props: {
      title: {
        type: String,
        default: '',
      },
      data: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    watch: {
      data(newVal) {
        this.curValue = newVal.name;
        this.curDescrip = newVal.desc;
      },
    },
    components: { ConfigBox, CmInput, CmTextarea, BmsBtn, ProMainTable, CmSelect },
    data() {
      return {
        tabs: [
          { id: 'detail', text: this.title },
        ],
        curValue: this.data.name,
        inputWidth: 560,
        curDescrip: this.data.desc,
        textWidth: 560,
        scrollheight: 400,
        cols: [
          { key: 'num', name: '序号', type: 'num', widths: 50 },
          { key: 'name', name: '协议', widths: 140 },
          { key: 'desc', name: '关联字段', widths: 140 },
          { key: 'calculation', name: '计算规则', widths: 230 },
        ],
        indicatorCols: [
          { key: 'num', name: '序号', type: 'num', widths: 50 },
          { key: 'name', name: '指标', widths: 230 },
          { key: 'calculation', name: '计算规则', widths: 281 },
        ],
        selectList: [],
        disable: true,
        ruleIndex: {
          protocol: '基于协议字段',
          indicator: '基于指标',
        },
        onlyConfirm: true,
      };
    },
    methods: {
      handleScroll(e) {
        console.log(e);
      },
      close() {
        this.curValue = '';
        this.curDescrip = '';
        this.$emit('onClose');
      },
    },
  };
</script>

<style lang="scss">
.indicator-tab{
  .config-container{
    .config-main{
      width: 755px !important;
      .nav-content{
        padding-bottom: 20px !important;
        box-sizing: border-box;
      }
      .scroll-area{
        height: inherit !important;
        max-height: 155px;
      }
      .ps--active-x > .ps__rail-x, .ps--active-y > .ps__rail-y {
        background-color: #070f16;
      }
      .ps__thumb-y, .ps__thumb-x {
        background: #1d5d82;
      }
      .cm-textarea{
        textarea{
          height: 55px;
        }
      }
    }
  }
  .detail-container{
    .pro-table{
      .fix-table-wrap{
        .stable-th{
          height: 30px;
          line-height: 30px;
          &:last-child{
            border: none;
          }
        }
      }
      .stable-td-wrap{
        height: 30px;
        .stable-tr{
          height: 30px;
          line-height: 30px;
          cursor: default;
          &:last-child{
            border: none;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.detail-container{
  .dimension-info{
    .baes-info{
      position: relative;
      >div{
        display: flex;
        margin-bottom: 15px;
        &.rule-content{
          display: block;
        }
      }
    }
    .title{
      position: relative;
      width: calc(100% - 565px);
      vertical-align: middle;
      font-size: 14px;
      color: #ddd;
      line-height: 30px;
      text-align: right;
      padding-right: 15px;
      box-sizing: border-box;
    }
    .rule-box{
      display:inline-block;
      margin-left: -7px;
      margin-bottom: 13px;
    }
    .protable-box{
      float: right;
      &.fix-title{
        position: absolute;
        top: 0;
        right: 0;
      }
      table{
        border-collapse: collapse;
        border-left: 1px solid #1d3853;
        thead{
          tr{
            height: 34px;
            background-color: #183149;
          }
        }
        tbody{
          tr{
            td:last-child{
              div{
                text-align: left;
              }
            }
          }
        }
        tr{
          width: 100%;
          height: 30px;
          td{
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-right: 1px solid #1d3853;
            border-bottom: 1px solid #1d3853;
            div{
              text-align: center;
              word-break: break-all;
              padding: 0 5px;
              box-sizing: border-box;
            }
          }
        }
      }
    }
    .cm-input{
      vertical-align: middle;
    }
    .cm-input, .cm-textarea{
      float: right;
    }
    .setting-content{
      .title{
        line-height: inherit;
      }
      button:nth-of-type(1){
        margin-right: 15px;
      }
    }
  }
}
</style>