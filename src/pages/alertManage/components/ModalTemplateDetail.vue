<template>
  <config-box :tabs="tabs" :width='1150' :height='460' :scrollheight="390"
    @closeConfig="close" @saveConfig="close" :onlyConfirm="true">
    <div slot="detail" class="detail-slot">
      <div class="title1"><img src="../../../assets/common/tag.png"/>{{ data.name }}</div>
      <div class="title2"><img src="../../../assets/common/tag_circle.png"/>描述</div>
      <section>
        <div class="title3">{{ data.describe.length === 0 ? '暂无描述' : data.describe }}</div>
      </section>
      <div class="title2"><img src="../../../assets/common/tag_circle.png"/>健康度告警</div>
      <section>
        <div class="title3">健康度</div>
        <div>
          <p class="detail-item" v-if="curData.health.baseOn && !curData.health.on">
            <label>基线值</label>
            <span>自动基线</span>
          </p>
          <p class="detail-item" v-else>
            <label>健康度低于</label>
            <span>{{ curData.health.health_set }}%</span>
          </p>
          <p class="detail-item">
            <label>升级策略</label>
            <UpgradeStrategyDetail :data="curData.health.upgrade_strategy" />
          </p>
          <p class="detail-item">
            <label>延迟告警</label>
            <span>{{ curData.health.ts_hold }}分钟</span>
          </p>
        </div>
      </section>
      <div class="title2"><img src="../../../assets/common/tag.png"/>基线告警</div>
      <section>
        <div class="title3">交易量</div>
        <div>
          <p class="detail-item" v-if="curData.threshold.trans_count.baseOn && !curData.threshold.trans_count.on">
            <label>基线值</label>
            <span>自动基线</span>
          </p>
          <p class="detail-item" v-else>
            <label>交易量</label>
            <span>高于{{ curData.threshold.trans_count.up.value }}笔  或  低于{{ curData.threshold.trans_count.down.value }}笔</span>
          </p>
          <p class="detail-item">
            <label>升级策略</label>
            <UpgradeStrategyDetail :data="curData.threshold.trans_count.upgrade_strategy" />
          </p>
          <p class="detail-item">
            <label>延迟告警</label>
            <span>{{ curData.threshold.trans_count.up.time }}分钟</span>
          </p>
        </div>
        <div class="title3">成功率</div>
        <div>
          <p class="detail-item" v-if="curData.threshold.succ_rate.baseOn && !curData.threshold.succ_rate.on">
            <label>基线值</label>
            <span>自动基线</span>
          </p>
          <p class="detail-item" v-else>
            <label>成功率低于</label>
            <span>{{ curData.threshold.succ_rate.down.value }}%</span>
          </p>
          <p class="detail-item">
            <label>升级策略</label>
            <UpgradeStrategyDetail :data="curData.threshold.succ_rate.upgrade_strategy" />
          </p>
          <p class="detail-item">
            <label>延迟告警</label>
            <span>{{ curData.threshold.succ_rate.down.time }}分钟</span>
          </p>
        </div>
        <div class="title3">响应时间</div>
        <div>
          <p class="detail-item" v-if="curData.threshold.duration.baseOn && !curData.threshold.duration.on">
            <label>基线值</label>
            <span>自动基线</span>
          </p>
          <p class="detail-item" v-else>
            <label>响应时间高于</label>
            <span>{{ curData.threshold.duration.up.value }}ms</span>
          </p>
          <p class="detail-item">
            <label>升级策略</label>
            <UpgradeStrategyDetail :data="curData.threshold.duration.upgrade_strategy" />
          </p>
          <p class="detail-item">
            <label>延迟告警</label>
            <span>{{ curData.threshold.duration.up.time }}分钟</span>
          </p>
        </div>
        <div class="title3">响应率</div>
        <div>
          <p class="detail-item" v-if="curData.threshold.rr_rate.baseOn && !curData.threshold.rr_rate.on">
            <label>基线值</label>
            <span>自动基线</span>
          </p>
          <p class="detail-item" v-else>
            <label>响应率低于</label>
            <span>{{ curData.threshold.rr_rate.down.value }}%</span>
          </p>
          <p class="detail-item">
            <label>升级策略</label>
            <UpgradeStrategyDetail :data="curData.threshold.rr_rate.upgrade_strategy" />
          </p>
          <p class="detail-item">
            <label>延迟告警</label>
            <span>{{ curData.threshold.rr_rate.down.time }}分钟</span>
          </p>
        </div>
      </section>
      <div class="title2"><img src="../../../assets/common/tag.png"/>自定义指标告警</div>
      <section>
        <div class="title3">返回码</div>
        <div>
          <p class="detail-item">
            <label>返回值</label>
            <span>{{ curData.return_code.val }}</span>
          </p>
          <p class="detail-item">
            <label>默认告警级别</label>
            <span> 级别{{ curData.return_code.level }}: {{ levelNames[curData.return_code.level-1] }}</span>
          </p>
        </div>
      </section>
    </div>
  </config-box>
</template>

<script>
  // import _ from 'lodash';
  import { ConfigBox } from '@/components/basic';
  import UpgradeStrategyDetail from './UpgradeStrategyDetail';
  import { levelNames } from '../utils';

  export default {
    name: 'ModalTemplateDetail',
    components: { ConfigBox, UpgradeStrategyDetail },
    props: {
      data: {
        type: Object,
        default() {
          return {};
        },
        required: true,
      },
    },
    data() {
      return {
        tabs: [
          { id: 'detail', text: '详情' },
        ],
        levelNames,
      };
    },
    computed: {
      curData() { return this.data.alarmrules; },
    },
    methods: {
      initModal() {
      },
      close() {
        this.$emit('onClose');
      },
      // isAutoBaseline(a, b) { },
    },
    mounted() {
      this.initModal();
    },
  };
</script>

<style>
.detail-slot{
  padding-left: 175px !important;
  padding-right: 175px !important;
}
</style>

<style lang="scss" scoped>
.detail-slot{
  // padding-left: 175px;
  font-size: 14px;
  color: #dddddd;
  
  .title1{
    padding: 8px 0;
    font-size: 16px;
    color: #14cef5;
    img{
      margin-right: 8px;
    }
  }
  .title2{
    margin-left: 18px;
    padding: 8px 0;
    font-size: 16px;
    color: #14cef5;
    img{
      margin-right: 8px;
    }
  }
  .title3{
    margin-left: 36px; 
    padding: 8px 0;
  }
  .detail-item{
    margin-left: 83px;
    padding: 8px 0;
    label{
      display: inline-block;
      width: 100px;
    }
    ul{
      margin-left: 105px;
    }
    
  }
  .baseline-text{
    color: #14cef5;
  }
}

</style>