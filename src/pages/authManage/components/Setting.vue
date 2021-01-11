<template>
  <config-box :tabs="tabs" :width='720' :height='500' :scrollheight="scrollheight"
    @closeConfig="close" @saveConfig="saveSettings">
    <div slot="setting">
      <div class="role-info">
        <div class="baes-info">
          <div class="proImg">基本信息</div>
          <div>
            <span class="title required">角色名称</span>
            <CmInput :value="curValue" :width="inputWidth" type="popsUp" :correctFlag="correctFlag" :errorFlag="errorFlag" :tipFlag="tipFlag" :tipMessage="tipMessage"
             @on-change="onChange"></CmInput>
          </div>
          <div>
            <span class="title">角色描述</span>
            <CmTextarea v-model="curDescrip" :width="textWidth" type="popsUp"></CmTextarea>
          </div>
        </div>
        <div class="perssion-info">
          <div class="proImg">功能操作权限<span v-if="unchoosePer" class="perssion-tip">功能操作权限未分配</span></div>
          <div class="perssion" ref="perssion" v-for="(item, index) in data.per" :key="index">
            <div class="perssion-head">
              <span><i class="head-circle"></i>{{item.model}}</span>
              <span class="toggle" @click="toggle(index)"></span>
            </div>
            <div class="main-perssion">
              <div class="perssion-content" v-for="(x, i) in item.func" :key="i">
                <div class="each-perssion">
                  <span class="perssion-title">
                    <i class="perssion-index">{{i + 1}}</i>{{x.function}}
                  </span>
                  <span class="each-opration" v-for="(p, l) in x.permision" :key="l">
                    <input :ref="p.alias" type="checkbox" :checked="p.is_own" @change="choosePerssion(p.alias, index, i)">
                    <samp :class="{'active': p.is_own}" :ref="`${p.alias}Label`">{{p.name}}</samp></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </config-box>
</template>

<script>
  import { ConfigBox, CmInput, CmTextarea } from '@/components/basic';
  import { checkName, saveChange } from '../service';

  export default {
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
      num: {
        type: [Number, String],
        default: '',
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
        tipMessage: '角色名称已存在，请重新输入',
        curValue: this.data.name,
        inputWidth: 535,
        curDescrip: this.data.desc,
        textWidth: 535,
        permission: [
          {
            model: '首页',
            func_block: [
              {
                functional: '首页',
                permision: [
                  {
                    name: '查看',
                    is_own: true,
                  },
                  {
                    name: '编辑',
                    is_own: false,
                  },
                ],
              },
            ],
          },
          {
            model: '业务墙',
            func_block: [
              {
                functional: '可视化服务图',
                permision: [
                  {
                    name: '查看',
                    is_own: true,
                  },
                  {
                    name: '编辑',
                    is_own: true,
                  },
                  {
                    name: '导入',
                    is_own: true,
                  },
                  {
                    name: '导出',
                    is_own: true,
                  },
                ],
              },
              {
                functional: '交易总览',
                permision: [
                  {
                    name: '查看',
                    is_own: true,
                  },
                  {
                    name: '编辑',
                    is_own: true,
                  },
                ],
              },
            ],
          },
        ],
        isActive: false,
        isShow: [],
        selectList: [],
        listTitle: [],
        listOrder: [],
        unchoosePer: false,
        scrollheight: 410,
        prePerssion: [],
      };
    },
    methods: {
      saveSettings() {
        if (this.curValue === '') {
          this.errorFlag = true;
          this.correctFlag = false;
        } else if (this.listTitle.length === 0) {
          this.unchoosePer = true;
        } else {
          const data = {
            num: this.title === '编辑' ? this.num : '',
            name: this.curValue,
            desc: this.curDescrip,
            permision: JSON.stringify(this.listTitle),
          };
          saveChange(data).then((res) => {
            if (res.data.code === 0) {
              this.$emit('onSave');
            }
          }).catch();
        }
      },
      choosePerssion(name, index, order) {
        this.unchoosePer = false;
        if (this.$refs[name][0].checked) {
          this.selectList.push({
            order: index,
            name,
          });
          this.$refs[`${name}Label`][0].classList.add('active');
          this.selectList.forEach((x) => {
            this.listOrder.push(x.order);
            this.listTitle.push(x.name);
          });
          this.listTitle = this.dedupe(this.listTitle.concat(this.prePerssion));
          this.listOrder = this.dedupe(this.listOrder);
          this.listOrder.forEach((x) => {
            this.$refs.perssion[x].classList.add('active');
          });
        } else {
          this.$refs[`${name}Label`][0].classList.remove('active');
          if (this.title === '新建角色') {
            this.selectList.forEach((x, i) => {
              if (x.name === name) this.selectList.splice(i, 1);
            });
            this.listOrder = [];
            this.listTitle = [];
            this.selectList.forEach((x) => {
              this.listOrder.push(x.order);
              this.listTitle.push(x.name);
            });
            this.listTitle = this.dedupe(this.listTitle);
            this.listOrder = this.dedupe(this.listOrder);
          } else {
            this.listTitle = this.dedupe(this.listTitle.concat(this.prePerssion));
            this.listTitle.forEach((x, i) => {
              if (x === name) this.listTitle.splice(i, 1);
            });
            this.selectList.forEach((x, i) => {
              if (x.name === name) this.selectList.splice(i, 1);
            });
            this.prePerssion = this.listTitle;
            const sampList = Array.from(this.$refs.perssion[index].getElementsByTagName('samp'));
            let orderFlag = true;
            sampList.forEach((x) => {
              if (x.classList[0] === 'active') {
                orderFlag = false;
                return; // eslint-disable-line
              }
            });
            if (orderFlag) this.listOrder.splice(this.listOrder.findIndex(item => item === index), 1);
          }
          !this.listOrder.includes(index) ? this.$refs.perssion[index].classList.remove('active') : ''; // eslint-disable-line
        }
        const self = this;
        const target = self.data.per[index].func[order].permision[0];
        this.listTitle.forEach((item) => {
          if (item === name && target.name === '查看') {
            self.$refs[target.alias][0].checked = true;
            self.$refs[`${target.alias}Label`][0].classList.add('active');
            if (self.listTitle.indexOf(target.alias) === -1) {
              self.listTitle.push(target.alias);
              self.selectList.push({
                name: target.alias,
                order: index,
              });
            }
          }
        });
        // console.log('this.listTitle', this.listTitle);
      },
      dedupe(array) { // 数组去重
        return Array.from(new Set(array));
      },
      toggle(index) {
        this.$refs.perssion.forEach((x, i) => {
          if (x.classList.contains('toggle-show') && i !== index) {
            this.$refs.perssion[i].classList.remove('toggle-show');
            this.$refs.perssion[i].children[1].classList.remove('show-content');
          }
        });
        if (this.$refs.perssion[index].classList.contains('toggle-show')) {
          this.$refs.perssion[index].classList.remove('toggle-show');
          this.$refs.perssion[index].children[1].classList.remove('show-content');
        } else {
          this.$refs.perssion[index].classList.add('toggle-show');
          this.$refs.perssion[index].children[1].classList.add('show-content');
        }
      },
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
            let num = 0;
            if (this.title === '编辑') num = this.num;
            checkName({ name: this.curValue, num }).then((res) => {
              if (res.data.code !== 0) {
                this.errorFlag = true;
                this.correctFlag = false;
                this.tipFlag = true;
                this.tipMessage = '角色名称已存在，请重新输入';
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
      close() {
        this.curValue = '';
        this.curDescrip = '';
        this.$emit('onClose');
      },
    },
    mounted() {
      if (this.title === '编辑') {
        this.data.per.forEach((item, index) => {
          item.func.forEach((x) => {
            x.permision.forEach((p) => {
              if (p.is_own) {
                this.listTitle.push(p.alias);
                this.prePerssion = this.listTitle;
                this.$refs.perssion[index].classList.add('active');
              }
            });
          });
        });
        this.$refs.perssion.forEach((x, i) => {
          if (x.classList.contains('active')) this.listOrder.push(i);
        });
      }
    },
    updated() {
      this.$nextTick(() => {
        if (this.listTitle.length !== 0) {
          this.listTitle.forEach((x) => {
            if (this.$refs[x].length !== 0) this.$refs[x][0].checked = true;
          });
        }
      });
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
  }
  .perssion-info{
    .perssion{
      margin-top: 10px;
      border: 1px solid #223f5d;
      &.active{
        background-color: #133049;
      }
      &.toggle-show{
        border: 1px solid #223f5d;
        .perssion-head {
          border: none;
          .toggle{
            transform: rotate(0deg);
          }
        }
      }
      .perssion-head{
        width: 100%;
        height: 23px;
        line-height: 20px;
        color: #f2f6f9;
        box-sizing: border-box;
        padding: 0 20px;
        margin: 10px 0 5px 0;
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
          transform: rotate(-90deg);
          background: url(../../../assets/common/bms-toggle.svg) no-repeat center;
          background-size: 130% 130%;
          float: right;
          cursor: pointer;
        }
      }
      .main-perssion{
        display: none;
        &.show-content{
          display: block;
        }
        .perssion-content{
          padding-left: 40px;
          margin-bottom: 5px;
          user-select: none;
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
                line-height: 14px;
                font-style: normal;
                margin-right: 5px;
              }
            }
            .each-opration{
              margin-right: 15px;
              vertical-align: middle;
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
  }
  .title{
    position: relative;
    width: calc(100% - 535px);
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
    .perssion-tip{
      font-size: 12px;
      color:red;
      margin-left: 10px;
    }
  }
}
</style>