<template>
  <config-box :tabs="tabs" :width='790' :height='500' :scrollheight="scrollheight" :onlyConfirm="onlyConfirm"
    @closeConfig="close">
    <div slot="detail">
      <div class="role-info">
        <div class="user-info">
          <div class="proImg">用户</div>
          <div class="perssion">
            <div class="perssion-head" v-for="(item, index) in data.user_detail" :key="index">
              <span><i class="head-circle"></i>{{item}}</span>
            </div>
            <div class="no-user" v-if="data.user_detail.length === 0">暂无用户</div>
          </div>
        </div>
        <div class="perssion-info">
          <div class="proImg">功能操作权限</div>
          <div class="perssion-box">
            <div class="perssion" v-for="(item, index) in data.per_detail" :key="index">
              <div class="perssion-head">
                <span><i class="head-circle"></i>{{item.model}}</span>
                <span class="toggle"></span>
              </div>
              <div class="perssion-main">
                <div class="perssion-content" v-for="(x, i) in item.func" :key="i">
                  <div class="each-perssion">
                    <span class="perssion-title">
                      <i class="perssion-index">{{i + 1}}</i>{{x.function}}
                    </span>
                    <span class="each-opration" v-for="(p, l) in x.permision" :key="l">{{p}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </config-box>
</template>

<script>
  import configBox from '@/components/basic/ConfigBox';

  export default {
    components: { configBox },
    props: {
      data: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        tabs: [
          { id: 'detail', text: '权限详情' },
        ],
        scrollheight: 410,
        onlyConfirm: true,
      };
    },
    methods: {
      close() {
        this.$emit('onClose');
      },
    },
  };
</script>
<style lang="scss">
.role-manage{
  .config-container{
    .config-main{
      width: 720px !important;
      .nav-content{
        box-sizing: border-box;
      }
    }
    .content {
      .nav-content{
        // height: calc(100% - 63px) !important;
        overflow-y: auto;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.role-info{
  .perssion-info, .user-info{
    .perssion-box{
      margin: 10px 0;
      border: 1px solid #223f5d;
    }
    .perssion{
      margin: 10px 0;
      .no-user{
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #666;
      }
      .perssion-head{
        width: 100%;
        height: 40px;
        line-height: 38px;
        color: #f0f4f7;
        box-sizing: border-box;
        padding: 0 20px;
        margin: 4px 0 3px 0;
        .head-circle{
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          margin-bottom: 2px;
          margin-right: 10px;
          box-shadow: 0 0 3px #14cef5;
          background-color: #14cef5;
        }
      }
      .perssion-content{
        width: 50%;
        display: inline-block;
        box-sizing: border-box;
        padding-left: 30px;
        .each-perssion{
          height: 28px;
          line-height:28px;
          font-size: 12px;
          color: #c6ccd0;
          .perssion-title{
            display: inline-block;
            width: 150px;
            .perssion-index{
              display: inline-block;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background-color: #20639b;
              color: #d6e2eb;
              text-align: center;
              font-size: 12px;
              line-height: 13px;
              font-style: normal;
              margin-right: 5px;
            }
          }
          .each-opration{
            color: #0d9dd0;
            margin-right: 15px;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .user-info{
    .perssion{
      border: 1px solid #223f5d;
      padding-left: 10px;
      .perssion-head{
        display:inline-block;
        width: 25%;
        color: #ddd;
        border: none;
      }
    }
  }
  .proImg {
    position: relative;
    font-size: 16px;
    color: #14cef5;
    vertical-align: middle;
    &:after {
      content: '';
      background: url("../../../assets/common/tag.png") 0 0 no-repeat;
      position: absolute;
      left: -15px;
      top: 5px;
      width: 10px;
      height: 12px;
    }
  }
}
</style>