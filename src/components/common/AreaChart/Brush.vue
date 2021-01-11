<template>
  <g class="brush-group" :transform="`translate(${margin.left},${margin.top - 10})`">
    <path
      :d="area(data[0])"
      stroke-width="2"
      fill="#284b96"
    ></path>
    <g class="brush" ref="brush"></g>

    <g>
      <text :x="startX" y="8" fill="#80a2a6" class="w-brush-text" ref="start">{{ start }}</text>
      <text :x="endX" y="22" fill="#80a2a6" class="e-brush-text" ref="end">{{ end }}</text>
    </g>

  </g>
</template>

<script>
  import { select, scaleLinear, area, brushX, event } from 'd3';

  export default {
    name: 'brush',
    components: {
    },
    props: {
      id: {
        type: String,
        default: 'line',
      },
      width: {
        type: Number,
        default: 0,
      },
      height: {
        type: Number,
        default: 40,
      },
      xMarks: {
        type: Array,
        default() {
          return [];
        },
      },
      data: {
        type: Array,
        default() {
          return [];
        },
      },
      minData: {
        type: Number,
        default: 0,
      },
      maxData: {
        type: Number,
        default: 100,
      },
      margin: {
        type: Object,
        default() {
          return {
            top: 30,
            right: 40,
            bottom: 40,
            left: 70,
          };
        },
      },
    },
    data() {
      return {
        selection: [],
        startX: 0,
        endX: 0,
        brushHeight: 25,
        domain: [],
      };
    },
    watch: {
      selection() {
        this.setTextPos();
      },
      width() {
        this.setBrush();
      },
      data() {
        this.init();
      },
    },
    computed: {
      x() {
        return scaleLinear().range([0, this.width]).domain([0, (this.xMarks.length === 1) ? 1 : this.xMarks.length - 1]);
      },
      y() {
        return scaleLinear().range([this.height, 0]).domain([this.minData, this.maxData]);
      },
      area() {
        return area().x((d, i) => this.x(i)).y0(this.height).y1(d => this.y(d));
      },
      brush() {
        return brushX().extent([[0, 0], [this.width, this.brushHeight]])
          .on('start', this.brushStart)
          .on('brush', this.brushIng)
          .on('end', this.brushEnd);
      },
      start() {
        return this.xMarks[Math.floor(this.domain[0])];
      },
      end() {
        return this.xMarks[Math.floor(this.domain[1])];
      },
    },
    methods: {
      init() {
        this.selection = [];
        this.startX = 0;
        this.endXx = 0;
        this.domain = [];
        this.setBrush();
        select(this.$el).selectAll('.handle').style('display', 'none');
        select(this.$el).select('.selection').style('width', '0');
      },
      brushStart() {
        this.$emit('brushStart', {
          domain: this.getDomain(),
        });
      },
      brushIng() {
        this.$emit('brush', {
          domain: this.getDomain(),
        });
      },
      brushEnd() {
        this.$emit('brushEnd', {
          domain: this.getDomain(),
        });
      },
      getDomain() {
        if (event.selection !== null) {
          this.selection = event.selection;
          const xLength = (this.xMarks.length === 1) ? 1 : this.xMarks.length - 1;
          this.domain = [this.selection[0] / this.width * xLength, this.selection[1] / this.width * xLength];
        }
        return this.domain;
      },
      setBrush() {
        select(this.$refs.brush).call(this.brush);
        if (this.selection.length !== 0) {
          const xLength = (this.xMarks.length === 1) ? 1 : this.xMarks.length - 1;
          const newSelection = [this.domain[0] / xLength * this.width, this.domain[1] / xLength * this.width];
          select(this.$refs.brush).call(this.brush.move, newSelection);
        }
      },
      setTextPos() {
        if (this.selection.length) {
          const offset = 8;
          const startX = this.selection[0];
          const endX = this.selection[1];
          const startWidth = this.$refs.start.getBBox().width;
          const endWidth = this.$refs.start.getBBox().width;
          this.startX = startX < startWidth && startWidth > this.margin.left ? startX + offset : startX - startWidth - offset;
          this.endX = endX > this.width && endWidth > this.margin.right ? endX - endWidth - offset : endX + offset;
        }
      },
    },
    mounted() {
      this.setBrush();
      this.setTextPos();
    },
  };
</script>

<style lang="scss">
  .brush {

    .overlay{
      fill: rgba(15, 43, 65,0.5);
    }
    .selection{
      fill: rgba(27,66,90,0.9);
      stroke: none;
    }
    .handle{
      fill: #278fa3;
      rx: 5;
      ry: 5;
    }
  }
</style>
