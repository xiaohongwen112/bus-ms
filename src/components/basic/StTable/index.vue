
<template>
  <div class="stable-wrap">
    <div class="fix-table-wrap"
      ref="freezeHeader">
      <table class="stable-table">
        <thead>
          <tr class="stable-th-wrap">
            <th class="stable-th" v-for="(col, index) in cols" :key="`th-clone${index}`"
              :width="wList[index]">
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
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <ScrollBar class="scroll-area"
      @ps-scroll-y="scrollY"
      @ps-scroll-x="scrollX"
      @ps-y-reach-start="scrollYStart"
    >
      <table class="stable-table">
        <thead ref="sthead">
          <tr class="stable-th-wrap">
            <th class="stable-th" v-for="(col, index) in cols" :key="`th${index}`"
              :ref="`th${index}`">
              <template v-if="col.type === 'select'">
                <input type="checkbox" :checked="headSelect" v-show="showHeadSelect"
                @change="handleCheckbox(-1, $event)"/>
              </template>
              <template v-if="col.type === 'operation'">
                操作
              </template>
              <template v-else>
                {{ col.name }}
                <span class="icons" v-if="col.sort">
                  <i :class="{'up': true, 'dropup': col.key === sortInfo.key && sortInfo.direction === 'up'}" @click="sort({ key: col.key, direction: 'up', data: col })"></i>
                  <i :class="{'down': true, 'dropdown': col.key === sortInfo.key && sortInfo.direction === 'down'}" @click="sort({ key: col.key, direction: 'down', data: col })"></i>
                </span>
              </template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="`tr${index}`"
           :class="{'stable-td-wrap': true,
            'warn-tr': Object.prototype.hasOwnProperty.call(row, 'isWarn'),
            'active-tr': (activeRow === index || selectList.includes(index))}"
            @click="clickRow({ type: 'click-row', index: index, data: row })">
            <td class="stable-tr" v-for="(col, subIndex) in cols" :key="`td${index}-${subIndex}`"
              @click="clickTd({ type: 'click-td', index: index, key: col.key, name: col.name, data: row })">
              <template v-if="col.type === 'select'">
                <input type="checkbox" v-if="row.selectshow || !row.hasOwnProperty('selectshow')"
                :disabled="!(row.selectable || !row.hasOwnProperty('selectable'))"
                :checked="selectList.includes(index)"
                @change="handleCheckbox(index, $event)"/>
              </template>
              <template v-if="col.type === 'operation'">
                <slot name="operation" v-bind="{ index, data: row }"></slot>
              </template>
              <template v-if="col.type === 'boolean'">
                <span :style="row[col.key] ? 'color: green;' : 'color:red;'">{{row[col.key] ? '启用' : '禁用'}}</span>
              </template>
              <template v-else>
                <span>{{ row[col.key] }}</span>
              </template>
            </td>
          </tr>
          <tr class="stable-td-wrap stble-nodata" v-if="rows.length === 0">
            <td class="stable-tr" :colspan="cols.length">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </ScrollBar>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import ScrollBar from '@/components/basic/ScrollBar';

export default {
  name: 'StTable',
  components: {
    ScrollBar,
  },
  props: {
    cols: {
      type: Array,
      default() {
        return [
          { key: 'name', name: '姓名' },
          { key: 'age', name: '年龄' },
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
    showHeadSelect: {
      type: Boolean,
      default: true,
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
    };
  },
  computed: {
    // isUp
  },
  methods: {
    clickRow(data) { // 点击行
      this.$emit('click-tr', data);
    },
    clickTd(data) { // 点击单元格
      this.$emit('click-td', data);
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
      this.cols.forEach((v, i) => {
        const w = this.$refs[`th${i}`][0].getBoundingClientRect().width;
        this.$set(this.wList, i, w);
      });
      const wTable = this.$refs.sthead.getBoundingClientRect().width;
      this.$refs.freezeHeader.style.width = `${wTable}px`;
    },
    onResize() {
      this.setWidth();
      this.scrollYStart();
    },
    scrollY() {
      this.setWidth();
      this.$refs.freezeHeader.style.visibility = 'visible';
    },
    scrollX(evt) {
      const l = evt.srcElement.scrollLeft;
      this.$refs.freezeHeader.style.marginLeft = `-${l}px`;
    },
    scrollYStart() {
      this.$refs.freezeHeader.style.visibility = 'hidden';
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
    this.sortInfo = this.activeSort;
    this.wList.length = this.cols.length;
    this.wList.fill(100);
    this.scrollYStart();
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
    background: #139d8c url(../../../assets/common/checked.svg) 1px center;
    background-size: 180% 180%;
    background-position-x: -4.5px;
  }
}
input[type="checkbox"][disabled="disabled"]{
  border: 1px solid #062f2a;
  cursor: default;
}

.fix-table-wrap{
  position: absolute;
  top: 0;
  width: 100%;
  // visibility: hidden;
  z-index: 9;
  
}
.stable-wrap{
  // width: 100%;
  // height: 100%;
  color: #f3f3f3;
  font-size: 14px;
  overflow: hidden;
  background-color: #0b1b29;
  border-radius: 3px;
  // background-color: red;
}
.scroll-area{
  width: 100%;
  height: 100%;
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
  background-color: #0b1b29;
  .stable-tr{
    // border-top: solid 1px #0b1b29;
    border-bottom: solid 1px #0b1b29;
  }
}
.stable-td-wrap:nth-child(even){
  background-color: #092535;
  .stable-tr{
    // border-top: solid 1px #092535;
    border-bottom: solid 1px #092535;
}
}
.stable-td-wrap:hover{
  // background-color: #1a5275;
}
.stable-td-wrap.warn-tr{
  color: #9e2d29;
}
.stable-td-wrap.active-tr{
  background-color: #1a5275;
}

.stable-th, .stable-tr{
  height: 27px;
  line-height: 27px;
  padding: 0 10px;
  font-weight: normal;
  font-weight: 300;
  text-align: center;
  white-space: nowrap;
  // border-right: 1px solid rgba(14,47,51,.6);
  // border-bottom: 1px solid rgba(14,47,51,.6);
}
.stable-th{
  background-color: #11364b;
  line-height: 35px;
}
.stable-tr{

}
.stble-nodata{
  height: 64px;
  line-height: 64px;
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
  background: url(../../../assets/stat/arrow-dropup.svg) no-repeat;
  margin-bottom: 3px;
}
.up:hover, .dropup{
  background: url(../../../assets/stat/arrow-up.svg) no-repeat;
}
.down{
  margin-top: 3px;
  background: url(../../../assets/stat/arrow-dropdown.svg) no-repeat;
}
.down:hover, .dropdown{
  background: url(../../../assets/stat/arrow-down.svg) no-repeat;
}




</style>
