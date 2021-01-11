<template>
    <ul class="operate-group" v-if="Visit">
			<li v-for="(item, index) in dataList" :key="index" class="operate-item" :class="item.styleClass" @click="changeOperate(index)" ref="ope">
        <i class="iconbms" 
        :class="item.icon" v-if="index !== 2"></i>
        <i class="iconbms" 
        :class="item.icon" v-if="index == 2  && dealPathFlag"></i>
        <i class="iconbms" 
        :class="[item.icon, 'notApply']" :style="dealDefault" v-if="!dealPathFlag && index == 2"></i>
        <span class="operate-title">{{item.title}}</span>
			</li>
    </ul>
</template>
<script>
export default {
  props: ['dataList', 'dealPathFlag', 'appName'],
  data() {
    return {
      Visit: true,
      ifApply: true,
    };
  },
  methods: {
    changeOperate(index) {
      if (index === 2 && !this.ifApply) return;
      this.$emit('onClick', index);
    },
  },
  computed: {
    dealDefault() {
      let style = '';
      if (!this.dealPathFlag) {
        style = 'color: #575757';
        this.ifApply = false;
      }
      return style;
    },
  },
  mounted() {
    this.Visit = this.session$.newpermissions.topov_edit;
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/css/iconbms.css';
.iconbms {
  color: #ccc;
  font-size: 30px;
  vertical-align: middle;
  border-radius: 50%;
}
.operate-group {
  >li {
    float: left;
    margin-right: 8px;
    cursor: pointer;
    height: 24px;
  }
}
.operate-title {
  display: none;
  font-size: 14px;
  vertical-align: middle;
}
.operate-title:hover {
  display: inline-block;
}
.iconbms:hover +.operate-title {
  display: inline-block;
}
.notApply:hover +.operate-title{
  display: none;
}


.operate-item{
  position: relative;
  .to-edit{
    display: inline-block;
    position: absolute;
    width: 28px;
    height: 28px;
    top: 0;
    left: 0;
  }
  &.cardMenu{
    font-size: 16px;
    &:nth-child(1) {
      >.iconbms {
        font-size: 22px;
        margin-right: -2px;}
    }
    &:nth-child(2) {
      >.iconbms {
        font-size: 20px;}
    }
    &:nth-child(3) {
      >.iconbms {
        margin-right: 3px;}
    }
    >.iconbms {
    font-size: 18px;
    vertical-align: middle;
    color:#ccc;
    
    &.notApply {
      cursor: auto;
      color: #ddd;
    }}
    &:hover {
      color:#19C1EE;
      >.iconbms {
        color: #19C1EE;
      }
    }
  }
}
</style>


