<template>
  <div>
    <a @click="show = true">toggle</a>
    <ConfigBox
      v-if="show"
      :tabs="tabs"
      :active="active"
      @saveConfig="saveConfig"
      @closeConfig="closeConfig"
      :width="500"
      :height="500"
    >
      <div slot="default" >
        <p> slot content</p>
      </div>
    </ConfigBox>
  </div>
</template>
<script>
import ConfigBox from '@/components/common/ConfigBox';

export default {
  name: 'configBox',
  components: {
    ConfigBox,
  },
  data() {
    return {
      tabs: [{ id: 'default', text: '' }],
      active: 0,
      show: false,
    };
  },
  methods: {
    saveConfig() {
      this.closeConfig();
      console.log('save');
    },
    closeConfig() {
      this.show = false;
    },
  },
};
</script>