<template>
  <div>
    <NavBar :title="'spdindex'" />
    <breadcrumb :title="'可视化服务图设计'" :crumbList="['index', '网络侦测', mapName, '数据源自动梳理']" ref="breadc">
      <ul class="dataPack-right" slot="btnGroup">
        <li v-if="this.session$.newpermissions.spd_snapshoot_detail"><a @click="locationTo('snapshot')">快照</a></li> 
      </ul>
    </breadcrumb>
    <div class="main-content">
      <div class="main-content-inner" ref="mainInner">
        <LeftPanel
          :nodes="nodes"
          :showData="showData"
          :ipDevices="ipDevices"
          @setTidyMethod="setTidyMethod"
          ref="leftPanel"
        />
        <div class="content" ref="content">
          <div class="buttons" :style="{ marginLeft: btnsMarginLeft+'px' }">
            <a class="front"
              v-show="showScrollButton && btnsMarginLeft !== 0"
              :style="{ left: -btnsMarginLeft+'px' }"
              @click="toFront"
              >
                <img src="../../../assets/left-arrow.png" />
              </a>
            <a class="behind"
              v-show="showScrollButton && btnsMarginLeft !== btnsMovingZone.min"
              :style="{ right: btnsMarginLeft+'px' }"
              @click="toBehind"
            >
              <img src="../../../assets/right-arrow.png" />
            </a>
            <a 
              v-for="(button, k) in buttons"
              :key="k"
              @click="onClickButton(button, k)"
              :class="{ active: activeButton === k }"
            > {{ button }}</a>
          </div>
          <PackMap
            :edges="edges"
            :nodes="nodes"
            :ipDevices="ipDevices"
            :showMode="mapShowMode"
            ref="map"
          />
          <div class="toolbar">
            <button class="map" @click="locationTo('map')"><i class="toolbar-icon map"></i></button>
            <div>
              <button class="save" @click="saveIpNames"><i class="toolbar-icon save"></i></button>
              <button class="snapshot" @click="showSnapchatModal"><i class="toolbar-icon snapshot"></i></button>
              <button class="convert" @click="() => {mapShowMode = (mapShowMode=== 'ip' ? 'device' : 'ip') }"><i class="toolbar-icon convert"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-panel">
        <SlickGridTable
          :columns="tableColumns"
          :data="flows"
          @bottomCollapseChange="onBottomCollapse"
        />
      </div>
    </div>
    <CmTip
      tipTitle="创建新快照"
      :tipContent="'创建新快照'"
      v-if="showModal"
      :closeFn="closeSnapchatModal"
      :showFooter="true"
      :tipHeight="true"
      @on-confirm="submitSnapShot"
      ref="cmtip"
      >
      <div slot="content" class="new-snapshot-modal">
        <label>
          <span>名称</span>
          <input type="text" v-model="newSnapshotName" readonly>
        </label>
      </div>
      <div slot="content" class="new-snapshot-show">
        <span>预览</span>
        <div  class="new-snapshot-show-card">
          <div class="svg-mask"></div>
          <PackMap
            :edges="SnapshotEdges"
            :nodes="SnapshotNodes"
            :ipDevices="ipDevices"
            ref="map"
          />
        </div>
      </div>
    </CmTip>
  </div>
</template>
<script>

import NavBar from '@/components/common/NavBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import SlickGridTable from '@/components/dataPack/SlickGridTable';
import PackMap from '@/components/dataPack/Map';
import LeftPanel from '@/components/dataPack/LeftPanel';
import CmTip from '@/components/common/CmTip';
import { mapState } from 'vuex';

import _ from 'lodash';

import * as api from '../service';

import Graph from '../graphUtils/graph';
import kruskal from '../graphUtils/kruskal'; // eslint-disable-line
import DepthFirstPaths from '../graphUtils/depthFirstPaths';

const flowSample = { // eslint-disable-line
  prot_stack: [],
  bytes_a2b: 3358,
  port_b: '60566',
  port_a: '35827',
  ip_b: '10.1.34.21',
  availability: '',
  ip_a: '10.1.32.8',
  bytes_b2a: 3576,
  device_b: 'DaSB',
  device_a: 'SB',
  bytes: 6934,
  conn_type: 'S',
  tcp_tag: 'S.F.R.',
};

/* eslint-disable radix, no-param-reassign */

const padFLows = (flows, nodes) => {
  const TYPES = {
    S: '同步',
    A: '异步',
  };
  const nodesCache = {};
  return flows.map((flow, indexs) => {
    const id = `${indexs}-${flow.ip_a}${flow.ip_b}`;
    const connType = TYPES[flow.conn_type];

    let nodeA = nodesCache[flow.ip_a];
    if (!nodeA) {
      nodeA = _.find(nodes, n => n.ip_ports.map(k => k[0]).indexOf(flow.ip_a) > -1);
      nodesCache[flow.ip_a] = nodeA;
    }

    let nodeB = nodesCache[flow.ip_b];
    if (!nodeB) {
      nodeB = _.find(nodes, n => n.ip_ports.map(k => k[0]).indexOf(flow.ip_b) > -1);
      nodesCache[flow.ip_b] = nodeB;
    }

    const nodeNameA = nodeA.raw ? '' : nodeA.name;
    const nodeNameB = nodeB.raw ? '' : nodeB.name;
    const index = indexs + 1;

    return { ...flow, id, index, connType, nodeA: nodeNameA, nodeB: nodeNameB };
  });
};

const nodeInstance = { // eslint-disable-line
  ip: 'ip1',
  ports: [flowSample],
};

const nodesInstance = { // eslint-disable-line
  ip1: nodeInstance,
  ip2: nodeInstance,
};

const edgeInstance = { // eslint-disable-line
  n1: 'ip1',
  n2: 'ip2',
};

const buttonW = 250;

let map = 'map5';
let datasource = 'datasource_12';

export default {
  components: {
    NavBar,
    SlickGridTable,
    PackMap,
    LeftPanel,
    CmTip,
    Breadcrumb,
  },
  data() {
    return {
      crumbList: ['index', 'manageapp', '数据包梳理'],
      activeButton: 0,
      resultsCount: 0,
      flows: [],
      nodes: [],
      edges: [],
      showData: [], // 左侧展示输入框
      SnapshotNodes: [],
      SnapshotEdges: [],
      mapName: '',  // 导航栏项目名
      CreatSnap: [],
      activePanel: 0,
      ifSnop: false, // 是否生成快照
      tableColumns: [
        { id: 'no_index', name: ('序号'), field: 'index', cssClass: 'no_index', headerCssClass: 'no_index', resizable: true, sortable: true, selectable: false, width: 50 },
        { id: 'node_a', name: ('节点A'), field: 'nodeA', cssClass: '', headerCssClass: 'node', resizable: true, sortable: true, selectable: false, formatter: window.Slick.Formatters.LongTextTipFormatter },
        { id: 'ip_a', name: ('地址A'), field: 'ip_a', cssClass: '', headerCssClass: 'ip', resizable: true, sortable: true, selectable: false, minWidth: 100 },
        { id: 'device_a', name: ('设备A'), field: 'device_a', cssClass: '', headerCssClass: 'device', resizable: true, sortable: true, selectable: false, formatter: window.Slick.Formatters.LongTextTipFormatter },
        { id: 'port_a', name: ('端口A'), field: 'port_a', cssClass: '', headerCssClass: 'port_a', resizable: true, sortable: true, selectable: false, formatter: window.Slick.Formatters.PortWithIcon },
        { id: 'node_b', name: ('节点B'), field: 'nodeB', cssClass: '', headerCssClass: 'node', resizable: true, sortable: true, selectable: false, formatter: window.Slick.Formatters.LongTextTipFormatter },
        { id: 'ip_b', name: ('地址B'), field: 'ip_b', cssClass: '', headerCssClass: 'ip', resizable: true, sortable: true, selectable: false, minWidth: 100 },
        { id: 'device_b', name: ('设备B'), field: 'device_b', cssClass: '', headerCssClass: 'device', resizable: true, sortable: true, selectable: false, formatter: window.Slick.Formatters.LongTextTipFormatter },
        { id: 'port_b', name: ('端口B'), field: 'port_b', cssClass: '', headerCssClass: 'port_b', resizable: true, sortable: true, selectable: false, formatter: window.Slick.Formatters.PortWithIcon },
        { id: 'bytes_a2b', name: ('A-B字节'), field: 'bytes_a2b', cssClass: 'byte', headerCssClass: 'byte', resizable: true, sortable: true, selectable: false, formatter: window.Slick.Formatters.NumberWithCommas, defaultSortAsc: false },
        { id: 'bytes_b2a', name: ('B-A字节'), field: 'bytes_b2a', cssClass: 'byte', headerCssClass: 'byte', resizable: true, sortable: true, selectable: false, formatter: window.Slick.Formatters.ByteWithSpan, defaultSortAsc: false },
        { id: 'bytes', name: ('总字节'), field: 'bytes', cssClass: 'byte', headerCssClass: 'bytes', resizable: true, sortable: true, selectable: false, formatter: window.Slick.Formatters.ByteWithSpan, defaultSortAsc: false },
        { id: 'availability', name: ('可用性'), field: 'availability', cssClass: 'availability', headerCssClass: 'availability', resizable: true, sortable: true, selectable: false },
        { id: 'connection_type', name: ('模式'), field: 'connType', cssClass: 'conn_type', headerCssClass: 'conn_type', resizable: true, sortable: true, selectable: false },
        { id: 'tcp_tag', name: ('标志位'), field: 'tcp_tag', cssClass: 'tcp_tag', headerCssClass: 'tcp_tag', resizable: true, sortable: false, selectable: false },
        { id: 'prot_stack', name: ('协议'), field: 'prot_stack', cssClass: 'prot_stack', headerCssClass: 'prot_stack', resizable: true, sortable: false, selectable: false },
      ],
      showScrollButton: false,
      btnsMarginLeft: 0,
      btnsMovingZone: {
        min: 0,
        max: 0,
      },
      showModal: false,
      newSnapshotName: '',
      ipDevices: {
        exclude_ips: [],
        include_ips: [],
        normal_ips: [],
      },
      mapShowMode: 'ip',
    };
  },
  computed: {
    ...mapState({
      appId: state => state.appId,
      intfId: state => state.intfId,
    }),
    buttons() {
      const original = ['源数据包状态'];
      if (this.resultsCount === 0) {
        return original;
      }
      const graphLongestPaths = _.range(1, this.resultsCount).map(k => `梳理结果${k}`);
      return original.concat(graphLongestPaths);
    },
    graph() {
      const self = this;
      const graph = new Graph(false);
      _.forEach(self.edges, (e) => {
        graph.addEdge(e.node_nameA, e.node_nameB);
      });
      return graph;
    },
    nodesSeq() {
      const vertices = _.keys(this.graph.adjList);
      return vertices.sort((a, b) => this.graph.neighbors(b).length - this.graph.neighbors(a).length);
    },
  },
  methods: {
    locationTo(path) {
      window.location = `/zh-cn/spd/${map}/overview/#${path}`;
    },
    // mapData for save
    saveIpNames() {
      let savingNodes = _.cloneDeep(this.$refs.leftPanel.$data.editingNodes.filter(n => n.drawProperties.status !== 'highlight'));
      const ids = [];
      const newSavingNodes = [];
      _.forEach(savingNodes, (n) => {
        if (n.ipWithName[0].name === '') {
          console.log('null名称');
          n.name = n.ipWithName[0].addr;
        } else {
          n.name = n.ipWithName[0].name;
        }
        delete n.drawProperties;
        delete n.ipWithName;
        if (!n.confirmSegments) n.confirmSegments = [];
        ids.push(n.id);
      });
      savingNodes = savingNodes.concat(this.nodes.filter(n => !n.raw && ids.indexOf(n.id) < 0));
      savingNodes.forEach((e) => {
        if (e.name !== e.ip_ports[0][0]) {
          e.raw = false;
        } else e.raw = true;
        newSavingNodes.push(e);
      });
      const data = {
        id: '',
        nodes: newSavingNodes,
        edges: [],
        max_node_id: Math.max(...newSavingNodes.map(n => n.id), 0),
        hidebox: { other_raw_ips: [] },
        map_png: '',
      };
      api.saveIpName(map, datasource, data).then((res) => {
        console.log('res', res);
        // eslint-disable-next-line
        new Promise(async (resolve, reject) => {
          try {
            await this.getDataSource();
            // 主动调用
            this.onClickButton(null, this.activeButton);
            CmTip.confirm({
              tipTitle: '提示',
              tipContent: '保存成功',
              onClose: () => {},
            });
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    },
    editNodesName(nodes) {
      console.log('nodes', nodes);
    },
    closeSnapchatModal() {
      this.showModal = false;
      this.newSnapshotName = '';
    },
    showSnapchatModal() {
      const _this = this;
      let snum = 0;
      this.ifSnop = false;
      const ifCreatSnap = this.$refs.map;
      if (ifCreatSnap !== undefined) {
        this.CreatSnap = ifCreatSnap;
      }
      const nodes = _.cloneDeep(this.CreatSnap.$data.circles.filter(n => n.drawProperties.status === 'normal'));
      nodes.forEach((is) => {
        if (!is.raw) snum = 1;
      });
      if (snum === 0) {
        this.ifSnop = true;
      }
      // const edgesa = this.edges;
      const edges = this.edges.filter(e => e.drawProperties.status !== 'blur');
      nodes.forEach((n) => { n.pos = { x: n.x, y: n.y }; });
      if (!nodes.length) return;
      const mapDatas = {
        edges,
        hidebox: {
          other_raw_ips: [],
        },
        id: '',
        max_node_id: Math.max(...nodes.map(n => n.id), 0),
        nodes,
        snapshot_name: this.newSnapshotName,
      };
      const SnapshotDatas = this.SnapshotData(mapDatas);
      this.showModal = true;
      api.queryNewSnapshotName().then((res) => {
        this.newSnapshotName = res.data.data.new_name;
        _this.SnapshotNodes = SnapshotDatas.nodes;
        _this.SnapshotEdges = SnapshotDatas.edges;
        console.log(_this.SnapshotNodes);
      }).catch((e) => {
        console.error(e);
      });
    },
    submitSnapShot() { // 创建快照按钮
      // positioned nodes
      let pnum = 0;
      const nodes = _.cloneDeep(this.CreatSnap.$data.circles.filter(n => n.drawProperties.status === 'normal'));
      const edges = this.edges.filter(e => e.drawProperties.status !== 'blur');
      nodes.forEach((n) => { n.pos = { x: n.x, y: n.y }; });
      nodes.forEach((naq) => {
        if (!naq.raw) pnum = 1;
      });
      if (pnum === 0) return;
      const mapDatas = {
        edges,
        hidebox: {
          other_raw_ips: [],
        },
        id: '',
        max_node_id: Math.max(...nodes.map(n => n.id), 0),
        nodes,
        snapshot_name: this.newSnapshotName,
      };
      const SnapshotData = this.SnapshotData(mapDatas);
      const mapPng = this.svgToImg(nodes, edges, 295, 162);
      console.log(SnapshotData);
      api.createSnapshot(map, SnapshotData, mapPng).then((res) => {
        console.log(res.data);
        this.closeSnapchatModal();
        CmTip.confirm({
          tipTitle: '提示',
          tipContent: '保存成功',
          onClose: () => {},
        });
      });
    },
    getMapSize(nodes) {
      const xs = nodes.map(n => n.x);
      const ys = nodes.map(n => n.y);
      const xMin = Math.min(...xs);
      const xMax = Math.max(...xs);
      const yMin = Math.min(...ys);
      const yMax = Math.max(...ys);

      return {
        xMin,
        xMax,
        yMin,
        yMax,
      };
    },
    SnapshotData(mapData) { // 过滤没有点击的点和线
      const tODataNodes = mapData.nodes;
      const toDataEdges = mapData.edges;
      let dataNodesId = '';
      const newNodesArr = [];
      const newEdgesArr = toDataEdges;
      tODataNodes.forEach((item) => {
        if (!item.raw) {
          newNodesArr.push(item);
        } else {
          dataNodesId = item.id;
        }
        toDataEdges.forEach((itema, index) => {
          if (itema.nodeA === dataNodesId || itema.nodeB === dataNodesId) {
            newEdgesArr.splice(index, 1);
          }
        });
      });
      mapData.nodes = newNodesArr;
      mapData.edges = newEdgesArr;
      return mapData;
    },
    svgToImg(nodes, edges, width, height) { // svg 转化成png
      this.dataNodes = nodes;
      this.dataEdges = edges;
      const sizes = this.getMapSize(nodes);
      console.log(sizes, width, height);
      let data = new XMLSerializer().serializeToString(this.$refs.map.$el.querySelector('svg'));
      console.log(data);
      const mapWidthStr = `width="${width}"`;
      const mapHeightStr = `height="${height}"`;
      const heightReg = /height="([+-]?\d*\.?\d*)"/;
      const widthReg = /width="([+-]?\d*\.?\d*)"/;

      data = data.replace(heightReg, mapHeightStr).replace(widthReg, mapWidthStr);
      const transformReg = /transform="[^<>]*"/;
      // const yScale = height / (sizes.yMax - sizes.yMin + 100);
      // const xScale = width / (sizes.xMax - sizes.xMin + 100);
      // const transform = transformReg.exec(data);
      // const parts = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform[0]) || [0, 0, 0];
      // const firstX = parts[1];
      // const firstY = parts[2];
      // const transformStr = `transform="translate(${firstX}, ${firstY}) scale(${yScale < xScale ? yScale : xScale})"`;
      const transformStr = `transform="translate(${0}, ${0}) scale(${2.5})"`;
      data = data.replace(transformReg, transformStr);
      const viewBox = [sizes.xMin - 260, sizes.yMin - 260, sizes.xMax - sizes.xMin + 350, sizes.yMax - sizes.yMin + 350];

      let adj;
      if ((height / viewBox[3]) * viewBox[2] < width) {
        adj = height / viewBox[3];
      } else {
        adj = width / viewBox[2];
      }
      const mapWidth = viewBox[2] * adj;
      const mapHeight = viewBox[3] * adj;
      viewBox[0] -= ((width - mapWidth) / 2) / adj;
      viewBox[1] -= ((height - mapHeight) / 2) / adj;

      const viewboxStr = `viewBox="${viewBox.toString()}"`;

      data = data.replace(/viewBox="[+-]?\d*\.?\d* [+-]?\d*\.?\d* [+-]?\d*\.?\d* [+-]?\d*\.?\d*"/, viewboxStr);

      // remove unnessary line and circles
      const jqSvg = window.$(data);
      jqSvg.find('g[data-status="blur"]').remove();
      jqSvg.find('line[data-status="blur"]').remove();

      data = new XMLSerializer().serializeToString(jqSvg[0]);
      console.log(data);
      const canvas = window.$('<canvas></canvas>');
      window.canvg(canvas[0], data);
      // document.body.appendChild(canvas[0]);
      const mapPng = canvas[0].toDataURL('image/png');
      return mapPng;
    },
    onBottomCollapse(isCollapse) {
      this.$refs.mainInner.style.height = isCollapse ? '100%' : 'calc(100% - 200px)';
      window.dispatchEvent(new Event('resize'));
    },
    toFront() {
      if (this.btnsMarginLeft + buttonW >= this.btnsMovingZone.max) this.btnsMarginLeft = this.btnsMovingZone.max;
      else this.btnsMarginLeft += buttonW;
    },
    toBehind() {
      if ((this.btnsMarginLeft - 240) <= this.btnsMovingZone.min) {
        this.btnsMarginLeft = this.btnsMovingZone.min;
      } else this.btnsMarginLeft -= buttonW;
    },
    updateScrollButtons() {
      this.btnsMovingZone.min = this.$refs.content.clientWidth - this.buttons.length * buttonW;
      this.showScrollButton = this.$refs.content.clientWidth < this.buttons.length * buttonW;
    },
    setTidyMethod(e) {
      let resultsCount;
      if (this.edges.length === 0) {
        return;
      }
      if (e === 'original' || e === '') {
        this.setAllEdgesTo('normal');
        this.setAllNodesTo('normal');
        this.resultsCount = 0;
        this.activeButton = 0;
      } else if (e === 'flowSize') {
        this.tidyByFlowSize(0);
        resultsCount = this.edges.length + 1;
        this.resultsCount = resultsCount > 11 ? 11 : resultsCount;
        this.activeButton = 1;
      } else if (e === 'importance') {
        this.tidyByImportance(0);
        resultsCount = this.edges.length === 1 ? 2 : this.nodesSeq.length + 1;
        this.resultsCount = resultsCount > 11 ? 11 : resultsCount;
        this.activeButton = 1;
      } else if (e === 'complexity') {
        this.tidyByComplexity(0);
        this.activeButton = 1;
      }
      this.tidyMethods = e;
      this.updateScrollButtons();
      this.btnsMarginLeft = 0;
    },
    onClickButton(t, k) {
      this.activeButton = k;
      if (k === 0) {
        this.setAllEdgesTo('normal');
        this.setAllNodesTo('normal');
      } else {
        switch (this.tidyMethods) {
          case 'flowSize':
            this.tidyByFlowSize(k - 1);
            break;
          case 'importance':
            this.tidyByImportance(k - 1);
            break;
          case 'complexity':
            this.tidyByComplexity(k - 1);
            break;
          default:
            break;
        }
      }
    },
    async getDataSource() {
      try {
        const res = await api.getMapData(map, datasource);
        const { topov_map, flows, spd_settings: ipDevices } = res.data.data;
        this.mapName = res.data.data.desc;
        const newNodes = [];
        topov_map.nodes.forEach((item) => {
          if (item.name === item.ip_ports[0][0]) item.raw = true;
          newNodes.push(item);
        });
        this.initNodes(newNodes);
        this.initEdges(topov_map.links, topov_map.nodes);
        this.flows = padFLows(flows, topov_map.nodes);
        // ip设备名对照表
        this.ipDevices = { ...ipDevices };
      } catch (e) {
        console.error(e);
      }
    },
    initNodes(nodes) {
      this.nodes = _.map(nodes, n => ({
        ...n,
        size: 10,
        ...{ drawProperties: {
          status: 'normal',
        },
        },
      }));
    },
    initEdges(edges, nodes) {
      const sortedEdges = edges.sort((a, b) => (b.weight - a.weight));
      this.edges = _.map(sortedEdges, (e, i) => ({
        ...e,
        ...{ drawProperties: {
          status: 'normal',
        },
        },
        id: i,
        node_nameA: nodes.filter(n => n.id === e.nodeA)[0].name,
        node_nameB: nodes.filter(n => n.id === e.nodeB)[0].name }));
    },
    findNodeByName(names) {
      if (!_.isArray(names)) names = [names];
      return _.filter(this.nodes, n => names.indexOf(n.name) > -1 || names.some(name => n.ip_ports.map(p => p[0]).indexOf(name) > -1));
    },
    /**
     * 按照流量大小梳理, 显示流量最大的 topN 个
     * @param topN Number
    */
    tidyByFlowSize(topN) {
      this.setAllEdgesTo('blur');
      this.setAllNodesTo('blur');

      // let i = 0;
      // while (i < topN && i < this.edges.length) {
      if (topN < this.edges.length) {
        const tEdge = this.edges[topN];
        this.setNodesTo([tEdge.node_nameA, tEdge.node_nameB], 'normal');
        tEdge.drawProperties.status = 'highlight';
        this.nodesComputed(tEdge);
        // i += 1;
      }
    },
    nodesComputed(tEdge, ifN, num) {
      const nodesAll = this.nodes;
      let newNodes = [];
      switch (ifN) {
        case 'tidyByComplexity':
          tEdge.forEach((item) => {
            newNodes.push(_.filter(nodesAll, e => e.id === item.nodeA || e.id === item.nodeB)[0]);
            newNodes.push(_.filter(nodesAll, e => e.id === item.nodeA || e.id === item.nodeB)[1]);
            newNodes = _.uniqWith(newNodes, _.isEqual);
          });
          break;
        case 'tidyByImportance':
          tEdge[num].forEach((item) => {
            newNodes.push(_.filter(nodesAll, e => e.name === item)[0]);
          });
          break;
        default:
          newNodes = _.filter(nodesAll, e => e.id === tEdge.nodeA || e.id === tEdge.nodeB);
          break;
      }
      this.showData = newNodes;
    },
    /**
     * 按照重要程度梳理, 按照连接数量排序，显示第 solutionN 个结果
     * @param solutionIndex 结果下表
    */
    tidyByImportance(solutionIndex) {
      this.setAllEdgesTo('blur');
      this.setAllNodesTo('blur');

      if (solutionIndex >= 10 && solutionIndex >= this.nodesSeq.length) {
        return;
      }
      const centerNodeName = this.nodesSeq[solutionIndex];

      this.highlightCenterNode(centerNodeName);
    },
    /**
     * 按照复杂度梳理
     * 调试选项 window.showPathOnly 设置是否只显示路径上的点
    */
    tidyByComplexity(k) {
      this.setAllEdgesTo('blur');
      this.setAllNodesTo('blur');

      const mst = _.clone(this.graph); // kruskal(_.clone(this.graph));

      // 每个点的最长路径
      const pointsLongestPaths = [];
      for (let s of mst.vertices) { // eslint-disable-line
        const search = new DepthFirstPaths(mst, s);
        const paths = [];
        for (let d of mst.vertices) { // eslint-disable-line
          if (search.hasPathTo(d)) {
            const path = search.pathTo(d);
            paths.push(path);
          }
        }
        const longestPath = _.maxBy(paths, 'length');
        pointsLongestPaths.push(longestPath);
      }

      let maxPathLength = 0;

      // 最长的路径数组
      let graphLongestPaths = [];
      _.forEach(pointsLongestPaths, (path) => {
        if (path.length > maxPathLength) {
          maxPathLength = path.length;
          graphLongestPaths = [path];
        } else if (path.length === maxPathLength) {
          graphLongestPaths.push(path);
        }
      });
      console.log('Longest path ', maxPathLength);
      // 随机取长度最长10个
      graphLongestPaths = _.uniqWith(graphLongestPaths, _.isEqual);
      const lenthAll = graphLongestPaths.filter(e => e.length === maxPathLength);
      const lengMax = lenthAll.length > 10 ? 10 : lenthAll.length;
      const dataMaxPath = lenthAll.sort().slice(1, lengMax + 1);
      // 随机取长度最长10个
      // const dataMaxPath = lenthAll.sort(() => 0.5 - Math.random()).slice(0, lengMax);
      // const lenthAll = graphLongestPaths.filter(e => e.length === maxPathLength).sort(() => 0.5 - Math.random()).slice(0, 10);

      // 过滤重复结果
      // let result = [];
      // graphLongestPaths.forEach((path) => {
      //   let pathNeighbors = [];
      //   path.forEach((n) => {
      //     const neighbors = mst.neighbors(n);
      //     pathNeighbors = pathNeighbors.concat(neighbors);
      //   });
      //   pathNeighbors = _.uniq(pathNeighbors);
      //   result.push(pathNeighbors);
      // });

      // result = _.uniqWith(result, _.isEqual);
      // this.nodesComputed(result, 'tidyByImportance', k);
      this.nodesComputed(dataMaxPath, 'tidyByImportance', k);
      this.resultsCount = this.edges.length === 1 ? 2 : dataMaxPath.length + 1;
      // const selectedResult = window.showPathOnly ? graphLongestPaths[k] : result[k];
      const selectedResult = dataMaxPath[k];
      _.forEach(selectedResult, (n) => {
        this.setNodesTo(n, 'normal');
      });
      _.forEach(this.edges, (e) => {
        if (selectedResult.indexOf(e.node_nameA) > -1 && selectedResult.indexOf(e.node_nameB) > -1) e.drawProperties.status = 'highlight';
      });
    },
    /**
     * 高亮中心节点
     */
    highlightCenterNode(centerNodeName) {
      const highlightedEdges = _.filter(this.edges, e => e.node_nameA === centerNodeName || e.node_nameB === centerNodeName);

      _.forEach(highlightedEdges, (e) => {
        e.drawProperties.status = 'highlight';
        this.setNodesTo([e.node_nameA, e.node_nameB], 'normal');
      });

      this.setNodesTo(centerNodeName, 'normal');
      this.nodesComputed(highlightedEdges, 'tidyByComplexity');
    },
    setNodesTo(nodeName, status) {
      const nodes = this.findNodeByName(nodeName);
      if (nodes.length) nodes.forEach((node) => { node.drawProperties.status = status; });
    },
    setEdgeTo(nodeA, nodeB, status) {
      const edge = _.find(this.edges, e => (e.node_nameA === nodeA && e.node_nameB === nodeB) || (e.node_nameB === nodeA && e.node_nameA === nodeB));
      if (edge) edge.drawProperties.status = status;
    },
    setAllEdgesTo(status) {
      _.forEach(this.edges, (e) => {
        e.drawProperties.status = status;
      });
    },
    setAllNodesTo(status) {
      _.forEach(this.nodes, (n) => {
        n.drawProperties.status = status;
      });
    },
  },
  watch: {
    SnapshotEdges() {
      // 按钮禁止事件
      if (this.$refs.cmtip) {
        if (this.ifSnop) this.$refs.cmtip.$el.childNodes[0].childNodes[5].childNodes[0].style.cursor = 'no-drop';
      }
    },
  },
  beforeCreate() {
    const { href } = window.location;
    // eslint-disable-next-line
    let [r, m, d] = (/spd\/(map\d+)\/filter\/(datasource_\d+)/.exec(href) || [0, 0, 0]);
    if (!m) m = 'map2';
    if (!d) d = 'datasource_7';
    map = m;
    datasource = d;
  },
  mounted() {
    this.$refs.breadc.$el.childNodes[0].childNodes[2].children[0].classList.add('crumb-now');
    this.$refs.breadc.$el.childNodes[0].childNodes[1].children[0].addEventListener('click', () => {
      let mapName = window.localStorage.getItem('mapName');
      if (mapName === null) mapName = 'map1';
      window.location.href = `/zh-cn/spd/${mapName}/overview/#datasource`;
    });
    api.getDataSource(map);
    api.getMapSnapshots(map);
    this.getDataSource();
    this.updateScrollButtons();
    window.addEventListener('resize', this.updateScrollButtons);
  },
};

</script>

<style lang="scss" scoped>
.dataPack-right{
  float: right;
  position: absolute;
  right: 0;
  top: 50px;
  font-size: 14px;
  >li{
    >a{
      width: 88px !important;
      &:hover{
      background: #34ADA0;
      color: #fff;
      }
    }
  }
}
.new-snapshot-show{
    >span{
      position: absolute;
      left: 50px;
      font-weight: 700;
    }
    .new-snapshot-show-card{
      width: 265px;
      height: 161px;
      top: 1px;
      background-color: #1b2c39;
      border: 1px solid #43becd;
      position: relative;
      display: inline-block;
      margin-left: 90px;
      margin-right: -20px;
      margin-bottom: 19px;
      cursor: pointer;

      .svg-mask{
        width: 264px;
        height: 160px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        background: rgba(0,0,0,0);
        cursor: default;
      }
    }
}
.new-snapshot-modal {
  padding: 10px 50px;

  span {
    margin-right: 10px;
  }
  
  input {
    width: 80%;
    cursor: no-drop;
  }
}

.spd-body-menu-icon{
  display: inline-block;
  margin-right: 10px;
  top: 8px;
  position: relative;

  &.auto {
    background: url(../../../assets/dataPack/auto-filter.svg) no-repeat;
    background-size: cover;
    top: 4px;
  } 

  &.b-snapshot {
    background: url(../../../assets/dataPack/top-2-white.png) no-repeat;
  }

  &.datasource {
    background: url(../../../assets/dataPack/top-3-white.png) no-repeat;
  }
}

div.breadcrumb-div {
  // padding-left: 35px;
  // height: 50px;
  // line-height: 50px;
  // width: 100%;
  // background: #08141b;
  // display: flex;
  // justify-content: space-between;
  // align-content: center;
  // box-sizing: border-box;
  // flex-direction: row-reverse;
  // z-index: 5;

  ul {
    display: flex;
    flex-direction: row;
    margin: 0;

    li {
      margin-left: 10px;
      width: 90px;
      height: 100%;
      color: #34ADA0;
      cursor: pointer;
      border-radius: 1px;
      line-height: 45px;
      text-align: center;
      &.active {
        border-bottom: 3px solid #47C7BD;
      }

      a {
        cursor: pointer;
        float: right;
        font-size: 12px;
        width: 70px;
        border: 1px solid #3dd9c4;
        color: #fff;
        padding: 0px 8px 0px 8px;
        font-size: 13px;
        text-align: center;
        border-radius: 30px;
        line-height: 16px;
        height: 26px;
        line-height: 26px;
        margin: 8px 15px 0 0;
      }
    }
  }
}

div.main-container {
  position: relative;
}

div.main-content {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  top: 94px;
  overflow: hidden;
}

div.main-content-inner {
  display: flex;
  flex-direction: row;
  height: calc(100% - 200px);
}

div.content {
  overflow: hidden;
  width: 80%;
  margin: 0 5px 5px 0;
  box-sizing: border-box;
  position: relative;

  .toolbar {
    position: absolute;
    top: 50px;
    left: 10px;
    // border: 1px solid #122D46;
    // background-color: #122D46;

    height: 60px;
    display: flex;

    >div {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
    }

    button {
      width: 35px;
      height: 30px;
      padding: 0;
      margin: 0 0.5px;
      float: left;
      cursor: pointer;
      border: none;
      outline: none;
      background-color: #0A2035;
      z-index: 1000;
      position: relative;
      // border-right: 1px solid #34ADA0;
      // border-bottom: 1px solid #34ADA0;

      &.map {
        height: 60px;
        width: 60px;
      }

      :before {
        content: '';
        top: 30px;
        left: 5px;
        font-style: normal;
        font-size: 12px;
        position: absolute;
        visibility: hidden;
        color: #999;
        z-index: 1000;
      }

      &:hover {
        :before {
          visibility: visible;
        }
      }

      &.map ::before {
        content: '手动梳理';
        top: 60px;
      }

      &.save ::before {
        content: '保存';
        top: -15px;
        left: 5px;
      }

      &.snapshot ::before {
        content: '快照';
      }

      &.convert ::before {
        content: '转换';
      }
    }
  }
}

i.toolbar-icon {

  display: inline-block;
  width: 20px;
  height: 20px;
  margin-top: 3px;

  &.map {
    background: url(../../../assets/dataPack/top-1-not-white.png) no-repeat;
    background-size: contain;
    width: 35px;
    height: 35px;
  }

  &.snapshot {
    background: url(../../../assets/dataPack/snapshot.png) no-repeat;
    background-size: cover;
  }

  &.save {
    background: url(../../../assets/dataPack/save.png) no-repeat;
    background-size: cover;
  }

  &.convert {
    background: url(../../../assets/dataPack/convert.png) no-repeat;
    background-size: cover;
  }
}

div.buttons{
  width: 100%;
  background: #0d1b28;
  height: 36px;
  display: flex;
  position: relative;
  user-select: none;

  a {
    background: #163453;
    margin: 0 0 0 1px;
    color: #ccdce9;
    height: 100%;
    min-width: 250px;
    line-height: 36px;
    text-align: center;
    font-size: 14px;

    &.front, &.behind{
      position: absolute;
      width: 15px;
      min-width: 15px;
      opacity: 0.7;
      user-select: none;

      img {
        height: 100%;
        width: 100%;
      }
    }

    &.front{
      left: 0;
    }

    &.behind{
      right: 0;
    }

    &:first-child {
      margin-left: 0;
    }

    &.active {
      background:#32475c;
    }
  }
}

div.bottom-panel {
  background: #081f25;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}

</style>

