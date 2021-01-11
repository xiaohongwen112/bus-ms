<template>
  <div class="tabs">
    <ScrollBar class="scroll-area">
      <router-link v-for="(item, index) in tabList"
          :key="item.id"
          :id="item.id"
          class="tabBg"
          :to="routerTo(index)">
          <div class="active-bg">
            <img :src="require(`../../assets/stat/${item.id}.svg`)"
                alt="努力加载中">
            <div class="tab_title">{{ item.text }}</div>
          </div>
      </router-link>
    </ScrollBar>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import ScrollBar from '@/components/common/ScrollBar';

  export default {
    name: 'StatTabs',
    components: {
      ScrollBar,
    },
    data() {
      return {
        statNavList: [{
          id: 'biz_chart',
          text: '交易统计',
          to: 'BizChart',
        },
        {
          id: 'biz_snapshot',
          text: '统计快照',
          to: 'BizSnapshot',
        },
        {
          id: 'biz_time_trade',
          text: '分时交易',
          to: 'BizTime',
        },
        {
          id: 'biz_multi_dimension',
          text: '多维统计',
          to: 'BizMulti',
        }, {
          id: 'biz_trans_track',
          text: '业务追踪',
          to: 'BizTrack',
        }, {
          id: 'biz_trans_single',
          text: '单笔详情',
          to: 'BizSingle',
        }],
      };
    },
    computed: {
      ...mapState({
        currentIp: state => state.currentIp,
      }),
      tabList() {
        return this.currentIp === '' ? this.statNavList : this.statNavList.slice(0, 2);
      },
    },
    methods: {
      routerTo(index) { // 终止业务追踪、单笔、搜索
        return this.tabList[index].to;
      },
    },
  };
</script>
<style lang="scss" scoped>

  .tabs{
    width: 107px;
    height: 100%;
    .router-link-active .active-bg{
      background: url(../../assets/stat/stat_select.png) no-repeat;
      background-origin: initial;
      background-size: 178% 153%;
      background-position: -39px;
    }
  }
  .scroll-area{
    // width: 100%;
    height: 100%;
  }
  .tabBg {
    display: block;
    width: 98px;
    height: 108px;
    background: url(../../assets/stat/statBgTwo.svg) no-repeat;
    color: #eee;
    font-size: 14px;
    cursor: pointer;
    span{
      display: inline-block;
      width: 100%;
    }
    
    img {
      width: 50px;
      margin-top: 15px;
    }
    .tab_title{
      padding: 5px;
    }
  }
  .tabBg:first-child{
    background: url(../../assets/stat/statBgOne.svg) no-repeat;
  }
  .tabBg:last-child{
    background: url(../../assets/stat/statBgThr.svg) no-repeat;
  }
  .tabBg:hover{
    background: url(../../assets/stat/statBgHover2.svg) no-repeat;
  }
  .tabBg:first-child:hover{
    background: url(../../assets/stat/statBgHover1.svg) no-repeat;
  }
  .tabBg:last-child:hover{
    background: url(../../assets/stat/statBgHover3.svg) no-repeat;
  }

</style>
