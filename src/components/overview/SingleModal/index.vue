<template>
  <div :class="{'node-details-div': true, 'details-max': isMax}">
    <div class="detail-title-div">
      {{ intfName }} 详情
      <img class="details-toggle-btn"
           :src="require(`@/assets/sys-icon/toggleClose.svg`)"
           @click="handleClose"/>
      <img class="details-toggle-btn" v-if="!isMax"
           :src="require(`@/assets/sys-icon/toggleMax.svg`)"
           @click="handleToggle"/>
    </div>
    <div class="detail-content-div">
      <div class="details-left-div">
        <ul>
          <li :class="{'details-btn': true, 'active': nav.code === navActive}" v-for="(nav, index) in navList"
              :key="`nav${nav.code}`" @click="toggleNav(nav.code)">
            <div>
              <p class="nav-name">{{ nav.name }}</p>
              <p class="nav-error" v-if="index === 0">正常:{{ server_succ_count }} 异常:{{ server_err_count }}</p>
              <p class="nav-error" v-if="index === 2">正常:0 异常：0</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="details-right-div">
        <ScrollBar class="scroll-area" v-if="navActive === `singleServer`">
          <SingleCard v-for="(card, index) in single_data" :key="`card${index}`" :sequence="index" :data="card"/>
        </ScrollBar>
        <DeviceAnalyze v-else-if="navActive === `clientStat`"/>
        <div class="position-error-div" v-else-if="navActive === `positionError`">
          <FailureAnalysis :page="page" :pageSize="pageSize" :data="analysisData" :params="params" :noSettingFlag="noSettingFlag" :total="total" @turn-page="turnPage"/>
        </div>
        <div v-show="noData" class="details-empty"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { getServerData, alertLocated } from '@/pages/overview/service';
import { formatSingle } from '@/pages/overview/utils';
import { mapState } from 'vuex';
import ScrollBar from '@/components/common/ScrollBar';
import FailureAnalysis from '@/components/alert/FailureAnalysis';
import SingleCard from './SingleCard';
import DeviceAnalyze from './DeviceAnalyze';

export default {
  name: 'SingleModal',
  components: {
    ScrollBar,
    SingleCard,
    DeviceAnalyze,
    FailureAnalysis,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      isMax: false,
      normal: 0, // ccpc接口提供
      error: 0,
      // navList: [{ code: 'singleServer', name: '单台服务器' }, { code: 'positionError', name: '故障根源定位' }, { code: 'clientStat', name: '客户端统计' }],
      navList: [{ code: 'singleServer', name: '单台服务器' }, { code: 'positionError', name: '故障根源定位' }],
      navActive: 'singleServer',
      server_err_count: 0,
      server_succ_count: 0,
      single_data: [],
      noData: false,
      page: 1,
      pageSize: 15,
      total: 1,
      analysisData: [],
      params: {},
      noSettingFlag: false,
    };
  },
  computed: {
    ...mapState({
      appId: 'appId',
      intfId: 'intfId',
      intfName: 'intfName',
      duration: 'duration',
      ts: 'ts',
      newTs: 'newTs',
    }),
    postData() {
      return {
        app_name: this.appId,
        intf_name: this.intfId,
        ts: this.ts !== null ? this.ts : this.newTs,
        page: this.page,
        page_size: this.pageSize,
      };
    },
  },
  methods: {
    turnPage(page) {
      this.page = page;
    },
    handleToggle() {
      this.isMax = !this.isMax;
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    handleClose() {
      this.$emit('close-modal', '');
      this.$store.commit('setDialog', null);
    },
    toggleNav(code) {
      if (this.navActive !== code) {
        this.navActive = code;
      }
    },
    async getLocatedData() {
      try {
        this.noSettingFlag = false;
        const res = await alertLocated(this.postData);
        if (res.data.code === 0) {
          const data = res.data.data;
          this.analysisData = this.dealData(data.list);
          this.total = data.total;
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
      if (data.length < 14) {
        list.push({});
        this.dealData(list);
      }
      return list;
    },
    init() {
      // 单台服务器
      getServerData(this.appId, this.intfId, { ts: this.ts }).then((res) => {
        const data = res.data.data;
        // this.server_succ_count = data.server_succ_count;
        // this.server_err_count = data.server_err_count;
        // this.single_data = data.device_info;
        [this.server_succ_count, this.server_err_count, this.single_data] = formatSingle(data);
      });
      // 根源定位
      this.getLocatedData();
    },
    onDetail() {
      this.showFailure = false;
    },
  },
  mounted() {
    this.params = {
      app: this.appId,
      time: this.ts !== null ? this.ts : this.newTs,
      duration: [this.duration, ''],
      alarmNode: this.intfName,
    };
    this.init();
  },
  watch: {
    navActive() {
      this.noData = false;
      this.showFailure = true;
    },
    intfId() {
      this.init();
    },
    newTs() {
      this.init();
    },
    ts() { // 相比其他弹窗， 可历史回溯
      this.init();
    },
    page(newVal) {
      this.postData.page = newVal;
      this.getLocatedData();
    },
  },
};
</script>
<style lang="scss">
  .position-error-div{
    .failure-analysis{
      .scroll-area{
        .common-table{
          .table-title{
            background-color: #0a1833;
            tr{
              td{
                &:nth-of-type(1){
                  border-left: 1px solid #192942;
                }
                border-right: 1px solid #192942;
              }
            }
          }
          .common-table-tbody{
            .table-body{
              tr{
                background-color: #192942;
                &.active{
                  background-color: #344561 !important;
                }
                td{
                  &:nth-of-type(1){
                    border-left: 1px solid #0a1833;
                  }
                  border-right: 1px solid #0a1833;
                  border-bottom: 1px solid #0a1833;
                }
              }
            }
          }
        }
      }
      .pagination{
        bottom: 0px;
        li {
          height: 28px;
          line-height: 28px;
        }
      }
    }
  }
// 覆盖组件样式
.failure-analysis{
  top: 56px;
  left: 310px;
  right: 0;
  .common-table{
    width: 100%;
    .common-table-tbody table{
      color: #fff;
      padding: 0;
      font-size: 14px;
    }
  }
}

.position-error-div .position-detail-div{
  top: 56px;
  left: 310px;
  right: 0;
  width: calc(100% - 310px) !important;
  .scroll-area{
    height: 100%;
  }
  .pagination {
    position: absolute;
    bottom: 10px;
  }
  table{
    td{
      color: #fff;
      padding: 0;
      font-size: 14px;
    }
  }
}
</style>
<style lang="scss" scoped>
.position-error-div{
  .failure-analysis {
    top: 42px;
    left: 314px;
    width: calc(100% - 318px);
    height: calc(100% - 45px);
    background-color: #192942;
  }
}
.node-details-div{
    z-index: 1;
    position: absolute;
    top: 45%;
    bottom: 60px;
    left: 0;
    right: 0;
    background: #192942;
}
.node-details-group{
    bottom: 0!important;
}
.details-max{
    top: 0;
}
.detail-title-div {
    height: 38px;
    line-height: 38px;
    width: 100%;
    background: url(../../../assets/overview/details-title-bg.png) no-repeat;
    background-size: 500px 56px;
    border-bottom: 1px solid #000;
    font-size: 20px;
    padding-left: 10px;
}
.detail-content-div{
    width: 100%;
    height: calc(100% - 38px);
    overflow: hidden;
}
// .details-title{
//     // width: 440px;
//     font-size: 24px;
//     padding-left: 10px;
// }
.details-title-center{
    width: calc(85% - 504px);
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
}
.details-right{
    margin-right: 20px;
}
.details-toggle-btn{
    margin-right: 5px;
    width: 30px;
    height: 30px;
    float: right;
    padding-top: 5.5px;
    cursor: pointer;
}
.details-left-div, .details-right-div{
    float: left;
}
.details-left-div{
    width: 310px;
    height: 100%;
    background: #0c0c2c;
    color: #6bd5d1;
    position: relative;
}
.details-left-div ul{
    width: 100%;
    height: 100%;
}
.details-left-div ul li{
    // height: 33.3%;
    height: 50%;
    width: 100%;
    border-bottom: 1px solid #3e7a7c;
    cursor: pointer;
    text-align: center;
    font-size: 24px;
    // max-height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    p{
      margin: 0;
    }
    .nav-error{
      color: #fff;
      font-size: 12px;
    }
}

.active{
    background: linear-gradient(to right, rgba(13, 23, 52,1) 0%, rgba(22, 60, 99,1) 40%,  rgba(22, 60, 99,1) 60%, rgba(13, 23, 52,.9) 100%)
}
.details-arrow{
    position: absolute;
    width: 0;
    height: 0;
    border-top: 28px solid transparent;
    border-bottom: 28px solid transparent;
    border-left: 46px solid #0c0c2c;
    left: 310px;
    top: 62px;
}

.details-right-div{
    width: calc(100% - 310px);
    height: 100%;
    overflow: auto;
}

.hide-div{
    display: none;
}

.details-hidden{
    visibility: hidden;
    position: absolute;
}

.ccpc-card {
    position: relative;
    margin: 25px 22px;
}
.ccpc-show-title{
    width: 214px;
    box-shadow: 2px 3px 5px #000;
    padding-left: 12px;
    border-radius: 1px;
    border-top-left-radius: 2px;
    background: linear-gradient(to right, #184161 0%, #1e69a0 100%);
    height: 30px;
    line-height: 30px;
    margin-top: 8px;
}
.ccpc-card-content{
    width: 206px;
    height: 148px;
    box-shadow: 2px 5px 10px #000;
    border-radius: 2px;
    border-top-right-radius: 30px;
    border-bottom-left-radius: 30px;
}
.ccpc-card-top{
    background: #0e344e;
    height: calc(100% - 54px);
    display: flex;
    border-radius: 2px;
    border-top-right-radius: 30px;
}
.ccpc-card-bottom{
    background: #082639;
    height: 54px;
    border-top: 1px solid #061b29;
    border-radius: 2px;
    border-bottom-left-radius: 30px;
}
.ccpc-card-name{
    width: 174px;
    height: 30px;
    line-height: 30px;
    margin-left: -10px;
    margin-top: 8px;
    position: absolute;
    box-shadow: 2px 3px 5px #000;
    padding-left: 12px;
    border-radius: 1px;
    border-top-left-radius: 2px;
    background: linear-gradient(to right, #184161 0%, #1e69a0 100%);
}
.ccpc-top-content{
    margin-top: 40px;
    width: 50%;
    text-align: center;
}
.ccpc-quota-name{
    color: #8a8585;
}
.content-wrap{
   width: 100%;
  height: 100%;
}
.scroll-area {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.device-card{
  margin: 20px;
}
.position-error-div{
  width: 100%;
}
.details-empty{
    position: absolute;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: url(../../../assets/overview/details-empty.png);
    background-repeat: no-repeat;
    background-size: 20%;
    background-position: 40%;
}
</style>

