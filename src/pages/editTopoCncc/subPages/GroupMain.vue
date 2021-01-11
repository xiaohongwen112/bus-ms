<template>
  <div>
    <Loading :show="showLoading || showApplyLoading" />
    <nav-bar :title="'可视化服务图设计'" :appName="$store.state.appName"></nav-bar>
    <breadcrumb :title="'可视化服务图设计'" :crumbList="crumbList" :appName="$store.state.appName">
      <div slot="btnGroup" :class="[isButtonDisabled ? '' : 'disableAppBtn', 'topo-btn-group']">
        <input type="button" value="保存" ref="save"/>
        <input type="button" value="应用" ref="apply"/>
        <input type="button" value="导出拓扑图" ref="export"/>
      </div>
    </breadcrumb>

    <div class="td-left left-side" :class="{'collapse-menu': collapsed }">
      <div class="design-collapse" @click="toggleCollapseMenu" :class="{'collapse-menu': collapsed }" ></div>
      <div class="design-title">
        <div class="dtitle-text">主要组件</div>
      </div>
      <div class="main-icon" :class="{'collapse-menu': collapsed }">
        <ul style="display: inline-block;">
          <li class="row-block topo-coll topo-title-icon">
            <div class="border">
              <img src="../../../assets/topo-icon/client.svg" title="客户端节点" ref="clientBtn">
            </div>
            <p class="topt_p">客户端节点</p>
          </li>
          <li class="row-block topo-coll topo-title-icon">
            <div class="border">
              <img src="../../../assets/topo-icon/serverGroup.svg" title="服务器节点" ref="serverBtn">
            </div>
            <p class="topt_p">服务器节点</p>
          </li>
          <li class="row-block topo-coll topo-title-icon" v-show="false">
            <div class="border">
              <img src="../../../assets/topo-icon/container.svg" title="容器组件" ref="containerBtn">
            </div>
            <p class="topt_p">容器组件</p>
          </li>
        </ul>
      </div>
      <div class="design-title">
        <div class="dtitle-text" style="height: 30px;">图标组件</div>
      </div>
      <div class="ls-list" :class="{'collapse-menu': collapsed }">
        <ScrollBar class="scroll-area" :left="true">
          <ul>
            <li v-for="(img, k) in imgList" class="row-block topo-title-icon" :key="k">
              <img :src="imgUrl(img)" draggable @dragstart="onIconDragStart" :id="'icon-'+img">
              <span>{{ imgNames[k] }}</span>
            </li>
          </ul>
        </ScrollBar>
        </div>
    </div>
    <div class="topo-area" :class="{'collapse-menu': collapsed }">
      <TopoContainer
        :nodes="visibleNodes"
        :is-empty="isEmpty"
        :groups="groups"
        @deleteNode="onDeleteNode"
        @nodeDragging="onNodeDragging"
        @expand-container="onExpandContainer"
        @edge-config="onSourceConfig"
        @node-config="onTargetConfig"
        ref="container"
      >
        <node slot="preNode" v-if="currentNode" :node="currentNode"></node>
        <Group
          v-for="(group, key) in visibleGroups"
          slot="groups"
          :key="key"
          :group="group"
          @expand="onGroupExpanded"
          @draggedBottom="onGroupDraggedBottom"
          @draggedRight="onGroupDraggedRight"
          @collapse="onGroupCollapse"
        />
      </TopoContainer>
    </div>

    <!-- <source-config v-show="$store.state.showSourceConfig" :edge="$store.state.currentEdge"></source-config>
    <target-config v-show="$store.state.showTargetConfig" :node="$store.state.currentNode"></target-config> -->
    <DialogModal
      :show="showApply"
      :percent="percent"
      :msg="msg"
      :finish="finish"
      :showApplyOk="showApplyOk"
      @clickOk="onApplyOk"
    />

    <form ref="exportForm" :action="'/zh-cn/' + $store.state.appName + '/datapath/export/'"  target="_blank" method="POST" style="display:none;">
      <input type="hidden" name="csrfmiddlewaretoken" :value="token">
      <input type="hidden" name="state" value="edit">
    </form>
    <!-- <button @click="expandAll" style="z-index: 100; float: right; position: absolute">expand</button> -->
  </div>
</template>
<script>

/* eslint-disable camelcase */
/* global $ */
import _ from 'lodash';
import { select as D3Select, event as D3Event } from 'd3-selection';
import { drag as D3Drag } from 'd3-drag';
import { genV4 as uuidV4 } from 'uuidjs';
import jsCookie from 'js-cookie';

import NavBar from '@/components/common/NavBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import TopoContainer from '@/components/editTopoCncc/svg/TopoContainer';
import Node from '@/components/editTopoCncc/svg/GroupNode';
import Group from '@/components/editTopoCncc/svg/Group';
// import SourceConfig from '@/components/editTopoCncc/SourceConfig';
// import TargetConfig from '@/components/editTopoCncc/TargetConfig';
import DialogModal from '@/components/editTopoCncc/DialogModal';
import ScrollBar from '@/components/common/ScrollBar';
import Loading from '@/components/common/Loading';

import NodeClass from '@/components/editTopoCncc/models/GroupNode';
import GroupClass from '@/components/editTopoCncc/models/Group';
import { imgUrl } from '@/helpers/utils';
import { serverNode, clientNode } from '@/helpers/nodeObject';
import { imgNamesCncc as imgNames, imgListCncc as imgList } from '@/helpers/constants';

import * as u from '../utils';

/*
 * Group 通过 nodeId 与 container node 联系
 *       通过 nodes 与 在其内的子节点联系
 * Node 通过 groupId 与其 父容器 联系
 * 每一个Group必定对应一个 container node.
 * 操作时均以 Node 来操作.
 * 而不直接操作 group.
*/

export default {
  name: 'group-main',
  components: {
    NavBar,
    Breadcrumb,
    TopoContainer,
    Node,
    Group,
    // SourceConfig,
    // TargetConfig,
    DialogModal,
    ScrollBar,
    Loading,
  },
  data() {
    return {
      // groups: [], // [new GroupClass({ x: 0, y: 0 }), new GroupClass({ x: 200, y: 300 })],
      currentNode: null,
      drag: type => D3Drag().on('start', this.dragStarted(type)).on('drag', this.dragged).on('end', this.dragEnded),
      imgNames,
      imgList,
      collapsed: false,
      showApply: false,
      percent: 0,
      finish: '',
      msg: [],
      showApplyOk: false,
      token: jsCookie.get('csrftoken'),
      ipChange: false,
      showApplyLoading: false,
      refreshAfterApply: true,
    };
  },
  computed: {
    crumbList() {
      return ['index', 'manageapp', '可视化服务图设计', this.$store.state.dispName];
    },
    showLoading() {
      return !this.$store.state.loaded;
    },
    nodes() {
      return this.$store.state.nodes; // [],
    },
    visibleNodes() {
      return this.nodes.filter(n => n.visible);
    },
    groups() {
      return this.$store.state.groups;
    },
    visibleGroups() {
      return this.groups.filter(g => !g.collapsed);
    },
    edges() {
      return this.$store.state.edges;
    },
    isButtonDisabled() {
      return this.nodes.filter(n => n.type !== 'container').length > 0;
    },
  },
  methods: {
    imgUrl(imgName) {
      return imgUrl(imgName);
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
    dragStarted(type) {
      return () => {
        // console.log('drag');
        if (!this.currentNode) {
          this.currentNode = new NodeClass(-500, -500, { type });
          if (type !== 'container' && !this.$store.state.datapath.datapath.trade.some(item => item.settings.name === this.currentNode.levelNum)) {
            this.$store.state.datapath.datapath.trade.push(_.cloneDeep(this.nodeObj(this.currentNode)));
          }
        }
      };
    },
    dragged() {
      const svg = document.querySelector('div > div.topo-area > svg');
      const { left, top } = svg.getBoundingClientRect();
      const viewBox = svg.getAttribute('viewBox').split(' ').map(d => parseFloat(d));
      // const width = svg.getAttribute('width');
      const height = svg.getAttribute('height');

      const scale = height / viewBox[3];

      let x = (D3Event.sourceEvent.clientX - left) / scale + viewBox[0];
      let y = (D3Event.sourceEvent.clientY - top) / scale + viewBox[1];

      if (x < 0) {
        return;
      }

      x = x > 0 ? x : 0;
      y = y > 0 ? y : 0;

      if (!this.isEmpty(x, y)) {
        return;
      }

      this.currentNode.setCoordinates(x, y);

      this.$refs.container.setScroll(D3Event);
    },
    dragEnded() {
      this.$refs.container.setScroll(D3Event);
      clearInterval(this.$refs.container.scrollX);
      clearInterval(this.$refs.container.scrollY);
      if (this.currentNode.x >= 0) {
        const ancestorGroups = _.filter(this.visibleGroups, (g) => { // eslint-disable-line
          return g.nodeId !== this.currentNode.id &&
            this.currentNode.x >= g.x &&
            this.currentNode.x < g.x + g.width &&
            this.currentNode.y >= g.y &&
            this.currentNode.y < g.y + g.height;
        });

        if (ancestorGroups.length === 0) {
          this.currentNode.groupId = -1;
        } else {
          const minimalGroup = ancestorGroups.reduce((pg, cg) => { // eslint-disable-line
            return pg.width * pg.height > cg.width * cg.height ? cg : pg;
          });

          this.currentNode.groupId = minimalGroup.id;
          minimalGroup.nodes.push(this.currentNode.id);
        }

        if (this.currentNode.type === 'container') {
          this.createGroup({
            x: this.currentNode.x,
            y: this.currentNode.y,
          }, this.currentNode.id);
        }
        this.$store.dispatch('createNode', this.currentNode);
      }
      this.currentNode = null;
    },
    /**
     * 判断 (x, y) 是否存在节点
    */
    isEmpty(x, y) {
      const topLeftPoint = NodeClass.getTopLeftPoint(x, y);
      return !_.some(this.nodes, node => node.x === topLeftPoint.rx && node.y === topLeftPoint.ry && node.visible);
    },
    onIconDragStart(ev) {
      ev.dataTransfer.setData('text/plain', ev.target.id);
    },
    onNodeDragging(node) {
      if (node.type === 'container') {
        const group = this.getGroupByNode(node);
        const dw = node.x - group.x;
        const dh = node.y - group.y;
        this.moveGroup(group, dw, dh);
      }
    },
    onDeleteNode(node) {
      if (node.type === 'container') {
        const group = this.getGroupByNode(node);
        this.onDeleteGroup(group);
      }
    },
    onDeleteGroup(group) {
      this.$store.dispatch('removeGroup', group);
    },
    createGroup(pos, nodeId) {
      const g = new GroupClass({ ...pos, nodeId });
      this.$store.dispatch('createGroup', g);
    },
    onGroupExpanded() {
    },

    getGroupByNode(node) {
      return u.getGroupByNode(this.groups, node);
    },
    getGroupChildren(group) {
      return u.getGroupChildren(this.nodes, group);
    },
    // 移动 node 及 container 对应的 group
    moveNode(node, dw, dh) {
      node.setCoordinates(node.x + dw, node.y + dh);
      this.$store.dispatch('dragNode', node.id);
      if (node.type === 'container') {
        const group = this.getGroupByNode(node);
        this.moveGroup(group, dw, dh);
      }
    },
    // 移动 group 及 其所有 子节点
    moveGroup(group, dw, dh) {
      const children = this.getGroupChildren(group);
      children.forEach((cn) => {
        this.moveNode(cn, dw, dh);
      });
      group.setX(group.x + dw);
      group.setY(group.y + dh);
    },

    // 分组右边线移动
    onGroupDraggedRight(dg, dw, dgParent, rightSiblings, allRightSiblings) {
      const rightMost = rightSiblings[rightSiblings.length - 1];
      const leftMost = rightSiblings[0];

      // 最右边的 已到达 分组 最右侧
      if (dgParent && rightMost && rightMost.x + 200 >= dgParent.x + dgParent.width) return;

      if (dw < 0 && leftMost && !this.isEmpty(leftMost.x - 200, leftMost.y)) return;

      /**
       * 折叠的是右边所有，移动的是正右边
       */

      //  折叠container
      allRightSiblings.forEach((n) => {
        if (n.type === 'container') {
          const nGroup = u.getGroupByNode(this.groups, n);
          this.onGroupCollapse(nGroup);
        }
      });

      rightSiblings.forEach((mn) => {
        if (!dgParent || mn.x + 200 < dgParent.x + dgParent.width) {
          this.moveNode(mn, dw, 0);
        }
      });
    },
    // 分组下边线移动
    onGroupDraggedBottom(dg, dh, dgParent, bottomSiblings, allBottomSiblings) {
      const bottomMost = bottomSiblings[bottomSiblings.length - 1];
      const topMost = bottomSiblings[0];

      if (dgParent && bottomMost && bottomMost.y + 100 >= dgParent.y + dgParent.height) return;

      if (dh < 0 && topMost && !this.isEmpty(topMost.x, topMost.y - 100)) return;

      //  折叠container
      allBottomSiblings.forEach((n) => {
        if (n.type === 'container') {
          const nGroup = u.getGroupByNode(this.groups, n);
          this.onGroupCollapse(nGroup);
        }
      });

      bottomSiblings.forEach((mn) => {
        if (!dgParent || mn.y + 100 < dgParent.y + dgParent.height) {
          this.moveNode(mn, 0, dh);
        }
      });
    },
    onExpandContainer(container) {
      // 对应的group
      const group = this.getGroupByNode(container);
      // group.collapsed = false;
      // 子节点
      const innerNodes = this.getGroupChildren(group);
      innerNodes.forEach((n) => {
        n.visible = true; // eslint-disable-line
      });
      this.expandParentAndMoveSibings(container, group);
      this.$store.commit('GROUP_TO_UPERMOST', { group });

      this.$store.commit('GROUP_EDGES_EXPAND', { groupNodes: innerNodes, container });
    },
    expandParentAndMoveSibings(container, group) {
      const parentGroup = u.getParent(this.groups, container);

      const siblings = u.getSiblings(this.nodes, parentGroup, container);

      const movingNodesRight = _.filter(siblings, n => n.x > group.x && n.y >= group.y && n.y < group.y + group.height);
      const movingNodesBottom = _.filter(siblings, n => n.x < group.x + 200 && n.x >= group.x && n.y >= group.y);

      const affectedNodesRight = _.filter(siblings, n => n.x > group.x);
      const affectedNodesBottom = _.filter(siblings, n => n.y > group.y);

      if (group.collapsed) {
        group.collapsed = false; // eslint-disable-line
        affectedNodesRight.forEach((n) => {
          //  折叠container
          if (n.type === 'container') {
            const nGroup = u.getGroupByNode(this.groups, n);
            this.onGroupCollapse(nGroup);
          }
        });

        affectedNodesBottom.forEach((n) => {
          //  折叠container
          if (n.type === 'container') {
            const nGroup = u.getGroupByNode(this.groups, n);
            this.onGroupCollapse(nGroup);
          }
        });

        movingNodesRight.forEach((n) => {
          this.moveNode(n, group.width - 200, 0);
        });

        movingNodesBottom.forEach((n) => {
          this.moveNode(n, 0, group.height - 100);
        });
      }

      if (parentGroup) {
        // 计算 parentGroup 空间是否足够 container 展开
        const maxX = Math.max.apply(null, [group.x + group.width].concat(movingNodesRight.map(n => n.x + 200)));
        const maxY = Math.max.apply(null, [group.y + group.height].concat(movingNodesBottom.map(n => n.y + 100)));

        let w = parentGroup.width;
        let h = parentGroup.height;
        if (parentGroup.x + w < maxX) {
          w = maxX - parentGroup.x;
        }
        if (parentGroup.y + h < maxY) {
          h = maxY - parentGroup.y;
        }

        parentGroup.setWidth(w);
        parentGroup.setHeight(h);

        const pContainer = u.getContainerByGroup(this.nodes, parentGroup);
        this.expandParentAndMoveSibings(pContainer, parentGroup);
      }
    },
    expandAll() {
      console.log('expand all');
      _.forEach(this.nodes, (n) => {
        if (n.type === 'container' && n.visible === true) {
          n.visible = false; // eslint-disable-line
          this.onExpandContainer(n);
        }
      });
    },
    onGroupCollapse(group) {
      console.log('collapse', group);
      const container = u.getContainerByGroup(this.nodes, group);
      container.visible = true;

      // 子节点
      const innerNodes = this.getGroupChildren(group);
      // this.groupEdgeCollapse(container, innerNodes);

      const innerContainer = _.filter(innerNodes, n => n.type === 'container');
      _.forEach(innerContainer, (c) => {
        const cGroup = this.getGroupByNode(c);
        this.onGroupCollapse(cGroup);
      });

      innerNodes.forEach((n) => {
        n.visible = false; // eslint-disable-line
      });

      const parentGroup = u.getParent(this.groups, container);

      if (!group.collapsed) {
        group.collapsed = true; // eslint-disable-line

        const siblings = u.getSiblings(this.nodes, parentGroup, container);

        // 折叠后需要移动的节点
        const movingNodesRight = _.filter(siblings, n => n.x >= group.x + group.width && n.y >= group.y && n.y < group.y + group.height);
        const movingNodesBottom = _.filter(siblings, n => n.x < group.x + 200 && n.x >= group.x && n.y >= group.y + group.height);

        console.log(movingNodesRight, movingNodesBottom);
        movingNodesRight.forEach((n) => {
          this.moveNode(n, -group.width + 200, 0);
        });
        movingNodesBottom.forEach((n) => {
          this.moveNode(n, 0, -group.height + 100);
        });
      }
      this.$store.commit('GROUP_EDGE_COLLAPSE', { container, groupNodes: innerNodes });
    },
    toggleCollapseMenu() {
      this.collapsed = !this.collapsed;
    },
    initTopo() {
    },
    mountConfigFn() {
      window.source_config_new = new window.SourceConfig($('body'), this.saveSourceConfig);
      window.target_config_new = new window.TargetConfig($('body'), this.saveTargetConfig);
    },
    saveSourceConfig(data, name) {
      const configData = data;
      configData.src_ports = _.filter(data.src_ports, d => d !== '');
      console.log('saveSourceConfig', configData, name);

      if (window.source_config_new.moniChange) {
        this.ipChange = true;
        this.$store.commit('CHANGE_IP', { list: data.src_ip_device });
      }

      // delIpList = delIpList.concat(source_config_new.ip_config.delIpList);
      this.$store.commit('SAVE_SOURCE_CONFIG', { data, name });
      window.source_config_new.hide();
    },
    saveTargetConfig(data) {
      console.log('saveTargetConfig', data);

      if (window.target_config_new.moniChange) {
        this.ipChange = true;
        // changeIP(data.settings.filter.dst_ip_device);
        this.$store.commit('CHANGE_IP', { list: data.settings.filter.dst_ip_device });
      }

      const schedule_config = window.target_config_new.schedule_config;
      const schedules = schedule_config.data;
      const sswitch = schedule_config.switch ? 'on' : 'off';

      this.$store.commit('SAVE_TARGET_CONFIG', { data, schedules, sswitch });
      window.target_config_new.hide();
    },
    onSourceConfig(edge) {
      console.log('onSourceConfig', edge);

      window.source_config_new.show();

      const sourceId = `level${edge.sourceNodeId}`;
      const targetId = `level${edge.targetNodeId}`;
      const tradeList = this.$store.state.datapath.datapath.trade;
      const app_name = this.$store.state.appName;
      const ipObj = _.cloneDeep(this.$store.state.ipObj);
      // 新连线的初始值
      let soureceData = {
        name: targetId,
        src_ip_addr: [],
        src_ip_device: [],
        src_ip_list: [],
        src_ports: [],
      };
      let intf_name = '';
      tradeList.forEach((d) => {
        if (d.settings.name === sourceId) {
          const refArr = d.ref;
          refArr.some((item) => {
            if (item.name === targetId) {
              soureceData = _.cloneDeep(item);
              return true;
            }
            return false;
          });
        }
        if (d.settings.name === targetId) {
          intf_name = d.collector[0].name;
        }
      });
      window.source_config_new.update(soureceData, sourceId, app_name, intf_name, ipObj);
    },
    onTargetConfig(node) {
      console.log('onTargetConfig', node);

      window.target_config_new.show();
      window.LANGUAGE_CODE = 'zh-cn';
      window.csrf_token = this.token;
      window.STATIC_URL = '/static/dist/';

      const node_id = `level${node.id}`;
      const intf = node.intf;
      const tradeList = this.$store.state.datapath.datapath.trade;
      const schedules = this.$store.state.schedule;
      const servers = _.cloneDeep(this.$store.state.datapath.servers);
      const protocols = _.cloneDeep(this.$store.state.datapath.protocols);
      const app_name = this.$store.state.appName;
      const ipObj = _.cloneDeep(this.$store.state.ipObj);

      tradeList.forEach((trade) => {
        if (trade.settings.name === node_id) {
          let scheduleLoad = {};
          schedules.some((d) => {
            if (d.intf_name.match(/\d+/g)[0] === intf) {
              scheduleLoad = _.cloneDeep({ schedule: d.schedule, switch: d.switch });
              return true;
            }
            return false;
          });
          window.target_config_new.update(_.cloneDeep(trade), servers, protocols, scheduleLoad, app_name, ipObj);
        }
      });
    },
    integrateDataPath() {
      /* eslint-disable no-param-reassign */
      // this.expandAll();
      const nodes = this.$store.state.nodes;
      const trade = this.$store.state.datapath.datapath.trade;
      // const edges = this.$store.state.edges;
      const newTrade = [];
      _.forEach(trade, (d) => {
        const levelName = d.settings.name;
        const theNode = nodes.find(item => item.levelNum === levelName);
        // const edge = edges.filter(item => `level${item.sourceNodeId}` === levelName);
        if (theNode) {
          const { dispName, groupId, iconName, id, x, y, visible } = theNode;
          d.settings.disp_name = dispName;
          d.settings.imgname = iconName;
          d.settings.pos = u.coordUnitTransInverse({ x, y });
          d.settings.groupId = groupId;
          d.settings.id = id;
          d.settings.visible = visible;

          _.forEach(theNode.edges.source, (eid) => {
            const targetNode = _.find(nodes, n => n.edges.target.indexOf(eid) > -1);
            const ref = _.find(d.ref, r => r.name === targetNode.levelNum);
            if (!ref) {
              d.ref.push({
                name: targetNode.levelNum,
                src_ip_addr: [],
                src_ip_device: [],
                src_ip_list: [],
                src_ports: [],
              });
            }
          });

          const targetIds = theNode.edges.source.map((eid) => {
            const targetNode = _.find(nodes, n => n.edges.target.indexOf(eid) > -1);
            return `level${targetNode.id}`;
          });
          _.remove(d.ref, ref => targetIds.indexOf(ref.name) === -1);

          newTrade.push(d);

          // if (edge.length > 0) {
          //   d.ref.forEach((item) => {
          //     if (!edge.some(edgeItem => `level${edgeItem.targetNodeId}` === item.name)) {
          //       _.remove(d.ref, r => r.name === item.name);
          //     }
          //   });
          //   //
          //   edge.forEach((item) => {
          //     const edgeTarget = `level${item.targetNodeId}`;
          //     const ref = d.ref.find(refItem => refItem.name === edgeTarget);
          //     if (!ref) {
          //       d.ref.push({
          //         name: edgeTarget,
          //         src_ip_addr: [],
          //         src_ip_device: [],
          //         src_ip_list: [],
          //         src_ports: [],
          //       });
          //     }
          //   });
          // }
        } else {
          // _.remove(trade, item => item.settings.name === levelName);
          // if (edge.length > 0) {
          //   trade.forEach((item) => {
          //     if (!item.ref.some(refItem => refItem.name === levelName)) {
          //       _.remove(item.ref, r => r.name === levelName);
          //     }
          //   });
          // }

        }
      });

      this.$store.state.datapath.datapath.trade = newTrade;
      const savingGroups = _.cloneDeep(this.groups);
      _.forEach(savingGroups, (g) => {
        const pos = u.coordUnitTransInverse({ x: g.x, y: g.y });
        g.x = pos.x;
        g.y = pos.y;
      });
      this.$store.state.datapath.datapath.groups = savingGroups;
    },
    saveDataPath() {
      this.integrateDataPath();
      const self = this;
      this.$store.dispatch('saveAll', {
        cb(res1, res2, res3) { // eslint-disable-line
          window.removeEventListener('beforeunload', self.savePrompt);
          window.alertWindow('保存成功！', false);
          setTimeout(() => {
            self.reload();
          }, 100);
        },
      });
    },
    applyDataPath() {
      this.integrateDataPath();
      const trade = this.$store.state.datapath.datapath.trade;
      const protocols = this.$store.state.datapath.protocols;
      const servers = this.$store.state.datapath.servers;
      let flag = true;
      trade.forEach((d) => {
        const name = d.settings.disp_name;
        const level = d.settings.name;
        const node = this.$store.state.nodes.find(item => item.levelNum === level);
        let isError = false;
        if (name === '' || name.match(/[&; ]/g)) {
          flag = false;
          isError = true;
        }
        if (d.settings.type === 'server') {
        //  const portLen = d.settings.filter.dst_ports.length;  //v4需要验证；v5目的配置无此项
          const ipLen = d.settings.filter.dst_ip_list.length;
          const collector = d.collector[0];
        //  portLen === 0 ||
          if (ipLen === 0 || collector.disp_name === '' || !_.has(protocols, collector.target_prot) || servers[0].nices.indexOf(collector.nic_addr) === -1) {
            flag = false;
            isError = true;
          }
        }
        //  测试直接修改state数组中对象某字段是否成功 结论：失败
        //  this.$set(this.$store.state.nodes[index], 'error', 'kkk');
        this.$store.dispatch('changeNodeError', { node, isError });
      });

      this.nodes.filter(n => n.type === 'container').forEach((node) => {
        if (node.dispName.match(/[&; ]/g)) {
          flag = false;
          const isError = true;
          this.$store.dispatch('changeNodeError', { node, isError });
        }
      });

      if (flag) {
        let count = 0;
        const all = 28;
        const taskId = uuidV4().hexString;
        const event = new EventSource(`/zh-cn/events/task/${taskId}/`);
        this.finish = '正在应用您做的修改，请稍候。可能会需要几分钟...';
        this.showApply = true;

        const _this = this;
        // const time = '2012/222';
        event.addEventListener('ack', () => {
          _this.$store.dispatch('applyDataPath', {
            taskId,
            callback: ({ error_msg, error }) => {
              const time = window.getServerTime();
              _this.finish = error_msg || `${time} 应用已经完成！可关闭窗口`;
              _this.showApplyOk = true;
              this.refreshAfterApply = error === 0;
            },
          });
        }, false);
        event.addEventListener('event', (e) => {
          count += 1;
          const time = window.getServerTime();
          _this.percent = Number((count / all).toFixed(2));
          _this.msg.push(`${time}  ${JSON.parse(e.data).msg}`);
        }, false);
        event.addEventListener('eof', () => {
          event.close();
          _this.showApplyOk = true;
        }, false);
      }
    },
    async onApplyOk() {
      if (!this.refreshAfterApply) {
        this.showApply = false;
        this.msg = [];
        return;
      }
      this.showApply = false;
      this.showApplyLoading = true;
      this.msg = [];
      // await this.$store.dispatch('saveIp');
      await this.$store.dispatch('saveWorkTime', { type: 'apply' });
      window.removeEventListener('beforeunload', this.savePrompt);
      setTimeout(() => {
        if (this.refreshAfterApply) {
          this.reload();
        }
      }, 0);
    },
    reload() {
      window.location.reload();
    },
    savePrompt(e) { // eslint-disable-line
      if (!_.isEqual(window.initialNodes, this.$store.state.nodes) ||
        !_.isEqual(window.initialEdges, this.$store.state.edges) ||
        !_.isEqual(window.initialGroups, this.$store.state.groups) ||
        !_.isEqual(window.initialDatapath, this.$store.state.datapath) ||
        !_.isEqual(window.oldSchedule, this.$store.state.schedule)) {
        e.returnValue = '您未进行保存操作，是否真的退出编辑？';
        return '您未进行保存操作，是否真的退出编辑？';
      }
    },
  },
  mounted() {
    this.drag('client')(D3Select(this.$refs.clientBtn));
    this.drag('server')(D3Select(this.$refs.serverBtn));
    this.drag('container')(D3Select(this.$refs.containerBtn));

    const name = window.location.pathname.match(/app\d+/);
    this.$store.state.appName = name ? name[0] : 'app100';
    this.$store.dispatch('getData');
    this.$store.dispatch('getSchedule');

    this.mountConfigFn();
    this.$refs.save.addEventListener('click', () => this.saveDataPath());
    this.$refs.apply.addEventListener('click', () => this.applyDataPath());
    this.$refs.export.addEventListener('click', () => {
      this.$refs.exportForm.submit();
    });
    window.addEventListener('beforeunload', this.savePrompt);
  },
};

</script>
<style scoped>

.topo-btn-group input[type="button"]{
  width: auto;
  height: 27px;
  line-height: 24px;
  text-align: center;
  padding: 0 18px;
  color: #3dd9c4;
  font-size: 16px;
  border-radius: 15px;
  cursor: pointer;
  border: 1px solid #3dd9c4 !important;
  margin: 0 5px;
}
.topo-btn-group input[type="button"]:hover{
  background: rgba(61,217,196,0.8);
  color: #eee;
}

.topo-btn-group.disableAppBtn input[type="button"] {
  pointer-events: none;
  border: 1px solid #2e4c61 !important;
  color: #2e4c61;
  background: #0A283B;
}

.td-left {
  width: 180px;
}

.td-left.collapse-menu {
  width: 65px;
}

.left-side {
    position: absolute;
    top: 95px;
    bottom: 0;
    height: auto;
    left: 0;
    display: inline-block;
}

.design-collapse {
    height: 35px;
    cursor: pointer;
    background: url(../../../assets/collapse.svg) no-repeat center center;
    position: absolute;
    width: 35px;
    left: 164px;
    z-index: 2;
    top: 48%;
    border-radius: 50px;
    box-shadow: 0 0 5px #71A8CA;
}

.design-collapse.collapse-menu {
    background: url(../../../assets/recollapse.svg) no-repeat center center;
    left: 50px;
}

.design-title {
    height: 30px;
    margin-bottom: 2px;
}

.design-title {
    background-color: #101A24;
    box-shadow: inset 0 0 20px 5px rgba(255, 255, 255, 0.12);
}

.dtitle-text {
    text-align: center;
    color: white;
    line-height: 30px;
    font-size: 14px;
}

.main-icon {
  background-color: #1E374D;
  /* height: 180px !important; */
  height: 90px !important;
}

.main-icon.collapse-menu{
  height: 270px !important;
}

.main-icon ul {
  display: inline-block;
}

.main-icon .row-block {
    height: auto;
    float: left;
    text-align: center;
    width: 70px !important;
    margin-top: 12px;
    margin-left: 13px;
    margin-right: 7px;
}
.main-icon.collapse-menu .row-block {
    height: 70px;
    margin-left: 0px;
    margin-right: 5px;
}

.border {
    width: 60px;
}

.topt_p {
    color: white;
    line-height: 25px;
    text-align: center;
    font-size: 12px;
    width: 60px;
    margin: 0;
}

.topo-title-icon img {
    width: 35px;
    padding: 5px 10px 5px 10px;
    cursor: move;
    max-width: 60px;
    box-sizing: content-box;
    max-height: 60px;
    background: #0B121A;
    transition: all .2s ease-out,color .2s ease-in;
    user-select: none;
}

.topo-title-icon img:hover {
    max-width: 120px;
    max-height: 90px;
    padding: 5px;
    background: rgba(131, 173, 235, 0.54);
    border-radius: 5px;
}

.ls-list {
    top: 152px;
    /* top: 242px; */
    background: #1E374D;
    position: absolute;
    overflow-y: hidden;
    overflow-x: hidden;
    z-index: 1;
    max-width: 180px;
    bottom: 0;
}

.scroll-area {
  position: relative;
  margin: auto;
  width: 100%;
  height: 100%;
}

.ls-list.collapse-menu {
    top: 332px !important;
    max-width: 65px;
}

.topo-title-icon {
    margin: 5px 15px 0 15px;
    background: transparent;
    user-select: none;
}

.ls-list.collapse-menu .topo-title-icon {
    height: 80px !important;
    margin: 0;
}

.row-block {
    line-height: 24px;
    width: 60px;
    height: 80px;
    padding-top: 0;
    list-style: none;
    vertical-align: middle;
    cursor: pointer;
    font-size: 16px;
    color: #E0F9FF;
    float: left;
    padding: 0px;
    text-align: center;
    border: 0px solid rgba(204, 204, 204, 0);
}

.row-block img {
    margin-top: 5px;
    padding: 5px 10px 5px 10px;
    background: #0B121A;
    box-sizing: content-box;
    width: 35px;
    cursor: move;
    max-width: 60px;
    max-height: 60px;
    transition: all .2s ease-out,color .2s ease-in;
    user-select: none;
}

 .topo-title-icon span {
    user-select: none;
    display: block;
    position: relative;
    font-size: 12px;
    color: #ffffff;
    pointer-events: none;
}

.topo-area {
    top: 95px;
    position: absolute;
    right: 0;
    left: 185px;
    overflow-x: hidden;
    overflow-y: hidden;
    bottom: 0;
}

.topo-area.collapse-menu {
  left: 70px !important;
}

</style>
