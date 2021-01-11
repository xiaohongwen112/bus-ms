<template>
  <div class="per-alert" @click="getAlertType(type)">
    <div class="per-alert-disabled" v-if="Visit"></div>
    <a class="alert-link" href="/zh-cn/alert/" :class="{'alert-link-alert': value > 0}">
      <span class="alert-type">{{ type }}</span>
      <span class="alert-val">{{ value }}</span>
    </a>
  </div>
</template>

<script>
  import { setLocalStorage } from '@/helpers/utils';

  export default {
    name: 'per-alert',
    props: {
      type: {
        type: String,
        default: '',
      },
      value: {
        type: Number,
        default: 0,
      },
      selectedAppName: {
        type: String,
        default: 'app1',
      },
    },
    data() {
      return {
        Visit: true,
      };
    },
    watch: {},
    computed: {},
    mounted() {
      this.Visit = !this.session$.newpermissions.alert_detail;
    },
    methods: {
      getAlertType(type) {
        setLocalStorage('alert_type', type);
        setLocalStorage('app_name', this.selectedAppName);
        if (this.selectedAppName !== '返回码告警') setLocalStorage('alert_status', '持续中');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .per-alert{
    position: relative;
    height: auto!important;
    width: 25%;
    text-align: center;

    .alert-link{
      display: inline-block;
      width: 100%;
      max-width: 120px;
      height: 42px;
      line-height: 42px;
      color: #f9f9f9;
      background: url(../../assets/index/alert-blue.png) no-repeat;
      background-size: 100% 100%;

      .alert-val{
        display: inline-block;
        margin: 0 5px;
        color: #29c0c0;
      }
    }

    .alert-link-alert{
      background: url(../../assets/index/alert-orange.png) no-repeat;
      background-size: 100% 100%;

      .alert-val{
        color: #f2473e;
      }
    }
    .per-alert-disabled{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin-top: 1px;
      height: calc(100% - 2px);
      z-index: 200;
      cursor: default;
    }
  }
</style>
