<template>
  <div>
    <div class="main">
      <p>small text</p>
      <h1>big text</h1>
      <h1>big text</h1>
      <h1>big text</h1>
      <h1>big text</h1>
    </div>
    <button @click="loading">Click to load</button>
  </div>
</template>

<script>

import Loading from '@/components/common/Loading/';

export default {
  name: 'loading',
  components: {
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
    this.loading();
  },
  methods: {
    loading() {
      Loading.open();
      window.setTimeout(() => {
        Loading.remove();
      }, 1000);
    },
  },
};
</script>
<style>
div.loading-wrapper{
  width: 600px;
  height: 300px;
}
</style>

<style scoped>

div.main {
  position: relative;
}

button {
  color: black;
}

</style>
