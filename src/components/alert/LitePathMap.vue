<template>
  <div class="lite-path-map">
    <div class="topo-area">
      <svg :width="width" :height="height" class="lite-map-container" :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`">
        <g :transform="transform" id="node-container">
          <Node v-for="(node,key) in nodes" :node="node" :key="key" :index="key" :current="current" 
            :alertFlag="locationStatus(node)" :locationFlag="alertFlag(node)" :path="path"
            @showTip="showTip" @hideTip="hideTip"></Node>
          <g>
            <defs>
              <marker id="linkArrow" :viewBox="`0 -${markerWidth} ${markerWidth} ${2*markerWidth}`" :markerWidth="markerWidth" :markerHeight="markerWidth * 2" orient="auto" :refX="markerWidth - 1">
                <path :d="`M0,-${markerWidth}L${markerWidth},0L0,${markerWidth}Z`" stroke-width="0" fill="rgba(0, 168, 236, 0.3)"></path>
              </marker>
            </defs>
            <defs>
              <marker id="linkArrow-common" :viewBox="`0 -${markerWidth} ${markerWidth} ${2*markerWidth}`" :markerWidth="markerWidth" :markerHeight="markerWidth * 2" orient="auto" :refX="markerWidth - 1">
                <path :d="`M0,-${markerWidth}L${markerWidth},0L0,${markerWidth}Z`" stroke-width="0" fill="rgba(0, 168, 236, 1)"></path>
              </marker>
            </defs>
            <defs>
              <marker id="linkArrow-alert" :viewBox="`0 -${markerWidth} ${markerWidth} ${2*markerWidth}`" :markerWidth="markerWidth" :markerHeight="markerWidth * 2" orient="auto" :refX="markerWidth - 1">
                <path :d="`M0,-${markerWidth}L${markerWidth},0L0,${markerWidth}Z`" stroke-width="0" fill="#e04c4c"></path>
              </marker>
            </defs>
            <MapLine v-for="(edge, key) in visibleEdges" :key="key" :edge="edge" :alertFlag="lineAlertFlag(edge)"/>
          </g>
        </g>
      </svg>
       <ShowNameBox 
        :showTips = "showNameFlag"
        :showName = "showTipsName"
        :lefts = "tipsLeft"
        :top = "tipsTop"
      ></ShowNameBox>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';

  import TopoContainer from '@/components/editTopo/svg/TopoContainer';
  import * as d3 from 'd3';
  import { buildNodes } from '@/helpers/utils';
  import { serverNode, clientNode } from '@/helpers/nodeObject';
  import * as u from '@/pages/editTopo/utils';
  import { getDataPath } from '@/pages/editTopo/service';
  import ShowNameBox from '@/components/manageApp/main/ShowNameBox';
  import Node from './Node';
  import MapLine from './MapLine';

  export default {
    props: ['appName', 'activeList', 'current', 'path'], // app名称
    components: {
      TopoContainer,
      Node,
      MapLine,
      ShowNameBox,
    },
    created() {
      this.getDataPath();
    },
    data() {
      return {
        transform: 'translate(0, 0)',
        zoom: d3.zoom().scaleExtent([1 / 2, 8]).on('zoom', this.handleZoom),
        data: {},
        nodes: [],
        edges: [],
        width: window.outerWidth,
        height: window.outerHeight * 0.7 - 430,
        wrapper: null,
        viewBox: { x: 0, y: 0, width: 0, height: 0 },
        pScale: 1, // 前次缩放倍数
        containerWidth: 0,
        containerHeight: 0,
        innerWidth: 0,
        innerHeight: 0,
        markerWidth: 3,
        showNameFlag: false, // 提示框
        showTipsName: 'tishi111',
        tipsLeft: 10,
        tipsTop: 0,
        nodeY: [],
        min: 0,
      };
    },
    computed: {
      visibleEdges() {
        return _.filter(this.edges, e => e.visible);
      },
    },
    methods: {
      dedupe(array) { // 数组去重
        return Array.from(new Set(array));
      },
      locationStatus(node) {
        let intfName = '';
        let locationFlag = null;
        if (node.intf !== null) {
          intfName = `intf${node.intf}`;
          this.activeList.forEach((item) => {
            if (item.intf_name === intfName) {
              if (item.location > 0) locationFlag = true;
              else locationFlag = false;
            }
          });
        }
        return locationFlag; // eslint-disable-line
      },
      alertFlag(node) {
        let intfName = '';
        let alertFlag = null;
        if (node.intf !== null) {
          intfName = `intf${node.intf}`;
          this.activeList.forEach((item) => {
            if (item.intf_name === intfName) {
              alertFlag = item.is_alert;
            }
          });
        }
        return alertFlag; // eslint-disable-line
      },
      lineAlertFlag(edge) {
        let sourceIntf = '';
        let targetIntf = '';
        let sourceFlag = false;
        let targetFlag = false;
        let alertFlag = null;
        sourceIntf = `intf${edge.sourceNodeId}`;
        targetIntf = `intf${edge.targetNodeId}`;
        if (this.path.includes(sourceIntf) && this.path.includes(targetIntf)) {
          this.activeList.forEach((item) => {
            if (item.intf_name === sourceIntf && item.location > 0) sourceFlag = true;
            if (item.intf_name === targetIntf && item.location > 0) targetFlag = true;
            if (sourceFlag && targetFlag) alertFlag = true;
            else alertFlag = false;
          });
        }
        return alertFlag; // eslint-disable-line
      },
      async getDataPath() {
        try {
          const res = await getDataPath(this.appName);
          if (res.data.code === 0) {
            this.data = res.data.data;
            const mapData = buildNodes(this.data);
            this.nodes = mapData.nodes;
            this.edges = mapData.edges;
            this.$nextTick(() => {
              this.innerWidth = this.$el.querySelector('#node-container').getBBox().width;
              this.innerHeight = this.$el.querySelector('#node-container').getBBox().height;
              this.containerWidth = d3.select('#svg-container')._groups[0][0].offsetWidth;
              this.containerHeight = d3.select('#svg-container')._groups[0][0].offsetHeight;
              this.viewBox = { x: -((this.containerWidth - this.innerWidth - 200) / 2), y: -((this.containerHeight - this.innerHeight - 150) / 2), width: this.width, height: this.height };
            });
          }
        } catch (e) {
          // console.log(e);
        }
      },
      handleZoom() {
        this.transform = d3.event.transform;
      },
      nodeObj(node) {
        const { levelNum, type, iconName, dispName, groupId, id, x, y } = node;
        const obj = node.type === 'server' ? _.cloneDeep(serverNode) : _.cloneDeep(clientNode);
        obj.settings.name = levelNum;
        obj.settings.type = type;
        obj.settings.disp_name = dispName;
        obj.settings.imgname = iconName;
        obj.settings.pos = u.coordUnitTransInverse({ x, y });
        obj.settings.groupId = groupId;
        obj.settings.id = id;
        if (node.type === 'server') {
          obj.collector[0].name = `intf${node.intf}`;
        }
        return obj;
      },
      initZoom() {
        this.wrapper = d3.select(this.$el);
        this.zoom(this.wrapper);
        this.wrapper.on('mousemove', this.updatePreEdge);
      },
      initSvg() {
        this.viewBox.width = this.width / this.pScale;
        this.viewBox.height = this.height / this.pScale;
      },
      showTip(position) {
        this.showNameFlag = true;
        this.showTipsName = position.tipName;
        this.tipsLeft = position.left;
        this.tipsTop = position.top;
      },
      hideTip() {
        this.showNameFlag = false;
      },
    },
    mounted() {
      this.initSvg();
      this.wrapper = d3.select(this.$el);
      this.zoom(this.wrapper);
      window.addEventListener('resize', this.initSvg);
    },
  };
</script>

<style lang="scss">
  .lite-path-map{
    .topo-area {
      .container{
        
      }
    }
  }
</style>
<style lang="scss" scoped>
.lite-path-map{
  width: 100%;
  height:100%;

  .topo-area {
    width:100%;
    height:100%;
    top: 95px;
    overflow-x: hidden;
    overflow-y: hidden;
    bottom: 0;
  }
}
</style>