<template>
  <div id="add-group">
    <ConfigBox :hideStore="false" :width="1150" :height="460" :tabs="tabs" :errors="errors" :active="active" @closeConfig="close">
      <div class="wrap" slot="addGroup">
        <div class="group-name">
          <p class="title"><span style="color:red;">*  </span>联系组名称</p>
          <!-- 这里就是含有错误提示的样式 -->
          <AlertTip :width="340" :tipContent="tipContent_name" :isRight="nameisRight" :show="showNameTip && showName">
            <input @mouseover="() => {showName = true;}" @mouseout="() => {showName = false}" class="group-name-input" type="text" v-model="data.name" :disabled="false" @blur="checkName" :style="inputError ? 'border:1px solid red': ''">
          </AlertTip>
          <!-- 这里就是不含有错误提示的样式 -->
          <!-- <input class="group-name-input" type="text" v-model="data.name" :disabled="false" @blur="checkName" :style="inputError ? 'border:1px solid red': ''"> -->
        </div>
        <div class="group-remarks">
          <p class="title">备注</p>
          <input maxlength="255" class="group-remarks-input" type="text" v-model="data.desc">
        </div>
        <div class="group-select">
          <p class="title">选择联系人</p>
          <Transfer :groupId="editData._id" :isEdit="isEdit" @resIdList="(val) => { data.contact_list = JSON.stringify(val) }"></Transfer>
        </div>
        <div class="footer">
          <hr class="hr"/>
          <div class="save-or-cancel">
            <BmsBtn style="margin-left:990px" type="popsUp" @click="save" v-if="operation !== 2">保存</BmsBtn>
            <CmSimpleBtn :style="operation !== 2 ? 'margin-left:10px':'margin-left:1070px'" type="popsUp" @click="close">{{operation === 2 ? '确认' : '取消'}}</CmSimpleBtn>
          </div>
        </div>
      </div>
    </ConfigBox>
  </div>
</template>
<script>
import ConfigBox from '@/components/common/ConfigBox';
import { BmsBtn, CmSimpleBtn } from '@/components/basic/index';
import { createGroup, editGroup, checkGroupName } from './../../../service';
import Transfer from './Transfer';
import AlertTip from './alertTip';

export default {
  components: {
    ConfigBox,
    Transfer,
    BmsBtn,
    CmSimpleBtn,
    AlertTip,
  },
  props: {
    operation: {
      type: Number,
    },
    editData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showName: false,
      tipContent_name: '',
      nameisRight: false,
      showNameTip: false,
      inputError: false,
      tabs: [
        { id: 'addGroup', text: '新建' },
      ],
      errors: [],
      active: 0,
      data: {
        name: '',
        desc: '',
        contact_list: '[]',
      },
      isEdit: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async checkName() {
      const obj = {
        name: this.data.name,
      };
      if (JSON.stringify(this.editData) !== '{}') {
        obj._id = this.editData._id;
      }
      const _this = this;
      const res = await checkGroupName(obj);
      if (res.data.code === 0) {
        _this.nameisRight = true;
        _this.showNameTip = false;
        _this.inputError = false;
        return true;
      }
      _this.nameisRight = false;
      _this.showNameTip = true;
      _this.tipContent_name = res.data.msg;
      _this.inputError = true;
      return false;
    },
    init() {
      if (JSON.stringify(this.editData) !== '{}') {
        this.data.name = this.editData.name;
        this.data.desc = this.editData.desc;
        this.data.contact_list = [].concat(this.editData.contact_list);
        this.isEdit = true;
        this.tabs.pop();
        this.tabs.push({ id: 'addGroup', text: '编辑' });
      }
    },
    async save() {
      const isOk = await this.checkName();
      if (!isOk) {
        return;
      }
      if (JSON.stringify(this.editData) !== '{}') {
        const obj = {
          name: this.data.name,
          desc: this.data.desc,
          _id: this.editData._id,
          contact_list: this.data.contact_list,
        };
        editGroup(obj).then((res) => {
          console.log(res.data);
          this.$emit('close', res.data);
        });
      } else {
        createGroup(this.data).then((res) => {
          console.log(res.data);
          this.$emit('close', res.data);
        });
      }
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped>
  #add-group{
    position: absolute;
    z-index: 3;
    .title{
      width: 100px;
      text-align: right;
      margin-right: 20px;
    }
    .wrap{
      // display: flex;
      // justify-content: space-between;
      margin-top: 12px;
      .group-name{
        display: flex;
        margin-left: 3px;
        margin-bottom: 15px;
        .group-name-input{
          width: 340px;
          height: 25px;
          border:1px solid #223f5d;
          background-color: #081a29;
          border-radius: 3px;
          padding-left: 10px;
          padding-right: 10px;
          box-sizing: border-box;
          color: white;
        }
      }
      .group-remarks{
        margin-bottom: 15px;
        .group-remarks-input{
          width: 900px;
          height: 25px;
          border:1px solid #223f5d;
          background-color: #081a29;
          border-radius: 3px;
          padding-left: 10px;
          padding-right: 10px;
          box-sizing: border-box;
          color: white;
        }
      }
      .group-select{
        display: flex;
        align-items: flex-start;
      }
      .footer{
          position: absolute;
          top: 386px;
          left: 0px;
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
</style>