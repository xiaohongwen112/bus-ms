<template>
  <div>
    <StTable/>
  </div>
</template>
<script>
import StTable from '@/components/stat/StTable';

export default {
  name: 'Table',
  components: {
    StTable,
  },
  data() {
    return {
      activeWeek: [0, 3],
    };
  },
};
</script>
<style lang="scss">
.tooltip-demo-parent{
  width: 300PX;
  height: 40px;
  border: solid 1px red;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

</style>
