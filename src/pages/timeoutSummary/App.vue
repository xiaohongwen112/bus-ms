<template>
  <div id="app">
    <NavBar :title="`超时率`" />
    <Breadcrumb class="bread-crumb" :title="`超时率`" :crumbList="crumbList" />
    <div class="content">
      <router-view @click="openModal"></router-view>
    </div>
    <DetailModal v-if="showModal" @close-modal="closeModal"
      :title="title"
    >
      <TimeoutSvg class="timeout-svg" :times="timeData" :size="1"/>
    </DetailModal>
  </div>
</template>
<script>
import _ from 'lodash';
import NavBar from '@/components/common/NavBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import DetailModal from '@/components/common/DetailModal';
import TimeoutSvg from '@/components/timeoutSummary/TimeoutSvg';
import 'iview/dist/styles/iview.css';
import '@/assets/css/itable.scss';
import { calcTimes } from './utils';

export default {
  name: 'app',
  components: {
    NavBar,
    Breadcrumb,
    DetailModal,
    TimeoutSvg,
  },
  data() {
    return {
      showModal: false,
      title: '',
      timeData: ['--', '--', '--', '--', '--', '--', '--', '--', '--', '--'],
    };
  },
  computed: {
    crumbList() {
      let tmpList = ['index', 'timeout', '汇总'];
      if (this.$route.name !== 'summary') {
        tmpList = ['index', 'timeout', 'summary', '单笔详情'];
        const param = window.localStorage.getItem('param');
        if (param) {
          if (_.has(JSON.parse(param), 'from')) {
            tmpList = ['index', 'timeout', '单笔详情'];
          }
        }
      }
      return tmpList;
    },
  },
  methods: {
    init() {
      this.timeData = ['--', '--', '--', '--', '--', '--', '--', '--', '--', '--'];
    },
    closeModal() {
      this.showModal = false;
    },
    openModal(val) {
      this.showModal = true;
      this.title = `${val.title}超时率`;
      this.timeData = calcTimes(val.data);
    },
  },
  mounted() {
  },
  watch: {
    /* eslint-disable no-unused-vars */
    $route(newV, oldV) {
      this.showModal = false;
    },
  },
};
</script>
<style lang="scss">
.breadcrumb-div{
  border-bottom: solid 1px #061A2A;
  .breadcrumb-ul li .crumb-now{
    color: #BEE2EB !important;
  }
}
.detail-title-div{
  .details-title{
    width: calc(100% - 60px);
  }
  .details-title-center{
    width: 0;
  }
 }

</style>
<style lang="scss" scoped>
.content{
  position: absolute;
  top: 104px;
  bottom: 10px;
  left: 35px;
  right: 10px;
}
</style>
