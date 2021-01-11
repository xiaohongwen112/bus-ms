<template>
  <svg class="liquid-gauge-svg"  @click="handleClick">
    <g class="wave-group" :style="`transform: translate(${cx}px,${cy}px)`">
      <defs>
        <clipPath :id="waveId">
          <path :d="wavePath" :style="`transform: translate(-${waveTranslateX}px,${waveTranslateY}px)`">
            <animateMotion v-if="waveAnimate" :path="animatePath" begin="0s" :dur="`${waveAnimateTime}s`" repeatCount="indefinite"/>
          </path>
        </clipPath>
      </defs>
      <circle :clip-path="`url(#${waveId})`" :cx="radius" :cy="radius" :r="radius" :fill="waveColor"></circle>
      <text
        v-if="showText"
        class="liquid-gauge-text"
        ref="text"
        :transform="`translate(${radius},${textY})`"
        :fill="textColor"
        text-anchor="middle"
        :font-size="textSize"
        :font-weight="textWeight"
      >{{ text }}</text>
      <text
        v-if="showPercent"
        class="liquid-gauge-percent"
        ref="percent"
        :transform="`translate(${radius},${percentY})`"
        :fill="textColor"
        text-anchor="middle"
        :font-size="textSize"
        :font-weight="textWeight"
      >{{ percent }}</text>
    </g>
    <image
      v-if="showGlass"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xlink:href="../../../assets/customView/popos.svg"
      :width="radius * 2"
      :height="radius * 2"
      x="0"
      y="0"
      preserveAspectRatio="none meet"
      style="pointer-events: none;"
      ></image>
    <slot name="clock"></slot>
  </svg>
</template>
<script>
  import * as d3 from 'd3';

  export default {
    name: 'liquid-gauge',
    props: {
      id: {
        type: String,
        default: 'test',
      },
      radius: {
        type: Number,
        default: 60,
      },
      centerX: {
        type: Number,
      },
      centerY: {
        type: Number,
      },
      showPercent: {
        type: Boolean,
        default: false,
      },
      showText: {
        type: Boolean,
        default: true,
      },
      percent: {
        type: Number,
        default: 0.4,
      },
      text: {
        type: String,
        default: '',
      },
      waveAnimate: {
        type: Boolean,
        default: true,
      },
      waveAnimateTime: {
        type: Number,
        default: 2,  // s为单位
      },
      waveHeightPercent: {
        type: Number,
        default: 0.2,
      },
      waveCount: {
        type: Number,
        default: 1,
      },
      waveColor: {
        type: String,
        default: '#178BCA',
      },
      textColor: {
        type: String,
        default: '#eee',
      },
      textSize: {
        type: String,
        default: '23px',
      },
      textWeight: {
        type: String,
        default: 'bold',
      },
      showGlass: {
        type: Boolean,
        default: false,
      },
      textVertPosition: {
        type: Number,
        default: 0.5,
      },
    },
    data() {
      return {
        maxValue: 100,
        minValue: 0,
        valueCountUp: true,
        textY: 0,
        percentY: 0,
        cx: 0,
        cy: 0,
      };
    },
    watch: {
      centerX() {
        this.cx = this.centerX - this.radius;
        this.cy = this.centerY - this.radius;
        this.setTextPos();
      },
      percent() {
        if (this.showPercent) {
          this.setTextPos();
        }
      },
      text() {
        if (this.showText) {
          this.setTextPos();
        }
      },
    },
    computed: {
      textRiseScaleY() {
        return d3.scaleLinear().range([this.radius * 2, parseInt(this.textSize, 10) * 0.7]).domain([0, 1]);
      },
      diameter() {
        return this.radius * 2;
      },
      waveId() {
        return `waveClip${this.id}`;
      },
      waveClipCount() {
        return 1 + this.waveCount;
      },
      waveClipWidth() {
        return this.diameter / this.waveCount * this.waveClipCount;
      },
      waveHeightScale() {
        return d3.scaleLinear().range([0, this.waveHeightPercent, 0]).domain([0, 50, 100]);
      },
      waveScaleX() {
        return d3.scaleLinear().range([0, this.waveClipWidth]).domain([0, 1]);
      },
      waveScaleY() {
        return d3.scaleLinear().range([0, this.waveHeight]).domain([0, 1]);
      },
      waveHeight() {
        return this.radius * this.waveHeightScale(this.percent * 100);
      },
      waveArea() {
        return d3.area()
          .x(d => this.waveScaleX(d.x))
          .y0(d => this.waveScaleY(Math.sin(Math.PI * 2 * (1 - this.waveCount + d.y))))
          .y1(this.radius * 2 + this.waveHeight);
      },
      waveData() {
        const coefficient = 40;
        const max = coefficient * this.waveClipCount;
        const data = [];
        for (let i = 0; i <= max; i += 1) {
          data.push({ x: i / max, y: i / coefficient });
        }
        return data;
      },
      wavePath() {
        return this.waveArea(this.waveData);
      },
      waveTranslateX() {
        return this.waveClipWidth - this.diameter;
      },
      waveTranslateY() {
        return this.diameter * (1 - this.percent);
      },
      animatePath() {
        return `M0,0 L${this.waveTranslateX},0`;
      },
    },
    methods: {
      setTextPos() {
        if (this.showText && this.showPercent) {
          this.textY = this.radius + this.cy;
          this.percentY = this.radius + this.$refs.text.getBBox().height + this.cy;
        } else if (this.showText && !this.showPercent) {
          // this.textY = this.radius - this.$refs.text.getBBox().height / 2 + this.cy;
          this.textY = this.textRiseScaleY(this.textVertPosition);
        } else if (!this.showText && this.showPercent) {
          this.percentY = this.radius - this.$refs.percent.getBBox().height / 2 + this.cy;
        }
      },
      setGaugePos() {
        if (this.centerX === undefined && this.centerY === undefined) {
          const svgBox = this.$el.getBoundingClientRect();
          this.cx = (svgBox.width - this.diameter) / 2;
          this.cy = (svgBox.height - this.diameter) / 2;
          this.setTextPos();
        }
      },
      handleClick() {
        this.$emit('click');
      },
    },
    mounted() {
      this.setGaugePos();
    },
  };
</script>

<style lang="scss" scoped>
  .liquid-gauge-svg{
    width: 100%;
    height: 100%;
  }

</style>
