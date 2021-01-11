<template>
  <foreignObject :x="x" :y="y" width="240" height="120" v-show="show" >
    <div class="chart-tips" ref="tip" v-html="data"></div>
  </foreignObject>
</template>

<script>

  export default {
    name: 'tooltip',
    components: {
    },
    props: {
      data: {
        type: String,
        default: '',
      },
      left: {
        type: Number,
        default: 0,
      },
      top: {
        type: Number,
        default: 0,
      },
      maxX: {
        type: Number,
        default: 0,
      },
      maxY: {
        type: Number,
        default: 0,
      },
      show: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        x: this.left,
        y: this.top,
        offsetX: 20,
        offsetY: 10,
      };
    },
    watch: {
      left() {
        this.setTipPos();
      },
      top() {
        this.setTipPos();
      },
    },
    computed: {
    },
    methods: {
      setTipPos() {
        const box = this.$refs.tip.getBoundingClientRect();
        this.x = this.maxX && this.left + box.width > this.maxX ? this.maxX - box.width - this.offsetX : this.left + this.offsetX;
        this.y = this.maxY && this.top + box.height > this.maxY ? this.maxY - box.height - this.offsetY : this.top + this.offsetY;
      },
    },
    mounted() {
      this.setTipPos();
    },
  };
</script>

<style lang="scss" scoped>
  .chart-tips{
    width: auto;
    height: auto;
    font-size: 14px;
    text-align: left;
    padding: 8px 15px;
    background-color: #444;
    opacity: 0.6;
    border-radius: 2px;
    color: #fff;
    display: inline-block;
    white-space: nowrap;
    /*div{*/
      /*height: 20px;*/
      /*line-height: 20px;*/
      /*color: rgb(190, 226, 235);*/
    /*}*/
  }
</style>
