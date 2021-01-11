<template>
  <config-box :tabs="tabs" :active="active" :errors="errors" @saveConfig="saveConfig" @closeConfig="closeConfig">
    <template slot="sourceConfig">
      <ipConfig
        :isNull="true"
        :isClear="isClear"
        :ipObj="this.$store.state.ipObj"
        :initIpList="ref.src_ip_list"
        :initDeviceList="ref.src_ip_device"
        :initMonitorList="ref.src_ip_addr"
        @ipChange="ipChange"
        @addMointor="addMointor"
        v-model="confData"
        class="ip-container"
      ></ipConfig>
    </template>
  </config-box>
</template>

<script>
  import _ from 'lodash';
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
        newMonitor: {}, // 临时存放更改后的监控， 在保存后更新值confData
        confData: {
          newMonitor: {},
        },
        errors: [],
      };
    },
    computed: {
      ref() {
        if (_.has(this.edge, 'sourceNodeId')) {
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
          return _.cloneDeep(ref);
        }
        this.isClear = false;
        return _.cloneDeep({ name: '', src_ip_addr: [], src_ip_device: [], src_ip_list: [], src_ports: [] });
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
        this.changeErrors(data.isValid, 'sourceConfig');
      },
      addMointor(obj) {
        // 保存后更改new
        this.newMonitor[obj.ip] = obj;
      },
      changeErrors(bool, id) {
        if (bool) {
          if (this.errors.indexOf(id) > -1) {
            this.errors.splice(this.errors.indexOf(id), 1);
          }
        } else {
          if (this.errors.indexOf(id) === -1) {
            this.errors.push(id);
          }
        }
      },
      saveConfig() {
        // 验证端口-保存
        if (this.errors.length === 0) {
          if (!this.confData.error) {
            // 更新监控列表
            this.confData.newMonitor = this.newMonitor;
            this.$store.commit('UPDATE_SRC', {
              edge: this.confData,
            });
            this.closeConfig();
          }
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
      newIpData(newD, oldD) {
        const comPD = newD.src_ip_device;
        let newIpArr = [];
        if (Object.keys(oldD).length === 0) {
          newIpArr = newD.src_ip_device;
        } else {
          comPD.forEach((item) => {
            const itemData = item;
            for (const index in oldD) {
              if (item.ip === index) {
                console.log(index, oldD[index]);
                itemData.device_model = oldD[index].device_model;
                itemData.device_name = oldD[index].device_name;
                itemData.device_type = oldD[index].device_type;
              }
              newIpArr.push(itemData);
              newIpArr = _.uniq(newIpArr);
            }
          });
        }
        return newIpArr;
      },
    },
    mounted() {
      this.confData = _.cloneDeep(this.$store.state.currentEdge);
      this.confData.src_ip_device = this.newIpData(this.$store.state.currentEdge, this.$store.state.ipObj);
      this.confData.error = false;
    },
  };
</script>

<style>
/* 覆盖本地样式 */
.monitor-list-div{
  margin-top: 0;
}
</style>
<style scoped>

  input {
    text-align: center;
  }

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
