<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import '@/assets/css/tooltip.scss';

export default {
  name: 'app',
  // computed: {
  //   ...mapState({
  //     newTs: 'newTs',
  //   }),
  // },
  // watch: {
  //   newTs(val) {
  //     console.log(val);
  //   },
  // },
};
</script>

<style>
.manage-namePops{
  position: fixed !important;
}

</style>
