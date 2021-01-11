<template>
  <div class="backup_wrap">
    <div class="backup-item">
      <p class="title">备份设置</p>
      <BmsBtn class="save-btn" :disabled="!btnEditable" @click="submit">保存</BmsBtn>
    </div>
    <div class="backup-item" ref="backup_opts">
      <span class="name col-xss-2">
        <span>备份项</span>
      </span>
      <storage-backup-select class="col-xss-10" :value="backupConfig.backup_opts"
        @change="changeSelect"/>
    </div>
    <div class="backup-item">
      <span class="name col-xss-2 remote-addr">远程地址</span>
      <span class="col-xss-4">
        <span>主机地址</span>
        <input type="text" class="backup-host" ref="remote_host"
          v-model="backupConfig.remote_host"
          @change="changeHost"/>
      </span>
      <span class="col-xss-4">
        <span>路径</span>
        <input type="text" class="backup-path" ref="path"
          v-model="backupConfig.path" 
          @change="changePath"/>
      </span>
      <span class="col-xss-4">
        <span>端口</span>
        <input type="text" class="backup-port" ref="port"
          v-model="backupConfig.port" @change="changePort"/>
      </span>
    </div>
    <div class="backup-item">
      <span class="name col-xss-2"></span>
      <span class="col-xss-4">
        <span>用户名</span>
        <input type="text" class="backup-username" ref="username"
          v-model="backupConfig.username" @change="changeUsername"/>
      </span>
      <span class="col-xss-4">
        <span>密码</span>
        <input type="password" class="backup-psd" ref="password"
          v-model="backupConfig.password" @change="changePassword"/>
      </span>
    </div>
    <div class="backup-item auto-backup">
      <span class="name col-xss-2">自动备份</span>
      <CmSwitch class="backup-swtich col-xss-2 col-lgg-2"
        :switchStatus="backupConfig.auto_backup"
        :statusOne="`开`"
        :statusOther="`关`"
        @on-change="changeAutoStatus"/>
      <span class="col-xss-4 col-lgg-3">
        <span>备份时间</span>
        <input type="text" class="backup-time" ref="backup_time"
          v-model="backupConfig.backup_time" @change="changeTime"/>
      </span>
      <span class="repeat-span" ref="weeks">
        <span>重复</span>
        <CmWeek class="backup-repeat"
          v-model="backupConfig.weeks" @click="changeWeek"/>
      </span>
    </div>
    <div class="backup-item hand-backup">
      <span class="name col-xss-2">手动备份</span>
      <span class="col-xss-10 backup-status-wrap">
        <CmSimpleBtn class="backup-btn" @click="clickBackup" @mouseover="handleShow(true)" @mouseout="handleShow(false)">
          {{ backupFinish ? '立即备份': '备份中...'}}</CmSimpleBtn>
        <span class="finish-detail" ref="historyInfo" @mouseover="showWhole()" @mouseout="showNameFlag = false">
          {{history}}
        </span>
      <StorageBackupProgress v-show="isHover" :path="backupConfig.path" :compress="compress"/>
      </span>
	    <div class="manage-namePops" ref="showName" :style="`top: ${tipsTop}px;`" v-show="showNameFlag">{{history}}</div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import $ from 'jquery';
import tooltip from '@/directive/tooltip';
import { BmsBtn, CmSimpleBtn } from '@/components/basic';
import CmSwitch from '@/components/common/CmSwitch';
import { checkError, checkSpecial } from '@/helpers/configValidate';
import CmWeek from '@/components/common/CmWeek';
import StorageBackupSelect from './StorageBackupSelect';
import StorageBackupProgress from './StorageBackupProgress';
import { getConfig, getLastBackup, setBackupConfig, toggleBackup, delBackup } from '../../service';
import { defaultBackupConfig } from '../../utils';

export default {
  name: 'StorageBackup',
  directives: {
    tooltip,
  },
  components: {
    BmsBtn,
    CmSimpleBtn,
    CmSwitch,
    StorageBackupSelect,
    CmWeek,
    StorageBackupProgress,
  },
  data() {
    return {
      btnEditable: false, // 保存
      backupFinish: true, // 备份状态
      showProgress: false,
      backupConfig: defaultBackupConfig,
      history: '',
      path: '',
      compress: {
        filename: '',
        name: '',
        path: '',
        size: 0,
        totalSize: 100,
      },
      timer: null,
      event: null,
      isHover: false,
      showNameFlag: false, // 提示框
      tipsTop: -20,
    };
  },
  methods: {
    textWidth(text) {
      text = text.replace(/ /g, 'd'); // eslint-disable-line
      const sensor = $(`<span id="text-width">${text}</span>`).css({
        display: 'none',
        'font-family': 'helvetica',
        'font-size': '14px',
      });
      $('body').append(sensor);
      const width = sensor.width();
      sensor.remove();
      return width;
    },
    showWhole() {
      const eleWidth = this.$refs.historyInfo.getBoundingClientRect().width;
      if (eleWidth - this.textWidth(this.history) <= 35) {
        this.showNameFlag = true;
        this.$nextTick(() => {
          const tipHeight = this.$refs.showName.getBoundingClientRect().height;
          if (window.innerWidth > 1200) {
            if (tipHeight === 24) this.tipsTop = -20;
            else this.tipsTop = -35;
          } else if (window.innerWidth <= 1200 && window.innerWidth > 828) {
            if (tipHeight === 24) this.tipsTop = 17;
            else this.tipsTop = 5;
          } else {
            if (tipHeight === 40) this.tipsTop = 33;
            else this.tipsTop = 17;
          }
        });
      }
    },
    handleShow(type) {
      // console.log(type, this.showProgress);
      if (!type) {
        this.isHover = false;
      } else if (type && !this.backupFinish) {
        this.isHover = true;
      }
    },
    checkAll() {
      this.changeSelect(this.backupConfig.backup_opts);
      this.changeHost();
      this.changeUsername();
      this.changePassword();
      return false;
    },
    updateLastLog() {
      getLastBackup().then((res) => {
        const data = res.data.data;
        this.history = data.history;
      });
    },
    submit() {
      this.checkAll();
      // 保存备份配置
      const body = _.cloneDeep(this.backupConfig);
      body.backup_opts = JSON.stringify(body.backup_opts);
      body.weeks = JSON.stringify(body.weeks);
      setBackupConfig(body).then(() => {
        this.btnEditable = false;
      });
    },
    changeHost() {
      const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      const f = checkError({
        bool: reg.test(this.backupConfig.remote_host),
        tip: '标准ipv4且不为空!',
      }, this.$refs.remote_host);
      this.toggleBtn(f);
    },
    changePath() {
      const f = checkError({
        bool: /^\/.*\/$/.test(this.backupConfig.path),
        tip: '以/开始以/结束!',
      }, this.$refs.path);
      this.toggleBtn(f);
    },
    changePort() {
      const f = checkError({
        bool: /(^[0]$)|(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/.test(this.backupConfig.port),
        tip: '0-65535之间且不为空',
      }, this.$refs.port);
      this.toggleBtn(f);
    },
    changeTime() {
      const f = checkError({
        bool: /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(this.backupConfig.backup_time),
        tip: '以:分割24小时制且不为空!',
      }, this.$refs.backup_time);
      this.toggleBtn(f);
    },
    changeSelect(val) {
      this.backupConfig.backup_opts = val;
      const f = checkError({
        bool: this.backupConfig.backup_opts.length > 0,
        tip: '必选!',
      }, this.$refs.backup_opts);
      this.toggleBtn(f);
    },
    changeUsername() {
      const f = checkError({
        bool: this.backupConfig.username.length > 0 && !checkSpecial(this.backupConfig.username),
        // bool: /^[A-Za-z0-9]{6,8}$/.test(this.backupConfig.username),
        tip: '不能为空且不能包含特殊字符!',
        // tip: '6-8位且不为空!',
      }, this.$refs.username);
      this.toggleBtn(f);
    },
    changePassword() {
      const f = checkError({
        bool: this.backupConfig.password.length > 0,
        // bool: /^[A-Za-z0-9]{6,8}$/.test(this.backupConfig.password),
        tip: '不为空!',
        // tip: '6-8位且不为空!',
      }, this.$refs.password);
      this.toggleBtn(f);
    },
    changeWeek() {
      const f = checkError({
        bool: this.backupConfig.weeks.length > 0,
        tip: '不为空!',
      }, this.$refs.weeks);
      this.toggleBtn(f);
    },
    changeAutoStatus(val) {
      // 是否开启自动备份
      this.backupConfig.auto_backup = val;
      this.toggleBtn();
    },
    clickBackup() {
      if (this.backupFinish) {
        // 立即备份
        this.backupFinish = false;
        const body = _.cloneDeep(this.backupConfig);
        body.backup_opts = JSON.stringify(body.backup_opts);
        body.weeks = JSON.stringify(body.weeks);
        toggleBackup(body).then((res) => {
          const data = res.data;
          if (data.code !== 0) {
            this.backupFinish = true;
          }
        });
        this.eventListener();
      } else {
        // 查看中进度
        this.showProgress = true;
      }
    },
    toggleBtn(val = true) {
      Object.keys(this.$refs).forEach((item) => {
        if (this.$refs[item] && this.$refs[item].classList.contains('error-input')) {
          val = false; // eslint-disable-line
          return; // eslint-disable-line
        }
      });
      this.btnEditable = val;
    },
    eventListener() {
      this.event = new EventSource('/zh-cn/manager/backup/get/');
      const _this = this;
      this.timer = window.setInterval(() => {
        if (!_this.backupFinish) {
          _this.event.close();
          _this.eventListener();
        }
      }, 5000);
      this.event.addEventListener('eof', () => {
        // const data = _.cloneDeep(JSON.parse(res.data));
        _this.backupFinish = true;
        _this.event.close();
        _this.showProgress = false; // 关闭备份动态
        // 更新最新一次备份状态
        // if (data.error === 0) {
        //   delBackup();
        // }
        delBackup();
        window.clearInterval(_this.timer);
      });
      this.event.addEventListener('compress_bar', (res) => {
        const data = _.cloneDeep(JSON.parse(res.data));
        data.name = '备份';
        data.path = _this.path;
        data.size = Number(data.size);
        _this.compress = data;
      });
      this.event.addEventListener('transfer_bar', (res) => {
        const data = _.cloneDeep(JSON.parse(res.data));
        data.name = '传输';
        data.path = _this.path;
        data.size = Number(data.size);
        data.filename = data.dirname;
        _this.compress = data;
      });
    },
  },
  mounted() {
    this.updateLastLog();
    getConfig().then((res) => {
      const data = res.data.data;
      this.backupConfig = data;
    });
    this.eventListener();
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
    this.event.close();
  },
  watch: {
    backupFinish() {
      // console.log('getlog');
      this.updateLastLog();
    },
  },
};
</script>

<style lang="scss">
.backup_wrap{
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
  .repeat-span{
    .week-btn-wrap{
      // vertical-align: -9px !important;
      .active{
        background: #49afa2;
      }
      li{
        color: #fff;
        &:first-child{
          border-radius: 3px 0 0 3px;
        }
        &:last-child{
          border-radius: 0 3px 3px 0;
        }
      }
    }
  }
  .hand-backup{
    .manage-namePops{
      left: auto !important;
      right: 10px !important;
      line-height: initial !important;
    }
  }
  .col-xss-2{
    max-width: 90px; 
  }
  .col-xss-4{
    width: calc((100% - 90px) / 3);
  }
}
</style>
<style lang="scss" scoped>
@import '../../../../assets/css/col.css';

p{
    margin: 0;
  }
.backup_wrap{
  .backup-item{
    height: 50px;
    line-height: 50px;
    color: #ddd;
    font-size: 14px;
    input{
      height: 30px;
      line-height: 30px;
      background: transparent;
      border: 1px solid #4ab2a5;
      color: #ddd;
      padding-left: 10px;
      border-radius: 3px;
      box-sizing: border-box
    }
    input:focus{
      outline: none;
    }
    .col-xss-4{
      >span{
        display: inline-block;
        width: 63px;
        text-align: right;
        padding-right: 7px;
      }
    }
    .repeat-span{
      white-space: nowrap;
      display: inline-block;
      padding: 0 8px;
    }
    &.auto-backup, .remote-addr{
      clear: both;
    }
  }
  .hand-backup{
    margin: 10px 0;
    line-height: 41px;
    position: relative;
    .manage-namePops {
      position: absolute;
      word-wrap: break-word;
      word-break: break-all;
      z-index: 300;
      padding: 3px;
      border: 1px solid rgb(68, 110, 134);
      border-radius: 2px;
      background: rgb(24, 65, 95);
      box-sizing: content-box;
      font-size: 12px;
      &:after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-top: 5px solid rgb(24, 65, 95);
        z-index: 307;
        left: calc(50% + 2px);
        bottom: -10px;
      }
      &:before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border: 7px solid transparent;
        border-top: 7px solid rgb(68, 110, 134);
        z-index: 306;
        left: 50%;
        bottom: -14px;
      }
    }
  }
  .backup-status-wrap{
    // margin: 10px 0;
    display: inline-block;
    height: 41px;
    vertical-align: middle;
    // padding: 0 10px;
    .backup-btn{
      float: left;
      margin: 6px 10px 0 10px;
    }
    .finish-detail{
      display: inline-block;
      width: calc(100% - 125px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #4c4b4b;
    }

  }
  .title{
    width: 100px;
    float: left;
    line-height: 33px;
    text-align: left;
    color: #4ab2a5;
    font-size: 16px;
  }
  .save-btn{
    float: right;
    margin-top: 6px;
  }
  .backup-host, .backup-path, .backup-port, .backup-username, .backup-psd{
    width: calc(100% - 75px);
  }
  .backup-swtich{
    display: inline-block;
    margin-left: -15px;
    margin-right: 10px;
  }
  .backup-time{
    width: calc(100% - 70px);
  }
  .backup-repeat{
    display: inline-block;
    vertical-align: middle;
    min-width: 224px;
    margin-bottom: -18px;
  }
}
@media (max-width: 1100px) {
  .backup_wrap {
    .auto-backup{
      height: 85px;
    }
    .repeat-span{
      width: 100%;
    }
  }
}
</style>
