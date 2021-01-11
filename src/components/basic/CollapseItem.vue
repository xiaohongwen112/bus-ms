<template>

  <div class="item-block" :class="{'is-active': isActive}">
    <div
      class="item-header"
      @click="handleHeaderClick"
    >
      <slot name="title"> {{ title }} </slot>
    </div>
    <div
      class="item-wrap"
      v-show="isActive"
    >
      <div class="item-content">
        <slot></slot>
      </div>
    </div>
  </div>

</template>
<script>

const props = {
  name: {
    type: [String, Number],
    default: 0,
  },
  title: {
    type: String,
    default: '',
  },
};

export default {
  props,
  computed: {
    isActive() {
      return this.$parent.activeTabs && this.$parent.activeTabs.indexOf(this.name) > -1;
    },
  },
  methods: {
    handleHeaderClick() {
      this.$parent.$emit('item-click', this);
    },
  },
};

</script>
<style lang="scss" scoped>

div.item-block {
  margin-top: 1px;

  &:first-child {
    margin-top: 0;
  }

  &.is-active {
    div.item-header {
      background-color: #365c82;
    }
  }

  div.item-header {
    background: #15202b;
    text-align: center;
    cursor: pointer;
    padding: 8px;
    height: 36px;
    color: #ccdce9;
    font-size: 14px;
  }

  div.item-wrap {
    height: calc(100% - 36px);

    .item-content {
      height: 100%;
      overflow: hidden;
    }
  }
}

</style>
