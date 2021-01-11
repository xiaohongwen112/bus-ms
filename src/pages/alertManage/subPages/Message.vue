<template>
  <div>
    <CmTip v-if="showTips" :closeFn="() => showTips = false"
      :tipContent="tipContent" :showFooter="showFooter"
      @on-confirm="deleteBaseLine">
    </CmTip>
    <h3 v-show="false" v-text="'消息推送管理'"></h3>
    <header>
      <SubTabs class="sub-tabs" :list="msgNavList" :active="subnavActiveIndex"
        @click="toggleNavActive"/>
    </header>
    <ScrollBar class="scrollBar" v-if="showScroll">
      <div :class="['input-list', `type-${serverType}`]">
        <div v-show="subnavActiveIndex > 0" class="input-rows">
          <!-- 短信配置 -->
          <label class="title required" v-text="'类型'"></label>
          <div class="radio-type">
            <span v-for="(item, index) in msgNavList[subnavActiveIndex].typeList" :key="index + Math.random()">
              <input type="radio" :name="msgNavList[subnavActiveIndex].key" :value="item.key" v-model="serverType"/>{{ item.name }}
            </span>
          </div>
        </div>
        <div v-for="(key, index) in curConfigList" :key="index" class="input-rows" 
        v-if="!(Object.keys(curConfigData).indexOf('auth') !== -1 && isAuth === false && (key === 'username' || key === 'password'))">
          <label :class="{'required': mapRender[key].require, 'title': true}" v-text="mapRender[key].label"></label>
          <span v-if="mapRender[key].type === 'select'">
            <CmSelect :width="340" :list="mapRender[key].options" :selectVal="curConfigData[key] || mapRender[key].default || mapRender[key].options[0]"
              @on-change="changeSelect($event, key)"/>
          </span>
          <div class="yesorno" v-else-if="mapRender[key].type === 'radio'">
            <!-- 第三方接口 -->
            <input type="radio" :value="true" v-model="isAuth" name="yon"/><span>是</span>
            <input type="radio" :value="false" v-model="isAuth" name="yon"/><span>否</span>
          </div>
          <span v-else>
            <AlertTip :tipContent="spaceMsg[key]" 
            :width="340" :show="spaceError[key] && spaceErrorHover[key]" 
            :isRight="!spaceError[key] && spaceIsRight[key]">
              <CmInput :width="340" :inputType="mapRender[key].type" :placeholder="mapRender[key].hasOwnProperty('placeholder') ? mapRender[key].placeholder : ''"
              :maxlength="mapRender[key].len" v-model="curConfigData[key]" :errorFlag="spaceError[key]"
              @on-change="changeInput(key)" @blur="blurInput(key, mapRender[key].require)"
              @mouseover="mouseIn(key)" @mouseout="mouseOut(key)"></CmInput>
            </AlertTip>
          </span>
          <span class="unit" v-if="mapRender[key].hasOwnProperty('unit')">{{ mapRender[key].unit }}</span>
          <!-- <p class="must" v-if="serverType === 'EMAIL' && mapRender[key].label === '邮件服务器地址'">必须填</p> -->
          <p class="remark" v-if="['EMAIL', 'SMD'].includes(serverType) && mapRender[key].hasOwnProperty('remark')" v-text="mapRender[key].remark"></p>
        </div>
      </div>
      <footer class="rbutton">
        <BmsBtn type="main" @click="clickTest">测试发送</BmsBtn>
        <BmsBtn type="main" @click="clickSave">保存</BmsBtn>
        <CmSimpleBtn type="main" @click="reset">重置</CmSimpleBtn>
      </footer>
    </ScrollBar>
  </div>
</template>
<script>
import _ from 'lodash';
// import CmTip from '@/components/basic/CmTip/CmTip';
import { SubTabs, BmsBtn, CmSimpleBtn, CmInput, CmSelect, CmTip, ScrollBar } from '@/components/basic/index';
import { getMsgConfig, postMsgConfig, testMsgConnect } from '../service';
import { msgNavList, msgConfigList, mapMsgRenderData } from '../utils';
import AlertTip from './contact/alert/alertTip';

export default {
  name: 'message',
  components: {
    SubTabs, BmsBtn, CmSimpleBtn, CmInput, CmSelect, CmTip, AlertTip, ScrollBar,
  },
  data() {
    return {
      showScroll: true,
      isAuth: true,
      showFooter: true,
      msgNavList,
      mapRender: mapMsgRenderData,
      subnavActiveIndex: 0,
      curValue: '',
      list: ['所有'],
      curSelect: '所有',
      serverType: 'EMAIL',   // EMAIL,SMD,SMS,TIVOLI,SIMO,INTERFACE
      curConfigList: [],
      curConfigData: {},
      encrypt: true,
      spaceError: {}, // 用于存空错误
      spaceErrorHover: {}, // 当悬浮鼠标时
      spaceIsRight: {}, // 当输入后正确
      spaceMsg: {},
      showTips: false,
      tipContent: '重置该配置?',
      storePassword: '', // 暂存的密码
      msgConfig: [], // 保存返回的信息。
      reqType: '', // 请求发送类型
    };
  },
  methods: {
    reset() {
      this.showTips = true;
      this.tipContent = '重置该配置?';
      this.showFooter = true;
    },
    mouseIn(key) {
      const obj = {};
      obj[key] = true;
      this.spaceErrorHover = Object.assign({}, this.spaceErrorHover, obj);
    },
    mouseOut(key) {
      const obj = {};
      obj[key] = false;
      this.spaceErrorHover = Object.assign({}, this.spaceErrorHover, obj);
    },
    toggleNavActive(data) {
      // console.log(data.data.key);
      this.subnavActiveIndex = data.index;
      // this.$router.push({ name: data.data.key });
      let type = 'EMAIL';
      switch (data.index) {
        case 0:
          type = 'EMAIL';
          break;
        case 1:
          type = 'SMD';
          break;
        default:
          type = 'SIMO';
      }
      this.serverType = type;
      this.init();
    },
    init() {
      //
      this.showScroll = false;
      let index = 0;
      switch (this.serverType) {
        case 'EMAIL':
          index = 0;
          break;
        case 'SMD':
          index = 1;
          break;
        case 'SMS':
          index = 2;
          break;
        case 'TIVOLI':
          index = 3;
          break;
        default:
          index = 4;
      }
      this.curConfigList = msgConfigList[index];
      this.curConfigData = {};
      // 这里初始化一下curConfigData
      this.spaceError = {};
      this.spaceIsRight = {};
      this.spaceMsg = {};
      this.curConfigList.forEach((e) => {
        if (this.mapRender[e].type === 'select') {
          this.curConfigData[e] = this.mapRender[e].default || this.mapRender[e].options[0];
        } else if (this.mapRender[e].type === 'radio') {
          this.curConfigData[e] = true;
        } else {
          this.curConfigData[e] = '';
        }
      });
      this.encrypt = true;
      if (this.serverType === 'SMD' || this.serverType === 'SMS') {
        this.reqType = 'MESSAGE';
      } else if (this.serverType === 'SIMO' || this.serverType === 'INTERFACE') {
        this.reqType = 'INTERFACE';
      } else {
        this.reqType = this.serverType;
      }
      getMsgConfig(this.reqType).then((res) => {
        const data = res.data.data;
        this.msgConfig = data;
        const getTrueIndex = data.findIndex(e => e.selected === true);
        // const getTypeIndex = data.findIndex(e => e.server_type === this.serverType);
        if (data && getTrueIndex !== -1) {
          this.serverType = data[getTrueIndex].server_type;
          this.curConfigData = Object.assign({}, this.curConfigData, data[getTrueIndex].config);
          if (Object.keys(this.curConfigData).indexOf('auth') !== -1) {
            this.isAuth = this.curConfigData.auth;
          }
          if (this.curConfigData.port && this.curConfigData.format) {
            this.curConfigData.serial_port = this.curConfigData.port;
            delete this.curConfigData.port;
          }
          this.storePassword = this.curConfigData.password;
        }
        this.showScroll = true;
      });
    },
    changeSelect(newV, key) {
      console.log(newV, key);
      this.curConfigData[key] = newV;
    },
    changeInput(type) {
      if (type === 'password') {
        this.encrypt = false;
      }
    },
    checkOfTip(name, val, reg, require = true) {
      // console.log(name, val, reg);
      let checkoutRes = true;
      let tipMsg = '';
      // console.log(reg.test(val));
      if (require && val === '') {
        checkoutRes = false;
        tipMsg = `${name}未输入内容`;
      } else if (require && !reg.test(val)) {
        checkoutRes = false;
        tipMsg = `${name}输入内容不符合格式`;
      }
      if (!checkoutRes) {
        CmTip.confirm({
          tipTitle: '提示',
          tipContent: tipMsg,
        });
      }
      return checkoutRes;
    },
    clickTest() {
      // 保存前检测一遍
      let isOk = true;
      // const _this = this;
      Object.keys(this.curConfigData).forEach((e) => {
        if (e !== 'recipient' && e !== 'test_email' && e !== 'encrypt' && e !== 'auth' && !this.VerifybfSave(e)) {
          isOk = false;
        }
      });
      // 邮件服务-校验测试邮箱
      if (isOk && this.serverType === 'EMAIL') {
        isOk = this.checkOfTip('测试邮箱', this.curConfigData.test_email, this.mapRender.test_email.regex);
      }
      if (isOk && ['SMD', 'SMS'].includes(this.serverType)) {
        isOk = this.checkOfTip('测试号码', this.curConfigData.recipient, this.mapRender.recipient.regex);
      }
      if (!isOk) {
        return;
      }
      if (this.curConfigData.password && this.curConfigData.password !== this.storePassword) {
        this.encrypt = false;
      }
      // console.log('test');
      const reqData = Object.assign({}, this.curConfigData, { encrypt: this.encrypt });
      if (_.has(reqData, 'test_email')) {
        reqData.recipient = reqData.test_email;
        delete reqData.test_email;
      }
      if (reqData.serial_port) {
        reqData.port = reqData.serial_port;
        delete reqData.serial_port;
      }
      if (reqData.vendor_service) {
        reqData.vendor = reqData.vendor_service;
        delete reqData.vendor_service;
      }
      if (!reqData.password) {
        delete reqData.encrypt;
      }
      testMsgConnect({
        server_type: this.serverType,
        config: JSON.stringify(reqData),
      }).then();
    },
    blurInput(key) {
      // if (!['test_email'].includes(key)) {
      this.VerifybfSave(key, this.mapRender[key].require);
      // }
    },
    VerifybfSave(key, require = true) {
      let isOk = true;
      // console.log(key, this.curConfigData[key], this.curConfigData[key].search(this.mapRender[key].regex));
      if ((require && this.curConfigData[key] === '') || (this.mapRender[key].regex && this.curConfigData[key].search(this.mapRender[key].regex) === -1)) {
        isOk = false;
        // this.spaceError[key] = true;
        const obj = {};
        obj[key] = true;
        this.spaceError = Object.assign({}, this.spaceError, obj);
        const robj = {};
        robj[key] = false;
        this.spaceIsRight = Object.assign({}, this.spaceIsRight, robj);
        this.spaceMsg[key] = '输入内容不符合格式，请重新输入';
        if (require && this.curConfigData[key] === '') {
          this.spaceMsg[key] = '未输入内容';
        } else if (!require && this.curConfigData[key] === '') {
          // delete this.spaceMsg[key];
          delete this.spaceError[key];
          isOk = true;
        }
      } else {
        delete this.spaceError[key];
        this.spaceError = Object.assign({}, this.spaceError);
        const robj = {};
        robj[key] = true;
        this.spaceIsRight = Object.assign({}, this.spaceIsRight, robj);
      }
      // console.log(this.curConfigData, this.curConfigList);
      return isOk;
    },
    clickSave() {
      // 保存前检测一遍
      let isOk = true;
      // const _this = this;
      Object.keys(this.curConfigData).forEach((e) => {
        if (Object.keys(this.curConfigData).indexOf('auth') && this.curConfigData.auth === false && (e === 'username' || e === 'password')) {
          isOk = true;
        } else if (e !== 'recipient' && e !== 'test_email' && e !== 'encrypt' && e !== 'auth' && !this.VerifybfSave(e)) {
          isOk = false;
        }
      });
      if (!isOk) {
        return;
      }
      if (this.curConfigData.password && this.curConfigData.password !== this.storePassword) {
        this.encrypt = false;
      }
      const reqData = Object.assign({}, this.curConfigData, { encrypt: this.encrypt });
      if (reqData.serial_port) {
        reqData.port = reqData.serial_port;
        delete reqData.serial_port;
      }
      // 移除测试邮箱（不保存）
      if (_.has(reqData, 'test_email')) {
        delete reqData.test_email;
      }
      if (reqData.vendor) {
        delete reqData.recipient;
      }
      // if (reqData.user) {
      //   reqData.username = reqData.user;
      //   delete reqData.user;
      //   // reqData.auth = reqData.Authentication;
      //   // delete reqData.Authentication;
      // }
      if (reqData.vendor_service) {
        reqData.vendor = reqData.vendor_service;
        delete reqData.vendor_service;
        delete reqData.encrypt;
        delete reqData.recipient;
      }
      postMsgConfig({
        server_type: this.serverType,
        config: JSON.stringify(reqData),
      }).then((res) => {
        const data = res.data;
        if (data.code === 0) {
          this.showTips = true;
          this.tipContent = '保存成功';
          this.showFooter = false;
          const sindex = this.msgConfig.findIndex(e => e.server_type === this.serverType);
          if (sindex === -1) {
            this.msgConfig.push({
              selected: true,
              server_type: this.serverType,
              config: reqData,
            });
          } else {
            this.msgConfig[sindex] = Object.assign({}, {
              selected: true,
              server_type: this.serverType,
              config: reqData,
            });
          }
        } else {
          this.showTips = true;
          this.tipContent = '保存失败';
          this.showFooter = false;
        }
      });
    },
    clickReset() {
      this.init();
    },
    deleteBaseLine() {
      this.clickReset();
      this.showTips = false;
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    serverType() {
      let index = 0;
      switch (this.serverType) {
        case 'EMAIL':
          index = 0;
          break;
        case 'SMD':
          index = 1;
          break;
        case 'SMS':
          index = 2;
          break;
        case 'TIVOLI':
          index = 3;
          break;
        default:
          index = 4;
      }
      this.curConfigList = msgConfigList[index];
      this.curConfigData = {};
      // 这里初始化一下curConfigData
      this.spaceError = {};
      this.spaceIsRight = {};
      this.spaceMsg = {};
      this.curConfigList.forEach((e) => {
        if (this.mapRender[e].type === 'select') {
          this.curConfigData[e] = this.mapRender[e].default || this.mapRender[e].options[0];
        } else if (this.mapRender[e].type === 'radio') {
          this.curConfigData[e] = true;
        } else {
          this.curConfigData[e] = '';
        }
      });
      this.encrypt = true;
      const data = this.msgConfig;
      // const getTrueIndex = data.findIndex(e => e.selected === true);
      const getTypeIndex = data.findIndex(e => e.server_type === this.serverType);
      if (data && getTypeIndex !== -1) {
        this.curConfigData = Object.assign({}, this.curConfigData, data[getTypeIndex].config);
        if (Object.keys(this.curConfigData).indexOf('auth') !== -1) {
          this.isAuth = this.curConfigData.auth;
        }
        if (this.curConfigData.port && this.curConfigData.format) {
          this.curConfigData.serial_port = this.curConfigData.port;
          delete this.curConfigData.port;
        }
        this.storePassword = this.curConfigData.password;
      }
    },
    isAuth() {
      this.curConfigData.auth = this.isAuth;
    },
  },
};
</script>

<style lang="scss" scoped>
.scrollBar{
  height: calc(100% - 39px);
}
input[type="radio"]{
    height: 14px;
    vertical-align: middle;
    width: 14px;
    border: 1px solid #278c89;
    border-radius: 3px;
    margin: 0 4px;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;
    margin-bottom: 2px;
    &:checked{
      background: #139d8c url(../../../assets/common/checked.svg) 1px center;
      background-size: 180% 180%;
      background-position-x: -4.5px;
    }
  }
.sub-title{
  // line-height: 70px;
  margin: 25px 0 25px 0;
  padding-left: 15px;
}
.input-list{
  margin-top: 40px;
}
.input-rows{
  position: relative;
  width: 530px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-top: 20px;
  label{
    margin-right: 20px;
  }
  .radio-type{
    width: 340px;
    input{
      // height: 30px;
      margin-right: 5px;
    }
    span{
      // height:30px;
      line-height: 30px;
      margin-right: 25px;
    }
  }
  .yesorno{
    width: 340px;
    input{
      // height: 30px;
      margin-right: 5px;
    }
    span{
      // height:30px;
      line-height: 30px;
      margin-right: 50px;
    }
  }
  .unit{
    position: absolute;
    left: 540px;
    top: 3px;
  }
}
.remark{
  margin-top: 10px;
  position: relative;
  left: 60px;
  color: gray;
}
.type-EMAIL .remark{
  left: 60px;
}

.type-SMD .remark{
  left: -97px;
}
.must{
  width: 500px;
  margin-top: 10px;
  position: relative;
  left: 160px;
  color: gray;
}
.rbutton{
  width: 530px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-top: 20px;
  button{
    margin-left: 10px;
  }
}

</style>
