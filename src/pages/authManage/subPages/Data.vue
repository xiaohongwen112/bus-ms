<template>
  <div class="user-data">
    <div class="data-top">
      <div class="top-left">
        <div class="usrer-img"></div>
        <div class="user-name">{{userName}}</div>
      </div>
      <ScrollBar class="scroll-area" ref="rightContent" :needResize="needResize">
        <div class="top-right">
            <div class="right-info">
              <div class="right-title">权限说明</div>
              <div class="info-content">{{roleData.join('，')}}</div>
            </div>
            <div class="domain-info">
              <div class="right-title">域范围</div>
              <div class="info-content">{{domianData.join('，')}}</div>
            </div>
        </div>
      </ScrollBar>
    </div>
    <div class="data-bottom">
      <ScrollBar class="bottom-scroll" ref="bottomScroll">
        <div class="title">用户基本信息</div>
          <div class="input-box">
            <div class="each-box">
              <span>用户名</span><CmInput v-model="userName" :disable="disable"></CmInput>
            </div>
            <div class="each-box">
              <span>角色</span><CmSelect :selectVal="roleName" :disable="disable"></CmSelect>
            </div>
            <div class="each-box">
              <span>业务域</span><CmSelect :selectVal="domianName" :disable="disable"></CmSelect>
            </div>
            <div class="each-box">
              <span :class="{'required': updateFlag}">姓名</span><CmInput ref="name" v-model="name" :errorFlag="nameFlag" :disable="!updateFlag" 
              @on-change="validateCmName($event, 'name')" @mouseover="showPopsTip($event, 'name')" @mouseout="showPops = false"></CmInput>
            </div>
            <div class="each-box">
              <span :class="{'required': updateFlag}">手机号码</span><CmInput ref="tel" v-model="tel" :disable="!updateFlag" :errorFlag="telFlag" :maxlength="telllMaxLen"
              @on-change="validatePhone($event, 'tel')" @mouseover="showPopsTip($event, 'tel')" @mouseout="showPops = false"></CmInput>
            </div>
            <div class="each-box">
              <span :class="{'required': updateFlag}">邮箱地址</span><CmInput ref="email" v-model="email" :disable="!updateFlag" :errorFlag="emailFlag" :maxlength="emailMaxLen"
              @on-change="validateMail($event, 'email')" @mouseover="showPopsTip($event, 'email')" @mouseout="showPops = false"></CmInput>
            </div>
            <div class="each-box">
              <span>部门</span><CmInput ref="dept" v-model="dept" :disable="!updateFlag" :errorFlag="deptFlag" :maxlength="departMaxLen" 
              @on-change="validateCmName($event, 'dept')" @mouseover="showPopsTip($event, 'dept')" @mouseout="showPops = false"></CmInput>
            </div>
            <div class="each-box">
              <span>归属地</span>
              <DistPicker
                class="dist-picker"
                :disabled="!updateFlag"
                @change="selectedProvince"
                :province="attribution"
              ></DistPicker>
            </div>
          </div>
        <div v-show="editPwdFlag" class="input-box edit-pwd-content">
          <div class="each-box">
            <span class="required">旧密码</span><CmInput ref="oldpwd" v-model="oldPwd" :errorFlag="oldpwdFlag" :maxlength="pwdMaxlen" inputType="password" 
            @on-change="validatePwd($event, 'oldPwd')" @mouseover="showPopsTip($event, 'oldpwd')" @mouseout="showPops = false"></CmInput>
          </div>
          <div class="each-box">
            <span class="required">设置密码</span><CmInput ref="pwd1" v-model="pwd1" :errorFlag="pwd1Flag" :maxlength="pwdMaxlen" inputType="password" 
            @on-change="validatePwd($event, 'pwd1')" @mouseover="showPopsTip($event, 'pwd1')" @mouseout="showPops = false"></CmInput>
          </div>
          <div class="each-box">
            <span class="required">确认密码</span><CmInput ref="pwd2" v-model="pwd2" :errorFlag="pwd2Flag" :maxlength="pwdMaxlen" inputType="password" 
            @on-change="validatePwd($event, 'pwd2')" @mouseover="showPopsTip($event, 'pwd2')" @mouseout="showPops = false"></CmInput>
          </div>
        </div>
        <div class="data-footer">
          <div v-if="!(updateFlag || editPwdFlag)">
            <BmsBtn type="main" @click="updateInfo">更新信息</BmsBtn>
            <CmSimpleBtn type="main" @click="editPwd">修改密码</CmSimpleBtn>
          </div>
          <div v-else>
            <BmsBtn type="main" @click="saveChange">保存</BmsBtn>
            <CmSimpleBtn type="main" @click="cancelEdit">取消</CmSimpleBtn>
          </div>
        </div>
      </ScrollBar>
    </div>
    <PopsMsg type="error" :showTips="showPops" :msg="errmsg" :lefts="lefts" :top="top"></PopsMsg>
  </div>
</template>

<script>
import { CmInput, CmSelect, DistPicker, BmsBtn, CmSimpleBtn, ScrollBar, PopsMsg } from '@/components/basic';
import { validateCmName, validatePhone, validateMail, validatePwd } from '@/helpers/configValidate';
import { getUserDetail, editPassword, saveDataChange } from '../service';

export default {
  components: { CmInput, CmSelect, DistPicker, BmsBtn, CmSimpleBtn, ScrollBar, PopsMsg },
  data() {
    return {
      userName: '',
      name: '',
      tel: '',
      email: '',
      dept: '',
      pwd1: '',
      pwd2: '',
      roleName: '',
      roleData: [],
      domianName: '',
      domianData: [],
      disable: true,
      distDisable: true,
      attribution: '',
      updateFlag: false,
      editPwdFlag: false,
      telllMaxLen: 11,
      pwdMaxlen: 16,
      emailMaxLen: 63,
      departMaxLen: 20,
      oldPwd: '',
      userId: '',
      nameFlag: false,
      deptFlag: false,
      telFlag: false,
      emailFlag: false,
      oldpwdFlag: false,
      pwd1Flag: false,
      pwd2Flag: false,
      showPops: false,
      top: 0,
      lefts: 0,
      errmsg: '',
      nameMsg: '',
      deptMsg: '',
      telMsg: '',
      emailMsg: '',
      oldpwdMsg: '',
      pwd1Msg: '',
      pwd2Msg: '',
      needResize: true,
    };
  },
  methods: {
    getUserDetail() {
      getUserDetail().then((res) => {
        const data = res.data.data;
        if (res.data.code === 0) {
          this.userId = data.user_id;
          this.userName = data.username;
          this.attribution = data.attribution;
          this.dept = data.dept;
          this.domianData = data.domain_data;
          this.domianName = data.domain_name;
          this.email = data.email;
          this.name = data.name;
          this.roleData = data.role_data;
          this.roleName = data.role_name;
          this.tel = data.tel;
          this.userName = data.username;
        }
      }).catch();
    },
    saveChange() {
      if (this.updateFlag) {
        this.validateCmName(this.name, 'name');
        this.validatePhone(this.tel, 'tel');
        this.validateMail(this.email, 'email');
        this.validateCmName(this.dept, 'dept');
        const data = {
          id: this.userId,
          username: this.userName,
          is_self: true,
          first_name: this.name,
          tel: this.tel,
          email: this.email,
          attribution: this.attribution,
          dept: this.dept,
        };
        saveDataChange(data).then((res) => {
          if (res.data.code === 0) this.cancelEdit();
        }).catch();
      }
      if (this.editPwdFlag) {
        this.validatePwd(this.oldPwd, 'oldpwd');
        this.validatePwd(this.pwd1, 'pwd1');
        this.validatePwd(this.pwd2, 'pwd2');
        editPassword({ old_password: this.oldPwd, new_password1: this.pwd1, new_password2: this.pwd2 }).then((res) => {
          if (res.data.code === 0) {
            this.oldpwdFlag = false;
            this.oldpwdMsg = '';
            this.cancelEdit();
          }
          if (res.data.msg === '旧密码不正确') {
            this.oldpwdFlag = true;
            this.oldpwdMsg = '旧密码不正确';
          }
        }).catch();
      }
    },
    selectedProvince(data) {
      this.attribution = data;
    },
    updateInfo() {
      this.updateFlag = true;
    },
    editPwd() {
      this.editPwdFlag = true;
    },
    cancelEdit() {
      this.updateFlag = false;
      this.editPwdFlag = false;
      this.oldPwd = '';
      this.pwd1 = '';
      this.pwd2 = '';
      this.nameFlag = false;
      this.deptFlag = false;
      this.telFlag = false;
      this.emailFlag = false;
      this.oldpwdFlag = false;
      this.pwd1Flag = false;
      this.pwd2Flag = false;
      this.$refs.bottomScroll.scrollTop = 1;
      this.getUserDetail();
    },
    validateCmName(val, name) {
      if (name !== 'dept' || (name === 'dept' && val !== '')) {
        if (!validateCmName(val).bool) {
          this[`${name}Flag`] = true;
          if (val === '') this[`${name}Msg`] = '';
          else this[`${name}Msg`] = validateCmName(val).tip;
        } else {
          this[`${name}Flag`] = false;
        }
      } else {
        this[`${name}Flag`] = false;
        this[`${name}Msg`] = '';
      }
    },
    validatePhone(val, name) {
      if (!validatePhone(val).bool) {
        this[`${name}Flag`] = true;
        if (val === '') this[`${name}Msg`] = '';
        else this[`${name}Msg`] = validatePhone(val).tip;
      } else {
        this[`${name}Flag`] = false;
      }
    },
    validateMail(val, name) {
      if (val === '') {
        this[`${name}Flag`] = true;
        this[`${name}Msg`] = '';
      } else {
        if (!validateMail(val).bool) {
          this[`${name}Flag`] = true;
          this[`${name}Msg`] = validateMail(val).tip;
        } else {
          this[`${name}Flag`] = false;
        }
      }
    },
    validatePwd(val, name) {
      if (val === '') {
        this[`${name}Flag`] = true;
        this[`${name}Msg`] = '';
      } else {
        if (name !== 'oldpwd' && !validatePwd(val).bool) {
          this[`${name}Flag`] = true;
          this[`${name}Msg`] = validatePwd(val).tip;
        } else {
          if (this.pwd1 !== '' && this.pwd2 !== '' && this.pwd1 !== this.pwd2) {
            if (name !== 'oldpwd') this[`${name}Flag`] = true;
            this[`${name}Msg`] = '两次密码不一致';
          } else {
            this.pwd1Flag = false;
            this.pwd2Flag = false;
          }
        }
      }
    },
    showPopsTip(e, flag) {
      this.errmsg = this[`${flag}Msg`];
      if (this[`${flag}Flag`] && this.errmsg !== '') {
        const ele = e.target.parentNode.getBoundingClientRect();
        this.top = ele.top;
        this.lefts = ele.left + ele.width / 2;
        this.showPops = true;
      }
    },
  },
  created() {
    this.getUserDetail();
  },
  updated() {
    this.$refs.bottomScroll.scrollTop = 1;
  },
};
</script>
<style lang="scss">
  .user-data{
    .cm-input{
      input{
        width: 100% !important;
      }
    }
    .addressDiv{
      >div{
        width: 100% !important;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .user-data{
    left: 16px;
    right: 16px;
    bottom: 16px;
    border: 1px solid #265b5a;
    >div{
      width: 100%;
      box-sizing: border-box;
      font-size: 0;
      &.pops-msg{
        width: auto;
        font-size: 12px;
      }
      &.data-top{
        height: 220px;
        background-color: #0e1c29;
        border-bottom: 1px solid #265b5a;
        .top-left{
          display: inline-block;
          position: relative;
          width: 20%;
          height: 100%;
          float: left;
          padding: 20px 0;
          box-sizing: border-box;
          >div{
            position: absolute;
          }
          .usrer-img{
            width: 115px;
            height: 115px;
            border-radius: 50%;
            margin: 15px 0;
            left: calc((100% - 115px) / 2);
            background: url(../../../assets/common/user-icon.png) no-repeat center;
            background-color: #4ab2a5;
          }
          .user-name{
            font-size: 24px;
            color: #efefef;
            left: calc((100% - 75px) / 2);
            bottom: 20px;
          }
        }
        .scroll-area{
          width: 80%;
          height: 179px;
          padding: 20px 0;
        }
        .top-right{
          width: 100%;
          padding-right: 4%;
          box-sizing: border-box;
          display: inline-block;
          .right-title{
            font-size: 18px;
            color: #efefef;
          }
          .info-content {
            font-size: 14px;
            color: #66737e;
          }
          .domain-info{
            margin-top: 15px;
          }
        }
      }
      &.data-bottom{
        height: calc(100% - 220px);
        .title{
          font-size: 14px;
          color: #f3f3f3;
          margin: 15px 15px;
        }
        .bottom-scroll{
          height: 100%;
        }
        .edit-pwd{
          opacity: .3;
        }
        .edit-pwd-content{
          margin-top: 15px;
        }
        .each-box{
          display: inline-block;
          width: calc(100% / 3);
          text-align: right;
          padding-right: 3%;
          margin-bottom: 15px;
          box-sizing: border-box;
          span{
            position: relative;
            display: inline-block;
            height: 30px;
            line-height: 28px;
            font-size: 14px;
            color:#ddd;
            margin-right: 5px;
            vertical-align: top;
            &.required:after {
              content: '*';
              position: absolute;
              left: -15px;
              top: 2px;
              color: red;
            }
          }
          >div{
            width: calc(100% - 100px) !important;
          }
        }
        .data-footer{
          padding-left: 95px;
          margin-bottom: 20px;
          button{
            margin: 0 5px;
          }
        }
      }
    }
  }
</style>