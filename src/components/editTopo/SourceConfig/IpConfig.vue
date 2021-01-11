<template>
  <div class="ipConfig">
    <div class="ip-list-div list-div">
      <div class="nav-row">
        <span class="name-span">源IP</span>
        <input ref="ipInput" @keyup="checkIp" v-model="ip" class="config-input ip-input"
        placeholder="ip段用-连接，多个ip地址用,隔开" autocomplete="off"/>
        <button class="ip-btn add-ip-btn" type="button" @click="addIpToList">+</button>
      </div>
      <div class="nav-row">
        <span class="name-span">端口</span>
        <input ref="portInput" class="config-input port-input" 
        placeholder="0-65535之间，区间用-连接，多个端口用,隔开" autocomplete="off"
        :value="initPortStr"
        @keyup="checkPort"
        />
      </div>
      <div class="list-table ip-list-table">
        <div class="ip-list-header" ref="ipList">
          <span class="col-item col-ip">IP</span>
          <span class="col-item col-name">设备名称</span>
          <span class="col-item col-model">设备型号</span>
          <span class="col-item col-type">设备类型</span>
          <span class="col-item col-op">操作</span>
          <span class="col-item col-add"></span>
        </div>
          <ScrollBar  class="list-body ip-list-body">
            <IpItem v-for="(item, index) in confData.src_ip_device" :key="`ipitem-${index}`" @iserror="isError" v-model="confData.src_ip_device[index]"
              @delete="deleteIp(index)"
              @add="addMonitor"/>
          </ScrollBar>
      </div>
      <div class="nav-row">
        <span class="name-span">监控名称</span>
        <input class="config-input name-input" type="text" placeholder="请命名监控名称" autocomplete="off" maxlength="20"
        @change="validateMonitorName" v-model="monitorName" ref="monitorName">
        <input class="config-input ip-show" type="text" readonly placeholder="请添加监控ip" autocomplete="off"
        v-model="monitorIp" ref="monitorIp">
      </div>
      <div class="nav-row">
        <span class="name-span">地图监控</span>
        <DistPicker
          class="dist-picker"
          @province="selectedProvince"
          @city="selectedCity"
          @area="selectedArea"
          :province="monitorAddress.province"
          :city="monitorAddress.city"
          :area="monitorAddress.area"
        />
      </div>
      <div class="nav-row">
        <button class="ip-btn add-monitor-ip" type="button" @click="addIpToMonitorList">添加</button>
      </div>
    </div>
    <div class="monitor-list-div list-div">
      <div class="nav-row monitor-list-title">
        <span class="name-span">监控列表</span>
      </div>
      <div class="list-table monitor-list-table">
        <div class="monitor-list-header">
          <span class="col-item col-ip">监控IP</span>
          <span class="col-item col-moni-name">监控名称</span>
          <span class="col-item col-addr">监控地址</span>
          <span class="col-item col-op">操作</span>
        </div>
        <div class="list-body monitor-list-body">
          <MonitorItem  class="list-item"
            v-for="(item, index) in confData.src_ip_addr" :key="`monitor-${index}`" v-model="confData.src_ip_addr[index]"
            @delete="deleteMonitor(index)"/>
        </div>
        <div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import _ from 'lodash';
  import { mapState } from 'vuex';
  import DistPicker from '@/components/common/DistPicker';
  import ScrollBar from '@/components/common/ScrollBar';
  import { validateName, validateIp, validatePort, checkError } from '@/helpers/configValidate';
  import { jointAddr } from '@/pages/editTopo/utils';

  import IpItem from './IpItem';
  import MonitorItem from './MonitorItem';

  export default {
    name: 'ip-config',
    model: {
      prop: 'confData',
    },
    components: {
      DistPicker,
      ScrollBar,
      IpItem,
      MonitorItem,
    },
    props: {
      isNull: { // 是否为必填项， 发出为非必填， 接收为必填
        type: Boolean,
        default: false,
      },
      ipObj: {
        type: Object,
        default() {
          return {};
        },
      },
      settingFilter: {
        type: Object,
        default: () => ({
          dst_ip_list: [],
          dst_ports: [],
          dst_ip_device: [],
          dst_ip_addr: [],
        }),
      },
      isClear: false,
      confData: {
        type: Object,
        default() {
          return {
            srcId: 0,
            dstId: 0,
            src_ports: [],
            src_ip_device: [],
          };
        },
      },
    },
    data() {
      return {
        intfName: '',
        ip: '',
        monitorIp: '',
        monitorName: '',
        monitorAddress: {
          province: '北京市',
          city: '',
          area: '',
        },
        ipList: [],
        portListStr: '',
        monitorList: [],
        ipAll: {},
        ipItemIsError: false,
      };
    },
    watch: {
      ipObj() {
        this.ipAll = _.cloneDeep(this.ipObj);
      },
      settingFilter(newV) {
        this.ipList = _.cloneDeep(newV.dst_ip_device);
        newV.dst_ip_list.forEach((d) => {
          if (!_.has(this.ipObj, d)) {
            this.ipList.push({
              ip: d,
              device_name: null,
              device_model: null,
              device_type: null,
              app_name: this.appName,
              intf_name: this.intfName,
            });
          }
        });
        this.portListStr = newV.dst_ports.join(',');
        this.monitorList = newV.dst_ip_addr;
        this.emit();
      },
      isClear(newV, oldV) {
        if (newV && !oldV) this.clearAll();
      },
    },
    computed: {
      ...mapState({
        appName: 'appName',
        moniData: state => state.monitData,
      }),
      // appName() {
      //   return this.$store.state.appName || 'app1';
      // },
      initPortStr() {
        return this.confData.src_ports === undefined ? '' : this.confData.src_ports.join(',');
      },
    },
    methods: {
      monNewData(newData) { // 同app相同ip统一地图监控地址不能自动加载和更新
        const commonData = [];
        console.log(newData, this.moniData);
        const moniCom = this.moniData.length === 0 ? [1] : this.moniData;
        _.forEach(moniCom, (item) => {
          _.forEach(newData, (items) => {
            if (item.ip === items.ip) {
              const data = items;
              data.addr = item.addr;
              data.name = item.name;
              data.device_model = item.device_model;
              data.device_name = item.device_name;
              data.device_type = item.device_type;
              data.dim_trans_type = item.dim_trans_type;
              data.dim_sub_trans_type = item.dim_sub_trans_type;
              data.dim_subsub_trans_type = item.dim_subsub_trans_type;
              commonData.push(data);
            } else commonData.push(items);
          });
        });
        let nowARR = _.cloneDeep(commonData);
        nowARR = _.uniqWith(nowARR, _.isEqual);
        return nowARR;
      },
      isError(val) {
        this.ipItemIsError = val;
        this.emit();
      },
      selectedProvince(data) {
        this.monitorAddress.province = data.value;
      },
      selectedCity(data) {
        this.monitorAddress.city = data.value;
      },
      selectedArea(data) {
        this.monitorAddress.area = data.value;
      },
      addIpToList() { // 添加ip
        const ipInput = this.$refs.ipInput;
        const ipIn = this.ip;
        const result = validateIp(ipIn, false);
        checkError(result, ipInput);
        // 添加ip, 先去重
        const pushIp = (ip) => {
          this.confData.src_ip_device.unshift({
            ip, // ip
            device_name: '', // 设备名称
            device_type: '', // 设备型号
            device_model: '', // 设备类型
          });
          // v-model无法使用unionBy
          const lastIndex = _.findLastIndex(this.confData.src_ip_device, d => d.ip === ip);
          if (lastIndex > 0) {
            this.confData.src_ip_device.splice(lastIndex, 1);
          }
        };
        if (this.ip !== '') {
          if (result.bool) {
            ipIn.split(',').forEach((item) => {
              if (item.indexOf('-') > -1) {
                const pattern = /.\d+$/;
                const ipSegment = item.split('-');
                const start = Number(ipSegment[0].split('.')[3]);
                const end = Number(ipSegment[1].split('.')[3]);
                const net = ipSegment[0].split(pattern)[0];
                for (let i = start; i < end + 1; i += 1) {
                  pushIp(`${net}.${i}`);
                }
              } else if (item) {
                pushIp(item);
              }
            });
            this.ip = '';
          }
        }
      },
      addIpToMonitorList() {
        checkError({ bool: this.monitorIp !== '', tip: '请添加监控IP！' }, this.$refs.monitorIp);
        // 校验监控名称校验+ip校验+ip不重复
        const checkName = validateName(this.$refs.monitorName.value, false);
        checkError(checkName, this.$refs.monitorName);
        if (this.monitorIp !== '' && checkName.bool) {
          // 去重
          const allMonitor = this.confData.src_ip_addr.map(d => d.ip);
          const index = allMonitor.indexOf(this.monitorIp);
          // console.log(allMonitor, index);
          if (index > -1) {
            this.confData.src_ip_addr.splice(index, 1);
          }
          this.confData.src_ip_addr.push({
            addr: jointAddr(this.monitorAddress.province, this.monitorAddress.city, this.monitorAddress.area),
            app_name: this.appName,
            dim_sub_trans_type: this.monitorAddress.city,
            dim_subsub_trans_type: this.monitorAddress.area,
            dim_trans_type: this.monitorAddress.province,
            intf_name: `intf${this.confData.dstId}`,
            ip: this.monitorIp, // 监控IP
            name: this.monitorName, // 监控名称
          });
          const [ip, name, addr, province, city, area] = [
            this.monitorIp,
            this.monitorName,
            jointAddr(this.monitorAddress.province, this.monitorAddress.city, this.monitorAddress.area),
            this.monitorAddress.province,
            this.monitorAddress.city,
            this.monitorAddress.area,
          ];
          const data = {
            ip,
            name,
            addr,
            dim_trans_type: province,
            dim_sub_trans_type: city,
            dim_subsub_trans_type: area,
            // app_name: this.appName,
            // intf_name: this.intfName,
            // isDel: false,
            // type: '',
          };
          const indexs = this.monitorList.findIndex(item => item.ip === ip);
          if (indexs === -1) {
            this.$store.dispatch('monitorData', data);
            this.monitorList.push(data);
            this.ipAllin(ip, data);
          } else {
            this.monitorList[indexs] = Object.assign(this.monitorList[indexs], data);
          }
          this.$emit('addMointor', data);
          this.clearAll();
        }
      },
      ipAllin(ip, data) {
        if (_.has(this.ipAll, ip)) {
          this.ipAll[ip] = Object.assign(this.ipAll[ip], data);
        } else {
          this.ipAll[ip] = Object.assign(
            {
              ip: null,
              app_name: null,
              intf_name: null,
              device_name: null,
              device_model: null,
              device_type: null,
              name: null,
              addr: null,
              dim_trans_type: null,
              dim_sub_trans_type: null,
              dim_subsub_trans_type: null,
            }, data);
        }
      },
      delIp(ip) {
        this.ipList.splice(this.ipList.findIndex(d => d.ip === ip), 1);
        this.delMoniIp(ip);
        delete this.ipAll[ip];
      },
      delMoniIp(ip) {
        this.monitorList.splice(this.monitorList.findIndex(d => d.ip === ip), 1);
        if (_.has(this.ipAll, ip)) {
          this.ipAll[ip].name = null;
          this.ipAll[ip].addr = null;
          this.ipAll[ip].dim_trans_type = null;
          this.ipAll[ip].dim_sub_trans_type = null;
          this.ipAll[ip].dim_subsub_trans_type = null;
        }
        this.emit();
      },
      emit() {
        this.$emit('ipChange', {
          ipList: this.ipList,
          portList: this.portListStr.split(','),
          monitorList: this.monitorList,
          ipObj: this.ipAll,
          isValid: this.validateAll(),
        });
      },
      validateMonitorName(e) {
        checkError(validateName(e.target.value, false), e.target);
      },
      inputDevice(e, ip, type) {
        const val = e.target.value;
        const res = validateName(val);
        checkError(res, e.target);
        if (res.bool) {
          switch (type) {
            case 'name':
              this.ipAll[ip].device_name = val;
              break;
            case 'model':
              this.ipAll[ip].device_model = val;
              break;
            case 'type':
              this.ipAll[ip].device_type = val;
              break;
            default:
              break;
          }
        }
        this.emit();
      },
      checkIp(e) {
        const res = validateIp(e.target.value);
        checkError(res, e.target);
      },
      checkPort(e) {
        // console.log(e.target.value);
        // if (e.target.value.length > 0) {
        const res = validatePort(e.target.value, true);
        // console.log(res.bool);
        checkError(res, e.target);
        Object.assign(this.confData, { error: !res.bool });
        // }
        this.confData.src_ports = e.target.value.length > 0 ? e.target.value.split(',') : [];
      },
      validateAll() {
        const ip = this.isNull ? true : this.ipList.length > 0;
        if (!this.isNull) checkError({ bool: ip, tip: '端口不可为空' }, this.$refs.portInput);
        if (!this.isNull) checkError({ bool: ip, tip: 'IP列表不可为空' }, this.$refs.ipList);
        const error = Array.from(this.$el.querySelectorAll('.error-input'))
          .every((d) => {
            const index = Array.from(d.classList).findIndex(item => (item === 'name-input' || item === 'ip-input' || item === 'ip-list-header'));
            return index !== -1;
          });
        if (this.ipItemIsError) {
          return false;
        }
        return ip && error;
      },
      clearAll() {
        this.portListStr = '';
        this.ip = '';
        this.monitorIp = '';
        this.monitorName = '';
        this.monitorAddress = {
          province: '北京市',
          city: '',
          area: '',
        };
        Array.from(this.$el.querySelectorAll('.error-input')).forEach(item => checkError({ bool: true }, item));
      },
      deleteIp(index) { // 删除ip
        // console.log('deleteIp', index);
        const ip = this.confData.src_ip_device[index].ip;
        this.confData.src_ip_device.splice(index, 1);
        this.confData.src_ip_addr = _.filter(this.confData.src_ip_addr, d => d.ip !== ip);
      },
      deleteMonitor(index) { // 删除ip
        this.confData.src_ip_addr.splice(index, 1);
      },
      addMonitor(ip) {
        // 添加监控
        this.monitorIp = ip;
      },
    },
    updated() {
      this.emit();
    },
  };
</script>


<style lang="scss">
.monitor-item-tip{
  line-height: 17.1429px;
}
</style>

<style lang="scss" scoped>
  input {
    text-align: center;  
  }
  .ipConfig{
    width: 100%;
    height: 100%;

    .list-div{
      height: calc(100% - 40px);
      float: left;

      .col-item{
        display: inline-block;
        height: 26px;
        line-height: 26px;
        text-align: center;

        input{
          height: 26px;
          width: 100%;
        }
      }

      .col-ip{
        width: 110px;
      }

      .col-op{
        width: 60px;
      }

      .col-add{
        width: 80px;
      }

      .col-name, .col-model, .col-type{
        width: calc(100%/3 - 282px/3);
      }

      .nav-row{
        width: 100%;
        margin-top: 10px;
        height: 26px;
         
        &.monitor-list-title span {
          border: 1px solid #2b4055;
          display: inline-block;
          padding: 5px 10px;
        }
      }
      .dist-picker{
        width: calc(100% - 80px);
      }

      .ip-btn{
        margin: 0;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border: none!important;
        border-radius: 4px;
        height: 26px;
        line-height: 16px;
        background: #3dd9c4;
        color: #081928;
      }

      .ip-btn:hover {
        color: #ffffff;
        text-decoration: none;
      }
      
      .list-table{
        border: 1px solid #2b4055;
        width: 100%;
        margin: 20px 0;
        overflow: hidden;
      }

      .del-ip-btn{
        color: #de1414;
      }

      .add-monitor-btn{
        color: #3dd9c4;
        text-decoration: underline;
        font-style: oblique;
        font-size: 15px;
      }

      .list-item{
        height: 32px;
        line-height: 32px;
      }

      .list-body{
        overflow: auto;
        height: calc(100% - 30px);
      }
    }

    .ip-list-div{
      width: 50%;

      .name-span{
        display: inline-block;
        width: 70px;
      }

      .config-input{
        // width: calc(100% - 110px);
        height: 26px;
        line-height: 26px;
      }

      .add-ip-btn{
        width: 25px;
        margin-left: 5px;
      }

      .ip-list-table{
        height: calc(100% - 200px);
      }

      .name-input{
        width: calc(100% - 200px);
      }

      .ip-show{
        width: 120px;
        border: none!important;
        background: transparent;
      }

      .add-monitor-ip{
        float: right;
        padding: 6px 12px;
        margin-top: 4px;
      }

      .error-input{
        border:1px solid red!important;
      }
    }

    .monitor-list-div{
      width: calc(50% - 50px);
      margin-left: 50px;
      // margin-top: -35px;

      .monitor-list-table{
        height: calc(100% - 25px);
        margin-top: 5px;
        
        .monitor-list-header {
          border-bottom: 1px solid #2b4055;
          line-height: 40px;
        }

        .col-moni-name,.col-addr{
          width: calc(50% - 100px);
        }
      }
    }

    .error-input{
       border:1px solid red!important;
     }
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

  .port-input{
    width: calc(100% - 77px);
  }

  .ip-input{
    width: calc(100% - 110px);
  }
  
</style>