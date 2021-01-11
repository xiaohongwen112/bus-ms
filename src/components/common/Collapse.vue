<template>
  <div class="collapse-wrapper">
    <slot></slot>
  </div>
</template>
<script>

const props = {
  accordion: {
    type: Boolean,
    default: true,
  },
  activeTab: {
    type: [Array, String, Number],
    default: 0,
  },
};

export default {
  name: 'collapse',
  props,
  data() {
    return {
      activeTabs: [].concat(this.activeTab),
    };
  },
  watch: {
    activeTab(newV) {
      this.activeTabs = [].concat(newV);
    },
  },
  methods: {
    setActiveTabs(tabs) {
      const newTabs = [].concat(tabs);
      const value = this.accordion ? newTabs[0] : newTabs;
      this.activeTabs = newTabs;
      this.$emit('input', value);
      this.$emit('change', value);
    },
    handleItemClick(item) {
      if (this.accordion) {
        const name = this.activeTabs[0] && this.activeTabs[0] === item.name ?
          '' : item.name;
        this.setActiveTabs(name);
      } else {
        const activeTabs = this.activeTabs.slice(0);
        const index = activeTabs.indexOf(item.name);

        if (index > -1) {
          activeTabs.splice(index, 1);
        } else {
          activeTabs.push(item.name);
        }
        this.setActiveTabs(activeTabs);
      }
    },
  },
  created() {
    this.$on('item-click', this.handleItemClick);
  },
};
</script>
<style scoped>

div.collapse-wrapper {
  width: 100%;
  height: 100%;
}

</style>
