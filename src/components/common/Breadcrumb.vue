<template>
  <div class="breadcrumb-div">
    <ul class="breadcrumb-ul">
      <li v-for="(item,index) in crumbList" :key="index">
        <a :class="{'crumb-link': true, 'crumb-now': item === title || index === crumbList.length - 1}"
           :href="href(item)"
        >
          {{ navMap[item]?navMap[item].text:item }}
        </a>
        <span class="crumb-next" v-if="index !== crumbList.length - 1">&gt;</span>
      </li>
    </ul>
    <div class="breadcrumb-right">
      <slot name="btnGroup"></slot>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import NAVMAP from '@/helpers/navMap';

  export default {
    name: 'breadcrumb',
    props: {
      title: {
        type: String,
        default: '',
      },
      crumbList: {
        type: Array,
        default() {
          return [];
        },
      },
      appName: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        navMap: NAVMAP,
      };
    },
    watch: {},
    computed: {},
    methods: {
      href(item) {
        let link = '#';
        if (_.has(this.navMap, item)) {
          link = this.navMap[item].href;
          link = link.indexOf('app_name') > -1 ? link.replace('app_name', this.appName) : link;
        }
        return link;
      },
    },
  };
</script>

<style lang="scss" scoped>
ul,li{
  margin: 0 auto;
  padding: 0;
}
li{
  list-style-type: none;
}
a{
  text-decoration: none;
}
  .breadcrumb-div{
    padding-left: 35px;
    height: 50px;
    line-height: 50px;
    width: 100%;
    background: #08141b;
    // display: flex;
    // justify-content: space-between;
    // align-content: center;
    box-sizing:border-box;
    z-index: 5;
    .breadcrumb-ul{
      float: left;
    }
    .breadcrumb-right{
      float: right;
    }
    .breadcrumb-ul li{
      float: left;
      font-size: 16px;
      margin: 0 2px;

      .crumb-link,.crumb-next{
        color: #23897C;
      }
      .crumb-link:hover {
        color: #2eb5a4;
      }
      .crumb-now{
        color: #eee;
        pointer-events: none;
      }
    }
  }
</style>
