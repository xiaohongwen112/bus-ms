<template>
  <div>
    <div class="coll-div coll-top">
      <div class="model-div left-div check-div" :class="{'disabled-font': !newSettings.is_double_live}">
        <input @change="checkChange" v-model="newSettings.is_double_live" type="checkbox"/>
        <label>汇集模式</label>
        <input @input="checkName" :disabled="!newSettings.is_double_live" v-model="newSettings.correlated_group_name" type="text" autocomplete="off"/>
      </div>
      <div class="trade-div right-div check-div" :class="{'disabled-font': !newSettings.is_twoway_trade}">
        <input @change="checkChange" v-model="newSettings.is_twoway_trade" type="checkbox" >
        <label>双向交易</label>
        <span class="radio-span">
           <input :disabled="!newSettings.is_twoway_trade" :checked="newSettings.is_master" @change="changeMaster" name="tradeMaster" type="radio" >
          <label>双向交易-主</label>
        </span>
        <span class="radio-span">
          <input :disabled="!newSettings.is_twoway_trade" :checked="newSettings.is_slave" @change="changeMaster" name="tradeMaster"  type="radio" >
          <label>双向交易-从</label>
          <input @input="checkName" :disabled="!newSettings.is_twoway_trade" v-model="newSettings.correlated_trade_group_name" type="text" autocomplete="off" class="trade-name-input">
        </span>
      </div>
    </div>
    <div class="coll-div coll-mid">
      <div class="input-div">
        <label class="input-name">采集器名称<span style="color:red">*</span></label>
        <input :class="{'error-input': collectoNameError}" maxlength="20" ref="dispName"
        v-model="newCollector.disp_name" @input="checkName($event,'collector')"
        autocomplete="off" type="text">
      </div>
      <div class="input-div">
        <label class="input-name">服务器ID<span style="color:red">*</span></label>
        <select :class="{'error-input': serverError}" data-type="server" @change="selectChange" v-model="newCollector.server_id" class="port-input">
          <option v-for="(item, index) in servers" :key="index" :value="item.server_id">{{ item.server_id }}</option>
          <option
            v-if="serverError"
            :value="newCollector.server_id"
            :key="newCollector.server_id"
            class="error-input"
            disabled="disabled"
            selected="selected"
          >{{ newCollector.server_id }}（不存在且不可选）</option>
        </select>
      </div>
      <div class="input-div">
        <label class="input-name">协议</label>
        <select  :class="{'error-input': protocolError}" data-type="protocol" @change="selectChange" v-model="newCollector.target_prot" class="port-input">
          <option v-for="(item,key) in protocols" :value="key" :key="key">{{ item.config.display_name }}</option>
          <option
            v-if="protocolError"
            :value="newCollector.target_prot"
            :key="newCollector.target_prot"
            class="error-input"
            disabled="disabled"
            selected="selected"
          >{{ newCollector.target_prot }}（不存在且不可选）</option>
        </select>
      </div>
      <div class="input-div">
        <label class="input-name">网口</label>
        <select :class="{'error-input': nicError}" data-type="nic" @change="selectChange" v-model="newCollector.nic_addr"  class="port-input">
          <option v-for="(item,index) in server.nices" :value="item" :key="index">{{ item }}</option>
          <option
            v-if="nicError"
            :value="newCollector.nic_addr"
            :key="newCollector.nic_addr"
            class="error-input"
            disabled="disabled"
            selected="selected"
          >{{ newCollector.nic_addr }}（不存在且不可选）</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>

  import _ from 'lodash';
  import { validateName, validateCollName, checkError } from '@/helpers/configValidate';

  export default {
    name: 'collector-config',
    props: {
      trade: {
        type: Object,
        default() {
          return {};
        },
      },
      protocols: {
        type: Object,
        default() {
          return {};
        },
      },
      servers: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        newSettings: {},
        newCollector: {},
        nicError: false,
        protocolError: false,
        serverError: false,
        collectoNameError: false,
        server: {},
      };
    },
    watch: {
      trade() {
        this.server = this.servers.length ? this.servers[0] : {};
        const trade = this.trade;
        this.newSettings = JSON.parse(JSON.stringify(trade.settings));
        this.newCollector = JSON.parse(JSON.stringify(trade.collector))[0];
        if (this.newCollector.nic_addr === '') {
          this.newCollector.nic_addr = this.server.nices[0];
        }
        if (this.newCollector.target_prot === '') {
          this.newCollector.target_prot = Object.keys(this.protocols)[0];
        }
        if (this.newCollector.server_id === '') {
          this.newCollector.server_id = this.server.server_id;
        }

        this.nicError = this.server.nices.indexOf(this.newCollector.nic_addr) === -1;
        this.protocolError = !_.has(this.protocols, this.newCollector.target_prot);
        this.serverError = this.servers.filter(e => e.server_id === this.newCollector.server_id).length === 0;
        this.emit();
      },
    },
    computed: {
      protocolInfo() {
        return _.has(this.protocols, this.newCollector.target_prot) ? this.protocols[this.newCollector.target_prot]
          : {
            csv_files: [],
            config: {
              display_name: '',
              name: '',
              ret_code: '',
              sub_trans_type: '',
              trans_type: '',
              transaction_id: '',
            },
          };
      },
      csvFiles() {
        const csv = this.protocolInfo.csv_files.map(d => d.name);
        return csv.join(',');
      },
    },
    methods: {
      changeMaster() {
        this.newSettings.is_slave = !this.newSettings.is_slave;
        this.newSettings.is_master = !this.newSettings.is_master;
        this.emit();
      },
      checkName(e, type) {
        const val = e.target.value;
        const res = type === 'collector' ? validateCollName(val) : validateName(val);
        if (type === 'collector') {
          this.collectoNameError = !res.bool;
        }
        checkError(res, e.target);
        this.emit();
      },
      checkChange(e) {
        const isChecked = e.target.checked;
        const _parent = e.target.closest('.check-div');
        Array.from(_parent.querySelectorAll('input[type="text"]')).forEach((d) => {
          if (isChecked) {
            if (d.value === '') {
              checkError({ bool: false, tip: '不可为空' }, d);
            }
          } else {
            if (Array.from(d.classList).indexOf('error-input') > -1 && d.value === '') {
              checkError({ bool: true }, d);
            }
          }
        });
        this.emit();
      },
      selectChange(e) {
        if (e.target.className.indexOf('error-input') > -1) {
          switch (e.target.getAttribute('data-type')) {
            case 'server':
              this.serverError = false;
              break;
            case 'nic':
              this.nicError = false;
              break;
            case 'protocol':
              this.protocolError = false;
              break;
            default:return;
          }
        }
        if (e.target.getAttribute('data-type') === 'server') {
          this.server = Object.assign({}, this.servers[this.servers.findIndex(item => item.server_id === this.newCollector.server_id)]);
          // this.newCollector.nic_addr = this.server.nices[0];
          this.nicError = this.server.nices.indexOf(this.newCollector.nic_addr) === -1;
        }
        this.emit();
      },
      emit() {
        this.$emit('collectorChange', {
          settings: this.newSettings,
          collector: this.newCollector,
          isValid: this.validate(),
        });
      },
      validate() {
        // ==============================================================采集器名称================================
        const collRight = this.newCollector.disp_name !== '' && this.newCollector.name !== '' && !this.nicError && !this.protocolError && !this.serverError;
        const setRight = Array.from(this.$el.querySelectorAll('.check-div .error-input')).every(d => !d.closest('.check-div').querySelector('input[type="checkbox"]').checked);
        // set 采集器红色框
        const resDispName = validateCollName(this.newCollector.disp_name);
        checkError(resDispName, this.$refs.dispName);
        this.collectoNameError = !resDispName.bool;
        return collRight && setRight && !this.collectoNameError;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .coll-div{
    margin: 0 60px;
    width: calc(100% - 120px);
    display: flex;
    justify-content: center;
    align-items: center;

    input.error-input,select.error-input,.error-input{
      border: 1px solid red!important;
    }

    input{
      background: #0a1f30;
    }

    input[type="radio"]{
      width: 12px;
      height: 12px;
      margin: 0 4px;
    }

    input[type="checkbox"]{
      height: 18px;
      vertical-align: middle;
      width: 18px;
      border: 1px solid #278C89 !important;
      margin: 0 4px;
    }

    input[type="checkbox"]:checked {
      background: #2C9D97 url(../../assets/topo-nav/input-checked.svg)  1px center;
      background-size: cover;
    }

    input[type="text"],select{
      width: calc(100% - 110px);
      height: 26px;
      line-height: 26px;
      border: 1px solid #2b4055;
      max-width: 260px;
    }
  }

  .coll-top{
    height: 100px;
    margin-top: 40px;

    .left-div,.right-div{
      width:50%;
      display: inline-block;

      label{
        margin-right: 4px;
      }
    }

    .radio-span{
      display: inline-block;

      .trade-name-input{
        width: calc(100% - 120px);
      }
    }
  }

  .coll-mid{
    height: 150px;
    flex-wrap: wrap;

    .input-div{
      display: inline-block;
      width: 50%;

      .input-name{
        width: 90px;
      }
    }
  }

  .coll-bottom{
    height: calc(100% - 267px);
    padding-top: 15px;
    flex-wrap: wrap;

    .proto-list{
      width: 50%;
      height: 40px;
      line-height: 40px;
      color: #737b7e;

      .proto-disp{
        display: inline-block;
        width: 100px;
      }

      .proto-text{
        display: inline-block;
        width: calc(100% - 110px);
      }
    }
  }

  .ellipsis{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .disabled-font{
    color: #777777 !important;
    input[type="text"]{
      background: #0b2537 !important;
    }
  }



</style>
