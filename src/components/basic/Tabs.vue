<template>
  <div>
    <nav>
      <a class="link" v-for="(nav, index) in list" :key="index"
      v-text="nav.name"
      :class="{'active': active === index}"
      :style="{'z-index': active === index ? len + 1 : len - index}"
      @click="toggleNavActive(index, nav)"
      ></a>
    </nav>
    <div class="nav-bottom" :style="{'width': `${130 * len + 1}px`}"></div>
  </div>
  
</template>


<script>
export default {
  name: 'Tabs',
  props: {
    list: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    len() { return this.list.length; },
  },
  methods: {
    toggleNavActive(index, nav) {
      // console.log({
      //   index,
      //   data: nav,
      // });
      // this.active = index;
      this.$emit('click', {
        index,
        data: nav,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
nav{
  margin-left: 27px;
  display: flex;
  text-align: center;
  a.link{
    position: relative;
    width: 170px;
    color: white;
    height: 30px;
    line-height: 30px;
    // line-height: 30px;
    // background-color: #4ab2a5;
    background-image: url(../../assets/common/nav-bg-default.png);
    margin-left: -40px;
    // border-bottom: solid 2px #4ab2a5;
    &:first-child {
      // width: 140px;
      background-image: url(../../assets/common/nav-bg-first.png);
      // margin-left: 0;
    }
  }
  .active{
    background-image: url(../../assets/common/nav-bg-default-active.png);
  }
  a:first-child.active{
    background-image: url(../../assets/common/nav-bg-first-active.png);
  }
}
.nav-bottom{
    // width: 100%;
    // height: 2px;
    // background-color: #4ab2a5;
    margin-left: 16px;
    height: 0;
    border-bottom: solid 2px #4ab2a5;
  }
</style>

