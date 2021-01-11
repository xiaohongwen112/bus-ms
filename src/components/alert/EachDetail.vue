<template>
  <div class="each-detail">
    <CmTable :column="column" :data="data" :width="tableWidth">
      <template slot-scope="props" slot="start_time">
        <div>{{getTime(props.item.start_time)}}</div>
      </template>

      <template slot-scope="props" slot="business_flow">
        <div v-html="getFlow(props.item.business_flow)"></div>
      </template>

      <template slot-scope="props" slot="return_status">
        <div class="return-status">{{props.item.return_status}}</div>
      </template>
    </CmTable>
    <Pagination v-show="data.length!==0" :total="Math.ceil(total / pageSize)" :current="current" @to-page="goTo"></Pagination>
  </div>
</template>

<script>
  import { CmTable, Pagination } from '@/components/common';
  import moment from 'moment';

  export default {
    components: { CmTable, Pagination },
    props: {
      data: {
        type: Array,
        default() {
          return [{}];
        },
      },
    },
    data() {
      return {
        tableWidth: '2200px',
        current: 1,
        total: 15,
        pageSize: 5,
        column: [
          {
            title: '序号',
            key: 'index',
            width: '50px',
          },
          {
            title: '交易流水号',
            key: 'transaction_number',
            width: '150px',
          },
          {
            title: '响应时间（ms）',
            key: 'response_time',
            width: '150px',
            haveThSlot: true,
            slotThName: 'res_time',
          },
          {
            title: '开始时间',
            slotTdName: 'start_time',
            haveTdSlot: true,
            width: '160px',
          },
          {
            title: '源地址',
            key: 'source_address',
            width: '110px',
          },
          {
            title: '目标地址',
            key: 'target_address',
            width: '130px',
          },
          {
            title: '交易类型',
            key: 'trade_type',
            width: '110px',
          },
          {
            title: '交易渠道',
            key: 'trade_way',
            width: '110px',
          },
          {
            title: '业务流',
            slotTdName: 'business_flow',
            haveTdSlot: true,
          },
          {
            title: '返回状态',
            slotTdName: 'return_status',
            haveTdSlot: true,
            width: '70px',
          },
          {
            title: '相对时间（ms）',
            key: 'relative_time',
            width: '150px',
          },
          {
            title: '间隔时间（ms）',
            key: 'intervals',
            width: '104px',
          },
        ],
      };
    },
    methods: {
      getTime(time) {
        return moment.unix(time).format('YYYY-MM-DD HH:mm:ss');
      },
      getFlow(flow) {
        let flowHtml = '';
        if (flow && flow.length !== 0) {
          for (let i = 0; i < flow.length; i += 1) {
            flowHtml += flow[i];
            if (i !== flow.length - 1) {
              flowHtml += '<span class="icon-flow-arr"></span>';
            }
          }
        }
        return flowHtml;
      },
      goTo(page) {
        this.current = page;
      },
    },
  };
</script>

<style lang="scss">
  .each-detail{
    .scroll-area{
      height: 185px;
    }
    .icon-flow-arr{
      display: inline-block;
      width: 100%;
      height:165px;
      width:18px;
      height:10px;
      vertical-align: middle;
      background: url(../../assets/alert/flow-icon.png) no-repeat center;
      background-size: cover;
    }
    .common-table {
      min-width:2200px;
      .table-title{
        background-color: #0a171e;
        tr{
          td{
            border-right: 1px solid #050e13;
          }
        }
      }
      .common-table-tbody {
         .table-body{
           tr {
             background-color: transparent;
             td{
               border:none;
             }
           }
         }
      }
      td{
        text-align: center;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .each-detail{
    width: 100%;
    position: absolute;
    bottom: 0;
    height:225px;
    background-color: #030b0e;
    .common-table{
      .common-table-tbody{
        td {
          .table-slot__icon{
            >div{
              height: 26px;
              line-height: 26px;
              overflow: auto;
              &.return-status{
                color:#ff3333;
              }
            }
          }
        }
      }
    }
    .pagination{
      padding-top: 10px;
      border-top: 1px solid #153347;
    }
  }
</style>