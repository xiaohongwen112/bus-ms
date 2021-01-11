<template>
  <div class="all-alert">
    <div class="all-name">告警平均恢复时间</div>
    <div class="alert-type-list">
      <div class="alert-type-div" v-for="(val, key, index) in alertInfo">
        <div class="alert-type">{{alertIndex[key]}}</div>
        <div v-if="val!=='null'" class="alert-time" v-html="timeStamp(val).time"></div>
        <div v-else class="alert-time">--</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props: ['alertInfo'],
    data() {
      return {
        alertIndex: {
          baseline_alert: '基线告警',
          system_alert: '系统告警',
          health_alert: '健康度告警',
        },
      };
    },
    methods: {
      timeStamp(secondTime) {
        let time = '';
        let style = '';
        if (secondTime) {
          if (parseInt(secondTime, 10) > 60) {
            const second = parseInt(secondTime, 10) % 60;
            let min = parseInt(secondTime / 60, 10);
            time = `<span class="alert-num">${min}</span><span class="alert-unit">分钟</span>${
                  second > 0 ? `<span class="alert-num">${second}</span><span class="alert-unit">秒</span>` : ''}`;
            if (min > 60) {
              min = parseInt(secondTime / 60, 10) % 60;
              let hour = parseInt(parseInt(secondTime / 60, 10) / 60, 10);
              time = `<span class="alert-num">${hour}</span><span class="alert-unit">小时</span>${
                    (second === 0 && min === 0) ? '' : `<span class="alert-num">${min}</span><span class="alert-unit">分钟</span>`
                    }${second === 0 ? '' : `<span class="alert-num">${second}</span><span class="alert-unit">秒</span>`}`;
              style = 'orange';
              if (hour > 24) {
                hour = parseInt(parseInt(secondTime / 60, 10) / 60, 10) % 24;
                const day = parseInt(parseInt(parseInt(secondTime / 60, 10) / 60, 10) / 24, 10);
                time = `<span class="alert-num">${day}</span><span class="alert-unit">天</span>` +
                        `<span class="alert-num">${hour}</span><span class="alert-unit">小时</span>` +
                        `<span class="alert-num">${min}</span><span class="alert-unit">分钟</span>` +
                        `<span class="alert-num">${second}</span><span class="alert-unit">秒</span>`;
                style = 'red';
              }
            }
          } else {
            time = `<span class="alert-num">${secondTime}</span><span class="alert-unit">秒</span>`;
          }
        } else {
          time = '--';
        }
        return {
          time,
          style,
        };
      },
    },
  };
</script>

<style lang="scss">
  .alert-time{
    .alert-num{
      font-size: 20px;
    }
    .alert-unit{
      font-size: 14px;
    }
  }
</style>
<style lang="scss" scoped>
  .all-alert{
    width: calc(100% - 92px);
    height: 148px;
    margin: 15px 45px;
    background: #0a1925;
    border: 1px solid #0f3f62;
    .all-name{
      height: 32px;
      line-height: 32px;
      width: 185px;
      padding-left: 18px;
      font-size: 16px;
      background: url(../../assets/alertRecovery/alertRecoveryBg.png) no-repeat center;
      background-size: 100% 100%;
    }
    .alert-type-list{
      height: calc(100% - 32px);
      display: flex;
      align-content: center;
      justify-content: space-between;
      padding: 0 50px;
      .alert-type-div{
        width: 150px;
        .alert-type{
          color: #98cdef;
          height: 50px;
          line-height: 64px;
          font-size: 16px;
        }
        .text-ellipsis{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .recovery-time-div{
          text-align: center;
          height: calc(100% - 20px);
          color: #dfebf2;
          font-size: 16px;
          font-weight: 400;
          line-height: 2em;
          &.orange {
            color: #eb932c!important;
          }
          &.red {
            color: #e83e1c!important;
          }
        }
      }
    }
  }
</style>