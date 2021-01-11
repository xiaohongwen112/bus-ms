<template>
   <li class="legend-item">
      <Dot :fill="data.color"/>
      <p class="title">{{ data.name }}</p>
      <p class="str">{{ data.str }}</p>
    </li>
</template>

<script>
import Dot from './Dot';

export default {
  name: 'StorageLegendItem',
  components: {
    Dot,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {
          name: '可用空间',
          code: '',
          value: 123333,
          str: '12.34GB',
          color: '#519a4c',
        };
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.legend-item{
  min-width: 150px;
  height: 58px;
  text-align: left;
  >svg{
    width: 40px;
    height: 33px;
    vertical-align: middle;
  }
  .title{
    display: inline-block;
    color: #696a6b;
    font-size: 14px;
    vertical-align: bottom;
    margin-bottom: 0px;
    margin-top: 0px;
  }
  .str{
    padding-left: 43px;
    color: #ddd;
    font-size: 16px;
    margin-bottom: 0;
    margin-top: 10px;
  }
}
</style>
