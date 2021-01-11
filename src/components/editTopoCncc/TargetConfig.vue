<template>
  <config-box :tabs="tabs" :errors="errors" :active="active" @saveConfig="saveConfig" @closeConfig="closeConfig">
    <receive-config
      slot="receiveConfig"
      :isClear="isClear"
      :settings="trade.settings"
      :ipObj="this.$store.state.ipObj"
      class="ip-container"
      @receiveChange="receiveChange"
    ></receive-config>
    <alert-config
      slot="alertConfig"
      :alarmrules="trade.alarmrules"
      class="ip-container"
      @alertChange="alertChange"
    ></alert-config>
    <collector-config
      slot="collectorConfig"
      :trade="this.trade"
      :protocols="this.$store.state.datapath.protocols ? this.$store.state.datapath.protocols : {}"
      :servers="this.$store.state.datapath.servers ? this.$store.state.datapath.servers[0] : {}"
      @collectorChange="collectorChange"
    ></collector-config>
    <schedule-config
      slot="scheduleConfig"
      :node="node"
      :schedule="this.schedule"
      @scheduleChange="scheduleChange"
    ></schedule-config>
  </config-box>
</template>

<script>
  import _ from 'lodash';
  import { serverNode } from '@/helpers/nodeObject';
  import { checkError } from '@/helpers/configValidate';
  import configBox from '@/components/common/ConfigBox';
  import receiveConfig from './ReceiveConfig';
  import alertConfig from './AlertConfig';
  import collectorConfig from './CollectorConfig';
  import scheduleConfig from './ScheduleConfig';

  export default {
    name: 'target-config',
    components: {
      configBox,
      receiveConfig,
      alertConfig,
      collectorConfig,
      scheduleConfig,
    },
    props: {
      node: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        tabs: [
          { id: 'receiveConfig', text: '接收配置' },
          { id: 'alertConfig', text: '告警配置' },
          { id: 'collectorConfig', text: '采集器配置' },
          { id: 'scheduleConfig', text: '交易日程' },
        ],
        active: 0,
        errors: [],
        ipObj: {},
        schedule: this.dealSchedule(),
        isClear: false,
      };
    },
    watch: {
      node() {
        this.schedule = this.dealSchedule();
      },
    },
    computed: {
      trade() {
        const node = this.node;
        if (_.has(node, 'levelNum')) {
          this.isClear = false;
          const obj = _.find(this.$store.state.datapath.datapath.trade, item => item.settings.name === node.levelNum);
          return obj ? _.cloneDeep(obj) : _.cloneDeep(serverNode);
        }
        this.isClear = true;
        return _.cloneDeep(serverNode);
      },
      isRight() {
        return this.errors.length === 0;
      },
    },
    methods: {
      dealSchedule() {
        const schedule = {
          switch: 'off',
          intf_name: `intf${this.node.intf}`,
          schedule: [],
        };
        if (_.has(this.node, 'levelNum')) {
          const newSchedule = _.find(this.$store.state.schedule, d => d.intf_name === `intf${this.node.intf}`);
          if (newSchedule) {
            return newSchedule;
          }
          return schedule;
        }
        return schedule;
      },
      receiveChange(data) {
        this.ipObj = data.ipObj;
        this.trade.settings.filter.dst_ip_list = data.ipList.map(d => d.ip);
        this.trade.settings.filter.dst_ip_device = data.ipList;
        this.trade.settings.filter.dst_ip_addr = data.monitorList;
        this.trade.settings.link = data.currentMode;
        this.errorChange(data.isRight, 'receiveConfig');
      },
      alertChange(data) {
        this.trade.alarmrules = _.cloneDeep(data.alarmrules);
        this.errorChange(data.isRight, 'alertConfig');
      },
      collectorChange(data) {
//        const [is_double_live,correlated_group_name,is_twoway_trade,is_master,is_slave,correlated_trade_group_name] = data.settings;
        this.trade.collector = _.cloneDeep(data.collector);
        this.trade.settings.is_double_live = data.settings.is_double_live;
        this.trade.settings.correlated_group_name = data.settings.correlated_group_name;
        this.trade.settings.is_twoway_trade = data.settings.is_twoway_trade;
        this.trade.settings.is_master = data.settings.is_master;
        this.trade.settings.is_slave = data.settings.is_slave;
        this.trade.settings.correlated_trade_group_name = data.settings.correlated_trade_group_name;
        this.errorChange(data.isRight, 'collectorConfig');
      },
      errorChange(bool, id) {
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
      scheduleChange(data) {
        this.schedule = _.cloneDeep(data.schedule);
      },
      saveConfig() {
        if (this.isRight) {
          const tradeIndex = _.findIndex(this.$store.state.datapath.datapath.trade, d => d.settings.name === this.node.levelNum);
          const scheduleIndex = _.findIndex(this.$store.state.schedule, d => d.intf_name === `intf${this.node.intf}`);
          this.$set(this.$store.state.datapath.datapath.trade, tradeIndex, _.cloneDeep(this.trade));
          if (scheduleIndex === -1) {
            this.$store.state.schedule.push(_.cloneDeep(this.schedule));
          } else {
//            测试直接修改state数组中对象某字段是否成功 结论：成功
//            this.$set(this.$store.state.schedule[scheduleIndex], 'intf_name', true);
            this.$set(this.$store.state.schedule, scheduleIndex, _.cloneDeep(this.schedule));
          }
          this.$store.state.ipObj = _.cloneDeep(this.ipObj);
          this.$store.dispatch('changeNodeError', { node: this.node, isError: false });
          this.closeConfig();
        }
      },
      closeConfig() {
        this.clear();
        this.$store.dispatch('hideTargetConfig');
      },
      clear() {
        this.errors = [];
        Array.from(this.$el.querySelectorAll('.error-input')).forEach(item => checkError({ bool: true }, item));
      },
    },
  };
</script>

<style scoped>
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
