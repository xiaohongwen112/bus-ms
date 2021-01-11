<template>
  <div>
    <div class="main-tit">
      <NavBar :title="'overview'" :appName="appId"></NavBar>
    </div>
    <Breadcrumb :title="'可视化服务图'" :crumbList="crumbList" :appName="appId"></Breadcrumb>
    <div class="svg-div">
      <NodeFlowSvg v-if="JSON.stringify(this.viewData) !== '{}'"
                    :activeId="activeId"
                    :viewData="viewData"
                    @open-modal="openModal"
                    @open-alert="openAlert"
      />
    </div>
    <div class="time-axis-div">
      <TimeAxisPicker
        :data="timelineData"
        :currentTime="currentTime"
        :currentTs="ts !== null ? parseInt(ts, 10) : 0"
        @timeChange="changeTimeAxis"/>
    </div>
    <SingleModal class="modal-div"
                  v-if="['singleserver', 'faultsrc', 'client'].includes(dialog)"
                  :id="activeId"
                  :title="`${appDispName}-${intfDispName}`"
                  :data="viewData"
                  @close-modal="closeModal"/>
    <GroupModal v-if="dialog === 'childtopo'"
                :data="groupData"
                @open-modal="openModal"
                @close-container="closeModal"
    />
    <AlertModal v-if="dialog === 'alertlist'"
                @close-alert="closeAlert"
    />
  </div>
</template>
<script>
  import _ from 'lodash';
  import moment from 'moment';
  import { mapState } from 'vuex';
  import NavBar from '@/components/common/NavBar';
  import Breadcrumb from '@/components/common/Breadcrumb';
  import TimeAxisPicker from '@/components/common/TimeAxisPicker';
  import NodeFlowSvg from '@/components/overview/NodeFlowSvg';
  import SingleModal from '@/components/overview/SingleModal';
  import GroupModal from '@/components/overview/GroupModal';
  import AlertModal from '@/components/overview/AlertModal';
  // import { getNewOverview, getWorkTime } from '@/pages/overview/service';
  import { getNewOverview } from '@/pages/overview/service';
  import { getSysTime, getTimeLineData } from '@/pages/areaMonitor/service';
  import { dealData, dealGroupData } from '../utils';
  // import { dealGroupData } from '../utils';

  export default {
    name: 'Overview',
    components: {
      NavBar,
      Breadcrumb,
      TimeAxisPicker,
      NodeFlowSvg,
      SingleModal,
      GroupModal,
      AlertModal,
    },
    data() {
      return {
        appDispName: '',
        intfDispName: '',
        workTimeData: {},
        rootData: {}, // 原始数据
        viewData: {},
        showModal: '', // single|group
        showContainer: false,
        showAlert: false,
        activeId: '',
        activeGroup: '',
        timelineData: {},
        currentTime: '',
      };
    },
    computed: {
      ...mapState({
        appId: 'appId',
        dialog: 'dialog',
        ts: 'ts',
        newTs: 'newTs',
      }),
      crumbList() { return ['index', 'manageapp', '可视化服务图', this.appDispName]; },

      groupData() {
        const tmpObject = {};
        _.keys(this.viewData.groups).forEach((key) => {
          const d = this.viewData.groups[key];
          if (d.groupId === this.activeGroup) {
            tmpObject.name = d.name;
            tmpObject.id = d.id;
          }
        });
        const groupNodesData = dealGroupData(tmpObject.id, _.cloneDeep(this.viewData.groups), _.cloneDeep(this.viewData.nodes));
        return Object.assign(tmpObject, groupNodesData);
      },
    },
    methods: {
      async getSysTime() {
        try {
          const res = await getSysTime();
          if (res.data.code === 0) {
            // this.currentTime = res.data.data.systime;
            const time = moment(res.data.data.systime).format('X') - 120;
            this.currentTime = moment.unix(time).format('YYYY-MM-DD HH:mm:ss');
          }
        } catch (e) {
          console.error(e);
        }
      },
      updateData() {
        // getWorkTime(this.appId).then((response) => {
          // this.workTimeData = response.data.data.result;
        getNewOverview(this.appId, {
          ts: this.ts === null ? this.newTs : this.ts,
        }).then((viewRes) => {
          const resData = viewRes.data.data;
          this.rootData = resData;
          this.viewData = dealData(resData);
          this.appDispName = resData.overview_stats.datapath.disp_name;
        }).catch();
        // }).catch();
      },
      updateTime() {
        getTimeLineData(this.appId, this.ts).then((response) => {
          this.getSysTime();
          this.timelineData = response.data.data;
          this.updateData();
        }).catch();
      },
      openModal(val) {
        // console.log(val);
        this.showModal = val.type;
        if (val.type === 'single') {
          this.activeId = val.id;
        } else {
          this.activeGroup = val.id;
        }
      },
      closeModal() {
        if (this.showModal === 'single') {
          this.activeId = '';
        } else {
          this.activeGroup = '';
        }
        this.showModal = '';
      },
      openAlert() {
        this.showAlert = true;
      },
      closeAlert() {
        this.showAlert = false;
      },
      changeTimeAxis(ts) {
        this.$store.commit('setTs', ts.ts);
        this.updateTime();
      },
    },
    mounted() {
      // 2. 点击时间轴后固定显示此刻
      // getTimeLineData(this.appId).then((response) => {
      //   this.getSysTime();
      //   this.timelineData = response.data.data;
      // }).catch();
    },
    watch: {
      newTs() {
        // 1. 每分钟全部更新
        this.updateTime();
      },
    },
    updated() {
      const oldTs = this.ts;
      if (this.ts !== null && this.ts !== oldTs) this.updateTime();
    },
  };
</script>
<style lang="scss" scoped>
  .main-tit{
    width: 100%;
    height: 44px;
    line-height: 44px;
    border-bottom: solid 1px #14446A;
    background: #050c12;
    color: #B9CFE1;
  }
  .svg-div{
    position: absolute;
    top: 94px;
    bottom: 60px;
    left: 0;
    right: 0;
    background: #09131C;
    color: #fff;
  }
  .time-axis-div{
    position: absolute;
    top: calc(100% - 60px);
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
