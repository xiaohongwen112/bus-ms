<template>
  <div :class="{'round-div': true, 'round-type0': onlyRole, 'round-type1': !onlyRole}"
       :style="roundStyle"
       @click="handleClick"
  >
    <div class="main-title" v-tooltip.ellipsis="{title: text[0], placement: 'top', trigger: ['blur']}"
    >{{ text[0] }}</div>
    <div class="sub-title">{{ text[1] }}</div>
  </div>
</template>

<script>
import tooltip from '@/directive/tooltip';

export default {
  name: 'RoleRound', // 角色识别
  directives: {
    tooltip,
  },
  props: {
    onlyRole: {
      type: Boolean,
      default: true, // 0显示角色60半径， 1显示用户名和角色50半径
    },
    roleId: {
      type: Number,
      default: 0,
    },
    text: {
      type: Array,
      default() {
        return ['超级', '管理员'];
      },
    },
    active: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    roundStyle() {
      const colorDatum = ['#8AC7CA', '#E49882', '#CD93CE', '#97CB89'];
      const color = colorDatum[this.roleId];
      const styleObj = { 'background-color': color };
      if (this.shadow) {
        Object.assign(styleObj, { 'box-shadow': `0 0 25px ${color}` });
      }
      return styleObj;
    },
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
  mounted() {
    this.$emit('initResize');
  },
};
</script>

<style lang="scss" scoped>
.round-div{
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #000;
  text-align: center;
  cursor: pointer;
  font-family: "SourceHanSansCN-Normal";
  div{
    width: 100%;
    height: 50%;
  }
}
.round-type0{
  width: 120px;
  height: 120px;
  .main-title{
    height: 52%;
    font-weight: bold;
    padding-top: 28px;
    line-height: 32px;
    font-size: 32px;
    color: rgb(44, 81, 89);
  }
  .sub-title{
    height: 48%;
    padding-top: 3px;
    font-size: 20px;
    color: #000;
  }
}
.round-type1{
  width: 95px;
  height: 95px;
  color: #000;
  .main-title{
    padding-top: 25px;
    padding-left: 2px;
    line-height: 18px;
    font-size: 18px;
    width: 95%;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .sub-title{
    font-size: 18px;
  }
}
</style>
