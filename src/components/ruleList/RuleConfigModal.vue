<template>
  <ConfigBox class="rlueconfig-wrap"
    :tabs="tabs"
    :errors="errors"
    :active="active"
    @saveConfig="saveConfig"
    @closeConfig="closeConfig"
    :width="1280"
    :height="500"
  >
    <div slot="default" class="rule-modal-content">
      <div v-if="nodeInfo" class="node-info">
      </div>
      <!-- <AlertConfig
        :alarmrules="data"
        class="scroll-area"
        @alertChange="() => ({})"
        ref="alert"
      /> -->
    </div>
    <ModalTemplateEdit
      slot="newAlertConfig"
      :data="trade"
      @change="alertEditChange"
      ref="alertEdit"
    />
    <FaultDispatch slot="faultConfig" class="faultdispatch-box"
      :data="trade.alarmrules.whereabouts"
      ref="faultConfig"
      @change="faultConfigChange"
    />
    <collectorConfig slot="collectorConfig"
      :trade="trade"
      :protocols="this.trades[0].protocols ? this.trades[0].protocols : {}"
      :servers="this.trades[0].servers ? this.trades[0].servers[0] : {}"
      @collectorChange="collectorChange"
      ref="collector"
    />
  </ConfigBox>
</template>
<script>

import _ from 'lodash';
import ConfigBox from '@/components/common/ConfigBox';
import ScrollBar from '@/components/common/ScrollBar';
import AlertConfig from '@/components/editTopo/AlertConfig';
import ModalTemplateEdit from '@/components/editTopo/ModalTemplateEdit';
import FaultDispatch from '@/components/editTopo/FaultDispatch';
import collectorConfig from '@/components/editTopo/CollectorConfig';
import { validatePercent, validateCode, validateMs, validateCount, checkError } from '@/helpers/configValidate';
import { ruleInstance } from '@/pages/ruleList/utils';
import { serverNode } from '@/helpers/nodeObject';

const props = {
  rule: {
    type: Object,
    default: () => ruleInstance(),
  },
  nodeInfo: {
    type: Object,
    default: null,
  },
  trades: {
    type: Array,
    default: null,
  },
};

export default {
  name: 'rule-config-modal',
  props,
  components: {
    ConfigBox,
    ScrollBar,
    AlertConfig,
    ModalTemplateEdit,
    FaultDispatch,
    collectorConfig,
  },
  data() {
    return {
      trade: serverNode,
      tabs: [
      // { id: 'default', text: '告警配置' },
      { id: 'newAlertConfig', text: '告警配置' },
      { id: 'faultConfig', text: '故障分发' },
      { id: 'collectorConfig', text: '采集器配置' }], // 规则列表点击每行出现的弹框
      active: 0,
      errors: [],
      data: _.cloneDeep(this.rule || ruleInstance()),
    };
  },
  methods: {
    saveConfig() {
      // const data = this.$refs.alertEdit.$data.ruleData.rules;
      const data = this.$refs.alertEdit.$data.curData.alarmrules;
      const defaultData = _.cloneDeep(this.$refs.faultConfig.dispatchConfig);
      const trade = this.$refs.collector.$data.newCollector;
      const setTings = this.$refs.collector.$data.newSettings;
      const hasError = this.$el.querySelectorAll('.error-input').length > 0;
      if (hasError || this.errors.length > 0) return;
      this.$emit('save', this.formatOutput(data, defaultData, trade, setTings), this.nodeInfo, false, true);
      this.closeConfig();
    },
    getTrade(tradeD) {
      const retTrade = [];
      const nodeInfoNa = this.nodeInfo.node;
      const whichApp = this.nodeInfo.app;
      const traDeChooce = [];
      tradeD.forEach((item, index) => {
        if (tradeD[index].datapath.name === whichApp) {
          traDeChooce.push(tradeD[index]);
        }
      });
      const traDe = traDeChooce[0].datapath.trade;
      traDe.forEach((item, index) => {
        if (traDe[index].settings !== undefined) {
          if (traDe[index].settings.name === nodeInfoNa) {
            retTrade.push(traDe[index]);
          }
        }
      });
      return retTrade[0];
    },
    closeConfig() {
      this.$emit('close');
    },
    formatOutput(data, defaultData, trade, setTings) {
      const ar = [];
      // alarmrules
      const r = _.cloneDeep(data);
      r.whereabouts = _.cloneDeep(defaultData);
      const ra = _.cloneDeep(trade);
      const raset = _.cloneDeep(setTings);
      // console.log(trade);
      if (!r.return_code.on) r.return_code.val = null;
      if (!r.health.on) {
        r.health.duration = null;
        r.health.health_set = null;
      }
      if (!r.threshold.duration.on) r.threshold.duration.up.value = null;
      if (!r.threshold.trans_count.on) {
        r.threshold.trans_count.down.value = null;
        r.threshold.trans_count.up.value = null;
      }
      if (!r.threshold.succ_rate.on) r.threshold.succ_rate.down.value = null;
      if (!r.threshold.rr_rate.on) r.threshold.rr_rate.down.value = null;
      if (!r.baseline.duration.on) {
        r.baseline.duration.down = null;
        r.baseline.duration.up = null;
      }
      if (!r.baseline.trans_count) {
        r.baseline.trans_count.up = null;
        r.baseline.trans_count.down = null;
      }
      if (!r.baseline.succ_rate.on) {
        r.baseline.succ_rate.up = null;
        r.baseline.succ_rate.down = null;
      }
      ar.push(r);
      ar.push(ra);
      ar.push(raset);
      return ar;
    },
    validate(ev, type, isNull) {
      let res = {};
      const val = ev.target.value;
      switch (type) {
        case 'ms': res = validateMs(val, isNull);
          break;
        case 'percent': res = validatePercent(val);
          break;
        case 'code': res = validateCode(val);
          break;
        case 'count': res = validateCount(val);
          break;
        default: res = {
          bool: true,
          tip: '',
        };
      }
      checkError(res, ev.target);
    },
    alertEditChange({ isValid }) {
      this.changeErrors(isValid, 'newAlertConfig');
    },
    faultConfigChange(data) {
      console.log('故障分发', data);
    },
    collectorChange({ isValid }) {
      // console.log(isValid);
      this.changeErrors(isValid, 'collectorConfig');
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
    validateRow(e) {
      const isChecked = e.target.checked;
      const _parent = e.target.closest('.setting-row');
      const children = [..._parent.querySelectorAll('input[type="text"]')];
      if (_parent === this.$refs.transCountRow) {
        children.push(this.$refs.transCountRowDown);
      }
      _.forEach(children, (d) => {
        if (isChecked) {
          if (d.value === '') {
            checkError({ bool: false, tip: '不可为空' }, d);
          }
        } else {
          if (Array.from(d.classList).indexOf('error-input') > -1 && d.value === '') {
            checkError({ bool: true }, d);
          }
        }
      });
    },
  },
  mounted() {
    this.trade = this.getTrade(this.trades);
  },
};
</script>
<style lang="scss">
.config-container.rlueconfig-wrap{
  .nav-content{
      width: 1186px !important;
  }
  .input-name{
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: 700;
  }
  .alert-edit{
    height: auto;
  }
}

.rlueconfig-wrap.config-container .content .nav-content>div:first-of-type {
    padding-left: 0;
    padding-right: 0
}
</style>
<style lang="scss" scoped>

* {
  box-sizing: border-box;
}

.node-info {
  display: flex;
  justify-content: flex-start;
  margin: 0 20px 20px 20px;

  sup {
    color: red;
  }

  input[type="text"] {
    width: 60%;
    max-width: 200px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.rule-modal-content {
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 10px 0;
}

label {
  font-weight: normal;
  margin: 0;
}

input[type="checkbox"] {
  border: 1px solid #2c9e95;
  appearance: none;
  width: 18px;
  height: 18px;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 3px;
  margin: 0 5px 0;
  background: #0b2537;
}

input[type="checkbox"]:checked {
  background: #2C9D97 url(../../assets/topo-nav/input-checked.svg);
}

input[type="text"] {
  appearance: none;
  background: rgb(10,31,48);
  border: 0 !important;
  height: 25px;
  width: 100px;
  color: #fff;
  font-size: 14px;
  margin: 0 3px;
}

.margin-left-1 {
  margin-left: 28px;
}

.margin-left-2 {
  margin-left: 57px;
}

.setting-row.sp-row {
  padding-left: 113px !important;
  
  >label {
    margin-right: 140px;
  }
}

select {
  height: 25px;
  border: none;
  background: #0A1F30;
  color: #fff;
  text-align-last: center;
  margin: 0 5px;
  line-height: 22px;
  background: url(../../assets/sys-icon/arrow-w.svg) no-repeat calc(100% - 5px) 0% rgb(10,31,48) !important;
  padding-right: 18px;
}

.flex-head-1 {
  flex-basis: 190px;
  flex-shrink: 0;
  font-size: 18px;
  color: white;
}

.flex-head-2 {
  flex-basis: 160px;
  flex-shrink: 0;
}

.flex-head-3 {
  flex-basis: 400px;
  flex-shrink: 0;
  display: flex;
}

.flex-head-4 {
  flex-basis: 140px;
  flex-shrink: 0;
}

.warn-title {
  display: inline-block;
  width: 10px;
  height: 14px;
  position: relative;
  top: 2px;
  margin-right: 10px;
  background: linear-gradient(left, #22726F, #3AB9B3);
  background: -webkit-linear-gradient(left, #22726F, #3AB9B3);
}

div.settings{
  display: flex;
  flex-direction: column;
  width: 100%;

  div.setting-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 7px 0;

    &.disabled {
      color: #3d5665;

      input[type="text"], select {
        color: #3d5665;
      }
    }
  }
}

.health-1 {
  flex-basis: 210px;
  flex-shrink: 0;
  font-size: 12px;
}

.health-2 {
  font-size: 12px;
  flex-basis: 200px;
  flex-shrink: 0;
}

.flex-tab-col {
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  width: 100%;
  padding-left: 200px;
}

span {
  line-height: 25px;
}

// @media screen and (max-width: 1280px), screen and (max-height: 720px){
  input[type="text"]{
      width: 50px;
  }
  .flex-head-1{
    flex-basis: 120px;
    flex-shrink:0;
  }
  .flex-head-2{
      flex-basis: 90px;
      flex-shrink:0;
  }
  .flex-head-3{
      flex-basis: 305px;
      flex-shrink:0;
  }
  .flex-head-4{
      flex-basis: 140px;
      flex-shrink:0;
  }
  .bodyFlex1{
      flex-basis: 90px;
      flex-shrink:0;
  }
  .bodyFlex2{
      flex-basis: 290px;
      flex-shrink:0;
  }
  .bodyFlex3{
      flex-basis: 130px;
      flex-shrink:0;
  }
  .returnFlex1{
      flex-basis: 146px;
      flex-shrink:0;
  }
  .noRespFlex {
      flex-basis: 395px;
      flex-shrink:0;
  }
  .flex-tab-col {
    padding-left: 120px;
  }
  .warnTradeFlex{
    padding-left: 90px;
  }
  .tab_content_2 input{
      width:50px;
  }
  .baseTradeShow{
      padding-left: 0;
  }
  .baseLineSpanMargin1{
      margin-left: 28px;
  }
  .baseLineSpanMargin2{
      margin-left: 57px;
  } 
  .warn-title{
      right: 0;
  }
  .health-1{
    flex-basis: 167px;
    font-size: 12px;
  }
  .mav-content{
      padding: 30px 40px 0;
  }
// }

input.error-input{
  border:1px solid red!important;
}

</style>
