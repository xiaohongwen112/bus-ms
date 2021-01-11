<template>
  <div>
    <area-chart :type="type"
               :id="`test`"
               :data="data"
               :xMarks="xMarks"
               :legend="legend"
               :unit="unit"
               :baseline="baseline"
    >
    </area-chart>
  </div>

</template>

<script>
  import AreaChart from '@/components/common/AreaChart/index';

  export default {
    name: 'test-area-chart',
    components: {
      AreaChart,
    },
    data() {
      return {
        type: 'area',
        data: this.getData(),
        xMarks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        legend: this.getL(),
        baseline: {
          data: [89, 10],
          legend: ['上基线', '下基线'],
          show: true,
          color: [],
          unit: ['笔'],
        },
        unit: ['笔'],
      };
    },
    mounted() {

    },
    methods: {
      getL() {
        const arr = [];
        const len = 5;
        for (let i = 0; i < len; i += 1) {
          arr.push('月亮');
        }
        return arr;
      },
      getData() {
        const arr = [];
        const len = 5;
        for (let i = 0; i < len; i += 1) {
          const tmp = [];
          for (let j = 0; j < 10; j += 1) {
            if (j === 3 || j === 5 || j === 7 || j === 8 || j === 9) {
              tmp.push(null);
            } else {
              tmp.push(Math.floor(Math.random() * 100));
            }
          }
          arr.push(tmp);
        }
        return arr;
      },
    },
  };
</script>
<style scoped>
  div {
    position: absolute;
    top: 20px;
    left:200px;
    bottom:40px;
    right: 20px;
  }
</style>
