<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>

  export default {
    name: 'app',
    computed: {},
  };
</script>

<style lang="scss" scoped>

.app{
  height: 100%;
}
.content{
  position: absolute;
  top: 95px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
