<template>
  <g :transform="`translate(${finalX}, ${finalY})`">
    <rect x="5" y="5" rx="15" ry="15" stroke-width="2px" :class="[currentStyle, alertStyle]" @mouseover="showWhole($event, node.dispName)" @mouseout="hideTip"></rect>
    <text font-size="15" fill="rgba(29, 222, 213, .5)" class="node-name" :class="{'alert-text': alertStyle === 'alert-common'}" x="70.5" y="21.5" text-anchor="middle" dominant-baseline="middle" @mouseover="showWhole($event, node.dispName)" @mouseout="hideTip">{{changeText(node.dispName)}}</text>
    <image x="-8px" y="-8px" v-show="locationFlag" width="30" height="30" :href="require(`../../assets/alert/locationAlert.png`)" />
  </g>
</template>

<script>
  import NodeClass from '@/components/editTopo/models/Node';
  import { textWidth } from '@/helpers/utils';

  export default {
    props: {
      node: {
        type: Object,
        default: new NodeClass(-1, -1, {}),
      },
      locationFlag: {
        type: Boolean,
        default: false,
      },
      current: {
        type: String,
        default: '',
      },
      alertFlag: {
        type: Boolean,
        default: false,
      },
      path: {
        type: Array,
        default: [],
      },
    },
    computed: {
      currentStyle() {
        return `${this.node.type}-box`;
      },
      finalX() {
        return this.node.x + this.positionX;
      },
      finalY() {
        return this.node.y / 2.5 + this.positionY;
      },
      alertStyle() {
        let alertClass = '';
        if (this.alertFlag !== null && this.alertFlag) {
          alertClass = 'alert1';
          if (this.node.dispName === this.current) alertClass = 'alert2';
        } else {
          if (this.path.includes(`intf${this.node.intf}`)) alertClass = '';
          else alertClass = 'alert-common';
        }
        return alertClass;
      },
    },
    data() {
      return {
        positionX: 95,
        positionY: 45,
      };
    },
    methods: {
      /* eslint-disable no-param-reassign */
      changeText(text) {
        let width = textWidth(text);
        if (width >= 90) {
          while (width >= 90) {
            text = text.slice(0, -1);
            width = textWidth(text);
          }
          text = `${text}...`;
        }
        return text;
      },
      /* eslint-disable no-param-reassign */
      showWhole(e, name) {
        if (textWidth(name) >= 90) {
          const ele = e.target.parentNode;
          const eleInfo = ele.getBoundingClientRect();
          const windowH = window.innerHeight;
          let finalH = eleInfo.top - windowH * 0.35 + eleInfo.top * 0.2 + 10;
          if (windowH > 900) finalH = eleInfo.top - 310;
          if (windowH > 700 && windowH <= 900) finalH = eleInfo.top - windowH * 0.35 + 10;
          if (windowH > 685 && windowH <= 700) finalH = eleInfo.top - windowH * 0.35 + 25;
          if (windowH > 670 && windowH <= 685) finalH = eleInfo.top - windowH * 0.35 + 30;
          if (windowH > 660 && windowH <= 670) finalH = eleInfo.top - windowH * 0.35 + 35;
          if (windowH > 650 && windowH <= 660) finalH = eleInfo.top - windowH * 0.35 + 40;
          if (windowH > 640 && windowH <= 650) finalH = eleInfo.top - windowH * 0.35 + 50;
          const position = {
            left: eleInfo.left,
            top: finalH,
            tipName: name,
          };
          this.$emit('showTip', position);
        }
      },
      hideTip() {
        this.$emit('hideTip');
      },
    },
  };
</script>

<style lang="scss" scoped>
.alertIcon{
  fill: #000;
}
.client-box,.server-box{
  width:130px;
  height:30px;
}
.client-box{
  fill:rgba(24,65,95,.5);
}
.server-box{
  stroke: #3982e1;
  fill: #1b65c8;
  &+text{
    fill:#fff;
    &.alert-text{
      fill: rgba(255, 255, 255, .5);
    }
  }
  &.alert1{
    stroke: #e04c4c;
    fill: #1b65c8;
  }
  &.alert2{
    stroke: #e04c4c;
    fill: #602121;
  }
  &.alert-common{
    width: 132px;
    height: 32px;
    fill: rgba(24, 65, 95, 0.5);
    stroke: none;
  }
}
.common-err-node,.current-err-node{
  stroke-width: 2px;
  stroke: #e04c4c;
}
.current-err-node{
  fill: #943434;
}
.node-name{
  overflow:hidden;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  white-space:nowrap;
  width: 130px;
}
</style>