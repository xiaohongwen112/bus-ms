
import _ from 'lodash';
import Node from '@/components/editTopoCncc/models/GroupNode';
import Edge from '@/components/editTopoCncc/models/Edge';
import Group from '@/components/editTopoCncc/models/Group';

/**
 * 找自己
 * @param {[Node]} nodes
 * @param {Group} group
 */
export function getContainerByGroup(nodes, group) {
  return _.find(nodes, n => group.nodeId === n.id);
}

/**
 * 找自己
 * @param {[Group]} groups
 * @param {[Node]} node
 */
export function getGroupByNode(groups, node) {
  if (node.type !== 'container') {
    return false;
  }
  return _.find(groups, g => g.nodeId === node.id);
}

/**
 * 找儿子节点
 * @param {[Node]} nodes
 * @param {Group} group
 */
export function getGroupChildren(nodes, group) {
  return _.filter(nodes, n => n.groupId === group.id);
}

/**
 * 找儿子组
 * @param {[Group]} groups
 * @param {[Node]} childrenNodes
 */
export function getGroupChildrenGroup(groups, childrenNodes) {
  return _.map(
    _.filter(childrenNodes, n => n.type === 'container'),
    n => getGroupByNode(groups, n),
  );
}

/**
 * 找爸爸
 * @param {[Group]} groups
 * @param {Node} node
 */
export function getParent(groups, node) {
  if (node.groupId === -1) {
    return false;
  }
  return _.find(groups, g => node.groupId === g.id);
}

/**
 * 找爸爸节点
 * @param {[Node]} nodes
 * @param {[Group]} groups
 * @param {Node} node
 */
export function getParentNode(nodes, groups, node) {
  const group = getParent(groups, node);
  return getContainerByGroup(nodes, (group || false));
}

/**
 * 找兄弟
 * @param {[Node]} nodes
 * @param {Group} parentGroup
 * @param {Node} node
 */
export function getSiblings(nodes, parentGroup, node) {
  if (!parentGroup) {
    return _.filter(nodes, n => n.id !== node.id && n.groupId === -1);
  }
  return _.filter(nodes, n => n.id !== node.id && n.groupId === parentGroup.id);
}

/**
 * 找右边的兄弟 并排序
 * @param {[Node]} siblings
 * @param {Node} node
 */
export function getNodeRightSiblings(siblings, node) {
  return _.sortBy(_.filter(siblings, n => n.x > node.x), ['x']);
}

/**
 * 找下边的兄弟 并排序
 * @param {[Node]} siblings
 * @param {Node} node
 */
export function getNodeBottomSiblings(siblings, node) {
  return _.sortBy(_.filter(siblings, n => n.y > node.y), ['y']);
}

/**
 * 找正右边的兄弟 并排序
 * @param {*} siblings
 * @param {*} group
 */
export function getGroupRightSiblings(siblings, group) {
  return _.sortBy(_.filter(siblings, n => n.x >= group.x + group.width && n.y >= group.y && n.y < group.y + group.height), ['x']);
}

/**
 * 找正下边的兄弟 并排序
 * @param {*} siblings
 * @param {*} group
 */
export function getGroupBottomSiblings(siblings, group) {
  return _.sortBy(_.filter(siblings, n => n.y >= group.y + group.height && n.x >= group.x && n.x < group.x + group.width), ['y']);
}

const offset = { x: 0, y: 0 };

export const coordUnitTrans = ({ x, y }) => {
  const sx = 200;
  const sy = 100;
  return { x: parseFloat(x) * sx + offset.x, y: parseFloat(y) * sy + offset.y };
};
export const coordUnitTransInverse = ({ x, y }) => {
  const sx = 200;
  const sy = 100;
  return { x: (x - offset.x) / sx, y: (y - offset.y) / sy };
};

/**
 * link edge from sourceNode to targetNode
 * @param {Node} sourceNode
 * @param {Node} targetNode
 * @param {Edge} edge
 */
function linkEdge(sourceNode, targetNode, edge, edgeVisible) {
  /* eslint-disable no-param-reassign  */
  if (sourceNode.id === undefined || targetNode.id === undefined) {
    throw new Error('Cant link to empty node');
  }
  edge.sourceNodeId = sourceNode.id;
  edge.targetNodeId = targetNode.id;
  edge.visible = edgeVisible;
  edge.link(sourceNode, targetNode);
}


/**
 * set edge attrs correctly
 * visible 标志为T,F; 根为R; A->B为A至B的路径
 * F为求父函数, 对树tree上任意K:
 * 若K为T, 则 F(K)->R 全为F;
 * 输入初始节点A,B一定在叶子节点上
 * 若A,B不满足条件, 则 A->R, B->R 上一定分别有两节点满足条件
 * 1. A:T, B:T => A, B;
 * 2. A:T, B:F => C为B->R①个T => A, C;
 * 3. A:F, B:T => C为A->R①个T => C, B;
 * 4. A:F, B:F => 令A->R①个T为C, 令B->R①个T为D:
 *   => C,D 不可能为祖孙关系
 *  => a. C !== D => C, D;
 *  => b. else 寻找A 和B 具有最近共同祖先G的祖先E,F
 * @param {Node} sourceNode
 * @param {Node} targetNode
 * @param {Edge} edge
 */
function putEdgeFactory(nodes, groups) {
  const putEdge = (s, t, edge) => {
    if (s.visible && t.visible) {
      linkEdge(s, t, edge, true);
    } else if (s.visible && !t.visible) {
      let ft = t;
      while (!ft.visible) {
        ft = getParentNode(nodes, groups, ft);
      }
      linkEdge(s, ft, edge, true);
    } else if (!s.visible && t.visible) {
      let fs = s;
      while (!fs.visible) {
        fs = getParentNode(nodes, groups, fs);
      }
      linkEdge(fs, t, edge, true);
    } else {
      const fss = [s];
      const ftt = [t];
      while (fss[fss.length - 1] !== undefined) {
        fss.push(getParentNode(nodes, groups, fss[fss.length - 1]));
      }
      while (ftt[ftt.length - 1] !== undefined) {
        ftt.push(getParentNode(nodes, groups, ftt[ftt.length - 1]));
      }
      const sFirstVisible = _.find(fss, n => n.visible);
      const tFirstVisible = _.find(ftt, n => n.visible);
      // console.log(fss, ftt, sFirstVisible, tFirstVisible);
      if (sFirstVisible !== tFirstVisible) {
        linkEdge(sFirstVisible, tFirstVisible, edge, true);
      } else {
        let Is = -100;
        let It = -100;
        for (let index = 0; index < ftt.length; index++) { // eslint-disable-line
          const n = ftt[index];
          Is = fss.indexOf(n);
          if (Is > -1) {
            It = index;
            break;
          }
        }
        // console.log(Is, It, ftt[It], fss[Is]);
        if (Is < 0 || It < 0) throw new Error('Invalid datapath');
        linkEdge(fss[Is - 1], ftt[It - 1], edge, false);
      }
    }
  };
  return putEdge;
}


export const buildNodes = (data) => {
  let nodes = [];
  const edges = [];
  const groups = [];
  _.forEach(data.datapath.trade, (v) => {
    const levelNum = v.settings.name;
    const nodeIndex = +levelNum.match(/\d+/)[0];
    const { x, y } = coordUnitTrans(v.settings.pos);
    const dispName = v.settings.disp_name;
    const iconName = v.settings.imgname;
    const type = v.settings.type;
    const groupId = v.settings.groupId;
    const visible = v.settings.visible;
    let intf;
    if (type === 'server') {
      intf = v.collector[0].name.match(/\d+/)[0];
    }
    const node = new Node(x, y, { levelNum, nodeIndex, dispName, type, iconName, intf, groupId, visible });
    nodes.push(node);

    _.forEach(v.ref, (refV) => {
      const sourceNodeId = nodeIndex;
      const targetNodeId = +refV.name.match(/\d+/)[0];
      console.log('sourceNodeId, targetNodeId', sourceNodeId, targetNodeId);
      const edge = new Edge(sourceNodeId);
      edge.linkTo(targetNodeId);
      edges.push(edge);
    });
  });

  const containers = [];
  const cToPObj = {};  // key: child nodeId, value: parent groupId
  // const pToCObj = {};  // key: parent nodeId, value: child nodeId
  if (data.datapath.groups) {
    _.forEach(data.datapath.groups, (g) => {
      _.forEach(g.nodes, (nId) => {
        cToPObj[nId] = g.id;
      });
      const { x, y } = coordUnitTrans({ x: g.x, y: g.y });
      g.x = x;
      g.y = y;
      const group = new Group({ ...g, groupIndex: g.id });
      groups.push(group);
      if (typeof g.nodeId === 'number') {
        const container = new Node(g.x, g.y, { nodeIndex: g.nodeId, type: 'container', dispName: g.name, visible: g.collapsed });
        containers.push(container);
      }
    });
  }

  _.forEach(containers, (container, index) => {
    // group 和 container 一一对应
    const g = groups[index];
    // 不是最上层节点
    if (_.has(cToPObj, g.nodeId)) {
      container.groupId = cToPObj[g.nodeId];
    }
  });

  _.forEach(containers, (container, index) => {
    const g = groups[index];
    if (container.groupId === -1) {
      // container 在根
      container.visible = g.collapsed;
    } else {
      // container 不在根
      const parentGroup = getParent(groups, container);
      if (!parentGroup.collapsed) {
        container.visible = g.collapsed;
      } else {
        container.visible = false;
      }
    }
  });

  nodes = _.concat(nodes, containers);

  const putEdge = putEdgeFactory(nodes, groups);

  _.forEach(edges, (edge) => {
    const targetNode = _.find(nodes, n => n.id === edge.targetNodeId);
    const sourceNode = _.find(nodes, n => n.id === edge.sourceNodeId);
    sourceNode.addSourceEdge(edge.id);
    targetNode.addTargetEdge(edge.id);
    putEdge(sourceNode, targetNode, edge);
  });

  return { nodes, edges, groups };
};
