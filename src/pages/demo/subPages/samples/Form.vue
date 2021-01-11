<template>
  <div>
    <div class="demo">
      <AlertConfigRow :pRule="rule" @change="change" />
    </div>
    <div>
      父组件：{{ rule }}
    </div>
    <button @click="outerChange">click me!</button>
  </div>
</template>

<script>
  import AlertConfigRow from '@/components/editTopo/AlertConfigRow';

  export default {
    name: 'form-without-vuex-example',
    components: {
      AlertConfigRow,
    },
    data() {
      return {
        rule: {
          name: '健康度',
          autoBaseline: '自动基线值：40%',
          on: false,
          baseOn: true,
          values: [{
            name: 'down',
            val: 1,
            validateFn: v => v > 1,
          }, {
            name: 'up',
            val: 1,
            validateFn: v => v > 1,
          }],
          spans: ['响应时间正常值', 'ms 健康度低于', '%'],
          time: 2,
        },
      };
    },
    methods: {
      change(v) {
        console.log(v);
        this.rule = v;
      },
      outerChange() {
        this.rule.values.splice(0, 1, { ...this.rule.values[0], val: Math.floor(Math.random() * 100) });
      },
    },
  };
</script>

<style lang="scss" scoped>

.demo {
  width: 800px;
}

button {
  color: black;
}

</style>