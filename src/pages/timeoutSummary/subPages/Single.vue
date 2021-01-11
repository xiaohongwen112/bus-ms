<template>
  <div>
    <Pagesize class="page-size-div" :options="[10, 20]" v-model="currentPagesize"/>
      <i-table class="single-table cm-stripe" border
      :row-class-name="rowClassName"
      :columns="columns1" :data="data1"
      @on-row-click="singleModal"/>
    <Pagination v-show="this.total > 1"
      :total="total"
      :current="currentPageNumber"
      @to-page="goTo"
    />
  </div>
</template>
<script>
import _ from 'lodash';

import { Table } from 'iview';
// import Mock from 'mockjs';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import Pagination from '@/components/common/Pagination';
import Pagesize from '@/components/common/Pagesize';
import { ts2str } from '@/helpers/utils';
import { getTimout } from '../service';

export default {
  name: 'Single',
  components: {
    'i-table': Table,
    Pagination,
    Pagesize,
  },
  data() {
    return {
      data1: [],
      activeRow: null,
      total: 0,
      currentPageNumber: 1,
      currentPagesize: 10,
      query: {},
      bar: null,
    };
  },
  computed: {
    columns1() {
      return [{
        title: '序号',
        type: 'index',
        width: 55,
        align: 'center',
      }, {
        title: '报文标识号', // 交易关键字
        key: 'trans_key',
        width: 200,
      }, {
        title: '接收参与者',
        key: 'receive_name',
        width: 260,
        // ellipsis: true,
      }, {
        title: '接收行号',
        key: 'receive_id',
        width: 130,
      }, {
        title: '发起参与者',
        key: 'send_name',
        width: 260,
        // ellipsis: true,
      }, {
        title: '发起行号',
        key: 'send_id',
        width: 130,
      }, {
        title: '所属CCPC',
        key: 'ccpc_name',
        width: 260,
        // ellipsis: true,
      }, {
        title: '响应时间(ms)',
        key: 'duration',
        width: 120,
        render: (h, params) => h('span', {
          domProps: {
            innerText: this.getFloor(params.row.duration),
          },
        }),
      }, {
        title: '业务类型',
        key: 'business_type',
        width: 120,
      }, {
        title: '业务发生时间(101)',
        key: 'send_time',
        width: 230,
        render: (h, params) => h('span', {
          domProps: {
            innerText: ts2str(params.row.send_time, 'yyyy-MM-dd HH:mm:ss.dddddd'),
          },
        }),
      }];
    },
  },
  methods: {
    onResize() {
      const ele = document.getElementsByClassName('ivu-table-body')[0];
      // const headerH = document.getElementsByClassName('ivu-table-header')[0].getBoundingClientRect().height;
      const pageH = this.total > 1 ? 60 : 0;
      const tmpH = document.getElementsByClassName('content')[0].getBoundingClientRect().height - 65 - pageH;
      if (tmpH && ele) {
        ele.style.height = `${tmpH}px`;
      }
      this.getWidth();
      if (this.bar) {
        this.bar.update();
      }
    },
    getWidth() {
      const width = document.getElementsByClassName('content')[0].getBoundingClientRect().width;
      if (width > 1740) {
        this.columns1[2] = (width - 985) / 3;
        this.columns1[4] = (width - 985) / 3;
        this.columns1[6] = (width - 985) / 3;
      }
    },
    singleModal(current, index) {
      this.activeRow = index;
      this.$emit('click', {
        title: current.receive_name,
        id: current.trans_key,
        data: current.start_detail,
      });
    },
    /* eslint-disable consistent-return */
    rowClassName(row, index) {
      if (this.activeRow === index) {
        return 'ivu-table-row-active';
      }
    },
    goTo(page) {
      this.currentPageNumber = page;
      this.postData();
    },
    postData() {
      // 获取query
      const path = this.$route.path;
      this.query = {
        numbers: this.currentPagesize,
        pages: this.currentPageNumber,
      };
      /* eslint-disable no-useless-escape */
      if (path.match(/\/(\S*)\=/) && path.match(/\=(\S*)/)) {
        this.query.CnccOrigReceiver = path.match(/\=(\S*)/)[1];
      }
      const param = window.localStorage.getItem('param');
      if (param) {
        const paramObj = JSON.parse(param);
        if (_.has(paramObj, 'start') && _.has(paramObj, 'end')) {
          this.query.start = paramObj.start;
          this.query.end = paramObj.end;
          // window.localStorage.removeItem('param');
        }
      }
      // && _.has(window.localStorage.getItem('param')) {
      //   this.query.start = window.localStorage.getItem('start');
      //   this.query.end = window.localStorage.getItem('end');
      // }
      getTimout(this.query).then(
        (res) => {
          this.data1 = res.data.data;
          this.total = Math.ceil(res.data.total / this.currentPagesize);
        },
      );
      this.onResize();
    },
    getFloor(val) {
      let res = val;
      if (typeof res === 'number') {
        res = Math.round(val);
      }
      return res;
    },
  },
  watch: {
    currentPagesize() {
      this.postData();
    },
    total() {
      this.onResize();
    },
    data1(val) {
      document.getElementsByClassName('ivu-table-header')[0].style.height = val.length > 0 ? '' : 0;
    },
  },
  mounted() {
    /* eslint-disable no-unused-vars */
    // const Random = Mock.Random;
    // this.data1 = Array.from({ length: 10 }, (x, i) => ({
    //   trans_key: Random.string('number', 13),
    //   send_name: `${Random.city()}银行`,
    //   send_id: Random.string('number', 9),
    //   receive_name: `${Random.city()}银行`,
    //   receive_id: Random.string('number', 9),
    //   ccpc_name: `${Random.province()}处理中心`,
    //   trans_res: Mock.mock({ 'tmp|1': ['成功', '过期'] }).tmp,
    //   business_type: '普通汇兑',
    // }));
    document.getElementsByClassName('ivu-table-header')[0].style.height = 0;
    this.postData();
    this.$nextTick(() => {
      const ele = document.getElementsByClassName('ivu-table-body')[0];
      /* eslint-disable no-unused-vars */
      this.bar = new PerfectScrollbar(ele, { useBothWheelAxes: true });
      setTimeout(() => {
        this.bar.update();
      }, 500);
    });
    window.addEventListener('resize', () => this.onResize());
  },
};
</script>
<style lang="scss">
.single-table{
  .ivu-table-body{
    height: 400px;
    .ivu-table-row{
      cursor: pointer;
    }
    
  }
}

</style>
<style lang="scss" scoped>
.page-size-div{
  margin-left: calc(100% - 175px);
  margin-bottom: 10px;
}
.scroll-area{
  width: 100%;
  height: 100%;
}
</style>

