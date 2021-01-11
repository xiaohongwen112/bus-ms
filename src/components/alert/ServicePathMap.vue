<template>
  <div class="service-path-map" :class="{down:down}" v-show="showMap">
    <div class="modal-head">
      <div class="alarmTitle">
        <div><span>告警节点：</span>{{item.alarmNode}}</div>
        <div><span>告警事件：</span>{{item.alarmEvent}}</div>
      </div>
      <div class="pop-close" @click="closeMap"></div>
      <a class="to-topo-div" @click="toTopo()">完整拓扑图</a>
    </div>
    <div class="svg-container" id="svg-container">
      <LitePathMap :appName="item.app" :activeList="activeList" :path="path" :current="item.alarmNode"></LitePathMap>
    </div>
    <FailureAnalysis :page="page" :pageSize="pageSize" :data="analysisData" :params="params" :noSettingFlag="noSettingFlag" :total="total" @onClickRow="clickRow" @turn-page="turnPage"></FailureAnalysis>
  </div>
</template>

<script>
  import { alertLocated } from '@/pages/alert/service';
  import { setLocalStorage } from '@/helpers/utils';
  import { mapState } from 'vuex';
  import bus from '../../helpers/bus';
  import FailureAnalysis from './FailureAnalysis';
  import LitePathMap from './LitePathMap';

  export default{
    name: 'ServicePathMap',
    components: { FailureAnalysis, LitePathMap },
    props: {
      showMap: { type: Boolean, isRequired: true }, // 是否显示,
      item: {
        type: Object,
        default() {
          return {
            app: '',
            time: '',
            alarmNode: '',
            alarmEvent: '',
          };
        },
      }, // 跳转完整拓扑图所需参数
      params: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    watch: {
      showMap(newVal, oldVal) {
        if (newVal === false && oldVal === true) {
          this.returnInitial();
        }
        if (newVal === true && oldVal === false) {
          this.getLocatedData();
        }
      },
      page(newVal) {
        this.postData.page = newVal;
        this.getLocatedData();
      },
    },
    data() {
      return {
        down: false,
        allowClick: false, // 是否可点击
        exHeight: document.body.clientHeight * 0.44,
        analysisData: [],
        currentRow: 0,
        activeList: [],
        path: [],
        page: 1,
        pageSize: 8,
        total: 1,
        noSettingFlag: false,
      };
    },
    methods: {
      toTopo() {
        const params = {
          ts_start: this.item.time,
        };
        setLocalStorage('params', JSON.stringify(params));
        window.location.href = `/zh-cn/overview/${this.item.app}/`;
      },
      turnPage(page) {
        this.page = page;
      },
      clickRow(param) {
        this.currentRow = param.i;
        this.dealMapData();
      },
      async getLocatedData() {
        try {
          const res = await alertLocated(this.postData);
          if (res.data.code === 0) {
            const data = res.data.data;
            this.total = data.total;
            this.analysisData = this.dealData(data.list);
            this.dealMapData();
          } else {
            this.analysisData = [];
            if (res.data.code === -100) this.noSettingFlag = true;
          }
        } catch (e) {
          console.log(e);
        }
      },
      dealData(data) {
        const list = data;
        if (this.total < 10 && data.length < 10) {
          list.push({});
          this.dealData(list);
        }
        return list;
      },
      dealMapData() {
        this.analysisData[this.currentRow].nodes.forEach((item, index) => {
          this.analysisData[this.currentRow].nodes[index].location = this.analysisData[this.currentRow].alert[item.intf_name];
        });
        this.activeList = this.analysisData[this.currentRow].nodes;
        this.path = this.analysisData[this.currentRow].path;
      },
      closeMap() {
        this.$emit('on-closemap');
      },
      returnInitial() {
        bus.$emit('returnInitial', event);
      },
    },
    computed: {
      ...mapState({
        viewData: state => state.overview,
      }),
      postData() {
        return {
          app_name: this.item.app,
          intf_name: this.item.intf,
          ts: this.item.time,
          page: this.page,
          page_size: this.pageSize,
        };
      },
    },
    created() {
      this.getLocatedData();
    },
  };
</script>

<style lang="scss">
  .service-path-map{
    .pagination{
      bottom: 1px;
      ul{
        li{
          height: 28px;
          line-height: 28px;
        }
      }
    }
    .each-detail{
      .scroll-area{
        height: 253px;
      }
      .pagination{
        padding-top: 4px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .service-path-map{
    position: fixed;
    width: 100%;
    height: 70%;
    min-height: 500px;
    z-index: 3;
    background: rgb(1, 1, 1);
    border-bottom: 3px solid #1b3946;
    bottom: 0;
    &.down{
      bottom: 0;
      height: 44%;
      border-top: 3px solid #1b3946;
      border-bottom: none;
      top: auto;
    }
    .modal-head{
      width: 100%;
      height:54px;
      border-top:1px solid #11232b;
      border-bottom:1px solid #11232b;
      box-sizing:border-box;
      .alarmTitle{
        display:inline-block;
        height:54px;
        line-height:54px;
        font-size:16px;
        padding: 0 10px;
        >div{
          display: inline-block;
          color:#fff;
          &:nth-of-type(2){
            margin-left:10px;
          }
          >span{
            color:#ccc;
          }
        }
      }
      .return-superior{
        position: absolute;
        right: 190px;
        top: 13px;
        width: 100px;
        height:30px;
        line-height:30px;
        font-size: 12px;
        color:#020305;
        text-align:center;
        border-radius:25px;
        background-color:#00bb9c;
        cursor:pointer;
      }
      .to-topo-div{
        position: absolute;
        right: 75px;
        top: 13px;
        width: 100px;
        height: 30px;
        line-height: 28px;
        font-size:12px;
        color:#00bb9c;
        cursor: pointer;
        box-sizing:border-box;
        text-align: center;
        border:1px solid #00bb9c;
        border-radius:25px;
      }
      .pop-close{
        position: absolute;
        width: 45px;
        height: 30px;
        right: 20px;
        top: 13px;
        cursor: pointer;
        text-align: center;
        background: url(../../assets/alert/close.svg) no-repeat center;
        background-size: contain;
      }
      .return-initial{
        position: absolute;
        right: 35px;
        top: 59px;
        width:46px;
        height:40px;
        background: url(../../assets/alert/return.svg) no-repeat center;
        cursor:pointer;
      }
      .popToggle{
        position: absolute;
        width: 40px;
        height: 40px;
        left: calc(50% - 20px);
        bottom: -20px;
        text-align: center;
        cursor: pointer;
        background: url(../../assets/alert/down.svg) no-repeat center;
        background-size: contain;
        &.pop-down{
          background: url(../../assets/alert/up.svg) no-repeat center;
          top:-20px;
        }
      }
      .map-container{
        width:100%;
        height:100%;
        overflow:hidden;
      }
    }
    .svg-container{
      height: calc(100% - 350px);
      border-bottom: 1px solid #11232b;
    }
    .failure-analysis{
      min-height: 293px;
    }
    .each-detail{
      height: 293px;
    }
  }
</style>