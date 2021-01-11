<template>
  <div class="app-items dash-board">
    <svg class="ring-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" :succ-value="`${Number(value.toFixed(2))}%`"
      @mouseover="showWhole($event, `${Number(value.toFixed(2))} %`)" @mouseout="hideTip">
      <defs>
        <filter :id="filter=='filter'?'shadowFilter':'shadowFilterSSS'" x="0" y="0" width="500%" height="500%">
          <feOffset result="offOut" in="SourceGraphic" dx="2" dy="2"></feOffset>
          <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.2 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0 0 10 0 0 0"></feColorMatrix>
          <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="1"></feGaussianBlur>
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>
        </filter>
      </defs>
      <g class="ring-g" :transform="arcTrans">
        <path :filter="filter=='filter'?'url(#shadowFilter)':'url(#shadowFilterSSS)'" class="bottom-arc" stroke-width="1" fill="#2b313a" stroke="#24272b" :d="arcBottomD"></path>
        <path class="data-arc" :fill="filter=='filter'?'url(#gradient)':'url(#gradientSSS)'" stroke="#056b8b" :d="arcTopD"></path>
      </g>
      <g :transform="pointerTrans" class="ring-pointer">
        <path fill="#1F2324" stroke="none" :d="pointerD" stroke-width="0"></path>
      </g>
    </svg>
  </div>
</template>
<script>
  import * as d3 from 'd3';

  export default {
    name: 'DashBoard',
    props: {
      width: { type: Number, isRequired: true }, // 容器宽度
      height: { type: Number, isRequired: true }, // 容器高度
      value: { type: Number, isRequired: true }, // 仪表盘值
      filter: { type: String, default: 'filter' }, // 滤镜
    },
    watch: {
      value(newV) {
        this.drawRing(this.width, this.height, newV);
      },
    },
    data() {
      return {
        arcTrans: '',
        arcBottomD: '',
        arcTopD: '',
        pointerTrans: '',
        pointerD: '',
      };
    },
    methods: {
      drawRing(width, height, value) {
        const pieData = {
          startAngle: -1,
          endAngle: 1,
        };
        let pieData2;
        const bashConW = width / 2;
        const bashConH = height - 3;
        const outerRadius = height - 5;
        const innerRadius = height / 2;
        const linear = d3.scaleLinear().domain([0, 100]).range([-1, 1]); // 新建的比例尺。
        const valueNew = linear(value);
        const rotateNew = valueNew / Math.PI * 180;
        if (value !== 0) {
          pieData2 = { startAngle: -1, endAngle: valueNew };
        } else {
          pieData2 = {};
        }
        const arc = d3.arc()// 生成弧生成器
          .outerRadius(outerRadius)
          .innerRadius(innerRadius);

        this.arcTrans = `translate(${bashConW},${bashConH})`;
        this.arcBottomD = arc(pieData);
        if (JSON.stringify(pieData2) !== '{}') {
          this.arcTopD = arc(pieData2);
        } else {
          this.arcTopD = '';
        }
        this.pointerTrans = `translate(${bashConW},-2) rotate(${rotateNew},-2,${+(bashConW + 1)})`;
        this.pointerD = `M 0,0 Q 4,${bashConH} 0,${bashConH} Q -4,${bashConH} 0,0`;
      },
      showWhole(e, num) {
        const ele = e.target.parentNode;
        const position = {
          left: ele.getBoundingClientRect().left,
          top: ele.getBoundingClientRect().top - 335,
          tipName: num,
        };
        this.$emit('showTip', position);
      },
      hideTip() {
        this.$emit('hideTip');
      },
    },
    mounted() {
      this.drawRing(this.width, this.height, this.value);
    },
  };
</script>
