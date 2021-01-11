<template>
  <div class="trade-relative">
    <div class="app-list trans-type" :class="currentClass" >
      <div class="trans-body" @click="title=='交易类型'?getList('trans_type'):getList('sub_trans_type')">
        <span class="type" v-show="listSelected">{{title}}</span>
        <span class="title" v-if="!listSelected">{{title}}</span>
        <span class="title titleSelected" v-else @mouseover="showWhole($event, listTitle)" @mouseout="hideTip">{{listTitle}}</span>
      </div>
      <ul class="last-menu-ul" v-show="listStatus">
        <li class="last-menu-list" v-for="x in list" :class="{'has-data-show':x.has_data}" @click="getMapData(x)">{{x.trans_type}}</li>
      </ul>
    </div>
  </div>
</template>
<script>

  import {
    getInitData,
  } from '@/pages/areaMonitor/service';
  import { textWidth } from '@/helpers/utils';

  export default{
    props: ['title', 'status', 'appName', 'intfName', 'latest'],
    data() {
      return {
        list: [],
        currentClass: 'noSelect',
        typeFlag: false, // 交易类型状态标识
        channelFlag: false, // 交易渠道状态标识
        selected: false, // 判断交易节点是否选中的样式依据
        listSelected: false, // 下拉选项选择后的状态
        listTitle: '', // 当前下拉选中项
        listStatus: false, // 判断显示某个下拉选项的值
        currentStep: 1, // 当前处于第几步
      };
    },
    watch: {
      status(newVal) {
        this.getClass(newVal);
      },
      currentStep(newVal) {
        if (newVal === 1 && this.listTitle === '') {
          const data = {
            title: this.title,
            type: '',
          };
          this.$emit('on-mapdata', data);
        }
      },
    },
    methods: {
      showWhole(e, name) {
        if (textWidth(name) >= 210) {
          const ele = e.target.parentNode;
          const position = {
            left: ele.getBoundingClientRect().left - 70,
            top: ele.getBoundingClientRect().top + 30,
            tipName: name,
          };
          this.$emit('showTip', position);
        }
      },
      hideTip() {
        this.$emit('hideTip');
      },
      getClass(status) {
        if (status) {
          if (this.selected === true) {
            this.currentClass = 'noSelect selected';
          } else {
            this.currentClass = 'noSelect';
            this.listSelected = false;
          }
        } else {
          this.currentClass = 'noSelect trans-nodata';
        }
      },
      async getInitData(data) {
        try {
          const res = await getInitData(data);
          if (res.data.code === 0) this.list = res.data.data.value;
        } catch (e) {
          console.log(e);
        }
      },
      getList(tradeType) {
        if (this.currentStep === 1) {
          this.currentStep = 2;
          this.selected = true;
          this.currentClass = 'noSelect selected';
          this.listStatus = true;
          this.listTitle = '';
          this.$emit('resetReleative', tradeType);
          const postTradeData = {
            app_name: this.appName,
            intf_name: this.intfName,
            type: tradeType,
          };
          if (this.latest !== '') postTradeData.latest = this.latest;
          this.getInitData(postTradeData);
        } else if (this.currentStep === 2) {
          this.currentStep = 1;
          this.selected = false;
          this.currentClass = 'noSelect';
          this.listStatus = false;
        } else if (this.currentStep === 3) {
          this.currentStep = 2;
          this.selected = true;
          this.listSelected = false;
          this.currentClass = 'noSelect selected';
          this.listStatus = true;
          this.listTitle = '';
        }
      },
      getMapData(x) {
        this.currentStep = 3;
        this.selected = true;
        this.listSelected = true;
        this.currentClass = 'noSelect selected';
        this.listStatus = false;
        this.listTitle = x.trans_type;
        const data = {
          title: this.title,
          type: x.trans_type,
        };
        this.$emit('on-mapdata', data);
      },
      backIntf() {
        if (this.status) {
          this.currentStep = 1;
          this.selected = false;
          this.listSelected = false;
          this.currentClass = 'noSelect';
          this.listStatus = false;
        }
      },
      backInit() {
        if (this.status) {
          this.currentStep = 1;
          this.selected = false;
          this.listSelected = false;
          this.currentClass = 'noSelect';
          this.listStatus = false;
        }
      },
      resizeSelf() {
        this.currentStep = 1;
        if (this.listTitle === '') {
          if (this.status) this.currentClass = 'noSelect';
          else this.currentClass = 'noSelect trans-nodata';
        }
        this.listStatus = false;
      },
      resetComponent() {
        if ([2, 3].includes(this.currentStep)) {
          this.currentStep = 1;
          if (this.status) this.currentClass = 'noSelect';
          else this.currentClass = 'noSelect trans-nodata';
          this.listStatus = false;
          this.listSelected = false;
        }
      },
    },
    created() {
      this.getClass(this.status);
    },
  };
</script>
<style lang="scss" scoped>
.trade-relative{
  display: inline-block;
  .app-list{
    width: 120px;
    height: 120px;
    color: #F0EFEF;
    margin: 5px 5px 5px;
    direction: ltr;
    &.trans-type{
      display: block;
      float: right;
      margin-right: 15px;
      text-align: center;
      position:relative;
      .trans-body{
        height: calc(100% - 10px);
        font-size: 18px;
        font-weight: 600;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .title{
          padding: 3px;
        }
      }
    }
    &.noSelect{
      background:url(../../assets/areaMonitor/noSelect.png) no-repeat center;
      background-size:contain;
    }
    &.selected{
      background:url(../../assets/areaMonitor/selecting.png) no-repeat center;
      background-size:contain;
      .trans-body{
        position:relative;
        .type{
          font-size: 14px;
          height: 25px;
          line-height: 25px;
          text-align: left;
          padding: 5px 5px 0;
          position: absolute;
          top: 0;
          left: 0;
        }
        .titleSelected{
          padding-top: 18px;
          color:#00D6D1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
    }
    &.trans-nodata{
      pointer-events: none;
      color: #666;
    }
  }
  .last-menu-ul{
    position:absolute;
    width: 220px;
    background: #122638;
    height: auto;
    max-height: 190px;
    overflow: auto;
    border: 1px solid #4B5C60;
    top: 0;
    right: -230px;
    direction: ltr;
    min-height: 120px;
    .last-menu-list{
      border: none;
      margin: 0;
      text-align: center;
      text-align-last: center;
      color: #666;
      height: 25px;
      line-height: 25px;
      border-radius: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      border-bottom: 1px solid #263542;
      font-size: 12px;
      pointer-events: none;
      &:hover{
        background-color: #8fa7b5;
      }
    }
    .has-data-show{
      color: #f9f9f9;
      cursor: pointer;
      pointer-events: unset;
    }
  }
}
</style>