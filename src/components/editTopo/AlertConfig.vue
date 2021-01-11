<template>
  <ScrollBar class="alert-container">
    <div class="alert-type">
      <div class="alert-row1">
        <span class="alert-name-tip"></span>
        <span class="alert-name">健康度告警</span>
      </div>
      <div class="alert-row4" :class="{ 'collapse-tit' : collapseBaseline }">
        <span class="alert-name-tip"></span>
        <span class="alert-name">基线告警</span>
        <span class="triangle-icon" :class="{ 'alert-spread' : !collapseBaseline }" @click="collapseBaseline = !collapseBaseline">▶</span>
      </div>
      <div class="alert-row1">
        <span class="alert-name-tip"></span>
        <span class="alert-name">返回码告警</span>
      </div>
    </div>
    <div class="alert-content">
      <div class="alert-row health-alert">
        <AlertConfigRow
          :pRule="ruleData.health"
          @change="change('health', $event)"
        />
      </div>
      <div class="spread-div-baseline" :class="{ 'collapse-div': collapseBaseline }">
        <AlertConfigRow
          :pRule="ruleData.trans_count"
          @change="change('trans_count', $event)"
        />
        <AlertConfigRow
          :pRule="ruleData.succ_rate"
          @change="change('succ_rate', $event)"
        />
        <AlertConfigRow
          :pRule="ruleData.duration"
          @change="change('duration', $event)"
        />
        <AlertConfigRow
          :pRule="ruleData.rr_rate"
          @change="change('rr_rate', $event)"
        />
      </div>
      <div class="return-code">
        <div class="item-2">返回特定码</div>
        <div class="item-3">
          <input type="checkbox"  @change="check($event)" v-model="ruleData.rules.return_code.on"/>
          <span>手动设置</span>
        </div>
        <div class="item-4" :class="{'alert-disabled': !ruleData.rules.return_code.on}">
          <input class="input-text"
           ref="returnCode"
           type="text" autocomplete="off" v-model="ruleData.rules.return_code.val" :disabled="!ruleData.rules.return_code.on"
           @input="validateCode($event, ruleData.rules.return_code.val)"
           @blur="validateCode($event, ruleData.rules.return_code.val)">
        </div>
      </div>
    </div>
  </ScrollBar>
</template>

<script>

import _ from 'lodash';
import ad from '@/helpers/alertAdapters';
import { checkError, validateCode, removeError } from '@/helpers/configValidate';

import ScrollBar from '@/components/common/ScrollBar';

import AlertConfigRow from './AlertConfigRow';
import undefined from '../../pages/protocol/utils';

export default {
  name: 'alert-config',
  props: {
    alarmrules: {
      type: Object,
      default() {
        return {};
      },
    },
    baseline: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    AlertConfigRow,
    ScrollBar,
  },
  data() {
    return {
      collapseBaseline: true,
      ruleData: this.initData(this.alarmrules),
    };
  },
  watch: {
    alarmrules: {
      handler(newV) {
        if (!_.isEqual(newV, this.ruleData.rules)) this.ruleData = this.initData(newV);
      },
      deep: true,
    },
  },
  methods: {
    check(e) {
      const { checked } = e.target;
      if (checked) {
        setTimeout(() => {
          e.target.parentElement.nextElementSibling.children[0].focus();
        }, 100);
      } else {
        Array.from(this.$el.children[1].children[2].querySelectorAll('.error-input')).forEach((ele) => {
          removeError(ele);
        });
        this.emit();
      }
    },
    initData(rule) {
      let baselineData;
      if (this.$store !== undefined) {
        if (this.$store.state.baselineData) baselineData = this.$store.state.baselineData;
        else {
          baselineData = _.cloneDeep(this.baseline);
        }
      } else {
        baselineData = _.cloneDeep(this.baseline);
      }
      return {
        rules: _.cloneDeep(rule),
        health: ad.health.db2view(rule.health, baselineData.health),
        trans_count: ad.trans_count.db2view(rule.threshold.trans_count, [baselineData.max_transcount, baselineData.min_transcount]),
        succ_rate: ad.succ_rate.db2view(rule.threshold.succ_rate, baselineData.succ_rate),
        duration: ad.duration.db2view(rule.threshold.duration, baselineData.duration),
        rr_rate: ad.rr_rate.db2view(rule.threshold.rr_rate, baselineData.rr_rate),
      };
    },
    change(k, v) {
      this.ruleData[k] = v;
      if (k === 'health') this.ruleData.rules.health = ad.health.view2db(v);
      else this.ruleData.rules.threshold[k] = ad[k].view2db(v);
      this.emit();
    },
    validateCode(e, val) {
      const vals = val === null ? '' : val;
      checkError(validateCode(vals), this.$refs.returnCode);
      this.emit();
    },
    emit() {
      this.$emit('alertChange', {
        alarmrules: this.ruleData.rules,
        isValid: this.validate(),
      });
    },
    validate() {
      return Array.from(this.$el.querySelectorAll('.error-input')).length === 0;
    },
  },
};
</script>

<style lang="scss" scoped>
  .alert-container{
    .alert-type,.alert-content{
      float: left;
    }
    .alert-type{
      width: 200px;
      font-size: 18px;

      .alert-row1 {
        height: 125px;
        padding-top: 7px;

        &:last-child {
          height: 80px;
        }
      }
      .alert-row4 {
        height: calc(128px * 4);
        padding-top: 7px;
        transition: height 0.5s;
      }
      .alert-row6{
        height: calc(40px * 6);
        padding-top: 7px;
        transition: height 0.5s;
      }
    }

    .alert-content{
      width: calc(100% - 250px);

      .spread-div-baseline {
        height: calc(130px * 4);
        transition: height 0.5s;
        overflow: hidden;
      }
     .spread-div-threshold  {
        height: 240px;
        transition: height 0.5s;
        overflow: hidden;
      }
    }
  }

  .alert-name-tip{
    display: inline-block;
    width: 10px;
    height: 14px;
    background: linear-gradient(left, #22726F, #3AB9B3);
    background: -webkit-gradient(linear, left top, right top, from(#22726F), to(#3AB9B3));
    filter: progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = #22726F, endColorstr = #3AB9B3);
  }

  .triangle-icon{
    transition: transform 100ms;
    font-size: 12px;
    color: #38BBB4;
    display: inline-block;
    cursor: pointer;
  }

  .alert-spread{
    transform: rotate(90deg);
    transition: rotate 0.5s;
  }

  .collapse-tit {
    height: 125px !important;
    overflow: hidden;
    transition: height 0.5s;
  }
  .collapse-div{
    height: 138px !important;
    overflow: hidden;
    transition: height 0.5s;
  }

  .health-alert input[type="text"]{
    width: 70px;
  }

  .threshold-down{
    margin-left: 33px;
  }

  .ellipsis{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .disabled-alert{
    color: #777777 !important;
  }

  .return-code {
    border-top: none;
    padding: 5px 0;
    display: flex !important;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    padding: 7px 0;


    .item-2 {
      flex-basis: 110px;
      flex-shrink: 0;
      font-size: 14px;
      color: #eee !important;
    }

    .item-3 {
      flex-basis: 160px;
      flex-shrink: 0;
      align-items: center;
    }

    .item-4 {
      flex-basis: 520px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    input:checked {
      background: #2c9d97 url(../../assets/topo-nav/input-checked.svg) 1px center;
      background-size: cover;
      margin: 0;
    }
    .input-text{
      line-height: 26px;
      border: 1px solid #2b4055;
      max-width: 260px;
      min-width: 30px;
      width: 110px;
      background: #0b2537;
    }
    .input-disabled, .alert-disabled input[type="text"]{
      color: rgb(119, 119, 119);
      border-color: rgb(43, 64, 85); 
    }
  }

</style>
<style>
  .error-input{
    border:1px solid red!important;
  }
</style>

