<template>
  <div>
    <div class="nav-row port-row">
      <span class="name-span">连接模式</span>
      <select @change="emit" v-model="currentMode" class="port-input">
        <option value="STC">常规连接</option>
        <option value="SLLTC">TCP长连接</option>
        <option value="DALLTC">异步双工</option>
      </select>
    </div>
    <ip-config
      :isNull="false"
      :isClear="isClear"
      :ipObj="ipObj"
      :initIpList="settings.filter.dst_ip_list"
      :initDeviceList="settings.filter.dst_ip_device"
      :initMonitorList="settings.filter.dst_ip_addr"
      @ipChange="getIp"
      class="ip-container"
    ></ip-config>
  </div>
</template>

<script>
//  import cloneDeep from 'lodash/cloneDeep';
  import ipConfig from './IpConfig';

  export default {
    name: 'receive-config',
    components: {
      ipConfig,
    },
    props: {
      settings: {
        type: Object,
        default() {
          return {};
        },
      },
      ipObj: {
        type: Object,
        default() {
          return {};
        },
      },
      isClear: false,
    },
    data() {
      return {
        currentMode: '',
        ipList: [],
        deviceList: [],
        monitorList: [],
        isRight: true,
        newIpObj: {},
      };
    },
    watch: {
      settings() {
        this.currentMode = this.settings.link === '' ? 'STC' : this.settings.link;
      },
//      ipObj() {
//        this.newIpObj = this.ipObj;
//      },
    },
    computed: {
    },
    methods: {
      getIp(data) {
        this.newIpObj = data.ipObj;
        this.ipList = data.ipList;
        this.monitorList = data.monitorList;
        this.isRight = data.isRight;

        this.emit();
      },
      emit() {
        const { currentMode, ipList, monitorList, isRight } = this;
        this.$emit('receiveChange', {
          ipObj: this.newIpObj,
          currentMode,
          ipList,
          monitorList,
          isRight,
        });
      },
    },
  };
</script>

<style scoped>
  .port-row {
    width: 50%;
  }
  select {
    border: 1px solid #2b4055 !important;
  }
  .name-span{
    display: inline-block;
    width: 70px;
  }
  .port-input{
    width: calc(100% - 110px);
    height: 26px;
    line-height: 26px;
  }
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
