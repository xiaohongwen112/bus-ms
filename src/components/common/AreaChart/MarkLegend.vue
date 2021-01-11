<template>
  <foreignObject :x="x" :y="legendY" :width="width" :height="height">
    <ul :class="`legend-group ${style}`" ref="ul">
      <li v-for="(item, index) in legend" :key="index">
        <!--<svg :width="r" :height="r" :viewBox="`0 0 ${r} ${r}`">-->
          <!--<rect :width="r" :height="r" x="0" y="0" :fill="color[index]"></rect>-->
        <!--</svg>-->
        <span class="icon" v-if="type === 'rect'" :style="`width: ${r}px; height: ${r}px; background: ${color[index]}`"></span>
        <span class="icon ring" v-if="type === 'circle'" :style="`width: ${r}px; height: ${r}px; background: ${color[index]}`"></span>
        <span class="icon line" v-if="type === 'line'" :style="`width: ${r}px; background: ${color[index]}`"></span>
        <span :style="`color: ${color[index]}`">{{ `${item}${getUnit(index)}` }}</span>
      </li>
    </ul>
  </foreignObject>
</template>

<script>

  export default {
    name: 'mark-legend',
    components: {
    },
    props: {
      type: {
        type: String,
        default: 'rect', // 'line' 'circle'
      },
      pos: {
        type: String,
        default: 'top-center',
      },
      r: {
        type: Number,
        default: 10,
      },
      x: {
        type: Number,
        default: 10,
      },
      y: {
        type: Number,
        default: 10,
      },
      width: {
        type: Number,
        default: 600,
      },
      height: {
        type: Number,
        default: 20,
      },
      legend: {
        type: Array,
        default() {
          return [];
        },
      },
      unit: {
        type: Array,
        default() {
          return [];
        },
      },
      color: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        legendY: this.y,
      };
    },
    watch: {
      y() {
        this.legendY = this.y;
      },
    },
    computed: {
      style() {
        return this.pos.split('-')[1];
      },
      position() {
        return this.pos.split('-')[0];
      },
      showUnit() {
        return this.unit.length;
      },
      legendUnit() {
        const length = this.legend.length;
        if (this.unit.length !== length) {
          return Array.from({ length }, () => this.unit[0]);
        }
        return this.unit;
      },
    },
    methods: {
      setPos() {
        const height = this.$refs.ul.clientHeight;
        this.legendY = this.position === 'top' && height > this.height ? this.y - (height - this.height) : this.y;
        this.legendY = this.legendY < 0 ? 0 : this.legendY;
      },
      getUnit(index) {
        if (this.showUnit) {
          return `（${this.legendUnit[index]}）`;
        }
        return '';
      },
    },
    mounted() {
      setTimeout(() => this.setPos(), 0);
    },
  };
</script>

<style lang="scss" scoped>
  .legend-group{
    padding: 0;
    margin: 0;
    text-align: center;

    li{
      display: inline-block;
      margin-right: 10px;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .icon{
        display: inline-block;
      }

      .ring{
        border-radius: 50%;
      }

      .line{
        margin-bottom: 4px;
        height: 2px;
      }

      svg{
        display: inline-block;
        vertical-align: middle;
      }
    }

  }
  .legend-group.left{
    text-align: left;
  }
  .legend-group.center{
    text-align: center;
  }
  .legend-group.right{
    text-align: right;
  }
</style>
