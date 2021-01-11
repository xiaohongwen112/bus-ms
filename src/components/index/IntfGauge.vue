<template>
  <div class="per-intf-gauge">
    <svg class="per-intf-ring" width="80" height="80" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0,0,80,80" preserveAspectRatio="none">
      <g class="intf-gauge-group" transform="translate(40,40)">
        <path fill="#1b252d" :d="arcBg"></path>
        <path :fill="healthStatus.color" :d="arcRing"></path>
        <text class="intf-health-status" text-anchor="middle">
          <tspan class="ring-text" dy="8" :fill="healthStatus.color" >{{ healthStatus.text }}</tspan>
        </text>
      </g>
    </svg>
    <div class="show-name" data-msg="true" @mouseover="showWhole($event, name)"  @mouseout="hideTip">{{ name }}</div>
  </div>
</template>

<script>
  import { arc } from 'd3';
  import { translateHealth, textWidth } from '@/helpers/utils';

  export default {
    name: 'intf-gauge',
    props: {
      radius: {
        type: Number,
        default: 40,
      },
      data: {
        type: Object,
        default() {
          return {
            disp_name: '',
            health: {
              health_stat: 40,
              time: 1521448140,
            },
            name: '',
          };
        },
      },
      inftTopChange: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {};
    },
    watch: {},
    computed: {
      health() {
        return Number(!this.data.monitor_status ? 0 : this.data.health.health_stat);
      },
      name() {
        return this.data.disp_name;
      },
      innerRadius() {
        return this.radius - 6;
      },
      outerRadius() {
        return this.radius;
      },
      arcBg() {
        return arc().startAngle(0).endAngle(2 * Math.PI)
          .innerRadius(this.innerRadius)
          .outerRadius(this.outerRadius)();
      },
      arcRing() {
        return arc().startAngle(0).endAngle(this.health / 100 * 2 * Math.PI)
          .innerRadius(this.innerRadius)
          .outerRadius(this.outerRadius)();
      },
      healthStatus() {
        if (this.data.monitor_status) return translateHealth(this.health);
        return {
          color: '#061A2B',
          text: '未监控',
        };
      },
    },
    methods: {
      showWhole(e, name) {
        if (textWidth(name) >= 70) {
          const ele = e.target.parentNode;
          const position = {
            flag: true,
            left: ele.getBoundingClientRect().left,
            top: ele.getBoundingClientRect().top + 62,
            tipName: name,
          };
          if (this.inftTopChange) position.top -= 22;
          this.$emit('showTip', position);
        }
      },
      hideTip() {
        this.$emit('hideTip');
      },
    },
    mounted() {},
  };
</script>

<style lang="scss" scoped>
  .per-intf-gauge{
    width: 80px;
    height: calc(100% - 16px);
    display: inline-block;
    margin: 8px 16px;

    .ring-text{
      fill: #ecefee !important;
      font-size: 18px;
    }
    .show-name{
      text-align: center;
      color: #ecefee;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      height: 36px;
      line-height: 36px;
      font-size: 16px;
    }
  }
  @media (max-height: 700px) {
    .per-intf-gauge{
      width: 65px;
      margin: 2px 16px;
      height: calc(100% - 26px);
      svg{
        width: 65px !important;
        height: 65px !important;
      }
      .show-name{
        height: 14px;
        line-height: 14px;
        font-size: 14px;
      }
    }
  }
</style>
