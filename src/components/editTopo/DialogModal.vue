<template>
  <div class="modal-backdrop" v-show="show">
    <div class="dialog-modal">
      <div class="dialog-modal-title">{{ title }}</div>
      <div class="dialog-modal-header">
        <div class="dialog-progress">
          <progress-bar
            :width="580"
            :height="20"
            :startColor="'#449AA7'"
            :stopColor="'#B9BC47'"
            :percent="newPercent"
          ></progress-bar>
        </div>
        <div class="dialog-ok" :class="{'ban-btn': !showApplyOk}" @click="onClickOk">确认</div>
      </div>
      <div class="dialog-finish-msg" :class="{'finished': newPercent === 1}">{{ finish }}</div>
        <div class="dialog-modal-body" ref="body">
          <ScrollBar class="scroll-area" :options="{useBothWheelAxes: true}">
            <div>
              <div class="dialog-msg" v-for="(item, index) in msg" :key="index">{{ item }}</div>
            </div>
          </ScrollBar>
        </div>
    </div>
  </div>
</template>

<script>
  import { ProgressBar, ScrollBar } from '@/components/common';

  export default {
    name: 'dialog-modal',
    components: {
      ProgressBar,
      ScrollBar,
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      msg: {
        type: Array,
        default() {
          return [];
        },
      },
      percent: {
        type: Number,
        default: 0,
      },
      finish: {
        type: String,
        default: '',
      },
      show: {
        type: Boolean,
        default: false,
      },
      showApplyOk: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        startRgb: this.hexToRgba(this.startColor, 1),
        stopRgb: this.hexToRgba(this.stopColor, 1),
        newPercent: this.percent > 1 ? 1 : this.percent,
      };
    },
    watch: {
      percent() {
        this.newPercent = this.percent > 1 ? 1 : this.percent;
      },
      msg() {
        this.$nextTick(() => {
          this.$refs.body.scrollTop = this.$refs.body.scrollHeight + 22;
          // this.$refs.body.scrollTop = this.msg.length * 22;
        });
      },
    },
    computed: {
      width() {
        return this.width - 2;
      },
      barHeight() {
        return this.height - 2;
      },
      barWidth() {
        return (this.width - 2) * this.newPercent;
      },
      rx() {
        return this.barHeight / 2 - 1;
      },
      newStopColor() {
        const middleColor = this.middleColor(this.startRgb, this.stopRgb, this.newPercent);
        return `rgb(${middleColor.r},${middleColor.g},${middleColor.b})`;
      },
    },
    methods: {
      hexToRgba(hex, al) {
        let hexColor = /^#/.test(hex) ? hex.slice(1) : hex;
        const alp = hex === 'transparent' ? 0 : Math.ceil(al);
        let r;
        let g;
        let b;
        hexColor = /^[0-9a-f]{3}|[0-9a-f]{6}$/i.test(hexColor) ? hexColor : 'fffff';
        if (hexColor.length === 3) {
          hexColor = hexColor.replace(/(\w)(\w)(\w)/gi, '$1$1$2$2$3$3');
        }
        r = hexColor.slice(0, 2);
        g = hexColor.slice(2, 4);
        b = hexColor.slice(4, 6);
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);
        return {
          hex: `#${hexColor}`,
          alpha: alp,
          rgba: `rgba(${r}, ${g}, ${b}, ${(alp / 100).toFixed(2)})`,
          rgb: `rgb(${r}, ${g}, ${b})`,
          r,
          g,
          b,
        };
      },
      middleColor(color1, color2, percent) {
        return {
          r: parseInt((color2.r - color1.r) * percent, 10) + color1.r,
          g: parseInt((color2.g - color1.g) * percent, 10) + color1.g,
          b: parseInt((color2.b - color1.b) * percent, 10) + color1.b,
        };
      },
      onClickOk() {
        this.$emit('clickOk');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .scroll-area {
    position: relative;
    width: 100%;
    height:276px;
  }
</style>
<style lang="scss" scoped>
  .modal-backdrop{
    background: rgba(77, 73, 105, .5);
    z-index: 999;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;

    .dialog-modal{
      width: 777px;
      height: 450px;
      margin: 8% auto;
      border: 1px solid #13CFF5;
      background: #081929;


      .dialog-modal-title {
        background: url(../../assets/topo-nav/points.png) no-repeat;
        width: 170px;
        height: 60px;
        position: relative;
        left: -7px;
        top: -45px;
        font-size: 24px;
        color: #fff;
      }

      .dialog-modal-header {
        position: relative;
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-shadow: 1px 2px 3px #555;
        display: flex;
        justify-content: center;
        align-content: center;

        .dialog-progress{
          height: 60px;
          line-height: 40px;
          width: calc(100% - 120px);
          text-align: center;
        }

        .dialog-ok{
          width: 60px;
          height: 30px;
          background: #219892;
          text-align: center;
          border-radius: 15px;
          line-height: 30px;
          cursor: pointer;
          color:#fff;
        }

        .ban-btn{
          pointer-events: none;
          display: none;
        }
      }

      .dialog-finish-msg{
        width:100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: rgb(220, 142, 86);
      }

      .finished{
        color: rgb(58, 191, 196);
      }

      .dialog-modal-body{
        opacity: .95;
        font-size: 13px;
        margin: 27px 25px;
        padding: 0;
        line-height: 66px;
        word-break: break-all;
        background-color: #06141F !important;
        background-clip: content-box;
        height:276px;
        >div{
          min-height:276px;
          .dialog-msg{
            min-height: 22px;
            line-height: 22px;
            padding-left: 15px;
          }
        }
      }
    }
  }
</style>
