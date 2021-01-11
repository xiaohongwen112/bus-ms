<template>
  <div class="nav-bar-div">
    <div class="nav-tit" v-if="title!=''">{{ navMap[title]?navMap[title].text:title }}</div>
    <div class="nav-tit" v-else>
      <slot name="slot-content"></slot>
    </div>
    <div class="nav-btn-group">
      <a :class="'nav-link nav-link-' + index" v-for="(item, index) in nav" :key="index"
         :href="navMap[item].href.indexOf('app_name') > -1 ? navMap[item].href.replace('app_name', appName) : navMap[item].href"
         @mouseover="activeIndex = index"
         @mouseout="finalIndex()"
         @click="clickMore(item, index)"
         ref="navLinks"
      >
        <img :src="iconLink(navMap[item].icon)" class="nav-icon" :class="`nav-${navMap[item].icon}`">
        <transition name="nav" :duration="2000" @leave="leave">
          <span class="nav-tip" v-show="activeIndex === index">{{ item !== 'report' ? navMap[item].text : '报表' }}</span>
        </transition>
      </a>
    <ul class="more-list" :style="`left:${leftPosition}px;width:${widthPosition}px;`" v-show="showApp">
      <li v-for="(item, index) in manageAppItem" :key="index" v-if="item.disable">
        <a :href="navMap[item.name].href" v-if="item.disable">
          <span>{{ item.name === 'manageapp' ? '业务系统' : navMap[item.name].text }}</span>
        </a>
      </li>
    </ul>
    <ul class="more-list" :style="`left:${leftPosition}px;width:${widthPosition}px;`"  v-show="showAlert">
      <li v-for="(item, index) in alertItem" :key="index" v-if="item.disable">
        <a :href="navMap[item.name].href" v-if="item.disable">
          <span>{{ item.name === 'alert' ? '告警详情' : '运维效率' }}</span>
        </a>
      </li>
    </ul>
    <ul class="more-list" :style="`left:${leftPosition}px;width:${widthPosition}px;`"  v-show="showBaseConfig">
      <li v-for="(item, index) in configItem" :key="index" v-if="item.disable">
        <a :href="navMap[item.name].href" v-if="item.disable">
          <span>{{ navMap[item.name].text }}</span>
        </a>
      </li>
    </ul>
    <ul class="more-list" :style="`left:${leftPosition}px;width:${widthPosition}px;`"  v-show="showMore">
      <li v-for="(item, index) in moreItems" :key="index" v-if="item.disable">
        <a :href="navMap[item.name].href">
          <!--<img :src="iconLink(navMap[item].icon)">-->
          <span>{{ navMap[item.name].text }}</span>
        </a>
      </li>
    </ul>
    </div>
    <!-- 这里用于全局检测lisence -->
    <GlobalChack></GlobalChack>
  </div>
</template>

<script>
  // import _ from 'lodash';
  import NAVMAP from '@/helpers/navMap';
  import { navIconUrl } from '@/helpers/utils';
  import GlobalChack from '@/components/common/GlobalCheckLicense'; // 用于全局检查license浏览和时间，不用可删除。

  export default {
    name: 'nav-bar',
    components: { GlobalChack },
    props: {
      title: {
        type: String,
        default: '',
      },
      appName: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        navMap: NAVMAP,
        activeIndex: -1,
        showApp: false,
        showAlert: false,
        showBaseConfig: false,
        showMore: false,
        manageAppItem: [
          { name: 'manageapp', disable: true },
          { name: 'indexcustomview', disable: true },
        ],
        alertItem: [
          { name: 'alert', disable: true },
          { name: 'alertrecovery', disable: true },
        ],
        configItem: [
          { name: 'alertmanage', disable: true },
          { name: 'protocol', disable: true },
          { name: 'indicatormanage', disable: true },
        ],
        moreItems: [{ name: 'sysconfig', disable: true },
        { name: 'authmanage', disable: true },
        { name: 'spdindex', disable: true },
        { name: 'logout', disable: true },
        ],
        nav: ['index', 'appmore', 'alertmore', 'report', 'baseconfig', 'indexmore'],
        alertFlag: false,
        reportFlag: false,
        configFlag: false,
        leftPosition: 0,
        widthPosition: 0,
      };
    },
    watch: {
      activeIndex() {
        this.hideMore();
      },
    },
    computed: {
      finalManageList() {
        // if (!this.alertFlag && !this.reportFlag) return 'alert-report-manage';
        // if (!this.alertFlag || !this.reportFlag) return 'alert-report';
        return '';
      },
    },
    methods: {
      finalIndex() {
        this.activeIndex = -1;
        if (this.showApp) this.activeIndex = 1;
        if (this.showAlert) this.activeIndex = 2;
        if (this.showBaseConfig) this.activeIndex = 4;
        if (this.showMore) this.activeIndex = 5;
      },
      clickMore(item, index) {
        if (['appmore', 'alertmore', 'baseconfig', 'indexmore'].includes(item)) {
          switch (item) {
            case 'appmore':
              this.showApp = !this.showApp;
              break;
            case 'alertmore':
              this.showAlert = !this.showAlert;
              break;
            case 'baseconfig':
              this.showBaseConfig = !this.showBaseConfig;
              break;
            case 'indexmore':
              this.showMore = !this.showMore;
              break;
            default:
              break;
          }
          this.finalIndex();
        }
        this.$nextTick(() => {
          this.leftPosition = document.getElementsByClassName(`nav-link-${index}`)[0].offsetLeft;
          this.widthPosition = document.getElementsByClassName(`nav-link-${index}`)[0].offsetWidth;
        });
      },
      hideMore() {
        this.showApp = false;
        this.showAlert = false;
        this.showBaseConfig = false;
        this.showMore = false;
      },
      leave(el, done) {
        if (this.activeIndex === this.nav.length - 1 && this.showMore) {
          done();
        }
      },
      iconLink(name) {
        return navIconUrl(name);
      },
    },
    mounted() {
      // const sArr = [];
      // const visitArr = ['alert_conf_detail', 'manage_user_detail', 'alert_detail', 'index_manage_detail', 'decode_conf_detail', 'spd_path_diagram_detail'];
      // const newper = this.session$.newpermissions;
      // _.forEach(this.moreItems, (item, index) => {
      //   const items = _.cloneDeep(item);
      //   const numArr = [2, 3, 4, 5];
      //   if (numArr.indexOf(index) !== -1) {
      //     items.disable = newper[visitArr[index]];
      //     if (newper[visitArr[index]]) sArr.push(items);
      //   } else sArr.push(items);
      // });
      // this.moreItems = _.cloneDeep(sArr);
      this.moreItems[2].disable = this.session$.newpermissions.spd_path_diagram_detail;
      const VisitAlert = this.session$.newpermissions;
      this.manageAppItem[1].disable = VisitAlert.trade_overview_detail;
      this.configItem.forEach((item, index) => {
        switch (item.name) {
          case 'alertmanage':
            this.configItem[index].disable = VisitAlert.alert_contacter_detail || VisitAlert.alert_msgconf_detail || VisitAlert.rule_template_detail || VisitAlert.rule_list_detail;
            break;
          case 'protocol':
            this.configItem[index].disable = VisitAlert.decode_conf_detail;
            break;
          case 'indicatormanage':
            this.configItem[index].disable = VisitAlert.index_manage_detail;
            break;
          default:
            break;
        }
        if (item.disable) this.configFlag = true;
      });
      this.configFlag ? this.$refs.navLinks[4].style.display = 'flex' : this.$refs.navLinks[4].style.display = 'none'; // eslint-disable-line
      this.alertItem.forEach((item, index) => {
        if (item.name === 'alert') this.alertItem[index].disable = VisitAlert.alert_detail;
        else this.alertItem[index].disable = VisitAlert.alert_recov_time_detail;
        if (item.disable) this.alertFlag = true;
      });
      this.alertFlag ? this.$refs.navLinks[2].style.display = 'flex' : this.$refs.navLinks[2].style.display = 'none'; // eslint-disable-line
      this.reportFlag = VisitAlert.statement_detail;
      this.reportFlag ? this.$refs.navLinks[3].style.display = 'flex' : this.$refs.navLinks[3].style.display = 'none'; // eslint-disable-line
      const self = this;
      window.document.addEventListener('click', (e) => {
        if (
          (self.showMore && !self.$refs.navLinks[5].contains(e.target)) ||
          (self.showApp && !self.$refs.navLinks[1].contains(e.target)) ||
          (self.showAlert && !self.$refs.navLinks[2].contains(e.target)) ||
          (self.showBaseConfig && !self.$refs.navLinks[4].contains(e.target))
        ) {
          self.hideMore();
          self.activeIndex = -1;
        }
      });
    },
  };
</script>

<style lang="scss" scoped>
a{
  text-decoration: none;
}
ul,li{
  margin: 0 auto;
  padding: 0;
}
.nav-bar-div{
  width: 100%;
  height: 44px;
  line-height: 44px;
  border-bottom: solid 1px #14446A;
  background: #050c12;
  color: #B9CFE1;
  display: flex;
  justify-content: space-between;
  align-content: center;
  position: relative;

  .nav-tit{
    width: calc(100% - 100px);
    position: absolute;
    text-align:center;
    font-size: 32px;
    height: 100%;
  }

  .nav-btn-group{
    position: absolute;
    right: 10px;
    display: flex;

    .nav-link{
      display: flex;

      .nav-icon{
        height: 44px;
        width: 45px;
        &.nav-base-config, &.nav-report{
          padding: 7px;
          box-sizing: border-box;
        }
      }

      .nav-tip{
        font-size: 16px;
        color: #31b1ad;
        margin: 0 10px 0 0px;
      }

      .nav-enter-active, .nav-leave-active {
        display: inline-block;
      }

      .nav-enter, .nav-leave-to {
        display: none;
      }
    }
  }

  .more-list{
    position: absolute;
    top: 44px;
    right: 0;
    width: 100px;
    background: #132d42;
    z-index: 10;
    margin: 0;
    &.manage-list{
      right: 193px;
    }
    li{
      height: 44px;
      line-height: 44px;
      color: #4cbbad;
      display: flex;
      align-items: center;
      font-size: 16px;
      width: 100%;

      a{
        text-align: center;
        width: 100%;
        color: #4cbbad;
        text-decoration: none;

        img{
          width: 26px;
          vertical-align: -7px;
        }
      }
      .dis-span{
        cursor: default;
        padding-left: 15px;
        width: 100%;
        color: #fff;
        text-decoration: none;

        img{
          width: 26px;
          vertical-align: -7px;
        }
        &:hover{
          background: #666;
        }
      }
    }

    li:hover{
      background: #2b4b64;
    }
  }
}
</style>
