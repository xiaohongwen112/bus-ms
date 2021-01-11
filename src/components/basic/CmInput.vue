<template>
  <div class="cm-input">
    <input :class="[{'error': errorFlag}, {'disable': disable}, classType ]" :disabled="disable" :value="value" :style="`width: ${width}px`"
    :maxlength="maxlength" :placeholder="placeholder" :type="inputType" :title="title"
    @keyup="onKeyUp" @blur="onBlur" @input="onInput" @change="onChange($event)"
    @mouseover="onMouseover" @mouseout="onMouseout"/>
    <i v-if="correctFlag" class="sear-icon"></i>
    <span v-if="tipFlag" class="error-tip">{{tipMessage}}</span>
  </div>
</template>

<script>
  
  export default{
    name: 'Input',
    props: {
      type: { type: String, default: 'system' },
      title: { type: String, default: ' ' },
      value: { type: [String, Number], isRequired: true },
      correctFlag: { type: Boolean, default: false },
      errorFlag: { type: Boolean, default: false },
      tipFlag: { type: Boolean, default: false },
      tipMessage: { type: String, default: '' },
      width: { type: Number, default: 200 },
      maxlength: { type: Number, default: 10 },
      disable: { type: Boolean, default: false },
      placeholder: { type: String, default: '' },
      inputType: { type: String, default: '' },
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
      onKeyUp() {
        this.$emit('keyUp');
      },
      onBlur() {
        this.$emit('blur');
      },
      onChange(e) {
        const val = e.target.value;
        this.$emit('on-change', val);
      },
      onMouseover(e) {
        this.$emit('mouseover', e);
      },
      onMouseout(e) {
        this.$emit('mouseout', e);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .cm-input{
    display:inline-block;
    vertical-align:baseline;
    position:relative;
    input{
      font-size: 14px;
      min-width: 100px;
      height:30px;
      line-height:30px;
      color: #ddd;
      padding-right: 22px;
      padding-left:8px;
      border-radius: 3px;
      font-size:14px;
      background-color: transparent;
      box-sizing:border-box;
      &:focus,&:active{
        outline:none;
      }
      &.system{
        border: 1px solid #4ab2a5;
      }
      &.popsUp{
        border: 1px solid #223f5d;
      }
      &:focus{
        border-color: #14cef5;
        box-shadow: 0 0 5px #096679 inset;
      }
      &.disable{
        border: 1px solid #212b33;
      }
      &.error{
        border: 1px solid red;
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
      bottom: 3px;
      right: 5px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      background: url(../../assets/common/correct.svg) no-repeat center;
    }
    .error-tip{
      position: absolute;
      bottom: 7px;
      right: 7px;
      font-size: 12px;
      color: red;
      box-shadow: none;
    }
  }
</style>