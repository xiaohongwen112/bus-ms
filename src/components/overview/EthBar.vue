<template>
  <g>
    <rect x="333.5" y="83.5" width="149" height="5" class="eth_bar_bg"></rect>
    <rect x="333.5" y="83.5" :width="`${eth_per * 1.49}`" height="5" class="eth_bar" :fill="ethColor"></rect>
  </g>
</template>
<script>
  export default {
    name: 'EthBar',
    props: {
      intf_eth_name: {
        type: String,
        default: '--',
      },
      intf_eth: {
        type: Number,
        default: 0,
      },
      intf_max_eth: {
        type: Number,
        default: 0,
      },
      eth_per: {
        type: Number,
        default: 50,
      },
    },
    computed: {
      ethColor() {
        const ethPer = this.eth_per;
        if (ethPer === 0) {
          return '#112F46';
        } else if (ethPer < 41) {
          return '#d95151';
        } else if (ethPer < 61) {
          return '#d88745';
        }
        return '#32DC2A';
      },
    },
  };
</script>
<style scoped>
    /* 本地样式 */
    .eth_bar_bg{
      fill: #112F46;
    }

    /*.eth_bar{*/
      /*fill: #3EC174;*/
    /*}*/
</style>
