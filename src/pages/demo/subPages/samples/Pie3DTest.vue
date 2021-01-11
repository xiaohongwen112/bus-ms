<template>
  <div class="chart-div">
    <div class="wrap">
      <Pie3D :data="[{ label: '直接访问', value: '234' }, { label: '邮件营销', value: '130' }, { label: '电话营销', value: '120' }]"></Pie3D>
    </div>
    <div class="wrap">
      <Pie3D :data="[]"></Pie3D>
    </div>
    <div class="wrap">
      <Pie3D :data="[{ label: 'null', value: '128' }, { label: '取现', value: '146' }, { label: '余额查询', value: '161' }, { label: '转账', value: '227' }]"></Pie3D>
    </div>
    <div class="wrap">
      <Pie3D :data="[{ label: '直接访问', value: '0' }, { label: 'null', value: '0' }, { label: '取现', value: '0' }]"></Pie3D>
    </div>
  </div>
</template>
<script>
import Pie3D from '@/components/common/Pie3D';

export default {
  name: 'pie-3d',
  components: {
    Pie3D,
  },
};
</script>
<style lang="scss" scoped>
.chart-div{
    position: absolute;
    top: 20px;
    left:200px;
    bottom:40px;
    right: 20px;
    background-color: #010c11;
    .wrap{
      width: 50%;
      height: 50%;
      float: left;
    }
}
</style>