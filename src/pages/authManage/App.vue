<template>
  <div id="app">
    <NavBar :title="'authmanage'" />
    <Tabs class="auth-tabs" :list="authNavList" :active="navActiveIndex"
      @click="toggleNavActive"/>
    <keep-alive>
      <router-view class="container"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import _ from 'lodash';
import NavBar from '@/components/common/NavBar';
import { Tabs } from '@/components/basic/index';
import { authNavList } from './utils';

export default {
  name: 'app',
  components: {
    NavBar,
    Tabs,
  },
  data() {
    return {
      authNavList,
      navActiveIndex: 0,
    };
  },
  computed: {
    // authNavList() { return authNavList; },
  },
  methods: {
    toggleNavActive(data) {
      // console.log(data.data.key);
      this.navActiveIndex = data.index;
      this.$router.push({ name: data.data.key });
    },
  },
  mounted() {
    const newper = this.session$.newpermissions;
    const newArr = [];
    const visNameArr = ['manage_domain_detail', 'manage_role_detail', 'manage_user_detail', 'Visit_User'];
    _.forEach(this.authNavList, (item, index) => {
      if (index !== 3) {
        if (newper[visNameArr[index]]) newArr.push(item);
      } else newArr.push(item);
    });
    this.authNavList = newArr;
    // console.log(this.$route.name);
    // if (!['超级管理员', '二级管理员'].includes(this.session$.rolename)) {
    //   this.authNavList = [this.authNavList[3]];
    // } else {
    //   this.$router.push({ name: this.authNavList[0].key });
    // }
    // 容错
    this.navActiveIndex = _.findIndex(this.authNavList, { key: this.$route.name });
    // if (this.navActiveIndex === -1) {
    //   this.navActiveIndex = 0;
    // }
  },
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
}

body {
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-family: "Noto Sans S Chinese", "SourceHanSansCN-Normal", sans-serif !important;
  color: #f3f3f3;
  margin: 0;
  padding: 0;
  background-color: #09131C;
}
.add-icon{
  display: inline-block;
  width: 15px;
  height: 15px;
  vertical-align: middle;
  margin: 0 5px 3px 0;
  background: url(../../assets/common/add.svg) no-repeat center;
}
.operation{
  color: #4ab2a5;
  .delete{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    color: #d04631;
  }
  .delete-enable{
    color: rgb(84, 84, 84);
    cursor: default;
  }
}


a {
  text-decoration: none;
  cursor: pointer;
}

a:hover {
  text-decoration: none;
}

ul li {
  list-style: none;
}

.auth-tabs{
  margin-top: 15px;
}

.container {
  position: absolute;
  top: 105px;
  bottom: 0;
  left: 15px;
  right: 10px;
}

input[type="checkbox"]{
  height: 14px;
  vertical-align: middle;
  width: 14px;
  border: 1px solid #278c89;
  border-radius: 3px;
  margin: 0 4px;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;
  margin-bottom: 2px;
  &:checked{
    background: #139d8c url(../../assets/common/checked.svg) 1px center;
    background-size: 180% 180%;
    background-position-x: -4.5px;
  }
}

</style>
