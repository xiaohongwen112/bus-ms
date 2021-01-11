<template>
  <div>
    <div class="table-title">
      <div class="item1 ta-td">{{ item1 }}</div>
      <div class="item2 ta-td">{{ item2 }}</div>
      <div class="item3 ta-td">{{ item3 }}</div>
      <div class="item4 ta-td">{{ item4 }}</div>
    </div>
    <div class="table-content" v-for="(item, index) in dataList" :class="[index === dataList.length - 1 ? 'last-tr' : '']" :key="index">
      <div class="item1 ta-td-pre">{{ index + 1 }}</div>
      <div class="item2 ta-td-pre">{{ item['#text'] }}</div>
      <div class="item3 ta-td-pre">{{ `${item['@op']} ${item['@value'] !== undefined ? item['@value'] : ''}`}}</div>
      <div class="item4 ta-td-pre">
        <div class="opr-bnt-list">
          <span class="edit-bnt"></span><span class="add-bnt"></span><span class="del-bnt"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  name: 'pro-nor-table',
  props: {
    item2: {
      default: '处理字段',
      type: String,
    },
    dataList: {
      default: [],
      type: Array,
    },
  },
  watch: {
    dataList(a) {
      console.log(a);
    },
  },
  data() {
    return {
      item1: '序号',
      item3: '计算规则',
      item4: '操作',
      nameTitle: '字段处理',
    };
  },
  methods: {
  },
  computed: {
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
          cursor: pointer;
          float: left;
          width: 20px;
          height: 20px;
        }
        .edit-bnt{
          background: url(../../assets/protocol/pro-edit.svg) no-repeat;
        }
        .add-bnt{
          background: url(../../assets/protocol/pro-add.svg) no-repeat;
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
  }
  .item2{
    width: 212px;
    border-right:1px #223f5d solid; 
  }
  .item3{
    width: 412px;
    border-right:1px #223f5d solid; 
  }
  .item4{
    width: 196px;
  }
</style>