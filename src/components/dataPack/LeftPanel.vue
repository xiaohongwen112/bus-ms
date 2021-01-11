<template>

  <div class="left-panel">
    <Collapse @change="onItemClick">
      <CollapseItem title="源数据包" name="original">
        <ScrollBar class="scroll-area">
          <div class="collapse-item-content">
            <div
              v-for="(node, k) in editingNodes"
              :key="k">
              <label
                v-for="(ip, ipK) in node.ipWithName"
                :key="ipK"
              >
                <span> {{ip.addr}} </span>
                <input
                  type="text"
                  placeholder="组件名"
                  v-model.lazy.trim="ip.name"
                  :readonly="ipK > 0"
                >
              </label>
            </div>
          </div>
        </ScrollBar>
      </CollapseItem>
      <CollapseItem title="复杂应用" name="complexity">
        <ScrollBar class="scroll-area">
          <div class="collapse-item-content">
            <div
              v-for="(node, k) in editingNodes"
              :key="k">
              <label
                v-for="(ip, ipK) in node.ipWithName"
                :key="ipK"
              >
                <span> {{ip.addr}} </span>
                <input
                  type="text"
                  placeholder="组件名"
                  v-model.lazy.trim="ip.name"
                  :readonly="ipK > 0"
                >
              </label>
            </div>
          </div>
        </ScrollBar>
      </CollapseItem>
      <CollapseItem title="重要应用" name="importance">
        <ScrollBar class="scroll-area">
          <div class="collapse-item-content">
            <div
              v-for="(node, k) in editingNodes"
              :key="k">
              <label
                v-for="(ip, ipK) in node.ipWithName"
                :key="ipK"
              >
                <span> {{ip.addr}} </span>
                <input
                  type="text"
                  placeholder="组件名"
                  v-model.lazy.trim="ip.name"
                  :readonly="ipK > 0"
                >
              </label>
            </div>
          </div>
        </ScrollBar>
      </CollapseItem>
      <CollapseItem title="流量大小" name="flowSize">
        <ScrollBar class="scroll-area">
          <div class="collapse-item-content">
            <div
              v-for="(node, k) in editingNodes"
              :key="k">
              <label
                v-for="(ip, ipK) in node.ipWithName"
                :key="ipK"
              >
                <span> {{ip.addr}} </span>
                <input
                  type="text"
                  placeholder="组件名"
                  v-model.lazy.trim="ip.name"
                  :readonly="ipK > 0"
                >
              </label>
            </div>
          </div>
        </ScrollBar>
      </CollapseItem>
    </Collapse>
  </div>
  
</template>
<script>

/* eslint-disable camelcase */

/*
 * 显示ip的设备名和组件名，
 *
 */

import _ from 'lodash';
import Collapse from '@/components/common/Collapse';
import CollapseItem from '@/components/common/CollapseItem';
import ScrollBar from '@/components/common/ScrollBar';

const props = {
  showEditing: {
    type: Boolean,
    default: true,
  },
  nodes: {
    type: Array,
    default: () => [],
  },
  showData: {
    type: Array,
    default: () => [],
  },
  ipDevices: {
    type: Object,
    default: () => ({
      exclude_ips: [],
      include_ips: [],
      normal_ips: [],
    }),
  },
};

export default {
  name: 'left-panel',
  props,
  components: {
    Collapse,
    CollapseItem,
    ScrollBar,
  },
  data() {
    return {
      editingNodes: this.initEditingNodes(this.nodes),
    };
  },
  methods: {
    onItemClick(e) {
      this.$emit('setTidyMethod', e);
    },
    initEditingNodes(nodes) {
      const { exclude_ips, include_ips, normal_ips } = this.ipDevices;
      const ipDeviceArr = [...exclude_ips, ...include_ips, ...normal_ips];
      // return nodes.filter(n => n.drawProperties.status === 'normal')
      return nodes
        .map((n) => {
          let ips = n.ip_ports;
          if (ips.length > 1) ips = [ips[0]].concat(ips);
          const ipWithName = _.map(ips, (ip, index, arr) => {
            const result = {
              addr: ip[0],
              ports: ip[1],
              weight: ip[2],
              name: index === 0 ? (!n.raw ? n.name : '') : '', // eslint-disable-line
            };
            if (result.addr === result.name) result.name = '';
            const findedIpDevice = _.find(ipDeviceArr, id => id.ip === result.addr);
            if (findedIpDevice && (arr.length === 1 || arr.length > 1 && index > 0)) result.name = findedIpDevice.device;
            return result;
          });
          return ({ ...n, ipWithName });
        });
    },
  },
  watch: {
    nodes: {
      handler(newV) {
        this.editingNodes = this.initEditingNodes(newV);
      },
      deep: true,
    },
    showData: {
      handler(newV) {
        this.editingNodes = this.initEditingNodes(newV);
      },
      deep: true,
    },
    editingNodes: {
      handler(newVal) {
        this.n = newVal.name;
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>

div.left-panel {
  width: 20%;
  margin-right: 2px;
  // background: #071d24;
  background: #0d1924;
  height: 100%;

  .editor-panel {

    .title {
      background: #18262c;
      text-align: left;
      cursor: pointer;
      padding: 8px;
      height: 36px;

      ul {
        display: flex;
        flex-direction: row;
      }
    }
  }
}

div.collapse-block {
  height: 70%;
}

div.is-active {
  height: calc(100% - 36px * 3);
  overflow: hidden;

  div.item-wrap{
    height: calc(100% - 36px);
  }
}

.scroll-area {
  position: relative;
  margin: auto;
  width: 100%;
  height: 100%;
}

div.collapse-item-content {
  padding: 0 10px;
  background: #0d1924;

  div {
    width: 100%;
  }

  label {
    margin: 5px 10px;
    display: flex;
    justify-content: space-around;

    &:not(:first-child) {
      margin-left: 40px;
    }

    span {
      font-weight: 400;
      flex: 1 1 40%;
      text-align: left;
    }

    input[type="text"] {
      max-width: 100px;
      font-weight: 400;
      padding: 2px 5px;
      line-height: 14px;
    }
  }
}

</style>