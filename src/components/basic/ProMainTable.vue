
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
          <span class="icons" v-if="col.sort">
            <i :class="{'up': true, 'dropup': col.key === sortInfo.key && sortInfo.direction === 'up'}" @click="sort({ key: col.key, direction: 'up', data: col })"></i>
            <i :class="{'down': true, 'dropdown': col.key === sortInfo.key && sortInfo.direction === 'down'}" @click="sort({ key: col.key, direction: 'down', data: col })"></i>
          </span>
        </template>
      </div>
    </div>
    <ScrollBar class="scroll-area"
      @ps-scroll-y="scrollY"
      @ps-scroll-x="scrollX"
      :scrollHeight="scrollHeight"
      :needResize="needResize"
    >
      <div>
        <div v-for="(row, index) in rows" :key="`tr${index}`"
          :style="`width:${row.widths}px`"
          :class="{'stable-td-wrap': true,
          'warn-tr': Object.prototype.hasOwnProperty.call(row, 'isWarn'),
          'active-tr': (activeRow === index || selectList.includes(index))}"
          @click="clickRow({ type: 'click-row', index: index, data: row })">
          <div v-if="(showInputDiv&&index === nowIndex)" class="input-div">
              <input type="text" class="first-change" v-model="firstChange"/>
              <input type="text" class="sec-change" v-model="secChange"/>
            <span class="input-sure-data" @click="closeInputDiv({ type: 'click-row', index: index, data: row })"></span>
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
              <span style="color:#d04631;" @click="delSingleLine(index)">删除</span>
            </template>
            <template v-if="col.type === 'edit'">
              <span style="color:#0ea4c3;" @click="editSingleLine(index)">编辑</span>
            </template>
            <template v-if="col.type === 'listOne'">
              <CmSelect :list="row.listArrOne" :selectVal="row.nowListOne" type="popsUp" @on-change="dataChange($event, index, col.type)"></CmSelect>
            </template>
            <template v-if="col.type === 'listTwo'">
              <CmSelect :list="row.listArrTwo" :selectVal="row.nowListTwo" type="popsUp" @on-change="dataChange($event, index, col.type)"></CmSelect>
            </template>
            <template v-else>
              <span class="others">{{row[col.key]}}</span>
            </template>
          </div>
        </div>
        <div class="stable-td-wrap stble-nodata" v-if="rows.length === 0">
          <td class="stable-tr" :colspan="cols.length">暂无数据</td>
        </div>
      </div>
    </ScrollBar>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import CmSelect from './CmSelect';
import ScrollBar from './ScrollBar';

export default {
  name: 'ProMainTable',
  components: {
    ScrollBar,
    CmSelect,
  },
  props: {
    needResize: { type: Boolean, default: false },
    scrollHeight: {
      type: [Number, String],
      default: 'inherit',
    },
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
    activeSort: {
      type: Object,
      default() {
        return {
          key: '',
          direction: 'down',
        };
      },
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
  },
  data() {
    return {
      wList: [],
      sortInfo: {},
      showInputDiv: false,
      nowIndex: 0,
      selectVal: [],
    };
  },
  computed: {
    // isUp
  },
  methods: {
    closeInputDiv(data) {
      const datas = data.data;
      datas.first = this.firstChange;
      datas.sec = this.secChange;
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
      if ((data.key === 'protocol_name' || data.key === 'desc') && data.index > 17) this.showInputDiv = true;
      else this.showInputDiv = false;
      this.nowIndex = data.index;
      this.firstChange = data.data.protocol_name;
      this.secChange = data.data.desc;
    },
    sort(evt) {
      if (this.sortabled) {
        Object.assign(this.sortInfo, {
          key: evt.key,
          direction: evt.direction,
        });
        this.$emit('sort', evt);
      }
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
    delSingleLine(index) {
      this.$emit('delSingleLine', index);
    },
    editSingleLine(index) {
      this.$emit('editSingleLine', index);
    },
  },
  mounted() {
    this.sortInfo = this.activeSort;
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
  //height: 270px;
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
    width: 520px;
    height: 23px;
    right: 0;
    margin-top: 2px;
    input{
      width: 135px;
      height: 24px;
      border-radius: 3px;
      border: 1px solid #183149;
      background-color: #081a29;
      padding: 0 10px;  
    }
    .first-change{
      width: 298px;
    }
    .sec-change{
      width: 212px;
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
  height: 64px;
  line-height: 64px;
  text-align: center;
  // border: solid 1px #0a212c;
  td{
    width: 100%;
  }
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
.others{
  width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
