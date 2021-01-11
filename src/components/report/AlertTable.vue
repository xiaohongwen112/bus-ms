<template>
  <div class="level-content main-level-div" :class="{'selected': choseStatus.alert}" id="alert">
    <div class="level-menu main-level-menu">
      <span class="level-name">{{title}}</span>
      <span class="level-span alertLevelOp">
        <label class="icon-toggle" :class="toggleStatus.alert?'toggle-close':'toggle-open'" @click="toggleContent('alert')"></label>
        <label class="icon-choose" :class="choseStatus.alert?'icon-chosed':'icon-unchose'" @click="choseContent('alert')"></label>
      </span>
    </div>
    <div class="level-info-content main-info-content" v-show="toggleStatus.alert" id="alert_content">
      <table class="report-table" ref="alertTable">
        <thead>
          <tr>
            <th>告警指标/类型</th>
            <th>基线告警</th>
            <th>健康度告警</th>
            <th>返回码告警</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(x, i) in alertIndex" :key="i">
            <td>{{x}}</td>
            <td>{{data.alerts.baseline[i]}}</td>
            <td>{{data.alerts.health[i]}}</td>
            <td>{{data.alerts.ret[i]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['title', 'toggleStatus', 'choseStatus', 'data'],
    data() {
      return {
        alertIndex: ['健康度', '响应时间', '响应率', '返回码', '成功率', '交易量', '总计'],
      };
    },
    methods: {
      toggleContent(id) {
        this.$emit('toggle-content', id);
      },
      choseContent(id) {
        this.$emit('chose-content', id);
      },
    },
  };
</script>
<style lang="scss" scoped>
.sub-level-div {
  .level-menu {
    margin: 5px 0;
  }
  .level-info-content {
    margin: 0;
    width: 100%;
  }
}
.level-info-content {
  margin: 0 3%;
  width: 94%;
  font-size: 0;
}
.level-menu {
  display: block;
  height: 45px;
  line-height: 45px;
  padding: 0 40px;
  font-size: 20px;
  background: #0c161e;
  color: #5c686f;
  margin: 5px 2%;
}
.main-level-menu {
  border-bottom: 1px solid #1f2b38;
  margin-bottom: 5px;
}
.selected>.level-menu,.selectedMenu {
  background: #141c26;
  color: #e0ebef;
}
.sub-level-menu {
  margin: 3px 1%;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
}
.active-table{
  width: 96%;
  margin: 0 2%;
}
.level-span {
  clear: both;
  float: right;
  position: relative;
  top: 5px;
  .icon-toggle,
  .icon-choose {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-left: 15px;
    cursor: pointer;
  }
  .toggle-close {
    background: url(../../assets/report/item-close.svg) no-repeat;
  }
  .toggle-open {
    background: url(../../assets/report/item-open.svg) no-repeat;
  }
  .icon-chosed {
    background: url(../../assets/report/item-selected.svg) no-repeat;
  }
  .icon-unchose {
    background: url(../../assets/report/item-unselected.svg) no-repeat;
  }
}
.report-table {
  width: 100%;
  background: #040a10;
  text-align: center;
  border-spacing: 0;
  color: #fff;
  thead {
    tr {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      background: #283646;
    }
  }
  tr {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    th,
    td {
      border: 1px solid #0f171e;
    }
    th:first-child,
    td:first-child {
      padding-left: 20px;
      text-align: left;
      width: 130px;
    }
  }
}
</style>