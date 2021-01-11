<template>
  <ul class="week-btn-wrap clearfix">
    <li :class="{active: currentWeek.indexOf(-1) > -1}"
      @click="handleClick(-1)">
      <i v-if="selectAll == ''" class="icon-bms-calendar"></i>
      <span v-else>{{selectAll}}</span>
    </li>
    <li v-for="(item, index) in weekList" :key="index"
    :class="{active: currentWeek.indexOf(index) > -1}"
    @click="handleClick(index)"
    >{{ item }}</li>
  </ul>
</template>
<script>
export default {
  name: 'CheckWeek',
  props: {
    activeWeek: {
      type: Array,
      default() {
        return [0, 5];
      },
      required: true,
    },
    selectAll: { type: String, default: '' },
  },
  data() {
    return {
      weekList: ['日', '一', '二', '三', '四', '五', '六'],
      // currentWeek: [3, 4],
      currentWeek: this.activeWeek,
    };
  },
  methods: {
    checkValue() {
      this.currentWeek.sort();
      // console.log(this.currentWeek);
      if (this.currentWeek.indexOf(-1) > -1) {
        this.currentWeek = [-1];
      } else if (this.currentWeek.length === 7) {
        this.currentWeek = [-1];
      }
    },
    handleClick(val) {
      const tmpIndex = this.currentWeek.indexOf(val);
      if (tmpIndex > -1) {
        this.currentWeek.splice(tmpIndex, 1);
      } else {
        this.currentWeek.push(val);
      }
      this.checkValue();
      this.$emit('click', this.currentWeek);
    },
    returnInital() {
      this.currentWeek = [-1];
    },
    updateWeek(week) {
      this.currentWeek = week;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../assets/css/iconbms.css';

ul{
  margin: 0 auto;
}
.clearfix{
  zoom: 1;
}
.clearfix:after{
  content: ".";
  clear: both;
  display: block;
  overflow: hidden;
  font-size: 0;
  height: 0;
}

.week-btn-wrap{
  font-size: 16px;
  li{
    float: left;
    width: 28px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #3dd9c4;
    background-color: transparent;
    text-align: center;
    color: #3dd9c4;
    cursor: pointer;
  }
  .active{
    background: #32d6c8;
    color: #08141b;
  }
}
</style>
