<template>
  <Node 
    :node="node" 
    :on-dot-click="onDotClick" 
    @node-dragging="onNodeDragging"
    @node-dragged="onNodeDragged"
    :is-empty="isEmpty"
    @delete-node="onDeleteNode"
    @node-name-change="onNodeNameChange"
    @expand-container="onExpandContainer"
  />
</template>

<script>
import { getBgColor } from '@/helpers/utils';

import Node from './Node';

export default {
  name: 'group-node',
  props: {
    node: {
      type: Object,
    },
    isEmpty: {
      type: Function,
    },
    onDotClick: {
      type: Function,
    },
  },
  components: {
    Node,
  },
  computed: {
    bgColor() {
      return getBgColor(this.node.groupId);
    },
  },
  methods: {
    onNodeDragging(node = null, ev = null) {
      this.$emit('node-dragging', node, ev);
    },
    onDeleteNode(node) {
      this.$emit('delete-node', node);
    },
    onNodeNameChange(node, value) {
      this.$emit('node-name-change', node, value);
    },
    onExpandContainer(node) {
      this.$emit('expand-container', node);
    },
    onNodeDragged(node) {
      this.$emit('node-dragged', node);
    },
  },
};
</script>
<style scoped>

</style>
