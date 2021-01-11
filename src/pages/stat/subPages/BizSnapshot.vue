<template>
  <div class="main">
    <h6 class="title">统计快照</h6>
    <div class="snap-search color-bottom">
      <SearchBar :panel="`biz_overview_snapshot`"
        :isStep="false" :currentTime="session$.ts"
        @search="submitSearch"></SearchBar>
    </div>
    <ul class="snap-data color-bottom">
      <li v-for="(item, index) in getTrade" :key="index">
        <router-link v-if="isLinktoTrack(index)" :to="routerTo">
          <sawtooth-circle class="circle-svg" :data="item"></sawtooth-circle>
        </router-link>
        <sawtooth-circle class="circle-svg"
          v-if="!isLinktoTrack(index)"
          :data="item"></sawtooth-circle>
      </li>
    </ul>
    <div class="snap-table">
      <div class="table-div">
        <div class="table-title">{{ dimTransName }}排名-按响应时间</div>
        <StTable class="tb-left" :cols="cols1" :rows="tb1tbody"></StTable>
      </div>
      <div class="table-div">
        <div class="table-title">返回码排名-按交易量</div>
        <StTable class="tb-right" :cols="cols2" :rows="tb2tbody"></StTable>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ScrollBar from '@/components/common/ScrollBar';
import SawtoothCircle from '@/components/stat/SawtoothCircle';
import SearchBar from '@/components/stat/SearchBar';
import StTable from '@/components/stat/StTable';
import { msgTypeCols, returnCodeCols } from '../utils';

export default {
  name: 'BizSnapshot',
  components: {
    ScrollBar,
    SawtoothCircle,
    SearchBar,
    StTable,
  },
  data() {
    return {
      cols1: msgTypeCols,
      cols2: returnCodeCols,
      dimTransName: '',
    };
  },
  computed: {
    ...mapState({
      appId: state => state.appId,
      intfId: state => state.intfId,
      tsStart: state => state.panel.tsStart,
      tsEnd: state => state.panel.tsEnd,
      getTrade: state => state.snap.tradeList,
      tb1tbody: state => state.snap.respTimeList,
      tb2tbody: state => state.snap.tradeVol,
      currentIp: state => state.currentIp,
      // dimTransName: state => state.panel.selectList[0].disp_name,
    }),
    routerTo() {
      let routerObj = {};
      const snap = this.$store.state.snap;
      // routerObj = { name: 'BizTrack', params: { durationGte: snap.durationGte, durationLt: snap.durationLt } };
      // 开始时间向下取, 结束时间向上取
      routerObj = {
        name: 'BizTrack',
        params: {
          duration: [Math.floor(snap.durationGte), Math.ceil(snap.durationLt)],
        },
      };
      return routerObj;
    },
  },
  methods: {
    isLinktoTrack(index) {
      let flag = false;
      if (index === 3 && this.getTrade[index].digit !== '--' && this.currentIp.length === 0) {
        flag = true;
      }
      return flag;
    },
    submitSearch(val) {
      const req = val;
      req.type = 'biz_overview_snapshot';
      req.isFirst = true;
      this.$store.dispatch('submitPanel', req);
    },
  },
  mounted() {
    this.dimTransName = this.$store.state.panel.selectList[0].disp_name;
  },
};
</script>

<style lang="scss" scoped>
.title{
  display: none;
}

.color-bottom{
  border-bottom: solid 1px #071b2d;
}

.main{
  width: 100%;
  height: 100%;
}

.snap-search{
  height: 57px;
  padding-left: 5px;
}

.snap-data{
  display: block;
  height: 200px;
  padding: 10px 10px;
  li{
    display: inline-block;
    width: calc(20% - 2px);
  }
}

.snap-table{
  height: calc(100% - 278px);
  .table-div{
    float: left;
    width: 50%;
    height: 100%;
    padding-left: 20px; 
  }
  .table-title{
    text-align: left;
    color: #12c3b6;
    line-height: 60px;
    font-size: 20px;
  }
  .tb-left{
    position: absolute;
    left: 15px;
    width: calc(50% - 20px);
    top: 320px;
    bottom: 10px;
    height: auto;
  }
  .tb-right{
    position: absolute;
    right: 5px;
    width: calc(50% - 20px);
    top: 320px;
    bottom: 10px;
    height: auto;
  }
}

</style>
