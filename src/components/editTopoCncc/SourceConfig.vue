<template>
  <config-box :tabs="tabs" :active="active" @saveConfig="saveConfig" @closeConfig="closeConfig">
    <template slot="sourceConfig">
      <div class="nav-row port-row">
        <span class="name-span">发出端口</span>
        <input v-model="ref.src_ports"  @input="checkPort" class="port-input" autocomplete="off" placeholder="0-65535之间，区间用-连接，多个端口用,隔开">
      </div>
      <ip-config
        :isNull="true"
        :isClear="isClear"
        :ipObj="this.$store.state.ipObj"
        :initIpList="ref.src_ip_list"
        :initDeviceList="ref.src_ip_device"
        :initMonitorList="ref.src_ip_addr"
        @ipChange="ipChange"
        class="ip-container"
      ></ip-config>
    </template>
  </config-box>
</template>

<script>
  import cloneDeep from 'lodash/cloneDeep';
  import has from 'lodash/has';
  import { validatePort, checkError } from '@/helpers/configValidate';
  import configBox from '@/components/common/ConfigBox';
  import ipConfig from './IpConfig';

  export default {
    name: 'source-config',
    components: {
      configBox,
      ipConfig,
    },
    props: {
      edge: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        active: 0,
        tabs: [{ id: 'sourceConfig', text: '发出配置' }],
        isClear: false,
        ipRight: true,
        portRight: true,
        ipObj: {},
      };
    },
    computed: {
      ref() {
        if (has(this.edge, 'sourceNodeId')) {
          this.isClear = true;
          const trade = this.$store.state.datapath.datapath.trade;
          const refs = trade.find(d => `level${this.edge.sourceNodeId}` === d.settings.name).ref;
          const edgeTarget = `level${this.edge.targetNodeId}`;
          const ref = refs.find(refItem => refItem.name === edgeTarget) || {
            name: edgeTarget,
            src_ip_addr: [],
            src_ip_device: [],
            src_ip_list: [],
            src_ports: [],
          };
          return cloneDeep(ref);
        }
        this.isClear = false;
        return cloneDeep({ name: '', src_ip_addr: [], src_ip_device: [], src_ip_list: [], src_ports: [] });
      },
    },
    methods: {
      checkPort(e) {
        const res = validatePort(e.target.value);
        checkError(res, e.target);
        this.portRight = res.bool;
      },
      ipChange(data) {
        this.ref.src_ip_addr = data.monitorList;
        this.ref.src_ip_device = data.ipList;
        this.ref.src_ip_list = data.ipList.map(d => d.ip);
        this.newIpObj = data.ipObj;
        this.ipRight = data.isRight;
      },
      saveConfig() {
        if (this.portRight && this.ipRight && this.ref.name) {
          const node = this.$store.state.datapath.datapath.trade.find(d => d.settings.name === `level${this.edge.sourceNodeId}`);
          const edgeTarget = `level${this.edge.targetNodeId}`;
          const ref = node.ref.find(refItem => refItem.name === edgeTarget);
          if (ref) {
            ref.src_ip_addr = this.ref.src_ip_addr;
            ref.src_ip_device = this.ref.src_ip_device;
            ref.src_ip_list = this.ref.src_ip_list;
            ref.src_ports = this.ref.src_ports;
          } else {
            node.ref.push(cloneDeep(this.ref));
          }
          this.closeConfig();
        }
      },
      closeConfig() {
        this.clear();
        this.$store.dispatch('hideSourceConfig');
      },
      clear() {
        this.portRight = true;
        this.ipRight = true;
        Array.from(this.$el.querySelectorAll('.error-input')).forEach(item => checkError({ bool: true }, item));
      },
    },
  };
</script>

<style scoped>
  .port-row {
    width: 50%;
  }
  .name-span{
    display: inline-block;
    width: 70px;
  }
  .port-input{
    width: calc(100% - 110px);
    height: 26px;
    line-height: 26px;
  }
  .error-input{
    border:1px solid red!important;
  }
  .ip-container{
    height: 100%;
  }
  input::-webkit-input-placeholder{
    color: #777;
  }
  input::-moz-placeholder{
    color: #777;
  }
  input:-ms-input-placeholder{
    color: #777;
  }
</style>
