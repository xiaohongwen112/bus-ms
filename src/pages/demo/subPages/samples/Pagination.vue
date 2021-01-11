<template>

  <div class="wrapper">
    <Pagination
      :total="total"
      :current="current"
      @to-page="goTo"
    />
    <Pagesize class="page-size-div" :options="[10, 20, 0]" v-model="currentPagesize"/>
    选中：{{ currentPagesize }}
  </div>
  
</template>
<script>

import Pagination from '@/components/common/Pagination';
import Pagesize from '@/components/common/Pagesize';

export default {
  name: 'pagination',
  components: {
    Pagination,
    Pagesize,
  },
  data() {
    return {
      total: 19,
      current: 1,
      currentPagesize: 10,
    };
  },
  methods: {
    goTo(page) {
      this.current = page;
    },
  },
};
</script>
<style scoped>
.wrapper {
  position: relative;
  width: 800px;
  height: 100px;
}

</style>
