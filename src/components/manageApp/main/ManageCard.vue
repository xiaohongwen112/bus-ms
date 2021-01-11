<template>
  <div class="app-card">
    <div class="app-content">
      <div class="app-manage" v-if="!rename">
        <span class="show-app-name" @mouseover="checkName" 
          @mouseout="showNameFlag = false">{{data.app_disp_name}}</span>
        <span class="show-app-depict" @mouseover="checkName" 
          @mouseout="showNameFlag = false">{{data.desc}}</span>
        <Operate :dataList="cardMenu" class="app-change" :appName="data.app_name" @onClick="cardOperate" :dealPathFlag="dealPathFlag"></Operate>
      </div>
      <div class="app-manage app-rename" v-if="rename">
        <input type="text" class="name" v-model="name.name" ref="validate">
        <input type="text" class="detail" v-model="name.detail" ref="detail">
        <div>
          <span class="button-icon" @click="sureRename">√</span>
          <span class="button-icon" @click="cancelRename">×</span>
        </div>
      </div>
      <div class="app-jump">
        <img src="../../../assets/manageApp/overview.svg" alt="可视化服务图" title="可视化服务图" @click="goTo('1', data.app_name)" v-if="VisitTopovDe && data.status === 'apply'">
        <img src="../../../assets/manageApp/gray_overview.svg" alt="可视化服务图" title="可视化服务图" v-else>
        <img src="../../../assets/manageApp/alert.svg" 
          alt="告警" 
          title="告警" 
          @click="goTo('2', data.app_name)"
          v-if="VisitAlert && data.alert_count === 0 && data.status === 'apply'">
        <img src="../../../assets/manageApp/has_alert.svg" 
          alt="告警" 
          title="告警"
          @click="goTo('2', data.app_name)"
          v-else-if="VisitAlert &&data.alert_count > 0 && data.status === 'apply'">
        <img src="../../../assets/manageApp/gray_alert.svg" alt="告警" title="告警" v-else>
        <div> 
          <img src="../../../assets/manageApp/stat.svg" 
            alt="统计中心" 
            title="统计中心"  
            v-if="VisitTrade && data.status === 'apply'"
            @click="showIntfBox"
            ref="statiscImg"
            >
          <img v-else src="../../../assets/manageApp/gray_stat.svg" alt="统计中心" title="统计中心">
             <ScrollBar class="chooseLi">
              <ul class="totaL-center-choose" v-show="isShow">
                <li v-for="(oneChoose, index) in data.intf_list"
                  :class="{'hoverBg':index==hoverIndex}"
                  @mouseover="hoverIndex = index"
                  @mouseout="hoverIndex = -1"
                  @click="goTo('3', oneChoose.intf_name)" 
                  :key="index">{{oneChoose.intf_dispname}}</li>
              </ul>
            </ScrollBar>
         
        </div>
      </div>
      <div class="app-health">
        <div class="svg-div">
          <HealthGauge :value="health(data)"/>
        </div>
      </div>
    </div>
    <div class="app-bottom-div" v-if="!showTime">
      <div class="app-stat-small">
        <p class="app-stat-data">{{filterNum(data.rr_rate)}}</p>
        <p class="app-stat-name">响应率(%)</p>
      </div>
      <div class="app-stat-small">
        <p class="app-stat-data">{{filterNum(data.succ_rate)}}</p>
        <p class="app-stat-name">成功率(%)</p>
      </div>
      <div class="app-stat-small">
        <p class="app-stat-data">{{filterNum(data.trans_count)}}</p>
        <p class="app-stat-name">交易量(笔)</p>
      </div>
      <div class="app-stat-small">
        <p class="app-stat-data">{{filterNum(data.duration)}}</p>
        <p class="app-stat-name">响应时间(ms)</p>
      </div>
    </div>
    <div v-if="showTime">
      <TimeAxis 
      :data="timeAxisData" 
      @changeHour = "changeHour"
      @goOverView = "goOverView"></TimeAxis>
    </div>
    <Cmtip :tipContent="updateMessage" v-if="showTips" :closeFn="() => showTips = false"
      :showFooter = showFooter
      @on-confirm = "sureDelete">
    </Cmtip>
    <ShowNameBox 
      :showTips = "showNameFlag"
      :showName = "showTipsName"
      :lefts = "tipsLeft"
      :top = "tipsTop"
    ></ShowNameBox>
    <DealPath :showPathBox = "showFlag" @closeBox="closePathBox" :appName="data.app_name" v-if="showFlag"></DealPath>
    <BusinessSchedule v-if="showBusinessFlag" @closeBusinessBox="closeBusinessBox" :appName="data.app_name"></BusinessSchedule>  
  </div>
</template>
<script>
import { setLocalStorage } from '@/helpers/utils';
import Operate from '@/components/manageApp/main/OperateButton';
import TimeAxis from '@/components/manageApp/main/TimeAxis';
import DealPath from '@/components/manageApp/main/DealPath';
import BusinessSchedule from '@/components/manageApp/main/BusinessSchedule';
import HealthGauge from '@/components/common/Gauge/HealthGauge';
import ShowNameBox from '@/components/manageApp/main/ShowNameBox';
import moment from 'moment';
import { validateName, checkError } from '@/helpers/configValidate';
import ScrollBar from '@/components/common/ScrollBar';
import * as api from '../../../pages/manageApp/service';
import Cmtip from '../../../components/common/CmTip';

// import { checkError } from '@/helpers/configValidate';

export default {
  components: {
    ShowNameBox,
    Operate,
    Cmtip,
    HealthGauge,
    ScrollBar,
    TimeAxis,
    DealPath,
    BusinessSchedule },
  props: ['data', 'showTime', 'close'],
  mounted() {
    this.VisitTopovDe = this.session$.newpermissions.topov_detail;
    this.VisitAlert = this.session$.newpermissions.alert_detail;
    this.VisitTrade = this.session$.newpermissions.trade_statistics_detail;
    this.name.name = this.data.app_disp_name;
    this.name.detail = this.data.desc;
    window.addEventListener('click', this.hideUL);
    if (this.data.status !== 'apply') {
      this.dealPathFlag = false;
    } else {
      const nowDate = moment().format('X');
      this.getTimeAxis(nowDate);
    }
  },
  watch: {
    showTime(newVal) {
      if (newVal) {
        if (this.data.status === 'apply') {
          // 将当前时间转为时间戳
          const nowDate = moment().format('X');
          this.getTimeAxis(nowDate);
        }
      }
    },
  },
  data() {
    return {
      VisitTopovDe: true,
      VisitAlert: true,
      VisitTrade: true,
      showBusinessFlag: false, // 业务日程
      showNameFlag: false, // 提示框
      showTipsName: 'tishi111',
      tipsLeft: 10,
      tipsTop: 0,
      updateMessage: '',
      showTips: false,
      showFooter: false,
      timeAxisData: {},
      dealPathFlag: true,
      cardMenu: [{
        icon: 'icon-bms-rename',
        title: '重命名',
        color: '#1dcee2',
        styleClass: 'cardMenu',
        flag: true,
      }, {
        icon: 'icon-bms-topoedit',
        title: '可视化服务图设计',
        color: '#1dcee2',
        styleClass: 'cardMenu',
        flag: true,
      }, {
        icon: 'icon-bms-path',
        title: '交易路径',
        color: '#1dcee2',
        styleClass: 'cardMenu',
        flag: false,
      }, {
        icon: 'icon-bms-delete',
        title: '删除',
        color: '#1dcee2',
        styleClass: 'cardMenu',
        flag: true,
      }],
      rename: false,
      name: {
        name: '',
        detail: '',
      },
      showFlag: false, // 显示交易路径框
      hoverIndex: -1,
      clickIndex: -1,
      isShow: false,
    };
  },
  methods: {
    health(data) {
      const val = data.monitor_status ? data.health : -1;
      if (val === 'null') {
        return '0';
      }
      return val.toString();
    },
    goTo(num, name) {
      if (num === '1') {
        location.href = `/zh-cn/overview/${name}/`;
      } else if (num === '2') {
        location.href = `/zh-cn/alert/?topov=${name}`;
      } else if (num === '3') {
        location.href = `/zh-cn/stat/${this.data.app_name}/cap/${name}/`;
      } else if (num === '4') {
        location.href = `/zh-cn/dashboard/${this.data.app_name}/siteview/get_siteview/`;
      }
    },
    filterNum(val) {
      const reg = /.*\..*/;
      return val === 'null' ? '--' : reg.test(val) ? val.toFixed(2) : val; // eslint-disable-line
    },
    cardOperate(val) {
      if (val === 0) {
        this.rename = true;
      } else if (val === 1) {
        location.href = `/zh-cn/edit/datapath/${this.data.app_name}/`;
      } else if (val === 2) {
        this.showFlag = true;
      } else if (val === 3) {
        this.showTips = true;
        this.updateMessage = `是否删除${this.data.app_disp_name}?`;
        this.showFooter = true;
      }
    },
    checkName(e) {
      const ele = e.target;
      if (ele.clientWidth !== ele.scrollWidth) {
        this.tipsLeft = ele.getBoundingClientRect().left;
        this.tipsTop = ele.getBoundingClientRect().top - 145;
        this.showNameFlag = true;
        this.showTipsName = e.target.innerText;
      } else {
        // this.showNameFlag = false;
      }
    },
    sureRename() {
      let flag = true;
      const resValidate = validateName(this.name.name, false);
      checkError(resValidate, this.$refs.validate);
      const resDescribe = validateName(this.name.detail, false);
      checkError(resDescribe, this.$refs.detail);
      if (!resValidate.bool) {
        flag = false;
      }
      if (!resDescribe.bool) {
        flag = false;
      }
      if (flag) {
        const obj = {
          desc: this.name.detail,
          disp_name: this.name.name,
          icon: 1,
        };
        this.renamePath(this.data.app_name, obj);
      }
    },
    async renamePath(name, obj) {
      try {
        const res = await api.rename(name, obj);
        if (res.data.code === 0) {
          this.showFooter = false;
          this.showTips = true;
          this.rename = false;
          this.data.app_disp_name = this.name.name;
          this.data.desc = this.name.detail;
          this.updateMessage = `${this.data.app_disp_name} 业务修改成功`;
        }
      } catch (e) {
        console.log(e);
      }
    },
    cancelRename() {
      this.rename = false;
      this.name = {
        name: this.data.app_disp_name,
        detail: this.data.desc,
      };
    },
    sureDelete() {
      this.showFooter = false;
      this.updateMessage = `正在删除${this.data.app_disp_name}......`;
      this.deleteCard();
    },
    async deleteCard() {
      try {
        const res = await api.deleteCard(this.data.app_name);
        if (res.data.code === 0) {
          this.$emit('reLoadCard');
          this.showTips = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getTimeAxis(date) {
      try {
        const res = await api.getTimeAxis(this.data.app_name, date);
        this.timeAxisData = res.data.data;
      } catch (e) {
        console.log(e);
      }
    },
    changeHour(date) {
      this.getTimeAxis(date);
    },
    goOverView(date) {
      // 当没有查看可视化服务图权限时跳转
      const overViewPower = this.session$.newpermissions.topov_detail;
      if (!overViewPower) return;
      const params = {
        ts_start: date,
      };
      setLocalStorage('params', JSON.stringify(params));
      location.href = `/zh-cn/overview/${this.data.app_name}/`;
    },
    showIntfBox() {
      if (this.data.status === 'apply') {
        this.isShow = !this.isShow;
      }
    },
    hideUL(event) {
      if (this.$refs.statiscImg !== undefined && !this.$refs.statiscImg.contains(event.target)) {
        this.isShow = false;
      }
    },
    closePathBox() {
      this.showFlag = false;
    },
    closeBusinessBox() {
      this.showBusinessFlag = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-card {
    width: 646px;
    height: 187px;
    box-shadow: 1px 1px 15px #020B12;
    border: 1px solid #1b5d8d;
    border-radius: 3px;
    display: inline-block;
    margin: 20px 11px;
}

.app-content {
    width: 100%;
    height: 125px;
    display: table;
    background: #0b273c;
    border-radius: 3px 3px 0 0;
    color: #19C1EE;
    position: relative;
}
.edit-app-name {
    color: #19C1EE;
    font-size: 20px;
}
.show-app-name {
    font-size: 30px;
    color:#1dcee2;
}
.show-app-depict {
    font-size: 15px;
    line-height: 35px;
    color:#6294b9;
}
.show-app-name, .show-app-depict {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
}
.app-manage {
    float: left;
    height: 100%;
    padding: 10px 0 0 37px;
    &.app-rename {
      width: 237px;
    }
    >input {
      display: block;
      background-color: transparent;
      border: 1px solid #1e6ba3;
      height: 30px;
      margin-bottom: 10px;
      width: 80%;
      margin-right: 0;
      &:nth-child(1) {
        font-size: 20px;
        color:#19C1EE;
      }
      &:nth-child(2) {
        font-size: 16px;
        color:#2243B3;
      }
    }
   .button-icon {
      display: inline-block;
      width: 18px;
      height: 18px;
      font-size: 18px;
      text-align: center;
      line-height: 14px;
      border-radius: 50%;
      color:#fff;
      border: 1px solid #fff;
      margin-right: 10px;
      cursor: pointer;
    }
} 
.app-change {
    position: absolute;
    bottom: 0;
    left: 36px;
    margin-bottom: 10px;
}
.app-jump {
    float: left;
    width: 278px;
    height: 100%;
    vertical-align: middle;
    text-align: left;
    padding: 30px 0 0 25px;
    >img, >div {
        width:46px;
        height: 46px;
        margin: 3px 6px;
        display: inline-block;
        cursor: pointer;
    }
    >div {
      position: relative;
      .chooseLi{
        position: absolute;
        left: 36px;
        top: 20px;
        height: 150px;
        overflow-y: auto;
        >li {
          white-space: nowrap;
          // width: 75px;
          text-align: left;
        }
      }
    }
}
.app-health {
    border-radius: 0 3px 0 0;
    width: 90px;
    float: right;
    height: 100%;
    text-align: center;
    margin:15px 31px 0 0;
}
.app-bottom-div {
    height: 60px;
    border-radius: 0 0 3px 3px;
}

.app-stat-small {
    width: 25%;
    height: 100%;
    // display: inline-block;
    float: left;
    text-align: center;
    &:nth-child(odd) {
    background: #10334F;
}
&:nth-child(even) {
    background: #143956;
}
}

.app-stat-data {
    /* margin-top: 5px; */
    height: 25px;
    line-height: 45px;
    color: #19C1EE;
    font-size: 24px;
}
.app-stat-name {
    height: 25px;
    line-height: 25px;
    color: #92B0B9;
    font-size: 12px;
}
.totaL-center-choose{
    line-height: 28px;
    background: #19354a;
    >li {
      padding: 1px 5px;
      white-space: nowrap;
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      &:not(:last-child) {
      border-bottom: 1px solid #10202d;
      }
    }
  }
  .hoverBg{
    background: #20699e;
  }
</style>
