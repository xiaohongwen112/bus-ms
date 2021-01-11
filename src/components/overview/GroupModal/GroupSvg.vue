<template>
  <svg class="visual-group-svg" width="100%" height="100%" viewBox="0 0 1366 295.15625">
    <defs>
      <clipPath id="clipRect0">
        <rect class="visual-rect-clip visual-rect-clip-bg" x="40" y="10" width="906" height="275.15625"></rect>
      </clipPath>
      <clipPath id="clipRectSource0">
        <rect class="visual-rect-clip visual-rect-clip-st" x="150" y="10" width="986" height="275.15625"></rect>
      </clipPath>
      <clipPath id="clipRectTarget0">
        <rect class="visual-rect-clip visual-rect-clip-st" x="230" y="10" width="986" height="275.15625"></rect>
      </clipPath>
    </defs>
    <rect class="visual-rect-bg" x="190" y="0" width="986" height="295.15625" fill="#0e344e"></rect>
    <g class="visual-group-all" transform="translate(0, 0)">
      <g class="visual-prev-g" :transform="`translate(${prevTranslate}) scale(${transform.k})`">
        <ParentNode v-for="(item, index) in data.sourceNodes" :key="`sourceNodes${index}`"
                              :transform="`translate(28,${15 + 77 * item.pos.y})`"
                              :name="item.name"
                              :isMonitor="!item.unMonitor"
        />
      </g>
      <g class="visual-after-g" :transform="`translate(${afterTranslate}) scale(${transform.k})`">
        <ParentNode v-for="(item, index) in data.targetNodes" :key="`targetNodes${index}`"
                              :transform="`translate(0,${15 + 77 * item.pos.y})`"
                              :name="item.name"
                              :isMonitor="!item.unMonitor"
        />
      </g>
      <g class="visual-group-bg" transform="translate(190, 0)" clip-path="url(#clipRect0)">
        <g class="visual-group-g" :transform="`translate(${nodesTranslate}) scale(${transform.k})`">
          <ClientNode v-for="node in clientList" :key="node.id"
              :transform="`translate(${ 355 * node.pos.x}, ${ 298 * node.pos.y})`"
              :title="node.title"
              :hasIp="node.hasIp"
              />
          <ServerNode v-for="node in serviceList" :key="node.id"
                      :transform="`translate(${ 355 * node.pos.x}, ${ 298 * node.pos.y})`"
                      :isMonitor="!node.unMonitor"
                      :title="node.title"
                      :hasChild="node.type === 'group'"
                      :data="serverData(node.data)"
                      @open-modal="openModal"
                      @open-alert="openAlert"
          />
          <ConnectNodes v-for="(edge, index) in data.contentEdges" :key="`sourceEdge${index}`"
                :data="edge"
                />  
        </g>
      </g>
      <g class="lines-prev-g" clip-path="url(#clipRectSource0)">
        <g class="visual-group-source"
            :transform="`translate(${linesTranslate}) scale(${transform.k})`">
          <ConnectNodes v-for="(edge, index) in data.sourceEdges" :key="`sourceEdge${index}`"
                :data="edge" :transform="transform"
                />           
        </g>
      </g>
      <g class="lines-after-g" clip-path="url(#clipRectTarget0)">
        <g class="visual-group-target"
            :transform="`translate(${linesTranslate}) scale(${transform.k})`">
            <ConnectNodes v-for="(edge, index) in data.targetEdges" :key="`sourceEdge${index}`"
                :data="edge" :transform="transform"
            />
          </g>
      </g>
    </g>
  </svg>
</template>
<script>
import { select, zoom, event } from 'd3';
import ClientNode from '@/components/overview/ClientNode';
import ServerNode from '@/components/overview/ServerNode';
import ConnectNodes from '@/components/overview/ConnectNodes';
import { getNodeList, serverData } from '@/pages/overview/utils';
import ParentNode from './ParentNode';

export default {
  name: 'GroupSvg',
  components: {
    ParentNode,
    ClientNode,
    ServerNode,
    ConnectNodes,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      box: {
        x: 0,
        y: 0,
        width: 960,
        height: 600,
      },
      transform: {
        x: 0,
        y: 0,
        k: 1,
      },
      offsetW: 190,
      offsetL: 80,
      offsetT: 20,
      zoom: zoom().scaleExtent([0.3, 3]).on('zoom', this.handleZoom),
    };
  },
  computed: {
    width() { return 980; }, // 节点背景宽
    prevTranslate() {
      return [(1 - this.transform.k) * this.offsetW, this.offsetT];
    },
    afterTranslate() {
      return [this.offsetW + this.width, this.offsetT];
    },
    nodesTranslate() {
      return [this.offsetL + this.transform.x, this.transform.y + this.offsetT];
    },
    linesTranslate() {
      return [this.offsetW + this.offsetL + this.transform.x, this.transform.y + this.offsetT];
    },
    clientList() {
      return getNodeList(this.data.contentNodes, 'client');
    },
    serviceList() {
      return getNodeList(this.data.contentNodes, 'server');
    },
    // zoom() { return zoom().scaleExtent([0.3, 3]).on('zoom', this.handleZoom); },
  },
  methods: {
    serverData(msg) {
      return serverData(msg);
    },
    openModal(args) {
      this.$emit('open-modal', args);
    },
    openAlert() {
      this.$emit('open-alert');
    },
    getBox() {
      // const box = this.$el.getBBox();
      // this.box = box;
    },
    handleZoom() {
      this.transform = event.transform;
    },
  },
  mounted() {
    this.getBox();
    this.zoom(select(this.$el));
  },
};
</script>
<style scoped>

</style>
