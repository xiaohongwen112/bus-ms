<template>
  <div class="track-form">
    <ul class="from-div" :style="{height: `${formHeight}px`}">
      <TrackFormItem v-for="(item, index) in formList"
        :key="index"
        :field="item"
        @change-form="changeForm"
      ></TrackFormItem>
    </ul>
    <div :class="{'switch-div': true,'active': !isFold}" @click="switchFold">
      <i :class="isFold ? 'icon-bms-dbdown' : 'icon-bms-dbup'"></i>
    </div>
  </div>
</template>
<script>
import TrackFormItem from '@/components/stat/TrackFormItem';

export default {
  name: 'TrackForm',
  components: {
    TrackFormItem,
  },
  props: {
    fold: {
      type: Boolean,
      default: true,
    },
    formList: {
      type: Array,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      isFold: true,
      formObj: {},
      formHeight: 102,
    };
  },
  methods: {
    switchFold() {
      this.isFold = !this.isFold;
      this.formHeight = this.isFold ? 102 : 36 * Math.ceil(this.formList.length / 4) + 16;
      this.$emit('fold', this.isFold, this.isFold ? 220 : 118 + 36 * Math.ceil(this.formList.length / 4) + 16);
    },
    changeForm(val) {
      this.formObj[val.field_name] = val.field_name_value;
      this.$emit('change', this.formObj);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../assets/css/iconbms.css';

.track-form{
  width: calc(100% - 50px);
  border: 1px solid #3dd9c4;
  margin: 15px 25px;
}
.from-div{
  padding: 10px 10px 0 10px;
  overflow: hidden;
}
.switch-div{
  height: 16px;
  margin-top: 4px;
  cursor: pointer;
  &:hover{
    background: #09232f;
  }
  i{
    font-size: 12px;
    vertical-align: 4px;
    color: rgb(83, 165, 226);
  }
}
.active{
  background-color: #09232f;
}
</style>
