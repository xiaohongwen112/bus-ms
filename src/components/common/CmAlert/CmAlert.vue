<template>
  <div v-show="switchStatus&&alertShow">
    <div class="alert-wrapper"></div>
    <div class="malfunction-box">
      <div class="malfunction-container">
        <div class="malfunction-inner"><a href="/zh-cn/alert/">故障定位</a></div>
        <span class="malfunction-icon alert-close" @click="alertShow = false"><img src="../../../assets/common/warn-close.svg"/></span>
        <span class="malfunction-icon alert-set" @click="showMenu = !showMenu"><img src="../../../assets/common/warn-set.svg"/></span>    
      </div>
      <div class="warn-menu" v-show="showMenu">
        <ul class="full-warn-ul">
          <li v-for="(item, index) in settings" :key="`alert-btn-${index}`"><a class="warn-menu-a" :name="item.name" @click="setAlert(item.name)">{{item.text}}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import * as d3 from 'd3';
  import Bus from '@/helpers/bus';
  import * as api from './index';

  export default {
    data() {
      return {
        switchStatus: false,
        alertShow: '',
        alertResult: '',
        showMenu: false,
        settings: [
          { name: '1', text: '1小时内不显示' },
          { name: '24', text: '1日内不显示' },
          { name: '168', text: '1周内不显示' },
          { name: '720', text: '1月内不显示' },
        ],
      };
    },
    methods: {
      async getData() {
        try {
          const res = await api.getData();
          if (res.data.code === 0) {
            const config = res.data.data.config;
            const status = config.status === 'on' || config.status === 'true';
            this.switchStatus = status;
          }
          if (status) {
            this.getAlertInfo();
          }
        } catch (e) {
          console.log(e);
        }
      },
      async getAlertInfo() {
        try {
          const res = await api.getAlertInfo();
          if (res.data.code === 0) {
            const warnTips = res.data.data;
            if (warnTips.length !== 0) {
              let sd = false;
              for (let i = 0; i < warnTips.length; i += 1) {
                const sumd = warnTips[i].danger_score;
                if (sumd === 100) {
                  sd = true;
                }
              }
              if (sd) {
                this.alertShow = true;
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      },
      async updateAlert() {
        try {
          const res = await api.updateAlert(this.alertShow);
          if (res.data.code === 0) {
            if (res.data.data.status === 1) {
              this.switchStatus = !this.switchStatus;
            }
          }
        } catch (e) {
          console.log(e);
        }
      },
      async setAlert(name) {
        try {
          const res = await api.setAlert(name);
          if (res.data.code === 0) {
            if (res.data.data.status === 1) {
              this.switchStatus = !this.switchStatus;
              this.alertShow = true;
              d3.select('.warn-menu').style('display', 'none');
            }
          }
        } catch (e) {
          console.log(e);
        }
      },
    },
    created() {
      this.getData();
      this.getAlertInfo();
      Bus.$on('onSwitchChange', val => { // eslint-disable-line
        this.alertShow = val;
        this.updateAlert();
        this.getData();
      });
    },
    destroyed() {
      Bus.$off('onSwitchChange');
    },
    mounted() {
      window.setInterval(this.getData, 10000);
    },
  };
</script>
<style lang="scss" scoped>
  .alert-wrapper{
    width: 100%;
    height: 100%;
    z-index: 100;
    -webkit-box-shadow: inset 0 0 300px #CB4B36;
    -moz-box-shadow: inset 0 0 300px #CB4B36;
    box-shadow: inset 0 0 300px #CB4B36;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 100;
    -webkit-transform: translate3d(0,0,0);
    -webkit-animation: warn-animate 1s infinite linear;
    -moz-animation: warn-animate 1s infinite linear;
    -ms-animation: warn-animate 1s infinite linear;
  }
  .malfunction-box{
    position: absolute;
    width: 152px;
    height: 152px;
    right: 60px;
    bottom: 60px;
    z-index: 100;
    &:hover{
      .warn-menu{
        display:inline-block;
      }
    }
    .malfunction-container{
      width: 152px;
      height: 152px;
      border-radius: 50%;
      position: absolute;
      -webkit-box-shadow: 0 0 30px #CB4B36;
      -moz-box-shadow: 0 0 30px #CB4B36;
      box-shadow: 0 0 30px #CB4B36;
      text-align: center;
      line-height: 152px;
      font-size: 24px;
      color: #EEECED;
      .malfunction-inner{
        width: 142px;
        height: 142px;
        border-radius: 50%;
        position: absolute;
        background: -webkit-radial-gradient(rgba(205,69,29,.8), rgba(135,33,18,.8));
        background: -o-radial-gradient(rgba(205,69,29,.8), rgba(135,33,18,.8));
        background: -moz-radial-gradient(rgba(205,69,29,.8), rgba(135,33,18,.8));
        background: radial-gradient(rgba(205,69,29,.8), rgba(135,33,18,.8));
        text-align: center;
        line-height: 142px;
        font-size: 22px;
        margin: 5px;
        >a{
          color: #EEECED;
        }
      }
      .malfunction-icon{
        cursor:pointer;
        &.alert-close{
          width: 50px;
          height: 50px;
          position: absolute;
          right: 0;
          bottom: 160px;
          display: none;
        }
        &.alert-set{
          width: 40px;
          height: 40px;
          position: absolute;
          right: 15px;
          bottom: 40px;
          display: none;
        }
      }
      &:hover .alert-close,&:hover .alert-set{
        display:inline-block;
      }
    }
    .warn-menu{
      display:none;
      .full-warn-ul{
        .warn-menu-a{
          width: 110px;
        }
      }
    }
  }
</style>