<template>
  <ul>
    <li v-for="(key, index) in levelkeys" :key="index">
      级别{{ index + 1 }}:  {{ levelNames[index] }}
      <img class="cutoff-rule" :src="require(`../../../assets/alertManage/${cutoffName(index)}.png`)">
      达到基线值  且  连续告警次数>=  {{ data[key] }}  次
    </li>
  </ul>
</template>
<script>
import { levelNames } from '../utils';

export default {
  name: 'UpgradeStrategyDetail',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      levelNames,
    };
  },
  computed: {
    levelkeys() {
      return Object.keys(this.data);
    },
  },
  methods: {
    cutoffName(index) {
      const len = this.levelkeys.length;
      let name = 'step_common_3';
      if (len === 1) {
        name = 'step_first_3';
      } else if (index === 0) {
        name = 'step_first_2';
      } else if ((index + 1) === len) {
        name = 'step_last_2';
      }
      return name;
    },
  },
};
</script>
<style lang="scss" scoped>
 img{
    vertical-align: -14px;
  }
</style>
