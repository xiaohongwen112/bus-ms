<template>
  <div class="select-wrap">
    <div class="title" @click="active = !active">
      <span>
        {{ select }}
      </span>
      <i :class="active ? `icon-bms-square` : `icon-bms-more` " ></i>
    </div>
    <div :class="{'nav-options': true, 'max-height': isMaxHeight}" v-show="active">
      <ScrollBar class="area-scroll">
        <a v-for="(item, index) in options" :key="index"
        :class="{'select': item.selected}"
        :href="item.href"
        @click="toggleSelected(index)"
        >
          {{ item.text }}
        </a>
      </ScrollBar>
    </div>
  </div>
</template>
<script>
import ScrollBar from '@/components/common/ScrollBar';

export default {
  name: 'NavSelect',
  components: {
    ScrollBar,
  },
  props: {
    select: {
      type: String,
      default: '--',
    },
    options: {
      type: Array,
      default() {
        return [{
          text: '--',
          href: '#',
        }, {
          text: '--',
          href: '#',
        }];
      },
    },
  },
  data() {
    return {
      active: false,
    };
  },
  computed: {
    isMaxHeight() {
      return this.options.length > 10;
    },
  },
  methods: {
    toggleSelected(index) {
      if (this.select === '服务器IP') {
        this.$store.commit('TOGGLE_SERVERIP', this.options[index].text);
      }
      this.active = false;
    },
  },
};
</script>
<style lang="scss" scoped>
  @import '../../assets/css/iconbms.css';
  .title, .nav-options{
    width: 120px;
    background-color: #09232b;
    color: #32d7c6;
    font-size: 16px;
    text-align: center;
  }
  .title{
    height: 24px;
    line-height: 24px;
    border: 1px solid #071b2d;
    box-sizing: border-box;
    user-select: none;
    cursor: pointer;
    img{
      width: 12px;
    }
    i{
      font-size: 13px;
      color:  #31ccc0;
      float: right;
      line-height: 24px;
      margin-right: 20px;
    }
  }
  .nav-options{
    margin-top: 10px;
    .area-scroll{
      width: 100%;
      height: 100%;
    }
    a{
      display: block;
      width: 100%;
      height: 30px;
      line-height: 30px;
      color: #32d7c6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    a:link, a:hover, a:visited, a:active{
      text-decoration: none;
    }
    a:hover, .select{
      background-color: #31ccc0;
      color: #09232b;
    }
  }
  .max-height{
    height: 350px;
  }
</style>
