<template>
  <g :class="{'service-node': canRouter }">
    <g class="node-bg-group">
      <path d="M18,0L263,0Q293,0 293,30L293,258L48,258Q18,258 18,228Z" filter="url(#bgShadownode)" :fill="getBgColor"
            stroke="rgba(0,0,0,.5)" class="node-bg"></path>
      <path d="M18,0L263,0Q293,0 293,30L293,258L48,258Q18,258 18,228Z" :fill="hasServer === false && type === 'group' ? 'url(#clientGradientnode)':'url(#serverGradientnode)'"
            stroke="transparent" class="node-black"></path>
      <path d="M0,14Q0,9 5,9L215,9L215,49L0,49Z" filter="url(#nameShadownode)" :fill="getBgColor" stroke="transparent"
            class="name-bg"></path>
      <path d="M0,14Q0,9 5,9L215,9L215,49L0,49Z" fill="url(#nameGradientnode)" stroke="transparent"
            class="name-black"></path>
    </g>
    <g class="service-node-network" v-show="isMonitor">
      <rect fill="#000000" fill-opacity="0.5" x="20" y="176" width="274" height="4"></rect>
      <rect fill="#71de6b" fill-opacity="1" x="20" y="176" :width="2.74 * data.network.percent" height="4"></rect>
    </g>
    <!-- <text fill="#eee" font-size="22" class="node-name" x="18" y="30" text-anchor="start"
          dominant-baseline="middle">
      {{ title.name }}
    </text> -->
    <foreignObject x="18" y="13" width="187" height="60">
      <div class="node-name" v-tooltip.ellipsis="{title: title.name, placement: 'top', trigger: ['blur']}">
        {{ title.name }}
      </div>
    </foreignObject>
    <image xmlns:xlink="http://www.w3.org/1999/xlink"
           xlink:href="../../assets/overview/ie.svg"
           class="open-ie-btn"
           x="175" y="14" width="30" height="30"
           v-show="false"
           @click="openIE()"
           />
    <image xmlns:xlink="http://www.w3.org/1999/xlink"
           :xlink:href="require(`../../assets/overview/${hasChild ? 'childTopo' : 'ipInfo'}.svg`)"
           class="node-expand-btn open-modal-btn" width="30"
           height="30" x="235" y="14"
           @click="handleClick()"
    />
    <g v-if="hasServer === false && type === 'group'" class="image-gauge" transform="translate(98,90)">
      <circle cx="60" cy="60" r="60" stroke="#3f6d8e" stroke-width="3" fill="#091620"></circle>
      <image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../assets/overview/clientWrapIcon.png"
            preserveAspectRatio="none meet" width="60" height="60" x="30" y="30" style="pointer-events: none;" />
    </g>
    <g v-if="(hasServer !== false && type === 'group') || type !== 'group'">
      <g transform="translate(54,74)">
        <g v-if="isMonitor" :class="{'health-g': true, 'alert-g': data.alert_count > 0}" v-show="isMonitor" @click="openAlert()">
          <LiquidGauge
            class="server-gauge"
            :waveColor="getGaugeColor"
            :percent="gaugePercent"
            :radius="46"
            :showGlass="true"
            :textSize="'12px'"
            :id="String(title.id)"
            :centerX="46"
          />
          <circle cx="46" cy="46" r="46" :stroke="getGaugeColor" stroke-width="3" fill="none"/>
          <text text-anchor="middle" font-size="16" x="46" y="37.2" class="gauge-name-text"
                fill="#fff">健康度
          </text>
          <text text-anchor="middle" font-size="27.599999999999998" x="46" y="67.2" class="gauge-percent-text"
                fill="#fff">
            {{ data.health }}%
          </text>
        </g>
        <g class="" v-else>
          <circle cx="46" cy="46" r="46" stroke="#424e57" stroke-width="3" fill="#1f262a"></circle>
          <text text-anchor="middle" x="46" y="53.2" class="gauge-name-text" fill="#9ba09e">未监控
          </text>
        </g>
      </g>
      <g class="alert-g" @click="openAlert()" v-if="data.alert_count > 0 && !hasChild">
        <circle cx="130" cy="80" r="10" fill="#F62E30"/>
        <text text-anchor="middle" font-size="16" x="130" y="86" fill="#fff">{{ data.alert_count }}</text>
      </g>
      <g class="top-text-group" transform="translate(196,84)">
        <g class="succ-rate quota-text" transform="translate(0,0)">
          <text class="name-text" x="5.203125" y="0" text-anchor="start"
                dominant-baseline="auto">成功率(%)
          </text>
          <text font-size="30" :class="{'data-text':true,'route-btn':tradeStatisticsDetail}" x="72" y="32" text-anchor="end" dominant-baseline="auto"
                :fill="data. success_per_alert ? 'rgb(241, 84, 84)' : '#cfcfcf'"
                @click="routeTo(data.intfId, 'success_per', data. success_per_alert)">{{ data. success_per }}
          </text>
        </g>
        <g class="rr-rate quota-text" transform="translate(0,52)">
          <text class="name-text" x="6.203125" y="0" text-anchor="start"
                dominant-baseline="auto">响应率(%)
          </text>
          <text font-size="30" :class="{'data-text':true,'route-btn':tradeStatisticsDetail}" x="72" y="32"
                text-anchor="end" dominant-baseline="auto"
                :fill="data.rr_rate_alert ? 'rgb(241, 84, 84)' : '#cfcfcf'"
                @click="routeTo(data.intfId, 'rr_rate', data.rr_rate_alert)">{{ data.rr_rate }}
          </text>
        </g>
      </g>
      <g class="bottom-text-group" transform="translate(54,200)">
        <g class="trans-count quota-text" transform="translate(0,10)">
          <text class="name-text" x="0" y="0" text-anchor="start"
                dominant-baseline="auto">交易量(笔)
          </text>
          <text :class="{'data-text':true,'route-btn':tradeStatisticsDetail}" x="211"
                y="0" text-anchor="end"
                dominant-baseline="middle"
                :fill="data.trans_count_alert ? 'rgb(241, 84, 84)' : '#cfcfcf'"
                @click="routeTo(data.intfId, 'trans_count', data.trans_count_alert)">{{ data.trans_count }}
          </text>
        </g>
        <g class="resp-time quota-text" transform="translate(0,40)">
          <text class="name-text" x="0" y="0" text-anchor="start"
                dominant-baseline="auto">响应时间(ms)
          </text>
          <text :class="{'data-text':true,'route-btn':tradeStatisticsDetail}" x="211" y="0"
                text-anchor="end" dominant-baseline="middle"
                :fill="data.response_time_alert ? 'rgb(241, 84, 84)' : '#cfcfcf'"
            @click="routeTo(data.intfId, 'duration', data.response_time_alert)">{{ data.response_time }}
          </text>
        </g>
      </g>
    </g>
  </g>
</template>
<script>
import { mapState } from 'vuex';
import { getHealthStatus, getCardColor } from '@/helpers/utils';
import LiquidGauge from '@/components/common/Gauge/LiquidGauge';
import tooltip from '@/directive/tooltip';

export default {
  name: 'ServerNode',
  components: {
    LiquidGauge,
  },
  directives: {
    tooltip,
  },
  props: {
    title: {
      type: Object,
      default() {
        return {
          id: '',
          name: '--',
        };
      },
    },
    hasChild: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Object,
      require: true,
    },
    hasServer: {
      type: Boolean,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
  },
  computed: {
    ...mapState([
      'appId',
      'newTs',
      'ts',
    ]),
    isMonitor() { return this.data.monitor; },
    canRouter() { return !this.hasChild && this.data.monitor; },
    currentTs() { return this.ts ? this.ts : this.newTs; },
    getExceptionCardColor() {
      const style = {
        basicColor: '#3f4c55',
        textColor: '#9ba09e',
      };
      return style;
    },
    getCardColor() { return this.isMonitor ? getCardColor(this.data.health) : this.getExceptionCardColor; },
    getBgColor() {
      if (this.hasServer === false) {
        return '#1e69a1';
      }
      return this.getCardColor.basicColor;
    },
    getGaugeColor() {
      return this.data.health_alert ? '#d95151' : getHealthStatus(this.data.health).color;
    },
    gaugePercent() {
      return Number((this.data.health / 100).toFixed(2));
    },
    showIe() {
      return Math.random() * 10 > 5;
    },
    isShowIe() {
      return this.isMonitor && this.showIe;
    },
    tradeStatisticsDetail() {
      return this.session$.newpermissions.trade_statistics_detail;
    },
  },
  methods: {
    routeTo(intfId, type, isAlert) {
      if (this.canRouter && this.session$.newpermissions.trade_statistics_detail) {
        let [href, params] = [null, {}];
        switch (type) {
          case 'duration': // 响应时间
            if (!isAlert) { // to 统计中心交易统计
              href = `/zh-cn/stat/${this.appId}/cap/${intfId}/#/BizChart`;
            } else { // 业务追踪查询超出阈值部分交易
              href = `/zh-cn/stat/${this.appId}/cap/${intfId}/#/BizTrack`;
              // params = { duration: ['200', ''] };
              params = { duration: this.data.threshold.duration };
            }
            break;
          case 'rr_rate': // 响应率 to 业务追踪查询未响应部分交易
            href = `/zh-cn/stat/${this.appId}/cap/${intfId}/#/BizTrack`;
            params = { resp_count: true };
            break;
          case 'success_per': // 成功率 to 业务追踪查询失败部分交易
            href = `/zh-cn/stat/${this.appId}/cap/${intfId}/#/BizTrack`;
            params = { succ_count: '失败' };
            break;
          default: // trans_count交易量 to 统计中心交易统计
            href = `/zh-cn/stat/${this.appId}/cap/${intfId}/#/BizChart`;
        }
        const routeTs = this.ts === null ? this.newTs : this.ts;
        Object.assign(params, {
          ts_start: routeTs,
          ts_end: routeTs + 60,
        });
        console.log(params, href);
        window.localStorage.setItem('params', JSON.stringify(params));
        window.location.href = href;
      }
    },
    handleClick() {
      // 打开容器|单台服务器详情
      this.$emit('open-modal', {
        type: this.hasChild ? 'group' : 'single',
        id: this.title.id,
      });
      if (!this.hasChild) {
        this.$store.commit('setIntf', { intfId: this.data.intfId, intfName: this.title.name, duration: this.data.response_time });
        this.$store.commit('setDialog', 'singleserver');
      } else {
        this.$store.commit('setDialog', 'childtopo');
      }
    },
    openIE() {
      // 打开客户端浏览器统计
    },
    openAlert() {
      // 告警状态可打开告警列表
      this.$emit('open-alert');
      if (this.data.alert_count > 0 && !this.hasChild) {
        this.$store.commit('setIntf', { intfId: this.data.intfId, intfName: this.title.name });
        this.$store.commit('setDialog', 'alertlist');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.name-text{
  font-size: 14px;
  fill: #cfcfcf;
}
.data-text{
  font-size: 22px;
}
.gauge-percent-text {
    font-size: 22px;
}
.open-modal-btn, .open-ie-btn, .alert-g{
  cursor: pointer;
}
.service-node{
  .route-btn{
    cursor: pointer;
  }
}
</style>
