<template>
  <div class="ipConfig">
    <div class="ip-list-div list-div">
      <div class="nav-row">
        <span class="name-span">IP地址</span>
        <input ref="ipInput" @input="checkIp" v-model="ip" class="config-input ip-input" placeholder="ip段用-连接，多个ip地址用,隔开" autocomplete="off">
        <button class="ip-btn add-ip-btn" type="button" @click="ipInList">+</button>
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
        <div class="list-body ip-list-body">
          <div v-for="(item, index) in ipList" :key="index" class="list-item">
            <span class="col-item col-ip">{{ item.ip }}</span>
            <span class="col-item col-name">
              <input @input="inputDevice($event, item.ip, 'name')" maxlength="20" v-model="item.device_name">
            </span>
            <span class="col-item col-model">
              <input @input="inputDevice($event, item.ip, 'model')" maxlength="20" v-model="item.device_model">
            </span>
            <span class="col-item col-type">
              <input @input="inputDevice($event, item.ip, 'type')" maxlength="20" v-model="item.device_type">
            </span>
            <span class="col-item col-op">
              <a class="del-ip-btn" href="#" @click="delIp(item.ip)">删除</a>
            </span>
            <span class="col-item col-add">
              <a class="add-monitor-btn"  href="#" @click="monitorIp = item.ip">添加监控</a>
            </span>
          </div>
        </div>
      </div>
      <div class="nav-row">
        <span class="name-span">监控名称</span>
        <input class="config-input name-input" type="text" @input="checkMoniName" v-model="monitorName" placeholder="请命名监控名称" autocomplete="off">
        <input class="config-input ip-show" type="text"  v-model="monitorIp" ref="monitorIp" readonly placeholder="请添加监控ip" autocomplete="off" >
      </div>
      <div class="nav-row">
        <span class="name-span">地图监控</span>
        <dist-picker class="dist-picker"
                     @province="selectedProvince" @city="selectedCity" @area="selectedArea"
                     :province="monitorAddress.province" :city="monitorAddress.city" :area="monitorAddress.area"></dist-picker>
      </div>
      <div class="nav-row">
        <button class="ip-btn add-monitor-ip" type="button" @click="ipInMonitorList" >添加</button>
      </div>
    </div>
    <div class="monitor-list-div list-div">
      <div class="nav-row">
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
          <div v-for="(item, key) in monitorList" v-if="item.addr !== null && item.addr !== ''" :key="key" class="list-item">
            <span class="col-item col-ip">{{ item.ip }}</span>
            <span class="col-item col-moni-name">{{ item.name }}</span>
            <span class="col-item col-addr">{{ item.addr }}</span>
            <span class="col-item col-op"><a class="del-ip-btn" href="#" @click="delMoniIp(item.ip)">删除</a></span>
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import has from 'lodash/has';
  import cloneDeep from 'lodash/cloneDeep';
  import distPicker from '@/components/common/DistPicker';
  import { validateName, validateIp, checkError } from '@/helpers/configValidate';

  export default {
    name: 'ip-config',
    props: {
      isNull: false,
      ipObj: {
        type: Object,
        default() {
          return {};
        },
      },
      initIpList: {
        type: Array,
        default() {
          return [];
        },
      },
      initDeviceList: {
        type: Array,
        default() {
          return [];
        },
      },
      initMonitorList: {
        type: Array,
        default() {
          return [];
        },
      },
      isClear: false,
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
        monitorList: [],
        ipAll: {},
        delIpAll: {},
      };
    },
    watch: {
      ipObj() {
        this.ipAll = cloneDeep(this.ipObj);
      },
      initIpList() {
        this.ipList = cloneDeep(this.initDeviceList);
        this.initIpList.forEach((d) => {
          if (!has(this.ipObj, d)) {
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
        this.emit();
      },
      initMonitorList() {
        this.monitorList = this.initMonitorList;
      },
      isClear() {
        if (this.isClear) this.clear();
      },
    },
    computed: {
      appName() {
        return this.$store.state.appName || 'app1';
      },
    },
    components: {
      distPicker,
    },
    methods: {
      selectedProvince(data) {
        this.monitorAddress.province = data.value;
      },
      selectedCity(data) {
        this.monitorAddress.city = data.value;
      },
      selectedArea(data) {
        this.monitorAddress.area = data.value;
      },
      ipInList() {
        const ipInput = this.$refs.ipInput;
        const ipIn = this.ip;
        const result = validateIp(ipIn, true);

        if (result.bool) {
          ipIn.split(',').forEach((item) => {
            if (item.indexOf('-') > -1) {
              const pattern = /.\d+$/;
              const ipSegment = item.split('-');
              const start = Number(ipSegment[0].split('.')[3]);
              const end = Number(ipSegment[1].split('.')[3]);
              const net = ipSegment[0].split(pattern)[0];
              for (let i = start; i < end + 1; i += 1) {
                this.ipIn(`${net}.${i}`);
              }
            } else if (item) {
              this.ipIn(item);
            }
          });
          this.ip = '';
          this.emit();
        }
        checkError(result, ipInput);
//        console.log('同一网络ip段用"-"连接，多个ip地址用","隔开！');
      },
      ipIn(d) {
        if (!this.ipList.some(item => item.ip === d)) {
          const _data = {
            ip: d,
            device_name: null,
            device_model: null,
            device_type: null,
            app_name: this.appName,
            intf_name: '',
            // isDel: false,
            // type: '',
          };
          if (has(this.ipAll, d)) {
            _data.device_name = this.ipAll[d].device_name;
            _data.device_model = this.ipAll[d].device_model;
            _data.device_type = this.ipAll[d].device_type;
          } else {
            this.ipAllin(d, _data);
          }
          this.ipList.push(_data);
        } else {
          console.log('存在重复项，重复项未添加!');
        }
      },
      ipInMonitorList() {
        const moniNull = this.monitorIp !== '';
        checkError({ bool: moniNull, tip: '请添加监控IP！' }, this.$refs.monitorIp);
        if (moniNull && validateName(this.monitorName).bool) {
          const [ip, name, addr, province, city, area] = [
            this.monitorIp,
            this.monitorName,
            `${this.monitorAddress.province}${this.monitorAddress.city === '' ? '' : `-${this.monitorAddress.city}`}${this.monitorAddress.area === '' ? '' : `-${this.monitorAddress.area}`}`,
//            `${this.monitorAddress.province}-${this.monitorAddress.city}-${this.monitorAddress.area}`,
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
            app_name: this.appName,
            intf_name: this.intfName,
            // isDel: false,
            // type: '',
          };
          const index = this.monitorList.findIndex(item => item.ip === ip);
          if (index === -1) {
            this.monitorList.push(data);
            this.ipAllin(ip, data);
          } else {
            this.monitorList[index] = Object.assign(this.monitorList[index], data);
          }

          this.monitorIp = '';
          this.monitorName = '';
          this.emit();
        }
      },
      ipAllin(ip, data) {
        if (has(this.ipAll, ip)) {
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
              // isDel: false,
              // type: '',
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
        if (has(this.ipAll, ip)) {
          this.ipAll[ip].name = null;
          this.ipAll[ip].addr = null;
          this.ipAll[ip].dim_trans_type = null;
          this.ipAll[ip].dim_sub_trans_type = null;
          this.ipAll[ip].dim_subsub_trans_type = null;
        }
        // this.ipAll[ip].isDel = true;
        // this.ipAll[ip].type = isDevice ? 'device' : 'addr';
        this.emit();
      },
      emit() {
        this.$emit('ipChange', {
          ipList: this.ipList,
          monitorList: this.monitorList,
          ipObj: this.ipAll,
          isRight: this.valid(),
        });
      },
      checkMoniName(e) {
        if (e.target.value === '') {
          checkError({
            bool: false,
            tip: '监控名称不可为空',
          }, e.target);
        } else {
          checkError(validateName(e.target.value), e.target);
        }
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
      valid() {
        const ip = this.isNull ? true : this.ipList.length > 0;
        if (!this.isNull) checkError({ bool: ip, tip: 'IP列表不可为空' }, this.$refs.ipList);
        const error = Array.from(this.$el.querySelectorAll('.error-input'))
          .every((d) => {
            const index = Array.from(d.classList).findIndex(item => (item === 'name-input' || item === 'ip-input' || item === 'ip-list-header'));
            return index !== -1;
          });
        return ip && error;
      },
      clear() {
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
    },
  };
</script>

<style lang="scss" scoped>
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
        }
      }

      .col-ip{
        width: 120px;
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
        width: calc(100% - 110px);
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

      .monitor-list-table{
        height: calc(100% - 80px);

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
</style>
