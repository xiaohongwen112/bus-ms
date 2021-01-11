<template>
  <div class="bottom-panel-container">
    <div @click="toggleCollapse" :class="['collapse-btn', isCollapse ? '' : 'expand']" ref="collapseBtn">
    </div>
    <div v-show="!isCollapse" class="table" ref="slickGrid">
    </div>
  </div>
</template>
<script>

import 'slickgrid/slick.core';
import 'slickgrid/slick.grid';
import 'slickgrid/slick.formatters';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid.css';

import ScrollBar from 'perfect-scrollbar';
import _ from 'lodash';

const ip2Int = ip => ip.split('.').reduce((p, c) => p + c * 256, 0);

/* eslint-disable no-plusplus, eqeqeq */
const props = {
  columns: {
    type: Array,
    default: () => ([
      { id: 'title', name: 'Title', field: 'title', sortable: true },
      { id: 'duration', name: 'Duration', field: 'duration', sortable: true },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true },
      { id: 'start', name: 'Start', field: 'start', sortable: true },
      { id: 'finish', name: 'Finish', field: 'finish', sortable: true },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true },
    ]),
  },
  options: {
    type: Object,
    default: () => ({
      editable: false,
      enableAddRow: false,
      enableCellNavigation: true,
      enableColumnReorder: false,
      rowHeight: 20,
      forceFitColumns: true,
    }),
  },
  data: {
    type: Array,
    default: () => {
      const data = [];
      for (let i = 0; i < 500; i++) {
        data[i] = {
          id: i,
          title: `Task ${i}`,
          duration: '5 days',
          percentComplete: Math.round(Math.random() * 100),
          start: '01/01/2009',
          finish: '01/05/2009',
          effortDriven: (i % 5 == 0),
        };
      }
      return data;
    },
  },
  sortFn: {
    type: Function,
    default: field => (a, b) => {
      let va = a[field];
      let vb = b[field];
      if (field === 'ip_a' || field === 'ip_b') {
        va = ip2Int(va);
        vb = ip2Int(vb);
      } else if (field === 'port_a' || field === 'port_b') {
        va = parseInt(va, 10);
        vb = parseInt(vb, 10);
      }
      return ((va > vb) ? 1 : -1);
    },
  },
};

export default {
  name: 'slick-grid-table',
  props,
  data() {
    return {
      isCollapse: false,
      grid: null,
      dataView: null,
      bar: null,
      sortInfo: {
        field: null,
        sortAsc: null,
      },
    };
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      const ele = document.querySelector('.slick-viewport');
      this.$emit('bottomCollapseChange', this.isCollapse);
      setTimeout(() => {
        // 强制 slickgrid 重新渲染
        ele.scrollTop -= 100 * 1;
      }, 100);
    },
    sortData(field, sortAsc) {
      this.dataView.sort((a, b) => {
        const s = sortAsc ? 1 : -1;
        return s * this.sortFn(field)(a, b);
      });
    },
    initCollapseBtn() {
      this.$refs.collapseBtn.style.left = this.$el.clientWidth / 2 + 'px'; // eslint-disable-line
    },
    initScrollBar() {
      setTimeout(() => {
        const ele = document.querySelector('.slick-viewport');
        this.bar = new ScrollBar(ele, {
          minScrollbarLength: 60,
        });
        window.SB = ScrollBar;
        window.bar = this.bar;
      }, 50);
    },
    resizeHandler() {
      _.throttle(() => {
        this.initCollapseBtn();
        this.grid.resizeCanvas();
      }, 100)();
    },
    bindEvents() {
      if (!this.dataView || !this.grid) {
        throw new Error('No DataView and Grid Mounted');
      }
      this.dataView.onRowCountChanged.subscribe(() => {
        this.grid.updateRowCount();
        this.grid.render();
      });

      this.dataView.onRowsChanged.subscribe((e, args) => {
        this.grid.invalidateRows(args.rows);
        this.grid.render();
      });

      this.grid.onSort.subscribe((e, args) => {
        this.sortInfo = {
          field: args.sortCol.field,
          sortAsc: args.sortAsc,
        };

        this.sortData(args.sortCol.field, args.sortAsc);
      });

      window.addEventListener('resize', this.resizeHandler);
    },
  },
  watch: {
    data(newV) {
      this.dataView.beginUpdate();
      const newData = _.cloneDeep(newV);
      this.dataView.setItems(newData);
      this.dataView.endUpdate();

      if (this.sortInfo.field && this.sortInfo.sortAsc) {
        this.sortData(this.sortInfo.field, this.sortInfo.sortAsc);
      }
    },
  },
  mounted() {
    if (!window.Slick.Grid || !window.Slick.Data.DataView) {
      throw new Error('No Slick.Grid FOUND in `window`');
    }

    this.dataView = new window.Slick.Data.DataView();

    this.grid = new window.Slick.Grid(this.$refs.slickGrid, this.dataView, this.columns, this.options);

    this.bindEvents();

    this.dataView.setItems(this.data);

    this.initCollapseBtn();

    this.$nextTick(this.initScrollBar);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
  },
};

</script>

<style>

  @import '~perfect-scrollbar/css/perfect-scrollbar.css';

  .bottom-panel-container {
    position: relative;
  }

  .collapse-btn {
    width: 60px;
    height: 12px;
    background: #14a69f url(../../assets/dataPack/threeL.png) center no-repeat;
    position: absolute;
    top: -10px;
    margin: auto;
    border-radius: 3px 3px 0 0;
    cursor: pointer;
  }

  .ps-container {
    position: relative;
  }

  .ps--active-x > .ps__rail-x, .ps--active-y > .ps__rail-y {
    background-color: #094561;
    opacity: 0.7;
  }

  .ps:hover > .ps__rail-x,
  .ps:hover > .ps__rail-y,
  .ps--focus > .ps__rail-x,
  .ps--focus > .ps__rail-y,
  .ps--scrolling-x > .ps__rail-x,
  .ps--scrolling-y > .ps__rail-y {
    opacity: 0.8;
  }

  .ps--active-y > .ps__rail-y {
    width: 9px;
  }

  .ps--active-x > .ps__rail-x {
    height: 9px;
  }

  .ps__thumb-y, .ps__thumb-x {
    background: #1498D6;
  }

  .ps__rail-y:hover > .ps__thumb-y, .ps__rail-y:focus > .ps__thumb-y {
    background: #1498D6;
    width: 6px;
  }

  .ps__rail-x:hover > .ps__thumb-x, .ps__rail-x:focus > .ps__thumb-x {
    background: #1498D6;
    height: 6px;
  }

  div.table {
    height: 200px;
    margin: 0;
  }

  .slick-header-column.ui-state-default {
    height: 50px !important;
    background: #0d1b28;
  }

  .slick-header-column.ui-state-default .slick-column-name {
    line-height: 40px;
  }

  .slick-cell {
    border: 0 !important;
    text-align: center;
    font-size: 12px;
    height: 26px !important;
  }

  .ui-widget-content.slick-row{
    height: 26px !important;
  }

  .ui-widget-content.slick-row.odd {
    background: #0a1520;
  }

  .ui-widget-content.slick-row.even {
    background: #09131d;
  }

  .slick-sort-indicator {
    display: inline-block;
    width: 11px !important;
    height: 11px !important;
    cursor: pointer;
    background: url(../../assets/dataPack/sort_auto.png) center no-repeat;
    float: none !important;
  }

  .slick-sort-indicator-asc {
    background: url(../../assets/dataPack/sort_up.png) center no-repeat;
  }

  .slick-sort-indicator-desc {
    background: url(../../assets/dataPack/sort_down.png) center no-repeat;
  }

</style>

