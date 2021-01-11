<template>
  <svg class="node" style="cursor: move" xmlns="http://www.w3.org/2000/svg" :x="node.x" :y="node.y" @mouseover="closeButtonVisible = true" @mouseout="closeButtonVisible = false" @dragover="onDragOver" @drop="onDropIcon">
    <g>
      <svg preserveAspectRatio="xMidYMid" :width="width - 10" :height="height - 5" :viewBox="`0 0 ${width - 10} ${height - 5}`" draggable xmlns="http://www.w3.org/2000/svg">
        <rect :x="marginLeft" :y="marginTop" :width="width - 2 * marginLeft" :height="height - 2 * marginTop" fill="transparent"></rect>
        <rect :x="marginLeft" :y="marginTop" :width="width - 2 * marginLeft" :height="height - 2 * marginTop" stroke="#005F71" :fill="fillStyle" :rx="borderRadius" :ry="borderRadius" :stroke-width="borderWidth" :filter="showRedWarn ? 'url(#redWarn)' : null"></rect>
      </svg>
      <foreignObject ref="inputWrapper" :x="marginLeft" :y="marginTop" :width="width - 2 * marginLeft" :height="disNameHeight + 2" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
        <input xmlns="http://www.w3.org/1999/xhtml" type="text" :placeholder="node.typeText" maxlength="20" :style="inputStyle" @input="inputChange" :value="node.dispName" :id="'nodeit-'+node.id" ref="nodeInput" :class="this.inputError ? 'error-input' : null" />
      </foreignObject>
      <svg style="cursor: pointer;" width="21" height="21" :x="width - boxMargin / 2 - closeRight" :y="boxMargin / 2 + closeTop" v-show="closeButtonVisible" @click="removeNode">
        <g transform="scale(0.6)">
          <circle fill-rule="evenodd" clip-rule="evenodd" fill="#C63F41" cx="17.5" cy="17.5" r="17.316"></circle>
          <path fill-rule="evenodd" clip-rule="evenodd" fill="#D5D4D8" d="M21.878,17.508l5.856-5.856c0.808-0.807,0.808-2.117,0-2.924l-1.462-1.462c-0.807-0.807-2.117-0.807-2.924,0l-5.856,5.856l-5.791-5.791c-0.805-0.805-2.11-0.805-2.915,0L7.329,8.789c-0.805,0.805-0.805,2.11,0,2.915l5.791,5.791l-5.853,5.853c-0.807,0.807-0.807,2.116,0,2.924l1.462,1.462c0.807,0.807,2.117,0.807,2.924,0l5.853-5.853l5.855,5.855c0.805,0.805,2.11,0.805,2.915,0l1.457-1.457c0.805-0.805,0.805-2.11,0-2.915L21.878,17.508z">
          </path>
        </g>
      </svg>
      <image xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="logoLink" :data-name="logoName" :width="logoSize.width" :height="logoSize.height" :x="width - marginLeft - logoPos.right - logoSize.width" :y="height - marginTop - iconPos.bottom - logoSize.height" :style="{cursor: node.type === 'client' ? null : 'pointer'}" @mouseover="hoverOnLogoLink = true" @mouseout="hoverOnLogoLink = false" @click="onConfigure"></image>
      <use v-if="node.type === 'server'" href="#dot" :x="marginLeft - dotR" :y="dotHeight - dotR" style="cursor: pointer" @click="handleLeftClick()"></use>
      <use v-if="node.type !== 'container'" href="#dot" :x=" width - marginLeft - dotR" :y="dotHeight - dotR" style="cursor: pointer" @click="handleRightClick()"></use>
    </g>
    <image xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="iconLink" :width="iconSize.width" :height="iconSize.height" :x="marginLeft + iconPos.left" :y="height - marginTop - iconPos.bottom - iconSize.height"></image>
    <slot></slot>
  </svg>
</template>

<script>

/* eslint-disable no-param-reassign */
/* global $ */
import { drag as D3Drag } from 'd3-drag';
import { select as D3Select, event as D3Event } from 'd3-selection';

import { imgUrl } from '@/helpers/utils';

// import serverIcon from '../assets/topo-icon/serverGroup.svg';
// import clientIcon from '../assets/topo-icon/client.svg';
import serverLogo from '@/assets/topo-icon/config1.png';
import serverLogoConfiged from '@/assets/topo-icon/configed1.png';
import clientLogo from '@/assets/topo-icon/ip.svg';
import containerLogo from '@/assets/topo-icon/containerExpand1.png';
import containerLogoHover from '@/assets/topo-icon/containerExpandHover.png';

import NodeClass from '../models/Node';

const props = {
  index: {
    type: Number,
    default: -1,
  },
  isEmpty: {
    type: Function,
  },
  nw: {
    type: Number,
    default: 200,
  },
  nh: {
    type: Number,
    default: 100,
  },
  initX: {
    type: Number,
    default: 0,
  },
  initY: {
    type: Number,
    default: 0,
  },
  hasIp: {
    type: Boolean,
    default: true,
  },
  width: {
    type: Number,
    default: 200,
  },
  height: {
    type: Number,
    default: 100,
  },
  marginLeft: {
    tyep: Number,
    default: 35,
  },
  marginTop: {
    type: Number,
    default: 10,
  },
  disNameHeight: {
    type: Number,
    default: 20,
  },
  dotHeight: {
    type: Number,
    default: 50,
  },
  logoName: {
    type: String,
    default: '',
  },
  logoSize: {
    type: Object,
    default: () => ({
      width: 40,
      height: 40,
    }),
  },
  iconPos: {
    type: Object,
    default: () => ({
      left: 15, // left 和 bottom 相对于可见框，而不是最外层框
      bottom: 10,
    }),
  },
  onDotClick: {
    type: Function,
    default: () => { },
  },
  logoPos: {
    type: Object,
    default: () => ({
      right: 15,
      bottom: 10,
    }),
  },
  iconSize: {
    type: Object,
    default: () => ({
      width: 40,
      height: 40,
    }),
  },
  boxMargin: {
    type: Number,
    default: 20,
  },
  borderRadius: {
    type: Number,
    default: 2,
  },
  borderWidth: {
    type: Number,
    default: 1,
  },
  dotR: {
    type: Number,
    default: 8,
  },
  class_name: {
    type: String,
    default: 'node',
  },
  intf: {
    type: Number,
    default: null,
  },
  closeRight: {
    type: Number,
    default: 35,
  },
  closeTop: {
    type: Number,
    default: -10,
  },
  node: {
    type: Object,
    default: new NodeClass(-1, -1, {}),
  },
};


export default {
  name: 'node',
  props,
  data() {
    return {
      clientInputColor: '#177dc5',
      serverInputColor: '#3f4591',
      containerInputColor: '#109a2b',
      closeButtonVisible: false,
      wrapper: null,
      hoverOnLogoLink: false,
      drag: D3Drag().on('start', this.dragStarted).on('drag', this.dragged).on('end', this.dragEnded),
      inputError: this.node.dispName === '',
      // dispName: this.node.dispName || '',
    };
  },
  watch: {},
  computed: {
    inputStyle() {
      const { node, width, marginLeft,
        borderWidth, disNameHeight, borderRadius,
      } = this;
      let color;
      if (node.type === 'client') {
        color = this.clientInputColor;
      } else if (node.type === 'container') {
        color = this.containerInputColor;
      } else {
        color = this.serverInputColor;
      }
      return {
        background: color,
        width: `${width - 2 * marginLeft - 2 * borderWidth}px`,
        height: `${disNameHeight}px`,
        border: '0px',
        outline: 'none',
        margin: `${borderWidth}px`,
        'border-radius': `${borderRadius}px`,
        'text-align': 'center',
        'font-size': '12px',
      };
    },
    fillStyle() {
      return this.node.type === 'container' ? '#03440a' : '#0A2E3C';
    },
    iconLink() {
      return imgUrl(this.node.iconName);
    },
    logoLink() {
      if (this.node.type === 'client') {
        return clientLogo;
      } else if (this.node.type === 'server') {
        return this.hoverOnLogoLink ? serverLogoConfiged : serverLogo;
      }
      return this.hoverOnLogoLink ? containerLogoHover : containerLogo;
    },
    showRedWarn() {
      return this.node.error;
    },
  },
  methods: {
    removeNode() {
      // console.log('Remove Node', this.node);
      this.$emit('delete-node', this.node);
    },
    inputChange(ev) {
      if (ev.target.value === '') {
        this.inputError = true;
        if (this.node.type !== 'container') this.$store.dispatch('changeNodeError', { node: this.node, isError: true });
        if (this.node.type === 'container') this.$store.dispatch('changeNodeError', { node: this.node, isError: false });
        window.show_msgs(window.d3.select(this.$refs.nodeInput), '名称不能为空且不超过20字', 'right', true);
      } else if (ev.target.value.match(/[&; ]/g)) {
        window.show_msgs(window.d3.select(this.$refs.nodeInput), "名称不能含有'&',';'和空格", 'right', true);
        this.inputError = true;
      } else {
        this.inputError = false;
        this.$store.dispatch('changeNodeError', { node: this.node, isError: false });
      }
      ev.target.value = this.limitInputText(ev.target.value);
      this.$emit('node-name-change', this.node, ev.target.value);
    },
    textWidth(text) {
      text = text.replace(/ /g, 'd');
      const sensor = $(`<span id="text-width">${text}</span>`).css({ display: 'none', 'font-family': 'helvetica', 'font-size': '12px' });
      $('body').append(sensor);
      const width = sensor.width();
      sensor.remove();
      return width;
    },
    limitInputText(text) {
      let width = this.textWidth(text);
      while (width >= 112) {
        text = text.slice(0, -1);
        width = this.textWidth(text);
      }
      return text;
    },

    dragStarted() {
      // console.log('dragStarted', d, i);
    },
    dragged() {
      // // console.log('dragged', d, i, D3Event);
      // this.x = D3Event.x;
      // this.y = D3Event.y;

      if (document.activeElement.tagName === 'INPUT') return;

      let { x, y } = D3Event;
      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      if (!this.isEmpty(x, y)) {
        return;
      }
      const px = this.node.x;
      const py = this.node.y;
      this.node.setCoordinates(x, y);
      if (px !== this.node.x || py !== this.node.y) {
        this.$emit('node-dragging', this.node, D3Event);
      }
    },
    dragEnded() {
      // console.log('dragEnded', this.node);
      this.$emit('node-dragged', this.node);
    },
    onDragOver(e) {
      e.preventDefault();
    },
    onDropIcon(ev) {
      // console.log(ev.dataTransfer);
      const iconName = /-(.*)$/.exec(ev.dataTransfer.getData('text'))[1];
      this.node.setIconName(iconName);
    },
    handleLeftClick() {
      if (this.node.type === 'container') return;
      const coords = this.node.getDotCoordinates('left');
      this.onDotClick(this.node.id, coords);
    },
    handleRightClick() {
      if (this.node.type === 'container') return;
      const coords = this.node.getDotCoordinates('right');
      this.onDotClick(this.node.id, coords);
    },
    onConfigure() {
      if (this.node.type === 'server') {
        // this.$store.dispatch('showTargetConfig', this.node);
        this.$parent.$parent.$emit('node-config', this.node);
      } else if (this.node.type === 'container') {
        this.node.visible = false;
        this.$emit('expand-container', this.node);
      }
    },
  },

  mounted() {
    this.wrapper = D3Select(this.$el);
    this.drag(this.wrapper);

    this.$refs.nodeInput.addEventListener('wheel', (e) => {
      e.target.blur();
    });
  },
};

</script>

<style scoped>
.error-input {
    border: 1px solid #E83427 !important;
    outline-color: transparent;
}
</style>


