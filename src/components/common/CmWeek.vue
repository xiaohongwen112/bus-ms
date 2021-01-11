<template>
  <ul class="week-btn-wrap clearfix">
    <li v-for="(day, index) in weekList" :key="`week-${index}`"
      :class="{'active': weekValue.includes(day.key)}"
      @click="handleClick(day.key)">
      <span>{{ day.name }}</span>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'CmWeek',
  model: {
    prop: 'weekValue',
  },
  props: {
    weekValue: {
      type: Array,
      default() {
        return [0];
      },
    },
    multi: {
      type: Boolean,
      default: true,
    },
    require: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      weekList: [
        { key: 0, name: '全' },
        { key: 1, name: '一' },
        { key: 2, name: '二' },
        { key: 3, name: '三' },
        { key: 4, name: '四' },
        { key: 5, name: '五' },
        { key: 6, name: '六' },
        { key: 7, name: '日' },
      ],
    };
  },
  methods: {
    handleClick(val) {
      // console.log(val, this.weekValue);
      if (this.weekValue.includes(val)) { // 取消
        if (!this.require || this.weekValue.length > 1) {
          const index = this.weekValue.indexOf(val);
          this.weekValue.splice(index, 1);
        }
      } else { // 选中
        if (this.weekValue.includes(0)) {
          this.weekValue.shift();
        }
        this.weekValue.push(val);
      }
      if (this.weekValue.includes(0) || this.weekValue.length === 7) {
        this.weekValue.length = 0;
        this.weekValue.push(0);
      }
      // console.log(this.weekValue);
      this.weekValue.sort();
      // this.$set(weekValue, this.weekValue);
      this.$emit('click', this.weekValue);
    },
  },
  // watch: {
  //   weekValue(val) {
  //     console.log(val);
  //   },
  // },
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
  display: inline-block;
  font-size: 16px;
  li{
    float: left;
    width: 28px;
    height: 28px;
    line-height: 28px;
    // border: 1px solid #000;
    border-right: 1px solid #000;
    // background-color: transparent;
    background-color: #15334A;
    text-align: center;
    color: #3dd9c4;
    cursor: pointer;
    &:first-child{
      border-radius: 5px 0 0 5px; 
    }
    &:last-child{
      border-radius: 0 5px 5px 0;
      border-right: none;
    }
  }
  .active{
    background: #32d6c8;
    color: #08141b;
  }
}
</style>
