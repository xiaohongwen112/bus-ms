<template>
  <config-box :tabs="tabs" :width='720' :height='350' :scrollheight="scrollheight"
    @closeConfig="close" @saveConfig="saveConfig">
    <div slot="setting" class="setting-box">
      <div class="role-info">
        <div class="baes-info">
          <div class="proImg">基本信息</div>
          <div>
            <span class="title required">域名称</span>
            <CmInput v-model="curValue" :width="inputWidth" type="popsUp" :correctFlag="correctFlag" :errorFlag="errorFlag" :tipFlag="tipFlag" :tipMessage="tipMessage"
            @on-change="onChange"></CmInput>
          </div>
          <div>
            <span class="title">域描述</span>
            <CmTextarea v-model="curDescrip" :width="textWidth" type="popsUp"></CmTextarea>
          </div>
        </div>
      </div>
      <div class="role-info">
        <div class="baes-info">
          <div class="proImg">业务范围</div>
          <div class="checkbox-div" :class="{'fill': options.length > 0 && curSelect.length > 0 }">
            <div v-for="(option, index) in  options" :key="index" class="checkbox-item">
              <input type="checkbox" :value="option.key" :checked="curSelect.includes(option.key)" @change="handleCheckbox(option.key, $event)"/>
              <label v-text="option.name"></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </config-box>
</template>

<script>
  // import _ from 'lodash';
  import { ConfigBox, CmInput, CmTextarea } from '@/components/basic';
  import { checkDomain, getEditInfo, creatDomain } from '../service';

  export default {
    name: 'ModalDomain',
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
    components: { ConfigBox, CmInput, CmTextarea },
    data() {
      return {
        tabs: [
          { id: 'setting', text: this.title },
        ],
        correctFlag: false,
        errorFlag: false,
        tipFlag: false,
        tipMessage: '域名称已存在，请重新输入',
        curValue: this.data.name,
        inputWidth: 535,
        curDescrip: this.data.desc,
        curSelect: [],
        options: [],
        textWidth: 535,
        isActive: false,
        isShow: [],
        scrollheight: 280,
      };
    },
    methods: {
      onChange(val) {
        this.curValue = val;
        if (this.curValue === '') {
          this.errorFlag = true;
          this.tipFlag = false;
          this.correctFlag = false;
        } else {
          const char = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
          if (char.test(this.curValue)) {
            if (this.curValue.length < 2) {
              this.errorFlag = true;
              this.correctFlag = false;
              this.tipFlag = true;
              this.tipMessage = '长度至少为2';
              return;
            }
            const reqData = { name: this.curValue };
            if (this.data.id !== null) {
              reqData._id = this.data.id;
            }
            checkDomain(reqData).then((res) => {
              if (res.data.code !== 0) {
                this.errorFlag = true;
                this.correctFlag = false;
                this.tipFlag = true;
                this.tipMessage = '域名称已存在，请重新输入';
              } else {
                this.errorFlag = false;
                this.correctFlag = true;
                this.tipFlag = false;
              }
            }).catch();
          } else {
            this.errorFlag = true;
            this.correctFlag = false;
            this.tipFlag = true;
            this.tipMessage = '不能输入中文、英文和数字之外的字符';
          }
        }
      },
      initModal() {
        getEditInfo(this.data._id ? {} : { _id: this.data.id }).then((res) => {
          const data = res.data.data;
          // console.log(data);
          this.options = data.app_names.map(d => ({ key: d._id, name: d.disp_name }));
          this.curValue = data.domain_name;
          this.curDescrip = data.desc;
          this.curSelect = data.scope;
        });
      },
      close() {
        this.curValue = '';
        this.curDescrip = '';
        this.$emit('onClose');
      },
      saveConfig() {
        // save
        this.onChange(this.curValue);
        if (!this.errorFlag) {
          const reqData = {
            name: this.curValue,
            scope: JSON.stringify(this.curSelect),
            desc: this.curDescrip,
          };
          if (this.data.id !== null) {
            reqData._id = this.data.id;
          }
          creatDomain(this.data.id === null, reqData).then((res) => {
            console.log(res);
            if (res.data.code === 0) {
              this.$emit('onSave');
            }
          });
        }
      },
      handleCheckbox(key, e) {
        if (e.target.checked) {
          this.curSelect.push(key);
        } else {
          const newSelect = [];
          this.curSelect.forEach((d) => {
            if (d !== key) {
              newSelect.push(d);
            }
          });
          this.curSelect = newSelect;
        }
      },
    },
    mounted() {
      this.initModal();
    },
  };
</script>

<style lang="scss">
.role-manage{
  .config-container{
    .config-main{
      width: 720px !important;
      .nav-content{
        box-sizing: border-box;
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
</style>

<style lang="scss" scoped>
.role-info{
  .baes-info{
    >div{
      display: flex;
      margin-bottom: 15px;
    }
    .checkbox-div{
      display: block;
    }
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
  .title{
    position: relative;
    // width: calc(100% - 535px);
    width: 88px;
    vertical-align: middle;
    font-size: 14px;
    color: #ddd;
    line-height: 30px;
    &.required:after {
      content: '*';
      position: absolute;
      left: -15px;
      top: 2px;
      color: red;
    }
  }
  .cm-input{
    vertical-align: middle;
  }
  .cm-input, .cm-textarea{
    float: right;
  }
  .proImg {
    position: relative;
    font-size: 16px;
    color: #14cef5;
    vertical-align: middle;
    &:after {
      content: '';
      background: url("../../../assets/common/tag.png") 0 0 no-repeat;
      position: absolute;
      left: -15px;
      top: 5px;
      width: 10px;
      height: 12px;
    }
  }
}
.cm-select{
  width: 535px;
  min-height: 60px;
}
.checkbox-div{
  width: 620px;
  min-height: 40px;
  border: 1px solid #223f5d;
  .checkbox-item{
    display: inline-block;
    width: 300px;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    font-size: 12px;
    color: rgba(221, 221, 221, 0.6);
  }
}
.checkbox-div.fill{
  background-color: #133049;
}
</style>