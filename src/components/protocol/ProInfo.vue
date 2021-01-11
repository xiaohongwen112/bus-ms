<template>
  <div class="pro-info">
    <span class="pro-name-tip"></span>
    <span class="pro-name-title">{{ nameTitle }}</span>
    <div class="pro-info-contain">
      <div>
        <span style="color: red;margin: 0 4px 0 25px;">*</span>{{ nameContant }}
        <input class="pro-name-input pro-input" type="text" autocomplete="off"
        :value="proValue.name" :ref= "data.key"
        @change="changeInput('input', $event.target.value)"/>
      </div>
      <div style="margin: 18px 40px;">
        <span style="margin: 0 4px 0 25px;float: left;">{{ nameDetail }}</span>
        <textarea class="pro-detail-textarea pro-input" :style="`height: ${computeAreaHeight}px`"
        :value="proValue.desc" autocomplete="off" :ref= "data.key"
        @change="changeInput('textarea', $event.target.value)" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default{
  data() {
    return {
      nameTitle: '协议信息',
      nameContant: '协议名称',
      nameDetail: '描述',
      data: {
        id: 'infoInput',
        ids: 'infoArae',
      },
    };
  },
  methods: {
    changeInput(a, b) {
      this.$emit('proInfoData', a, b);
    },
  },
  computed: {
    ...mapState({
      proValue: state => state.protocolData['proto.xml'].basic,
    }),
    computeAreaHeight() {
      let heights = 50;
      const descLen = this.proValue.desc !== null ? this.proValue.desc.length : 10;
      if (descLen > 70 && descLen <= 120) heights = 70;
      else if (descLen > 120 && descLen <= 200) heights = 125;
      else if (descLen > 200) heights = 135;
      else heights = 50;
      return heights;
    },
  },
};
</script>

<style lang="scss" scoped>
  .pro-info{
    width: calc(100% - 92px);
    height: 210px;
    margin: 15px 45px;
    .pro-name-tip{
      display: inline-block;
      width: 10px;
      height: 14px;
      background: -webkit-gradient(linear,left top,right top,from(#22726f),to(#3ab9b3));
      background: gradient(linear,left top,right top,from(#22726f),to(#3ab9b3));
      margin-left: 7px;
    }
    .pro-name-title{
      color: #13c6eb;
      font-size: 16px;
      margin-left: 10px;
    }
    .pro-info-contain{
      height: 150px;
      margin: 20px 0;
      .pro-input{
        border: #223f5d 1px solid;
        border-radius: 3px;
        background: transparent;
        margin-left: 16px;
      }
      .pro-name-input{
        height: 24px;
        width: 248px;
      }
      .pro-detail-textarea{
        resize: none;
        float: left;
        width: 558px;
      }
    }
  }
</style>