<template>
  <div>
    <InputFragment
      :spans="spans"
      :inputs="vals"
      :inputDisabled="false"
      @input="fn"
      @blur="zn"
    />
    <br />
    <InputFragment
      :spans="spans2"
      :inputs="vals2"
      :inputDisabled="false"
      @input="fn"
      @blur="zn"
    />
    <div>{{ vals }}</div>
    <div>{{ vals2 }}</div>
  </div>
</template>
<script>

import InputFragment from '@/components/common/InputFragment';

export default {
  name: 'form-input-fragment',
  components: {
    InputFragment,
  },
  data() {
    return {
      spans: ['响应时间正常值', 'ms 健康度低于', '%'],
      spans2: ['高于', 'ms'],
      vals: [{
        name: 'down',
        val: 1,
        validateFn: v => v > 1,
      },
      {
        name: 'up',
        val: 1,
        validateFn: v => v > 1,
      }],
      vals2: [
        {
          name: 'down',
          val: 1,
          validateFn: v => v > 1,
        },
      ],
      fn: (a, b, c) => {
        console.log(a, b, c);
      },
      zn: (a, b, c) => {
        console.log(a, b, c);
      },
    };
  },
};
</script>
<style scoped>

input {
  color: red;
}

</style>