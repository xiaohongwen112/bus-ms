import _ from 'lodash';

import { getDataPath, saveDataPath, applyDataPath, exportDataPath, getWorkTime, saveWorkTime, saveIp, delIp } from './../service';

import * as mt from './mutation-types';
import * as u from '../utils';

export default {
  showSourceConfig({ commit }, node) {
    commit(mt.SHOW_SOURCE_CONFIG, node);
  },
  hideSourceConfig({ commit }) {
    commit(mt.HIDE_SOURCE_CONFIG);
  },
  showTargetConfig({ commit }, node) {
    commit(mt.SHOW_TARGET_CONFIG, node);
  },
  hideTargetConfig({ commit }) {
    commit(mt.HIDE_TARGET_CONFIG);
  },
  async getData({ commit, state }) {
    const res = await getDataPath(state.appName);
    commit(mt.GET_DATA_PATH, res.data);
  },
  dragNode({ commit }, nodeId) {
    commit(mt.DRAGGING_NODE, { nodeId });
  },
  removeNode({ commit, state, dispatch }, node) {
    const allEdges = node.edges.source.concat(node.edges.target);
    allEdges.forEach((edgeId) => {
      const edge = _.find(state.edges, e => e.id === edgeId);
      commit(mt.REMOVE_EDGE, { edge });
    });
    commit(mt.REMOVE_NODE, { node });
    if (node.type === 'container') {
      const group = u.getGroupByNode(state.groups, node);
      dispatch('removeGroup', group);
    }
  },
  changeNodeName({ state, commit }, { node, value }) {
    commit(mt.CHANGE_NODE_NAME, { node, value });
    if (node.type === 'container') {
      const group = u.getGroupByNode(state.groups, node);
      commit(mt.CHANGE_GROUP_NAME, { group, value });
    }
  },
  changeNodeError({ commit }, { node, isError }) {
    commit(mt.CHANGE_NODE_ERROR, { node, isError });
  },
  removeEdge({ commit, state }, edge) {
    if (edge.sourceNodeType !== 'container' && edge.targetNodeType !== 'container') {
      commit(mt.REMOVE_EDGE, { edge });
    } else {
      const rmEdges = _.filter(state.edges, (e) => { // eslint-disable-line
        return (e.sourceNodeId === edge.sourceNodeId && e.targetNodeId === edge.targetNodeId) ||
          (e.targetNodeId === edge.sourceNodeId && e.sourceNodeId === edge.targetNodeId);
      });
      _.forEach(rmEdges, e => commit(mt.REMOVE_EDGE, { edge: e }));
    }
  },
  createNode({ commit }, node) {
    commit(mt.CREATE_NODE, { node });
  },
  createEdge({ commit }, { edge, sourceNode, targetNode }) {
    commit(mt.CREATE_EDGE, { edge, sourceNode, targetNode });
  },

  createGroup({ commit }, group) {
    commit(mt.CREATE_GROUP, { group });
  },
  removeGroup({ commit, dispatch, state }, group) {
    console.log('removeGroup', group);
    commit(mt.REMOVE_GROUP, { group });
    _.forEach(group.nodes, (nodeId) => {
      const node = _.find(state.nodes, n => n.id === nodeId);
      if (node) {
        dispatch('removeNode', node);
      }
    });
  },

  async getSchedule({ commit, state }) {
    const res = await getWorkTime(state.appName);
    commit(mt.GET_WORK_TIME, res);
  },
  async saveDataPath({ state }) {
    const res = await saveDataPath(state.appName, state.datapath.datapath);
    // commit(GET_DATA_PATH, res.data);
    console.log('res', res);
    return res;
  },
  async saveAll({ commit, state, dispatch }, { cb }) {
    commit('loading', true);
    try {
      const res1 = await dispatch('saveDataPath');
      const res2 = await dispatch('saveIp');
      const res3 = await dispatch('saveWorkTime', { type: 'save' });
      commit('loading', false);
      if (typeof cb === 'function') {
        cb(res1, res2, res3);
      }
    } catch (e) {
      console.log('save ERROR: ', e);
    }
  },
  async applyDataPath({ state }, { taskId, callback }) {
    const res = await applyDataPath(state.appName, state.datapath.datapath, taskId);
    // commit(GET_DATA_PATH, res.data);
    if (typeof callback === 'function') {
      callback(res.data);
    }
    console.log('res', res);
  },
  async exportDataPath({ state }) {
    const res = await exportDataPath(state.appName);
    // commit(GET_DATA_PATH, res.data);
    console.log('res', res);
  },
  async saveWorkTime({ state }, { type }) {
    const res = await saveWorkTime(state.appName, state.schedule, type);
    console.log('res', res);
    return res;
  },
  async saveIp({ state }) {
    const res = await saveIp(state.ipObj);
    console.log('res', res);
    return res;
  },
  async delIp({ ip, type }) {
    const res = await delIp(ip, type);
    console.log('res', res);
  },
};
