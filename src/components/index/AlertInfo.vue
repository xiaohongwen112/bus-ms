<template>
  <ul class="alert-info-list">
    <li v-for="(item, index) in data" :key="index" :class="getClass(item)">
      <span class="danger-img"></span>
      <a href="#">{{ getInfo(item) }}</a>
      <span class="check-img-span" @click="checkAlert(item.ts_sys, index)" v-if="!item.hascheck"><img src="../../assets/index/alert-check.svg"></span>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'alert-info',
    props: {
      data: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {};
    },
    watch: {},
    computed: {},
    methods: {
      getInfo(item) {
        let tsStart = new Date(item.ts_start * 1000);
        tsStart = `${tsStart.toLocaleDateString().replace(/\//g, '-')} ${tsStart.toTimeString().substr(0, 8)}`;
        return `${item.event.join('，')}（${item.source.map(d => d.value).join('：')}） ${tsStart}`;
      },
      getClass(item) {
        return item.hascheck ? 'danger-checked' : `danger-score${Math.ceil(item.danger_score / 20)}`;
      },
      checkAlert(ts, index) {
        this.$emit('checkAlert', { ts, index });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .alert-info-list{
    /*overflow-x: hidden;*/
    /*overflow-y: auto;*/
    /*position: relative;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*bottom: 30px;*/
    /*height: calc(100% - 30px);*/
    /*width: 100%;*/

    li{
      height: 32px;
      line-height: 32px;
      padding: 0 5%;

      .danger-img{
        margin-top: 5px;
        display: inline-block;
        margin-right: 5px;
        width: 20px;
        height: 20px;
        background: url(../../assets/index/alert-red.svg);
        background-size: 100% 100%;
        float: left;
      }

      .check-img-span{
        display: inline-block;
        float: right;
        cursor: pointer;
        width: 12px;
        height: 32px;
        line-height: 24px;

        img{
          display: inline-block;
          margin: 15px 0;
        }
      }
    }

    li:hover{
      /* border-left: 3px solid #29598f; */
      background: #0f1c25;
    }

    .danger-checked{
      a {
        color: #666;
      }
      .danger-img {
        background: url(../../assets/index/alert-gray.svg);
        background-size: 100% 100%;
      }
    }

    .danger-score5 a {
      color: #d9534f;
    }
    .danger-score4 a {
      color: #c9605e;
    }
    .danger-score3 a {
      color: #b57172;
    }
    .danger-score2 a {
      color: #9d8388;
    }
    .danger-score1 a {
      color: #88949c;
    }
    .danger-score0 a {
      color: #76A2AD;
    }
  }
</style>
