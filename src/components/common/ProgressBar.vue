<template>
  <svg :height="height" :width="width" :viewBox="'0 0 ' + width + ' ' + height">
    <defs>
      <pattern x="0" y="0" width="12" height="100%" patternUnits="userSpaceOnUse" :id="id + 'Pattern'">
        <image xmlns:xlink="http://www.w3.org/1999/xlink"  xlink:href="../../assets/common/barLineBg.png" x="0" y="0" width="12" height="100%"></image>
      </pattern>
      <linearGradient x1="0%" x2="100%" y1="0%" y2="0%"  :id="id + 'Color'">
        <stop offset="0%" :stop-color="startColor"></stop>
        <stop offset="100%" :stop-color="newStopColor"></stop>
      </linearGradient>
    </defs>
    <g>
      <rect x="1" y="1" :rx="rx" :ry="rx" :width="bgWidth" :height="barHeight" :fill="colorBg"></rect>
      <rect x="1" y="1" :rx="rx" :ry="rx" :width="barWidth" :height="barHeight" :fill="'url(#' + id + 'Color)'"></rect>
      <rect x="1" y="1" :rx="rx" :ry="rx" :width="barWidth" :height="barHeight" :fill="'url(#' + id + 'Pattern)'"></rect>
    </g>
  </svg>
</template>

<script>
  export default {
    name: 'progress-bar',
    props: {
      percent: {
        type: Number,
        default: 0,
      },
      width: {
        type: Number,
        default: 100,
      },
      height: {
        type: Number,
        default: 10,
      },
      startColor: {
        type: String,
        default: '#000',
      },
      stopColor: {
        type: String,
        default: '#FFF',
      },
      id: {
        type: String,
        default: 'gradient',
      },
      colorBg: {
        type: String,
        default: '#000',
      },
    },
    data() {
      return {
        startRgb: this.hexToRgba(this.startColor, 1),
        stopRgb: this.hexToRgba(this.stopColor, 1),
        newPercent: this.percent > 1 ? 1 : this.percent,
      };
    },
    watch: {
      percent() {
        this.newPercent = this.percent > 1 ? 1 : this.percent;
      },
    },
    computed: {
      bgWidth() {
        return this.width - 2;
      },
      barHeight() {
        return this.height - 2;
      },
      barWidth() {
        return (this.width - 2) * this.newPercent;
      },
      rx() {
        return this.barHeight / 2 - 1;
      },
      newStopColor() {
        const middleColor = this.middleColor(this.startRgb, this.stopRgb, this.newPercent);
        return `rgb(${middleColor.r},${middleColor.g},${middleColor.b})`;
      },
    },
    methods: {
      hexToRgba(hex, al) {
        let hexColor = /^#/.test(hex) ? hex.slice(1) : hex;
        const alp = hex === 'transparent' ? 0 : Math.ceil(al);
        let r;
        let g;
        let b;
        hexColor = /^[0-9a-f]{3}|[0-9a-f]{6}$/i.test(hexColor) ? hexColor : 'fffff';
        if (hexColor.length === 3) {
          hexColor = hexColor.replace(/(\w)(\w)(\w)/gi, '$1$1$2$2$3$3');
        }
        r = hexColor.slice(0, 2);
        g = hexColor.slice(2, 4);
        b = hexColor.slice(4, 6);
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);
        return {
          hex: `#${hexColor}`,
          alpha: alp,
          rgba: `rgba(${r}, ${g}, ${b}, ${(alp / 100).toFixed(2)})`,
          rgb: `rgb(${r}, ${g}, ${b})`,
          r,
          g,
          b,
        };
      },
      middleColor(color1, color2, percent) {
        return {
          r: parseInt((color2.r - color1.r) * percent, 10) + color1.r,
          g: parseInt((color2.g - color1.g) * percent, 10) + color1.g,
          b: parseInt((color2.b - color1.b) * percent, 10) + color1.b,
        };
      },
    },
  };
</script>

<style lang="scss" scoped>

</style>
