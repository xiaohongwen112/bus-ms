<template>
  <div class="sub-div">
      <h6>使用说明1. 引入
          <code>@import '../../../../assets/css/iconbms.css';</code>
          2. 添加class
          <code class="lang-css hljs">&lt;
              <span class="hljs-selector-tag">i</span>
              <span class="hljs-selector-tag">class</span>
              ="
              <span class="hljs-selector-tag">iconfont</span>
              <span class="hljs-selector-tag">icon-xxx</span>"&gt;&lt;/
              <span class="hljs-selector-tag">i</span>&gt;
            </code>
      </h6>
      <ul>
          <li class="icon-item"
            v-for="(item, index) in iconList"
            :key="index">
              <div :class="`${item} icon`"></div>
              <div>{{ item }}</div>
          </li>
      </ul>
  </div>
</template>
<script>

export default {
  name: 'IconBms',
  computed: {
    iconList() {
      const iconArr = [
        'icon-bms-schedule',
        'icon-bms-startend',
        'icon-bms-bdarrow',
        'icon-bms-rightarrow',
        'icon-bms-leftarrow',
        'icon-bms-dbleft',
        'icon-bms-dbright',
        'icon-bms-dbup',
        'icon-bms-dbdown',
        'icon-bms-close',
        'icon-bms-about',
        'icon-bms-sysinfo',
        'icon-bms-system',
        'icon-bms-syswarn',
        'icon-bms-password',
        'icon-bms-username',
        'icon-bms-upfill',
        'icon-bms-reportoff',
        'icon-bms-reporton',
        'icon-bms-tobottom',
        'icon-bms-totop',
        'icon-bms-behind',
        'icon-bms-front',
        'icon-bms-logic',
        'icon-bms-reset',
        'icon-bms-timeaxis',
        'icon-bms-add',
        'icon-bms-import',
        'icon-bms-baseline',
        'icon-bms-detect',
        'icon-bms-configure',
        'icon-bms-toleft',
        'icon-bms-toright',
        'icon-bms-logout',
        'icon-bms-timeout',
        'icon-bms-speakeroff',
        'icon-bms-speakeron',
        'icon-bms-database',
        'icon-bms-tridown',
        'icon-bms-wall',
        'icon-bms-topoedit',
        'icon-bms-topo',
        'icon-bms-alert',
        'icon-bms-home',
        'icon-bms-health',
        'icon-bms-heart',
        'icon-bms-delete',
        'icon-bms-path',
        'icon-bms-rename',
        'icon-bms-downfill',
        'icon-bms-up',
        'icon-bms-search',
        'icon-bms-calendar',
        'icon-bms-area',
        'icon-bms-bar',
        'icon-bms-pie',
        'icon-bms-square',
        'icon-bms-more'];
      return iconArr;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../../assets/css/iconbms.css';

.sub-div{
    background: #08111A;
}
ul, ol { list-style: none; }
.icon-item{
    float: left;
    width: 170px;
    height: 180px;
    text-align: center;
}
.icon{
    color: aqua;
    line-height: 50px;
    &:hover{
        font-size: 50px;
    }
}
</style>
