<template>
  <div class="config-container">
    <div class="config-main" :style="`width: ${styles.width}; height: ${styles.height}`">
      <header class="config-header" :style="`width: ${styles.width}`">
        <ul class="tabs" :style="`top: ${ulTop === '' ? styles.tabsTop : ulTop}`">
          <li
            v-for="(item,index) in tabs"
            :key="index"
            :id="item.id"
            :class="{
                active: index === activeIndex,
                error: errors.indexOf(item.id) > -1,
                'error-active': errors.indexOf(item.id) > -1 && index === activeIndex,
                'custom': custom
            }"
            @click="clickNav(index)">
            {{ item.text }}
          </li>
        </ul>
        <div class="CSBtn" :style="`top: ${csBtnTop === '' ? styles.csBtnTop : csBtnTop}`">
          <div v-if="hideClose" class="right-icon-div boxClose" :title="closeText" @click="onClickCancel">{{closeText}}</div>
        </div>
      </header>
      <div class="content" :style="`width: ${styles.width}; height: ${styles.height}`">
        <ScrollBar class="nav-content" v-for="(item,index) in tabs" v-show="index === activeIndex"  :key="index" :style="`height: ${scrollheight - 30}px`"
        @ps-scroll-up="handleScroll" @ps-scroll-down="handleScroll">
          <slot :name="item.id"></slot>
        </ScrollBar>
        <div class="nav-footer" v-if="hideStore">
          <div v-show="!onlyConfirm" class="footer-bnt cancel-bnt" @click="onClickCancel">取消</div>
          <div v-show="!onlyConfirm" class="footer-bnt save-bnt" @click="onClickSave">保存</div>
          <div v-show="onlyConfirm" class="footer-bnt save-bnt confirm" @click="onClickCancel">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ScrollBar from '@/components/basic/ScrollBar';

export default {
  name: 'config-box',
  components: { ScrollBar },
  props: {
    tabs: {
      type: Array,
      default() {
        return [];
      },
    },
    active: { type: Number, default: 0 },
    scrollheight: { type: Number, default: 0 },
    errors: {
      type: Array,
      default() {
        return [];
      },
    },
    hideClose: { type: Boolean, default: true },
    hideStore: { type: Boolean, default: true },
    closeText: { type: String, default: '关闭' },
    ulTop: { type: String, default: '' },
    ulLeft: { type: String, default: '' },
    csBtnTop: { type: String, default: '' },
    csBtnRight: { type: String, default: '' },
    width: {
      type: Number,
      default: 1280,
    },
    height: {
      type: Number,
      default: 500,
    },
    custom: { type: Boolean, default: false },
    onlyConfirm: { type: Boolean, default: false },
  },
  data() {
    return {
      activeIndex: this.active,
    };
  },
  computed: {
    styles() {
      let width = '';
      let tabsLeft = '';
      let csBtnRight = '';
      let height = '';
      let tabsTop = '';
      let csBtnTop = '';

      if (this.width <= 100) {
        width = `${this.width}%`;
        tabsLeft = `calc(50% - ${this.width / 2}%)`;
        csBtnRight = `calc(50% - ${this.width / 2}%)`;
      } else {
        width = `${this.width}px`;
        tabsLeft = `calc(50% - ${this.width / 2}px)`;
        csBtnRight = `calc(50% - ${this.width / 2}px)`;
      }
      if (this.height <= 100) {
        height = `${this.height}%`;
        tabsTop = `calc(50% - ${this.height / 2}% - 25px)`;
        csBtnTop = `calc(50% - ${this.height / 2}% - 15px)`;
      } else {
        height = `${this.height}px`;
        tabsTop = `calc(50% - ${this.height / 2}px - 25px)`;
        csBtnTop = `calc(50% - ${this.height / 2}px - 15px)`;
      }
      return {
        width,
        tabsLeft,
        csBtnRight,
        height,
        tabsTop,
        csBtnTop,
      };
    },
    activeId() {
      return this.tabs[this.activeIndex].id;
    },
  },
  methods: {
    handleScroll(event) {
      this.$emit('handleScroll', event);
    },
    clickNav(index) {
      this.activeIndex = index;
      this.$emit('changeNav', {
        id: this.activeId,
      });
    },
    onClickSave() {
      this.$emit('saveConfig');
    },
    onClickCancel() {
      this.activeIndex = this.active;
      this.$emit('closeConfig');
    },
  },
};
</script>

<style lang="scss">
  .config-container{
    .content{
      .pops-msg {
        position: fixed;
      }
      .nav-content{
        >div:nth-of-type(1){
          padding-left: 15px;
          padding-right: 60px;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .config-container {
    overflow: auto;
    z-index: 999;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    display: block;

    .config-main{
      width: 1280px;
      height: 500px;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
    }

    .config-header{
      height: 50px;
      display: flex;
      justify-content: space-between;
    }
    ul.tabs {
      min-width: 260px;
      text-align: left;
      // position: absolute;
      // left: calc(50% - 640px);
      width: auto;
      height: 50px;
      line-height: 50px;
      color: #ffffff;
      bottom: 0;
      top: calc(50% - 250px - 25px);

      li {
        background: url(../../assets/topo-nav/nav-tab.png) no-repeat;
        background-size: initial;
        background-position-y: 5px;
        margin-right: -10px;
        width: 158px;
        font-size: 18px;
        text-align: center;
        float: left;
        cursor: pointer;
      }

      li.active {
        background: url(../../assets/topo-nav/nav-tab-active.png) no-repeat;
        background-size: initial;
        background-position-y: 5px;
      }

      li.error {
        background: url(../../assets/topo-nav/nav-tab-error.png) no-repeat;
        background-size: initial;
        background-position-y: 5px;
      }

      li.error-active {
        background: url(../../assets/topo-nav/nav-tab-error-active.png) no-repeat;
        background-size: initial;
        background-position-y: 5px;
      }

      li.custom {
        position: absolute;
        top: -4px;
        width: 265px;
        height: 52px;
        line-height: 60px;
        color: #e0e9f1;
        background: url(../../assets/topo-nav/tag.svg) no-repeat;
        background-size: 100% 100%;
        background-position-y: 5px;
      }
    }

    .CSBtn {
      // position: absolute;
      margin-top: 9px;
      // right: calc(50% - 640px);
      background-repeat: no-repeat;
      top: calc(50% - 250px - 15px);
      width: 130px;
      height: 40px;
      color:#fff;

      div{
        cursor: pointer;
      }

      .right-icon-div {
        width: 75px;
        right: 1px;
        cursor: pointer;
        height: 40px;
        line-height: 40px;
        text-align: center;
        float: right;

        &.boxStore {
          background: url(../../assets/manageApp/navSave.png) 5px 0 no-repeat;
          margin-right: -22px;
        }

        &.boxClose {
          background: url(../../assets/manageApp/navClose.png) 0 0 no-repeat;
        }
      }
    }

    .content {
      position: absolute;
      // left: 50%;
      color: white;
      // transform: translate(-50%, -50%);
      overflow-y: auto;
      overflow-x: hidden;
      background: rgb(8, 25, 40);
      box-sizing: border-box;
      border: 1px solid rgb(21, 193, 227);
      // top: calc(50% + 25px);

      .nav-content {
        margin: 30px 0 0px 45px;
        width: calc(100% - 45px);
        top: 0;
        position: absolute;
        display: inline-block;
        padding-bottom: 0;
        height: calc(100% - 50px);
        box-sizing: border-box;
        >div{
          padding-right: 45px;
        }
      }

      .nav-footer{
        width: 100%;
        height: 62px;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px #0b2438 solid;

        .footer-bnt{
          text-align: center;
          width: 60px;
          height: 30px;
          line-height: 31px;
          border-radius: 3px;
          font-size: 14px;
          cursor: pointer;
          float: right;
          margin-top: 15px;
          border: #12c2e9 1px solid;
          color: #12c2e9;
        }
        .save-bnt{
          background:  #0ea4c3;
          color: #fff;
          &.confirm{
            margin-right: 32px;
          }
          &:hover{
            background: #0fb9db;
          }
        }
        .cancel-bnt{
          margin-left: 20px;
          margin-right: 32px;
          line-height: 29px;
          &:hover{
            border: #14d8ff 1px solid;
            color: #14d8ff;
          }
        }
      }
    }
  }

  input::-webkit-input-placeholder{
    color: #777;
  }
  input::-moz-placeholder{
    color: #777;
  }
  input:-ms-input-placeholder{
    color: #777;
  }
</style>
