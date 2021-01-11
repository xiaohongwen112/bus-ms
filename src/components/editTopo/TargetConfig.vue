<template>
  <ConfigBox :tabs="tabs" :errors="errors" :active="active"
  class="targetconfig-wrap"
  @saveConfig="saveConfig" @closeConfig="closeConfig"
  @changeNav="changeNav"
  >
    <ReceiveConfig
      slot="receiveConfig"
      :isClear="isClear"
      :settings="trade.settings"
      :ipObj="$store.state.ipObj"
      class="ip-container"
      @receiveChange="receiveChange"
      ref="recieve"
    />
    <!-- <AlertConfig
      slot="alertConfig"
      :alarmrules="trade.alarmrules"
      class="ip-container"
      @alertChange="alertChange"
      ref="alert"
    /> -->
    <ModalTemplateEdit
      slot="newAlertConfig"
      :data="trade"
      @change="alertEditChange"
      ref="alertEdit"
    />
    <FaultDispatch slot="faultConfig" 
      :data="trade.alarmrules.whereabouts"
      ref="faultConfig"
      @change="faultConfigChange"
    />
    <CollectorConfig
      slot="collectorConfig"
      :trade="trade"
      :protocols="$store.state.datapath.protocols ? $store.state.datapath.protocols : {}"
      :servers="$store.state.datapath.servers"
      @collectorChange="collectorChange"
      ref="collector"
    />
    <!--<ScheduleConfig
      slot="scheduleConfig"
      :schedule="schedule"
      @scheduleChange="scheduleChange"
      ref="schedule"
    />-->
    <TradeConfig
      slot="tradeConfig"
      ref="trade"
      v-model="bizData"
    />
  </ConfigBox>
</template>

<script>

  /* eslint-disable no-unused-vars */

  import _ from 'lodash';
  // import { mapState } from 'vuex';
  import { serverNode } from '@/helpers/nodeObject';
  import { checkError } from '@/helpers/configValidate';
  import ConfigBox from '@/components/common/ConfigBox';
  import ReceiveConfig from './ReceiveConfig';
  import AlertConfig from './AlertConfig';
  import ModalTemplateEdit from './ModalTemplateEdit';
  import FaultDispatch from './FaultDispatch';
  import CollectorConfig from './CollectorConfig';
  // import ScheduleConfig from './ScheduleConfig';
  import TradeConfig from './TradeConfig';

  export default {
    name: 'target-config',
    components: {
      ConfigBox,
      ReceiveConfig,
      AlertConfig,
      ModalTemplateEdit,
      FaultDispatch,
      CollectorConfig,
      // ScheduleConfig,
      TradeConfig,
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
          { id: 'receiveConfig', text: '① 接收配置' },
          // { id: 'alertConfig', text: '② 告警配置' },
          { id: 'newAlertConfig', text: '② 告警配置' },
          { id: 'faultConfig', text: '③ 故障分发' },
          { id: 'collectorConfig', text: '④ 采集器配置' },
          // { id: 'scheduleConfig', text: '④ 交易日程' },
          { id: 'tradeConfig', text: '⑤ 业务日程' },
        ],
        active: 0,
        activeId: 'receiveConfig',
        errors: [],
        ipObj: {},
        schedule: this.getSchedule(),
        isClear: false,
        trade: this.getTrade(),
        bizData: { business: { week: [0], ts_start: 0, ts_end: 1440 }, alert: [] },
      };
    },
    watch: {
      node(val) {
        this.schedule = this.getSchedule();
        this.trade = this.getTrade();
        if (_.has(val, 'intf')) {
          this.bizData = _.cloneDeep(this.$store.state.biz[`intf${this.$store.state.currentNode.intf}`]);
        }
      },
    },
    computed: {
      // ...mapState({
      //   bizData: state => state.biz[`intf${state.currentNode.intf}`],
      // }),
      allValid() {
        return this.errors.length === 0;
      },
    },
    methods: {
      changeNav(res) {
        this.activeId = res.id;
      },
      getTrade() {
        const node = this.node;
        if (_.has(node, 'levelNum')) {
          this.isClear = false;
          const obj = _.find(this.$store.state.datapath.datapath.trade, item => item.settings.name === node.levelNum);
          return obj ? _.cloneDeep(obj) : _.cloneDeep(serverNode);
        }
        this.isClear = true;
        return _.cloneDeep(serverNode);
      },
      getSchedule() {
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
      receiveChange({ isValid }) {
        this.changeErrors(isValid, 'receiveConfig');
      },
      // alertChange({ isValid }) {
      //   this.changeErrors(isValid, 'alertConfig');
      // },
      alertEditChange({ isValid }) {
        this.changeErrors(isValid, 'newAlertConfig');
      },
      faultConfigChange(data) {
        console.log('故障分发', data);
      },
      collectorChange({ isValid }) {
        this.changeErrors(isValid, 'collectorConfig');
      },
      // scheduleChange(data) {
      // },
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
      getAllData() {
        const recieveData = _.cloneDeep(this.$refs.recieve.$data);
        const alertData = _.cloneDeep(this.$refs.alertEdit.$data.curData);
        const defaultData = _.cloneDeep(this.$refs.faultConfig.dispatchConfig);
        const collectorData = _.cloneDeep(this.$refs.collector.$data);
        return {
          recieveData, alertData, defaultData, collectorData,
        };
      },
      saveConfig() {
        const {
          recieveData, alertData, defaultData, collectorData,
        } = this.getAllData();
        if (this.allValid) {
          const tradeIndex = _.findIndex(
            this.$store.state.datapath.datapath.trade,
            d => d.settings.name === this.node.levelNum,
          );
          const trade = _.cloneDeep(this.$store.state.datapath.datapath.trade[tradeIndex]);
          trade.alarmrules = alertData.alarmrules;
          trade.alarmrules.whereabouts = defaultData;
          trade.settings.filter.dst_ip_list = recieveData.ipList.map(d => d.ip);
          trade.settings.filter.dst_ports = recieveData.portList;
          trade.settings.filter.dst_ip_device = recieveData.ipList;
          trade.settings.filter.dst_ip_addr = recieveData.monitorList;
          trade.settings.link = recieveData.currentMode;

          trade.collector = [collectorData.newCollector];
          trade.settings.is_double_live = collectorData.newSettings.is_double_live;
          trade.settings.correlated_group_name = collectorData.newSettings.correlated_group_name;
          trade.settings.is_twoway_trade = collectorData.newSettings.is_twoway_trade;
          trade.settings.is_master = collectorData.newSettings.is_master;
          trade.settings.is_slave = collectorData.newSettings.is_slave;
          trade.settings.correlated_trade_group_name = collectorData.newSettings.correlated_trade_group_name;

          // console.log('trade', trade);
          this.$set(
            this.$store.state.datapath.datapath.trade,
            tradeIndex,
            trade,
          );
          // this.$store.commit('UPDATE_TARGET', {
          //   node: trade,
          //   newMonitor: recieveData.newMonitor,
          // });
          this.$store.commit('UPDATE_MONITOR', {
            monitors: recieveData.newMonitor,
          });
          // if (scheduleIndex === -1) {
          //   this.$store.state.schedule.push(_.cloneDeep(scheduleData));
          // } else {
          //   //  测试直接修改state数组中对象某字段是否成功 结论：成功
          //   //  this.$set(this.$store.state.schedule[scheduleIndex], 'intf_name', true);
          //   this.$set(this.$store.state.schedule, scheduleIndex, _.cloneDeep(scheduleData));
          // }
          this.$store.state.ipObj = _.cloneDeep(recieveData.newIpObj);
          this.$store.dispatch('changeNodeError', { node: this.node, isError: false });
          this.$store.commit('SET_AIP', { data: this.$store.state.ipObj });
          this.$store.commit('SET_BIZ', { intfId: this.$store.state.currentNode.intf, data: this.bizData });
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
      changeTrade() {},
    },
    mounted() {
      // bizData: state => state.biz[`intf${state.currentNode.intf}`]
    },
  };
</script>

<style lang="scss">
/* 覆盖本地样式 */
.monitor-list-div{
  margin-top: -35px;
}

.targetconfig-wrap.config-container .content .nav-content>div:first-of-type {
    padding-left: 0;
    padding-right: 0
}
</style>

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
