<template>
  <div :class="{ 'per-app-gauge': true, 'selected': selected}">
    <div class="app-gauge-health" ref="appGaugeHealth" @click="selectedApp">
      <svg class="app-gauge" :width="width" :height="height" :viewBox="`0,0,${width},${height}`" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="none">
        <defs v-if="isFirst">
          <pattern  v-for="(value, key) in healthObject"
                    :key="key"
                    :id="'pattern' + key"
                    x="0"
                    y="0"
                    width="8"
                    height="100%"
                    patternUnits="userSpaceOnUse">
            <rect width="8" height="100%" :fill="value.color"></rect>
            <rect width="4" height="100%" fill="rgba(75,75,75,0.15)"></rect>
            <rect x="4" width="4" height="100%" fill="rgba(0,0,0,0.15)"></rect>
          </pattern>
        </defs>
        <g class="app-gauge-group">
          <polygon class="app-gauge-polygon" :fill="`url(#pattern${healthStatus})`" :points="points" stroke="#14cff5" stroke-width="0"></polygon>
          <text class="app-gauge-name" :y="posY" :class="{'two-line': name.length > 1 }" @mouseover="showWhole($event, data.disp_name, name[1]&&name[1].includes('...'))" @mouseout="hideTip">
            <tspan v-for="(item, index) in name" :key="index" :x="posX" :dy="`${(name.length > 1 ? 1.1 : 1)}em`">{{ item }}</tspan>
          </text>
        </g>
      </svg>
      <!--<div class="app-gauge-name"> {{ data.disp_name }}</div>-->
    </div>
    <div class="app-gauge-link-disabled" v-if="Visit"></div>
    <a class="app-gauge-link" :href="`/zh-cn/overview/${data.name}/`"></a>
    <div v-if="selected" class="app-selected"></div>
  </div>
</template>

<script>
  import { healthObj, translateHealth } from '@/helpers/utils';

  export default {
    name: 'app-gauge',
    props: {
      selected: {
        type: Boolean,
        default: false,
      },
      isFirst: {
        type: Boolean,
        default: true,
      },
      data: {
        type: Object,
        default() {
          return {
            disp_name: '',
            health: 40,
            name: '',
          };
        },
      },
    },
    data() {
      return {
        Visit: true,
        healthObject: healthObj,
        width: this.selected ? 178 : 98,
        hasTip: false,
        height: 43,
        maxLine: 2,
        fontSize: 16,
        offsetX: 9,
        posX: 0,
        posY: 0,
      };
    },
    watch: {
      selected() {
        this.width = this.selected ? 178 : 98;
        this.$nextTick(() => this.calcTextPos());
      },
    },
    computed: {
      points() {
        const radius = 9;
        const fillWidth = this.width * this.data.health / 100;
        return `0,${radius} ${radius},0 ${fillWidth},0 ${fillWidth},${this.height} ${radius},${this.height} 0,${this.height - radius}`;
      },
      healthStatus() {
        return translateHealth(this.data.health).status;
      },
      max() {
        return this.width - 2 * this.offsetX;
      },
      name() {
        let result = this.splitStr(this.data.disp_name, this.max, this.fontSize);
        const last = this.maxLine - 1;
        if (result.length > this.maxLine) {
          const tmpStr = result[last];
          result[last] = `${tmpStr.substring(0, tmpStr.length - 1)}...`;
          result = result.slice(0, this.maxLine);
          this.hasTip = true;
        }
        return result;
      },
    },
    methods: {
      showWhole(e, name, showFlag) {
        if (showFlag !== undefined && showFlag) {
          const ele = e.target.parentNode;
          const position = {
            flag: !this.selected,
            left: ele.getBoundingClientRect().left,
            top: showFlag ? ele.getBoundingClientRect().top - 36 : ele.getBoundingClientRect().top - 42,
            tipName: name,
          };
          this.$emit('showTip', position);
        }
      },
      hideTip() {
        this.$emit('hideTip');
      },
      selectedApp() {
        this.$emit('selectedApp', {
          appName: this.data.name,
        });
      },
      splitStr(str, max, fontSize) {
        const result = [];
        let [curLen, start, end] = [0, 0, 0];
        for (let i = 0; i < str.length; i += 1) {
          const code = str.charCodeAt(i);
          const pixelLen = code > 65 && code < 90 || code > 255 ? fontSize : fontSize / 2 + 2;  // 汉字：[19968,40869] 数字：[48, 57] 小写字母：[97, 122] 大写字母：[65, 90]
          curLen += pixelLen;
          if (curLen > max) {
            end = i;
            result.push(str.substring(start, end));
            start = i;
            curLen = pixelLen;
          }
          if (i === str.length - 1) {
            end = i;
            result.push(str.substring(start, end + 1));
          }
        }
        return result;
      },
      calcTextPos() {
        this.posY = (this.height - this.$el.querySelector('text').getBBox().height) / 2;
        this.posX = (this.width - this.$el.querySelector('tspan').getBBox().width) / 2;
      },
    },
    mounted() {
      this.Visit = !this.session$.newpermissions.topov_detail;
      this.calcTextPos();
    },
  };
</script>

<style lang="scss" scoped>
  .per-app-gauge{
    position: relative;
    height: 45px;
    width: 140px;
    background: url(../../assets/index/app-gauge-bg.png) no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    margin:7px;
    cursor: pointer;

    .app-gauge-health{
      display: inline-block;
      height: calc(100% - 2px);
      width: calc(100% - 42px);
      margin: 1px;
      float: left;
    }

    .app-gauge-link{
      display: inline-block;
      background: url(../../assets/index/app-gauge-link.png) no-repeat;
      background-size: 100% 100%;
      width: 40px;
      margin-top: 1px;
      height: calc(100% - 2px);
      float: left;
    }

    .app-gauge-link:hover{
      background: url(../../assets/index/app-gauge-link-high.png) no-repeat;
      background-size: 100% 100%;
    }

    .app-gauge-name{
      fill: #ccc;
      font-size: 18px;
      font-weight: bold;
    }

    .two-line{
      font-size: 16px;
    }

    /*.app-gauge-name{
      fill: #ccc;
      font-size: 18px;
      font-weight: bold;
      width: 100%;
      height: 100%;
      background: red;
      z-index: 1;
      margin-top: -43px;
    }*/
    .app-gauge-link-disabled{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin-top: 1px;
      height: calc(100% - 2px);
      z-index: 200;
      cursor: default;
    }
  }

  .per-app-gauge.selected{
    width: 220px;
    background: url(../../assets/index/app-gauge-selected-bg.png) no-repeat!important;
    background-size: 100% 100%;

    .app-gauge-name{
      fill: #eee;
    }
  }

  .app-selected{
    background: url(../../assets/index/app-gauge-selected.png) no-repeat!important;
    background-size: 100% 100%;
    position: absolute;
    top: -7px;
    left: -7px;
    pointer-events: none;
    z-index: 1;
    width: 235px;
    height: 59px;
  }


</style>
