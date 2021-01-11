<template>
  <div class="pagesize-wrap">
    显示结果
    <select class="pagesize-slect"  v-model="currentSize">
      <option class="pagesize-option" v-for="(option, index) in options"
        :key="index"
        :value="option"
      >{{ optionMap[Number(option)] }}</option>
    </select>
    条/页
  </div>
</template>
<script>
export default {
  name: 'Pagesize',
  model: {
    prop: 'val',
    event: 'change',
  },
  props: {
    val: {
      type: Number,
      default: 10,
    },
    options: {
      type: Array,
      default() {
        return [10, 20, 0];
      },
    },
  },
  data() {
    return {
      currentSize: this.val,
      optionMap: {
        10: 10,
        20: 20,
        50: 50,
        100: 100,
        0: '所有',
      },
    };
  },
  watch: {
    currentSize(val) {
      this.$emit('change', val);
    },
  },
};
</script>
<style lang="scss" scoped>
.pagesize-wrap{
  color: #BEE2EB;
  font-size: 16px;  
  .pagesize-slect, .pagesize-option{
    background-color: rgb(10,31,48);
  }
  .pagesize-slect{
    width: 60px;
    height: 32px;
    padding-left: 4px;
    border: 1px solid #3dd9c4;
    font-size: 16px;
    color: #bee2eb;
    appearance:none;   
    -moz-appearance:none;   
    -webkit-appearance:none;
    background: url(../../assets/sys-icon/arrow-w.svg) no-repeat calc(100% - 5px) 0% transparent !important;
  }
}
</style>
