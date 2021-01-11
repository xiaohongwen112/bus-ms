<template>
  <div class="wrap-div">
    <p class="title">
      存储路径：
      <span >/opt</span>
    </p>
    <DotFilter />
    <ul class="legend">
      <StorageLegendItem class="legend-li" v-for="(item, index) in storeData" :key="`legend${index}`" :data="item"/>
    </ul>
    <div class="svg-div">
      <StorageSvg :data="storeData"/>
    </div>
    <div class="clear-data-wrap">
      <CmSimpleBtn type="main" class="clear-data-btn" @click="handleClear">
        清除数据
      </CmSimpleBtn>
    </div>
    <CmTip :tipContent="tipContent" v-if="showTips" :closeFn="() => showTips = false"
      :showFooter = "showFooter"
      @on-confirm = "confirmClear()">
    </CmTip>
  </div>
</template>

<script>
import { getStoreinfo, clearData } from '@/pages/settings/service';
import { addUnit } from '@/pages/settings/utils';
import { CmSimpleBtn } from '@/components/basic';
import CmTip from '@/components/common/CmTip';
import DotFilter from './DotFilter';
import StorageLegendItem from './StorageLegendItem';
import StorageSvg from './StorageSvg';

export default {
  name: 'StoragePath',
  components: {
    DotFilter,
    StorageLegendItem,
    StorageSvg,
    CmSimpleBtn,
    CmTip,
  },
  data() {
    return {
      colorDatum: ['#519a4c', '#BC1B67', '#54b5b3', '#6E83D9', '#047AD1', '#DC7A5D', '#B7BE3A'],
      codeDatum: ['available', 'btr', 'mongodb', 'other', 'pcap', 'sfitrace', 'spd'],
      nameDatum: ['可用空间', '业务流数据', '数据库', '其他数据', '原始数据包', '数据包缓存', '网路侦测数据'],
      testData: [
        { name: '可用空间', code: '', value: 123333, str: '12.34GB', color: '#519a4c' },
        { name: '业务流数据', code: '', value: 823333, str: '12Gb', color: '#BC1B67' },
        { name: '数据库', code: '', value: 323333, str: '12Kb', color: '#54b5b3' },
      ],
      storeData: [],
      showTips: false,
      showFooter: true,
      tipContent: '确定清除业务流数据、原始数据包、日志数据？',
    };
  },
  methods: {
    initStoreData() {
      this.storeData = this.nameDatum.map((d, index) => ({ name: d, code: this.codeDatum[index], value: 0, str: '', color: this.colorDatum[index] }));
    },
    getData() {
      getStoreinfo().then((response) => {
        const data = response.data.data;
        const curData = Object.values(data)[0];
        this.codeDatum.forEach((d, index) => {
          const tmpValue = curData[d];
          this.storeData[index].value = tmpValue;
          this.storeData[index].str = addUnit(tmpValue);
        });
      })
      .catch((error) => {
        console.log(error);
      });
    },
    handleClear() {
      this.showTips = true;
    },
    confirmClear() {
      clearData();
      this.showTips = false;
    },
  },
  mounted() {
    this.initStoreData();
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
p{
    margin: 0;
}
.title{
    line-height: 33px;
    text-align: left;
    color: #4ab2a5;
    font-size: 16px;
}
.wrap-div{
  padding:10px 20px;
}
.svg-div{
  margin-top: -10%;
}
.legend-li{
  display: inline-block;
}
.clear-data-wrap{
  // position: absolute;
  // bottom: 20px;
  text-align: center;
  margin-top: -20px;
}

</style>
