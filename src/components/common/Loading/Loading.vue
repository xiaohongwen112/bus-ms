<template>
  <div v-show="show" class="loading-wrapper">
    <img src="../../../assets/sys-icon/loading.gif" alt="努力加载中..."/>
  </div>
</template>

<script>

const props = {
  show: {
    type: Boolean,
    default: true,
  },
};

export default {
  name: 'loading',
  props,
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  },
};

</script>
<style scoped>

div.loading-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  opacity: 0.9;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.85);
}

</style>
