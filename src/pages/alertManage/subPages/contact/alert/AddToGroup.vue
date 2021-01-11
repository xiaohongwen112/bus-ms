<template>
  <div id="add-to-group">
    <ConfigBox :hideStore="false" :width="720" :height="265" :tabs="tabs" :errors="errors" :active="active" @closeConfig="close">
      <div class="wrap" slot="addPeopleToGroup">
        <div class="selectd">
          <p class="title"><span style="color:red;">* </span>联系组</p>
          <input type="radio" value="haved" name="radio" v-model="checked"><span>已有联系组</span>
          <input type="radio" value="new" name="radio" v-model="checked"><span>新建联系组</span>
        </div>
        <div class="new-group" v-if="checked === 'new'">
          <div class="group-name">
            <p class="title"><span style="color:red;">* </span>联系组名称</p>
            <AlertTip :tipContent="tipContent_name" :width="365" :isRight="nameisRight" :show="showNameTip && showName">
              <input @mouseover="() => {showName = true;}" @mouseout="() => {showName = false}" type="text" class="group-input" v-model="data.name" @blur="checkName" :style="showNameTip ? 'border:1px solid red': ''">
            </AlertTip>
          </div>
          <div class="group-Remarks">
            <p class="title">备注</p>
            <textarea maxlength="255" name="" id="" cols="30" rows="10" v-model="data.desc"></textarea>
          </div>
        </div>
        <div class="haved-group" v-if="checked === 'haved'">
          <p class="title"><span style="color:red;">* </span>选择联系组</p>
          <Select :list="list" :selectVal="selectVal" @on-change="changeSelect" :width="365" style="margin-left:3px;"></Select>
        </div>
        <div class="footer">
          <hr class="hr"/>
          <div class="save-or-cancel">
            <BmsBtn style="margin-left:560px" type="popsUp" @click="save">保存</BmsBtn>
            <CmSimpleBtn type="popsUp" style="margin-left:10px;" @click="close">取消</CmSimpleBtn>
          </div>
        </div>
      </div>
    </ConfigBox>
  </div>
</template>
<script>
import ConfigBox from '@/components/common/ConfigBox';
import { BmsBtn, CmSimpleBtn } from '@/components/basic/index';
import Select from '../Select2';
import AlertTip from './alertTip';
import { getGroupList, addToGroup, createGroup, checkGroupName } from './../../../service';

export default {
  components: {
    ConfigBox,
    Select,
    BmsBtn,
    CmSimpleBtn,
    AlertTip,
  },
  props: ['peopleIdList'],
  data() {
    return {
      showName: false,
      tipContent_name: '',
      nameisRight: false,
      showNameTip: false,
      tabs: [
        { id: 'addPeopleToGroup', text: '添加到联系组' },
      ],
      errors: [],
      active: 0,
      checked: 'haved',
      selectList: [],
      selectVal: '',
      data: {
        name: '',
        desc: '',
      },
    };
  },
  created() {
    this.getSelectList();
  },
  computed: {
    list() {
      return this.selectList.map(item => item.name);
    },
  },
  methods: {
    async checkName() {
      const _this = this;
      const res = await checkGroupName({ name: this.data.name });
      if (res.data.code === 0) {
        _this.nameisRight = true;
        _this.showNameTip = false;
        return true;
      }
      _this.nameisRight = false;
      _this.showNameTip = true;
      _this.tipContent_name = res.data.msg;
      return false;
    },
    changeSelect(val) {
      this.selectVal = val;
    },
    getSelectList() {
      getGroupList().then((res) => {
        this.selectList = res.data.data;
        this.selectVal = this.selectList[0].name;
      });
    },
    close() {
      this.$emit('close');
    },
    async save() {
      // sdf
      if (this.checked === 'haved') {
        const obj = {
          contact_id_list: JSON.stringify(this.peopleIdList),
          contact_group_id: this.selectList.filter(item => item.name === this.selectVal)[0]._id,
        };
        addToGroup(obj).then((res) => {
          console.log(res.data);
          this.$emit('save', res.data);
        });
      } else {
        const check = await this.checkName();
        if (!check && this.checked !== 'haved') {
          return;
        }
        const obj = {
          name: this.data.name,
          desc: this.data.desc,
          contact_list: JSON.stringify(this.peopleIdList),
        };
        createGroup(obj).then((res) => {
          console.log(res.data);
          this.$emit('save', res.data);
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  #add-to-group{
    position: absolute;
    z-index: 3;
    .wrap{
      margin-top: 10px;
      position: relative;
      .title{
        width: 130px;
        text-align: right;
        margin-right: 20px;
      }
      .selectd{
        display: flex;
        align-items: center;
        input{
          margin-top: 3px;
        }
        input[value="new"]{
          margin-left: 45px;
        }
      }
      .new-group{
        .group-name{
          margin-top: 15px;
          display: flex;
          margin-left: 3px;
          .group-input{
            width: 365px;
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
        .group-Remarks{
          display: flex;
          align-items: flex-start;
          margin-top: 15px;
          textarea{
            margin-left: 4px;
            width: 365px;
            height: 50px;
            resize:none;
            border:1px solid #223f5d;
            background-color: #081a29;
            border-radius: 3px;
            padding: 10px;
            padding-top: 5px;
            padding-bottom: 5px;
            box-sizing: border-box;
            color: white;
          }
        }
      }
      .haved-group{
        display: flex;
        align-items: center;
        margin-top: 15px;
      }
      .footer{
        width: 100%;
        position: absolute;
        top: 152px;
        left: -50px;
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
    &:checked{
      background: #139d8c url(../../../../../assets/common/checked.svg) 1px center;
      background-size: 180% 180%;
      background-position-x: -4.5px;
    }
  }
  input[type="radio"][disabled="disabled"]{
    border: 1px solid #062f2a;
    cursor: default;
  }
</style>