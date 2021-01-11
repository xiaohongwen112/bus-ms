import _ from 'lodash';

/**
 * 提取数据
 * @param {*} data
 * return nodes key为id的对象
 * groups key为id的数组
 */
// export const extractData = data => ({
//   nodes: {},
//   groups: {},
// });

/**
 * 主视图数据
 * @param {*} nodes
 * @param {*} groups
 */
// export const mainData = (nodes, groups) => {
//   return {
//     clientNodes: [],
//     serverNOdes: [],
//   };
// },

/**
 * 容器视图数据
 * @param {*} groupId
 * @param {*} nodes
 * @param {*} groups
 */
// export const containerData = (groupId, nodes, groups) => {
//   return {
//     contentNodes: [],
//     sourceNodes: [],
//     targetNodes: [],
//     contentEdges: [],
//     sourceEdges: [],
//     targetEdges: [],
//   };
// },


 /**
   * 创建组对象
   * @param groupId
   * @param groupData
   * @returns {{id: *, groupId: string, name: string, nodes: Array, source: Array, target: Array, pos: {x: number, y: number}, nodeId: number, parentId: number, type: string, data: {msg: *}}}
   */
function groupObject(groupId, groupData, hasMonitor) {
  return {
    id: groupId,
    groupId: `group${groupId}`,
    name: '',
    nodes: [],
    source: [],
    target: [],
    pos: {
      x: 0,
      y: 0,
    },
    unMonitor: hasMonitor == null ? true : !hasMonitor,
    nodeId: -1,
    parentId: -1,
    type: 'group',
    data: {
      msg: groupData[groupId] || {
        alert_count: 0,
        health: 40,
        health_color: null,
        resp_count: 0,
        response_time: 0,
        response_time_color: null,
        rr_rate: 0,
        rr_rate_color: null,
        success_per: 0,
        success_per_color: null,
        trans_count: 0,
        trans_count_color: null,
      },
    },
  };
}

/**
 * 判断源节点是否与目标节点是否存在相同的祖辈节点
 * @param sourceGroupId
 * @param targetGroupId
 * @param nodes
 * @returns {*}
 */
function isSameParent(sourceGroupId, targetGroupId, nodes) {
  if (sourceGroupId === -1) {
    return false;
  } if (sourceGroupId === targetGroupId) {
    return true;
  }
  return isSameParent(nodes[sourceGroupId].parentId, targetGroupId, nodes);
}

/**
 * 获取节点连接的目标节点ID
 * @param sourceId
 * @param targetId
 * @param nodes
 * @returns {*}
 */
function getTargetId(sourceId, targetId, nodes) {
  const sourceNode = nodes[sourceId];
  const targetNode = nodes[targetId];
  const sourceGroupId = sourceNode.parentId;
  const targetGroupId = targetNode.parentId;
  if (sourceNode.id === targetGroupId) {
    return null;
  } else if (sourceGroupId === targetGroupId || targetGroupId === -1 || isSameParent(sourceGroupId, targetGroupId, nodes)) { // 同组、根、同祖辈
    return targetId;
  }
  return getTargetId(sourceId, targetGroupId, nodes);
}
/* eslint-disable */
/**
 * 获取该节点的源或目的节点ID数组
 * @param arr
 * @param id
 * @param nodes
 * @returns {*|Array.<T>}
 */
function getTarget(arr, id, nodes) {
  const newArr = arr.map(function (nodeId) {
    return getTargetId(id, nodeId, nodes)
  }).filter(function (nodeId) {return nodeId !== null;});
  return _.uniq(newArr);
}
/**
 * 判断节点是否有组
 * @param data
 * @returns {boolean}
 */
export function noGroup(data) {
  return data.settings.groupId === undefined || data.settings.groupId === -1;
}


/**
 * 处理节点data
 * @param {*} data 
 * @param {*} datapath 
 * @param {*} key 
 */
function getNodeData(data, datapath, key, type) {
  const tmpObj = data.find(d => d.level === key);
  if (type === 'server') {
    tmpObj.src_ip_device = datapath.trade[key].settings.filter.src_ip_device;
    const distIpDevice = datapath.trade[key].settings.filter.dist_ip_device;
    tmpObj.per_ip_msg.forEach((d, i) => {
      let device_model = null;
      let device_name = null;
      let device_type = null;
      if (distIpDevice !== [] && distIpDevice[i] !== undefined) { // dist_ip_device 为空
        device_model = distIpDevice[i].device_model;
        device_name = distIpDevice[i].device_name;
        device_type = distIpDevice[i].device_type;
      } 
      tmpObj.per_ip_msg[i].device_model = device_model;
      tmpObj.per_ip_msg[i].device_name = device_name;
      tmpObj.per_ip_msg[i].device_type = device_type;
      
    });
    // 阈值
    const duration = datapath.trade[key].alarmrules.threshold.duration;
    tmpObj.threshold = { duration: [ duration.up.value ? duration.up.value : '', Math.ceil(tmpObj.msg.response_time)] };
  }
  return tmpObj;
}

/**
 * 获取节点（服务器或客户端）
 * @param key
 * @param trade
 * @param data
 * @param workTime
 * @param isAllUnMonitor
 * @returns {{id: *, pos: (pos|{x, y}|*), type, name: *, data: *, source: Array, target: (*|Array), unMonitor: boolean, hasIp: boolean, groupId: number, parentId: number}}
 */
export function getNode(key, trade, data, datapath, isAllUnMonitor) {
  const node = trade[key];
  let hasIp = false;
  let unMonitor = false;
  const groupId = node.settings.groupId === undefined ? -1 : node.settings.groupId;
  const ref = node.ref;
  const target = [];
  const source = [];
  if (ref.length) {
    for (let i = 0; i < ref.length; i += 1) {
      const refTrade = trade[ref[i]];
      target.push(noGroup(refTrade) ? ref[i] : refTrade.settings.groupId);
      if (refTrade.settings.filter.src_ip_list.length > 0) hasIp = true;
    }
  }
  if (node.settings.type === 'server') {
    if (isAllUnMonitor === undefined || isAllUnMonitor) {
      // const item = workTime.find(d => node.collector[0].name === d.intf_name);
      // if (item) {
      unMonitor = false;
      // }
    } else {
      unMonitor = true;
    }
  }
  for (const sourceKey in trade) {
    if (trade[sourceKey].ref.indexOf(key) > -1 && source.indexOf(sourceKey) === -1) {
      source.push(sourceKey);
    }
  }

  return {
    id: key,
    pos: node.settings.pos,
    type: node.settings.type,
    name: node.settings.disp_name,
    data: getNodeData(data, datapath, key, node.settings.type),
    // data: data.find(d => d.level === key),
    source,
    target: ref || [],
      // target: target.unique(),
    unMonitor,
    hasIp,
    groupId,
    parentId: groupId,
  };
}


/**
 * 整理数据
 * 获取所有节点、所有组
 * 获取一级拓扑的节点、连线
 * @param data
 * @param workTime
 * @returns {{edges: Array, basisNodes: Array, groups: {}, nodes: {}}}
 */
export function dealData(data) {
  const overviewData = data.overview_stats;
  const hasMonitor = data.has_monitor;
  const trade = overviewData.datapath.trade;
  const groups = overviewData.datapath.groups || [];
  const groupData = overviewData.groupData;

  const nodes = {}; // 主视图节点
  const finalGroups = {};
  const finalNodes = [];  // 最底部节点
  const finalEdges = [];

  for (const key in trade) {
    const noGroupFlag = noGroup(trade[key]);
    const tmpNode = getNode(key, trade, overviewData.data, overviewData.datapath, hasMonitor);
    const ref = trade[key].ref;
    if (ref.length) {
      for (let i = 0; i < ref.length; i++) {
        if (noGroup(trade[ref[i]]) && noGroupFlag) {
          finalEdges.push({
            id: key + ref[i],
            source: trade[key].settings.pos,
            target: trade[ref[i]].settings.pos,
            sourceId: key,
            targetId: ref[i],
          });
        }
      }
    }

    if (noGroupFlag) {
      finalNodes.push(tmpNode);
    } else {
      const groupId = trade[key].settings.groupId;
      if (!finalGroups.hasOwnProperty(groupId)) {
        finalGroups[groupId] = groupObject(groupId, groupData);
      }
      finalGroups[groupId].nodes.push(tmpNode.id);
      finalGroups[groupId].target = finalGroups[groupId].target.concat(ref);
      finalGroups[groupId].unMonitor = tmpNode.unMonitor && finalGroups[groupId].unMonitor;

      for (const sourceKey in trade) {
        if (trade[sourceKey].ref.indexOf(key) > -1 && finalGroups[groupId].source.indexOf(sourceKey) === -1) {
          finalGroups[groupId].source.push(sourceKey);
        }
      }
    }
    nodes[tmpNode.id] = tmpNode;
  }

  if (groups.length > 0) {
    groups.forEach((group) => {
      const groupId = group.id;
      if (!finalGroups[groupId]) finalGroups[groupId] = groupObject(groupId, groupData, hasMonitor);
      const groupItem = finalGroups[groupId];
      groupItem.name = group.name;
      groupItem.nodeId = group.nodeId;
      groupItem.pos.x = group.x;
      groupItem.pos.y = group.y;
      groupItem.hasServer = group.hasServer;
      if (group.nodes.length) {
        group.nodes.forEach((nodeId) => {
          const groupTmp = groups.find(d => d.nodeId === nodeId);
          if (groupTmp) {
            groupItem.nodes.push(groupTmp.id);
            if (!finalGroups[groupTmp.id]) {
              finalGroups[groupTmp.id] = groupObject(groupTmp.id, groupData, hasMonitor);
            }
            finalGroups[groupTmp.id].parentId = groupItem.id;
            // 去重
            groupItem.target = _.uniq(groupItem.target.concat(finalGroups[groupTmp.id].target));
            groupItem.source = _.uniq(groupItem.source.concat(finalGroups[groupTmp.id].source));
            groupItem.unMonitor = finalGroups[groupTmp.id].unMonitor && groupItem.unMonitor;
          }
        });
      }

      nodes[groupId] = groupItem;
    });

    for (var key in nodes) {
      nodes[key].source = getTarget(nodes[key].source, nodes[key].id, nodes);
      nodes[key].target = getTarget(nodes[key].target, nodes[key].id, nodes);
    }
    for (var key in finalGroups) {
      finalGroups[key].source = getTarget(finalGroups[key].source, finalGroups[key].id, nodes);
      finalGroups[key].target = getTarget(finalGroups[key].target, finalGroups[key].id, nodes);
    }

      /**
       * 添加一级组节点以及连线
       */
    for (var key in finalGroups) {
      var _group = finalGroups[key];
      if (_group.parentId === -1) {
        finalNodes.push(nodes[_group.id]);
        _group.source.forEach((nodeId) => {
          const node = nodes[nodeId];
          const sourceId = node.type === 'group' ? node.groupId : node.id;
          const edgeId = sourceId + _group.groupId;
          if (!finalEdges.some(d => d.id === edgeId)) {
            finalEdges.push({
              id: edgeId,
              source: node.pos,
              target: _group.pos,
              sourceId,
              targetId: _group.groupId,
            });
          }
        });
        _group.target.forEach((nodeId) => {
          const node = nodes[nodeId];
          const targetId = node.type === 'group' ? node.groupId : node.id;
          const edgeId = _group.groupId + targetId;
          if (!finalEdges.some(d => d.id === edgeId)) {
            finalEdges.push({
              id: edgeId,
              source: _group.pos,
              target: node.pos,
              sourceId: _group.groupId,
              targetId,
            });
          }
        });
      }
    }
  }

  return {
    edges: finalEdges,
    basisNodes: finalNodes,
    groups: finalGroups,
    nodes,
  };
}

// 处理子拓扑图

/**
     * 获取与该组源/目的节点，并修改定位（去除y坐标相同的情况）
     * @param node
     * @param nodeArr
     */
    function getConnectNode(node, nodeArr) {
      node.pos.y = nodeArr.some(function (tmp) { return tmp.pos.y === node.pos.y }) ? node.pos.y + 1 : node.pos.y;
      return JSON.parse(JSON.stringify(node));
  }

      /**
     * 根据最小值计算新坐标
     * @param pos
     * @param minX
     * @param minY
     * @returns {{x: number, y: number}}
     */
    function calcPos(pos, minX, minY) {
      return { x: pos.x - minX, y: pos.y - minY };
  }

      /**
     * 获取连线
     * @param node
     * @param nodeArr
     * @param connectNodeId
     * @param connectNodeArr
     * @param edges
     * @param type
     * @returns {*}
     */
    function getEdge(node, nodeArr, connectNodeId, connectNodeArr, edges, type) {
      var connectNode = connectNodeArr.find(function (tmp) { return tmp.id === connectNodeId }) || nodeArr.find(function (tmp) { return tmp.id === connectNodeId });
      var sourceNode = type === 'source' ? connectNode : node;
      var targetNode = type === 'source' ? node : connectNode;
      var sourceId = sourceNode.type === 'group' ? sourceNode.groupId : sourceNode.id;
      var targetId = targetNode.type === 'group' ? targetNode.groupId : targetNode.id;
      var edgeId = sourceId + targetId;
      if (!edges.some(function (edge) {return edge.id === edgeId;})) {
          return {id: edgeId, source: sourceNode.pos, target: targetNode.pos, type: sourceNode.parentId === targetNode.parentId ? '' : type};
      }
      return false;
  }

export const dealGroupData = (groupId, groups, nodes) => {
    var id = groupId === undefined ? '' : groupId;
    var group = groups[groupId];
    var edges = [];
    var sourceEdges = [];
    var targetEdges = [];
    var contentEdges = [];
    var sourceNodes = [];
    var targetNodes = [];
    var contentNodes = [];
    var sourceMinY = 0;
    var targetMinY = 0;
    var minX = 0;
    var minY = 0;

    group.source.forEach(function (nodeId) { sourceNodes.push(getConnectNode(nodes[nodeId], sourceNodes)); });
    group.target.forEach(function (nodeId) { targetNodes.push(getConnectNode(nodes[nodeId], targetNodes)); });
    group.nodes.forEach(function (nodeId) { contentNodes.push(JSON.parse(JSON.stringify(nodes[nodeId]))); });
    // targetNodes = _.uniqBy(targetNodes, 'id');
    sourceNodes.sort(function (a, b) {return a.pos.y - b.pos.y;});
    targetNodes.sort(function (a, b) {return a.pos.y - b.pos.y;});
    contentNodes.sort(function (a, b) {return a.pos.y - b.pos.y;});
    sourceMinY = sourceNodes[0] ? sourceNodes[0].pos.y : 0;
    targetMinY = targetNodes[0] ? targetNodes[0].pos.y : 0;
    minY = contentNodes[0] ? contentNodes[0].pos.y : 0;
    contentNodes.sort(function (a, b) {return a.pos.x - b.pos.x;});
    minX = contentNodes[0] ? contentNodes[0].pos.x : 0;

    contentNodes.forEach(function (node) {
        node.pos = calcPos(node.pos, minX, minY);
        // visualNode(nodeGroup, node, {});
    });

    sourceNodes.forEach(function (node) {
        node.pos = calcPos(node.pos, 0, sourceMinY);
        // createRectNode(prevGroup, node, 'source');
    });
    targetNodes.forEach(function (node) {
        node.pos = calcPos(node.pos, 0, targetMinY);
        // createRectNode(afterGroup, node, 'target');
    });

    contentNodes.forEach(function (node) {
        if (node.target.length) {
            node.target.forEach(function (targetId) {
                var edge = getEdge(node, contentNodes, targetId, targetNodes, edges, 'target');
                if (edge) {edges.push(edge);}
            });
        }
        if (node.source.length) {
            node.source.forEach(function (sourceId) {
                var edge = getEdge(node, contentNodes, sourceId, sourceNodes, edges, 'source');
                if (edge) {edges.push(edge);}
            });
        }
    });

    edges.forEach(function (edge) {
        if (edge.type === 'source') {
          sourceEdges.push(edge);
        } else if (edge.type === 'target') {
          targetEdges.push(edge);
        } else {
          contentEdges.push(edge);
        }
    });

    return {
      sourceNodes: sourceNodes,
      targetNodes: targetNodes,
      contentNodes: contentNodes,
      edges: edges,
      contentEdges: contentEdges,
      sourceEdges: sourceEdges,
      targetEdges: targetEdges,
    };
  }


  // 计算连线坐标
  function calcX(x, nodeWidth, offsetX, width, direction) {
    var num  = direction === 'left' ? x : x + 1;
    return num * nodeWidth  + x * width +  offsetX;
}

function calcY(y, nodeHeight, offsetY) {
    return y * (nodeHeight + offsetY) + nodeHeight / 2;
}

function calcRectY(y, nodeHeight, offsetY) {
    return (y + 1) * offsetY + (y + 1/2) * nodeHeight;
}

/**
* 获取连线缩放后的坐标
* @param type x|y
* @param value Number
* @param translate
* @param scale
* @returns {number}
*/
function getEdgeTransform(type, value, translate, scale) {
  return type === 'x' ? ((value - translate) / scale) : (value - translate / scale);
}

  export function calcPonit(start, end, type, transform = { x: 0, y: 0, k: 1 }) {
    var startX = start.x;
    var startY = start.y;
    var endX = end.x;
    var endY = end.y;
    var startPoint = [];
    var endPoint = [];
    const width = 80;
    const nodeBox = {
      nodeHeight: 258,
      nodeWidth: 275,
      offsetX: 18,
      offsetY: 40,
    };
    const rectNodeBox = {
      nodeHeight:62,
      nodeWidth:162,
      offsetX:0,
      offsetY:15,
      sourceX:-80,
      targetX:906,
      // sourceX:0,
      // targetX:80,
    };
    const transType = ['x', 'y'];
    if (type === 'source') {
        startPoint[0] = rectNodeBox.sourceX;
        startPoint[1] = calcRectY(startY, rectNodeBox.nodeHeight, rectNodeBox.offsetY);
        endPoint[0] = calcX(endX, nodeBox.nodeWidth, nodeBox.offsetX, width, 'left');
        endPoint[1] = calcY(endY, nodeBox.nodeHeight, nodeBox.offsetY);
        // transform--change start
        startPoint = startPoint.map((d, i) => getEdgeTransform(transType[i], d, transform[transType[i]], transform.k));
    } else if (type === 'target') {
        startPoint[0] = calcX(startX, nodeBox.nodeWidth, nodeBox.offsetX, width, 'right');;
        startPoint[1] = calcY(startY, nodeBox.nodeHeight, nodeBox.offsetY);
        endPoint[0] = rectNodeBox.targetX;
        endPoint[1] = calcRectY(endY, rectNodeBox.nodeHeight, rectNodeBox.offsetY);
        // transform--change end
        endPoint = endPoint.map((d, i) => getEdgeTransform(transType[i], d, transform[transType[i]], transform.k));
    } else{
        startPoint[0] = calcX(startX, nodeBox.nodeWidth, nodeBox.offsetX, width, startX <= endX ? 'right' : 'left');
        startPoint[1] = calcY(startY, nodeBox.nodeHeight, nodeBox.offsetY);
        endPoint[0] = calcX(endX, nodeBox.nodeWidth, nodeBox.offsetX, width, startX < endX ? 'left' : 'right');
        endPoint[1] = calcY(endY, nodeBox.nodeHeight, nodeBox.offsetY);
    }
    return {
        start: startPoint,
        end: endPoint,
    }
}

/**
 * 格式化
 * @param {*} n
 * @param {*} len
 */
const formatCount = (n, len = 2) => {
  return n !== null ? Number(n.toFixed(len)) : '--';
}
const formatNullTO = (val, str = '--') => {
  return val !== null ? val : str;
}

/**
 * 返回服务器节点详细数据
 * @param {*} data 
 */
export function serverData(data) {
  let tmpData = {};
  // 健康度---成功率-------------响应率--------交易量-------响应时间
  ['health', 'success_per', 'rr_rate', 'trans_count', 'response_time'].forEach(k => {
    if (data.msg.monitor) {
      tmpData[k] = data.msg[k];
      tmpData[`${k}_alert`] = data.msg[`${k}_color`] !== null;
      if (k == 'health') {
        tmpData[k] = formatCount(tmpData[k] || 0);
      } else {
        tmpData[k] = formatCount(tmpData[k]);
      }
      
    } else {
      tmpData[k] = '--';
      tmpData[`${k}_alert`] = false;
    }
    
  });
   Object.assign(tmpData, {
    network: {
      title: '网卡1',
      value: '83712MB',
      percent: 0,
    },
    monitor: data.msg.monitor,
    alert_count: data.msg.monitor ? data.msg.alert_count : 0,
    intfId: data.intf,
    threshold: data.threshold,
  });
  return tmpData;
}

const toNumber = (n, len = 2) => n ? '--' : Number(n.toFixed(len));

/**
 * 区分客户端和服务器节点
 * @param {*} viewData 
 * @param {*} type 
 */
export function getNodeList(viewData = [], type) {
  const nodeList = [];
  Object.values(viewData).forEach((d) => {
    if (d.type === type || (type === 'server' && d.type === 'group')) {
      // 容器节点无type
      nodeList.push(Object.assign(d, {
        title: {
          id: d.type === 'group' ? d.groupId : d.id,
          name: d.name,
        },
      }));
    }
  });
  return nodeList;
}

const statusMap = {
  last: {
    name: '持续中',
    hex: 'rgb(241, 84, 84)',
  },
  relieve: {
    name: '已恢复',
    hex: '#306A97',
  },
  once: {
    name: '一次性',
    hex: '#ff6600',
  },
};

/**
 * 格式化告警列表
 * @param {*} data
 */
export const formatAlert = (data) => {
  data.forEach(d => {
    // d.peak = formatCount(d.peak);
    // d.thresholds = formatCount(d.thresholds);
    // d.value = formatCount(d.value);
    d.peak = formatNullTO(d.peak);
    d.thresholds = formatNullTO(d.thresholds);
    d.value = formatNullTO(d.value);
    d.status = statusMap[d.status];
  });
  return data;
};

/**
 * 格式化单台服务器详情
 * @param {*} data
 */
export const formatSingle = (data) => {
  const tmpData = _.cloneDeep(data.device_info);
  tmpData.forEach(d => {
    let src_ip = d.src_device.map((item) => {
      return {
        ip: item.ip,
        // name: '未命名设备',
        name: item.device_name ? item.device_name : '未命名设备',
      };
    });
    src_ip = _.sortBy(src_ip, (d) => d.ip);
    Object.assign(d, {
      device_name: d.device_name || '未知设备',
      succ_rate: formatCount(d.succ_rate),
      succ_rate_alert: d.alert.includes('succ_rate'),
      resp_rate: formatCount(d.resp_rate),
      resp_rate_alert: d.alert.includes('resp_rate'),
      trans_count_alert: d.alert.includes('min_trans_count'),
      duration: Math.floor(d.duration),
      duration_alert: d.alert.includes('duration'),
      device_model: d.device_model || '未知',
      device_type: d.device_type || '未知',
      dst_ports: d.dst_ports.join(','),
      src_ports: d.src_ports.sort().join(','),
      src_ip,
    });
  });
  return [data.server_succ_count,  data.server_err_count, tmpData];
};
