<template>
  <ul class="skill">
    <li v-for="item in list" :key="item" :class="currentClass(item)" @click="selectLi(item)">{{item}}</li>
  </ul>
</template>

<script>
export default{
  name: 'Option',
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    }, // 数据
    disabledLi: {
      type: Array,
      default() {
        return [];
      }, // 禁选项
    },
    selectOption: { type: String, default: '' }, // 选中值
  },
  methods: {
    selectLi(item) {
    // $emit触发当前实例上的自定义事件 receive
      this.$emit('receive', item);
    },
    currentClass(item) {
      let curClass = '';
      if (this.selectOption === item) {
        curClass = 'selected';
      } else if (this.disabledLi.length !== 0) {
        this.disabledLi.forEach((x) => {
          if (x === item) {
            curClass = 'disabled';
          }
        });
      }
      return curClass;
    },
  },
};
</script>

<style lang="scss" scpoped>
  ul,li{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .skill{
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #0cdad4;
    border-top: none;
    position:absolute;
    z-index: 9;
    li {
      font-size: 14px;
      line-height: 2rem;
      height: 2rem;
      padding-left: 10px;
      cursor: pointer;
      color: #bbd6d6;
      background-color: #0b3b50;
      &:hover,&.selected{
        color:#000;
        background-color: #33d5c8;
      }
      &.disabled{
        color: #848686;
        pointer-events: none;
        cursor: not-allowed;
        &:hover{
          background-color: #0b3b50;
        }
      }
    }
  }
</style>