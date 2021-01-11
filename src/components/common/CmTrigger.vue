<template>
  <span class="on-off-group">
    <input
      type="button"
      :value="text[0]"
      @click="changeVal(text[0])"
      :class="{ 'btn-selected': val === text[0]}"
    />
    <input
      type="button"
      :value="text[1]"
      @click="changeVal(text[1])"
      :class="{ 'btn-selected': val !== text[0]}"
    />
  </span>
</template>
 
<script>

/* eslint-disable consistent-return, no-param-reassign */
export default{
  name: 'CmTrigger',
  props: {
    text: {
      type: Array,
      default() {
        return ['开启', '关闭'];
      },
    },
    val: {
      type: String,
      required: true,
    },
  },
  methods: {
    changeVal(val) {
      this.$emit('click', val);
    },
  },
};
</script>

<style lang="scss" scoped>
.on-off-group{
  display: inline-block;
  padding: 0 5%;
  color: #3dd9c4;

  input[type=button]{
    float: left;
    border: 1px solid #3dd9c4;
    // background: #071c2a;
    width: 40px;
    height: 28px;
    line-height: 28px;
    outline: none;
  }
  input[type=button]:first-child{
    margin-left: 20px;
    border-radius: 5px 0 0 5px;
  }
  input[type=button]:last-child{
    border-radius: 0 5px 5px 0;
  }

  .btn-selected{
    background: #3dd9c4;
    color: #08141b;
    // background: deepskyblue!important;
  }
}
</style>