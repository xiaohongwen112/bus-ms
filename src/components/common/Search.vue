<template>
  <div class="cm-search">
    <input :value="currentValue" :placeholder="placeholder" @input="onInput" @keyup.enter="onSearch"/>
    <i class="icon" :class="icon" @click="onSearch"></i>
  </div>
</template>

<script>
  import '../../assets/css/iconbms.css';
  
  export default{
    name: 'Search',
    props: {
      value: { type: String, isRequired: true },
      placeholder: { type: String, default: '请输入要搜索的关键词' },
      icon: { type: String, default: 'icon-bms-search' },
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
      width:230px;
      height:32px;
      line-height:30px;
      padding-right: 35px;
      padding-left:10px;
      border: 1px solid #48b1ac;
      font-size:16px;
      color: #C6D0E2;
      background-color: #071119;
      box-sizing:border-box;
      &:focus,&:active{
        outline:none;
      }
    }
    .icon{
      font-size: 22px;
      color: #48b1ac;
      position: absolute;
      top: 1px;
      right: 0;
      width: 30px;
      height: 30px;
      background-color: rgba(72, 177, 172, 0.3);
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
  }
</style>