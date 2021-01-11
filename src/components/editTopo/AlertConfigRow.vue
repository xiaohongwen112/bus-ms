<template>
  <div class="alert-config-row">
    <div class="config-row" :class="{'disabled-alert': !rule.baseOn}">
      <div class="item-2">{{ rule.name }}</div>
      <div class="item-3">
        <input type="checkbox" @change="check('auto', $event)" :checked="rule.baseOn">
        <span>使用自动基线</span>
      </div>
      <div class="item-4 auto-baseline">
        <span>{{ rule.autoBaseline }}</span>
      </div>
    </div>
    <div class="config-row" :class="{'disabled-alert': !rule.on}">
      <div class="item-2"></div>
      <div class="item-3">
        <input type="checkbox" @change="check('hand', $event)" :checked="rule.on">
        <span class="">手动设置</span>
      </div>
      <div class="item-4">
        <InputFragment
          :spans="rule.spans"
          :inputs="rule.values"
          :inputDisabled="!rule.on"
          @blur="onValidate"
          @input="onValidate"
          :isNumber="true"
        />
      </div>
    </div>
    <div class="config-row" :class="{'disabled-alert': disabled}">
      <div class="item-2"></div>
      <div class="item-3">
        <span>告警延迟</span>
        <select class="alert-time" :disabled="disabled" :value="rule.time" @change="emit('time', $event)">
          <option v-for="(i, k) in timeRanges" :key="k" :value="i">{{i}}</option>
        </select>
        <span>分钟</span>
      </div>
    </div>
  </div>
</template>
<script>

import _ from 'lodash';

import { checkError, removeError } from '@/helpers/configValidate';

import InputFragment from '@/components/common/InputFragment';

const ruleInstance = {
  name: '',
  autoBaseline: '自动基线值：40%',
  on: false,
  baseOn: true,
  values: [{
    name: 'down',
    val: 1,
    validateFn: v => v > 1,
  }],
  time: 2,
};

const props = {
  pRule: {
    type: Object,
    default: () => (ruleInstance),
  },
};

export default {
  name: 'alert-config-row',
  props,
  components: {
    InputFragment,
  },
  data() {
    return {
      rule: _.cloneDeep(this.pRule),
      timeRanges: [1, 2, 3, 4, 5, 10, 15],
    };
  },
  computed: {
    disabled() {
      return !this.rule.on && !this.rule.baseOn;
    },
  },
  methods: {
    check(w, e) {
      const { checked } = e.target;
      if (w === 'auto') {
        if (checked) {
          this.rule.on = false;
          Array.from(this.$el.querySelectorAll('.error-input')).forEach((ele) => {
            removeError(ele);
          });
        }
        this.rule.baseOn = checked;
      } else if (w === 'hand') {
        if (checked) {
          const chlidFocus = e.target.parentElement.nextElementSibling.childNodes;
          setTimeout(() => {
            if (chlidFocus[3] !== undefined) chlidFocus[3].focus();
            setTimeout(() => {
              if (chlidFocus[1] !== undefined) chlidFocus[1].focus();
            }, 100);
          }, 100);
          this.rule.baseOn = false;
        } else {
          Array.from(this.$el.querySelectorAll('.error-input')).forEach((ele) => {
            removeError(ele);
          });
        }
        this.rule.on = checked;
      }
      this.emit();
    },
    onValidate(item, e, res) {
      let resTip = {
        bool: true,
        tip: '',
      };
      if ((_.isObject(res) && !res.bool) || !res) {
        resTip = {
          bool: false,
          tip: res.tip || '格式错误',
        };
      }
      checkError(resTip, e.target);
      this.$emit('error', true);
      this.emit();
    },
    emit(k, e) {
      if (k) this.rule[k] = e.target.value;
      this.$emit('change', this.rule);
    },
  },
  watch: {
    pRule: {
      handler(newV) {
        if (!_.isEqual(newV, this.rule)) this.rule = _.cloneDeep(newV);
      },
      deep: true,
    },
  },
};

</script>
<style lang="scss" scoped>

.alert-config-row {
  border-top: none;
  border-bottom: 1px solid #0b2439;
  padding: 5px 0;

  .config-row {
    display: flex !important;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    padding: 7px 0;

    &.disabled-alert {
      color: #777777 !important;
    }

    input[type="checkbox"] {
      height: 18px;
      vertical-align: middle;
      width: 18px;
      border: 1px solid #278c89 !important;
      margin: 0 4px;
      background: rgb(10,31,48);
      color: #fff;
      -webkit-appearance: none;

      &:checked {
        background: #2c9d97 url(../../assets/topo-nav/input-checked.svg) 1px center;
        background-size: cover;
      }
    }

    input[type="text"],
    select {
      height: 26px;
      line-height: 26px;
      border: 1px solid #2b4055;
      max-width: 260px;
      min-width: 30px;
      width: 110px;
      background: #0b2537;
    }

    select {
      width: 40px;
      color: #fff;
    }
  }

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

  .auto-baseline {
    color: #17c3e4;
  }

  .item-4 {
    flex-basis: 520px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
}
</style>


