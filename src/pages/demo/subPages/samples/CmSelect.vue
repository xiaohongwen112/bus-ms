<template>
  <div class="cm-select">
    <CmSelect :list="list" :selectVal="selectVal" @on-change="onChange"></CmSelect>
    <span>选中值：{{selectVal}}</span>
  </div>
</template>

<script>
  import CmSelect from '@/components/common/CmSelect';

  export default {
    name: 'cm-select',
    components: { CmSelect },
    data() {
      return {
        list: ['option1', 'option2', 'option3'],
        selectVal: 'option2',
      };
    },
    methods: {
      onChange(val) {
        console.log(val);
        this.selectVal = val;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .cm-select{
    margin: 20px;
  }
</style>