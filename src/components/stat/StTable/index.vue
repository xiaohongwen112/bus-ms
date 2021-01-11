
<template>
  <div class="stable-wrap">
    <div class="fix-table-wrap"
      ref="freezeHeader">
      <table class="stable-table">
        <thead>
          <tr class="stable-th-wrap">
            <th class="stable-th" v-for="(col, index) in cols" :key="`th-clone${index}`"
              :width="wList[index]">{{ col.name }}
              <span class="icons" v-if="col.sort">
                <i :class="{'up': true, 'dropup': col.key === sortInfo.key && sortInfo.direction === 'up'}" @click="sort({ key: col.key, direction: 'up', data: col })"></i>
                <i :class="{'down': true, 'dropdown': col.key === sortInfo.key && sortInfo.direction === 'down'}" @click="sort({ key: col.key, direction: 'down', data: col })"></i>
              </span>
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
              :ref="`th${index}`">{{ col.name }}
              <span class="icons" v-if="col.sort">
                <i :class="{'up': true, 'dropup': col.key === sortInfo.key && sortInfo.direction === 'up'}" @click="sort({ key: col.key, direction: 'up', data: col })"></i>
                <i :class="{'down': true, 'dropdown': col.key === sortInfo.key && sortInfo.direction === 'down'}" @click="sort({ key: col.key, direction: 'down', data: col })"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="stable-tbody">
          <tr :class="{'stable-tr-wrap': true, 'warn-tr-wrap': Object.prototype.hasOwnProperty.call(row, 'isWarn'), 'active-tr-wrap': activeRow === index}" v-for="(row, index) in rows" :key="`tr${index}`"
            @click="clickRow({ type: 'click-row', index: index, data: row })">
            <td class="stable-tr" v-for="(col, subIndex) in cols" :key="`td${index}-${subIndex}`"
              @click.stop="clickTd(index, subIndex)">{{ row[col.key] }}</td>
          </tr>
          <tr class="stable-tr-wrap stble-nodata" v-if="rows.length === 0">
            <td class="stable-tr" :colspan="cols.length">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </ScrollBar>
  </div>
</template>

<script>
import ScrollBar from '@/components/common/ScrollBar';

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
    clickTd(index, subIndex) { // 点击单元格
      this.$emit('click-td', {
        type: 'click-td',
        index,
        key: this.cols[subIndex].key,
        name: this.cols[subIndex].name,
        data: this.rows[index],
      });
      console.log(index);
      this.$emit('click-tr', {
        type: 'click-row',
        index,
        data: this.rows[index],
      });
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


<style lang="scss" scoped>
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
  overflow: hidden;
}
.scroll-area{
  width: 100%;
  height: 100%;
}
.stable-table{
  border-spacing: 0;
  border-top: 1px solid rgba(14,47,51,.6);
  border-left: 1px solid rgba(14,47,51,.6);
  background-color: #010c11;
  width: 100%;
}
.stable-th-wrap{
  background-color: #0a212c;
}
.stable-tr-wrap{

}
.warn-tr-wrap{
  color: #9e2d29;
}
.active-tr-wrap{
  background-color: #1b3946;
}
.stable-th, .stable-tr{
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  font-weight: normal;
  font-weight: 300;
  text-align: center;
  white-space: nowrap;
  border-right: 1px solid rgba(14,47,51,.6);
  border-bottom: 1px solid rgba(14,47,51,.6);
}
.stable-th{
  
}
.stable-tr{

}
.stble-nodata{
  height: 64px;
  line-height: 64px;
  text-align: center;
  border: solid 1px #0a212c;
}
.icons{
  display: inline-block;
}
.up, .down{
  display: block;
  width: 8px;
  height: 4px;
  line-height: 32px;
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
