<template>
  <config-box :tabs="tabs" :width='765' :height='415' :scrollheight="scrollheight" :onlyConfirm="otherStatus"
    @saveConfig="saveSettings('')" @closeConfig="close">
    <div slot="health" class="health-container">
      <div class="health-relative">
        <div class="baes-info">
          <div>
            <span class="title">名称</span>
            <CmInput value="健康度" :width="inputWidth" type="popsUp" :disable="nameStatus" @on-change="onChange"></CmInput>
          </div>
          <div>
            <span class="title">权重</span>
            <div>
              <div class="config-cotent">
                <span>响应时间<CmInput ref="resTime" :value="resTime" :width="otherInputWidth" type="popsUp" :disable="otherStatus" :errorFlag="resTimeFlag"
                @on-change="onChange($event, 'resTime')" @mouseover="showPopsTip($event, 'resTime')" @mouseout="showPops = false"/>%</span>+
                <span>响应时间<CmInput ref="resRate" :value="resRate" :width="otherInputWidth" type="popsUp" :disable="otherStatus" :errorFlag="resRateFlag"
                @on-change="onChange($event, 'resRate')" @mouseover="showPopsTip($event, 'resRate')" @mouseout="showPops = false"/>%</span>+
                <span>响应时间<CmInput ref="succRate" :value="succRate" :width="otherInputWidth" type="popsUp" :disable="otherStatus" :errorFlag="succRateFlag"
                @on-change="onChange($event, 'succRate')" @mouseover="showPopsTip($event, 'succRate')" @mouseout="showPops = false"/>%</span>=
                100%
              </div>
              <div class="description">权重配置：健康度的计算中，各个参数所占的百分比。</div>
            </div>
          </div>
          <div>
            <span class="title">无响应值</span>
            <div>
              <div class="config-cotent">
                <span>无响应<CmInput ref="noResponse" :value="noResponse" :width="otherInputWidth" type="popsUp" :disable="otherStatus" :errorFlag="noResponseFlag"
                @on-change="onChange($event, 'noResponse')" @mouseover="showPopsTip($event, 'noResponse')" @mouseout="showPops = false"/>%</span>
                <span>无交易请求<CmInput ref="noRequest" :value="noRequest" :width="otherInputWidth" type="popsUp" :disable="otherStatus" :errorFlag="noRequestFlag"
                @on-change="onChange($event, 'noRequest')" @mouseover="showPopsTip($event, 'noRequest')" @mouseout="showPops = false"/>%</span>
              </div>
              <div class="description">无响应健康度配置：处于无响应或无交易请求时，该交易在业务健康度计算中的固定值。</div>
            </div>
          </div>
          <div v-if="title !== '详情'" class="reset-content">
            <CmSimpleBtn type="popsUp" @click="saveSettings('default')">恢复默认</CmSimpleBtn>
          </div>
        </div>
      </div>
      <PopsMsg type="error" :showTips="showPops" :msg="errmsg" :lefts="lefts" :top="top"></PopsMsg>
    </div>
  </config-box>
</template>

<script>
  import { ConfigBox, CmInput, CmSimpleBtn, PopsMsg } from '@/components/basic';

  export default {
    props: {
      title: {
        type: String,
        default: '',
      },
      data: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    components: { ConfigBox, CmInput, CmSimpleBtn, PopsMsg },
    data() {
      return {
        tabs: [
          { id: 'health', text: this.title },
        ],
        inputWidth: 560,
        scrollheight: 410,
        nameStatus: true,
        otherInputWidth: 70,
        resTime: Number((this.data.weight.dur_per_config * 100).toFixed(2)),
        resRate: Number((this.data.weight.rr_rate_config * 100).toFixed(2)),
        succRate: Number((this.data.weight.succ_rate_config * 100).toFixed(2)),
        noResponse: Number((this.data.health.no_req_config * 100).toFixed(2)),
        noRequest: Number((this.data.health.no_data_config * 100).toFixed(2)),
        otherStatus: this.title === '详情' ? true : false, // eslint-disable-line
        resTimeFlag: false,
        resRateFlag: false,
        succRateFlag: false,
        noResponseFlag: false,
        noRequestFlag: false,
        showPops: false,
        top: 0,
        lefts: 0,
        errmsg: '',
      };
    },
    methods: {
      onChange(val, ref) {
        this[ref] =  val === '' || isNaN(val) ? val : Number(val); // eslint-disable-line
        if (val === '') {
          this[`${ref}Flag`] = true;
          this.errmsg = '';
          return;
        }
        const reg = /^[\+]?\d*?\.?\d*?$/; // eslint-disable-line
        if (!reg.test(val)) {
          this.resTimeFlag = false;
          this.resRateFlag = false;
          this.succRateFlag = false;
          this[`${ref}Flag`] = true;
          this.errmsg = '格式输入有误，只能输入正数';
          return;
        }
        this[`${ref}Flag`] = false;
      },
      showPopsTip(e, flag) {
        if (this[`${flag}Flag`] && this.errmsg !== '') {
          const ele = e.target.parentNode.getBoundingClientRect();
          this.top = ele.top;
          this.lefts = ele.left + ele.width / 2;
          this.showPops = true;
        }
      },
      close() {
        this.$emit('onClose');
      },
      saveSettings(type) {
        this.onChange(this.resTime, 'resTime');
        this.onChange(this.resRate, 'resRate');
        this.onChange(this.succRate, 'succRate');
        this.onChange(this.noResponse, 'noResponse');
        this.onChange(this.noRequest, 'noRequest');
        if (!(this.resTimeFlag || this.resRateFlag || this.succRateFlag || this.noResponseFlag || this.noRequestFlag)) {
          if (this.resTime + this.resRate + this.succRate !== 100) {
            this.resTimeFlag = true;
            this.resRateFlag = true;
            this.succRateFlag = true;
            this.errmsg = '输入有误：权重相加不等于100%';
          } else {
            this.resTimeFlag = false;
            this.resRateFlag = false;
            this.succRateFlag = false;
            const data = {
              health: {
                no_data_config: type !== '' ? 40 : this.noRequest,
                no_req_config: type !== '' ? 40 : this.noResponse,
              },
              weight: {
                dur_per_config: type !== '' ? 33.33 : this.resTime,
                rr_rate_config: type !== '' ? 33.33 : this.resRate,
                succ_rate_config: type !== '' ? 33.34 : this.succRate,
              },
            };
            this.$emit('onSave', { type, data });
          }
        }
      },
    },
    mounted() {
    },
  };
</script>

<style lang="scss">
.indicator-tab{
  .config-container{
    .config-main{
      width: 755px !important;
      .nav-content{
        box-sizing: border-box;
      }
      .scroll-area{
        height: inherit !important;
        max-height: 155px;
      }
      .ps--active-x > .ps__rail-x, .ps--active-y > .ps__rail-y {
        background-color: #070f16;
      }
      .ps__thumb-y, .ps__thumb-x {
        background: #1d5d82;
      }
      .health-relative{
        .cm-input{
          input {
            min-width: 70px;
            padding-right: 8px;
          }
        }
      }
    }
  }
  .health-container{}
}
</style>

<style lang="scss" scoped>
.health-container{
  .health-relative{
    padding-top: 30px;
    .baes-info{
      >div{
        display: flex;
        margin-bottom: 20px;
        &.reset-content{
          padding-left: 90px;
        }
      }
    }
    .title{
      position: relative;
      width: calc(100% - 572px);
      vertical-align: middle;
      font-size: 14px;
      color: #ddd;
      line-height: 30px;
      text-align: right;
      padding-right: 15px;
      box-sizing: border-box;
    }
    .cm-input{
      vertical-align: middle;
    }
    .cm-input, .cm-textarea{
      float: right;
    }
    .setting-content{
      .title{
        line-height: inherit;
      }
      button:nth-of-type(1){
        margin-right: 15px;
      }
    }
    .config-cotent{
      width: 560px;
      span {
        margin-right: 5px;
        .cm-input{
          float: none;
          margin: 0 8px;
        }
      }
    }
    .description{
      color: #3f454d;
      margin-top: 5px;
    }
  }
}
</style>