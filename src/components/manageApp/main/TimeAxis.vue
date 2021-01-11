<template>
<div>
   <svg width="644" height="60" class="manageAppTimeAxis" v-if="!data.hour">
      <g class="hourContent">
        <rect x="0" y="0" width="644" height="30" class="hourBg" stroke="red" stroke-width="0">
        </rect>
      <g class="hourGroup banTimeClick" v-for="(one, index) in 24" :key="index" :class="[`clock${index}`]">
        <rect :x="(644 / 24) * index" y="0" class="minuteRect" fill="transparent" :width="(644 / 24)" height="32"></rect>
        <circle :cx="(644 / 24) * index + ((644 / 24) / 2)" cy="14" r="1.5" class="hourPoint" fill="grey"></circle>
      </g>
    </g>
    <g class="minuteContent">
      <rect x="0" y="32" width="646" height="31" class="minuteBg"></rect>
       <g class="minuteGroup banTimeClick" v-for="(item, index) in 60" :key="index" :class="[`min${index}`]">
        <rect :x="(644 / 60) * index" y="32" class="minuteRect" fill="transparent" :width="(644 / 60)" height="32"></rect>
        <circle :cx="(644 / 60) * index + (644 / 60 / 2)" cy="48" r="1.5"  class="minutePoint minuteSmallPoint" v-if="index % 5 !== 0"></circle>
        <text class="minutePointText" :x="(644 / 60) * index + (644 / 60 / 2)" y="53" style="font-size:12px;" fill="#fff;" v-if="index % 5 === 0">{{index}}</text>
      </g>
    </g>
  </svg> 
  <svg width="644" height="60" class="manageAppTimeAxis" v-if="data.hour">
      <g class="hourContent" @mouseenter="hourRedBg = 0"  @mousemove="alertH">
        <rect x="0" y="0" width="644" height="30" class="hourBg" stroke="red" :stroke-width="[`${hourRedBg}`]">
        </rect>
      <g class="hourGroup" 
        v-for="(one, index) in data.hour" 
        :key="index" 
        :class="[`clock${index}`,{'banTimeClick':one.finished === 'none'}, {'has_alert': one.has_alert}, {'has_click': one.isClick}]"
        @click="getHourTime(one, index)">
        <rect :x="(644 / 24) * index" y="0" class="minuteRect" fill="transparent" :width="(644 / 24)" height="32"></rect>
        <circle :cx="(644 / 24) * index + ((644 / 24) / 2)" cy="14" r="1.5" class="hourPoint" fill="grey"></circle>
        <text :x="(644 / 24) * index + ((644 / 24) / 2)" y="20" class="hourText" v-if="one.has_alert">{{index}}</text>
      </g>
    </g>
    <g class="minuteContent" @mousemove="alertH" @mouseleave="alertH">
      <rect x="0" y="32" width="646" height="31" class="minuteBg" ></rect>
       <g class="minuteGroup" 
          v-for="(item, index) in data.minute" 
          :key="index" 
          :class="[`min${index}`, {'banTimeClick': !item.has_alert && !item.has_data}, {'has_alert': item.has_alert}]"
          @click="goLookView(item, index)">
        <rect :x="(644 / 60) * index" y="32" class="minuteRect" fill="transparent" :width="(644 / 60)" height="32"></rect>
        <circle :cx="(644 / 60) * index + (644 / 60 / 2)" cy="48" :r="item.has_alert ? 5 : 1.5"  class="minutePoint minuteSmallPoint" v-if="index % 5 !== 0"></circle>
        <circle :cx="(644 / 60) * index + (644 / 60 / 2)" cy="48" :r="item.has_alert ? 10 : 0" class="minutePoint minuteSmallPoint" v-if="index % 5 === 0"></circle>
        <text class="minutePointText numText" :x="(644 / 60) * index + (644 / 60 / 2)" y="53">{{index}}</text>
        <text class="minutePointText" :x="(644 / 60) * index + (644 / 60 / 2)" y="53" style="font-size:12px;" fill="#fff;" v-if="index % 5 === 0">{{index}}</text>
      </g>
    </g>
  </svg> 
   <svg class="" width="0" height="0">
      <filter id="hourFilter">
        <feGaussianBlur stdDeviation="5" in="SourceGraphic" result="Gau1"></feGaussianBlur>
        <feComposite in="Gau1" in2="Gau1" operator="in" result="Com1"></feComposite>
        <feComposite in="Com1" in2="Gau1" operator="in" result="Com2"></feComposite>
      </filter>
      <filter id="hourFilterSmall">
        <feGaussianBlur stdDeviation="2" in="SourceGraphic" result="Gau1"></feGaussianBlur>
        <feComposite in="Gau1" in2="Gau1" operator="in" result="Com1"></feComposite>
        <feComposite in="Com1" in2="Gau1" operator="in" result="Com2"></feComposite>
      </filter>
      <filter id="minuteFilter">
        <feGaussianBlur stdDeviation="1" in="SourceGraphic" result="GauMinute"></feGaussianBlur>
        <feColorMatrix in="GauMinute" type="matrix" values="0.5 0.8 0.5 0.5 0 0 0.1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="MatrixMinute"></feColorMatrix>
        <feComposite in2="SourceGraphic" in="MatrixMinute" operator="over"></feComposite>
      </filter>
      <filter id="minuteFilterH">
        <feGaussianBlur stdDeviation="1" in="SourceGraphic" result="GauMinuteH"></feGaussianBlur>
        <feColorMatrix in="GauMinuteH" type="matrix" values="1 1 1 1 0 1 1 1 1 0 0 0 0 0 0 0 0 0 0 1" result="MatrixMinuteH"></feColorMatrix>
        <feComposite in2="SourceGraphic" in="MatrixMinuteH" operator="in"></feComposite>
      </filter>
      <defs>
        <filter id="navFilter">
          <feGaussianBlur stdDeviation="13" in="SourceGraphic" result="Gau1"></feGaussianBlur>
          <feComposite in="Gau1" in2="Gau1" operator="in" result="Com1"></feComposite>
          <feComposite in="Com1" in2="Gau1" operator="in" result="Com2"></feComposite>
        </filter>
      </defs>
    </svg>
    <ShowNameBox 
      :showTips = "showNameFlag"
      :showName = "showTipsName"
      :lefts = "tipsLeft"
      :top = "tipsTop"
    ></ShowNameBox>
    </div>
</template>
<script>
import moment from 'moment';
import ShowNameBox from '@/components/manageApp/main/ShowNameBox';


export default {
  props: ['data'],
  components: {
    ShowNameBox,
  },
  watch: {
    data() {
      if (this.checkHour !== '') {
        this.data.hour[this.checkHour].isClick = true;
      }
    },
  },
  data() {
    return {
      checkHour: '',
      hourTime: '',
      hourRedBg: 0, // 显示红框
      tipsLeft: 10,
      tipsTop: 0,
      showNameFlag: false, // 提示框
      showTipsName: '',
    };
  },
  methods: {
    getHourTime(item, index) {
      if (item.has_data) {
        this.hourRedBg = 0;
      }
      if (item.finished === 'none' || !item.has_alert) {
        return;
      }
      const nowDate = moment().format('YYYY-MM-DD HH:mm:ss');
      // const nowDate = moment.unix(1527732300).format('YYYY-MM-DD HH:mm:ss');
      let time = `${nowDate.split(' ')[0]}${' '}${this.timeParse(index)}`;
      this.hourTime = time;
      time = moment(time).format('X');
      this.checkHour = index;
      this.$emit('changeHour', time);
      // console.log('123123', nowDate, time);
    },
    timeParse(num) {
      if (num < 10) {
        return `0${num}:00:00`;
      }
      return `${num}:00:00`;
    },
    // 点击分钟后
    goLookView(item, index) {
      if (item.finished === 'none' || !item.has_alert) {
        return;
      }
      if (this.checkHour === '') {
        this.hourRedBg = 1;
      } else {
        // this.hourTime.split(':')[1];
        let minite = '';
        if (index < 10) {
          minite = `0${index}:00`;
        } else {
          minite = `${index}:00`;
        }

        let goLookViewTS = `${this.hourTime.split(':')[0]}:${minite}`;
        goLookViewTS = moment(goLookViewTS).format('X');
        // console.log(`${this.hourTime.split(':')[0]}:${minite}`, goLookViewTS);
        this.$emit('goOverView', goLookViewTS);
      }
    },
    alertH(e) {
      const ele = e.target.parentElement.parentElement.parentElement;
      if (this.hourRedBg === 1) {
        this.tipsLeft = ele.getBoundingClientRect().left + 300;
        this.tipsTop = ele.getBoundingClientRect().top - 145;
        this.showNameFlag = true;
        this.showTipsName = '请选择小时';
      } else {
        this.showNameFlag = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.hourBg, .minuteBg {
    fill: #071927;
}
.manageAppTimeAxis {
  background: #222b33;
}

.hourGroup  {
  &.has_alert {
    cursor: pointer;
    >.hourPoint {
      fill:#bd603c;
      r:16;
      filter:url(#hourFilter);
    }
    >.hourText {
      fill: #fff;
      text-anchor: middle; // svg文本居中
    }
    &:hover {
      >.hourPoint {
        fill: #fff;
      }
      >.hourText {
        fill: #000;
      }
    }
  }
  
  &.has_click {
    >.hourPoint {
      fill: #fff;
    }
    >.hourText {
      fill: #000;
    }
  }
}

.minuteGroup {
  .minuteSmallPoint {
    fill: rgb(14, 81, 133);
    // r: 1.5;
  }
  .minutePointText {
    fill: rgb(14, 81, 133);
    text-anchor: middle; // svg文本居中
  }
  .minutePointText.numText {
    display: none;
    font-size: 12px;
  }
  &:not(.banTimeClick) {
    &:hover {
      cursor: pointer;
      .minutePointText.numText {
        fill: #000;
        display: block;
      }
      .minutePointText {
      fill: #000;
      text-anchor: middle; // svg文本居中
      }
      .minuteSmallPoint {
        fill: #fff;
        r: 10;
      filter: url(#hourFilterSmall);
      }
    }
  }
  &.banTimeClick {
    .minutePointText,
    .minuteSmallPoint {
      fill:gray;
      r: 1.5;
      // fill:red;
      text-anchor: middle; // svg文本居中
    }
  }

  &.has_alert {
    cursor: pointer;
    .minutePointText {
      fill: #fff;
      text-anchor: middle; // svg文本居中
    }
    .minuteSmallPoint {
      fill:#bd603c;
      // r: 5;
      filter: url(#hourFilterSmall);
    }
  }
}


</style>
