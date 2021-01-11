<template>
  <div id="condition">
    <CmSelect :list="selectList" :selectVal="name" :width="146" type="popsUp" @on-change="changeSelectName"></CmSelect>
    <!-- <select v-model="name" class="field-fun">
      <option value="notNull">notNull</option>
      <option value="isNone">isNone</option>
      <option value="in">IN</option>
      <option value="notin">NOT IN</option>
      <option value="eq">=</option>
      <option value="ne">!=</option>
      <option value="gt">></option>
      <option value="get">>=</option>
      <option value="lt"><</option>
      <option value="let"><=</option>
    </select> -->
    <div class="show-1" v-if="showNum === 1 || showNum === 11">
      <!-- 一个空 op value -->
      <input type="text" v-model="show6['@regexExpressions']" v-if="showNum === 11" placeholder ="abc:str"/> 
      <!-- 一个选择器 op item1 -->
      <!-- <select class="show-1-1" v-model="show1['@item1']" v-if="showNum === 1">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select> -->
      <!-- <CmSelect v-if="showNum === 1" :list="varArr" :selectVal="show1['@item1']" :width="146" class="field-fun" type="popsUp" @on-change="(val) => { show1['@item1'] = val }"></CmSelect> -->
    </div>
    <div class="show-2" v-if="showNum === 2">
      <!-- 选择器加返回字段 op item1 value -->
      <!-- <select class="show-2-1" v-model="show1['@item1']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select> -->
      <CmSelect :list="varArr" :selectVal="show1['@item1']" :width="133" style="margin-left:3px;" type="popsUp" @on-change="(val) => { show1['@item1'] = val; }"></CmSelect>
    </div>
    <div class="show-3" v-if="showNum === 3">
      <!-- 一个选择器加选择器或者空 op item1 item2/op item1 value -->
      <!-- <select class="show-3-1" v-model="show3['@item1']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select> -->
      <CmSelect :list="varArr" :selectVal="show3['@item1']" :width="133" style="margin-left:3px;" type="popsUp" @on-change="(val) => { show3['@item1'] = val }"></CmSelect>
      
      <!-- <select v-model="spaceOption" class="show-3-2">
        <option value="变量">变量</option>
        <option value="value">值</option>
      </select> -->
      <CmSelect :list="['变量', '值']" :selectVal="spaceOption" :width="76" type="popsUp" @on-change="(val) => { spaceOption = val }"></CmSelect>

      <input class="show-3-3" type="text" v-if="spaceOption === '值'" v-model="show2['@value']" :placeholder ="chooseItem"/>
      <!-- <select class="show-3-4" v-if="spaceOption === '变量'" v-model="show3['@item2']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select> -->
      <CmSelect :list="varArr" v-if="spaceOption === '变量'" :selectVal="show3['@item2']" :width="133" type="popsUp" @on-change="(val) => { show3['@item2'] = val }"></CmSelect>

    </div>
    <div class="show-4" v-if="showNum === 4">
      <!-- 一个选择器加起始位置 op item1 start end -->
      <select class="show-4-1" v-model="show4['@item1']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select>
      <span>起始位置:</span>
      <input class="show-4-2" type="text" placeholder="int" v-model="show4['@start']">
      <span>结束位置:</span>
      <input class="show-4-3" type="text" placeholder="int" v-model="show4['@end']">
    </div>
    <div class="show-3" v-if="showNum === 5">
      <!-- 选择器或空 op item1/op value -->
      <select v-model="spaceOption" class="show-3-2" style="margin-left:5px;">
        <option value="变量">变量</option>
        <option value="值">值</option>
      </select>
      <input class="show-3-3" type="text" v-if="spaceOption === '值'" v-model="show5['@value']"/>
      <!-- <select class="show-3-4" v-if="spaceOption === '变量'" v-model="show1['@item1']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select> -->
    </div>
  </div>
</template>
<script>
import CmSelect from '../field/Select';

export default {
  components: { CmSelect },
  data() {
    return {
      name: 'notNull',
      randomChoose: ['123: int', 'abc: str', '123.40: float', 'true: bool'], // spaceholder 随机
      reData: {}, // 将返回的值
      varArr: ['Stsld', 'PrcSts', 'PrcCd', 'Prtry'],
      spaceOption: '值',
      selectList: ['notNull', 'isNone', 'in', 'notin', 'eq', 'ne', 'gt', 'ge', 'lt', 'le'],
      showOption: {
        str_trim: 1,
        str_sub: 4,
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
        eq: 3,
        ne: 3,
        gt: 3,
        get: 3,
        lt: 3,
        let: 3,
      },
      show1: {
        '@op': '',
        '@item1': 'Stsld',
        field: [],
      },
      show2: {
        '@op': '',
        '@item1': 'Stsld',
        '@value': '',
        field: [],
      },
      show3: {
        '@op': '',
        '@item1': 'Stsld',
        '@item2': 'Stsld',
        field: [],
      },
      show4: {
        '@op': '',
        '@item1': 'Stsld',
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
        '@item1': 'Stsld',
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
        this.reData = this.show1;
        break;
      case 3:
        if (this.spaceOption === '变量') {
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
        if (this.spaceOption === '变量') {
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
  props: ['currentIndex', 'ifIndex', 'poItem', 'conditionData'],
  computed: {
    showNum() {
      return this.showOption[this.name];
    },
    chooseItem() {
      const rand = Math.floor(Math.random() * 4);
      return this.randomChoose[rand];
    },
  },
  methods: {
    changeSelectName(val) {
      this.name = val;
    },
  },
  created() {
    this.varArr = [].concat(this.$store.state.listRule.ruleList);
    this.show1['@item1'] = this.varArr[0];
    this.show2['@item1'] = this.varArr[0];
    this.show3['@item1'] = this.varArr[0];
    this.show4['@item1'] = this.varArr[0];
    this.show7['@item1'] = this.varArr[0];
    this.show3['@item2'] = this.varArr[0];
    switch (this.showOption[this.conditionData['@op']]) {
      case 2:
        this.show1 = this.conditionData;
        break;
      case 3:
        if (!this.conditionData['@value']) {
          this.show3 = this.conditionData;
        } else {
          this.show3['@item1'] = this.conditionData['@item1'];
          this.show2['@value'] = this.conditionData['@value'];
        }
        break;
      default: break;
    }
    this.name = this.conditionData['@op'];

    // 初始化数据也更新到返回上
    switch (this.showNum) {
      case 1:
        this.reData = this.show1;
        break;
      case 2:
        this.reData = this.show1;
        break;
      case 3:
        this.spaceOption = this.conditionData['@value'] === undefined ? '变量' : '值';
        if (this.spaceOption === '变量') {
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
        this.spaceOption = this.conditionData['@value'] === undefined ? '变量' : '值';
        if (this.spaceOption === '变量') {
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
};
</script>
<style lang="scss" scoped>
  #condition{
    display: flex;
    .field-fun{
      background-color: #081a29;
      width: 150px;
      height: 25px;
      border-radius: 3px;
      border:1px solid #183149;
      padding-left: 10px;
      padding-right: 10px;
    }
    .show-1{
      input{
        width: 130px;
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
        padding-left: 10px;
        padding-right: 10px;
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
        width: 170px;
        height: 32px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }
      .show-4-2, .show-4-3{
        width: 70px;
        height: 32px;
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