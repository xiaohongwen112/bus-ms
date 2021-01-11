<template>
  <span class="table-sort">
    <i class="icon-bms-front"
      :class="sort === 1 ? 'icon_active' : ''"
      @click="onASC"></i>
    <i class="icon-bms-behind"
      :class="sort === -1 ? 'icon_active' : ''"
      @click="onDESC"></i>
  </span>
</template>

<script>
  export default {
    props: {
      sort: { type: Number, isRequired: true },
    },
    methods: {
      onASC() {
        // 升序
        if (this.sort !== 1) {
          this.$emit('onASC');
        }
      },
      onDESC() {
        //  降序
        if (this.sort !== -1) {
          this.$emit('onDESC');
        }
      },
    },
  };
</script>

<style lang="scss">
@import '../../assets/css/iconbms.css';
  
  // .common-sort-icon {
  //   font
  //   .icon-active{
  //     color: aqua;
  //   }
  // }
</style>
