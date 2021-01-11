<template>
  <svg :class="{'chart-svg': true, 'no-data': !hasData&&!hasBaselineData}">
    <g class="focus" :transform="`translate(${marginLeft},${marginTop})`">
      <defs ref="defs">
        <clipPath v-if="brushOpen" :id="`clipRect${id}`">
          <rect x="0" y="0" :width="focusWidth" :height="focusHeight"></rect>
        </clipPath>
        <linearGradient v-if="type === 'area'" v-for="(item, index) in pathData" :key="index"  :id="`linearGradient${id}${index}`" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :style="`stop-color:${color[index]}; stop-opacity: 0.3;`"></stop>
          <stop offset="100%" :style="`stop-color: ${color[index]}; stop-opacity: 0;`"></stop>
        </linearGradient>
      </defs>
      <g>
        <g class="x-axis axis" :transform="`translate(0,${focusHeight})`" v-if="xMarks.length === 1">
          <g class="tick" opacity="1" transform="translate(0.5,0)">
            <line stroke="#000" y2="-767"></line>
            <text fill="#000" y="10" dy="0.71em">{{ xMarks[0] }}</text>
          </g>
        </g>
        <g class="x-axis axis" ref="xAxis" :transform="`translate(0,${focusHeight})`" v-else></g>
        <g class="y-axis axis" ref="yAxis"></g>
        <g class="line-axis">
          <line class="x-line" x1="0" y1="0"  x2="0" :y2="focusHeight"></line>
          <line class="y-line" x1="0" :y1="focusHeight"  :x2="focusWidth" :y2="focusHeight"></line>
        </g>
      </g>
      <g v-if="hasData||hasBaselineData">
        <g v-if="hasData">
          <g class="path-group">
            <g v-for="(item, index) in pathData" :key="index">
              <path :d="line(item)"
                    :stroke="color[index]"
                    :clip-path="brushOpen ? `url(#clipRect${id})` : ''"
                    class="line"
                    stroke-width="1"
                    fill="none"
              ></path>
              <path v-if="type === 'area'"
                    :d="area(item)"
                    :fill="`url(#linearGradient${id}${index})`"
                    :clip-path="brushOpen ? `url(#clipRect${id})` : ''"
                    class="area"
              ></path>
              <g class="dot-group" v-if="!defaultPointShow">
                <circle v-for="(d, i) in item" :key="i"
                        v-if="showDot(d, i, item)"
                        r="1"
                        :cx="x(i)"
                        :cy="y(d)"
                        :stroke="color[index]"
                        :fill="color[index]"
                        :clip-path="brushOpen ? `url(#clipRect${id})` : ''"
                        class="dot"
                ></circle>
              </g>
              <g class="point-group" v-if="defaultPointShow">
                <mark-circle v-for="(d, i) in item" :key="i"
                            :r="markPointR"
                            :cx="x(i)"
                            :cy="y(d)"
                            :color="color[index]"
                            :type="markPointStyle"
                ></mark-circle>
              </g>

              <!--<rect v-for="(d, i) in item" :key="i"-->
                    <!--v-if="showDot(d, i, item)"-->
                    <!--:width="2"-->
                    <!--:height="2"-->
                    <!--:x="x(i) - 1"-->
                    <!--:y="y(d) - 1"-->
                    <!--:stroke="color[index]"-->
                    <!--:fill="color[index]"-->
                    <!--:clip-path="brushOpen ? `url(#clipRect${id})` : ''"-->
                    <!--class="dot"-->
              <!--&gt;</rect>-->
            </g>
          </g>
          <g class="mark-group" v-if="markHover">
            <mark-group v-for="(item, index) in xMarks" :key="index"
                        v-if="index >= xDomain[0] && index <= xDomain[1]"
                        :show="currentI === index"
                        :line="markLine"
                        :id="`mark${id}${index}`"
                        :index="index"
                        :x="x(index)"
                        :y="0"
                        :width="x(1) - x(0)"
                        :height="focusHeight"
                        @hover="hover"
                        @move="move"
                        @out="out"
            >
              <template v-if="markPoint && !defaultPointShow">
                <mark-circle :slot="`mark${id}${index}`"
                            v-show="currentI === index"
                            v-for="(d, i) in pathData"
                            :key="i"
                            :r="markPointR"
                            :cx="0"
                            :cy="y(d[index])"
                            :color="color[i]"
                            :type="markPointStyle"
                ></mark-circle>
              </template>
            </mark-group>
          </g>
        </g>
        <g class="baseline-group" v-if="baseline.show">
          <path v-for="(item, index) in baselineData" :key="index"
                :d="line(item)"
                :stroke="baselineColor[index]"
                :clip-path="brushOpen ? `url(#clipRect${id})` : ''"
                class="baseline"
                stroke-width="1"
                fill="none"
          ></path>
        </g>
      </g>
      <image v-else
      :x="0.5 * focusWidth - 44"
      :y="0.5 * focusHeight - 65"
      class="no-data-image"
      xlink:href="../../../assets/sys-icon/noStatDataImg.svg"
       ></image>
    </g>
    <mark-legend v-if="legendStyle !== 'false'"
                 :x="marginLeft"
                 :y="legendY"
                 :width="focusWidth"
                 :height="legendHeight"
                 :legend="legend"
                 :color="color"
                 :type="legendStyle"
                 :pos="legendPosition"
                 :unit="legendUnitShow ? unit : []"
    ></mark-legend>
    <mark-legend  v-if="baseline.show"
                  :x="marginLeft"
                  :y="marginTop - legendHeight"
                  :width="focusWidth"
                  :height="legendHeight"
                  :r="15"
                  :legend="baselineLegend"
                  :color="baselineColor"
                  :type="`line`"
                  :pos="`top-right`"
                  :unit="baseline.unit"
    ></mark-legend>
    <brush v-if="brushOpen"
           :id="id"
           :margin="brushMargin"
           :width="focusWidth"
           :height="25"
           :xMarks="xMarks"
           :data="pathData"
           :minData="minData"
           :maxData="maxData"
           @brush="brush"
    ></brush>
    <tooltip :data="tipInfo" :show="tipShow" :left="tipX" :top="tipY" :maxX="focusWidth + marginLeft" :maxY="focusHeight + marginTop"></tooltip>
  </svg>
</template>

<script>
  import { select, scaleLinear, scaleBand, line, area, axisBottom, axisLeft, scaleTime } from 'd3';
  import Brush from './Brush';
  import MarkLegend from './MarkLegend';
  import MarkCircle from './MarkCircle';
  import MarkGroup from './MarkGroup';
  import Tooltip from './Tooltip';

  export default {
    name: 'AreaChartTest',
    components: {
      Brush,
      MarkLegend,
      MarkCircle,
      MarkGroup,
      Tooltip,
    },
    props: {
      type: {
        type: String,
        default: 'line', // area
      },
      id: {
        type: String,
        default: 'test',
      },
      xMarks: {
        type: Array,
        required: true,
        default() {
          return [];
        },
      },
      xText: {
        type: Number,
        default: 1,
      },
      data: {
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
      legend: {
        type: Array,
        default() {
          return [];
        },
      },
      legendStyle: {
        type: String,
        default: 'rect', // false|circle line
      },
      legendPosition: {
        type: String,
        default: 'top-center', // top/bottom-left/center/right
      },
      legendUnitShow: {
        type: Boolean,
        default: false,
      },
      brushOpen: {
        type: Boolean,
        default: true,
      },
      margin: {
        type: Object,
        default() {
          return {
            top: 0,
            right: 40,
            bottom: 40,
            left: 50,
          };
        },
      },
      colorSet: {
        type: Array,
        default() {
          return ['#66e690', '#7bdb74', '#a1d271', '#82bf9a', '#e0e46e', '#c8ce81', '#83c89a', '#83c4b7', '#90a7bd',
            '#6dcde3', '#e66495', '#d46b6a', '#df8c5f', '#da9779', '#c4da77', '#b56ed2', '#a684be', '#7e7cc8', '#719ed5', '#408bd7'];
        },
      },
      baseline: {
        type: Object,
        default() {
          return {
            data: [],
            legend: [],
            show: false,
            color: [],
            unit: [],
          };
        },
      },
      markHover: {
        type: Boolean,
        default: true,
      },
      markLine: {
        type: Boolean,
        default: true,
      },
      markTip: {
        type: Boolean,
        default: true,
      },
      markPoint: {
        type: Boolean,
        default: true,
      },
      markPointR: {
        type: Number,
        default: 10,
      },
      markPointStyle: {
        type: String,
        default: 'ring', // 'circle'
      },
      defaultPointShow: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        width: 0,
        height: 0,
        legendHeight: 30,
        brushHeight: 40,
        axisHeight: 40,
        xDomain: [0, (this.xMarks.length === 1) ? 1 : this.xMarks.length - 1],
        tipInfo: '',
        tipX: 0,
        tipY: 0,
        currentI: -1,
        tipShow: false,
      };
    },
    computed: {
      marginTop() {
        return this.margin.top + (this.legendPosition.indexOf('top') > -1 ? this.legendHeight : 0);
      },
      marginRight() {
        return this.margin.right;
      },
      marginBottom() {
        let tmp = this.margin.bottom;
        if (this.brushOpen) {
          tmp += this.brushHeight;
        }
        if (this.legendPosition.indexOf('bottom') > -1) {
          tmp += this.legendHeight;
        }
        // if (this.xText > 1) {
        //   tmp += 2 * (this.xText - 1);
        // }
        return tmp;
      },
      marginLeft() {
        return this.margin.left;
      },
      focusWidth() {
        const width = this.width - this.marginLeft - this.marginRight;
        return width > 0 ? width : 0;
      },
      focusHeight() {
        const height = this.height - this.marginTop - this.marginBottom;
        return height > 0 ? height : 0;
      },
      x() {
        return scaleLinear().range([0, this.focusWidth]).domain(this.xDomain);
      },
      xTimes() {
        return scaleTime().range([0, this.focusWidth]).domain(new Date(this.xMarks[0]), new Date(this.xMarks[this.xMarks.length - 1]));
      },
      xBand() {
        return scaleBand().paddingInner(1).range([0, this.focusWidth]).domain(this.xMarks);
      },
      y() {
        return scaleLinear().range([this.focusHeight, 0]).domain([this.minData, this.maxData]);
      },
      line() {
        return line().x((d, i) => this.x(i)).y(d => this.y(d)).defined(d => d !== null);
      },
      area() {
        return area().x((d, i) => this.x(i)).y0(this.focusHeight).y1(d => this.y(d));
      },
      axisBottom() {
        // const ticksNumber = Math.ceil(this.xMarks.length / 5);
        const ticksNumber = this.xMarks.length < 5 ? this.xMarks.length - 1 : 5;
        // console.log(ticksNumber);
        // return axisBottom(this.xTimes).tickArguments([5]).tickSize(-this.focusHeight).tickPadding(10);
        return axisBottom(this.x).tickArguments([ticksNumber]).tickSize(-this.focusHeight).tickPadding(10);
        // return axisBottom(this.xBand).ticks(10).tickSize(-this.focusHeight).tickPadding(10);
      },
      axisLeft() {
        return axisLeft(this.y).ticks(5).tickSize(-this.focusWidth).tickPadding(10);
      },
      hasData() { //  检查无数据状态
        let dataFlag = false;
        this.data.forEach((d) => {
          if (d !== null) {
            dataFlag = true;
          }
        });
        return dataFlag;
      },
      hasBaselineData() { //  检查基线无数据状态
        let dataFlag = false;
        if (this.baseline.show) {
          this.baselineData.forEach((d) => {
            if (d.length === 1) {
              if (d !== null) {
                dataFlag = true;
              }
            } else {
              d.forEach((e) => {
                if (e !== null) {
                  dataFlag = true;
                }
              });
            }
          });
        }
        return dataFlag;
      },
      pathData() {  //  格式化为二维数组
        let data = this.data;
        if (!(data[0] instanceof Array)) {
          data = Array.from({ length: 1 }, () => data);
        }
        return data;
      },
      color() {
        const arr = [];
        this.pathData.forEach(() => arr.push(this.setColor(this.colorSet, arr)));
        return arr;
      },
      minData() {
        const tmpArr = Array.prototype.concat.apply([], this.pathData);
        const min = Math.min.apply(null, tmpArr);
        return min >= 0 ? 0 : min;
      },
      maxData() {
        const tmpArr = Array.prototype.concat.apply([], this.pathData);
        const max = Math.max.apply(null, [...tmpArr, ...this.baseline.data]);
        if (max === -Infinity || max === 0) {
          return 100;
        } else if (max <= 1) {
          return 1;
        } else if (max <= 10) {
          return 10;
        } else if (max <= 100) {
          return 100;
        }
        const maxSize = parseInt(Math.round(max).toString().length, 10);
        const maxCeil = Math.pow(10, maxSize - 1);
        const maxFirst = Math.ceil(max / maxCeil);
        return maxFirst < 6 ? maxFirst * maxCeil : Math.ceil(maxFirst / 2) * 2 * maxCeil;
      },
      brushMargin() {
        return { top: this.height - 25, right: this.marginRight, bottom: 0, left: this.marginLeft };
      },
      legendY() {
        return this.legendPosition.indexOf('top') > -1 ? this.marginTop - this.legendHeight : this.brushMargin.top + (this.brushOpen ? this.brushHeight : 0);
      },
      baselineData() {
        const tmp = [];
        const length = this.xMarks.length;
        this.baseline.data.forEach(d => tmp.push(Array.from({ length }, () => d)));
        return tmp;
      },
      baselineColor() {
        if (this.baseline.color.length) {
          if (this.baseline.color.length === this.baseline.data.length) {
            return this.baseline.color;
          }
          return this.baseline.color[0];
        }
        const arr = [];
        this.baselineData.forEach(() => arr.push(this.setColor(this.colorSet, arr.concat(this.color))));
        return arr;
      },
      baselineLegend() {
        return this.baseline.legend;
      },
    },
    methods: {
      getBox() {
        const box = this.$el.getBoundingClientRect();
        this.width = box.width;
        this.height = box.height;
      },
      setAxis() {
        select(this.$refs.xAxis).call(this.axisBottom).select('.domain').remove();
        select(this.$refs.yAxis).call(this.axisLeft).select('.domain').remove();
        if (this.xMarks.length > 0) {
          if (this.xText === 2) {
            const xText = select(this.$refs.xAxis).selectAll('text');
            /* eslint-disable arrow-body-style */
            xText.text('').attr('x', -5);
            xText.append('tspan').attr('dx', 0).attr('dy', 10)
                  .text(d => (typeof this.xMarks[d] !== 'undefined' ? this.xMarks[d].split(' ')[0] : ''));
            xText.append('tspan').attr('dx', -65).attr('dy', 14)
                  .text(d => (typeof this.xMarks[d] !== 'undefined' ? this.xMarks[d].split(' ')[1] : ''));
          } else {
            select(this.$refs.xAxis).selectAll('text').text(d => this.xMarks[d]);
          }
        }
      },
      brush({ domain }) {
        this.xDomain = domain;
        this.setAxis();
      },
      hover({ index }) {
        const tmp = [];
        this.pathData.forEach((d, i) => {
          const isNull = d[index] === null;
          const unit = this.unit[i] ? this.unit[i] : this.unit[0];
          tmp.push(`${this.legend[i]}：${isNull ? '--' : d[index]}${isNull ? '' : unit}<br>`);
        });
        this.tipInfo = `${this.xMarks[index]}<br>${tmp.join('')}`;
        this.tipShow = this.markTip && true;
        this.currentI = index;
      },
      move({ e }) {
        // console.log(e.layerX, e.screenX, e.x, this.$el.getBoundingClientRect().x);
        this.tipX = e.x - this.$el.getBoundingClientRect().x;
        this.tipY = e.y - this.$el.getBoundingClientRect().y;
      },
      out() {
        this.tipShow = false;
        this.currentI = -1;
      },
      setColor(colorSet, colorArr) {
        const color = colorSet[((colorSet.length - 1) * Math.random()).toFixed(0)];
        if (colorArr.indexOf(color) > -1) {
          return this.setColor(colorSet, colorArr);
        }
        return color;
      },
      showDot(d, i, item) {
        return d !== null && (i === 0 || item[i - 1] === null) && (i === item.length - 1 || item[i + 1] === null);
      },
      layout() {
        this.getBox();
        this.setAxis();
      },
    },
    watch: {
      data() {
        this.xDomain = [0, (this.xMarks.length === 1) ? 1 : this.xMarks.length - 1];
        this.setAxis();
      },
    },
    updated() {
      this.layout();
    },
    mounted() {
      this.layout();
      window.addEventListener('resize', this.layout);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.layout);
    },
  };
</script>

<style lang="scss">
  .chart-svg {
    width: 100%;
    height: 100%;
    background-color: #010c11;

    .axis {

      line {
        fill: none;
        stroke: #0d1a23;
        shape-rendering: crispEdges;
      }

      text {
        fill: #eee;
        font-size: 14px;
      }
    }

    .line-axis line {
      stroke: #00a3de;
    }
  }
  .no-data{
    pointer-events: none;
    .axis{
      line {
        stroke: #151b22;
      }
      text {
        fill: #273240;
      }
    }
    .line-axis line{
      stroke: #151b22;
    }
    .no-data-image{
      width: 88px;
    }
    .overlay,.selection, .handle{
      pointer-events: none;
    }
    
  }

</style>
