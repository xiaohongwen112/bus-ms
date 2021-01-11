
<template>
  <div class="stable-wrap">
    <div class="fix-table-wrap"
      ref="freezeHeader">
      <div class="stable-th" v-for="(col, index) in cols" :key="`th-clone${index}`" :style="`width:${col.widths}px`"> 
        <template v-if="col.type === 'select'">
          <input type="checkbox" :checked="headSelect" @change="handleCheckbox(-1, $event)"/>
        </template>
        <template v-else>
          {{ col.name }}
        </template>
      </div>
    </div>
    <ScrollBar class="scroll-area"
      @ps-scroll-y="scrollY"
      @ps-scroll-x="scrollX"
      :style="`height:${scrollHeight};`"
    >
      <div>
        <div v-for="(row, index) in rows" :key="`tr${index}`"
          :style="`width:${row.widths}px`"
          :class="{'stable-td-wrap': true,
          'warn-tr': Object.prototype.hasOwnProperty.call(row, 'isWarn'),
          'active-tr': (rows.activeRow === index || selectList.includes(index))}"
          @click="clickRow({ type: 'click-row', index: index, data: row })">
          <div v-if="(showInputDiv&&index === nowIndex)" class="input-div" :style="`width : ${inputOut}px`">
            <input v-if="!row.hasOwnProperty('nowListOne')" ref="firstChange" type="text" v-model="firstChange" :style="`width : ${firstChangeFn}px`" @blur="closeInputDiv({ type: 'click-row', index: index, data: row })"/>
            <span v-else :style="`width : ${firstChangeFn}px`"/>
            <input ref="bb" type="text" v-model="secChange" :style="`width : ${secChangeFn}px`" @blur="closeInputDiv({ type: 'click-row', index: index, data: row })"/>
          </div>
          <div :class="['stable-tr', col.type === 'listOne'? 'list-tr' : '', col.type === 'listTwo'? 'list-tr' : '']" v-for="(col, subIndex) in cols" :key="`td${index}-${subIndex}`"
            :style="`width:${col.widths}px`"
            @click="clickTd({ type: 'click-td', index: index, key: col.key, name: col.name, data: row })">
            <template v-if="col.type === 'select'">
              <input type="checkbox" v-if="row.selectshow || !row.hasOwnProperty('selectshow')"
              :disabled="!(row.selectable || !row.hasOwnProperty('selectable'))"
              :checked="selectList.includes(index)"
              @change="handleCheckbox(index, $event)"/>
            </template>
            <template v-if="col.type === 'num'">
              {{ index+1 }}
            </template>
            <template v-if="col.type === 'delete'">
              <span style="color:red;">删除</span>
            </template>
            <template v-if="col.type === 'listOne'">
              <CmSelect :list="row.listArrOne" :selectVal="row.nowListOne" :width=firstChangeFn type="popsUp" @on-change="dataChange($event, index, col.type)"></CmSelect>
            </template>
            <template v-if="col.type === 'listTwo'">
              <CmSelect :list="row.listArrTwo" :selectVal="row.nowListTwo" type="popsUp" @on-change="dataChange($event, index, col.type)"></CmSelect>
            </template>
            <template v-else>
              <span>{{ row[col.key] }}</span>
            </template>
          </div>
        </div>
        <div class="stable-td-wrap stble-nodata" v-if="rows.length === 0">
          <div class="stable-tr" style="text-align: center;width: 100%;line-height: 32px;" :colspan="cols.length">暂无数据</div>
        </div>
      </div>
    </ScrollBar>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import ScrollBar from '@/components/basic/ScrollBar';
import { CmSelect } from '@/components/basic';
// import { validateName, checkError } from '@/helpers/configValidate';

export default {
  name: 'ProMainTable',
  components: {
    ScrollBar,
    CmSelect,
  },
  props: {
    cols: {
      type: Array,
      default() {
        return [
          { key: 'name', name: '姓名', width: 300 },
          { key: 'age', name: '年龄', width: 220 },
        ];
      },
    },
    rows: {
      type: Array,
      default() {
        return [
          { name: '张三', age: '24' },
          { name: '赵四', age: '25' },
        ];
      },
    },
    activeRow: {
      type: [Number, null],
      default: null,
    },
    sortabled: { // 某情况下搜索不响应
      type: Boolean,
      default: true,
    },
    selectList: {
      type: Array,
    },
    headSelect: {
      type: Boolean,
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    scrollHeight: {
      type: String,
      default: '270px',
    },
  },
  data() {
    return {
      wList: [],
      showInputDiv: false,
      nowIndex: 0,
      selectVal: [],
      secChange: '',
      firstChange: '',
    };
  },
  computed: {
    inputOut() {
      let widthAll = 0;
      let oneW = 0;
      _.forEach(this.cols, (item) => {
        if (item.key === 'protocol_name' || item.key === 'nowListOne') {
          oneW = item.widths;
        }
        if (item.key === 'desc') widthAll = oneW + item.widths;
      });
      return widthAll;
    },
    firstChangeFn() {
      let firstW = 0;
      _.forEach(this.cols, (item) => {
        if (item.key === 'protocol_name' || item.key === 'nowListOne') firstW = item.widths - 2;
      });
      return firstW;
    },
    secChangeFn() {
      let secCW = 0;
      _.forEach(this.cols, (item) => {
        if (item.key === 'desc') secCW = item.widths - 3;
      });
      return secCW;
    },
    // isUp
  },
  methods: {
    closeInputDiv(data) {
      // const checkName = validateName(data, false);
      // checkError(checkName, this.$refs.firstChange);
      const datas = data.data;
      datas.first = this.firstChange;
      datas.sec = this.secChange;
      datas.index = data.index;
      this.$emit('MainDataChage', datas);
      this.showInputDiv = false;
    },
    dataChange(val, i, type) {
      const data = {
        val,
        index: i,
        type,
      };
      this.$emit('MainDataChage', data);
    },
    clickRow(data) { // 点击行
      this.$emit('click-tr', data);
    },
    clickTd(data) { // 点击单元格
      this.showInputDiv = false;
      if (data.key === 'select' || data.key === 'code' || data.key === 'decode') {
        this.showInputDiv = false;
      } else this.showInputDiv = true;
      this.nowIndex = data.index;
      this.firstChange = data.data.protocol_name;
      this.secChange = data.data.desc;
    },
    setWidth() {
    },
    onResize() {
      this.setWidth();
    },
    scrollY() {
      this.setWidth();
      this.$refs.freezeHeader.style.visibility = 'visible';
    },
    scrollX(evt) {
      const l = evt.srcElement.scrollLeft;
      this.$refs.freezeHeader.style.marginLeft = `-${l}px`;
    },
    // isActiveRow(index) {
    //   let flag = false;
    //   if (_.has(this.rows[index], 'isActive')) {
    //     if (this.row[index].isActive) {
    //       flag = true;
    //     }
    //   }
    //   return flag;
    // },
    handleCheckbox(index, event) {
      // index === -1 表示全选
      // console.log(index, '是否选中：', event.target.checked, changeAll);
      this.$emit('select', { index, checked: event.target.checked });
    },
  },
  mounted() {
    this.wList.length = this.cols.length;
    this.wList.fill(100);
    // this.onResize();
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
};
</script>

<style lang="scss">
.stable-wrap{
  .ps--active-x > .ps__rail-x, .ps--active-y > .ps__rail-y {
    background-color: #0b1b29;
  }
  .ps__thumb-y, .ps__thumb-x {
    background: #1d5d82;
  }
}
</style>


<style lang="scss" scoped>
input[type="checkbox"]{
  height: 14px;
  vertical-align: middle;
  width: 14px;
  border: 1px solid #278c89;
  border-radius: 3px;
  margin: 0 4px;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;
  &:checked{
    background: #139d8c url(../../assets/common/checked.svg) 1px center;
    background-size: 180% 180%;
    background-position-x: -4.5px;
  }
}
input[type="checkbox"][disabled="disabled"]{
  border: 1px solid #062f2a;
  cursor: default;
}

.fix-table-wrap{
  width: 100%;
  height: 34px;
  background-color: #183149;
  .stable-th{
    height: 34px;
    border-right: 1px solid #1d3853;
  }
}
.stable-wrap{
  // width: 100%;
  // height: 100%;
  color: #f3f3f3;
  font-size: 14px;
  overflow: hidden;
  background-color: #081928;
  border-radius: 3px;
  border: 1px solid #1d3853;
  // background-color: red;
}
.scroll-area{
  width: 100%;
}
.stable-table{
  border-spacing: 0;
  // border-top: 1px solid rgba(14,47,51,.6);
  // border-left: 1px solid rgba(14,47,51,.6);
  background-color: #010c11;
  width: 100%;
}
.stable-th-wrap{
  background-color: #0a212c;
}
.stable-td-wrap{
  position: relative;
  border-bottom: solid 1px #1d3853;
  background-color: #081928;
  height: 28px;
  .stable-tr{
    cursor: pointer;
  }
  .input-div{
    position: absolute;
    height: 23px;
    right: 0;
    margin-top: 2px;
    span{
      display: inline-block;
    }
    input{
      width: 135px;
      height: 24px;
      border-radius: 3px;
      border: 1px solid #183149;
      background-color: #081a29;
      padding: 0 10px;  
    }
    .input-sure-data{
      cursor: pointer;
      width: 25px;
      height: 25px;
      position: absolute;
      background:url(../../assets/protocol/input-sure.png);
      background-repeat: no-repeat;
      right: 0;
      top: 2px;
    }
  }
}
.stable-td-wrap:nth-child(even){
  .stable-tr{
    // border-top: solid 1px #092535;
}
}
.stable-td-wrap:hover{
  // background-color: #1a5275;
}
.stable-td-wrap.warn-tr{
  color: #9e2d29;
}
.stable-td-wrap.active-tr{
  background-color: #1a4065;
}

.stable-th, .stable-tr{
  height: 27px;
  line-height: 27px;
  padding: 0 10px;
  font-weight: normal;
  font-weight: 300;
  text-align: center;
  white-space: nowrap;
  float: left;
  border-right: 1px solid #1d3853;
  box-sizing: border-box;
  text-overflow: ellipsis;
  // border-right: 1px solid rgba(14,47,51,.6);
  // border-bottom: 1px solid rgba(14,47,51,.6);
}
.list-tr{
  padding: 0 !important;
}
.stable-th{
  line-height: 35px;
}
.stable-tr{

}
.stble-nodata{
  height: 32px;
  line-height: 32px;
  text-align: center;
  // border: solid 1px #0a212c;
}
.icons{
  display: inline-block;
}
.up, .down{
  display: block;
  width: 8px;
  height: 4px;
  line-height: 35px;
  cursor: pointer;
}
.up{
  background: url(../../assets/stat/arrow-dropup.svg) no-repeat;
  margin-bottom: 3px;
}
.up:hover, .dropup{
  background: url(../../assets/stat/arrow-up.svg) no-repeat;
}
.down{
  margin-top: 3px;
  background: url(../../assets/stat/arrow-dropdown.svg) no-repeat;
}
.down:hover, .dropdown{
  background: url(../../assets/stat/arrow-down.svg) no-repeat;
}




</style>
