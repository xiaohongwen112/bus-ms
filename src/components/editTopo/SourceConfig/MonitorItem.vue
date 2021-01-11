<template>
  <div>
    <span class="col-item col-ip">{{ item.ip }}</span>
    <span class="col-item col-moni-name cm-ellipsis" @mouseover="checkName" @mouseout="showNameFlag = false">{{ item.name }}</span>
    <span class="col-item col-addr cm-ellipsis" @mouseover="checkName" @mouseout="showNameFlag = false">{{ item.addr }}</span>
    <span class="col-item col-op">
      <a class="del-ip-btn" href="#" @click="delMoniIp">删除</a>
    </span>
    <ShowNameBox class="monitor-item-tip"
      :showTips = "showNameFlag"
      :showName = "showTipsName"
      :lefts = "tipsLeft"
      :top = "tipsTop"
    ></ShowNameBox>
  </div>
</template>

<script>
// import tooltip from '@/directive/tooltip';
import ShowNameBox from '@/components/manageApp/main/ShowNameBox';

export default {
  name: 'MonitorItem',
  // directives: {
  //   tooltip,
  // },
  components: {
    ShowNameBox,
  },
  model: {
    prop: 'item',
  },
  props: {
    item: {
      type: Object,
      default() {
        return {
          addr: '四川成都市',
          app_name: 'app1',
          dim_sub_trans_type: '成都市',
          dim_subsub_trans_type: '',
          dim_trans_type: '四川',
          intf_name: 'intf2',
          ip: '10.1.34.21', // 监控IP
          name: '银行局域网', // 监控名称
        };
      },
    },
  },
  data() {
    return {
      tipsLeft: 10,
      tipsTop: 0,
      showNameFlag: false, // 提示框
      showTipsName: '',
    };
  },
  methods: {
    delMoniIp() {
      this.$emit('delete');
    },
    checkName(e) {
      const ele = e.target;
      if (ele.clientWidth !== ele.scrollWidth) {
        this.tipsLeft = ele.getBoundingClientRect().left - ele.getBoundingClientRect().width / 2;
        this.tipsTop = ele.getBoundingClientRect().top - 115;
        this.showNameFlag = true;
        this.showTipsName = e.target.innerText;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.col-item{
  display: inline-block;
  height: 26px;
  line-height: 26px;
  text-align: center;

  input{
    height: 26px;
    width: 100%;
  }
}
.col-ip{
  width: 110px;
}

.col-op{
  width: 60px;
}

.del-ip-btn{
  color: #de1414;
}

.list-item{
        height: 32px;
        line-height: 32px;
      }
</style>
