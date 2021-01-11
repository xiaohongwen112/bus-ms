<template>
  <div class="demo-bg">
    <div class="bar1-div">
      <CountBar :horizontalLabel="'编号'" :verticalLabel="'交易量(万笔)'"/>
    </div>
    <div class="bar2-div">
      <RateBar/>
    </div>
    <div class="bar3-div">
      <Ring/>
    </div>
    <div class="bar5-div">
      <BusinessRing :center="center"/>
    </div>
     <div class="bar4-div">
      <Ring />
    </div>
  </div>
</template>

<script>
import CountBar from '@/components/report/CountBar';
import RateBar from '@/components/report/RateBar';
import Ring from '@/components/report/Ring';
import BusinessRing from '@/components/report/BusinessRing';

export default {
  name: 'demo-div',
  components: {
    CountBar,
    RateBar,
    Ring,
    BusinessRing,
  },
  data() {
    return {
      center: {
        main: '总业务量',
        sub: '232222',
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.demo-bg{
  width: 100%;
  height: 100%;
  overflow: scroll;
  .bar1-div{
    display: inline-block;
    width: 350px;
    height: 59%;
    border: solid 1px red;
  }
  .bar2-div{
    display: inline-block;
    width: 422px;
    height: 165px;
  }
  .bar3-div{
    display: inline-block;
    width: 423px;
    height: 410px;
  }
  .bar4-div{
    display: inline-block;
    width: 45%;
    height: 410px;
  }
  .bar5-div{
    display: inline-block;
    width: 50%;
    height: 410px;
  }
}
</style>
