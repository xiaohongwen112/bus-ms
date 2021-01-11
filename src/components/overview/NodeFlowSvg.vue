<template>
  <svg class="main-svg" id="viewSvg" xmlns="http://www.w3.org/2000/svg" version="1.1"
       :viewBox="`${box.x} ${box.y} ${box.width} ${box.height+20}`">
    <g class="focus" :transform="transform">
      <defs>
        <filter id="bgShadownode" x="0" y="0" width="200%" height="200%">
          <feOffset result="offOut" in="SourceAlpha" dx="3" dy="5"></feOffset>
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5"></feGaussianBlur>
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>
        </filter>
        <filter id="nameShadownode" x="0" y="0" width="200%" height="200%">
          <feOffset result="offOut" in="SourceAlpha" dx="0" dy="3"></feOffset>
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3"></feGaussianBlur>
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>
        </filter>
        <linearGradient id="nameGradientnode" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: rgb(0, 0, 0); stop-opacity: 0.5;"></stop>
          <stop offset="40%" style="stop-color: rgb(0, 0, 0); stop-opacity: 0.2;"></stop>
          <stop offset="100%" style="stop-color: rgb(0, 0, 0); stop-opacity: 0;"></stop>
        </linearGradient>
        <linearGradient id="serverGradientnode" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color: rgb(0, 0, 0); stop-opacity: 0;"></stop>
          <stop offset="0.003875968992248062" style="stop-color: rgb(0, 0, 0); stop-opacity: 0.3;"></stop>
          <stop offset="0.007751937984496124" style="stop-color: rgb(0, 0, 0); stop-opacity: 0.5;"></stop>
          <stop offset="0.6976744186046512" style="stop-color: rgb(0, 0, 0); stop-opacity: 0.5;"></stop>
          <stop offset="0.6996124031007752" style="stop-color: rgb(0, 0, 0); stop-opacity: 0.8;"></stop>
          <stop offset="0.7015503875968992" style="stop-color: rgb(0, 0, 0); stop-opacity: 0.7;"></stop>
          <stop offset="100%" style="stop-color: rgb(0, 0, 0); stop-opacity: 0.7;"></stop>
        </linearGradient>
        <linearGradient id="clientGradientnode" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color: rgb(0, 0, 0); stop-opacity: 0;"></stop>
          <stop offset="0.005555555555555556" style="stop-color: rgb(0, 0, 0); stop-opacity: 0.5;"></stop>
          <stop offset="100%" style="stop-color: rgb(0, 0, 0); stop-opacity: 0.5;"></stop>
        </linearGradient>
        <filter id="circleGaussian" width="800%" height="800%" x="-200%" y="-200%">
          <feColorMatrix in="SourceAlpha" type="matrix" width="800%" height="800%" x="-300%" y="-300%"
                         values="0 0 0 0 0.239 0 0 0 0 0.608 0 0 0 0 0.875 0 0 0 1 0"></feColorMatrix>
          <feGaussianBlur stdDeviation="1" width="800%" height="800%" x="-300%" y="-300%"></feGaussianBlur>
          <feBlend in="SourceGraphic"></feBlend>
        </filter>
        <filter id="darkGaussian" width="800%" height="800%" x="-200%" y="-200%">
          <feColorMatrix in="SourceAlpha" type="matrix" width="800%" height="800%" x="-300%" y="-300%"
                         values="0 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix>
          <feGaussianBlur stdDeviation="1" width="800%" height="800%" x="-300%" y="-300%"></feGaussianBlur>
          <feBlend in="SourceGraphic"></feBlend>
        </filter>
        <marker id="endCircle" viewBox="0 0 14 14" refX="7" refY="7" markerWidth="3" markerHeight="3" orient="auto"
                filter="url(#circleGaussian)">
          <g>
            <circle cx="7" cy="7" r="5" fill="#122C34" stroke="#3AD5C9" stroke-width="1"></circle>
            <circle cx="7" cy="7" r="2" fill="#122C34" stroke="#3AD5C9" stroke-width="2"></circle>
          </g>
        </marker>
        <marker id="circleDark" viewBox="0 0 14 14" refX="7" refY="7" markerWidth="3" markerHeight="3" orient="auto"
                filter="url(#darkGaussian)">
          <g>
            <circle cx="7" cy="7" r="5" fill="#091824" stroke="#10393c" stroke-width="1"></circle>
            <circle cx="7" cy="7" r="2" fill="#091824" stroke="#10393c" stroke-width="2"></circle>
          </g>
        </marker>
      </defs>
      <ClientNode v-for="node in clientList" :key="node.id"
                  :transform="`translate(${ 355 * node.pos.x}, ${ 298 * node.pos.y})`"
                  :title="node.title"
                  :hasIp="node.hasIp"
                  :active="activeId === ''"
                  />
      <ServerNode v-for="node in serviceList" :key="node.id"
                  :transform="`translate(${ 355 * node.pos.x}, ${ 298 * node.pos.y})`"
                  :isMonitor="!node.unMonitor"
                  :title="node.title"
                  :hasChild="node.type === 'group'"
                  :type="node.type"
                  :hasServer="node.hasServer"
                  :data="serverData(node.data)"
                  @open-modal="openModal"
                  @open-alert="openAlert"
                  :active="activeId === '' || activeId === node.id"
      />
      <ConnectNodes v-for="edge in lineList" :key="edge.id"
                    :data="edge"
      />
    </g>
  </svg>
</template>
<script>
import { select, zoom, event } from 'd3';
import ClientNode from '@/components/overview/ClientNode';
import ServerNode from '@/components/overview/ServerNode';
import ConnectNodes from '@/components/overview/ConnectNodes';
import { getNodeList, serverData } from '@/pages/overview/utils';

export default {
  name: 'NodeFlowSvg',
  components: {
    ServerNode,
    ClientNode,
    ConnectNodes,
  },
  props: {
    activeId: {
      type: String,
      default: '',
      required: true,
    },
    viewData: {
      type: Object,
      default: {},
      required: true,
    },
  },
  data() {
    return {
      transform: '',
      zoom: zoom().scaleExtent([1 / 2, 8]).on('zoom', this.handleZoom),
      box: {
        x: 0,
        y: 0,
        width: 600,
        height: 600,
      },
    };
  },
  computed: {
    clientList() {
      return getNodeList(this.viewData.basisNodes, 'client');
    },
    serviceList() {
      return getNodeList(this.viewData.basisNodes, 'server');
    },
    lineList() {
      return this.viewData.edges;
    },
  },
  methods: {
    getBox() {
      const box = this.$el.getBBox();
      this.box = box;
    },
    handleZoom() {
      this.transform = event.transform;
    },
    openModal(args) {
      this.$emit('open-modal', args);
    },
    openAlert() {
      this.$emit('open-alert');
    },
    serverData(data) {
      return serverData(data);
    },
  },
  mounted() {
    this.zoom(select(this.$el));
    this.$nextTick(() => {
      this.getBox();
    });
  },
};
</script>
<style>
  .main-svg {
    width: 100%;
    height: 100%;
    cursor: move;
  }
  .node-name{
    font-size: 22px;
    color: #eee;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
