<template>
  <div class="search">
    <Search v-model="value" @on-search="onSearch"></Search>
    <span>要搜索的关键词：{{value}}</span>
  </div>
</template>

<script>
  import Search from '@/components/common/Search';

  export default {
    name: 'search',
    components: { Search },
    data() {
      return {
        value: '',
      };
    },
    methods: {
      onSearch(val) {
        console.log(val);
        this.value = val;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .search{
    margin:20px;
  }
</style>