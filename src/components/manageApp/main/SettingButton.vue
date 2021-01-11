<template>
    <div class="button-style" :class="Visit ? '' : 'disable'" @click="operate">
        {{title}}
    </div>
</template>
<script>
export default {
  props: ['title'],
  methods: {
    operate() {
      if (this.Visit) {
        this.$emit('onClick', '1');
      }
    },
  },
  data() {
    return {
      Visit: true,
    };
  },
  mounted() {
    switch (this.title) {
      case '交易总览':
        this.Visit = this.session$.newpermissions.trade_overview_detail;
        break;
      case '规则列表':
        this.Visit = this.session$.newpermissions.rule_list_detail;
        break;
      case '查看报表':
        this.Visit = this.session$.newpermissions.statement_detail;
        break;
      default:
        break;
    }
  },
};
</script>
<style lang="scss" scoped>
.button-style {
    height: 28px;
    line-height: 28px;
    text-align: center;
    padding: 0 18px;
    border: 1px solid #00C3E7;
    color: #00C3E7;
    font-size: 16px;
    display: inline-block;
    border-radius: 15px;
    margin-right: 10px;
    cursor: pointer;
    &:hover {
      background: rgba(0,195,231,0.5);
      color: #eee;
    }
}
.disable{
    background: #666 !important;
    color: #eee;
    border-color:  #666;
    cursor: default;
}
</style>
