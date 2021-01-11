<template>
  <div v-if="item2 ==='预处理字段'">
    <div class="table-title">
      <div class="item1 ta-td">{{ item1 }}</div>
      <div class="item2 ta-td">{{ item2 }}</div>
      <div class="item3 ta-td">{{ item3 }}</div>
      <div class="item4 ta-td">{{ item4 }}</div>
    </div>
    <div class="table-content" v-for="(item, index) in preComData" :class="[index === preComData.length - 1 ? 'last-tr' : '']" :key="index">
      <div class="item1 ta-td-pre">{{ index + 1 }}</div>
      <div class="item2 ta-td-pre">{{ item['#text'] }}</div>
      <div class="item3 ta-td-pre" v-if="item['@op'] !== undefined">{{ item.show }}</div>
      <div class="item3 ta-td-pre no-data" v-else><span @click="popupPre(item, index)">未配置</span></div>      
      <div class="item4 ta-td-pre">
        <div class="opr-bnt-list">
          <span class="edit-bnt" @click="popupPre(item, index)"></span>
          <span class="del-bnt" v-if="index !== 0" @click="delPre(index)"></span>
          <span class="add-bnt"  @click="popupPre(0, index)"></span>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="table-title">
      <div class="item1 ta-td">{{ item1 }}</div>
      <div class="item2 ta-td">{{ item2 }}</div>
      <div class="item3 ta-td">{{ item3 }}</div>
      <div class="item4 ta-td">{{ item4 }}</div>
    </div>
    <div class="table-content" v-for="(item, index) in compData" :class="[index === compData.length - 1 ? 'last-tr' : '']" :key="index">
      <div class="item1 ta-td-pre">{{ index + 1 }}</div>
      <div class="item2 ta-td-pre">{{ item['@name'] }}</div>
      <div class="item3 ta-td-pre" v-if="item['@op'] !== undefined">{{ item.show }}</div>
      <!-- <div class="item3 ta-td-pre" v-if="item['@op'] !== undefined"></div> -->
      <div class="item3 ta-td-pre no-data" v-else><span @click="popupData(item, index)">未配置</span></div>            
      <div class="item4 ta-td-pre">
        <div class="opr-bnt-list">
          <span class="edit-bnt" @click="popupData(item, index)"></span>
          <span class="del-bnt"  v-if="indexArr.indexOf(item['@name']) === -1" @click="delDealData(index)"></span>
          <span class="add-bnt"  @click="popupData(0, index)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  name: 'pro-table',
  props: {
    item2: {
      default: '预处理字段',
      type: String,
    },
    dataList: {
      default: () => [],
      type: Array,
    },
  },
  // watch: {
  //   dataList(a) {
  //     console.log(a);
  //   },
  // },
  data() {
    return {
      indexArr: [
        'transaction_id',
        'trans_type',
        'sub_trans_type',
        'ret_code',
        'starts_with',
        'ends_with',
        'is_success',
        'status',
      ],
      item1: '序号',
      item3: '计算规则',
      item4: '操作',
      nameTitle: '字段预处理',
    };
  },
  methods: {
    popupData(item, index) {
      this.$emit('popupDataChange', item, index);
    },
    popupPre(item, index) {
      this.$emit('popupPreChange', item, index);
    },
    delPre(index) {
      this.$store.dispatch('delPre', index);
    },
    delDealData(index) {
      this.$store.dispatch('delDealData', index);
    },
    computeRule(Optype, data) {
      let ruletemp = '';
      switch (Optype) {
        case 'str_regex':
          ruletemp = `${data['@regexExpressions']}`;
          break;
        case 'str_trim':
          ruletemp = `${data['@item1']} ${data['@op']}`;
          break;
        case 'notNull':
          ruletemp = `${data['@item1']} ${data['@op']} return ${data['@result'] !== undefined ? data['@result'] : ''}`;
          break;
        case 'isNone':
          ruletemp = `${data['@item1']} ${data['@op']} return ${data['@result'] !== undefined ? data['@result'] : ''}`;
          break;
        case 'str_sub':
          ruletemp = `${data['@item1']}.${data['@op']} start:${data['@start']}, end:${data['@end']}`;
          break;
        case 'as':
          ruletemp = `${data['@op']} ${data['@item1'] !== undefined ? data['@item1'] : ''} ${data['@value'] !== undefined ? data['@value'] : ''}`;
          break;
        case 'str_add':
          ruletemp = `${data['@item1'] !== undefined ? data['@item1'] : ''} ${data['@op']} ${data['@item2'] !== undefined ? data['@item2'] : ''}${data['@value'] !== undefined ? data['@value'] : ''}`;
          break;
        default:
          ruletemp = `${data['@item1']} ${data['@op']} ${data['@value'] !== undefined ? data['@value'] : ''}${data['@item2'] !== undefined ? data['@item2'] : ''}`;
          break;
      }
      return ruletemp;
    },
    showRule(data, hasIf) { // 规则展示
      const Optype = data['@op'];
      let ruleList = '';
      ruleList = this.computeRule(Optype, data);
      if (hasIf) {
        const ifOptype = hasIf['@op'];
        const ifRule = this.computeRule(ifOptype, hasIf);
        ruleList = `if ( ${ifRule} ) ${ruleList} ...`;
      } else ruleList = `${ruleList} ...`;
      return ruleList;
    },
  },
  computed: {
    preComData() {
      const preCompDataArr = [];
      this.dataList.forEach((item) => {
        let compDataObj = {};
        if (!(item.field instanceof Array)) { // fiedf 为一条格式 对象
          compDataObj = item;
          compDataObj.show = this.showRule(item);
        } else { // fiedf 为空
          compDataObj = item;
          compDataObj.show = this.showRule(item);
        }
        console.log(compDataObj);
        preCompDataArr.push(compDataObj);
      });
      return preCompDataArr;
    },
    compData() {
      const compDataArr = [];
      console.log(this.dataList);
      this.dataList.forEach((item) => {
        let compDataObj = {};
        console.log(item);
        if (item.if !== undefined) { // 存在if判断条件（默认取第一条的第一个field的第一条）
          if (item.if instanceof Array) { // if else
            if (!(item.if[0].field instanceof Array)) { // 单条 field
              compDataObj = Object.assign({}, item, item.if[0].field);
              compDataObj.show = this.showRule(item.if[0].field, item.if[0]);
            } else if (item.if[0].field.length > 0) { // 多条 field
              compDataObj = Object.assign({}, item, item.if[0].field[0]);
              compDataObj.show = this.showRule(item.if[0].field[0], item.if[0]);
            } else { // field null
              compDataObj = Object.assign({}, item);
              compDataObj.show = this.showRule(item);
            }
          } else { // if obj
            if (!(item.if.field instanceof Array)) { // 单条 field
              compDataObj = Object.assign({}, item, item.if.field);
              compDataObj.show = this.showRule(item.if.field, item.if);
            } else if (item.if.field.length > 0) { // 多条 field
              this.showRule(item.if.field[0], item.if);
              compDataObj = Object.assign({}, item, item.if.field[0]);
            } else { // field null
              compDataObj.show = this.showRule(item);
              compDataObj = Object.assign({}, item);
            }
          }
        } else { // field的第一条
          if (!(item.field instanceof Array)) { // fiedf 为一条格式 对象
            compDataObj = Object.assign({}, item, item.field);
            compDataObj.show = this.showRule(item.field);
          } else if (item.field.length > 0) { // fiedf 为多条格式 数组取第一条
            compDataObj = Object.assign({}, item, item.field[0]);
            compDataObj.show = this.showRule(item.field[0]);
          } else { // fiedf 为空
            compDataObj = Object.assign({}, item);
            compDataObj.show = this.showRule(item);
          }
        }
        console.log(compDataObj);
        compDataArr.push(compDataObj);
      });
      return compDataArr;
    },
  },
};
</script>

<style lang="scss" scoped>
  .table-title{
    width: 914px;
    height: 32px;
    border:1px #223f5d solid; 
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  .table-content{
    width: 914px;
    height: 32px;
    border:1px #223f5d solid; 
    border-top:none; 
    .item4{
      .opr-bnt-list{
        background-size: contain;
        width: auto;
        height: 24px;
        display: inline-block;
        padding-top: 5px;
        >span{
          margin: 0 4px;
          cursor: pointer;
          float: left;
          width: 20px;
          height: 20px;
        }
        .edit-bnt{
          background: url(../../assets/protocol/pro-edit.svg) no-repeat;
        }
        .add-bnt{
          background: url(../../assets/protocol/pro-add.png) 0px 0px no-repeat;
          background-size: cover;
          width: 17px;
          height: 17px;
          margin-top: 2px;
        }
        .del-bnt{
          background: url(../../assets/protocol/pro-delete.svg) no-repeat;
        }
      }
    }
  }
  .last-tr{
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  .ta-td{
      height: 30px;
      float: left;
      background: #183149;
      font-size: 14px;
      line-height: 30px;
      text-align: center;
  }
  .ta-td-pre{
      height: 30px;
      float: left;
      background: transparent;
      font-size: 14px;
      line-height: 30px;
      text-align: center;
  }
  .item1{
    width: 92px;
    border-right:1px #223f5d solid;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .item2{
    width: 212px;
    border-right:1px #223f5d solid;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .item3{
    width: 412px;
    border-right:1px #223f5d solid;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap; 
  }
  .item4{
    width: 196px;
  }
  .no-data{
    span{
      cursor: pointer;
      color: #b94130;
    }
  }
</style>