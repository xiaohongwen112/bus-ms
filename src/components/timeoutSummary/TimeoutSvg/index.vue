<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="out-detail-svg"
   :viewBox="`0 0 ${1000 * size} ${250 * size}`">
    <g>
      <TopTime :times="times.slice(0, 2)"/>
      <TopTime :times="times.slice(2, 4)" transform="translate(220, 0)"/>
      <g transform="translate(0, 15)">
        <g class="node-grop">
          <Node v-for="(node, index) in nodeList" :key="`node-${index}`" :name="node" :transform="`translate(${220 * index}, 0)`"/>
        </g>
        <g class="arrow-grop">
          <Arrow v-for="(arrow, index) in Array.from({length: 4})" :key="`arrow-${index}`"
            :class="`arrow-${Math.ceil((index+1) / 2)}`"
            :transform="`translate(${220 * index}, 0)`" />
        </g>
        <g class="text-group"  transform="translate(18, 0)" text-anchor="middle">
          <text transform="matrix(1 0 0 1 367 68.6668)">
            <tspan x="0" y="0" class="st16 st17 st18">间隔时间</tspan>
            <tspan x="0" y="13.2" class="st16 st17 st18">{{ times[8] }}ms</tspan>
          </text>
          <text transform="matrix(1 0 0 1 578 118.6668)">
            <tspan x="0" y="0" class="st12 st17 st18">间隔时间</tspan>
            <tspan x="0" y="13.2" class="st12 st17 st18">{{ times[9] }}ms</tspan>
          </text>
        </g>
      </g>
      <g transform="translate(0, 30)">
        <BottomTime :times="times.slice(4, 6)"/>
        <BottomTime :times="times.slice(6)" transform="translate(220, 0)"/>
      </g>
    </g>
  </svg>
</template>
<script>
import Node from './Node';
import Arrow from './Arrow';
import TopTime from './TopTime';
import BottomTime from './BottomTime';

export default {
  name: 'TimeoutSvg',
  components: {
    Node,
    Arrow,
    TopTime,
    BottomTime,
  },
  props: {
    times: {
      type: Array,
      default() {
        return ['--', '--', '--', '--', '--', '--', '--', '--', '--', '--'];
      },
    },
  },
  data() {
    return {
      nodeList: ['MBFE上行', '上行CCPC', 'NPC', '下行CCPC', 'MBFE下行'],
      width: 1000,
      height: 250,
      size: 1,
    };
  },
  computed: {
    translateX() { return (this.width - 1000) / 2; },
    translateY() { return (this.height - 250) / 2; },
  },
  methods: {
    getClientRect() {
      const clientRect = this.$el.getBoundingClientRect();
      console.log(clientRect);
      this.width = clientRect.width;
      this.height = clientRect.height;
      this.size = Math.min(this.width / 1000, this.height / 250);
    },
  },
  mounted() {
    // this.getClientRect();
    // this.$nextTick(() => {
    // });
    // window.addEventListener('resize', this.getClientRect());
  },
};
</script>
<style>
  svg{
    width: calc(100% - 80px);
    height: 100%;
    margin: 0 40px;
  }
  .st0{fill:rgba(42,180,163, 0.4);stroke:#B0D4E0;stroke-width:2;stroke-miterlimit:10;}
  .st1{fill:none;stroke:#B0D4E0;stroke-width:2;stroke-miterlimit:10;}
  .st2{fill:#EEEEEE;}
  .st3{font-family:'MicrosoftYaHei';}
  .st4{font-size:14px;}
  .st5{fill:none;stroke:#FFFFFF;stroke-width:0.8;stroke-miterlimit:10;}
  .st6{fill:#FFFFFF;}
  .st7 {fill: #6FC5C3;}
  .st8{fill:none;stroke:#6FC5C3;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
  .st9{opacity:0.2;fill:#FFFFFF;}
  .st10{opacity:0.2;fill:none;stroke:#FFFFFF;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
  .st11{fill:none;stroke:#34A1DC;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
  .st12{fill:#34A1DC;}
  .st13{fill:#B0D4E0;}
	.st14{font-size:11px;}
	.st15{fill:none;stroke:#B0D4E0;stroke-miterlimit:10;}
	.st16{fill:#6EC6CE;}
	.st17{font-family:'MicrosoftYaHei-Bold';}
	.st18{font-size:12px;}
</style>
