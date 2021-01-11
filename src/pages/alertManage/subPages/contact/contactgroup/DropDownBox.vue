<template>
  <div id="drop-down-box">
    <Cmtip v-if="showTips" :closeFn="() => showTips = false"
      :tipContent="tipContent" :showFooter="true"
      @on-confirm="deleteBaseLine">
    </Cmtip>
    <AddGroup v-if="showAddGroup" @close="closeAddGroup" :editData="group"></AddGroup>
    <div class="drop-header">
      <P class="sub-title proImg">{{group.name}}</P>
      <div class="drop-btns" :class="{'drop-btns-disable' : !canOpen}">
        <img src="../../../../../assets/alertManage/edit.svg" width="25" height="25" class="btn-edit" v-if="!defaultShow" @click="editGroup"/>
        <img src="../../../../../assets/alertManage/pro-delete.svg" width="25" height="25" class="btn-del" v-if="!defaultShow && group.is_modify && !group.default" @click="delgroup"/>
        <img src="../../../../../assets/alertManage/pro-delete-gray.svg" width="25" height="25" class="btn-del" v-if="!(!defaultShow && group.is_modify) && !group.default" @click="delgroup"/>
        <img :src="require(`../../../../../assets/alertManage/${canOpen ? 'down' : 'down_disable'}.svg`)" 
        @click="dropDown" width="25" height="25" 
        :class="isdown ? 'btn-down-down' : 'btn-down-left'"/>
      </div>
    </div>
    <!-- <transition name="drop"> -->
    <div class="drop-content" v-show="isShowContent && showT">
      <slot></slot>
    </div>
    <!-- </transition> -->
  </div>
</template>
<script>
import Cmtip from '@/components/basic/CmTip/CmTip';
import AddGroup from './../alert/AddGroup';
import { delGroup } from './../../../service';

export default {
  components: { AddGroup, Cmtip },
  name: 'dropdownbox',
  props: {
    group: {
      type: Object,
      default: () => {},
    },
    defaultShow: {
      type: Boolean,
      default: false,
    },
    isShow: {
      type: Boolean,
    },
    showIndex: {
      type: Number,
    },
    canOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showTips: false,
      tipContent: '确认删除已选联系组?',
      showAddGroup: false,
      isdown: false, // 控制向下的图标方向
      isShowContent: false, // 控制是否显示内容
    };
  },
  created() {
    this.isShowContent = this.isShow;
  },
  computed: {
    showT() {
      this.isdown = this.isShow;
      this.isShowContent = this.isShow;
      return this.isShow;
    },
  },
  methods: {
    deleteBaseLine() {
      const groupList = [];
      groupList.push(this.group._id);
      const _this = this;
      delGroup({ id_list: JSON.stringify(groupList) }).then((res) => {
        console.log(res.data);
        _this.showTips = false;
        _this.$emit('update');
      });
    },
    delgroup() {
      if (!this.defaultShow && this.group.is_modify) {
        this.showTips = true;
      }
    },
    closeAddGroup() {
      this.showAddGroup = false;
      this.$emit('update');
      this.$emit('closeEdit');
    },
    editGroup() {
      this.showAddGroup = true;
    },
    dropDown() {
      if (this.canOpen) {
        this.isdown = !this.isdown;
        this.isShowContent = !this.isShowContent;
        if (this.isShowContent === true) {
          this.$emit('showIndex', this.showIndex);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  #drop-down-box{
    width: 99.8%;
    margin-left: 0;
    margin-right: 0;
    .drop-header{
      display: flex;
      width: 100%;
      height: 35px;
      background-color: #092535;
      border:1px solid #1a5275;
      .sub-title{
        line-height: 20px;
        margin-top: 6px;
        margin-left: 20px;
        padding-left: 15px;
      }
      .drop-btns{
        margin-left: auto;
        img{
          margin-top: 4px;
          cursor: pointer;
        }
        .btn-down-left{
          margin-left: 10px;
          margin-right: 10px;
          animation: toleft 0.5s;
          transform:rotate(90deg);
        }
        .btn-down-down{
          margin-left: 10px;
          margin-right: 10px;
          animation: todown 0.5s;
          transform:rotate(0deg);
        }
      }
      .drop-btns-disable{
        .btn-down-left, .btn-down-down{
          cursor: default;
        }
      }
    }
    .drop-content{
      width: 100%;
      background-color: #11364b;
    }
  }
  @keyframes todown {
    from{
      transform:rotate(90deg);
    }
    to {
      transform:rotate(0deg);
    }
  }
  @keyframes toleft {
    from{
      transform:rotate(0deg);
    }
    to {
      transform:rotate(90deg);
    }
  }
  .drop-enter-active, .drop-leave-active {
    transition: all .5s;
  }
  .drop-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    // transform:scaleY(0); 
    max-height: 0;
  }
  .drop-enter{
    opacity: 0;
    // transform:scaleY(0);
    max-height: 0;
  }
</style>