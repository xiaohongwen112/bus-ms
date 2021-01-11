<template>

  <div class="wrapper">
    <ProgressBar
      :percent="percent"
      :startColor="'#39ca76'"
      :stopColor="'#55ede7'"
      :colorBg="'#424242'"
    />
    <a
      @click="percent = percent + 0.1"
    >add</a>
  </div>
  
</template>
<script>

import ProgressBar from '@/components/common/ProgressBar';

export default {
  name: 'progress-bar',
  components: {
    ProgressBar,
  },
  data() {
    return {
      percent: 0.1,
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
