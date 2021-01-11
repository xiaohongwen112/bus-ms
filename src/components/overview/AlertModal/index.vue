<template>
  <div class="modal-bg">
    <!-- <div class="close-area" @click="closeAlert"></div> -->
    <div class="modal-content">
      <div class="select-div">
        <CmSelect :list="typeList" :selectVal="typeSelected" @on-change="onTypeChange"></CmSelect>
        <CmSelect :list="statusList" :selectVal="statusSelected" @on-change="onStatusChange"></CmSelect>
        <span class="close-btn" @click="closeAlert">X</span>
      </div>
      <ScrollBar class="scroll-area">
        <AlertCard v-for="(card, index) in dataList" :key="`alert-card-${index}`" :data="card"/>
      </ScrollBar>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { getAlertlist } from '@/pages/overview/service';
import { formatAlert } from '@/pages/overview/utils';

import CmSelect from '@/components/common/CmSelect';
import ScrollBar from '@/components/common/ScrollBar';
import AlertCard from './AlertCard';

export default {
  name: 'AlertModal',
  components: {
    CmSelect,
    ScrollBar,
    AlertCard,
  },
  data() {
    return {
      typeList: ['所有类型', '基线告警', '健康度告警', '返回码告警'],
      typeSelected: '所有类型',
      // statusList: ['所有状态', '已恢复', '持续中', '一次性'],
      statusSelected: '所有状态',
      dataList: [],
    };
  },
  computed: {
    ...mapState({
      appId: 'appId',
      intfId: 'intfId',
      ts: 'ts',
      newTs: 'newTs',
    }),
    statusList() {
      let tmpList = ['所有状态'];
      switch (this.typeSelected) {
        case '所有类型':
          tmpList = tmpList.concat(['已恢复', '持续中', '一次性']);
          break;
        case '返回码告警':
          tmpList = tmpList.concat(['一次性']);
          break;
        default:
          tmpList = tmpList.concat(['已恢复', '持续中']);
      }
      return tmpList;
    },
  },
  methods: {
    closeAlert() {
      this.$emit('close-alert');
      this.$store.commit('setDialog', null);
    },
    onTypeChange(val) {
      this.typeSelected = val;
      this.statusSelected = '所有状态';
      this.init();
    },
    onStatusChange(val) {
      this.statusSelected = val;
      this.init();
    },
    formatQuery() {
      const tmp = {
        app_name: this.appId,
        intf_name: this.intfId,
        // tags: JSON.stringify([]),
        start_time: this.ts !== null ? this.ts : this.newTs,
      };
      // if (this.ts !== null) {
      //   tmp.start_time = this.ts;
      // }
      const tags = [];
      if (this.typeSelected !== '所有类型') {
        tags.push(this.typeSelected);
      }
      if (this.statusSelected !== '所有状态') {
        tags.push(this.statusSelected);
      }
      tmp.tags = JSON.stringify(tags);
      return tmp;
    },
    init() {
      getAlertlist(this.appId, this.formatQuery()).then((res) => {
        const data = res.data.data;
        this.dataList = formatAlert(data);
        console.log(data);
      });
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    intfId() {
      this.init();
    },
    newTs() {
      this.init();
    },
    ts() { // 相比其他弹窗， 可历史回溯
      this.init();
    },
  },
};
</script>
<style lang="scss" scoped>
.modal-bg{
  z-index: 1;
  position: absolute;
  top: 44px;
  bottom: 60px;
  right: 0;
  background-color:#050C12;
}

  .close-area{
    float: left;
    width: calc(100% - 422px);
    height: 100%;
  }
  .select-div{
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .modal-content{
    float: right;
    width: 420px;
    height: 100%;
    border-left: 1px solid #3dd9c4;
    background-color:#050C12;
  }
  .scroll-area{
    width: 100%;
    height: calc(100% - 45px);
  }
  .close-btn{
    display: inline-block;
    float: right;
    // line-height: 30px;
    margin-top: 5px;
    margin-right: 15px; 
    font-size: 20px;
    cursor: pointer;
  }
// }
</style>
