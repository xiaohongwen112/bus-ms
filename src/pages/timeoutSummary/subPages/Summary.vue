<template>
  <div class="sum-div">
    <div class="table-nav">
      <div class="tab-wrap clearfix">
        <div class="tab-item active">101报文</div>
        <div class="tab-item">103报文</div>
        <div class="tab-item">105报文</div>
      </div>
      <div class="btn-wrap">
        <CmBtn :active="sortRate" @click="toggleSort(true)">
          按超时率排名
        </CmBtn>
        <CmBtn class="sort-btn-ed" :active="!sortRate" @click="toggleSort(false)">
          按超时笔数排名
        </CmBtn>
      </div>
    </div>
    <i-table class="sum-table cm-stripe" border :columns="col1" :data="data1" :no-filtered-data-text="`暂无数据`"/>
  </div>
</template>
<script>
import { Table } from 'iview';
import CmBtn from '@/components/common/CmBtn';
import ScrollBar from 'perfect-scrollbar';
import Mock from 'mockjs';
import { getSummary } from '../service';


/**
 * 判断数组是否包含大于1000的值
 * return Boolean
 */
function isMs(arr = []) {
  return !arr.some(v => v > 1000);
}

export default {
  name: 'Summary',
  components: {
    'i-table': Table,
    CmBtn,
  },
  data() {
    return {
      isTest: false,
      sortRate: true,
      timer: null,
      col1: [
        {
          title: '接收参与者',
          key: 'receive_name',
          width: 265,
        },
        {
          title: '接收行号',
          key: 'receive_id',
          width: 145,
        },
        {
          title: '超时率',
          key: 'out_time',
          width: 90,
           /* eslint-disable arrow-body-style */
          render: (h, params) => {
            return h('a', {
              domProps: {
                innerText: `${Math.ceil(params.row.out_time * 100) / 100}%`,
                href: `/zh-cn/stat/timeout/summary/#/receive_id=${params.row.receive_id}`,
              },
            });
          },
        },
        {
          title: '超时笔数',
          key: 'out_count',
          width: 110,
           /* eslint-disable arrow-body-style,no-unused-vars */
          render: (h, params) => {
            return h('a', {
              domProps: {
                innerText: params.row.out_count,
                href: `/zh-cn/stat/timeout/summary/#/receive_id=${params.row.receive_id}`,
              },
            });
          },
        },
        {
          title: '平均超时时间(ms)',
          key: 'average_time',
          width: 150,
          align: 'center',
        },
        {
          title: '101CCPC->NPC平均时间(ms)',
          key: 'ccpc_101',
          width: 220,
          align: 'center',
        },
        {
          title: '102CCPC->NPC平均时间(ms)',
          key: 'ccpc_102',
          width: 220,
          align: 'center',
        },
      ],
      data1: [],
      bar: null,
    };
  },
  methods: {
    onResize() {
      const ele = document.getElementsByClassName('ivu-table-body')[0];
      const tmpH = document.getElementsByClassName('content')[0].getBoundingClientRect().height - 70;
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
      if (width > 1200) {
        this.col1[0].width = width * 0.221; // 265
        this.col1[1].width = width * 0.121;  // 145
        this.col1[2].width = width * 0.075;  // 90
        this.col1[3].width = width * 0.092;  // 110
        this.col1[4].width = width * 0.125;  // 150
        this.col1[5].width = width * 0.183;  // 220
        this.col1[6].width = width * 0.183;  // 220
      }
    },
    getUnit(bool) {
      return bool ? 'ms' : 's';
    },
    getTime(duration, bool) {
      return bool ? duration : duration / 1000;
    },
    getTableData() {
      let tableData = [];
      if (this.isTest) {
        // 模拟数据
        const Random = Mock.Random;
        tableData = Array.from({ length: Math.floor(Math.random() * 20) }, () => ({
          receive_name: `${Random.city()}银行`,
          receive_id: Random.string('number', 9),
          out_time: Mock.mock({ 'tmp|1-10000': 100 }).tmp,
          out_count: Mock.mock({ 'tmp|1-10000': 1000 }).tmp,
          average_time: Mock.mock({ 'tmp|1-10000': 1000 }).tmp,
          ccpc_101: Mock.mock({ 'tmp|1-100': 1000 }).tmp,
          ccpc_102: Mock.mock({ 'tmp|1-10000': 1000 }).tmp,
        }));
        this.formatUnit(tableData);
      } else {
        getSummary({
          keyword: this.sortRate ? 'out_time' : 'out_count',
          order: 'down',
        }).then(
          (res) => {
            const httpData = res.data.data;
            // set start and end
            window.localStorage.setItem('param', JSON.stringify({
              start: httpData.start,
              end: httpData.end,
            }));
            window.localStorage.setItem('end', httpData.end);
            // window.localStorage.setItem('start', httpData.start);
            // window.localStorage.setItem('end', httpData.end);
            tableData = res.data.data.data_list;
            this.formatUnit(tableData);
          },
        );
      }
    },
    formatUnit(data) {
      const tableData = data;
      // 动态处理单位
      const units = {
        average_time: 'ms',
        ccpc_101: 'ms',
        ccpc_102: 'ms',
      };
      Object.keys(units).forEach((k) => {
        // console.log(tableData.map(v => v[k]));
        units[k] = isMs(tableData.map(v => v[k]));
      });
      this.col1[4].title = `平均超时时间(${units.average_time ? 'ms' : 's'})`;
      this.col1[5].title = `101CCPC->NPC平均时间(${units.ccpc_101 ? 'ms' : 's'})`;
      this.col1[6].title = `102CCPC->NPC平均时间(${units.ccpc_102 ? 'ms' : 's'})`;
      tableData.forEach((d, i) => {
        Object.keys(units).forEach((k) => {
          if (typeof (d[k]) === 'number' && !units[k]) {
            tableData[i][k] /= 1000;
          }
        });
      });
      this.data1 = tableData;
    },
    toggleSort(val) {
      this.sortRate = val;
      this.getTableData();
      // if (this.sortRate !== val) {
      // }
    },
  },
  watch: {
    data1(val) {
      document.getElementsByClassName('ivu-table-header')[0].style.height = val.length > 0 ? '' : 0;
    },
  },
  mounted() {
    document.getElementsByClassName('ivu-table-header')[0].style.height = 0;
    this.getTableData();
    this.onResize();
    this.$nextTick(() => {
      const ele = document.getElementsByClassName('ivu-table-body')[0];
      /* eslint-disable no-unused-vars */
      this.bar = new ScrollBar(ele, { useBothWheelAxes: true });
      setTimeout(() => {
        this.bar.update();
      }, 500);
    });
    window.addEventListener('resize', () => this.onResize());
    // 每分钟刷新页面
    this.timer = window.setInterval(() => {
      this.getTableData();
    }, 60000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss">
.sum-table{
  overflow: hidden;
  .ivu-table-body{
    height: 400px;
    td:nth-child(3), td:nth-child(4){
      text-decoration: underline;
      cursor: pointer;
      
    }
  }
}
</style>

<style lang="scss" scoped>
.table-nav{
  height: 40px;
}
.clearfix{
  zoom: 1;
}
.clearfix:after{
  content: ".";
  clear: both;
  display: block;
  overflow: hidden;
  font-size: 0;
  height: 0;
}
.tab-wrap{
  display: inline-block;
  width: calc(100% - 305px);
  vertical-align: -20px;
}
.btn-wrap{
  display: inline-block;
}
.tab-item{
  float: left;
  width: 105px;
  height: 30px;
  line-height: 30px;
  border-radius: 10px 10px 0 0;
  border-top: 1px solid #27a090;
  border-left: 1px solid #27a090;
  border-right: 1px solid #27a090;
  margin-right: 10px;
  text-align: center;
  background-color: #010c11;
  color: #27a090;
  font-size: 16px;
  cursor: pointer;
}
.active{
  box-shadow: inset 0px 0px 40px #27a090;
  color: #eee;
}
.sort-btn-ed{
  margin-left: 10px;
}
.co-table{
  width: 100%;
}
.sum-table-wrap{
  width: 1230px;
  height: 300px;
  overflow-y: scroll;
}
</style>

