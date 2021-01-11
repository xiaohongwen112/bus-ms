import _ from 'lodash';

import * as u from '../utils';

import * as mt from './mutation-types';

/**
 * 获取业务起止结束时间
 * @params1 当前第几分钟 1-1440
 * return 00:01-23:59-00:00
 * 获取业务起止开始时间
 * @params1 第几分钟
 */
const getBizStart = (val) => {
  let res = '00:00';
  res = u.mins2str(val < 0 ? val + 1440 : val);
  return res;
};

/**
 * 设置业务起止开始时间
 * @param {*} start
 * @param {*} end
 * 00:00 表示0
 * 开始分钟大于结束分钟, 为负值, 0-
 */
const setBizStart = (start, end) => {
  const startMins = u.str2mins(start);
  const endMins = end === '00:00' ? 1440 : u.str2mins(end);
  return startMins >= endMins ? startMins - 1440 : startMins;
};

/* eslint-disable no-empty-pattern, no-param-reassign */
export default {
  [mt.SHOW_SOURCE_CONFIG](state, edge) {
    state.showSourceConfig = true;
    // 读取数据
    const ref = (state.datapath.datapath.trade.find(v => `level${edge.srcId}` === v.settings.name)).ref;
    const currentRef = ref.find(v => `level${edge.dstId}` === v.name);
    // 矫正只有list没有device
    state.currentEdge = Object.assign({}, currentRef, edge);
  },
  [mt.UPDATE_SRC](state, { edge }) { // 更新发出配置, 更新+更新监控列表+创建
    // // 存放数据
    const ref = (state.datapath.datapath.trade.find(v => `level${edge.srcId}` === v.settings.name)).ref;
    const currentRef = ref.find(v => `level${edge.dstId}` === v.name);
    currentRef.src_ip_addr = edge.src_ip_addr;
    currentRef.src_ports = edge.src_ports;
    currentRef.src_ip_device = edge.src_ip_device;
    currentRef.src_ip_list = currentRef.src_ip_device.map(d => d.ip);
    let newIpData = _.cloneDeep(currentRef.src_ip_device);
    newIpData = _.uniq(newIpData);
    newIpData.forEach((item) => {
      const preIp = item.ip;
      state.ipObj[preIp] = Object.assign(
        {
          ip: null,
          app_name: null,
          intf_name: null,
          device_name: null,
          device_model: null,
          device_type: null,
          name: null,
          addr: null,
          dim_trans_type: null,
          dim_sub_trans_type: null,
          dim_subsub_trans_type: null,
          // isDel: false,
          // type: '',
        });
      state.ipObj[preIp].app_name = item.app_name;
      state.ipObj[preIp].device_model = item.device_model;
      state.ipObj[preIp].device_type = item.device_type;
      state.ipObj[preIp].device_name = item.device_name;
      state.ipObj[preIp].intf_name = item.intf_name;
      state.ipObj[preIp].ip = item.ip;
      currentRef.src_ip_addr.forEach((items) => {
        if (items.ip === preIp) {
          state.ipObj[preIp].addr = items.addr;
          state.ipObj[preIp].dim_trans_type = items.dim_trans_type;
          state.ipObj[preIp].dim_sub_trans_type = items.dim_sub_trans_type;
          state.ipObj[preIp].dim_subsub_trans_type = items.dim_subsub_trans_type;
          state.ipObj[preIp].name = items.name;
        }
      });
    });
    // console.log(edge);
    this.commit('UPDATE_MONITOR', {
      monitors: edge.newMonitor,
    });
  },
  [mt.UPDATE_TARGET](state, { node, newMonitor }) {
    console.log('trade', node, newMonitor);
    this.commit('UPDATE_MONITOR', {
      monitors: newMonitor,
    });
  },
  [mt.UPDATE_MONITOR](state, { monitors }) {
    // 直接更新datapath
    const monitorIps = Object.keys(monitors);
    // console.log('monitors', monitors, monitorIps);
    state.datapath.datapath.trade.forEach((node, i) => {
      if (node.settings.type === 'client') {
        node.ref.forEach((edge, j) => {
          edge.src_ip_addr.forEach((addr, k) => {
            if (monitorIps.includes(addr.ip)) {
              state.datapath.datapath.trade[i].ref[j].src_ip_addr[k] = monitors[addr.ip];
            }
          });
        });
      } else {
        node.settings.filter.dst_ip_addr.forEach((addr, j) => {
          if (monitorIps.includes(addr.ip)) {
            state.datapath.datapath.trade[i].settings.filter.dst_ip_addr[j] = monitors[addr.ip];
          }
        });
      }
    });
  },
  [mt.HIDE_SOURCE_CONFIG](state) {
    state.showSourceConfig = false;
    state.currentEdge = {};
  },

  [mt.SHOW_TARGET_CONFIG](state, { node, baselineData }) {
    state.showTargetConfig = true;
    state.currentNode = node;
    state.baselineData = baselineData;
  },

  [mt.HIDE_TARGET_CONFIG](state) {
    state.showTargetConfig = false;
    state.currentNode = {};
    state.baselineData = {};
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
        if (ipAddr.length > 0) {
          ipAddr.forEach((ipItem) => {
            ipObj[ipItem.ip] = JSON.parse(JSON.stringify(ipItem));
          });
        }
        if (ipDevice.length > 0) {
          ipDevice.forEach((ipItem) => {
            console.log(ipObj, ipItem.ip);
            if (ipObj[ipItem.ip] !== undefined) {
              ipObj[ipItem.ip].device_name = ipItem.device_name;
              ipObj[ipItem.ip].device_model = ipItem.device_model;
              ipObj[ipItem.ip].device_type = ipItem.device_type;
            }
          });
        }
      } else {
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
              if (ipObj[ipItem.ip] !== undefined) {
                ipObj[ipItem.ip].device_name = ipItem.device_name;
                ipObj[ipItem.ip].device_model = ipItem.device_model;
                ipObj[ipItem.ip].device_type = ipItem.device_type;
              }
            });
          }
        });
      }
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
    // remove of datapath
    _.remove(state.datapath.datapath.trade, d => d.settings.id === node.id);
    if (_.has(state.biz, `intf${node.intf}`)) {
      delete state.biz[`intf${node.intf}`];
    }
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
    if (node.type === 'server') {
      state.biz[`intf${node.intf}`] = {
        alert: [],
        business: {
          str_end: '24:00',
          str_start: '00:00',
          ts_end: 1440,
          ts_start: 0,
          week: [0],
        },
      };
    }
  },

  loading(state, loadingState) {
    state.loaded = !loadingState;
  },

  [mt.CREATE_EDGE](state, { edge, sourceNode, targetNode }) {
    state.edges.push(edge);
    // 初始化数据
    // console.log(edge.sourceNodeId, edge.targetNodeId, state.datapath.datapath.trade[edge.sourceNodeId - 1].ref);
    _.forEach(state.datapath.datapath.trade, (v, k) => {
      if (v.settings.id === edge.sourceNodeId) {
        state.datapath.datapath.trade[k].ref.push({
          name: `level${edge.targetNodeId}`,
          src_ip_device: [],
          src_ip_addr: [],
          src_ports: [],
          src_ip_list: [],
        });
      }
    });
    sourceNode.addSourceEdge(edge.id);
    targetNode.addTargetEdge(edge.id);
  },

  [mt.GET_WORK_TIME](state, data) {
    window.oldSchedule = _.cloneDeep(data.data.result);
    state.schedule = data.data.result;
  },
  [mt.GET_BIZ](state, data) {
    state.biz = data;
    Object.keys(state.biz).forEach((key) => {
      Object.assign(state.biz[key].business, {
        str_start: getBizStart(state.biz[key].business.ts_start),
        str_end: state.biz[key].business.ts_end > 1440 ? '00:00' : u.mins2str(state.biz[key].business.ts_end),
      });
      // console.log(state.biz[key].business);
    });
  },
  [mt.SET_BIZ](state, data) {
    state.biz[`intf${data.intfId}`] = data.data;
  },
  [mt.SET_AIP](state, data) {
    console.log(state, data);
  },
  [mt.SAVE_BIZ](state) {
    // Object.assign(state.datapath, state.biz);
    Object.keys(state.biz).forEach((key) => {
      state.biz[key].business.ts_start = setBizStart(state.biz[key].business.str_start, state.biz[key].business.str_end);
      state.biz[key].business.ts_end = state.biz[key].business.str_end === '00:00' ? 1440 : u.str2mins(state.biz[key].business.str_end);
      state.biz[key].alert.forEach((d) => {
        if (d.type === 'concrete') {
          delete d.week_days;
        } else {
          delete d.day_start;
          delete d.day_end;
        }
      });
    });
    // console.log(state.biz);
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
  [mt.GET_IP_PATH](state, data) {
    state.ipData = data;
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
  [mt.MONITORDATA](state, data) { // 区域
    state.monitData.push(data);
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
