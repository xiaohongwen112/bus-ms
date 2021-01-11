<template>
  <div class="line-all" :style="`height:${lineHeight}px`">
    <div class="pre-line" v-for="(item, index) in lineAll" :key="index"></div>
  </div>
</template>

<script>
export default{
  name: 'rule-line',
  props: {
    ProData: {
      default: {},
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  methods: {
  },
  computed: {
    lineHeight() {
      let line = 0;
      console.log(this.ProData);
      if (this.ProData.lineNum - this.ProData.parentNum > 1) {
        line = (this.ProData.lineNum - this.ProData.parentNum) * 47 - 20;
      } else {
        line = 0;
      }
      return line;
    },
    lineAll() {
      console.log(this.ProData);
      return this.ProData.lineNum - this.ProData.parentNum > 1 ? (this.ProData.lineNum - this.ProData.parentNum) : 0;
    },
  },
};
</script>


<style lang="scss" scoped>
  .line-all{
    position: absolute;
    bottom: 100px;
    left: 0;
    .pre-line{
      width: 6.5px;
      height: 48px;
      background: url(../../assets/protocol/lineConnect.png) no-repeat;
      background-size: cover;
    }
  }
</style>