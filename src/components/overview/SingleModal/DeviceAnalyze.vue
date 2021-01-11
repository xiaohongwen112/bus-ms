<template>
  <div class="analyze">
    <div class="dount-wrap">
      <DountChart :dataset="test1"></DountChart>
      <p class="chart-title">语言分布</p>
    </div>
    <div class="dount-wrap">
      <DountChart :dataset="test2"></DountChart>
      <p class="chart-title">浏览器使用占比</p>
    </div>
    <div class="bar-wrap">
      <SimpleBarChart :unit="`%`" :dataset="test2"/>
      <p class="chart-title">各位浏览器成功率</p>
    </div>
  </div>
</template>
<script>
  import DountChart from '@/components/common/DountChart';
  import SimpleBarChart from '@/components/common/SimpleBarChart';

  export default {
    name: 'DeviceAnalyze',
    components: {
      DountChart,
      SimpleBarChart,
    },
    computed: {
      test1() {
        return [{ code: '', name: '德语', value: 5 },
        { code: '', name: '韩语', value: 10 },
        { code: '', name: '日语', value: 20 },
        { code: '', name: '中文', value: 45 },
        { code: '', name: '其他', value: 6 }];
      },
      test2() {
        return [{ code: '', name: 'IE', value: 56 },
        { code: '', name: 'FireFox', value: 83 },
        { code: '', name: 'Chrome', value: 98 },
        { code: '', name: 'Badidu', value: 45 },
        { code: '', name: '其他', value: 30 }];
      },
    },
    mounted() {
    },
    methods: {
    },
  };
</script>
<style lang="scss" scoped>
  .analyze{
    width: 100%;
    height: 100%;
    .dount-wrap, .bar-wrap{
      display: inline-block;
      text-align: center;
    }
    .dount-wrap{
      width: 25%;
      height: calc(100% - 25px);
    }
    .bar-wrap{
      width: calc(50% - 10px);
      height: calc(100% - 25px);
    }
    .chart-title{
      margin: 0;
     
      color: #6bd5d1;
      font-size: 16px;
    }
  }



  .boxContent{
    width: 100%;
    height: 100%;
    font-family: "Noto Sans S Chinese", "SourceHanSansCN-Normal", sans-serif;
    font-size: 16px;
    color: #fff;
  }
  .boxL, .boxR{
    float: left;
  }
  .boxL{
    width: 700px;
  }
  .boxR{
    width: 405px;
  }
  .deviceInfo{
    line-height: 35px;

  }
  .deviceContent{
    padding-left: 22px;
  }
  .InfoItem{
    display: inline-block;
    width: 208px;
  }
  .beauty{
    margin-right:6px;
    width: 10px;
    background: url(../../../assets/sys-icon/beautyL.svg) no-repeat;
    height: 12px;
    display: inline-block;
  }
  .beautyL {
    vertical-align: top;
  }
  .sourceTb{
    display: inline-block;
  }
  table{
    color: #fff;
  }
 table tbody tr td{
   text-align: center;
   padding: 5px 10px;
 }
  table tbody tr:nth-child(1) td{
    text-align: left;
  }
  table tr:nth-child(odd){
    background-color: #152A3D;
  }
</style>
