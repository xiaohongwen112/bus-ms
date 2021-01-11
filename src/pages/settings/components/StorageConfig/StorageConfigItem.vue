<template>
  <li class="storage-config-item">
    <span class="name col-mdd-2 col-xss-2">{{ data.name }}</span>
    <span class="col-mdd-4 col-xss-4">
      <input class="config-value" type="text" autocomplete="off"
            :value="data.value" :ref= "data.key"
            @change="changeInput(data.key, $event.target.value)"
      >
    </span>
    <span class="col-mdd-4 col-xss-4">
      <select class="config-unit" v-if="this.unitDatum1.indexOf(data.key) > -1"
              :value="data.unit"
              @change="changeSelect(data.key, $event.target.value)"
      >
        <option value="days">天</option>
        <option value="hours">小时</option>
      </select>
      <select class="config-unit" v-else-if="this.unitDatum2.indexOf(data.key) > -1"
              :value="data.unit"
              @change="changeSelect(data.key, $event.target.value)"
      >
        <option value="days">天</option>
        <option value="hours">小时</option>
        <option value="mins">分钟</option>
      </select>
      <select class="config-unit" v-else
              :value="data.unit"
              @change="changeSelect(data.key, $event.target.value)"
      >
        <option value="GB">GB</option>
        <option value="MB">MB</option>
      </select>
    </span>
    <span class="detail col-mdd-12 col-xss-12"><span class="name col-mdd-2 col-xss-2"></span><span>{{ data.detail }}</span></span>
  </li>
</template>

<script>
import { checkError } from '@/helpers/configValidate';

export default {
  name: 'StorageConfigItem',
  props: {
    data: {
      type: Object,
      default() {
        return {
          key: '',
          name: '',
          detail: '',
          value: '',
          unit: '',
        };
      },
    },
  },
  data() {
    return {
      unitDatum1: ['db_bar_expire', 'db_alert_expire'],
      unitDatum2: ['pcap_expire'],
      unitDatum3: ['cleaner_free_space', 'free_disk_space'],
    };
  },
  watch: {
    data() {
      this.currentValue = this.data.value;
      this.currentUnit = this.data.unit;
    },
    // currentUnit() {
    //   this.$emit('change-config', { key: `${this.data.key}_unit`, value: this.currentUnit });
    // },
  },
  methods: {
    changeInput(key, val) {
      if (!(val.match(/^[1-9]\d*$/))) {
        checkError({ bool: false, tip: '值必须是正整数' }, this.$refs[key]);
        this.$emit('change-disable');
        return;
      }
      const className = this.$refs[key].className;
      className.includes('error-input') ? this.$refs[key].classList.remove('error-input') : className; // eslint-disable-line
      this.$emit('change-config', { key: this.data.key, value: val });
    },
    changeSelect(key, val) {
      const unit = `${key}_unit`;
      // console.log({ key: unit, value: val });
      this.$emit('change-config', { key: unit, value: val });
    },
    showErrorTip(key) {
      checkError({ bool: false, tip: '磁盘清理阈值应大于可用空间预警' }, this.$refs[key]);
      this.$emit('change-disable');
    },
  },
};
</script>

<style lang="scss">
.config-form{
  .switch{
    .bms-switch{
      width: 60px !important;
      height: 26px !important;
      line-height: 26px !important;
      border-radius: 13px !important;
      border: none !important;
      background-color: #a4a7ac;
      &:after{
        top: 1px !important;
        background-color: #fff !important;
      }
      .bms-switch-inner{
        color:#fff !important;
        top: 1px !important;
      }
    }
    .bms-switch-checked{
      background-color: #16b8a5;
      &:after{
        left: 37px !important;
        background-color: #fff !important;
      }
      .bms-switch-inner{
        color:#fff !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import '../../../../assets/css/col.css';

li{
    height: 41px;
    line-height: 41px;
    color: #ffffff;
    font-size: 14px;
    &:nth-of-type(2n){
      .name{
        text-align: left;
      }
    }
    span:nth-child(4){
      white-space: normal;
      color: #4c4b4b;
    }
    .name{
      text-align: right;
      padding-right: 7px;
      min-width: 91px;
      color: #ddd;
    }
  }
  .config-swtich{
    display: inline-block;
  }
  .config-value, .config-unit{
    width: calc(100% - 10px);
    margin: 0 5px;
    height: 30px;
    line-height: 30px;
    background: transparent;
    border: 1px solid #49afa2;
    color: #ffffff;
    padding-left: 10px;
    border-radius: 3px;
  }
  .config-unit{
    position: relative;
    padding-right: 18px;
    background: url(../../../../assets/sys-icon/arrow-w.svg) no-repeat calc(100% - 5px) 0% rgb(10,31,48);
  }
  .config-unit, .config-unit option{
    background: #0b3b50;
    color: #bbd6d6;
  }
  .name, .detail{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  @media (max-width: 1345px) {
    li.storage-config-item {
      line-height: 28px !important;
      span:nth-child(4){
        display: block;
        width: 100%;
      }
    }
  }
  @media (max-width: 1345px) {
    .config-form{
      li{
        &:nth-of-type(2n){
          .name{
            text-align: right;
          }
        }
        .detail{
          padding-left: 10px;
        }
      }
    }
  }
</style>
