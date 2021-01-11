<template>
  <div class="test-table">
    <CmTable :column="column" :data="data" :haveThSlot="true" :width="tableWidth">
      <template slot="res_time">
        <SortIcon :sort="sortTime" @onASC="onTimeASC" @onDESC="onTimeDESC"></SortIcon>
      </template>

      <template slot-scope="props" slot="start_time">
        <span>{{getTime(props.item.start_time)}}</span>
      </template>

      <template slot-scope="props" slot="business_flow">
        <span v-html="getFlow(props.item.business_flow)"></span>
      </template>
        <CmSelect :list="selectList" :disabledLi="disabledLi" :selectVal="selectVal" :height="selectHeight" type="popsUp"></CmSelect>
      <template slot-scope="props" slot="return_status">
        <span class="return-status">{{props.item.return_status}}</span>
      </template>
    </CmTable>
  </div>
</template>

<script>
  import { CmTable, SortIcon } from '@/components/common';
  import moment from 'moment';

  export default {
    name: 'test-cmtable',
    components: { CmTable, SortIcon },
    data() {
      return {
        sortTime: 0, // 1 升序 -1 降序 0 不排序
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
        data: [
          {
            transaction_number: '2015102000000230',
            response_time: '238.44',
            start_time: '1527183840',
            source_address: '10.1.34.21',
            target_address: '121.211.132.111',
            trade_type: '网银贷记业务',
            trade_way: '中国工商银行',
            business_flow: ['IC卡柜面', '前置（IC卡柜面）', '核心'],
            return_status: '超时',
            relative_time: '238.140',
            intervals: '0.000',
          },
          {
            transaction_number: '2015102000000230',
            response_time: '238.44',
            start_time: '1527183840',
            source_address: '10.1.34.21',
            target_address: '121.211.132.111',
            trade_type: '网银贷记业务',
            trade_way: '中国工商银行',
            business_flow: ['IC卡柜面', '前置（IC卡柜面）', '核心'],
            return_status: '超时',
            relative_time: '238.140',
            intervals: '0.000',
          },
          {
            transaction_number: '2015102000000230',
            response_time: '238.44',
            start_time: '1527183840',
            source_address: '10.1.34.21',
            target_address: '121.211.132.111',
            trade_type: '网银贷记业务',
            trade_way: '中国工商银行',
            business_flow: ['IC卡柜面', '前置（IC卡柜面）', '核心'],
            return_status: '超时',
            relative_time: '238.140',
            intervals: '0.000',
          },
          {
            transaction_number: '2015102000000230',
            response_time: '238.44',
            start_time: '1527183840',
            source_address: '10.1.34.21',
            target_address: '121.211.132.111',
            trade_type: '网银贷记业务',
            trade_way: '中国工商银行',
            business_flow: ['IC卡柜面', '前置（IC卡柜面）', '核心'],
            return_status: '超时',
            relative_time: '238.140',
            intervals: '0.000',
          },
          {
            transaction_number: '2015102000000230',
            response_time: '238.44',
            start_time: '1527183840',
            source_address: '10.1.34.21',
            target_address: '121.211.132.111',
            trade_type: '网银贷记业务',
            trade_way: '中国工商银行',
            business_flow: ['IC卡柜面', '前置（IC卡柜面）', '核心'],
            return_status: '超时',
            relative_time: '238.140',
            intervals: '0.000',
          },
          {
            transaction_number: '2015102000000230',
            response_time: '238.44',
            start_time: '1527183840',
            source_address: '10.1.34.21',
            target_address: '121.211.132.111',
            trade_type: '网银贷记业务',
            trade_way: '中国工商银行',
            business_flow: ['IC卡柜面', '前置（IC卡柜面）', '核心'],
            return_status: '超时',
            relative_time: '238.140',
            intervals: '0.000',
          },
          {
            transaction_number: '2015102000000230',
            response_time: '238.44',
            start_time: '1527183840',
            source_address: '10.1.34.21',
            target_address: '121.211.132.111',
            trade_type: '网银贷记业务',
            trade_way: '中国工商银行',
            business_flow: ['IC卡柜面', '前置（IC卡柜面）', '核心'],
            return_status: '超时',
            relative_time: '238.140',
            intervals: '0.000',
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
      onTimeASC() {
        this.sortTime = 1;
      },
      onTimeDESC() {
        this.sortTime = -1;
      },
    },
  };
</script>

<style lang="scss">
  .test-table{
    table{
      width: 100%;
      // & thead,tbody tr{
      //   table-layout:fixed;
      // }
    }
    // .scroll-area {
      // position: relative;
    //   width: 100%;
    //   height:265px;
    // }
    .icon-flow-arr{
      display: inline-block;
      width:18px;
      height:10px;
      vertical-align: middle;
      background: url(../../../../assets/alert/flow-icon.png) no-repeat center;
      background-size: cover;
    }
    .common-table {
      // min-width:2200px;
      .common-table-thead{
        // height: 50px;
        // line-height: 25px;
        .table-title{
          background-color: #0f2938;
          tr{
            td{
              border-right: 1px solid #050e13;
            }
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
  .test-table{
    margin-top:10%;
    width: 100%;
    height:265px;
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
  }
</style>