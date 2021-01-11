let id = 0;

export default class Group {

  constructor({ x, y, nodeId = null,
    name = null, height = 100, width = 200,
    nodes = [], groupIndex = null, collapsed = true,
  }) {
    if (groupIndex !== null) {
      this.id = groupIndex;
      if (groupIndex >= id) {
        id = this.id + 1;
      }
    } else {
      this.id = id;
      id += 1;
    }
    if (name) {
      this.name = name;
    } else {
      this.name = `容器${this.id + 1}`;
    }
    this.x = x;
    this.y = y;
    this.width = width; // TO-DO
    this.height = height;
    this.collapsed = collapsed;
    // 容器组件的Id
    this.nodeId = nodeId;
    // node id array
    this.nodes = nodes;
  }

  pushNode(nodeId) {
    this.nodes.push(nodeId);
  }

  setName(name) {
    this.name = name;
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  setWidth(w) {
    this.width = w;
  }

  setHeight(h) {
    this.height = h;
  }
}
