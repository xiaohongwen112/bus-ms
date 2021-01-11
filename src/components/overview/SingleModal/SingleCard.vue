<template>
  <div class="device-card">
    <div class="device-name text" v-tooltip.ellipsis="{title: data.device_name, placement: 'top', trigger: ['blur']}">
      {{ data.device_name }}
    </div>
    <div class="top-info" v-show="!showSource">
      <div class="succ-rate">
        <span class="text-left">成功率: </span>
        <span class="text-right" :class="{'alert-text': data.succ_rate_alert}">{{ data.succ_rate }}%</span>
        <ProgressBar
          :width="214"
          :id="`succRate${sequence}`"
          :percent="data.succ_rate / 100"
          :startColor="'#39ca76'"
          :stopColor="'#55ede7'"
          :colorBg="'#424242'"
        />
      </div>
      <div class="resp_rate">
        <span class="text-left">响应率: </span>
        <span class="text-right" :class="{'alert-text': data.resp_rate_alert}">{{ data.resp_rate }}%</span>
        <ProgressBar
          :width="214"
          :id="`respRate${sequence}`"
          :percent="data.resp_rate / 100"
          :startColor="'#42A7DB'"
          :stopColor="'#3884BF'"
          :colorBg="'#424242'"
        />
      </div>
      <div class="trans-count">
        <span class="text-left">交易量: </span>
        <span class="text-right" :class="{'alert-text': data.trans_count_alert}">{{ (data.trans_count) }}笔</span>
      </div>
      <div class="resp-time">
        <span class="text-left">响应时间: </span>
        <span class="text-right" :class="{'alert-text': data.duration_alert}">{{ data.duration }}ms</span>
      </div>
    </div>
    <div class="source-ip-list" v-show="showSource">
      <table>
        <thead>
        <tr>
          <th>源 IP</th>
          <th>设备名称</th>
        </tr>
        </thead>
      </table>
      <ScrollBar class="iplist-scroll-area">
        <table>
          <tbody>
            <tr v-for="(item, index) in data.src_ip" :key="index">
              <td><span class="td-text" @mouseover="checkName" @mouseout="showNameFlag = false">{{ item.ip }}</span></td>
              <td><span class="td-text" @mouseover="checkName" @mouseout="showNameFlag = false">{{ item.name }}</span></td>
            </tr>
          </tbody>
        </table>
      </ScrollBar>
    </div>
    <div class="bottom-info">
      <p class="deviceModule text" v-tooltip.ellipsis="{title: data.device_model, placement: 'top', trigger: ['blur']}">设备型号: {{ data.device_model }}</p>
      <p class="deviceType text" v-tooltip.ellipsis="{title: data.device_type, placement: 'top', trigger: ['blur']}">设备类型: {{ data.device_type }}</p>
      <p class="deviceDestPorts text" v-tooltip.ellipsis="{title: data.dst_ports, placement: 'top', trigger: ['blur']}">目标端口: {{ data.dst_ports }}</p>
      <p class="deviceDestIp text" v-tooltip.ellipsis="{title: data.dst_ip, placement: 'top', trigger: ['blur']}">目标IP: {{ data.dst_ip }}</p>
      <p class="deviceSrcPorts text" v-tooltip.ellipsis="{title: data.src_ports, placement: 'top', trigger: ['blur']}">源端口: {{ data.src_ports}}</p>
    </div>
    <div class="source-btn" :style="{'background-color': showSource ? '#0A1824' : '#566D8D'}" @click="toggleSource">
      <span>源IP:</span>
      <img src="../../../assets/overview/sourceIp.svg" alt="查看源ips">
    </div>
    <ShowNameBox 
      :showTips = "showNameFlag"
      :showName = "showTipsName"
      :lefts = "tipsLeft"
      :top = "tipsTop"
    ></ShowNameBox>
  </div>
</template>
<script>
import { formatNum } from '@/helpers/utils';

import ProgressBar from '@/components/common/ProgressBar';
import ScrollBar from '@/components/common/ScrollBar';
import ShowNameBox from '@/components/manageApp/main/ShowNameBox';
import tooltip from '@/directive/tooltip';

export default {
  name: 'SingleCard',
  components: {
    ProgressBar,
    ScrollBar,
    ShowNameBox,
  },
  directives: {
    tooltip,
  },
  props: {
    sequence: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      required: true,
      // default() {
      //   return {
      //     device_model: '',
      //     device_type: '',
      //     dst_ports: '',
      //     dst_ip: '',
      //     src_ports: '',
      //     device_name: '',
      //     succ_rate: {
      //       value: 0,
      //       alert: false,
      //     },
      //     resp_rate: {
      //       value: 0,
      //       alert: false,
      //     },
      //     resp_time: {
      //       value: 0,
      //       alert: false,
      //     },
      //     trans_count: {
      //       value: 0,
      //       alert: false,
      //     },
      //     src_ip_device: [],
      //   };
      // },
    },
  },
  data() {
    return {
      showSource: false,
      tipsLeft: 10,
      tipsTop: 0,
      showNameFlag: false, // 提示框
      showTipsName: '',
    };
  },
  computed: {
    succSector() {
      const succText = Number(this.data.succ_rate).toFixed(2);
      return succText === 0 ? [[28, 40, 100, '#005C5E'], [29, 38, succText, '#00BCAA']] : [28, 40, 100, '#005C5E'];
    },
    rrSector() {
      return Number(this.data.resp_rate).toFixed(2) === 0 ? [[28, 40, 100, '#00567B'], [29, 38, 80, '#00BCAA']] : [28, 40, 100, '#00567B'];
    },
  },
  methods: {
    formatNum(val) {
      return formatNum(val);
    },
    toggleSource() {
      this.showSource = !this.showSource;
    },
    checkName(e) {
      const ele = e.target;
      // console.log(e.target.innerText, ele.clientWidth, ele.scrollWidth);
      if (ele.clientWidth !== ele.scrollWidth) {
        this.tipsLeft = ele.getBoundingClientRect().left - ele.getBoundingClientRect().width / 2;
        this.tipsTop = ele.getBoundingClientRect().top - 30;
        this.showNameFlag = true;
        this.showTipsName = e.target.innerText;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  * {
    margin: 0 auto;
    padding: 0;
  }

  .device-card {
    width: 250px;
    height: 305px;
    background: linear-gradient(to bottom left, #174286 , #395A8F);
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.6);
    color: #ddd;
    font-size: 14px;
    font-family: "SourceHanSansCN-Normal";
    
    .alert-text{
      color: #ec140c;
    }
    .device-name{
      // width: calc(100% - 16px);
      margin-left: 16px;
      width: 170px;
      height: 40px;
      line-height: 40px;
      border-bottom: solid 2px #5C8EA7;
      padding-left: 5px;
      font-size: 18px;
    }

    .source-btn{
      width: 65px;
      height: 35px;
      line-height: 35px;
      border-top-left-radius: 35px;
      border-bottom-left-radius: 35px;
      background-color: #566D8D;
      padding-left: 5px;
      position: relative;
      top: -271px;
      left: 94px;
      img {
        height: 25px;
        cursor: pointer;
        vertical-align: -10px;
      }
    }
    .top-info{
      width: calc(100% - 32px);
      height: 130px;
      margin-top: 15px;
      .succ-rate, .resp_rate{
        width: 100%;
        height: 35px;
      }
      .trans-count, .resp-time{
        margin-top: 5px;
        width: 100%;
        height: 24px;
        line-height: 24px;
        background-color: #12233F;
      }
      .text-left, .text-right{
        float: left;
        width: calc(50% - 5px);
      }
      .text-left{
        text-align: left;
        margin-left: 5px;
      }
      .text-right{
        text-align: right;
        margin-right: 5px;
      }
    }
    .source-ip-list{
      width: calc(100% - 32px);
      height: 130px;
      margin-top: 15px;
      background-color: #14253F;
      table{
        width: 100%;
        th, td{
          width: 109px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          
          font-weight: normal;
          color: #ddd;
          font-size: 14px;
          font-family: "SourceHanSansCN-Normal";
          .td-text{
            display: inline-block;
            width: 95px;
            height: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .bottom-info{
      width: calc(100% - 32px);
      height: 95px;
      margin-top: 10px;
      background-color: #071329;
      p{
        margin-left: 5px;
        line-height: 19px;
        font-size: 12px;
      }
    }
  }

  .iplist-scroll-area{
    width: 100%;
    height: 96px;
  }
</style>
