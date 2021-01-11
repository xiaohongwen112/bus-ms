<template>
  <div class="index-quota">
    <PerQuota
      :title="`当前交易量`"
      :value="data.transcount_current === undefined ? 0 : (current.value !== null && current.value !== 'null') ? Number(current.value) : '--'"
      :unit="data.transcount_current !== undefined ? current.unit : '笔'"/>
    <PerQuota
      :title="`当日总交易量`"
      :value="data.transcount_day !== undefined ? Number(day.value): 0"
      :unit="data.transcount_day !== undefined ? day.unit: '笔'"/>
    <PerQuota
      :title="`当日成功率`"
      :value="Number(succRate)"
      :unit="`%`"/>
  </div>
</template>

<script>

  import { formatTransCount, formatNum } from '@/helpers/utils';
  import PerQuota from './PerQuota';

  export default {
    name: 'index-quota',
    components: {
      PerQuota,
    },
    props: {
      data: {
        type: Object,
        default() {
          return {
            succrate_day: 0,
            transcount_current: 0,
            transcount_day: 0,
          };
        },
      },
    },
    data() {
      return {};
    },
    watch: {},
    computed: {
      current() {
        return formatTransCount(this.data.transcount_current);
      },
      day() {
        return formatTransCount(this.data.transcount_day);
      },
      succRate() {
        return formatNum(this.data.succrate_day);
      },
    },
    methods: {},
  };
</script>

<style lang="scss" scoped>
.index-quota{
  width: 100%;
  height: 112px;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media (max-height: 700px) {
  .index-quota{
    height: 65px;
  }
}
</style>
