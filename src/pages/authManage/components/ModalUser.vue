<template>
  <config-box :tabs="tabs" :width='1150' :height='460' :scrollheight="390"
    @closeConfig="close" @saveConfig="saveConfig">
    <div slot="setting" class="setting-box user-setting-content">
      <div class="setting-left">
        <div class="role-info">
          <div class="baes-info">
            <div class="proImg">基础信息</div>
            <div class="input-group">
              <div>
                <label class="title required">用户名</label>
                <CmInput v-model="info.username" :width="200" :errorFlag="usernameFlag" type="popsUp" :disable="data.id !== null"
                :maxlength="10" :correctFlag="correctFlag"
                @on-change="onChange" @mouseover="showPopsTip($event, 'username')" @mouseout="showPops = false"></CmInput>
              </div>
            </div>
            <div class="annotation">用户名以中英文字符开始,且长度2-10、英文字母、数字组成</div>
            <div class="input-group">
              <div>
                <label class="title required">角色</label>
                <CmSelect :list="roleList" :selectVal="selectRole" type="popsUp" @on-change="changeRole"/>
              </div>
              <div>
                <label class="title required">业务域</label>
                <CmSelect :list="domainList" :selectVal="selectDomain" type="popsUp" @on-change="changeDomain"/>
              </div>
              <div>
                <label class="title required">设置密码</label>
                <CmInput ref="pwd1" :errorFlag="pwd1Flag" v-model="pwd1" :width="200" type="popsUp" inputType="password" :maxlength="16"
                @on-change="validatePwd($event, 'pwd1')" @mouseover="showPopsTip($event, 'pwd1')" @mouseout="showPops = false"></CmInput>
              </div>
              <div>
                <label class="title required">确认密码</label>
                <CmInput ref="pwd2" :errorFlag="pwd2Flag" v-model="pwd2" :width="200" type="popsUp" inputType="password" :maxlength="16"
                @on-change="validatePwd($event, 'pwd2')" @mouseover="showPopsTip($event, 'pwd2')" @mouseout="showPops = false"></CmInput>
              </div>
            </div>
          </div>
        </div>
        <div class="role-info">
          <div class="baes-info">
            <div class="proImg">联系人信息</div>
            <div class="input-group">
              <div>
                <label class="title required">姓名</label>
                <CmInput ref="name" v-model="info.first_name" :width="200" type="popsUp" :errorFlag="nameFlag" :maxlength="10"
                @on-change="validateCmName($event, 'name')" @mouseover="showPopsTip($event, 'name')" @mouseout="showPops = false"></CmInput>
              </div>
              <div>
                <label class="title required">手机号码</label>
                <CmInput ref="tel" v-model="info.tel" :width="200" type="popsUp" :maxlength="11" :errorFlag="telFlag"
                @on-change="validatePhone($event, 'tel')" @mouseover="showPopsTip($event, 'tel')" @mouseout="showPops = false"></CmInput>
              </div>
              <div>
                <label class="title required">邮箱地址</label>
                <CmInput ref="email" v-model="info.email" :width="200" type="popsUp" :maxlength="63" :errorFlag="emailFlag"
                @on-change="validateMail($event, 'email')" @mouseover="showPopsTip($event, 'email')" @mouseout="showPops = false"></CmInput>
              </div>
              <div>
                <label class="title">部门</label>
                <CmInput ref="dept" v-model="info.dept" :width="200" type="popsUp" :errorFlag="deptFlag" :maxlength="20"
                @on-change="validateCmName($event, 'dept')" @mouseover="showPopsTip($event, 'dept')" @mouseout="showPops = false"></CmInput>
              </div>
              <div>
                <label class="title">归属地</label>
                <DistPicker
                  class="dist-picker" type="popsUp"
                  position="top"
                  @change="selectedProvince"
                  :province="info.attribution"
                  selectType="popsUp"
                ></DistPicker>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollBar class="setting-right">
        <article>
          <h5 class="title5">角色权限说明</h5>
          <h6 class="title6" v-text="selectRole"></h6>
          <p v-text="roleDetail"></p>
        </article>
        <article>
          <h5 class="title5">业务域说明</h5>
          <h6 class="title6" v-text="selectDomain"></h6>
          <p v-text="domainDetail"></p>
        </article>
      </ScrollBar>
      <PopsMsg type="error" :showTips="showPops" :msg="errmsg" :lefts="lefts" :top="top"></PopsMsg>
    </div>
  </config-box>
</template>

<script>
  import _ from 'lodash';
  import { ConfigBox, CmInput, CmSelect, DistPicker, ScrollBar, PopsMsg } from '@/components/basic';
  import { validateCmName, validatePhone, validateMail, validatePwd } from '@/helpers/configValidate';
  import { checkUser, getUserEditInfo, saveUserChange } from '../service';
  import { mapToId } from '../utils';

  export default {
    name: 'ModalUser',
    props: {
      title: {
        type: String,
        default: '',
      },
      data: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    watch: {
      data(newVal) {
        this.curValue = newVal.name;
        this.curDescrip = newVal.desc;
      },
    },
    components: { ConfigBox, CmInput, CmSelect, DistPicker, ScrollBar, PopsMsg },
    data() {
      return {
        tabs: [
          { id: 'setting', text: this.title },
        ],
        correctFlag: false,
        errorFlag: false,
        curValue: this.data.name,
        curDescrip: this.data.desc,
        curSelect: [],
        info: {
          username: '',
          first_name: '',
          attribution: '',
          dept: '',
          domain_name: '',
          domains: [],
          email: '',
          name: '',
          role_name: '',
          roles: [],
          tel: '',
        },
        pwd1: '',
        pwd2: '',
        domainList: ['所有'],
        selectDomain: '所有',
        roleList: ['所有'],
        selectRole: '所有',
        usernameFlag: false,
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
        usernameMsg: '',
        deptMsg: '',
        telMsg: '',
        emailMsg: '',
        oldpwdMsg: '',
        pwd1Msg: '',
        pwd2Msg: '',
      };
    },
    computed: {
      roleDetail() {
        const index = _.findIndex(this.info.roles, d => d.name === this.selectRole);
        return index === -1 ? '' : this.info.roles[index].permision.join(', ');
      },
      domainDetail() {
        const index = _.findIndex(this.info.domains, d => d.name === this.selectDomain);
        return index === -1 ? '' : this.info.domains[index].detail.join(', ');
      },
    },
    methods: {
      onChange(val) {
        this.curValue = val;
        if (this.curValue === '') {
          this.usernameFlag = true;
          this.usernameMsg = '';
          this.correctFlag = false;
        } else {
          const char = /^[\u4E00-\u9FA5A-Za-z]{1}[\u4E00-\u9FA5A-Za-z\d]{1,9}$/;
          // console.log(char.test(this.curValue));
          if (char.test(this.curValue)) {
            const reqData = { username: this.curValue };
            if (this.data.id !== null) {
              reqData._id = this.data.id;
            }
            checkUser(reqData).then((res) => {
              if (res.data.code !== 0) {
                this.correctFlag = false;
                this.usernameFlag = true;
                this.usernameMsg = res.data.msg;
              } else {
                this.correctFlag = true;
                this.usernameFlag = false;
                this.usernameMsg = '';
              }
            }).catch();
          } else {
            this.usernameFlag = true;
            this.correctFlag = false;
            this.usernameMsg = '2-10位中英文数字且不以数字开头';
          }
        }
      },
      changeRole(newV) {
        this.selectRole = newV;
        this.info.role_name = newV;
        this.info.role = mapToId(newV, this.info.roles);
      },
      changeDomain(newV) {
        this.selectDomain = newV;
        this.info.domain_name = newV;
        this.info.domain = mapToId(newV, this.info.domains);
      },
      initModal() {
        // getUserEditInfo(this.data.id ? {} : { id: this.data.id }).then((res) => {
        getUserEditInfo({
          user_id: this.data.id === null ? '' : this.data.id,
        }).then((res) => {
          const data = res.data.data;
          Object.assign(this.info, data);
          [this.roleList, this.domainList] = [data.roles.map(d => d.name), data.domains.map(d => d.name)];
          [this.selectRole, this.selectDomain] = [data.role_name, data.domain_name];
          [this.info.role, this.info.domain] = [mapToId(data.role_name, data.roles), mapToId(data.domain_name, data.domains)];
        });
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
              this[`${name}Flag`] = false;
            }
          }
        }
      },
      showPopsTip(e, flag) {
        console.log(this[`${flag}Flag`], this.errmsg);
        this.errmsg = this[`${flag}Msg`];
        if (this[`${flag}Flag`] && this.errmsg !== '') {
          const ele = e.target.parentNode.getBoundingClientRect();
          this.top = ele.top;
          this.lefts = ele.left + ele.width / 2;
          this.showPops = true;
        }
      },
      close() {
        this.$emit('onClose');
      },
      saveConfig() {
        if (this.data.id === null) {
          this.onChange(this.info.username);
          this.validatePwd(this.pwd1, 'pwd1');
        }
        this.validateCmName(this.info.first_name, 'name');
        this.validatePhone(this.info.tel, 'tel');
        this.validateMail(this.info.email, 'email');
        this.validateCmName(this.info.dept, 'dept');
        const req = Object.assign({}, this.info, {
          password1: this.pwd1,
          password2: this.pwd2,
        });
        // console.log(req);
        delete req.domains;
        delete req.roles;
        saveUserChange(req).then((res) => {
          // console.log(res);
          if (res.data.code === 0) {
            this.$emit('onSave');
          }
        });
      },
      handleCheckbox(key, e) {
        if (e.target.checked) {
          this.curSelect.push(key);
        } else {
          _.remove(this.curSelect, d => d === key);
        }
        // console.log(this.curSelect);
      },
      selectedProvince(data) {
        this.info.attribution = data;
      },
    },
    mounted() {
      this.initModal();
    },
  };
</script>

<style lang="scss">
.user-manage{
  .config-container{
    .config-main{
      .nav-content{
        box-sizing: border-box;
        > div:nth-of-type(1){
          padding: 0;
        }
      }
      .ps--active-x > .ps__rail-x, .ps--active-y > .ps__rail-y {
        background-color: #070f16;
      }
      .ps__thumb-y, .ps__thumb-x {
        background: #1d5d82;
      }
    }
    .content {
      .nav-content{
        // height: calc(100% - 63px) !important;
        overflow-y: auto;
      }
    }
  }
}
.dist-picker{
  margin-left: 15px;
}
</style>

<style lang="scss" scoped>
.user-manage{
  div{
    box-sizing: border-box;
  }
  .user-setting-content{
    width: 1050px;
    height: 355px;
    padding-left: 50px !important;
    border: 1px solid #223f5d;
    display: flex;
    .setting-left{
      width: 700px;
    }
    .input-group{
      >div{
        display: inline-block;
        width: 277px;
        // margin-bottom: 15px;
        // line-height: 40px;
        // margin-right: 30px;
        margin: 5px 0 5px 30px;
        text-align: right;
      }
      .title{
        position: relative;
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        color: #ddd;
        line-height: 30px;
        text-align: right;
        &.required:after {
          content: '*';
          position: absolute;
          left: -15px;
          top: 2px;
          color: red;
        }
      }
      .checkbox-div{
        display: block;
      }
    }
    .annotation{
      font-size: 12px;
      color: #727272;
      padding-left: 107px;
    }
    .setting-right{
      width: 350px;
      border-left: 1px solid #223f5d;
      background-color: #04111a;
      font-size: 12px;
      color: #66737e;
      padding-left: 10px;
      .title5{
        font-size: 16px;
        color: #4ab2a5;
        padding-top: 15px;
        line-height: 30px;
      }
      .title6{
        font-size: 14px;
        color: #e0e9f1;
        line-height: 24px;
      }
    }
  }
  .role-info{
    .baes-info{
    }
    .perssion-info{
      .perssion{
        margin: 10px 0;
        padding-bottom: 10px;
        &.active{
          background-color: #133049;
          .perssion-head {
            border: none;
          }
        }
        &.toggle-show{
          border: 1px solid #223f5d;
          .perssion-head {
            border: none;
          }
        }
        .perssion-head{
          width: 100%;
          height: 40px;
          line-height: 38px;
          color: #f2f6f9;
          box-sizing: border-box;
          padding: 0 20px;
          margin: 10px 0 5px 0;
          border: 1px solid #223f5d;
          .head-circle{
            display: inline-block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            margin-bottom: 2px;
            margin-right: 10px;
            box-shadow: 0 0 3px #14cef5;
            background-color: #14cef5;
          }
          .toggle{
            display:inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: url(../../../assets/common/bms-toggle.svg) no-repeat center;
            background-size: 130% 130%;
            float: right;
            margin-top: 10px;
            cursor: pointer;
          }
        }
        .perssion-content{
          padding-left: 40px;
          .each-perssion{
            height: 28px;
            line-height:28px;
            color: #ddd;
            font-size: 12px;
            .perssion-title{
              display: inline-block;
              width: 150px;
              .perssion-index{
                display: inline-block;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background-color: #14cef5;
                color: #fff;
                text-align: center;
                font-size: 12px;
                line-height: 15px;
                font-style: normal;
                margin-right: 5px;
              }
            }
            .each-opration{
              margin-right: 15px;
              vertical-align: middle;
              input{
                &[type="checkbox"]{
                  height: 14px;
                  vertical-align: middle;
                  width: 14px;
                  border: 1px solid #278c89;
                  border-radius: 3px;
                  margin-right: 5px;
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
              }
              samp{
                opacity: .6;
                &.active{
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }


    .proImg {
      position: relative;
      font-size: 16px;
      color: #14cef5;
      vertical-align: middle;
      padding: 15px 0 10px 0;
      &:after {
        content: '';
        background: url("../../../assets/common/tag.png") 0 0 no-repeat;
        position: absolute;
        left: -15px;
        top: 20px;
        width: 10px;
        height: 12px;
      }
    }
  }

  .checkbox-div{
    width: 620px;
    min-height: 40px;
    background-color: #133049;
    border: 1px solid #223f5d;
    .checkbox-item{
      display: inline-block;
      width: 300px;
      height: 60px;
      line-height: 40px;
      padding-left: 10px;
      font-size: 12px;
      color: rgba(221, 221, 221, 0.6);
    }
  }
  .cm-input{
    vertical-align: middle;
    margin-left: 15px;
  }
  .cm-select{
    width: 535px;
    margin-left: 15px;
  }
}
</style>