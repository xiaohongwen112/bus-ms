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
    <IpConfig
      :isNull="false"
      :isClear="isClear"
      :ipObj="ipObj"
      :settingFilter="newIpCom"
      @ipChange="getIp"
      @addMointor="addMointor"
      class="ip-container"
    />
  </div>
</template>

<script>
  import _ from 'lodash';

  import IpConfig from './IpConfig';

  export default {
    name: 'receive-config',
    components: {
      IpConfig,
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
        newMonitor: {}, // 临时存放更改后的监控， 在保存后更新值confData
        newIpObj: {},
        portList: [],
      };
    },
    watch: {
      settings(val) {
        // 统一ip设备名称
        this.newIpData(val.filter, this.$store.state.ipObj);
        this.currentMode = this.settings.link === '' ? 'STC' : this.settings.link;
      },
    },
    computed: {
      newIpCom() {
        this.settings.filter.dst_ip_device = this.newIpData(this.settings.filter, this.$store.state.ipObj);
        return this.settings.filter;
      },
    },
    methods: {
      newIpData(newD, oldD) {
        const comPD = newD.dst_ip_device;
        let newIpArr = [];
        if (Object.keys(oldD).length === 0) {
          newIpArr = newD.dst_ip_device;
        } else {
          comPD.forEach((item) => {
            const itemData = item;
            for (const index in oldD) {
              if (item.ip === index) {
                console.log(index, oldD[index]);
                itemData.device_model = oldD[index].device_model;
                itemData.device_name = oldD[index].device_name;
                itemData.device_type = oldD[index].device_type;
              }
              newIpArr.push(itemData);
              newIpArr = _.uniq(newIpArr);
            }
          });
        }
        return newIpArr;
      },
      getIp(data) {
        this.newIpObj = data.ipObj;
        this.ipList = data.ipList;
        this.monitorList = data.monitorList;
        this.portList = data.portList;
        this.isValid = data.isValid;

        this.emit();
      },
      addMointor(obj) {
        // 保存后更改new
        this.newMonitor[obj.ip] = obj;
      },
      emit() {
        const {
          isValid,
        } = this;
        this.$emit('receiveChange', {
          isValid,
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
    width: calc(100% - 77px);
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
