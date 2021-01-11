<template>
  <div class="per-quota">
    <div class="per-quota-title">{{ title }}</div>
    <div class="per-quota-content">
      <span class="per-quota-val">{{ value }}</span>
      <span class="per-quota-unit">{{ unit }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'per-quota',
    props: {
      title: {
        type: String,
        default: '',
      },
      value: {
        type: Number,
        default: 0,
      },
      unit: {
        type: String,
        default: '',
      },
    },
    data() {
      return {};
    },
    watch: {},
    computed: {},
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .per-quota{
    height: auto!important;
    width: 33%;
    text-align: center;

    .per-quota-val{
      font-size: 26px;
      color: #bceb11;
      margin-right: 5px;
    }

    .per-quota-unit{
      font-size: 12px;
      color: #eee;
    }
  }

</style>
