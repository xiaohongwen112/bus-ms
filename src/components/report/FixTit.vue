<template>
  <div class="fixTitDiv">
    <div class="fixMenuDiv">
      <div class="level-menu main-level-menu" :class="{'selectedMenu':choseStatus[currentIndex]}">
        <span>{{currentNode}}</span>
        <span class="level-span">
          <label class="icon-toggle" :class="toggleStatus[currentIndex]?'toggle-close':'toggle-open'" @click="toggleContent(currentIndex)"></label>
          <label class="icon-choose" :class="choseStatus[currentIndex]?'icon-chosed':'icon-unchose'" @click="choseContent(currentIndex)"></label>
        </span>
      </div>
      <div class="active-table" v-if="curTableFlag">
        <table class="report-table">
          <thead>
            <tr>
              <th v-for="x in currentTable">{{x}}</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="level-info-content" v-show="currentChild!==''">
        <div class="level-menu sub-level-menu" :class="{'selectedMenu':choseStatus[currentIndex]}">
          <span>{{currentChild}}</span>
          <span class="level-span">
            <label class="icon-toggle" :class="toggleStatus[currentIndex]?'toggle-close':'toggle-open'"  @click="toggleChild(currentKey)"></label>
            <label class="icon-choose" :class="choseStatus[currentIndex]?'icon-chosed':'icon-unchose'" @click="choseChild(currentKey)"></label>
          </span>
        </div>
        <div class="active-table" v-if="curChildFlag">
          <table class="report-table">
            <thead>
              <tr>
                <th v-for="x in currentChildTable">{{x}}</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['choseStatus', 'currentIndex', 'currentNode', 'toggleStatus', 'curTableFlag', 'currentTable', 'currentChild', 'currentKey', 'currentChildTable', 'curChildFlag'],
  data() {
    return {
    };
  },
  methods: {
    toggleContent(id) {
      this.$emit('on-toggle', id);
    },
    choseContent(id) {
      this.$emit('on-chose', id);
    },
    toggleChild(key) {
      this.$emit('on-childtoggle', key);
    },
    choseChild(key) {
      this.$emit('on-childchose', key);
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
.fixTitDiv {
  width: 98%;
  margin: 0 1%;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
  top: 164px;
  background: #08111a;
  .hideFix {
    display: none;
  }
  .active-table{
    width: 96%;
    margin: 0 2%;
  }
  .level-info-content{
    margin: 0px 1%;
    width: 98%;
    .active-table{
      width: 98%;
      margin: 0 1%;
    }
  }
  .level-menu{
    margin: 5px 1%;
  }
}
</style>