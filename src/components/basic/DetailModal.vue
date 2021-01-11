<template>
  <div :class="{'details-modal-div': true, 'details-max': isMax}">
    <div class="detail-title-div">
      <div class="details-title">{{ title }}详情</div>
      <div class="details-title-center">
      </div>
      <img class="details-toggle-btn"
           :src="require(`@/assets/sys-icon/${isMax && maxable ? 'toggleMax' : 'toggleClose'}.svg`)"
           @click="handleToggle"/>
    </div>
    <div class="detail-content-div">
      <slot></slot>
    </div>
  </div>
</template>
<script>

export default {
  name: 'DetailModal',
  components: {
  },
  props: {
    id: {
      type: String,
      default: '',
    },
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
    maxable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isMax: false,
      normal: 0, // ccpc接口提供
      error: 0,
      navList: [{ code: 'singleServer', name: '单台服务器' }, { code: 'positionError', name: '故障根源定位' }, { code: 'clientStat', name: '客户端统计' }],
      navActive: 'singleServer',
    };
  },
  computed: {
  },
  methods: {
    handleToggle() {
      if (this.isMax || !this.maxable) { this.$emit('close-modal', ''); }
      if (this.maxable) {
        this.isMax = !this.isMax;
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'));
        });
      }
    },
    onResize() {
      const ele = window.d3.select(this.$el).select('.details-title');
      const eleDom = ele[0][0];
      if (ele.property('tips')) {
        ele.property('tips').remove();
      }
      if (eleDom.scrollWidth > eleDom.offsetWidth) {
        window.show_msgs(ele, eleDom.innerHTML, 'top', true);
      }
    },
  },
  mounted() {
    this.onResize();
    window.addEventListener('resize', () => {
      this.onResize();
    });
  },
};
</script>
<style lang="scss">
.details-modal-div{
    z-index: 11;
    position: absolute;
    top: 45%;
    bottom: 0;
    left: 0;
    right: 0;
    background: #192942;
}
.details-max{
    top: 105px;
}
.detail-title-div {
    height: 55px;
    line-height: 55px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: url(../../assets/overview/details-title-bg.png) no-repeat;
    background-size: 500px 56px;
    border-bottom: 1px solid #000;
}
.detail-content-div{
    width: 100%;
    height: calc(100% - 56px);
    overflow: hidden;
}
.details-title{
    width: 440px;
    font-size: 24px;
    padding-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.details-title-center{
    width: calc(85% - 504px);
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
}
.details-right{
    margin-right: 20px;
}
.details-toggle-btn{
    margin-right: 10px;
    width: 44px;
    height: 44px;
    cursor: pointer;
}
.details-left-div, .details-right-div{
    float: left;
}
.details-left-div{
    width: 310px;
    height: 100%;
    background: #0c0c2c;
    color: #6bd5d1;
    position: relative;
}
.details-left-div ul{
    width: 100%;
    height: 100%;
}
.details-left-div ul li{
    height: 33.3%;
    width: 100%;
    border-bottom: 1px solid #3e7a7c;
    cursor: pointer;
    text-align: center;
    font-size: 24px;
    // max-height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    p{
      margin: 0;
    }
    .nav-error{
      color: #fff;
      font-size: 12px;
    }
}

.active{
    background: linear-gradient(to right, rgba(13, 23, 52,1) 0%, rgba(22, 60, 99,1) 40%,  rgba(22, 60, 99,1) 60%, rgba(13, 23, 52,.9) 100%)
}
.details-arrow{
    position: absolute;
    width: 0;
    height: 0;
    border-top: 28px solid transparent;
    border-bottom: 28px solid transparent;
    border-left: 46px solid #0c0c2c;
    left: 310px;
    top: 62px;
}

.details-right-div{
    width: calc(100% - 310px);
    height: 100%;
    overflow: auto;
}

.hide-div{
    display: none;
}

.details-hidden{
    visibility: hidden;
    position: absolute;
}

.ccpc-card {
    position: relative;
    margin: 25px 22px;
}
.ccpc-show-title{
    width: 214px;
    box-shadow: 2px 3px 5px #000;
    padding-left: 12px;
    border-radius: 1px;
    border-top-left-radius: 2px;
    background: linear-gradient(to right, #184161 0%, #1e69a0 100%);
    height: 30px;
    line-height: 30px;
    margin-top: 8px;
}
.ccpc-card-content{
    width: 206px;
    height: 148px;
    box-shadow: 2px 5px 10px #000;
    border-radius: 2px;
    border-top-right-radius: 30px;
    border-bottom-left-radius: 30px;
}
.ccpc-card-top{
    background: #0e344e;
    height: calc(100% - 54px);
    display: flex;
    border-radius: 2px;
    border-top-right-radius: 30px;
}
.ccpc-card-bottom{
    background: #082639;
    height: 54px;
    border-top: 1px solid #061b29;
    border-radius: 2px;
    border-bottom-left-radius: 30px;
}
.ccpc-card-name{
    width: 174px;
    height: 30px;
    line-height: 30px;
    margin-left: -10px;
    margin-top: 8px;
    position: absolute;
    box-shadow: 2px 3px 5px #000;
    padding-left: 12px;
    border-radius: 1px;
    border-top-left-radius: 2px;
    background: linear-gradient(to right, #184161 0%, #1e69a0 100%);
}
.ccpc-top-content{
    margin-top: 40px;
    width: 50%;
    text-align: center;
}
.ccpc-quota-name{
    color: #8a8585;
}
</style>

