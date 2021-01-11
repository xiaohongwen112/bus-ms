<template>
  <ScrollBar class="user-right-div" :class="{'resize-position':!isSuperAdmin}">
    <div class="show-content-div">
      <div class="main">
        <div class="create-btn-wrap">
          <CmBtn class="operate-button create-return-btn" v-if="isSuperAdmin" @click="createUser(editStatus.edit)">
            {{  editStatus.edit ? '新建+' : '返回' }}
          </CmBtn>
        </div>
        <form class="user-body edit-form" :class="{'create-form': !editStatus.edit}">
          <div class="user-body-left">
            <div class="user-info-view">
              <div class="basic-info-title">基本信息</div>
              <div class="basic-info">
                <span>用户名<span class="require-icon">*</span></span>
                <input ref="username" type="text" id="username" class="basic-input"
                        v-model="editData.username" :disabled='editStatus.edit || !isSuperAdmin'
                        autocomplete="off"
                        @change="editStatus.btn = false">
              </div>
              <div class="basic-info">
                <span>姓名</span>
                <input type="text" class="basic-input" v-model="editData.first_name"
                        @change="editStatus.btn = false">
              </div>
              <div class="basic-info">
                <span>部门</span>
                <input ref="depart" type="text" class="basic-input" v-model="editData.dept"
                        @change="editStatus.btn = false">
              </div>
              <div class="basic-info">
                <span>电话</span>
                <input ref="tel" type="text" id="tel" class="basic-input" v-model="editData.tel"
                        @change="editStatus.btn = false">
              </div>
              <div class="basic-info">
                <span>角色</span>
                <input v-if="!editStatus.changRole" type="text" class="basic-input" :value="editData.role_name" :disabled="true">
                <CmSelect v-else :list="roleOptions" :selectVal="editData.role_name" @on-change="changeRole"></CmSelect>
              </div>
              <div class="basic-info">
                <span>电子邮箱</span>
                <input ref="email" type="text" id="email" class="basic-input" v-model="editData.email"
                        @change="editStatus.btn = false">
              </div>
              <div style="clear:both;"></div>
            </div>
            <div class="user-info-update clearfix" v-if="isSuperAdmin">
              <div class="basic-info-title">{{ editStatus.edit ? '修改' : '设置'}}密码</div>
              <div class="basic-info oldpsd-wrap" v-if="0 === editData.role">
                <span>旧密码</span>
                <input ref="oldpwd" type="password" class="basic-input"  id="oldpassword" v-model="password.oldPassword"
                        @change="editStatus.btn = false">
              </div>
              <div class="basic-info">
                <span v-if="editStatus.edit">新密码</span>
                <span v-else>密码<span class="require-icon">*</span></span>
                <input ref="pwd1" type="password" class="basic-input" id="password1" v-model="password.password1"
                        @change="editStatus.btn = false">
              </div>
              <div class="basic-info">
                <span>确认密码<span class="require-icon">*</span></span>
                <input ref="pwd2" type="password" id="password2" class="basic-input" v-model="password.password2"
                        @change="editStatus.btn = false">
              </div>
            </div>
            <div class="basic-operateBtn">
              <CmBtn class="operate-button" :disabled='editStatus.btn' @click="handleSave" >
                  {{ editStatus.edit ? '修改': '创建' }}</CmBtn>
              <CmBtn class="operate-button" :disabled='editStatus.btn' @click="handleReset"> 重置 </CmBtn>
            </div>
            <div class="delete-wrap" v-if="editStatus.delete">
              <span class="deleteUser"
                  @click="deleteUser">删除该用户</span>
            </div>
          </div>
          <div class="user-body-right">
          <div class="role-logo-wrap">
              <RoleRound class="role-logo"
            :roleId="editData.role"
            :text="[`${editData.role_name.substr(0, 2)}`, `${editData.role_name.substr(2, 3)}`]" />
          </div>
            <div class="basic-info-title" style="text-align:left;">权限说明：</div>
            <ScrollBar class="power-info">
              <div>{{ roleMap[editData.role].powerInfo }}</div>
            </ScrollBar>
          </div>
        </form>
        <div class="user-body all-users" v-if="isSuperAdmin">
          <div class="prev-admin" :class="[changeOperateFlag.prev ? 'can-use' : 'no-use']" @click="changeShowUser('prev')"></div>
          <div class="user-slidecontent" id="userOutContainer" ref="outerBox">
            <div id="userInnerContainer" ref="innerBox">
              <ul class="user-item-wrap">
                <li v-for="(user, index) in allUsers" :class="{'active': user.username === editData.username}" 
                :key="`user${index}`" ref="oneBox">
                  <RoleRound class="user-logo"
                    :shadow="true"
                    :onlyRole="false"
                    :roleId="name2id(user.role_name)"
                    :text="[`${user.username}`, `${user.role_name}`]"
                    @initResize="resize()"
                    @click="changeUser(user.username, user.role_name, index)"/>
                </li>
              </ul>
            </div>
          </div>
          <div class="next-admin" :class="[changeOperateFlag.next ? 'can-use' : 'no-use']" @click="changeShowUser('next')"></div>
        </div>
      </div>
      <Cmtip :tipContent="updateMessage" v-if="showTips" :closeFn="() => showTips = false"
             :showFooter=showFooter
             @on-confirm='makeSure'>
      </Cmtip>
    </div>
  </ScrollBar>
</template>
<script>
import _ from 'lodash';
import CmBtn from '@/components/common/CmBtn';
import ScrollBar from '@/components/common/ScrollBar';
import { CmSelect } from '@/components/common';
import { validatePwd, validateUserName, validateDepName, validateTel, validateMail, checkError } from '@/helpers/configValidate';
import RoleRound from '../components/RoleRound';
import Cmtip from '../../../components/common/CmTip';
import * as api from '../service';
import { getRoleId, roleNameList, ROLE_MAP } from '../utils';

export default {
  components: {
    CmBtn,
    ScrollBar,
    CmSelect,
    Cmtip,
    RoleRound,
  },
  computed: {
    isSuperAdmin() {
      return this.isAdmin$;
    },
  },
  data() {
    return {
      roleOptions: roleNameList.concat().slice(1, 4),
      roleMap: ROLE_MAP,
      updateMessage: '',
      showTips: false,
      userContainerLeft: 0,
      userPosition: 0, // 用户信息滑到哪里标志
      showFooter: false,
      userAllInfo: {}, // 总的用户信息
      deleteWhichUser: '',
      changeOperateFlag: {
        prev: false,
        next: false,
      },
      backUpUsers: '', // 备份用户信息
      oldPassword: '',
      password: {
        password1: '',
        password2: '',
      },
      activeUserid: 0, // 当前编辑角色
      editData: {
        role_name: '网络管理员', // 角色用户名
        first_name: '', // 姓名
        role: 1,
        dept: '', // 部门
        email: '', // 电子邮箱
        tel: '', // 电话
        username: '', // 用户名
      },
      editStatus: {
        edit: true, // true-update||false-create
        btn: true, // true-不可编辑
        delete: false,
        changRole: false,
      },
      manages: '',
      allUsers: [], // 全部用户
      isFirst: true,
    };
  },
  mounted() {
    this.init();
    window.addEventListener('resize', this.resize);
  },
  methods: {
    resize() {
      this.changeOperateFlag.prev = false;
      this.userPosition = 0;
      this.userContainerLeft = 0;
      this.$refs.innerBox.style.marginLeft = `${this.userContainerLeft}px`;
      let outerWidth = this.$refs.outerBox.offsetWidth;
      let oneWidth = 0;
      let allUserNum = 0;
      if (this.$refs.oneBox !== undefined && this.$refs.outerBox !== undefined) {
        outerWidth = this.$refs.outerBox.offsetWidth;
        oneWidth = this.$refs.oneBox[0].offsetWidth;
        allUserNum = this.$refs.oneBox.length;
        const userNum = Math.floor(outerWidth / oneWidth); // 可见用户个数
        if (userNum <= allUserNum) { // 是否超出
          if (this.userContainerLeft !== 0) {
            if (Math.abs(this.userContainerLeft) >= outerWidth) {
              this.changeOperateFlag.next = false;
            } else {
              if (allUserNum - Math.ceil(Math.abs(this.userContainerLeft) / 127) > userNum) { // 是否超出
                this.changeOperateFlag.next = true;
              } else {
                if (userNum !== allUserNum) {
                  this.changeOperateFlag.prev = true;
                } else {
                  this.changeOperateFlag.prev = false;
                  this.userPosition = 0;
                  this.userContainerLeft = 0;
                  this.$refs.innerBox.style.marginLeft = `${this.userContainerLeft}px`;
                }
                this.changeOperateFlag.next = false;
              }
            }
          } else {
            if (userNum < allUserNum) { // 是否超出
              this.changeOperateFlag.next = true;
            } else {
              if (userNum !== allUserNum) {
                this.changeOperateFlag.prev = true;
              } else {
                this.changeOperateFlag.prev = false;
                this.userPosition = 0;
                this.userContainerLeft = 0;
                this.$refs.innerBox.style.marginLeft = `${this.userContainerLeft}px`;
              }
              this.changeOperateFlag.next = false;
            }
          }
        } else {
          this.changeOperateFlag.prev = false;
          this.changeOperateFlag.next = false;
        }
      }
    },
    clearAlert() {
      Object.keys(this.$refs).forEach((item) => {
        if (item !== 'oneBox' && this.$refs[item] && this.$refs[item].classList.contains('error-input')) {
          checkError({ bool: true }, this.$refs[item]);
        }
      });
    },
    init() {
      this.getInfo();
    },
    initEdit(index = 0) {
      this.editData = _.cloneDeep(this.allUsers[index]);
      this.editData.role = getRoleId(this.editData.role_name);
      this.password.oldPassword = '';
      this.password.password1 = '';
      this.password.password2 = '';
      this.editStatus.edit = true;
      this.editStatus.btn = true;
      this.editStatus.delete = this.editData.role !== 0 && this.editStatus.edit && this.isSuperAdmin;
      this.editStatus.changRole = this.editStatus.delete;
      this.activeUserid = index;
      this.clearAlert();
    },
    async getInfo() {
      try {
        const res = await api.manageInfo();
        if (res.data.code === 0) {
          const data = res.data.data;
          // this.userAllInfo = data;
          this.allUsers = data.users;
          this.initEdit();
          this.backUpUsers = JSON.stringify(this.editData);
          this.deleteWhichUser = this.editData.username;
        }
      } catch (e) {
        console.log(e);
      }
    },
    name2id(name) {
      return roleNameList.indexOf(name);
    },
    createUser(isCreate) { // 新建+返回
      if (isCreate) {
        this.password.password1 = '';
        this.password.password2 = '';
        this.clearAlert();
        this.editData = {
          role: 1,
          dept: '',
          email: '',
          first_name: '',
          role_name: '网络管理员',
          tel: '',
          username: '',
        };
        this.editStatus.edit = false;
        this.editStatus.btn = true;
        this.editStatus.delete = false;
        this.editStatus.changRole = true;
      } else {
        this.initEdit();
      }
    },
    changeUser(name, roleName, index) {
      if (!this.editStatus.edit) {
        return;
      }
      this.backUpUsers = JSON.stringify(this.editData);
      this.deleteWhichUser = this.editData.username;
      // 切换编辑框状态
      this.initEdit(index);
      this.activeUserid = roleNameList.indexOf(this.editData.role_name);
    },
    changeRole(val) {
      // 修改角色
      const newRoleId = roleNameList.indexOf(val);
      this.activeUserid = newRoleId;
      this.editData.role_name = val;
      this.editData.role = getRoleId(val);
      this.editStatus.btn = false;
    },
    handleSave() {
      let depart = {
        bool: true,
      };
      let tel = {
        bool: true,
      };
      let email = {
        bool: true,
      };
      const username = validateUserName(this.editData.username);
      checkError(username, this.$refs.username);
      if (this.editData.dept !== '') {
        depart = validateDepName(this.editData.dept);
        checkError(depart, this.$refs.depart);
      } else {
        checkError({ bool: true }, this.$refs.depart);
      }
      if (this.editData.tel !== '') {
        tel = validateTel(this.editData.tel);
        checkError(tel, this.$refs.tel);
      } else {
        checkError({ bool: true }, this.$refs.tel);
      }
      if (this.editData.email !== '') {
        email = validateMail(this.editData.email);
        checkError(email, this.$refs.email);
      } else {
        checkError({ bool: true }, this.$refs.email);
      }
      if (username.bool) {
        if (this.activeUserid === 0 && !this.editStatus.changRole && (this.password.password1 !== '' || this.password.password2 !== '')) {
          if (!this.password.oldPassword || this.password.oldPassword === '') {
            checkError({ bool: false, tip: '旧密码为必填项，不能为空' }, this.$refs.oldpwd);
            return;
          }
          checkError({ bool: true }, this.$refs.oldpwd);
        }
        if (this.password.password1 !== this.password.password2) {
          checkError({ bool: false, tip: '两次输入的密码不一致' }, this.$refs.pwd2);
        } else {
          if (depart.bool && tel.bool && email.bool) {
            if (this.editStatus.edit) {
              // 修改用户信息
              if (this.password.password1 !== '' || this.password.password2 !== '') {
                if (!this.vaildPwd()) {
                  return;
                }
              }
              const obj = {
                ...this.editData,
                ...this.password,
              };
              api.updateUser(obj, this.editData.username);
            } else {
              if (this.vaildPwd()) {
                const obj = {
                  ...this.editData,
                  ...this.password,
                };
                api.createUserInfo(obj);
              }
            }
          }
        }
      }
    },
    vaildPwd() {
      let flag = true;
      const pwd1 = validatePwd(this.password.password1);
      const pwd2 = validatePwd(this.password.password2);
      checkError(pwd1, this.$refs.pwd1);
      checkError(pwd2, this.$refs.pwd2);
      if (pwd1.bool && pwd2.bool) {
        if (this.password.password1 !== this.password.password2) {
          checkError({ bool: false, tip: '两次输入的密码不一致' }, this.$refs.pwd2);
          flag = false;
        }
      } else {
        flag = false;
      }
      return flag;
    },
    handleReset() {
      if (this.editStatus.edit) {
        this.initEdit(this.activeUserid);
      } else {
        this.password.oldPassword = '';
        this.password.password1 = '';
        this.password.password2 = '';
        this.clearAlert();
        this.createUser(true);
      }
    },
    deleteUser() {
      this.showTips = true;
      this.updateMessage = '是否确认删除该用户？';
      this.showFooter = true;
    },
    makeSure() {
      this.deleteOneUser();
      this.showTips = false;
    },
    async deleteOneUser() {
      try {
        await api.deleteUser(this.editData.username);
      } catch (e) {
        console.log(e);
      }
    },
    changeShowUser(where) { // 底部用户滚动切换
      this.isFirst = false;
      const outerWidth = this.$refs.outerBox.offsetWidth;
      const oneWidth = this.$refs.oneBox[0].offsetWidth + 40;
      const allUserNum = this.$refs.oneBox.length;
      const userNum = Math.floor(outerWidth / oneWidth); // 可见用户个数
      if (where === 'next') {
        if (userNum >= allUserNum + userNum * this.userPosition) {
          this.changeOperateFlag.next = false;
          return;
        }
        this.changeOperateFlag.next = true;
        this.userPosition -= 1;
        this.userContainerLeft = this.userContainerLeft - oneWidth * userNum; // 容器的位置
        this.$refs.innerBox.style.marginLeft = `${this.userContainerLeft}px`;
        if (userNum <= allUserNum) {
          if (Math.abs(this.userContainerLeft) >= outerWidth) {
            this.changeOperateFlag.next = false;
          } else {
            if (allUserNum - Math.ceil(Math.abs(this.userContainerLeft) / 127) > userNum) this.changeOperateFlag.next = true;
            else this.changeOperateFlag.next = false;
          }
          this.changeOperateFlag.prev = true;
        } else {
          this.changeOperateFlag.next = true;
          this.changeOperateFlag.prev = true;
        }
      } else {
        if (this.userContainerLeft >= 0) {
          this.changeOperateFlag.prev = false;
          return;
        }
        this.changeOperateFlag.prev = true;
        this.userPosition += 1;
        this.userContainerLeft = this.userContainerLeft + oneWidth * userNum;
        this.$refs.innerBox.style.marginLeft = `${this.userContainerLeft}px`;
        if (userNum <= allUserNum) {
          this.changeOperateFlag.next = true;
          if (Math.abs(this.userContainerLeft) === 0 || Math.abs(this.userContainerLeft) >= outerWidth) {
            this.changeOperateFlag.prev = false;
          } else {
            if (userNum !== allUserNum) this.changeOperateFlag.prev = true;
            else this.changeOperateFlag.prev = false;
          }
        } else {
          this.changeOperateFlag.next = false;
          this.changeOperateFlag.prev = false;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.user-info-view{
  .basic-info{
    .cm-select{
      .input-container{
        input {
          border: 1px solid #49afa2;
        }
        .icon-bms-tridown{
          color: #49afa2;
        }
      }
      .skill{
        border: 1px solid #49afa2;
        li{
          &:hover, &.selected{
            background-color: #49afa2;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
ul,li{
  margin: 0 auto;
}
li{
  display: inline-block;
}
.create-btn-wrap{
  padding-left: 20px;
}
.basic-info {
  >.cm-select {
    width: 49%;
    margin: 0;
  }
}
#userInnerContainer {
  transition: margin-left 1s;
}
.user-right-div {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(50% - 338.5px);;
    bottom: 0;
    overflow-x: hidden!important;
    overflow-y: auto;
}
.resize-position{
  top: calc(50% - 254.5px);
}
@media screen and (max-height: 780px){
  .user-right-div {
    top: calc(50% - 250px);
    bottom: 30px;
  }
}
.show-content-div {
    // position: relative;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%,-50%);
    width: 90%;
    margin: 0 auto;
    .main {
      position: relative;
      .create-btn-wrap, .user-body, .all-users{
        position: absolute;
        width: 100%;
        .require-icon{
          color: #C63D35;
          display: none;
        }
      }
      .create-btn-wrap{
        height: 54px;
        top: 0;
      }
      >.user-body{
        top: 64px;
      }
      .create-form{
        .require-icon{
          display: inline;
        }
      }
      .all-users{
        top: 502px;
      }
    }
}
.operate-button {
    margin: 0 0 20px 0;
}
.user-body {
    border: 1px solid #406470;
    display: block;
    overflow: hidden;
    background: #030D16;
    &.all-users {
      height: 125px;
      position: relative;
      >.prev-admin {
        width: 0;
        height: 0;
        border: 20px solid #c1c1c1;
        border-top: 20px solid transparent;
        border-left: 20px solid transparent;
        border-bottom: 20px solid transparent ;
        position: absolute;
        left: 1px;
        top: 45px;
         &.can-use {
        border: 20px solid dodgerblue;
         border-top: 20px solid transparent;
        border-left: 20px solid transparent;
        border-bottom: 20px solid transparent ;
        cursor: pointer;
        }
        &.no-use {
          pointer-events: none;
        }
      }
      >.next-admin {
        width: 0;
        height: 0;
        border: 20px solid #c1c1c1;
        border-top: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 20px solid transparent ;
        position: absolute;
        right: 1px;
        top: 45px;
        &.can-use {
        border: 20px solid dodgerblue;
         border-top: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 20px solid transparent ;
        cursor: pointer;
        }
        &.no-use {
          pointer-events: none;
        }
      }
      >.user-slidecontent {
        width: calc(100% - 120px);
        height: 100%;
        margin-left: 60px;
        overflow: hidden;
        >div {
        white-space: nowrap;
          >.admin-info-top{
            display: inline-block;
            height: 100px;
            width: 100px;
            margin: 20px;
            cursor: pointer;
            &.all-users {
              >p {
                line-height:24px;
                &:nth-child(1) {
                font-size: 23px;
                margin-top: 25px;
                }
                &:nth-child(2) {
                font-size: 16px;
                margin-top: 0;
                }
              }
              &.thisOne {
                position: relative;
                box-shadow: 0 0 25px #326E77;
              }
            }
          }
        }
      }
    }
}
.user-body-left, .user-body-right{
   padding:20px;
}
.user-body-left {
    float: left;
    width: 70%;
    border-right: 1px solid #406470;
}
.user-body-right {
    float: left;
    width: 29.5%;
    height: 380px;
    border-left: 1px solid #406470;
    margin-left: -1px;
    text-align: center;
}
.role-logo-wrap{
  padding-left: calc(50% - 60px);
  height: 140px;

  .role-logo{
    .logo-title{
      color: #2c5159;
    }
  }
}

.basic-info-title {
  height: 25px;
  line-height: 25px;
  color: #3E93A0;
  font-size: 18px;
  text-align: left;
}
.basic-info {
    float: left;
    width: 50%;
    padding: 5px 0;
    >span {
        display: inline-block;
        width: 15%;
        text-align: right;
        min-width: 80px;
        margin-right: 10px;
    }
}
.oldpsd-wrap{
  float: none;
}
.basic-input {
    background: rgba(0,0,0,0);
    border: 1px solid #49afa2;
    color: #CCD3D9;
    height: 30px;
    width: 49%;
    font-size: 16px;
    min-width: 100px;
    font-family: "SourceHanSansCN-Normal";
    padding-left: 10px;
    border-radius: 1px;
}
.deleteUser {
  float: right;
  color:#3E93A0;
  // margin:30px 40px 0 0;
  cursor: pointer;
}
.admin-info-top {
  text-align: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: auto;
  line-height: 40px;
  color: #000;
  >p:nth-child(1) {
    font-size: 32px;
    font-weight: bold;
    margin-top: 20px;
  }
  >p:nth-child(2) {
    margin-top: 6px;
    font-size: 22px;
  }
}
.power-info {
    height: 150px;
    overflow-y: auto;
    text-align: left;
    padding: 10px;
}
.basic-operateBtn {
  text-align: center;
  >button {
    margin-right: 20px;
  }
  padding-top: 25px;
}
.user-logo{
  display: inline-block;
  margin: 15px 16px;
}
.delete-wrap{
  width: 100%;
  height: 25px;
  // line-height: 25px;
  padding-right: 70px;
}
.user-item-wrap .active{
  background-image: url(../../../assets/settings/user-active.png);
}
</style>

