<template>
  <div class="cm-textarea">
    <textarea :class="[classType, {'disable': disable}]" :value="value" :style="`width: ${width}px`" :maxlength="maxlength" :disabled="disable" @input="onInput"/>
  </div>
</template>
<script>
  
  export default{
    name: 'Textarea',
    props: {
      type: { type: String, default: 'system' },
      value: { type: String, isRequired: true },
      width: { type: Number, default: 200 },
      maxlength: { type: Number, default: 255 },
      disable: { type: Boolean, default: false },
    },
    watch: {
      value(val) {
        this.currentValue = val;
      },
    },
    computed: {
      classType() {
        return this.classIndex[this.type];
      },
    },
    data() {
      return {
        currentValue: this.value,
        classIndex: {
          system: 'system',
          popsUp: 'popsUp',
        },
      };
    },
    methods: {
      onInput(e) {
        this.$emit('input', e.target.value);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .cm-textarea{
    display:inline-block;
    vertical-align:baseline;
    position:relative;
    textarea{
      font-family: "Noto Sans S Chinese", "SourceHanSansCN-Normal", sans-serif, Arial !important;
      font-size: 14px;
      min-width: 200px;
      height:78px;
      padding: 3px 10px;
      color: #ddd;
      border-radius: 3px;
      font-size:14px;
      background-color: transparent;
      box-sizing:border-box;
      vertical-align: text-top;
      resize: none;
      &::-webkit-scrollbar {
        width: 5px;
      }
      &::-webkit-scrollbar-thumb{
        background: #1d5d82;
        border: 1px solid #070f16;
      }
      &::-webkit-scrollbar-track-piece{
        background-color: #070f16;
        border-left: 1px solid #070f16;
        border-radius: 3px;
      }
      &.system{
        border: 1px solid #4ab2a5;
      }
      &.popsUp{
        border: 1px solid #223f5d;
      }
      &:focus,&:active{
        outline:none;
      }
      &:focus{
        border-color: #14cef5;
        box-shadow: 0 0 5px #096679 inset;
      }
      &.disable{
        border: 1px solid #212b33;
      }
    }
  }
</style>