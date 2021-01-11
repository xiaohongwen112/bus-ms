<template>
  <div class="recover-content">
    <NavBar title="alertrecovery" />
    <div class="alert-recovery-content">
      <Breadcrumb title="alertrecovery" :crumbList="crumbList" />
      <AllAlert :alertInfo="alertInfo"></AllAlert>
      <div class="app-alert-div">
        <ScrollBar class="scroll-area" :options="{useBothWheelAxes: true}">
            <div class="per-app-div" v-for="(value, key, index) in alertlist" :key="index">
              <div class="app-name-div text-ellipsis" @mouseover="showTip($event, key)" @mouseout="hideTip">{{key}}</div>
              <div class="intf-list-div">
                <InfoCard v-for="(value_c, key_c, index_c) in value" :alerts="value_c" :index="key_c" :key="index_c"></InfoCard>
              </div>
            </div>
        </ScrollBar>
      </div>
    </div>
    <ShowNameBox 
      :showTips = "showNameFlag"
      :showName = "showTipsName"
      :lefts = "tipsLeft"
      :top = "tipsTop"
    ></ShowNameBox>
  </div>
</template>

<script>
  import { NavBar, Breadcrumb, ScrollBar } from '@/components/common';
  import { AllAlert, InfoCard } from '@/components/alertRecovery';
  import ShowNameBox from '@/components/manageApp/main/ShowNameBox';
  import { textWidth } from '@/helpers/utils';
  import {
    getAlerts,
  } from './service';

  export default {
    components: { NavBar, Breadcrumb, ScrollBar, AllAlert, InfoCard, ShowNameBox },
    data() {
      return {
        crumbList: ['index', 'alertrecovery'],
        alertInfo: {},
        alertlist: {},
        showNameFlag: false, // 提示框
        showTipsName: 'tishi111',
        tipsLeft: 10,
        tipsTop: 0,
      };
    },
    methods: {
      async getAlerts() {
        try {
          const res = await getAlerts();
          if (res.data.code === 0) {
            const data = res.data.data;
            this.alertInfo = data.count;
            this.alertlist = data.alertlist;
          }
        } catch (e) {
          console.log(e);
        }
      },
      showTip(e, name) {
        if (textWidth(name) >= 32) {
          const ele = e.target.parentNode;
          const position = {
            left: ele.getBoundingClientRect().left,
            top: ele.getBoundingClientRect().top,
            tipName: name,
          };
          this.showNameFlag = true;
          this.showTipsName = position.tipName;
          this.tipsLeft = position.left;
          this.tipsTop = position.top;
        }
      },
      hideTip() {
        this.showNameFlag = false;
      },
    },
    created() {
      this.getAlerts();
    },
  };
</script>

<style lang="scss" scoped>
.recover-content{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 4px;
  .alert-recovery-content{
    height: calc(100% - 45px);
    width: 100%;
    .app-alert-div{
      height: calc(100% - 230px);
      width: 100%;
      .scroll-area {
        position: relative;
        width: 100%;
        height: 100%;
      }
      .per-app-div{
        background: #0d1f32;
        margin: 5px 0;
        padding: 20px 45px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        &:nth-child(odd){
          .app-name-div{
            background: #217cd2;
          }
        }
        &:nth-child(even){
          .app-name-div{
            background: #2cb24e;
          }
        }
        .app-name-div{
          width: 148px;
          height: 52px;
          line-height: 52px;
          padding: 0 10px;
          text-align: center;
          color: #eee;
          border: 1px solid rgba(255,255,255,.3);
          border-radius: 3px;
          font-size: 22px;
          margin-top: 10px;
        }
        .text-ellipsis{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .intf-list-div{
          height: auto;
          margin-left: 24px;
          width: calc(100% - 234px);
        }
      }
    }
  }
}
</style>