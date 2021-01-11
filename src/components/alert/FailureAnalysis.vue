<template>
  <div class="failure-analysis" :class="{'no-page': Math.ceil(total / pageSize) !== 1 && data.length !== 0}">
    <CmTable ref="analysis" :column="column" :data="data" :clickEvent="true" :noSettingFlag="noSettingFlag" @click-row="clickRow">
      <template slot-scope="props" slot="abnormal_source">
        <div>{{props.item.abnormal_source.join(',')}}</div>
      </template>

      <template slot-scope="props" slot="trade_type">
        <div class="trade-type" @mouseover="showTip(props.index)" @mouseout="hideTip">{{props.item.trade_type}}</div>
      </template>

      <template slot-scope="props" slot="nodes">
        <div class="show-nodes" v-html="getNodes(props.item.nodes)" @mousemove="dragMove($event)" @mousedown="flag=true" @mouseup="dealMove" @mouseout="dealMove"></div>
      </template>

      <template slot-scope="props" slot="operate">
        <div class="each-detail" @click="toTrack(props.index)">业务追踪</div>
      </template>
    </CmTable>
    <Pagination v-show="data.length !== 0 && Math.ceil(total / pageSize) !== 1" :total="Math.ceil(total / pageSize)" :current="page" @to-page="goTo"></Pagination>
  </div>
</template>

<script>
  import { CmTable, Pagination } from '@/components/common';
  import { setLocalStorage } from '@/helpers/utils';
  import tooltip from '@/directive/tooltip';
  import $ from 'jquery';

  export default {
    props: {
      data: {
        type: Array,
        default() {
          return [{}];
        },
      },
      params: {
        type: Object,
        default() {
          return {};
        },
      },
      pageSize: {
        type: Number,
        default: 8,
      },
      page: {
        type: Number,
        default: 1,
      },
      total: {
        type: Number,
        default: 1,
      },
      noSettingFlag: {
        type: Boolean,
        default: false,
      },
    },
    components: { CmTable, Pagination },
    directives: {
      tooltip,
    },
    data() {
      return {
        start: 0,
        end: 0,
        flag: false,
        preX: 0,
        column: [
          {
            title: '序号',
            key: 'index',
            width: '40px',
          },
          {
            title: '异常根源',
            slotTdName: 'abnormal_source',
            haveTdSlot: true,
            width: '190px',
          },
          {
            title: '交易类型',
            slotTdName: 'trade_type',
            haveTdSlot: true,
            width: '100px',
          },
          {
            title: '影响节点',
            slotTdName: 'nodes',
            haveTdSlot: true,
          },
          {
            title: '操作',
            slotTdName: 'operate',
            haveTdSlot: true,
            width: '70px',
          },
        ],
      };
    },
    methods: {
      textWidth(text) {
        text = text.replace(/ /g, 'd'); // eslint-disable-line
        const sensor = $(`<span id="text-width">${text}</span>`).css({
          display: 'none',
          'font-family': 'helvetica',
          'font-size': '14px',
        });
        $('body').append(sensor);
        const width = sensor.width();
        sensor.remove();
        return width;
      },
      hideTip() {
        this.$refs.analysis.hideTip();
      },
      showTip(i) {
        if (this.textWidth(this.data[i].trade_type) > 84) this.$refs.analysis.showWhole(i);
      },
      toTrack(index) {
        const transType = this.data[index].trade_type;
        let intfName = '';
        this.data[index].nodes.forEach((item) => {
          if (item.disp_name === this.params.alarmNode) intfName = item.intf_name;
        });
        const params = {
          ts_start: this.params.time,
          ts_end: this.params.time + 60,
          duration: this.params.duration,
          trans_type: transType,
        };
        setLocalStorage('params', JSON.stringify(params));
        window.location.href = `/zh-cn/stat/${this.params.app}/cap/${intfName}/#/BizTrack`;
      },
      clickRow(param) {
        this.$emit('onClickRow', param);
      },
      getNodes(nodes) {
        let nodesHtml = '';
        if (nodes && nodes.length !== 0) {
          for (let i = 0; i < nodes.length; i += 1) {
            if (nodes[i].is_alert) nodesHtml += `<span class="node-name">${nodes[i].disp_name}</span><span class="interval">-</span><span class="response-time alert">${nodes[i].duration === null ? '--' : Number(nodes[i].duration.toFixed(2))}</span>ms`;
            else nodesHtml += `<span class="node-name">${nodes[i].disp_name}</span><span class="interval">-</span><span class="response-time">${nodes[i].duration === null ? '--' : Number(nodes[i].duration.toFixed(2))}</span>ms`;
            if (i !== nodes.length - 1) {
              nodesHtml += '<span class="arrow"></span>';
            }
          }
        }
        return nodesHtml;
      },
      goTo(page) {
        this.$emit('turn-page', page);
      },
      dragMove(event) {
        let outWidth = 0;
        let innerWidth = 0;
        outWidth = event.currentTarget.parentNode.offsetWidth;
        innerWidth = event.currentTarget.offsetWidth;
        if (innerWidth > outWidth && this.flag) {
          const dom = event.currentTarget;
          const e = event || window.event;
          const x = e.pageX || e.clientX + scrollX;
          let finalX = 0;
          if (this.preX !== 0) {
            finalX = x - this.preX;
          }
          this.preX = x;
          dom.style.left = `${dom.offsetLeft + finalX}px`;
        }
      },
      dealMove() {
        this.flag = false;
        this.preX = 0;
      },
    },
  };
</script>

<style lang="scss">
  .failure-analysis{
    &.no-page{
      .scroll-area{
        height: calc(100% - 36px);
      }
    }
    .node-name{
      color:#2ee6e6;
    }
    .arrow {
      display: inline-block;
      width: 17px;
      height: 7px;
      background: url(../../assets/alert/arrow.svg) no-repeat center;
      background-size: cover;
    }
    .response-time, .arrow{
      margin: 0 3px;
    }
    .alert{
      color:#d81e06;
    }
    .interval{
      margin: 0 3px;
    }
    .each-detail{
      color:#00bb9c;
      text-decoration:underline;
      cursor:pointer;
    }
    .table-slot-icon{
      display:block;
      position: relative;
      width: 100%;
      height: 26px;
      .show-nodes{
        position:absolute;
        top:0;
        left:10px;
        height: 26px;
        line-height:26px;
        cursor:default;
        white-space:nowrap;
        user-select: none;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .failure-analysis{
    width:100%;
    position: absolute;
    bottom: 0;
    min-height:225px;
    background-color: #0c212f;
    .trade-type{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
    }
  }
</style>