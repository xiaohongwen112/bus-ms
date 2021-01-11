import _ from 'lodash';

import * as u from '../utils';

import * as mt from './mutation-types';

/* eslint-disable no-empty-pattern, no-param-reassign */
export default {
  [mt.SHOW_SOURCE_CONFIG](state, edge) {
    state.showSourceConfig = true;
    state.currentEdge = edge;
  },

  [mt.HIDE_SOURCE_CONFIG](state) {
    state.showSourceConfig = false;
    state.currentEdge = {};
  },

  [mt.SHOW_TARGET_CONFIG](state, node) {
    state.showTargetConfig = true;
    state.currentNode = node;
  },

  [mt.HIDE_TARGET_CONFIG](state) {
    state.showTargetConfig = false;
    state.currentNode = {};
  },

  [mt.GET_DATA_PATH](state, data) {
    state.datapath = data;
    state.loaded = true;
    const { nodes, edges, groups } = u.buildNodes(data);
    window.initialDatapath = _.cloneDeep(data);
    window.initialNodes = _.cloneDeep(nodes);
    window.initialEdges = _.cloneDeep(edges);
    window.initialGroups = _.cloneDeep(groups);
    state.nodes = nodes;
    state.edges = edges;
    state.groups = groups;
    state.dispName = data.datapath.disp_name;
    const ipObj = {};
    data.datapath.trade.forEach((d) => {
      if (d.settings.type === 'server') {
        const ipAddr = d.settings.filter.dst_ip_addr;
        const ipDevice = d.settings.filter.dst_ip_device;
        const ipList = d.settings.filter.dst_ip_list;
        if (ipList.length !== ipAddr.length || ipList.length !== ipDevice.length) {
          console.log('iplist, ipaddr, ipdevice not match');
        }
        if (ipAddr.length > 0) {
          ipAddr.forEach((ipItem) => {
            ipObj[ipItem.ip] = JSON.parse(JSON.stringify(ipItem));
          });
        }
        if (ipDevice.length > 0) {
          ipDevice.forEach((ipItem) => {
            ipObj[ipItem.ip].device_name = ipItem.device_name;
            ipObj[ipItem.ip].device_model = ipItem.device_model;
            ipObj[ipItem.ip].device_type = ipItem.device_type;
          });
        }
      }
      d.ref.forEach((ref) => {
        const ipAddr = ref.src_ip_addr;
        const ipDevice = ref.src_ip_device;
        if (ipAddr.length > 0) {
          ipAddr.forEach((ipItem) => {
            ipObj[ipItem.ip] = JSON.parse(JSON.stringify(ipItem));
          });
        }
        if (ipDevice.length > 0) {
          ipDevice.forEach((ipItem) => {
            ipObj[ipItem.ip].device_name = ipItem.device_name;
            ipObj[ipItem.ip].device_model = ipItem.device_model;
            ipObj[ipItem.ip].device_type = ipItem.device_type;
          });
        }
      });
    });
    state.ipObj = ipObj;
  },

  [mt.DRAGGING_NODE](state, { nodeId }) {
    // 遍历边而不是节点因为
    // 边保存了当前(展示的)连接状态，
    // 节点保存了事实上的连接状态
    _.forEach(state.edges, (edge) => {
      if (edge.sourceNodeId === nodeId || edge.targetNodeId === nodeId) {
        const sourceNode = _.find(state.nodes, n => n.id === edge.sourceNodeId);
        const targetNode = _.find(state.nodes, n => n.id === edge.targetNodeId);
        edge.link(sourceNode, targetNode);
      }
    });
  },
  [mt.CHANGE_GROUP_NAME](state, { group, value }) {
    group.name = value;
  },

  [mt.REMOVE_NODE](state, { node }) {
    const index = _.findIndex(state.nodes, e => e.id === node.id);
    if (node.groupId !== -1) {
      const group = u.getParent(state.groups, node);
      if (group) {
        const nIndex = _.findIndex(group.nodes, node.id);
        group.nodes.splice(nIndex, 1);
      }
    }
    state.nodes.splice(index, 1);
  },

  [mt.CHANGE_NODE_NAME](state, { node, value }) {
    node.dispName = value;
  },

  [mt.CHANGE_NODE_ERROR](state, { node, isError }) {
    node.error = isError;
  },

  [mt.REMOVE_EDGE](state, { edge }) {
    const index = _.findIndex(state.edges, e => e.id === edge.id);
    _.forEach(state.nodes, (n) => {
      n.removeTargetEdge(edge.id);
      n.removeSourceEdge(edge.id);
    });
    state.edges.splice(index, 1);
  },

  [mt.CREATE_NODE](state, { node }) {
    state.nodes.push(node);
  },

  loading(state, loadingState) {
    state.loaded = !loadingState;
  },

  [mt.CREATE_EDGE](state, { edge, sourceNode, targetNode }) {
    state.edges.push(edge);
    sourceNode.addSourceEdge(edge.id);
    targetNode.addTargetEdge(edge.id);
  },

  [mt.GET_WORK_TIME](state, data) {
    window.oldSchedule = _.cloneDeep(data.data.result);
    state.schedule = data.data.result;
  },

  [mt.CREATE_GROUP](state, { group }) {
    state.groups.push(group);
  },

  [mt.REMOVE_GROUP](state, { group }) {
    const index = _.findIndex(state.groups, e => e.id === group.id);
    state.groups.splice(index, 1);
  },

  [mt.NODE_CHANGE_GROUP](state, { node, newGroup, oldGroup }) {
    node.groupId = newGroup ? newGroup.id : -1;
    if (oldGroup) {
      _.remove(oldGroup.nodes, ni => ni === node.id);
    }
    if (newGroup) {
      newGroup.nodes.push(node.id);
    }
  },

  [mt.GROUP_EDGES_EXPAND](state, { container, groupNodes }) {
    const innerNodesIds = groupNodes.map(n => n.id);

    // 递归判断该group下是否有nodes与该edge相连
    const isContainerInEdge = (ccontainer, edge) => {
      const group = u.getGroupByNode(state.groups, ccontainer);
      const children = u.getGroupChildren(state.nodes, group);
      return children.some((child) => {
        if (child.type === 'container') {
          return isContainerInEdge(child, edge);
        } else { // eslint-disable-line
          const { source, target } = child.edges;
          return source.concat(target).indexOf(edge.id) > -1;
        }
      });
    };

    _.forEach(state.edges, (edge) => {
      const sourceNode = _.find(state.nodes, n => n.id === edge.sourceNodeId);
      const targetNode = _.find(state.nodes, n => n.id === edge.targetNodeId);
      if (edge.targetNodeId === container.id) {
        _.forEach(groupNodes, (c) => {
          if (c.type === 'container') {
            if (isContainerInEdge(c, edge)) {
              edge.targetNodeId = c.id;
              edge.link(sourceNode, c);
            }
          } else {
            const { target } = c.edges;
            if (target.indexOf(edge.id) > -1) {
              edge.targetNodeId = c.id;
              edge.link(sourceNode, c);
            }
          }
        });
      } else if (edge.sourceNodeId === container.id) {
        _.forEach(groupNodes, (c) => {
          if (c.type === 'container') {
            if (isContainerInEdge(c, edge)) {
              edge.sourceNodeId = c.id;
              edge.link(c, targetNode);
            }
          } else {
            const { source } = c.edges;
            if (source.indexOf(edge.id) > -1) {
              edge.sourceNodeId = c.id;
              edge.link(c, targetNode);
            }
          }
        });
      } else if (innerNodesIds.indexOf(edge.targetNodeId) > -1 &&
        innerNodesIds.indexOf(edge.sourceNodeId) > -1) {
        edge.visible = true;
      }
    });
  },
  [mt.GROUP_EDGE_COLLAPSE](state, { container, groupNodes }) {
    const innerNodesIds = groupNodes.map(n => n.id);

    _.forEach(state.edges, (edge) => {
      if (innerNodesIds.indexOf(edge.targetNodeId) > -1 &&
        innerNodesIds.indexOf(edge.sourceNodeId) > -1) {
        edge.visible = false;
      } else if (innerNodesIds.indexOf(edge.targetNodeId) > -1) {
        const sourceNode = _.find(state.nodes, n => n.id === edge.sourceNodeId);
        edge.targetNodeId = container.id;
        edge.link(sourceNode, container);
      } else if (innerNodesIds.indexOf(edge.sourceNodeId) > -1) {
        const targetNode = _.find(state.nodes, n => n.id === edge.targetNodeId);
        edge.sourceNodeId = container.id;
        edge.link(container, targetNode);
      }
    });
  },
  [mt.GROUP_TO_UPERMOST](state, { group }) {
    const theGroupIndex = _.findIndex(state.groups, g => g.id === group.id);
    if (theGroupIndex !== state.groups.length - 1) {
      state.groups.splice(theGroupIndex, 1);
      state.groups.push(group);
    }
  },
  [mt.SAVE_SOURCE_CONFIG](state, { data, name }) {
    console.log(data, name);
    const sourceId = name;
    const targetId = data.name;
    const tradeList = state.datapath.datapath.trade;
    tradeList.forEach((d) => {
      if (d.settings.name === sourceId) {
        const refArr = d.ref;
        const theItem = _.find(refArr, item => item.name === targetId);
        if (theItem) {
          theItem.src_ip_list = _.cloneDeep(data.src_ip_list);
          theItem.src_ip_device = _.cloneDeep(data.src_ip_device);
          theItem.src_ports = _.cloneDeep(data.src_ports);
        } else {
          refArr.push(_.cloneDeep(data));
        }
      }
    });
  },
  [mt.CHANGE_IP](state, { list }) {
    list.forEach((d) => {
      if (!state.ipObj[d.ip]) {
        state.ipObj[d.ip] = {
          ip: d.ip,
          intf_name: d.intf_name,
          app_name: d.app_name,
          device_name: d.device_name,
          device_model: d.device_model,
          device_type: d.device_type,
        };
      } else {
        state.ipObj[d.ip].ip = d.ip;
        state.ipObj[d.ip].intf_name = d.intf_name;
        state.ipObj[d.ip].app_name = d.app_name;
        state.ipObj[d.ip].device_name = d.device_name;
        state.ipObj[d.ip].device_model = d.device_model;
        state.ipObj[d.ip].device_type = d.device_type;
      }
    });
  },
  [mt.SAVE_TARGET_CONFIG](state, { data, schedules, sswitch }) {
    const levelName = data.settings.name;
    const tradeList = state.datapath.datapath.trade;
    tradeList.forEach((trade) => {
      if (trade.settings.name === levelName) {
        trade.settings = JSON.parse(JSON.stringify(data.settings));
        trade.alarmrules = JSON.parse(JSON.stringify(data.alarmrules));
        trade.collector = JSON.parse(JSON.stringify(data.collector));

        const intf = trade.collector[0].name;
        const exist = state.schedule.some((d) => {
          if (d.intf_name.match(/\d+/)[0] === intf.match(/\d+/)[0]) {
            d.schedule = schedules;
            d.switch = sswitch;
            return true;
          }
          return false;
        });
        if (!exist) {
          state.schedule.push({
            intf_name: `intf${intf.match(/\d+/)[0]}`,
            switch: sswitch,
            schedule: schedules,
          });
        }

        // delIpList = delIpList.concat(target_config_new.ip_config.delIpList);
        // ipObj = JSON.parse(JSON.stringify(target_config_new.ipObj);

        _.forEach(state.nodes, (n) => {
          if (n.levelNum === levelName) {
            n.error = false;
          }
        });
      }
    });
  },
};
