<template>
  <svg :width="width" :height="height" class="edit-box" :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`">
    <defs>
      <filter id="inShadow">
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0.133 0 0 0 0 0.612 0 0 0 0 0.58 0 0 0 1 0" result="color1">
        </feColorMatrix>
        <feGaussianBlur in="color1" stdDeviation="5"></feGaussianBlur>
        <feComposite in2="color1" operator="in">
        </feComposite>
        <feComposite in2="color1" operator="xor" result="shadow">
        </feComposite>
      </filter>
      <filter id="redWarn" width="800%" height="800%" x="-300%" y="-300%">
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" width="800%" height="800%" x="-300%" y="-300%">
        </feColorMatrix>
        <feGaussianBlur stdDeviation="1.63586" width="800%" height="800%" x="-300%" y="-300%">
          <animate attributeName="stdDeviation" attributeType="xml" keyTimes="0; 0.5; 1" values="12; 1; 12" repeatCount="indefinite" dur="1s"></animate>
        </feGaussianBlur>
        <feBlend in="SourceGraphic"></feBlend>
      </filter>
      <filter id="yellowWarn" width="800%" height="800%" x="-300%" y="-300%">
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 1 0 0 0 0 0.6 0 0 0 0 0 0 0 0 1 0" width="800%" height="800%" x="-300%" y="-300%"></feColorMatrix>
        <feGaussianBlur stdDeviation="1.63586" width="800%" height="800%" x="-300%" y="-300%">
          <animate attributeName="stdDeviation" attributeType="xml" keyTimes="0; 0.5; 1" values="12; 1; 12" repeatCount="indefinite" dur="1s"></animate>
        </feGaussianBlur>
        <feBlend in="SourceGraphic"></feBlend>
      </filter>
    </defs>
    <rect :x="viewBox.x" :y="viewBox.y" :width="viewBox.width" :height="viewBox.height" class="edit_rect" :style="rectStyle" @click="cancelPreEdge($event)">
    </rect>
    <TopoGrid :parentWidth="viewBox.width" :parentHeight="viewBox.height" :translateX="viewBox.x" :translateY="viewBox.y" :scale="pScale"></TopoGrid>
    <g class="groups">
      <slot name="groups"></slot>
    </g>
    <g class="svg-topo-area">
      <defs>
        <g id="dot">
          <circle :cx="dotR" :cy="dotR" :r="dotR * 7 / 8" :stroke-width="dotR / 4" fill="#153344" stroke="#00E1CD"></circle>
          <circle :cx="dotR" :cy="dotR" :r="dotR * 3 / 8" :stroke-width="dotR / 4" fill="#00E1CD" stroke="#00E1CD"></circle>
        </g>
      </defs>
      <node
        v-for="(node,key) in nodes"
        :node="node"
        :key="key"
        :index="key"
        :on-dot-click="onDotClick"
        @node-dragging="onNodeDragging"
        @node-dragged="onNodeDragged"
        :is-empty="isEmpty"
        @delete-node="onDeleteNode"
        @node-name-change="onNodeNameChange"
        @expand-container="onExpandContainer"
      />
      <slot name="preNode"></slot>
    </g>
    <g>
      <defs>
        <marker id="linkArrow" :viewBox="`0 -${markerWidth} ${markerWidth} ${2*markerWidth}`" :markerWidth="markerWidth" :markerHeight="markerWidth * 2" orient="auto" :refX="markerWidth - 1">
          <path :d="`M0,-${markerWidth}L${markerWidth},0L0,${markerWidth}Z`" :fill="lineStroke" stroke-width="0"></path>
        </marker>
      </defs>
      <edge v-if="preEdge !== null" :edge="preEdge" :isPre="true"></edge>
      <edge v-for="(edge, key) in visibleEdges" :key="key" :edge="edge" @delete-edge="onDeleteEdge"></edge>
    </g>
  </svg>
</template>

<script>
import { zoom as D3Zoom, zoomIdentity as D3ZoomIdentity } from 'd3-zoom';
import { select as D3Select, event as D3Event, mouse as D3Mouse } from 'd3-selection';
import _ from 'lodash';

import TopoGrid from './TopoGrid';
import Node from './GroupNode';
import Edge from './Edge';

import EdgeClass from '../models/Edge';

export default {
  name: 'topo-container',
  props: {
    nodes: {
      type: Array,
      default: [],
    },
    isEmpty: {
      type: Function,
    },
    groups: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      width: 0,
      height: 0,
      rectStyle: {
        background: 'white',
        fill: 'none',
        pointerEvents: 'all',
        cursor: 'move',
      },
      svgMargin: {
        top: -5,
        right: -5,
        bottom: -5,
        left: -5,
      },
      dotR: 8,
      topoWidth: 0,
      topoHeight: 0,
      wrapper: null,
      transform: D3ZoomIdentity,
      zoom: D3Zoom().on('zoom', this.handleZoom).scaleExtent([0.3, 3]),
      preEdge: null,
      markerWidth: 3,
      lineStroke: '#00DFC4',
      viewBox: { x: 0, y: 0, width: 0, height: 0 },
      pScale: 1, // 前次缩放倍数
      focusedGroup: false,
    };
  },
  computed: {
    edges() {
      return this.$store.state.edges;
    },
    visibleEdges() {
      return _.filter(this.edges, e => e.visible);
    },
  },
  components: {
    TopoGrid,
    Node,
    Edge,
  },
  methods: {
    initSvg() {
      const width = window.outerWidth;
      const height = window.outerHeight;
      this.height = height;
      this.width = width;
      this.viewBox.width = width / this.pScale;
      this.viewBox.height = height / this.pScale;
    },
    initZoom() {
      this.wrapper = D3Select(this.$el);
      this.zoom(this.wrapper);
      this.wrapper.on('mousemove', this.updatePreEdge);
    },
    scaleCoor(point, center, scale) {
      const dx = +point[0] - center[0];
      const dy = +point[1] - center[1];
      return [+center[0] + (dx / scale), +center[1] + (dy / scale)];
    },
    scaleCoorNew(point, center, scale) {
      // const dx = +point[0] - center[0];
      // const dy = +point[1] - center[1];

      const dx = point.x - center.x;
      const dy = point.y - center.y;

      // return [+center[0] + (dx / scale), +center[1] + (dy / scale)];
      return {
        x: center.x + dx / scale,
        y: center.y + dy / scale,
      };
    },
    handleZoom() {
      // 禁止双击空白处后节点位置乱跑
      if (!D3Event.sourceEvent) {
        return false;
      }
      if (document.activeElement.tagName === 'INPUT') return false;
      const scale = +D3Event.transform.k;

      // console.log('scale', scale);

      const { viewBox } = this;

      const event = D3Event.sourceEvent;
      const dscale = scale / this.pScale; // 缩放倍数变化
      let dx;
      let dy;
      let _x;
      let _y;
      // let _viewBox;
      if (event.type && event.type === 'mousemove') { // 平移计算
        if (typeof event.movementX === 'number') { // 谷歌
          dx = -event.movementX;
          dy = -event.movementY;
        } else if (typeof event.mozMovementX === 'number') { // 火狐
          dx = -event.mozMovementX;
          dy = -event.mozMovementY;
        } else { // ie
          dx = window.IEoldX ? (event.clientX - window.IEoldX) : 0;
          dy = window.IEoldY ? (event.clientY - window.IEoldY) : 0;
          window.IEoldX = event.clientX;
          window.IEoldY = event.clientY;
          dx = -dx;
          dy = -dy;
        }
        _x = (+viewBox.x + dx / scale);
        _x = (_x < 0 ? 0 : _x);

        _y = (+viewBox.y + dy / scale);
        _y = (_y < 0 ? 0 : _y);
      } else if (event.type === 'wheel' || typeof event.wheelDelta === 'number') { // 缩放计算
        // 当前鼠标在svg坐标系中的坐标值, 作为缩放中心
        const [x0, y0] = D3Mouse(this.$el);

        const zoomCenter = {
          x: x0,
          y: y0,
        };

        const oldViewBox = {
          start: {
            x: viewBox.x,
            y: viewBox.y,
          },
          end: {
            x: viewBox.x + viewBox.width,
            y: viewBox.y + viewBox.height,
          },
        };

        const newViewBox = {
          start: this.scaleCoorNew(oldViewBox.start, zoomCenter, dscale),
          end: this.scaleCoorNew(oldViewBox.end, zoomCenter, dscale),
        };

        _x = newViewBox.start.x;
        _y = newViewBox.start.y;

        _x = (_x < 0 ? 0 : _x);
        // _x = (_x + viewBox.width > this.width ? this.width - viewBox.width : _x);
        _y = (_y < 0 ? 0 : _y);
        // _y = (_y + viewBox.height > this.height ? this.height - viewBox.height : _y);

        const _width = newViewBox.end.x - newViewBox.start.x;
        const _height = newViewBox.end.y - newViewBox.start.y;

        // _x = _width > this.width ? 0 : _x;
        // _y = _height > this.height ? 0 : _y;

        this.viewBox.width = _width;
        this.viewBox.height = _height;

        // console.log(_width / _height);
        // console.log(dscale, 'old: ' ,oldViewBox.start.x, oldViewBox.start.y, oldViewBox.end.x, oldViewBox.end.y, 'new: ', newViewBox.start.x, newViewBox.start.y, newViewBox.end.x, newViewBox.end.y, 'really: ', _x, _y, _width, _height);
      }
      this.viewBox.x = _x;
      this.viewBox.y = _y;
      this.pScale = scale;
      return true;
    },
    isLinked(n1, n2, allowDuplex) {
      const allEdges1 = _.concat(n1.edges.source, n1.edges.target);
      const allEdges2 = _.concat(n2.edges.source, n2.edges.target);
      const count = _.intersection(allEdges1, allEdges2).length;
      return allowDuplex ? count > 0 : count > 0;
    },
    onDotClick(nodeId, { x, y }) {
      if (!this.preEdge) {
        this.preEdge = new EdgeClass(nodeId);
        this.preEdge.setSourceCoordinates(x, y);
        this.preEdge.setTargetCoordinates(x, y);
      } else {
        const sourceNode = _.find(this.nodes, n => n.id === this.preEdge.sourceNodeId);
        const targetNode = _.find(this.nodes, n => n.id === nodeId);
        // 同一节点
        if (sourceNode.id === targetNode.id) {
          return;
        }

        if (targetNode.type === 'client') {
          return;
        }

        /* eslint-disable no-plusplus */
        /** @description
         *  判断两节点间是否已经存在连线
         */
        const allEdge = sourceNode.edges.source.concat(sourceNode.edges.target);
        for (let i = 0, l = allEdge.length; i < l; i++) {
          const edge = _.find(this.edges, e => e.id === allEdge[i]);
          if (edge.sourceNodeId === this.preEdge.sourceNodeId && edge.targetNodeId === nodeId) {
            return;
          }
          if (edge.targetNodeId === this.preEdge.sourceNodeId && edge.sourceNodeId === nodeId) {
            return;
          }
        }
        this.preEdge.linkTo(nodeId);
        this.preEdge.link(sourceNode, targetNode);
        this.$store.dispatch('createEdge', { edge: this.preEdge, sourceNode, targetNode });
        this.preEdge = null;
      }
    },
    onNodeDragging(node, event) {
      // console.log('dragging', nodeId, event);
      if (!node) {
        clearInterval(this.scrollY);
        clearInterval(this.scrollX);
        return;
      }
      if (!event) {
        this.$emit('nodeDragging', node);
        return;
      }
      this.nodeChangeGroup(node);
      this.setScroll(event);
      this.$store.dispatch('dragNode', node.id);
    },
    onNodeDragged(node) {
      this.$emit('nodeDragging', node);
      clearInterval(this.scrollX);
      clearInterval(this.scrollY);
    },
    updatePreEdge() {
      if (!this.preEdge) return;
      // console.log('mouse', D3Mouse(this.$el));
      const [x, y] = D3Mouse(this.$el);
      this.preEdge.setTargetCoordinates(x, y);
    },
    cancelPreEdge() {
      if (!this.preEdge) return;
      this.preEdge = null;
    },
    onDeleteEdge(edge) {
      this.$store.dispatch('removeEdge', edge);
    },
    onDeleteNode(node) {
      // this.$emit('deleteNode', node);
      this.$store.dispatch('removeNode', node);
      if (this.preEdge !== null && this.preEdge.sourceNodeId === node.id) {
        this.cancelPreEdge();
      }
    },
    onNodeNameChange(node, value) {
      this.$store.dispatch('changeNodeName', { node, value });
    },
    onExpandContainer(container) {
      console.log('expand container', container);
      container.visible = false; // eslint-disable-line
      this.$emit('expand-container', container);
    },
    scroll(mx, my) {
      // TO-DO
      // 拖动节点背景滚动
      return () => {
        const step = 20;
        const { x, y } = this.viewBox;
        let cx = x + step * mx;
        let cy = y + step * my;
        cx = cx < 0 ? 0 : cx;
        cy = cy < 0 ? 0 : cy;
        this.viewBox.x = cx;
        this.viewBox.y = cy;
      };
    },
    setScroll(event) {
      const e = event.sourceEvent;
      const svg = this.$el;
      const interval = 100;
      const left = svg.getBoundingClientRect().left;
      const top = svg.getBoundingClientRect().top;
      // console.log('e.pageX, window.innerWidth - 100', e.pageX, window.innerWidth - 100);
      if (e.pageX > (window.innerWidth - 100) || e.pageX < (left)) {
        if (event.dx === 0) return;
        const m = (+event.dx / Math.abs(event.dx));
        // console.log('scroll ---> x');
        if (!this.scrollX) (this.scrollX = setInterval(this.scroll(m, 0), interval));
      } else {
        clearInterval(this.scrollX);
        this.scrollX = null;
      }
      if (e.pageY > (window.innerHeight - 30) || e.pageY < (top)) {
        if (event.dy === 0) return;
        const m = (+event.dy / Math.abs(event.dy));
        if (!this.scrollY) (this.scrollY = setInterval(this.scroll(0, m), interval));
      } else {
        clearInterval(this.scrollY);
        this.scrollY = null;
      }
    },
    nodeChangeGroup(node) {
      /* eslint-disable no-param-reassign */
      const ancestorGroups = _.filter(this.$parent.visibleGroups, (g) => { // eslint-disable-line
        return g.nodeId !== node.id &&
          node.x >= g.x &&
          node.x < g.x + g.width &&
          node.y >= g.y &&
          node.y < g.y + g.height;
      });

      let minimalGroup;

      if (ancestorGroups.length === 0) {
        minimalGroup = false;
      } else {
        minimalGroup = ancestorGroups.reduceRight((pg, cg) => { // eslint-disable-line
          return pg.width * pg.height > cg.width * cg.height ? cg : pg;
        });
      }

      const oldGroup = _.find(this.$parent.groups, g => g.nodes.indexOf(node.id) > -1);

      this.$store.commit('NODE_CHANGE_GROUP', { node, newGroup: minimalGroup, oldGroup });
    },
  },
  mounted() {
    this.topoWidth = Math.max(this.$el.scrollWidth, 3000);
    this.topoHeight = Math.max(this.$el.scrollHeight, 3000);
    // this.viewBox = `0 0 ${window.outerWidth} ${window.outerHeight}`;
    this.viewBox = { x: 0, y: 0, width: window.outerWidth, height: window.outerHeight };
    this.initSvg();
    this.$nextTick(this.initZoom);
    window.addEventListener('resize', this.initSvg);
  },
};
</script>

<style scoped>

</style>


