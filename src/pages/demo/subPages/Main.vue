<template>
  <div class="main">
    <div>
      <ul>
        <li
          v-for="sample in samples"
          :key="sample.path"

        >
          <router-link :to="`/samples/${sample.path}`"> {{ sample.path }} </router-link>
        </li>
      </ul>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>

import { children } from '../router/index';

export default {
  components: {
  },
  data() {
    return {
      samples: children,
    };
  },
  methods: {
  },
  watch: {
  },
  mounted() {
  },
};

</script>

<style lang="scss" scoped>

  div.main {
    display: flex;
    flex-direction: row;
    >div:nth-of-type(1){
      min-width: 100px;
      margin-left: 10px;
    }
    >div:nth-of-type(2){
      max-width: calc(100% - 110px);
    }
  }
</style>

