import Node from './Node';

export default class GroupNode extends Node {

  constructor(x, y, {
    levelNum = null, nodeIndex = null, dispName = '',
    type = null, iconName = null, intf = null,
    groupId = null, visible = true,
  }) {
    super(x, y, {
      levelNum,
      nodeIndex,
      dispName,
      type,
      iconName,
      intf,
    });
    this.groupId = groupId === null ? -1 : groupId;
    this.visible = visible;
  }

  setGroupId(groupId) {
    this.groupId = groupId;
  }

  toggleVisible() {
    this.visible = !this.visible;
  }
}
