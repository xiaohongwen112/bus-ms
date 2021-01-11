<template>
  <div class="baseline-item">
    <span class="baseline-name1">维度</span>
    <span class="baseline-name2">{{ data.name }}</span>
    <span class="baseline-name3">周期</span>
    <div v-if="parents === ''">
      <select class="baseline-select"  v-model="data.cycle" @change="change">
        <option class="baseline-option" v-for="(option, index) in valOptions"
          :key="`value-${index}`"
          :value="option.name"
        >{{ option.name }}</option>
      </select>
      <select class="baseline-select"  v-model="data.granularity">
        <option class="baseline-option" v-for="(option, index) in unitOptions"
          :key="`unit-${index}`"
          :value="option.key"
        >{{ option.name }}</option>
      </select>
    </div>
    <div v-else>
      <CmSelect :list="valOptions" :selectVal="data.cycle" :width="100" @on-change="changeTime"></CmSelect>
      <CmSelect :list="unitOptions" :selectVal="unitIndex[data.granularity]" :width="100" @on-change="changePeriod"></CmSelect>
    </div>
  </div>
</template>

<script>
import { CmSelect } from '@/components/basic';

export default {
  name: 'BaselineItem',
  components: { CmSelect },
  model: {
    prop: 'data',
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    parents: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      name: 'intf节点',
      valOptions: [{ name: 4, key: 4 }, { name: 6, key: 6 }, { name: 8, key: 8 }],
      unitOptions: [{ name: '分钟', key: 'minute' }, { name: '天', key: 'day' }, { name: '周', key: 'week' }, { name: '月', key: 'month' }],
      unitIndex: {
        minute: '分钟',
        day: '天',
        week: '周',
        month: '月',
      },
    };
  },
  methods: {
    change() {
      this.$emit('change', this.data);
    },
    changeTime(val) {
      this.$emit('changeTime', val);
    },
    changePeriod(val) {
      this.$emit('changePeriod', val);
    },
  },
};
</script>

<style lang="scss" scoped>
.baseline-item{
  >div{
    display:inline-block;
  }
}
</style>

