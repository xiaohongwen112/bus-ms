<template>
  <!-- <div id="edit-people"> -->
    <!-- <div > -->
      <ConfigBox class="alert" :hideStore="false" :width="1150" :height="460" :tabs="tabs" :active="active" @saveConfig="save" @closeConfig="close">
        <div class="alert-content"  :slot="tabs[0].id">
          <ScrollBar class="scroll">
            <div class="row-1">
              <p class="name"><span v-if="operation !== 2" style="color:red;">*  </span>姓名</p>
              <AlertTip :tipContent="tipContent_name" :isRight="nameisRight" :show="showNameTip && showName">
              <input @blur="checkName" @mouseover="() => {showName = true}" @mouseout="() => {showName = false}" :class="inputError.name ? 'red-input' : 'name-input'" v-model="data.name" type="text" :disabled="disabledList.name" :style="disabledList.name ? 'border:1px solid #212b33' : ''">
              </AlertTip>
              <p class="input-tip" v-if="operation !== 2">姓名以中英文字符开始，且长度为2-10的中文、英文字符组成。</p>
            </div>
            <div class="row-2">
              <p class="tel"><span v-if="operation !== 2" style="color:red;">*  </span>手机号码</p>
              <AlertTip :tipContent="tipContent_tel" :show="showTelTip && showTel" :isRight="telisRight" @close="()=>{ showTelTip = false }">
                <input @blur="checkTel" @mouseover="() => {showTel = true}" @mouseout="() => {showTel = false}" maxlength="11" v-model="data.tel" :class="inputError.tel ? 'red-input' : 'tel-input'" type="text" :disabled="disabledList.tel"  :style="disabledList.tel ? 'border:1px solid #212b33' : ''">
              </AlertTip>
              <p class="email"><span v-if="operation !== 2" style="color:red;">*  </span>邮箱地址</p>
              <AlertTip :tipContent="tipContent_email" :show="showEmailTip && showEmail" :isRight="emailisRight" @close="()=>{ showEmailTip = false }">
                <input @blur="checkEmail" @mouseover="() => {showEmail = true}" @mouseout="() => {showEmail = false}" type="text" maxlength="63" v-model="data.email" :class="inputError.email ? 'red-input' : 'email-input'" :disabled="disabledList.email"  :style="disabledList.email ? 'border:1px solid #212b33' : ''">
              </AlertTip>
            </div>
            <div class="group-detail" v-if="operation === 2 && propData.group">
              <p class="message">所属组</p>
              <span style="height:25px;line-height:25px;">{{groupStr}}</span>
            </div>
            <div class="row-3">
              <p class="message">消息免打扰</p>
              <div class="set-disturb-message">
                <!-- 消息免打扰 -->
                <div class="week-row" :style="disabledList.weekCheck ? 'opacity: 0.5' : ''" v-if="operation !== 2">
                  <CmWeek class="alert-week" :require="true" :weekValue="week_days" @click="changeWeek"/>
                </div>
                <div class="date-set" v-if="operation !== 2">
                  <TimeAxis :error="timeError" :timeList="times" @timeChange="timeChange"/>
                  <BmsBtn class="save-date" type="popsUp"
                  :style="((checkTime !== '-1' || timeSetList[week_days.join(',')]) && JSON.stringify(timeSetList) !== '{}') && 
                  JSON.stringify(timeSetList[week_days.join(',')]) === JSON.stringify(times.map(e=>[e.ts_start, e.ts_end]))
                  ? 'background-color:gray;': ''"
                  @click="saveDate">{{(checkTime !== '-1' || timeSetList[week_days.join(',')]) && JSON.stringify(timeSetList) !== '{}' ? '保存' : '添加'}}</BmsBtn>
                </div>
                <span style="height:25px;line-height:25px;" v-if="operation===2 && JSON.stringify(timeSetList) === '{}'">未设置</span>
                <ScrollBar class="date-list" v-if="operation !== 2 || operation === 2 && JSON.stringify(timeSetList) !== '{}'">
                  <div class="date-one" v-for="(item, key, index) in timeSetList" :style="(checkTime === key || week_days.join(',') === key) && operation !== 2 && checkTime !== '-1'? 'background-color: #0b2d48;' : ''" :key="index" @click="clickCheckTime(key)">
                    <div class="spans">
                      <span v-for="i in key.split(',')" :key="i">{{getWeek(Math.floor(i))}} </span>
                    </div>
                    <div class="time-list">
                      <div class="time-one" v-for="(titem, tindex) in item" :key="tindex" @click="delOneTime($event, key, tindex)">
                        <span>{{getTime(titem[0])}}-{{getTime(titem[1])}}</span>
                        <img v-if="operation !== 2" src="../../../../../assets/common/close.svg" width="10" height="10">
                      </div>
                    </div>
                    <div class="delete" v-if="operation !== 2">
                      <img src="../../../../../assets/protocol/pro-delete.svg" width="20" height="20" @click="delOneDate(key)">
                    </div>
                  </div>
                </ScrollBar>
              </div>
            </div>
            <div class="row-4">
              <p class="row-4-p">告警过滤</p>
              <div class="level">
                <span v-if="operation === 2 && propData.follow_alert_level !== 0 || operation !== 2">只允许接收</span>
                <Select v-if="operation === 2 && propData.follow_alert_level !== 0 || operation !== 2" :list="levelLists" :disable="selectDisable.length > 0" :selectVal="levelList" @on-change="(val) => {levelList = val}"
                  position="top"
                ></Select>
                <span v-if="operation === 2 && propData.follow_alert_level !== 0 || operation !== 2">及以上的告警。</span>
                <input v-if="operation !== 2" type="checkbox" style="margin-left:60px;" value="selectDisable" v-model="selectDisable">
                <span v-if="operation === 2 && propData.follow_alert_level === 0 || operation !== 2" style="height:25px;line-height:25px;">不接收告警</span>
              </div>
            </div>
            <div class="bc" v-if="disabledList.weekCheck"></div>
            <!-- <div class="bc-2" v-if="JSON.stringify(propData) !== '{}' && propData.is_modify !== true"></div> -->
          </ScrollBar>
          <div class="footer">
            <hr class="hr"/>
            <div class="save-or-cancel">
              <BmsBtn style="margin-left:990px" type="popsUp" @click="save" v-if="operation !== 2">保存</BmsBtn>
              <CmSimpleBtn :style="operation !== 2 ? 'margin-left:10px':'margin-left:1070px'" type="popsUp" @click="close">{{operation === 2 ? '确认' : '取消'}}</CmSimpleBtn>
            </div>
          </div>
        </div>
      </ConfigBox>
    <!-- </div> -->
  <!-- </div> -->
</template>
<script>
import ScrollBar from '@/components/basic/ScrollBar';
import ConfigBox from '@/components/common/ConfigBox';
import CmWeek from '@/components/common/CmWeek';
import TimeAxis from '@/components/common/TimeScheduleAxis/index2';
import { BmsBtn, CmSimpleBtn } from '@/components/basic/index';
import Select from '../Select2';
import AlertTip from './alertTip';
import { addPeople, editPeople, checkContact } from './../../../service';

export default {
  components: {
    ConfigBox,
    CmWeek,
    TimeAxis,
    Select,
    BmsBtn,
    CmSimpleBtn,
    ScrollBar,
    AlertTip,
  },
  props: {
    operation: { // 0表示新建，1表示编辑，3表示详情
      type: Number,
      default: 0,
    },
    propData: {
      type: Object,
    },
  },
  data() {
    return {
      timeError: false,
      tipContent_name: '输入内容不符合格式，请重新输入',
      showNameTip: false,
      showName: false,
      nameisRight: false,
      tipContent_tel: '输入内容不符合格式，请重新输入',
      showTelTip: false,
      showTel: false,
      telisRight: false,
      tipContent_email: '输入内容不符合格式，请重新输入',
      showEmailTip: false,
      showEmail: false,
      emailisRight: false,
      selectDisable: [],
      disabledList: {
        name: false,
        tel: false,
        email: false,
        weekCheck: false,
      },
      inputError: { // 为true显示红色
        name: false,
        tel: false,
        email: false,
      },
      tabs: [
        { id: 'editPeople', text: '编辑联系人' },
      ],
      week_days: [0],
      times: [
        // {
        //   ts_start: 0,
        //   ts_end: 130,
        // },
      ],
      timeSetList: {},
      checkTime: '-1',
      errors: [],
      active: 0,
      levelLists: ['级别1：警告', '级别2：严重', '级别3：危急', '级别4：致命'],
      levelList: '级别3：危急',
      data: {
        name: '',
        tel: '',
        email: '',
        classify: '其他用户',
        switch: true,
        dontdisturb_time: {
          mts: {
            0: [[0, 120], [300, 600]],
          },
        },
        follow_alert_level: 3,
      },
      timeBaseItem: [], // 这是更改编辑时间段时为了修改保存按钮颜色而设置
    };
  },
  mounted() {
    if (JSON.stringify(this.timeSetList) !== '{}') {
      this.checkTime = Object.keys(this.timeSetList)[0];
      // console.log('ssssssssssss', this.timeSetList);
      this.times = this.timeSetList[this.checkTime].map((arr) => {
        console.log(arr);
        return { ts_start: arr[0], ts_end: arr[1] };
      });
    }
  },
  created() {
    // 设置头部
    switch (this.operation) {
      case 0:
        this.tabs = [{ id: 'newPeople', text: '新建联系人' }];
        break;
      case 1:
        this.tabs = [{ id: 'editPeople', text: '编辑联系人' }];
        // this.disabledList.name = true;
        break;
      case 2:
        this.tabs = [{ id: 'infoPeople', text: '联系人详情' }];
        this.disabledList.name = true;
        this.disabledList.tel = true;
        this.disabledList.email = true;
        this.disabledList.weekCheck = true;
        break;
      default:
        break;
    }
    this.init();
  },
  computed: {
    groupStr() {
      if (this.propData) {
        return this.propData.group;
      }
      return '';
    },
    resData() {
      const res = Object.assign({}, this.data);
      res.dontdisturb_time.mts = this.timeSetList;
      res.dontdisturb_time.is_repeat = true;
      if (this.selectDisable.length > 0) {
        res.follow_alert_level = 0;
      } else {
        res.follow_alert_level = this.levelLists.indexOf(this.levelList) + 1;
      }
      return res;
    },
  },
  methods: {
    async checkAll() {
      this.checkName();
      await this.checkEmail();
      await this.checkTel();
      let isOk = true;
      if (!this.nameisRight || !this.telisRight || !this.emailisRight) {
        isOk = false;
      }
      return isOk;
    },
    checkName() {
      if (this.data.name === '') {
        this.inputError.name = true;
        this.showNameTip = true;
        this.nameisRight = false;
        this.tipContent_name = '请输入姓名';
        return;
      }
      if (this.data.name.search(/^[\u4e00-\u9fa5a-zA-Z]{2,10}$/g) !== -1) {
        this.inputError.name = false;
        this.showNameTip = false;
        this.nameisRight = true;
      } else {
        this.inputError.name = true;
        this.showNameTip = true;
        this.nameisRight = false;
        this.tipContent_name = '输入内容不符合格式，请重新输入';
      }
      // this.allowUplaod();
    },
    async checkTel() {
      if (this.data.tel === '') {
        this.inputError.tel = true;
        this.showTelTip = true;
        this.telisRight = false;
        this.tipContent_tel = '请输入手机号码';
        return;
      }
      const _this = this;
      const obj = {
        tel: this.data.tel,
      };
      if (this.operation !== 0) {
        obj._id = this.propData._id;
      }
      await checkContact(obj).then((res) => {
        console.log(res.data);
        if (res.data.code === 0) {
          _this.inputError.tel = false;
          _this.showTelTip = false;
          _this.telisRight = true;
        } else {
          _this.inputError.tel = true;
          _this.showTelTip = true;
          _this.tipContent_tel = res.data.msg;
          _this.telisRight = false;
          // _this.tipContent_tel = '输入内容不符合格式，请重新输入';
        }
        // this.allowUplaod();
      });
    },
    async checkEmail() {
      if (this.data.email === '') {
        this.emailisRight = false;
        this.inputError.email = true;
        this.showEmailTip = true;
        this.tipContent_email = '请输入邮箱地址';
        return;
      }
      const _this = this;
      const obj = {
        email: this.data.email,
      };
      if (this.operation !== 0) {
        obj._id = this.propData._id;
      }
      await checkContact(obj).then((res) => {
        console.log(res.data);
        if (res.data.code === 0) {
          _this.inputError.email = false;
          _this.showEmailTip = false;
          _this.emailisRight = true;
        } else {
          _this.inputError.email = true;
          _this.tipContent_email = res.data.msg;
          _this.showEmailTip = true;
          _this.emailisRight = false;
          // _this.tipContent_email = '输入内容不符合格式，请重新输入';
        }
        // this.allowUplaod();
      });
    },
    // allowUplaod() {
    //   if (this.inputError.name || this.inputError.tel || this.inputError.email) {
    //     this.errors.push(this.tabs[0].id);
    //     return false;
    //   }
    //   this.errors = [];
    //   return true;
    // },
    init() {
      if (JSON.stringify(this.propData) !== '{}') {
        // 说明有值
        console.log(this.propData);
        // this.data.data = Object.assign({}, propObj);
        this.data.name = this.propData.name;
        this.data.tel = this.propData.tel;
        this.data.email = this.propData.email;
        this.data.classify = this.propData.classify;
        this.data.switch = this.propData.switch;
        this.data.dontdisturb_time = Object.assign({}, this.propData.dontdisturb_time);
        this.data.follow_alert_level = this.propData.follow_alert_level;
        if (this.data.follow_alert_level === 0) {
          this.selectDisable = ['selectDisable'];
          this.levelList = this.levelLists[0];
        } else {
          this.selectDisable = [];
          this.levelList = this.levelLists[this.propData.follow_alert_level - 1];
        }
        this.timeSetList = Object.assign({}, this.propData.dontdisturb_time.mts);
      }
    },
    delOneTime(e, key, index) {
      this.timeSetList[key].splice(index, 1);
      if (this.timeSetList[key].length === 0) {
        delete this.timeSetList[key];
      } else {
        this.times = this.timeSetList[key].map((arr) => {
          console.log(arr);
          return { ts_start: arr[0], ts_end: arr[1] };
        });
        this.checkTime = key;
        this.week_days = [].concat(key.split(','));
        this.week_days = this.week_days.map(item => parseInt(item, 10));
      }
      e.stopPropagation();
    },
    delOneDate(key) {
      delete this.timeSetList[key];
      this.week_days = [];
      this.times = [];
      this.checkTime = '-1';
      if (JSON.stringify(this.timeSetList) === '{}') {
        this.week_days = [0];
      }
    },
    clickCheckTime(key) {
      // 点击每个时间
      if (this.checkTime !== key) {
        // 选中时间
        this.checkTime = key;
        this.times = this.timeSetList[key].map((arr) => {
          console.log(arr);
          return { ts_start: arr[0], ts_end: arr[1] };
        });
        this.week_days = [].concat(key.split(','));
        this.week_days = this.week_days.map(item => parseInt(item, 10));
      } else {
        this.checkTime = '-1';
        this.week_days = [0];
        this.times = [];
      }
    },
    getWeek(num) {
      switch (num) {
        case 0:
          return '周一至周天';
        case 1:
          return '周一';
        case 2:
          return '周二';
        case 3:
          return '周三';
        case 4:
          return '周四';
        case 5:
          return '周五';
        case 6:
          return '周六';
        default:
          return '周天';
      }
    },
    getTime(num) {
      const Ho = Math.floor(num / 60);
      const Mi = Math.floor(num % 60);
      return `${Ho}:${Mi < 10 ? '0' : ''}${Mi}`;
    },
    saveDate() {
      // 对错误时间校验
      if (this.times.length > 0 && this.week_days.length > 0) {
        this.timeError = false;
        this.$set(this.timeSetList, this.week_days.join(','), this.times.map((item) => {
          console.log();
          return [item.ts_start, item.ts_end];
        }));
      } else {
        this.timeError = true;
      }
    },
    async save() {
      if (!await this.checkAll()) {
        return;
      }
      const resD = Object.assign({}, this.resData);
      if (resD.follow_alert_level === 0 && this.selectDisable.length === 0) {
        resD.follow_alert_level = 1;
      }
      let resMag = {};
      if (this.operation === 0) {
        // 新建联系人
        await addPeople({ document: JSON.stringify(resD) }).then((res) => {
          console.log(res);
          resMag = res.data;
        });
      } else if (this.operation === 1) {
        await editPeople({ document: JSON.stringify(Object.assign({}, resD, { _id: this.propData._id })) }).then((res) => {
          console.log(res);
          resMag = res.data;
        });
      }
      this.$emit('save', resMag);
    },
    close() {
      this.$emit('close');
    },
    changeWeek(val) {
      this.week_days = val;
      if (this.timeSetList[this.week_days.join(',')]) {
        this.checkTime = this.week_days.join(',');
        this.times = this.timeSetList[this.week_days.join(',')].map((arr) => {
          console.log(arr);
          return { ts_start: arr[0], ts_end: arr[1] };
        });
        return;
      }
      this.checkTime = '-1';
      this.times = [];
    },
    timeChange(val) {
      this.times = val.timeList;
      this.timeError = false;
    },
  },
};
</script>
<style>
.alert .skill.top {
    top: -133px;
  }
</style>

<style lang="scss">
  // #edit-people{
    .red-input{
      width: 375px;
    height: 25px;
      border-radius: 3px;
      background-color: #081a29;
      border:1px solid red;
      padding-left: 10px;
      padding-right: 10px;
      box-sizing: border-box;
      color: white;
    }
    .alert{
      position: absolute;
      z-index: 999;
      .alert-content{
        position: relative;
        width: 1100px;
        .scroll{
          max-height: 350px;
          position: relative;
          top: -30px;
          padding-top: 40px;
        }
        .bc{
          position: absolute;
          width: 100%;
          height: 500px;
          top: 0px;
          // background-color: #808040;
        }
        .bc-2{
          position: absolute;
          width: 100%;
          height: 115px;
          top: 0px;
          // background-color: #808040;
        }
        .name-input, .tel-input, .email-input{
          width: 375px;
          height: 25px;
          border-radius: 3px;
          background-color: #081a29;
          border:1px solid #1c3651;
          padding-left: 10px;
          padding-right: 10px;
          box-sizing: border-box;
          color: white;
        }
        .row-1{
          display: flex;
          margin-bottom: 20px;
          .name{
            width: 70px;
            text-align: right;
            margin-right: 20px;
            line-height: 25px;
          }
          .input-tip{
            color: #828c95;
            margin-left: 15px;
            line-height: 25px;
          }
        }
        .row-2{
          display: flex;
          margin-bottom: 20px;
          .tel{
            width: 70px;
            text-align: right;
            margin-right: 20px;
            line-height: 25px;
          }
          .email{
            width: 70px;
            text-align: right;
            margin-right: 20px;
            margin-left: 80px;
            line-height: 25px;
          }
        }
        .row-3{
          display: flex;
          .message{
            width: 70px;
            text-align: right;
            margin-right: 20px;
            line-height: 25px;
          }
          .set-disturb-message{
            width: 910px;
            .date-set{
              position: relative;
              left: -70px;
              margin-top: 10px;
              .save-date{
                position: absolute;
                top: 15px;
                left: 930px;
              }
            }
            .week-row{
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: flex-start;
              .alert-week{
                // width: 250px;
                margin-left: 0;
                margin-right: 0;
              }
              .checkbox{
                margin-left: 30px;
                align-self: center;
              }
              span{
                line-height: 25px;
              }
            }
            .date-list{
              margin-top: 10px;
              width:100%;
              min-height: 100px;
              border: 1px solid #0d3555;
              background-color: #061522;
              .date-one{
                cursor: pointer;
                // &:hover{
                //   background-color: #0b2d48;
                // }
                display: flex;
                min-height: 30px;
                align-items: center;
                padding-left: 20px;
                .spans{
                  align-self: flex-start;
                  width: 215px;
                  span{
                    line-height: 30px;
                    margin-right: 5px;
                  }
                }
                .time-list{
                  width: 645px;
                  display: flex;
                  align-items: center;
                  box-sizing: border-box;
                  padding-left: 20px;
                  padding-right: 20px;
                  flex-wrap: wrap;
                  // overflow: hidden;
                  .time-one{
                    width:120px;
                    height: 20px;
                    margin-top: 3px;
                    margin-bottom: 3px;
                    background-color: #2e4b64;
                    margin-right: 10px;
                    display: flex;
                    align-items: center;
                    span{
                      line-height: 20px;
                      margin-left: 10px;
                      font-size: 10px;
                    }
                    img{
                      margin-left: auto;
                      margin-right: 10px;
                    }
                  }
                }
                .delete{
                  height: 20px;
                  width: 20px;
                }
              }
            }
          }
        }
        .group-detail{
          display: flex;
          margin-bottom: 15px;
          .message{
            width: 70px;
            text-align: right;
            margin-right: 20px;
            line-height: 25px;
          }
        }
        .row-4{
          display: flex;
          .row-4-p{
            margin:0;
            width: 70px;
            text-align: right;
            margin-right: 20px;
            line-height: 65px;
          }
          .level{
            margin-top: 20px;
            span{
              font-size: 10px;
            }
          }
        }
        .footer{
          position: absolute;
          top: 358px;
          left: -55px;
          width: 1155px;
          .hr{
            width: 100%;
            border: 0;
            border-bottom: 1px solid #0b2438;
          }
          .save-or-cancel{
            margin-top: 20px;
          }
        }
      }
    }
  // }

  // .alert >>> .skill.top {
  //   top: -133px;
  // }
</style>