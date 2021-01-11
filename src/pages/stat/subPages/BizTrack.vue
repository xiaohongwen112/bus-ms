<template>
  <div class="main">
    <h6 class="title" v-show="false">业务追踪</h6>
    <TrackForm class="form-div" :formList="formData"
      @change="changeForm" @fold="foldEvent"></TrackForm>
    <div class="nav-table-wrap">
      <div class="nav-table-left">
        <DatePicker type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          :editable="false"
          :value="[this.strStart, this.strEnd]"
          @on-change="changeDate"
        ></DatePicker>
        <CmBtn @click="submitSearch">{{ isRun ? '搜索中...' : '搜索' }}</CmBtn>
      </div>
      <div class="nav-table-right">
        <span class="record-text">匹配记录</span>
        {{ count }}
        <span class="record-text">条</span>
        &nbsp;
        <Pagesize class="page-size-div" :options="[10, 20, 50, 100, 0]" v-model="currentPagesize"/>
        <CmBtn :disabled="!session$.newpermissions.trade_statistics_export || this.count === 0" @click="exportCSV">导出CSV</CmBtn>
      </div>
    </div>
    <div class="track-table-wrap">
      <StTable :cols="cols1" :rows="data1" :activeSort="activeSort" :sortabled="!isRun"
      @sort="sortTable" @click-td="routeTo"
      class="track-table" :style="{top: `${calTop}px`}"></StTable>
      <Pagination v-show="pageLength > 1 && currentPagesize > 0"
        class="page-nav"
        :total="pageLength"
        :current="current"
        @to-page="goTo"
      ></Pagination>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import { Table } from 'iview';
import DatePicker from '@/components/common/DatePickerRange';
import { mapState } from 'vuex';
import CmBtn from '@/components/common/CmBtn';
import TrackForm from '@/components/stat/TrackForm';
import Pagesize from '@/components/common/Pagesize';
import Pagination from '@/components/common/Pagination';
import ScrollBar from '@/components/common/ScrollBar';
import StTable from '@/components/stat/StTable';
import { trackInit, getTrackId, getTrackState, getTrackTable, deleteTrack, cancelTrack, exportTrack } from '../service';
import { ts2str } from '../../../helpers/utils';
import { formatTrackFormData, formatTrackTable } from '../utils';

export default {
  name: 'BizTrack',
  components: {
    DatePicker,
    TrackForm,
    'i-table': Table,
    Pagesize,
    Pagination,
    ScrollBar,
    CmBtn,
    StTable,
  },
  data() {
    return {
      strStart: '',
      strEnd: '',
      currentPagesize: 10,
      current: 1,
      formData: [], // 表单数据
      calTop: 220,
      // formQuery: {}, // 舍弃
      jobId: null,
      timer: null,
      isRun: false, // 搜索状态, true表示所搜中
      count: 0, // 匹配条数
      cols1: [],
      data1: [],
      sortOrder: 0, // 0是降序，1是升序
      activeSort: {
        key: 'duration',
        direction: 'down',
      },
    };
  },
  computed: {
    ...mapState({
      appId: 'appId',
      intfId: 'intfId',
      trackQuery: 'trackQuery',
      cacheTime: 'cacheTime',
    }),
    pageLength() {
      return Math.ceil(this.count / this.currentPagesize);
    },
  },
  methods: {
    changeDate(val) {
      this.strStart = val[0];
      this.strEnd = val[1];
    },
    changePagesize(val) {
      this.pageSize = Number(val);
      this.search();
    },
    changeSort(val) {
      console.log(val);
    },
    goTo(page) {
      this.current = page;
      if (this.isRun) {
        this.submitSearch();
      }
      this.getTableData();
    },
    submitSearch() {
      // 搜索业务追踪， 1. 搜索进行状态， 终止job-id 2. 可搜索时， 先删除job-id， 在获取新的job-id
      if (this.isRun) {
        this.isRun = false;
        cancelTrack(this.jobId).then(() => {
          this.clearTimer();
          console.log('end', this.timer);
        });
      } else {
        this.current = 1;
        if (this.jobId == null) {
          // 初始化加载
          this.getJobId();
        } else {
          deleteTrack(this.jobId).then(() => {
            this.getJobId();
          });
        }
      }
    },
    getJobId() {
      // 获取job-id
      // 需要拼接条件选项
      this.isRun = true;
      this.jobId = null;
      const query = Object.assign({
        page: 1,
        // ts_start: '2018-11-12 17:02:00',
        // ts_end: '2018-11-12 17:17:00',
        ts_start: this.strStart,
        ts_end: this.strEnd,
      }, this.trackQuery);
      // 成功：1 失败：0 进行中：进行中 超时：超时
      if (_.has(query, 'succ_count') && ['成功', '失败'].includes(query.succ_count)) {
        query.succ_count = query.succ_count === '成功' ? 1 : 0;
      }
      // true 传0
      if (_.has(query, 'resp_count')) {
        if (query.resp_count) {
          query.resp_count = 0;
        } else {
          delete query.resp_count;
        }
      }
      _.keys(query).forEach((key) => {
        if (query[key] === '') {
          delete query[key];
        }
      });
      getTrackId(this.appId, this.intfId, query).then((res) => {
        const data = res.data.data;
        this.jobId = data.transtrack_id;
        this.getStatus();
        // this.getTableData();
        const cacheTime = [moment(query.ts_start).format('X'), moment(query.ts_end).format('X')];
        this.$store.commit('SET_CACHETIME', cacheTime);
        // 循环更新状态
        this.timer = window.setInterval(() => {
          if (this.isRun) {
            this.getStatus();
          }
        }, 3000);
        console.log('start', this.timer);
      });
    },
    getStatus() {
      if (this.jobId !== null) {
        getTrackState(this.jobId).then((res) => {
          const data = res.data.data;
          this.count = data.result_count;
          this.getTableData();
          if (data.state === 'DONE') {
            this.isRun = false;
          }
        });
      }
    },
    getTableData() {
      if (this.jobId !== null) {
        const postData = {
          transtrack_id: this.jobId,
          p: this.current,
          count: this.count,
          sortOrder: this.sortOrder || 0,
          pageSize: this.currentPagesize,
          sortBy: 'duration',
        };
        getTrackTable(this.appId, this.intfId, postData).then((res) => {
          const data = res.data.data;
          // 表格
          const tableData = formatTrackTable(data, this.sortOrder === 0 ? 'down' : 'up');
          this.cols1 = tableData.cols;
          this.data1 = tableData.rows;
        });
      }
    },
    changeForm() {
      // this.formQuery = val;
    },
    foldEvent(val, len) {
      this.calTop = len;
    },
    clearTimer() {
      if (this.timer !== null) {
        clearInterval(this.timer);
      }
    },
    exportCSV() {
      const query = {
        transtrack_id: this.jobId,
        sortBy: 'duration',
        sortOrder: 0,
        count: this.count,
      };
      location.href = exportTrack(this.appId, this.intfId, query);
      console.log('export', query);
    },
    sortTable(evt) {
      // reset(this.cols1, 'sort', true);
      // set(this.cols1, evt.key, 'sort', evt.direction);
      this.sortOrder = evt.direction === 'down' ? 0 : 1;
      this.submitSearch();
    },
    routeTo(evt) {
      if (evt.type === 'click-td' && evt.key === 'critical_keyword') {
        // console.log(evt.data.critical_keyword);
        this.$router.push({ name: 'BizSingle', params: { id: evt.data.critical_keyword } });
      }
    },
    initForm() {
      // 1. 统计快照跳入
      if (this.$route.params.duration !== undefined) {
        this.setObj('duration', this.$route.params.duration);
      } else {
        this.$store.commit('resetTrackQuery');
      }
      // ================================================================
      // 3. 告警跳入(返回码+起止时间结束时间), 2. 可视化服务图台跳入(参数+时间)
      const params = JSON.parse(window.localStorage.getItem('params'));
      if (params) {
        const keys = Object.keys(params);
        if (keys.includes('ts_start')) {
          this.strStart = ts2str(params.ts_start, 'yyyy-MM-dd HH:mm:ss');
          this.strEnd = ts2str(params.ts_end, 'yyyy-MM-dd HH:mm:ss');
        }
        Object.keys(params).forEach((k) => {
          if (!['ts_start', 'ts_end'].includes(k)) {
            this.setObj(k, params[k]);
          }
        });
        window.localStorage.removeItem('params');
      } else if (this.cacheTime.length > 0) {
        this.strStart = ts2str(this.cacheTime[0], 'yyyy-MM-dd HH:mm:ss');
        this.strEnd = ts2str(this.cacheTime[1], 'yyyy-MM-dd HH:mm:ss');
      }
    },
    setObj(keyword, val) {
      this.formData = this.formData.map((d) => {
        const tmp = d;
        if (keyword === d.field_name) {
          tmp.value = val;
        }
        return d;
      });
      this.$store.commit('setTrackQuery', { key: keyword, value: val });
    },
  },
  mounted() {
    trackInit(this.appId, this.intfId).then((res) => {
      const data = res.data.data;
      // 初始化时间
      this.strStart = ts2str(data.ts_start, 'yyyy-MM-dd HH:mm:ss');
      this.strEnd = ts2str(data.ts_end, 'yyyy-MM-dd HH:mm:ss');
      // 初始化表单
      this.formData = formatTrackFormData(data);
      this.initForm();
      this.submitSearch();
    });
  },
  watch: {
    currentPagesize() {
      if (!this.isRun) {
        this.current = 1;
        this.submitSearch();
      }
    },
  },
  beforeDestroy() {
    this.clearTimer();
  },
};
</script>
<style>
.stable-tr:nth-child(7){
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.main{
  font-size: 16px;
  // padding: 0 20px 0 20px;
}
.nav-table-wrap{
  height: 48px;
  line-height: 48px;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: solid 1px #071b2d;
  text-align: left;
  div{
    display: inline-block;
  }
  .nav-table-right{
    float: right;
  }
  .record-text{
    color: #20877f;
  }
}
.tb-div{
  margin: 15px 20px;
  border: solid 1px #0a212c;
  color: #BEE2EB;
  font-size: 16px;
  .tb-thead{
    height: 34px;
    background: #0a212c;
  }
  .tb-tr{
      height: 34px;
      display: flex;
      justify-content: space-around;
      .tb-td{
      display: block;
      float: left;
      height: 34px;
      line-height: 34px;
      padding: 0 10px;
      // border: 1px solid rgba(14,47,51,0.4);
      font-weight: 300px;
    }
  }
  .no-data{
    height: 64px;
    line-height: 64px;
    text-align: center;
    background: #010c11;
    border: solid 1px #0a212c;
  }
}
.abnormal-div{
  height: 64px;
  line-height: 64px;
  background: #010c11;
}
.table-scroll{
  width: calc(100% - 40px);
  height: 200px;
  margin: 10px 20px 10px;
  overflow: auto;
  .table{
    width: 100%;
    border-spacing: 0;
    padding: 0;
    background: #010c11;
  }
  .table th, .table td{
      height: 32px;
      line-height: 32px;
      text-align: center;
      white-space: nowrap;
      border: 1px solid rgba(14,47,51,0.4);
  }
  .table th{
      background: #0a212c;
  }
  .table td{
      text-align: center;
  }
  .no-data-tr td{
    height: 64px;
    line-height: 64px;
  }
  .table a{
      text-decoration: none;
      cursor: pointer;
  }
}
.track-table-wrap{
  margin: 10px 20px 10px;
  height: calc(100% - 225px);
  .track-table{
    position: absolute;
    left: 15px;
    width: calc(100% - 20px);
    top: 220px;
    bottom: 50px;
    height: auto;
  }
}
</style>
