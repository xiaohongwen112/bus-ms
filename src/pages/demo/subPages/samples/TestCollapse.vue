<template>

  <div>
    <a @click="toggleAccordion">toggle accordion</a>
    <Collapse @change="onChange" :accordion="accordion">
      <CollapseItem title="item 1" name="item-a">
        <h1>Item1</h1>
      </CollapseItem>
      <CollapseItem title="item 2" name="item-b">
        <p>Item2</p>
      </CollapseItem>
      <CollapseItem title="item 3" name="item-c">
        <p>Item3</p>
      </CollapseItem>
    </Collapse>
  </div>
  
</template>
<script>

import Collapse from '@/components/common/Collapse';
import CollapseItem from '@/components/common/CollapseItem';


export default {
  name: 'collapse',
  components: {
    Collapse,
    CollapseItem,
  },
  data() {
    return {
      accordion: true,
    };
  },
  methods: {
    onChange(e) {
      console.log('active', e);
    },
    toggleAccordion() {
      this.accordion = !this.accordion;
    },
  },
};
</script>
<style scoped>

</style>