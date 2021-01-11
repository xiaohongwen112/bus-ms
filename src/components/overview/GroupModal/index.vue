<template>
  <div class="overview-group-container" id="groupTopo0">
    <div class="visual-group-title">
      <div class="visual-group-name">{{ data.name }} 子拓扑</div>
      <div class="visual-group-close " @click="closeMaodal">×</div>
    </div>
    <div class="visual-group-content">
      <GroupSvg :data="data"
        @open-modal="openModal"
      />     
    </div>
  </div>
</template>

<script>
import GroupSvg from './GroupSvg';

export default {
  name: 'GroupModal',
  components: {
    GroupSvg,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {
          name: '',
          source: [],
          nodes: [],
        };
      },
    },
  },
  methods: {
    closeMaodal() {
      this.$emit('close-container');
      this.$store.commit('setDialog', null);
    },
    openModal(args) {
      this.$emit('open-modal', args);
    },
  },
};
</script>

<style scoped>
.overview-group-container{
    z-index: 1;
    position: absolute;
    bottom: 1px;
    left: 0;
    right: 0;
    top: 45%;
}
.visual-group-title{
    height: 52px;
    line-height: 52px;
    background: #2b3f52;
    font-size: 24px;
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.visual-group-name{
    padding-left: 10px;
}
.visual-group-close {
    cursor: pointer;
    width: 40px;
    margin-right: 10px;
    font-size: 50px;
}

.visual-group-content{
    width: 100%;
    height: calc(100% - 52px);
    background: #141e28;
}
</style>
