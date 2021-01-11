<template>
  <ul class="skill" :class="{'top': position === 'top'}" 
  :style="{height : list.length < 5 ? '' : `${height}px`}">
    <ScrollBar class="scroll-area">
      <li v-for="item in list" :key="typeof item === 'object' ? item.key : item" :class="currentClass(typeof item === 'object' ? item.key : item)" 
      @click="selectLi(item)">{{typeof item === 'object' ? item.name : item}}</li>
    </ScrollBar>
  </ul>
</template>

<script>
import ScrollBar from './ScrollBar';

export default{
  name: 'Option',
  props: {
    list: {
      type: [Array, Object],
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
    selectOption: { type: [String, Number], default: '' }, // 选中值
    height: { type: Number, default: 150 },
    position: { type: String, default: '' },
    scaleWidth: {
      type: Number,
      default: 1,
    },
  },
  components: { ScrollBar },
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
  font-size: 14px;
  width: 100%;
  // max-height: 130px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 3px;
  position: absolute;
  z-index: 9;
  margin-top: 1px;
  .scroll-area{
    overflow-y: auto;
  }
  &.top {
    top: -152px;
    margin-bottom: 1px;
  }
  li {
    line-height: 2rem;
    height: 2rem;
    padding-left: 10px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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