<template>
  <svg viewBox="0,0,224,164" preserveAspectRatio="xMidYMid meet" width="249" height="164" class="dimensionCard"
    @click="click" :data-change="`${data.trans_count}`">
    <g>
        <polyline fill="none" :stroke="getFill" stroke-width="1" points="0,120 0,11 9,4 140,4 148,0 224,0"></polyline>
        <polyline fill="none" :stroke="getFill" stroke-width="1" points="9,8 140,8"></polyline>
        <g>
            <rect x="9" y="12" width="213" height="109" fill="none" stroke-width="1" :stroke="getFill"></rect>
            <text x="64" y="42" text-anchor="middle" class="multi-content" :fill="getFill ">
                <tspan class="multi-transcount multi-card-data">{{ data.trans_count }}</tspan>
                <tspan x="64" dy="16" class="multi-name">交易量(笔)</tspan>
            </text>
            <text x="164" y="42" text-anchor="middle" class="multi-content" :fill="getFill">
                <tspan class="multi-succrate multi-card-data">{{ data.succ_rate }}</tspan>
                <tspan x="164" dy="16" class="multi-name">成功率(%)</tspan>
            </text>
        <text x="64" y="90" text-anchor="middle" class="multi-content" :fill="getFill">
            <tspan class="multi-duration  multi-card-data">{{ data.duration }}</tspan>
            <tspan x="64" dy="16" class="multi-name">响应时间(ms)</tspan>
        </text>
        <text x="164" y="90" text-anchor="middle" class="multi-content" :fill="getFill">
            <tspan class="multi-resrate  multi-card-data">{{ data.rr_rate }}</tspan>
            <tspan x="164" dy="16" class="multi-name">响应率(%)</tspan>
            </text>
        </g>
        <g>
          <foreignObject width="153" height="22" x="70" y="125">
            <p class="data-text" @mouseenter="overInTip" @mouseleave="overOutTip" :style="`background-color:${valid ? '#1b7571' : '#353e46'};color:${getColor};`">{{data.text}}</p>
          </foreignObject>
          <foreignObject v-if="showTips && data.text !== '----'" width="300" height="30" x="80" y="90">
            <PopsMsg type="common" :showTips="true" :msg="data.text" :lefts="50" :top="-30"></PopsMsg>
          </foreignObject>
        </g>
        <g>
            <polyline fill="none" :stroke="getFill" stroke-width="1" points="9,126 66,126 66,146 70,150 92,150 102,164 224,164"></polyline>
            <text x="110" y="160" :fill="getColor" class="multi-dimension card-white">{{ `第${index + 1}维度` }}</text>
        </g>
    </g>
    </svg>
</template>
<script>
// import { mapState } from 'vuex';
import { PopsMsg } from '@/components/basic';

export default {
  components: {
    PopsMsg,
  },
  name: 'BizCard',
  data() {
    return {
      showTips: false,
    };
  },
  props: {
    index: {
      type: Number,
      default: 0,
      required: true,
    },
    valid: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default() {
        return {
          trans_count: '--',
          succ_rate: '--',
          duration: '--',
          rr_rate: '--',
          text: '--',
          _id: '--',
        };
      },
    },
  },
  computed: {
    // ...mapState({
    //   cardList: state => state.multi.cardList,
    // }),
    getFill() {
      return this.valid ? '#32d6c8' : '#353e46';
    },
    getColor() {
      return this.valid ? '#c3e0dc' : '#83878d';
    },
  },
  methods: {
    overInTip() {
      this.showTips = true;
    },
    overOutTip() {
      this.showTips = false;
    },
    click() {
      this.$emit('click');
    },
    // getNum(key) {
    //   const val = this.data[key];
    //   let newVal = '--';
    //   if (this.valid && val >= 0) {
    //     newVal = Number(val).toFixed(2) * 100 / 100;
    //   }
    //   return newVal;
    // },
    // formatText() {
    //   let newStr = '----';
    //   const obj = this.cardList[this.index];
    //   const str = `${obj.titleName}:${obj._id}`;
    //   if (this.valid && str !== undefined) {
    //     newStr = str;
    //   }
    //   return newStr;
    // },
  },
};
</script>
<style scoped>
svg{
    cursor: pointer;
}
.data-text{
  width: 153px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
}
</style>
