<template>
  <div>
    <h3 v-if="false" v-text="'联系人管理'"></h3>
    <header>
      <SubTabs class="sub-tabs" :list="contactNavList" :active="subnavActiveIndex"
        @click="toggleNavActive"/>
    </header>
    <div class="content">
      <ContactPeople v-if="subnavActiveIndex === 0"></ContactPeople>
      <ContactGroup v-if="subnavActiveIndex === 1"></ContactGroup>
    </div>
  </div>
</template>
<script>
import { SubTabs } from '@/components/basic/index';
import { contactNavList } from '../utils';
import ContactPeople from './contact/ContactPeople';
import ContactGroup from './contact/Contactgroup';

export default {
  name: 'contact',
  components: { SubTabs, ContactPeople, ContactGroup },
  data() {
    return {
      contactNavList,
      subnavActiveIndex: 0,
    };
  },
  methods: {
    toggleNavActive(data) {
      this.subnavActiveIndex = data.index;
      // this.$router.push({ name: data.data.key });
    },
  },
};
</script>

<style>
  .content{
    height: 100%;
  }
</style>
