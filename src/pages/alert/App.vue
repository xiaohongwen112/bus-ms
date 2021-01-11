<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import '@/assets/css/tooltip.scss';

export default {
  name: 'app',
};
</script>


<style lang="scss" scoped>
#app{
  height: 100%;
}
</style>