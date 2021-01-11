<template>
  <div class="cm-search">
    <input @focus="focus" :style="borderStyle !== '' ? borderStyle : ''" @blur="blur" :value="currentValue" :placeholder="placeholder" @input="onInput" @keyup.enter="onSearch"/>
    <i class="sear-icon" :style="iconStyle" @click="onSearch"></i>
  </div>
</template>

<script>
  
  export default{
    name: 'Search',
    props: {
      value: { type: String, isRequired: true },
      placeholder: { type: String, default: '请输入要搜索的关键词' },
      borderStyle: { type: String, default: '' },
      iconStyle: { type: String, default: '' },
    },
    watch: {
      value(val) {
        this.currentValue = val;
      },
    },
    data() {
      return {
        currentValue: this.value,
      };
    },
    methods: {
      blur(e) {
        this.$emit('blur', e.target.value);
      },
      focus(e) {
        this.$emit('focus', e.target.value);
      },
      onInput(e) {
        this.$emit('input', e.target.value);
      },
      onSearch() {
        this.$emit('on-search', this.currentValue);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .cm-search{
    display:inline-block;
    vertical-align:baseline;
    position:relative;
    input{
      min-width: 200px;
      height:30px;
      line-height:30px;
      padding-right: 35px;
      padding-left:10px;
      border-radius: 3px;
      font-size:14px;
      background-color: #09131c;
      border: 1px solid #4ab2a5;
      box-sizing:border-box;
      color: #ddd;
      &:focus,&:active{
        outline:none;
      }
      &:focus{
        border-color: #14cef5 !important;
        box-shadow: 0 0 5px #096679 inset;
      }
      &::-webkit-input-placeholder {
        color: #4c4b4b;
      }
      &:-moz-placeholder {
        color: #4c4b4b;
      }
      &::-moz-placeholder {
        color: #4c4b4b;
      }
      &:-ms-input-placeholder {
        color: #4c4b4b;
      }
    }
    .sear-icon{
      display: inline-block;
      position: absolute;
      top: 3px;
      right: 8px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      background: url(../../assets/common/search.svg) no-repeat center;
      &:hover{
        background: url(../../assets/common/search-hover.svg) no-repeat center;
      }
    }
  }
</style>