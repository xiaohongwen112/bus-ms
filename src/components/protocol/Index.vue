<template>
  <div id="field">
    <select v-model="name" class="field-fun">
      <option value="str_trim">str_trim</option>
      <option value="str_sub">str_sub</option>
      <option value="str_add">str_add</option>
      <option value="str_regex">str_regex</option>
      <option value="as">as</option>
      <option value="notNull">notNull</option>
      <option value="isNone">isNone</option>
      <option value="in">IN</option>
      <option value="notin">NOT IN</option>
      <option value="add">+</option>
      <option value="sub">-</option>
      <option value="multi">*</option>
      <option value="divide">/</option>
      <option value="and">&&</option>
      <option value="or">||</option>
      <option value="eq">=</option>
      <option value="ne">!=</option>
      <option value="gt">></option>
      <option value="get">>=</option>
      <option value="lt"><</option>
      <option value="let"><=</option>
      <option value="lookup">lookup</option>
    </select>
    <div class="show-1" v-if="showNum === 1 || showNum === 11">
      <!-- 一个空 op value -->
      <input type="text" v-model="show6['@regexExpressions']" v-if="showNum === 11"/> 
      <!-- 一个选择器 op item1 -->
      <select class="show-1-1" v-model="show1['@item1']" v-if="showNum === 1">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select>
    </div>
    <div class="show-2" v-if="showNum === 2">
      <!-- 选择器加返回字段 op item1 value -->
      <select class="show-2-1" v-model="show7['@item1']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select>
      <span>返回字段</span>
      <input type="text" class="show-2-2" v-model="show7['@result']"/>
    </div>
    <div class="show-3" v-if="showNum === 3">
      <!-- 一个选择器加选择器或者空 op item1 item2/op item1 value -->
      <select class="show-3-1" v-model="show3['@item1']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select>
      <select v-model="spaceOption" class="show-3-2">
        <option value="值">变量</option>
        <option value="value">值</option>
      </select>
      <input class="show-3-3" type="text" v-if="spaceOption === 'value'" v-model="show2['@value']"/>
      <select class="show-3-4" v-if="spaceOption === '值'" v-model="show3['@item2']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select>
    </div>
    <div class="show-4" v-if="showNum === 4">
      <!-- 一个选择器加起始位置 op item1 start end -->
      <select class="show-4-1" v-model="show4['@item1']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select>
      <span>起始位置:</span>
      <input class="show-4-2" type="text" placeholder="输入值" v-model="show4['@start']">
      <span>结束位置:</span>
      <input class="show-4-3" type="text" placeholder="输入值" v-model="show4['@end']">
    </div>
    <div class="show-3" v-if="showNum === 5">
      <!-- 选择器或空 op item1/op item1 -->
      <select v-model="spaceOption" class="show-3-2" style="margin-left:5px;">
        <option value="值">变量</option>
        <option value="value">值</option>
      </select>
      <input class="show-3-3" type="text" v-if="spaceOption === 'value'" v-model="show5['@value']"/>
      <select class="show-3-4" v-if="spaceOption === '值'" v-model="show1['@item1']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select>
    </div>
    <div class="show-1" v-if="showNum === 6">
        <select class="show-1-1" v-model="show1['@item1']" v-if="showNum === 6">
          <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
        </select>
        <img src="./../pro.png" width="15" height="15" alt="pro" style="cursor:pointer;" @click="showLookup=!showLookup">
        <div class="lookup" v-if="showLookup"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showLookup: false,
      name: 'str_trim',
      reData: {}, // 将返回的值
      varArr: ['Stsld', 'PrcSts', 'PrcCd', 'Prtry'],
      spaceOption: '值',
      showOption: {
        str_trim: 1,
        str_sub: 4,
        str_add: 3,
        str_regex: 11, // 只显示文本
        as: 5,
        notNull: 2,
        isNone: 2,
        in: 3,
        notin: 3,
        add: 3,
        sub: 3,
        multi: 3,
        divide: 3,
        and: 3,
        or: 3,
        eq: 3,
        ne: 3,
        gt: 3,
        get: 3,
        lt: 3,
        let: 3,
        lookup: 6,
      },
      show1: {
        '@op': '',
        '@item1': '',
      },
      show2: {
        '@op': '',
        '@item1': '',
        '@value': '',
      },
      show3: {
        '@op': '',
        '@item1': '',
        '@item2': '',
      },
      show4: {
        '@op': '',
        '@item1': '',
        '@start': '',
        '@end': '',
      },
      show5: {
        '@op': '',
        '@value': '',
      },
      show6: {
        '@op': '',
        '@regexExpressions': '',
      },
      show7: {
        '@op': '',
        '@item1': '',
        '@result': '',
      },
    };
  },
  updated() {
    switch (this.showNum) {
      case 1:
        this.reData = this.show1;
        break;
      case 2:
        this.reData = this.show7;
        break;
      case 3:
        if (this.spaceOption === '值') {
          this.reData = this.show3;
        } else {
          this.show2['@item1'] = this.show3['@item1'];
          this.reData = this.show2;
        }
        break;
      case 4:
        this.reData = this.show4;
        break;
      case 5:
        if (this.spaceOption === '值') {
          this.reData = this.show1;
        } else {
          this.reData = this.show5;
        }
        break;
      case 11:
        this.reData = this.show6;
        break;
      default: break;
    }
    this.reData['@op'] = this.name;
    this.$emit('opData', { index: this.currentIndex, reData: this.reData, ifIndex: this.ifIndex });
  },
  props: ['currentIndex', 'ifIndex', 'poItem', 'fieldData'],
  computed: {
    showNum() {
      return this.showOption[this.name];
    },
  },
  created() {
    this.getfieldfromout();
    console.log(this.fieldData);
  },
  methods: {
    getfieldfromout() {
      this.name = this.fieldData['@op'];
      switch (this.showOption[this.fieldData['@op']]) {
        case 1:
          this.show1 = this.fieldData;
          break;
        case 2:
          this.show7 = this.fieldData;
          break;
        case 3:
          if (!this.fieldData['@item2']) {
            this.spaceOption = 'value';
            this.show3['@item1'] = this.fieldData['@item1'];
            this.show2['@value'] = this.fieldData['@value'];
          } else {
            this.spaceOption = '值';
            this.show3 = this.fieldData;
          }
          break;
        case 4:
          this.show4 = this.fieldData;
          break;
        case 5:
          if (!this.fieldData['@item1']) {
            this.show1['@op'] = this.name;
            this.show5['@value'] = this.fieldData['@value'];
            this.spaceOption = 'value';
          } else {
            this.show1['@item1'] = this.fieldData['@item1'];
            this.spaceOption = '值';
          }
          break;
        case 11:
          this.show6 = this.fieldData;
          break;
        default: break;
      }
    },
  },
  mounted() {
    this.varArr = this.$store.state.listRule.ruleList;
  },
};
</script>
<style lang="scss" scoped>
  #field{
    // .lookup-bc{
    //   width: 600px;
    //   height: 300px;
    // }
    .lookup{
      position: absolute;
      width: 590px;
      height: 300px;
      background-color: #ffffff;
      top: 33px;
      left: -165px;
      // opacity: 0.5;
      z-index: 999;
    }
    display: flex;
    .field-fun{
      background-color: #081a29;
      width: 145px;
      height: 25px;
      border-radius: 3px;
      border:1px solid #183149;
      padding-left: 10px;
      padding-right: 10px;
    }
    .show-1{
      position: relative;
      input{
        width: 250px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        margin-left: 5px;
      }
      .show-1-1{
        width: 130px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .show-2{
      .show-2-1{
        width: 130px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        margin-left: 5px;
      }
      .show-2-2{
        width: 130px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        padding-left: 10px;
        padding-right: 10px;
        // margin-left: 5px;
      }
    }
    .show-3{
      .show-3-1{
        width: 130px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }
      .show-3-2{
        width: 80px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        // margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }
      .show-3-4, .show-3-3{
        width: 130px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        // margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .show-4{
      .show-4-1{
        width: 130px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }
      .show-4-2, .show-4-3{
        width: 50px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        // margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  }
</style>