<template>
  <div class="user-right-div" id="bmsStatusRight">
    <div class="user-right-div-dis" v-if="!session$.newpermissions.alert_conf_edit"></div>
    <div class="show-content-div">
      <div class="alert-box-top">
        <div class="warning-config-container">
          <div class="oneItem">
            <p class="item-title-level1">CPU利用率</p>
            <span class="line"></span>
            <div class="item-title-level2">
              <div class="content">
                <span>高于</span>
                <input class="input-box" type="text" v-model="storeParams.cpu" ref="percent" @change="changeCpu">%
              </div>
            </div>
          </div>
          <div class="oneItem">
            <p class="item-title-level1">内存容量</p>
            <span class="line"></span>
            <div class="item-title-level2">
              <div class="content">
                <span>低于</span>
                <input class="input-box" type="text" v-model="storeParams.memory" ref="lowStore" @change="changeStore">G
              </div>
            </div>
          </div>
          <div class="oneItem">
            <p class="item-title-level1">关键进程异常报告</p>
            <span class="line"></span>
            <div class="item-check">
              <div class="content">
                <input class="checkbox-btn" type="checkbox" v-model="storeParams.sp_dp" id="sp_dp" @change="isStore=false">
                <label for="sp_dp"><span>解码器异常</span></label>
                <input class="checkbox-btn" type="checkbox" v-model="storeParams.sp_eth" id="sp_eth" @change="isStore=false">
                <label for="sp_eth"><span>采集器异常</span></label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="alert-box-bottom">
        <p class="item-title-level1">存储</p>
        <span class="line"></span>
        <div class="warning-config-container">
          <div class="oneItem lastItem" :class="{'resize-style': resizeFlag}">
            <div class="store-space">
              <span class="item-title-level2">总存储空间：</span>
              <span>{{storeAll}}</span>G
            </div>
          </div>
          <div class="oneItem lastItem" :class="{'resize-style': resizeFlag}">
            <span class="item-title-level2">业务流数据高于</span>
            <input type="text" v-model="storeParams.pack" ref="pack"
                  @change="changeBusinessFlow">G
          </div>
          <div class="oneItem lastItem" :class="{'resize-style': resizeFlag}">
            <span class="item-title-level2">可用空间低于</span>
            <input type="text" v-model="storeParams.free_disk_space"
                  ref="useHome" @change="changeAbleSpace">G
          </div>
        </div>
        <div class="warning-config-barInfo">
          <div class="warning-config-barOut">
            <div class="warning-config-barInner" ref="showBar" :style="barWidth"></div>
          </div>
          <span class="warning-config-left">解码报文：{{outerPack}}</span>
          <span class="warning-config-right">{{storeAll}}G</span>
        </div>
      </div>
      <BmsBtn class="operate-button" :disabled="isStore" @click="operateOk">保存</BmsBtn>
    </div>
    <Cmtip :tipContent="updateMessage" v-if="showTips" :closeFn="() => showTips = false">
    </Cmtip>
  </div>
</template>
<script>
import { BmsBtn } from '@/components/basic';
import { checkError } from '@/helpers/configValidate';
import Cmtip from '../../../components/common/CmTip';
import * as api from '../service';


export default {
  components: { Cmtip, BmsBtn },
  computed: {
    storeAll() { // 总存储空间
      if (this.storeParams.all) {
        return Number((this.storeParams.all / (1024 * 1024 * 1024)).toFixed(2));
      }
      return 0;
    },
    outerPack() { // 解码报文
      if (this.storeParams.all) {
        return window.canvasUnit(this.storeParams.smallPack);
      }
      return 0;
    },
    barWidth() {
      let wi = (this.storeParams.smallPack / this.storeParams.all) * 100;
      if (wi > 0 && wi < 1) {
        wi = 1;
      } else {
        wi = parseInt(wi, 10);
      }
      return { width: `${wi}%` };
    },
  },
  created() {
    this.init();
  },
  data() {
    return {
      isStore: true,
      showTips: false,
      updateMessage: '',
      storeParams: {
        cpu: '',
      },
      isChange: true,
      resizeFlag: false,
    };
  },
  methods: {
    async init() {
      try {
        const res = await api.alertSettingData();
        const data = res.data.data;
        this.storeParams = {
          ...data.configdata,
          smallPack: data.pack,
          all: data.all,
          pack: (data.configdata.pack / (1024 * 1024 * 1024)).toFixed(2),
          memory: (data.configdata.memory / 1024).toFixed(2),
        };
        this.storeParams.sp_dp = this.storeParams.sp_dp === 'true';
        this.storeParams.sp_eth = this.storeParams.sp_eth === 'true';
      } catch (error) {
        console.log(error);
      }
    },
    changeCpu() {
      this.isStore = false;
      this.checkInput('percent', this.storeParams.cpu);
    },
    changeStore() {
      this.isStore = false;
      this.checkInput('num', this.storeParams.memory, 'lowStore');
    },
    changeBusinessFlow() {
      this.isStore = false;
      this.checkInput('num', this.storeParams.pack, 'pack');
    },
    changeAbleSpace() {
      this.isStore = false;
      this.checkInput('num', this.storeParams.free_disk_space, 'useHome');
    },
    operateOk() {
      this.isChange = true;
      if (this.isStore) {
        return;
      }
      this.checkInput('percent', this.storeParams.cpu);
      this.checkInput('num', this.storeParams.memory, 'lowStore');
      this.checkInput('num', this.storeParams.pack, 'pack');
      this.checkInput('num', this.storeParams.free_disk_space, 'useHome');
      if (this.isChange) {
        const objData = {
          cpu: this.storeParams.cpu,
          free_disk_space: this.storeParams.free_disk_space,
          memory: this.storeParams.memory * 1024,
          pack: this.storeParams.pack * 1024 * 1024 * 1024,
          sp_dp: this.storeParams.sp_dp,
          sp_eth: this.storeParams.sp_eth,
        };
        this.alterInfo(objData);
      }
    },
    async alterInfo(obj) {
      try {
        await api.alertSettingStore(obj);
      } catch (error) {
        console.log(error);
      }
    },
    checkInput(type, val, which) {
      if (type === 'percent') {
        const check = /^([1-9][0-9]?(\.\d{1,2})?|[0](\.[1-9])|[0](\.[1-9][0-9])|[0](\.[0][1-9])|100(\.[0]{0,2})?)$/;
        if (!check.test(val)) {
          this.isChange = false;
        }
        checkError({ bool: check.test(val), tip: '大于0小于等于100的数，小数保留两位' }, this.$refs.percent);
      } else {
        const checkNum = /^(([1-9][0-9]{0,12}(\.\d{1,2})?)|[0](\.[1-9])|([0](\.[1-9][0-9]))|([0](\.[0][1-9])))$/;// 验证小于13位的数，并且小数保留两位
        checkError({ bool: checkNum.test(val), tip: '小于13位的正数，小数保留两位' }, this.$refs[which]);
        if (!checkNum.test(val)) {
          this.isChange = false;
          checkError({ bool: false, tip: '小于13位的正数，小数保留两位' }, this.$refs[which]);
        } else {
          if (which === 'pack') {
            if (this.storeAll < this.storeParams.pack) {
              this.isChange = false;
              checkError({ bool: false, tip: '大小不能超过总大小' }, this.$refs.pack);
            }
          }
          if (which === 'useHome') {
            if (this.storeAll < this.storeParams.free_disk_space) {
              this.isChange = false;
              checkError({ bool: false, tip: '大小不能超过总大小' }, this.$refs.useHome);
            }
          }
        }
      }
    },
    resize() {
      const width = document.getElementsByTagName('body')[0].clientWidth;
      const height = document.getElementsByTagName('body')[0].clientHeight;
      width >= height * 2 ? this.resizeFlag = true : this.resizeFlag = false; // eslint-disable-line
    },
  },
  mounted() {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
    });
  },
};
</script>
<style lang="scss">
  html{
    height: 100%;
  }
</style>
<style lang="scss" scoped>
@media screen and (max-width: 1024px), (max-height: 600px){
  .user-right-div {
    display: flex;
  }
}

@media screen and (max-width: 1000px), (max-height: 900px){
  .warning-config-container{
     >.oneItem{
       .lastItem{
          height: 60px;
          margin-top: 7%;
       }
     }
  }
}
.store-space {
  padding-top: 10px;
  .item-title-level2{
    width: 100px;
    text-align: right;
  }
}
#bmsStatusRight input {
  background-color: transparent;
  border: 1px solid #4ab2a5;
  color: #F9FDFF;
  width: calc(70% - 150px);
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  text-align: right;
  padding: 0 5px;
  border-radius: 3px;
  margin: 0 10px 0 5px;
  &:focus{
    outline: none;
  }
  &.input-box{
    min-width: 100px;
  }
}
.user-right-div {
  width:100%;
  height: 100%;
  .user-right-div-dis {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 9;
  }
}
.show-content-div {
  position: relative;
  width: calc(100% - 30px);
  height: 100%;
  margin: 0 auto;
  text-align: right;
}
.alert-box-top{
  height: 35%;
  margin-bottom: 20px;
  .warning-config-container{
    height: 100%;
    >.oneItem{
      border: 1px solid #255c5a;
      .item-title-level1 {
        height: 40px;
        line-height: 40px;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
        color: #d8dde0;
        padding-left: 15px;
        margin: 0;
      }
      .line{
        display: inline-block;
        width: calc(100% - 207px);
        border-bottom: 2px solid #143a54;
        position: absolute;
        right: 0;
        top: 38px;
      }
      .item-check{
        .content{
          color: #888;
        }
      }
    }
  }
}
.alert-box-bottom{
  height: 45%;
  border: 1px solid #255c5a;
  margin-bottom: 1.5%;
  position: relative;
  background-color: #0a2030;
  .line{
    position: absolute;
    display: inline-block;
    width: calc(100% - 208px);
    top: 38px;
    left: 208px;
    border-bottom: 2px solid #143a54;
  }
  .item-title-level1{
    padding-left: 15px;
  }
  .oneItem{
    font-size: 12px;
    color:#ddd;
    margin-top: 5%;
    &.resize-style{
      margin-top: 3% !important;
    }
    &:first-child{
      margin-right: 0;
    }
    >div{
      >span{
        display:inline-block;
      }
    }
    >span{
      display:inline-block;
      width: 112px;
      height: auto;
    }
    input{
      min-width: 100px;
    }
  }
}
.warning-config-container {
  text-align: left;
  display: flex;
  >.oneItem {
    flex: 1;
    font-size: 14px;
    height: 100%;
    margin-right: 1%;
    position: relative;
    &.lastItem {
      height: 80px;
    }
    &:last-child{
      margin-right: 0;
    }
    input {
      width: 60px;
      height: 30px;
      text-align: right;
      margin-right: 5px;
    }
  }
}
.item-title-level1 {
  width: 210px;
  height: 40px;
  line-height: 40px;
  text-align: left;
  font-weight: 600;
  font-size: 18px;
  color: #d8dde0;
  margin: 0;
  background: url(../../../assets/settings/titleBg.svg) no-repeat -8px -11px;
  background-size: 107% 158%;
}
.item-title-level2 {
  font-size: 14px;
  font-weight: normal;
  color: #ddd;
  text-align: center;
  >input {
    height: 30px;
    text-align: right;
    margin-right: 0 5px;
  }
}
.item-check, .item-title-level2{
  display: table;
  width: 100%;
  height: calc(100% - 40px);
  .content{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }
}
.warning-config-barInfo {
  width: calc(100% - 30px);
  margin: 0 15px 10px 15px;
}
.warning-config-barOut {
  width: 100%;
  height: 25px;
  background-color: rgba(47, 75, 84, .5);
  position: relative;
  margin-bottom: 10px;
}
.warning-config-barInner {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 1%;
  background:-webkit-linear-gradient(top, #7BCBDE, #4D9DB0);
}
.warning-config-left {
  float: left;
  color:#888;
}
.warning-config-right{
  color: #888;
}
label{
  font-weight: normal;
}
// 复选框按钮
#bmsStatusRight .checkbox-btn{
  height: 14px;
  vertical-align: middle;
  width: 14px !important;
  border: 1px solid #278c89 !important;
  margin: 0 4px;
  background: rgb(10,31,48);
  -webkit-appearance: none;
  &:focus{
    outline: none;
  }
  &#sp_eth{
    margin-left: 10%;
  }
  &:checked {
    background: #2c9d97 url(../../../assets/common/checked.svg) -6px center;
    background-size: 200% 200%;
    &+label{
      color: #ddd;
    }
  }
}
.content{
  font-size: 14px;
}
</style>

