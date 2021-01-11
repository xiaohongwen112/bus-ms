<template>
  <div class="cm-switch">
    <CmSwitch :switchText="switchText" :switchStatus="switchStatus" :statusOne="statusOne" :statusOther="statusOther"></CmSwitch>
  </div>
</template>

<script>
  import CmSwitch from '@/components/common/CmSwitch';

  export default {
    name: 'cm-switch',
    components: { CmSwitch },
    data() {
      return {
        switchText: 'switch',
        switchStatus: true,
        statusOne: 'on',
        statusOther: 'off',
      };
    },
  };
</script>

<style lang="scss" scoped>
  .cm-switch{
    margin:20px;
  }
</style>