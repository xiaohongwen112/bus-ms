<template>
  <div>
    <span>{{ i }}</span>
    <input type="text" v-model="areaName" >
    <china-map :areaCode="areaCode" :areaName="areaName" :data="mapData"></china-map>

  </div>

</template>

<script>

import ChinaMap from '@/components/common/ChinaMap';

export default {
  name: 'hello',
  components: {
    ChinaMap,
  },
  data() {
    return {
      i: 0,
      areaCode: 0,
      areaName: '全国',
      mapData: [],
    };
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
