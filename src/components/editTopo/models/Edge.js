let id = 1;

export default class Edge {
  constructor(sourceNodeId, visible = true) {
    this.sourceNodeId = sourceNodeId;
    this.targetNodeId = null;
    this.id = id;
    id += 1;
    this.source = {
      x: -1,
      y: -1,
    };
    this.target = {
      x: -1,
      y: -1,
    };
    this.bugleDirection = null;
    this.visible = visible;
    this.sourceNodeType = null;
    this.targetNodeType = null;
  }

  setSourceCoordinates(x, y) {
    this.source = { x, y };
  }

  setTargetCoordinates(x, y) {
    this.target = { x, y };
  }

  /**
   * id 连接
   * @param {Number} targetId
   */
  linkTo(targetId) {
    this.targetNodeId = targetId;
  }

  /**
   * 位置连接
   * 位置相对变换
   * @param {Node} source sourceNode
   * @param {Node} target targetNode
   */
  link(source, target) {
    const x1 = source.x;
    const x2 = target.x;

    this.sourceNodeType = source.type;
    this.targetNodeType = target.type;
    if (x1 - x2 > 0) {
      const sourceDot = source.getDotCoordinates('left');
      const targetDot = target.getDotCoordinates('right');
      this.source = sourceDot;
      this.target = targetDot;
      this.bugleDirection = 'right';
    } else if (x1 - x2 < 0) {
      const sourceDot = source.getDotCoordinates('right');
      const targetDot = target.getDotCoordinates('left');
      this.source = sourceDot;
      this.target = targetDot;
      this.bugleDirection = 'left';
    } else {
      const sourceDot = source.getDotCoordinates('right');
      const targetDot = target.getDotCoordinates('right');
      this.source = sourceDot;
      this.target = targetDot;
      this.bugleDirection = 'right';
    }
  }

}

Edge.bugleDistance = 10;
Edge.r = 8;
