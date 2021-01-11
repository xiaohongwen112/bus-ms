
import _ from 'lodash';

let id = 1;
let intfNum = 1;

export default class Node {
  constructor(x, y, {
    levelNum,
    nodeIndex,
    dispName,
    type,
    iconName,
    intf,
    error,
  }) {
    this.x = x;
    this.y = y;
    this.levelNum = levelNum;
    this.dispName = dispName;
    this.intf = intf;
    this.type = type;
    this.typeText = type === 'client' ? '客户端名称' : '服务端名称';
    this.error = typeof error === 'undefined' ? false : error;
    if (nodeIndex !== null) {
      this.id = +nodeIndex;
      if (nodeIndex >= id) {
        id = this.id + 1;
      }
      if (type === 'server') {
        if (+intf >= intfNum) {
          intfNum = +intf + 1;
        }
      }
    } else {
      this.id = id;
      this.levelNum = `level${id}`;
      id += 1;

      if (type === 'server') {
        this.intf = intfNum;
        intfNum += 1;
      }
    }
    if (iconName) {
      this.iconName = iconName;
    } else {
      if (type === 'client') {
        this.iconName = 'client';
        this.typeText = '客户端名称';
      } else if (type === 'server') {
        this.iconName = 'serverGroup';
        this.typeText = '服务端名称';
      } else {
        // container node
        this.iconName = 'container1';
        this.typeText = '容器名称';
      }
    }
    this.edges = {
      source: [],
      target: [],
    };
  }

  static getTopLeftPoint(x, y) {
    const rx = (x % Node.nw === 0 ? Math.ceil(x / Node.nw) :
      Math.ceil(x / Node.nw) - 1) * Node.nw + Node.offsetX;
    const ry = (y % Node.nh === 0 ? Math.ceil(y / Node.nh) :
      Math.ceil(y / Node.nh) - 1) * Node.nh + Node.offsetY;
    return { rx, ry };
  }

  getCooridnates() {
    const { x, y } = this;
    return { x, y };
  }

  setCoordinates(x, y) {
    const { rx, ry } = Node.getTopLeftPoint(x, y);
    this.x = rx;
    this.y = ry;
  }

  getDotCoordinates(type) {
    let x = 0;
    const y = this.y + Node.dotHeight;
    if (type === 'left') {
      x = this.x + Node.marginLeft;
    } else {
      x = this.x + Node.width - Node.marginLeft;
    }
    return { x, y };
  }

  setIconName(iconName) {
    this.iconName = iconName;
  }

  /**
   * add edge to node's source
   * @param {Number} edgeId
   */
  addSourceEdge(edgeId) {
    this.edges.source.push(edgeId);
  }

  /**
   * add edge to node's target
   */
  addTargetEdge(edgeId) {
    this.edges.target.push(edgeId);
  }

  removeSourceEdge(edgeId) {
    _.remove(this.edges.source, eId => eId === edgeId);
  }

  removeTargetEdge(edgeId) {
    _.remove(this.edges.target, eId => eId === edgeId);
  }

  setError(err) {
    this.error = err;
  }

}

Node.dotHeight = 50;
Node.marginLeft = 35;
Node.width = 200;
Node.nw = 200;
Node.nh = 100;
Node.offsetX = 0;
Node.offsetY = 0;
