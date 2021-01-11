<template>
  <div class="about-content-div" ref="about_container">
    <Cmtip :tipContent="cmtipMessage" v-if="showcmTips" :closeFn="() => showcmTips = false"
           :showFooter="showFooter"
           @on-confirm="sureUpdate">
    </Cmtip>
    <div v-if="showBc" class="bc">
      <div class="bc-child"></div>
      <img src="../../../assets/sys-icon/updateloading.gif"/>
    </div>
    <div id="license">
        <div class="license-wrap" :class="{'resize-style': resizeFlag}">
            <div class="license-top" v-if="currentActive===0">
                <div style="margin-left:25px;">
                    <p style="margin-top:100px;">注册码: {{licenseData.registration_code}}</p>
                    <p style="color:#565f66;margin-top:5px;">license证书未配置，请上传license证书！</p>
                    <div class="license-upload"  v-if="this.session$.newpermissions.manage_license_edit">
                        <p>上传证书</p>
                        
                        <!-- <form method="post" action="/zh-cn/manager/update_license/" enctype="multipart/form-data"> -->
                          <div class="upload-wrap">
                            <transition name="fade"> 
                              <div v-if="overStatus !== 0"><div :class="{'tool-tip':true, 'tip-over-style':overStatus===2, 'tip-willover-style': overStatus===1}"><p>{{tipText}}</p></div><div :class="{'san':true,'san-over-style':overStatus===2, 'san-willover-style': overStatus===1}"></div></div>
                            </transition>  
                            <!-- <input type="hidden" name="csrfmiddlewaretoken" :value="token"> -->
                            <input class="text" id="text-1" @click="choiceFileInput(1)" type="text" v-model="uploadFileName" style="padding-left:10px;padding-right:10px;"/>
                            <button id="liulan-button-2" @click="choiceFileInput(1)">浏览</button>
                            <input class="file" ref="fileinput1" id="file-1" type="file" name="license_file" @change="changeFile"/>
                          </div>
                          <button @click="upload" :disabled="btnActive">上传证书</button>
                        <!-- </form> -->
                    </div>
                </div>
                
            </div>
            <div class="license-top" v-if="currentActive===1">
                <div style="margin-left:25px;">
                    <div class="row"><p class="p-1">注册码:</p><p style="margin-left:20px;">{{licenseData.registration_code}}</p></div>
                    <div class="row"><p class="p-1">有效期(始):</p><p style="margin-left:20px;">{{startTime}}</p></div>
                    <div class="row"><p class="p-1">有效期(至):</p><p style="margin-left:20px;"  :style="{ color: licenseOverColor }">{{endTime}}</p></div>
                    <div class="row"><p class="p-1">流量大小:</p><p style="margin-left:20px;">{{licenseData.traffic_limit}}</p></div>
                    <div class="row"><p class="p-1">监控节点数量:</p><p style="margin-left:20px;">{{licenseData.intf_num_limit}}</p></div>
                    <div class="row"><p class="p-1">授权状态:</p><p style="margin-left:20px;"  :style="{ color: licenseOverColor }">{{licenseData.authorization_status}}</p></div>
                    <div class="row" style="margin-bottom:10px;"><p class="p-1">授权对象:</p><p style="margin-left:20px;">{{licenseData.authorization_company}}</p></div>
                    
                    <div class="license-upload" v-if="this.session$.newpermissions.manage_license_edit" >
                        <p>更新证书</p>
                        <div class="upload-wrap">
                          <transition name="fade"> 
                            <div v-if="overStatus !== 0"><div :class="{'tool-tip':true, 'tip-over-style':overStatus===2, 'tip-willover-style': overStatus===1}"><p>{{tipText}}</p></div><div :class="{'san':true,'san-over-style':overStatus===2, 'san-willover-style': overStatus===1}"></div></div>
                          </transition>  
                          <input class="text" type="text" @click="choiceFileInput(2)" v-model="uploadFileName" style="padding-left:10px;padding-right:10px;"/>
                          <button id="liulan-button-2" @click="choiceFileInput(2)">浏览</button>
                          <input class="file" type="file" ref="fileinput2" @change="changeFile"/>
                        </div>
                        <button @click="upload" :disabled="btnActive">更新证书</button>
                    </div>
                </div>
            </div>
            <hr class="license-hr"/>
            <div class="license-bottom">
                <div class="canp-top">
                    <img src="../../../assets/settings/LOGO-02.svg" height="60">
                    <p>系统版本 5.1.0</p>
                    <button v-if="this.session$.newpermissions.upgrade_edit" @click="checkUpdate">检查更新</button>
                    <input v-if="this.session$.newpermissions.upgrade_edit" type="file" ref="updateFile" class="update-file" @change="changeUpdateFile"/>
                    <button v-if="this.session$.newpermissions.upgrade_edit" @click="choiceFileInput(3)">上传</button>
                </div>
                <div class="canp-bottom">
                    <p>版权©2018 Uxsino Technologies 北京优炫软件股份有限公司 保留所有权利</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import ProgressBar from '@/components/common/ProgressBar';
import Loading from '@/components/common/Loading';
import Cmtip from '@/components/basic/CmTip/CmTip';
import CmBtn from '@/components/common/CmBtn';
import { textWidth } from '@/helpers/utils';
import { getLicenseInfo, uploadLicense, checksystemupdate, getsystemupdate, postsystemupdate } from '@/pages/settings/service/index';
import jsCookie from 'js-cookie';
// import axios from 'axios';
import { setInterval, clearInterval } from 'timers';
// import { cesup } from '../service';

export default {
  components: { Cmtip, ProgressBar, Loading, CmBtn },
  data() {
    return {
      showBc: false,
      clientWidth: 0,
      clientHeight: 0,
      currentActive: 0, // 0为没有上传过证书，1为上传了证书
      token: jsCookie.get('csrftoken'),
      showcmTips: false,
      showSan: false,
      cmtipMessage: '证书上传成功',
      firstNumber: 2,
      showProcessBar: false,
      showFooter: false,
      // newPercent: 0,
      // showCtrls: false,
      // tipsLeft: 10,
      // tipsTop: 0,
      // showNameFlag: false, // 提示框
      // showTipsName: 'tishi111',
      licenseData: {
        authorization_company: '',
        authorization_status: '',
        end_ts: '1333333333333',
        intf_num_limit: '',
        registration_code: '',
        start_ts: '1333333333333',
        traffic_limit: '0',
        version: '',
      },
      uploadFileName: '',
      checkData: {},
      licenseOverColor: 'white',
      Form: new FormData(),
      file: {},
      overStatus: 0, // 0表示没有过期提醒，1表示将要过期， 2表示已过期
      tipText: '这是过期警告', // tip弹出警告信息
      uploaded: false, // 当点击上传后变为true
      overdue: false, // 判断是否显示过期警告
      btnActive: false,
      resizeFlag: false,
    };
  },
  mounted() {
    this.clientWidth = document.documentElement.clientWidth;
    this.clientHeight = document.documentElement.clientHeight;
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
    });
  },
  computed: {
    startTime() {
      return this.getLocalTime(this.licenseData.start_ts);
    },
    endTime() {
      return this.getLocalTime(this.licenseData.end_ts);
    },
    ...mapState({
      aboutMain: 'aboutMain',
      checkVersion: 'checkVersion',
      updatedVersion: 'updatedVersion',
      showLoading: 'showLoading',
    }),
    updateMessage() {
      if (this.checkVersion.status === 0) {
        this.checkVersion.msg = this.checkVersion.msg;
      } else {
        this.checkVersion.msg = '当前版本不是最新版本，是否更新？';
        this.showFooter = true;
      }
      return this.checkVersion.msg;
    },
    dataisOk() {
      return this.licenseData.registration_code !== '';
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    changeUpdateFile(e) {
      const _this = this;
      this.showBc = true;
      const updateForm = new FormData();
      updateForm.append('file', e.target.files[0]);
      updateForm.append('csrfmiddlewaretoken', this.token);
      postsystemupdate(updateForm).then((res) => {
        _this.showBc = false;
        _this.showcmTips = true;
        _this.showFooter = false;
        _this.cmtipMessage = res.data.msg;
      });
    },
    checkUpdate() {
      checksystemupdate().then((res) => {
        if (res.data.msg === '检查到更新的版本') {
          this.cmtipMessage = '检查到更新的版本，是否更新？';
          this.showcmTips = true;
          this.showFooter = true;
        } else {
          this.cmtipMessage = '已是最新版本。';
          this.showcmTips = true;
          this.showFooter = false;
        }
      });
    },
    choiceFileInput(num) {
      if (num === 1) {
        this.$refs.fileinput1.dispatchEvent(new MouseEvent('click'));
      } else if (num === 2) {
        this.$refs.fileinput2.dispatchEvent(new MouseEvent('click'));
      } else if (num === 3) {
        this.$refs.updateFile.dispatchEvent(new MouseEvent('click'));
      }
    },
    showTipfun(str) {
      // 显示tip3秒str
      let timenum = 0;
      this.tipText = str;
      const timer = setInterval(() => {
        timenum += 1;
        if (timenum > 10) {
          clearInterval(timer);
          this.overStatus = 0;
        }
      }, 1000);
    },
    getLocalTime(ns) {
      // 时间戳转时间
      const ti = new Date(ns);
      return `${ti.toLocaleDateString().replace(/\//g, '-')} ${ti.toTimeString().substr(0, 8)}`;
    },
    getTimeLong(endT, sysT) {
      // 获取当前时间到结束时间的长度
      const now = Math.floor(sysT) * 1000;
      if (endT > now) {
        return Math.floor((endT - now) / 1000 / 60 / 60 / 24);
      }
      return 0;
    },
    changeFile(e) {
      this.Form = new FormData();
      this.Form.append('csrfmiddlewaretoken', this.token);
      this.Form.append('license_file', e.target.files[0]);
      this.uploadFileName = e.target.files[0].name;
      this.btnActive = false; // 当文件被修改或选择，开启上传按钮
    },
    upload() {
      // 上传前先构建form
      this.btnActive = true; // 上传的时候屏蔽按钮
      uploadLicense(this.Form).then((res) => {
        // console.log(res.data);
        if (res.data.code === -3) {
          this.overStatus = 2;
          this.showTipfun('License证书错误,请重新上传！');
          // this.getInfo();
        } else {
          this.showcmTips = true;
          this.cmtipMessage = '证书上传成功';
          this.getInfo();
        }
        // this.btnActive = false;
        this.uploadFileName = '';
      }).catch((err) => {
        console.log(err);
        // this.btnActive = false;
        this.uploadFileName = '';
      });
    },
    getInfo() {
      // 获取 license 详情
      getLicenseInfo()
      .then((res) => {
        this.licenseData = res.data.data;
        // console.log(this.licenseData);
        // this.licenseData.authorization_status = '已过期';
        if (this.licenseData.authorization_status === '已过期') {
          this.currentActive = 1;
          this.licenseOverColor = 'red';
          this.overStatus = 2;
          this.showTipfun('License证书已过期，请重新上传！');
        } else if (this.licenseData.authorization_status === '已注册') {
          // this.overdue = true; // 开启过期警告提醒
          this.currentActive = 1;
          if (this.getTimeLong(this.licenseData.end_ts, res.data.data.ret_ts) <= 30) {
            this.overStatus = 1;
            this.showTipfun(`您的License证书将于${this.getTimeLong(this.licenseData.end_ts, res.data.data.ret_ts)}天后过期`);
          }
        } else if (this.licenseData.authorization_status === '未注册') {
          this.currentActive = 0;
        }
        if (res.data.code !== 0) {
          this.currentActive = 0;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    },
    manegeUpdate() {
      this.showProcessBar = false;
      this.showTips = true;
      this.$store.dispatch('checkUpdate');
    },
    closeTips() {
      this.showTips = false;
    },
    sureUpdate() {
      // 更新版本
      this.showBc = true;
      this.showcmTips = false;
      getsystemupdate().then((res) => {
        this.showBc = false;
        this.showTips = true;
        this.showFooter = false;
        this.cmtipMessage = res.data.msg;
      });
    },
    showWhole(content) {
      const width = textWidth(content);
      if (width > 197) {
        this.showNameFlag = true;
      }
    },
    resize() {
      const width = document.getElementsByTagName('body')[0].clientWidth;
      const height = document.getElementsByTagName('body')[0].clientHeight;
      width >= height * 2 ? this.resizeFlag = true : this.resizeFlag = false; // eslint-disable-line
    },
  },
};
</script>
<style lang="scss">
  html{
    height: 100%;
  }
</style>
<style lang="scss" scoped>
  .about-content-div{
    position: relative;
    height: 100%;
  }
  .bc{
    width: 100%;
    height: calc(100% + 115px);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -115px;
    z-index: 999;
    .bc-child{
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: black;
      opacity: 0.3;
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease-out;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .san{
  width: 0px;
  height: 0px;
  border-width: 5px 5px 0px 5px;
  border-color:red transparent;
  border-style: solid;
  // z-index: 999;
  position: absolute;
  top: -10px;
  left: 175px;
  }
  .san-over-style{
  border-color:#442224 transparent;
  }
  .san-willover-style{
  border-color:#402c21 transparent;
  }
  .tip-over-style{
    background-color: #442224;
    color: #a53b3f;
  }
  .tip-willover-style{
    background-color: #402c21;
    color: #b76937;
  }
  p{
      margin: 0px;
      line-height: 30px;
  }
  .row{
      display: flex;
      margin-bottom: 5px;
      .p-1{
        width:110px;
        text-align:right;
      }
  }
  #license{
      width: 100%;
      height: 100%;
  }
  .tool-tip{
    margin:0;
    padding:0;
    width: 240px;
    height: 30px;
    border-radius: 5px;
    // background-color: red;
    position: absolute;
    left: 65px;
    top: -40px;
    p{
      line-height: 30px;
      padding-left: 10px;
      padding-right: 10px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .license-upload{
      display: flex;
      align-items: center;
      position: relative;
      .file{
        position: absolute;
        width: 310px;
        height: 30px;
        top: 0;
        left: 65px;
        // cursor: pointer;
        opacity: 0;
        z-index: -10;
      }
  }
  .license-wrap{
      height: calc(100% - 40px);
      width:calc(100% - 30px);
      margin: 0 15px;
      border:1px solid #0e5a5a;
      &.resize-style{
        .license-top{
          margin-top: 2%;
        }
        .license-hr{
          margin-top: 1%;
        }
        .license-bottom{
          margin-top: 1%;
          .canp-bottom{
            padding-top: 5px;
          }
        }
      }
  }
  .license-top{
      overflow: hidden;
      height: 290px;
      width: 90%;
      border-left: 1px solid #13ceb9;
      margin-left: 70px;
      margin-top: 5%;
      color: white;
  }
  .text{
      width: 240px;
      height: 30px;
      border-radius: 3px;
      background-color: #09131c;
      border: 1px solid #2c6763;
      margin-left: 10px;
  }
  .license-hr{
      margin:0 auto;
      margin-top: 3%;
      width: 95%;
      border-top:1px solid #0b383d;
  }
  .license-bottom{
      height: 20%;
      width: 90%;
      border-left: 1px solid #13ceb9;
      margin-left: 70px;
      margin-top: 3%;
  }
  .canp-top{
      margin-left: 25px;
      display: flex;
      align-items: flex-end;
      padding-top: 1%;
      .update-file{
        width: 80px;
        position:absolute;
        left: 610px;
        height: 30px;
        z-index: -1;
      }
  }
  .canp-top p{
      margin:0;
      color:white;
      margin-left: 40px;
  }
  .canp-top button{
      width: 80px;
      height: 30px;
      border: 1px solid #17c8b4;
      background-color: #09131c;
      border-radius: 3px;
      color: #17bfa6;
      margin-left: 10px;
      cursor: pointer;
  }
  .canp-bottom{
      margin-left: 25px;
      margin-top: 5px;
      padding-top: 1%;
  }
  .canp-bottom p{
      margin:0;
      color: #3c918a;
  }
  .license-upload button{
      width: 80px;
      height: 30px;
      border: 0;
      background-color: #17c8b4;
      border-radius: 3px;
      color: #ffffff;
      margin-left: 10px;
      cursor: pointer;
  }

  #liulan-button{
      width: 60px;
      height: 29.5px;
      border: 1px solid #17c8b4;
      background-color: #09131c;
      border-radius: 3px;
      color: #17bfa6;
      margin-left: 10px;
      cursor: pointer;
  }
  #liulan-button-2{
      width: 60px;
      height: 29.5px;
      border: 1px solid #17c8b4;
      background-color: #09131c;
      border-radius: 3px;
      color: #17bfa6;
      margin-left: 10px;
      cursor: pointer;
  }
</style>

