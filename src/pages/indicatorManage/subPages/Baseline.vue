<template>
  <div class="baseline">
    <BaselineItem class="config-item" v-for="(item, index) in baseline.dim_data" :key="`baseline-${index}`" :data="item" parents="baseline"
      @changeTime="changeTime(index, arguments)" @changePeriod="changePeriod(index, arguments)"/>
    <div class="btn-container">
      <CmSimpleBtn type="main" @click="saveChange('default')">恢复默认</CmSimpleBtn>
      <BmsBtn type="main" @click="saveChange('')">保存</BmsBtn>
    </div>
  </div>
</template>

<script>
import { BmsBtn, CmSimpleBtn } from '@/components/basic';
import BaselineItem from '../../manageApp/subPages/BaselineItem';
import { getBaseline, updateBaseline } from '../service';

export default {
  components: { BaselineItem, BmsBtn, CmSimpleBtn },
  data() {
    return {
      baseline: {},
    };
  },
  methods: {
    async configData() {
      try {
        const res = await getBaseline();
        const data = res.data.data;
        this.baseline = data;
      } catch (e) {
        console.log(e);
      }
    },
    changeTime(index, val) {
      this.baseline.dim_data[index].cycle = val[0].key;
    },
    changePeriod(index, val) {
      this.baseline.dim_data[index].granularity = val[0].key;
    },
    saveChange(flag) {
      let data = JSON.stringify(this.baseline);
      if (flag === 'default') {
        data = JSON.stringify({ dim_data: [] });
      }
      updateBaseline({ baseline: data }).then((res) => {
        if (res.data.code === 0) {
          this.configData();
        }
      }).catch();
    },
  },
  created() {
    this.configData();
  },
};
</script>

<style lang="scss">
.baseline{
  .baseline-name1, .baseline-name2, .baseline-name3{
    display: inline-block;
  }
  .baseline-name1{
    margin-right: 30px;
    &:after{
      content: ':';
      margin-left: 2px;
    }
  }
  .baseline-name2{
    width: 90px;
    color: #1f99e4;
  }
  .baseline-name3{
    margin-right: 10px;
  }
  .cm-select{
    margin-right: 15px;
  }
}
</style>

<style lang="scss" scoped>
  .baseline{
    margin: 20px 50px;
    .config-item{
      margin-bottom: 20px;
    }
    .btn-container{
      width: 670px;
      text-align: center;
      padding-top: 5px;
      button:first-child{
        margin-right: 15px;
      }
    }
  }
</style>