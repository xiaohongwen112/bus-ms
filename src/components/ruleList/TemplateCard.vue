<template>
  <div class="template-card">
    <div class="card-header">
      <input placeholder="请为模板命名" v-model="name" @change="nameEdit">
      <div class="ctrls">
        <button class="edit ctrl-icon" @click="onClickEdit"></button>
        <button class="setting ctrl-icon" @click="onClickSetting"></button>
        <button class="remove ctrl-icon" @click="onClickRemove"></button>
      </div>
    </div>
    <div class="card-content">
      <table>
        <tr>
          <td>健康度：</td>
          <td>{{healthData.duration}}</td>
          <td>{{healthData.limit}}</td>
          <td>{{healthData.hold}}</td>
        </tr>
        <tr>
          <td>基线告警：</td>
          <td>成功率</td>
          <td>{{baselineData.succRate}}</td>
          <td>{{baselineData.succRateTime}}</td>
        </tr>
        <tr>
          <td></td>
          <td>响应时间</td>
          <td>{{baselineData.succDuration}}</td>
          <td>{{baselineData.succDurationTime}}</td>
        </tr>
        <tr>
          <td></td>
          <td>交易量</td>
          <td>{{baselineData.transCount}}</td>
          <td>{{baselineData.transCountTime}}</td>
        </tr>
        <tr>
          <td></td>
          <td>返回码</td>
          <td>{{returnCode}}</td>
          <td></td>
        </tr>
        <tr>
          <td>阈值告警：</td>
          <td>交易量</td>
          <td>{{thresholdData.transCountUp}}</td>
          <td>{{thresholdData.transCountUpTime}}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>{{thresholdData.transCountDown}}</td>
          <td>{{thresholdData.transCountDownTime}}</td>
        </tr>
        <tr>
          <td></td>
          <td colspan="2">无交易请求</td>
          <td>{{thresholdData.noReqTime}}</td>
        </tr>
        <tr>
          <td></td>
          <td>成功率</td>
          <td>{{thresholdData.succRate}}</td>
          <td>{{thresholdData.succRateTime}}</td>
        </tr>
        <tr>
          <td></td>
          <td>响应时间</td>
          <td>{{thresholdData.duration}}</td>
          <td>{{thresholdData.durationTime}}</td>
        </tr>
        <tr>
          <td></td>
          <td>响应率</td>
          <td>{{thresholdData.resRate}}</td>
          <td>{{thresholdData.resRateTime}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>

import _ from 'lodash';

import { ruleInstance } from '@/pages/ruleList/utils';

const props = {
  rule: {
    type: Object,
    default: ruleInstance(),
  },
};

export default {
  name: 'template-card',
  props,
  data() {
    return {
      name: this.rule.name || '',
    };
  },
  computed: {
    healthData() {
      const { health } = this.rule;
      return {
        duration: ((health.on && health.duration) ? (`${health.duration}ms`) : '--'),
        limit: health.on ? (`低于${health.health_set}%`) : ('--'),
        hold: `${health.ts_hold ? (health.ts_hold) : '--'}min`,
      };
    },
    baselineData() {
      const { baseline } = this.rule;
      return {
        succRate: `${baseline.succ_rate.up && (`高于${baseline.succ_rate.up}%`) || '--'},${(baseline.succ_rate.down && (`低于${baseline.succ_rate.down}%`)) || '--'}`,
        succRateTime: `${(baseline.succ_rate.time && baseline.succ_rate.time) || '--'}min`,
        succDuration: `${baseline.duration.up && (`高于${baseline.duration.up}ms`) || '--'},${baseline.duration.down && (`低于${baseline.duration.down}ms`) || '--'}`,
        succDurationTime: `${baseline.duration.time && (baseline.duration.time) || '--'}min`,
        transCount: `${baseline.trans_count.up && (`高于${baseline.trans_count.up}`) || '--'},${baseline.trans_count.down && (`低于${baseline.trans_count.down}`) || '--'}`,
        transCountTime: `${baseline.trans_count.time || '--'}min`,
      };
    },
    returnCode() {
      const { return_code } = this.rule;
      return return_code.val || '--';
    },
    thresholdData() {
      const { threshold } = this.rule;
      return {
        transCountUp: ((threshold.trans_count.up.value && (`高于${threshold.trans_count.up.value}`)) || '--'),
        transCountUpTime: `${threshold.trans_count.up.time || '--'}min`,
        transCountDown: ((threshold.trans_count.down.value && (`低于${threshold.trans_count.down.value}`)) || '--'),
        transCountDownTime: `${threshold.trans_count.down.time || '--'}min`,
        noReqTime: `${threshold.no_req.time || '--'}min`,
        succRate: (threshold.succ_rate.down.value && (`低于${threshold.succ_rate.down.value}%`)) || '--',
        succRateTime: `${threshold.succ_rate.down.time || '--'}min`,
        duration: (threshold.duration.up.value && (`高于${threshold.duration.up.value}ms`)) || '--',
        durationTime: `${threshold.duration.up.time || '--'}min`,
        resRate: (threshold.rr_rate.down.value && (`低于${threshold.rr_rate.down.value}%`)) || '--',
        resRateTime: `${threshold.rr_rate.down.time || '--'}min`,
      };
    },
  },
  methods: {
    onClickEdit() {
      this.$emit('edit', this.rule);
    },
    onClickSetting() {
      this.$emit('setting', this.rule);
    },
    onClickRemove() {
      this.$emit('remove', this.rule);
    },
    nameEdit() {
      const rule = _.cloneDeep(this.rule);
      rule.name = this.name;
      this.$emit('editName', rule);
    },
  },
  mounted() {
    // eslint-disable-next-line
    window.d3.select(this.$el).selectAll('td').each(function () {
      if (this.scrollWidth > this.offsetWidth) {
        window.show_msgs(window.d3.select(this), this.innerHTML, 'top', true);
      }
    });
  },
};
</script>
<style lang="scss" scoped>

.template-card {
  float: left;
  width: 300px;
  height: 380px;
  background: #031826;
  color: rgb(0,223,244);
  margin: 0 10px 10px 10px;
  border-radius: 5px;
  box-shadow: 1px 1px 15px #020B12;
  box-sizing: border-box;

  .card-header {
    background: #0e2e44;
    overflow: hidden;
    height: 38px;
    line-height: 38px;
    border-bottom: 1px solid #133e5a;

    input {
      color: white;
      position: relative;
      left: 5px;
      text-align: center;
      height: 30px;
      width: 210px;
      border: none;
      background-color: #031826;
    }

    div.ctrls {
      position: relative;
      float: right;
      height: 39px;
      line-height: 39px;
      padding-top: 4px;
      margin-left: 5px;

      button {
        height: 16px;
        width: 15px;
        margin: 0 5px 0 0;
        border: none;

        &.edit {
          background: url(../../assets/ruleList/editTemplate.png) no-repeat;
        }

        &.setting {
          background: url(../../assets/ruleList/setTemplate.png) no-repeat;
        }

        &.remove {
          background: url(../../assets/ruleList/deleteTemplate.png) no-repeat;
        }
      }
    }
  }

  .card-content {
    margin: 10px 12px;
    overflow-x: hidden;
    overflow-y: auto;
    height: 320px;

    table {
      width: 100%;
      font-size: 12px;

      tr {
        height: 28px;

        td {
          max-width: 70px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          &:first-child {
            text-align: right;
          }
        }
      }
    }
  }
}

</style>

