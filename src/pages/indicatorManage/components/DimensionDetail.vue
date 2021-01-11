<template>
  <config-box :tabs="tabs" :width='755' :height='415' :scrollheight="scrollheight"
    :onlyConfirm="onlyConfirm" @closeConfig="close">
    <div slot="detail" class="detail-container">
      <div class="dimension-info">
        <div class="baes-info">
          <div>
            <span class="title">名称</span>
            <CmInput :value="data.name" :width="inputWidth" type="popsUp"
            :maxlength="20" :disable="disable"></CmInput>
          </div>
          <div>
            <span class="title">描述</span>
            <CmTextarea v-model="data.desc" :width="textWidth" type="popsUp" :disable="disable"></CmTextarea>
          </div>
          <div>
            <span class="title">来源</span>
            <ProMainTable ref="table" class="pro-table" :cols="cols" :rows="tableData"
            :selectList="selectList"
            :needResize="needResize"
            style="width: 573px;"
            >
            </ProMainTable>
          </div>
        </div>
      </div>
    </div>
  </config-box>
</template>

<script>
  import { ConfigBox, CmInput, CmTextarea, BmsBtn, ProMainTable } from '@/components/basic';

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
    components: { ConfigBox, CmInput, CmTextarea, BmsBtn, ProMainTable },
    data() {
      return {
        tabs: [
          { id: 'detail', text: this.title },
        ],
        inputWidth: 575,
        textWidth: 575,
        scrollheight: 410,
        cols: [
          { key: 'num', name: '序号', type: 'num', widths: 50 },
          { key: 'protocol_name', name: '协议', widths: 240 },
          { key: 'desc', name: '解码字段', widths: 283 },
        ],
        disable: true,
        selectList: [],
        tableData: [],
        needResize: true,
        onlyConfirm: true,
      };
    },
    methods: {
      close() {
        this.$emit('onClose');
      },
    },
    mounted() {
      this.data.config.forEach((item) => {
        this.tableData.push({ protocol_name: item.protocol, desc: item.field });
      });
    },
  };
</script>

<style lang="scss">
.dimension-tab{
  .config-container{
    .config-main{
      width: 755px !important;
      .nav-content{
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
      >div{
        display: flex;
        margin-bottom: 15px;
      }
    }
    .title{
      position: relative;
      width: calc(100% - 590px);
      vertical-align: middle;
      font-size: 14px;
      color: #ddd;
      padding-right: 15px;
      box-sizing: border-box;
      text-align: right;
      line-height: 30px;
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