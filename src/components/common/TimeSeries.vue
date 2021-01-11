<template>

<div class="cusCenterDiv">
  <div class="timeSeriesDiv">
    <div
      class="upTime timeBtn"
      style="visibility: visible;"
      @click="clickUpTime"
    ></div>
    <div class="timeContainer" style="position: relative;">
      <svg width="1856" height="78" class="timeSeriesAll" viewBox="0,0,1856,78" preserveAspectRatio="none">
        <defs>
          <filter id="timeFilter" x="-10" y="-10" width="20" height="20">
            <feGaussianBlur stdDeviation="5" in="SourceGraphic" result="Gau1"></feGaussianBlur>
            <feMerge>
              <feMergeNode in="Gau1"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
        </defs>
        <g transform="translate(40,36.5)">
          <g class="axisGroup">
            <line class="markXLine" x1="0" x2="1776" y1="1.5" y2="1.5" stroke-width="1" stroke="#12575a"></line>
            <circle cx="0" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="37" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="74" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="111" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="148" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="185" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="222" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="259" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="296" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="333" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="370" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="407" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="444" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="481" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="518" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="555" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="592" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="629" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="666" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="703" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="740" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="777" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="814" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="851" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="888" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="925" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="962" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="999" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1036" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1073" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1110" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1147" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1184" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1221" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1258" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1295" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1332" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1369" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1406" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1443" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1480" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1517" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1554" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1591" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1628" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1665" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1702" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1739" cy="1.5" r="3" fill="#32e5ff"></circle>
            <circle cx="1776" cy="1.5" r="3" fill="#32e5ff"></circle>
          </g>
        </g>
      </svg>
      <div class="timeSeriesTip" style="display: none; position: absolute; width: auto; height: auto; font-size: 14px; text-align: left; padding: 5px 10px; background-color: rgb(3, 16, 27); opacity: 0.75; border-radius: 2px; color: rgb(190, 226, 235); box-shadow: rgb(55, 228, 251) 0px 0px 10px 0px inset; border: 1px solid rgb(55, 228, 251); max-height: 34px; overflow: auto; z-index: 1;">
        <div class="tipInfo" style="pointer-events: none;"></div>
        <div class="tipTime" style="font-size: 12px; float: right; pointer-events: none;"></div>
      </div>
    </div>
    <div
      class="downTime timeBtn"
      style="visibility: visible;"
      @click="clickDownTime"
    ></div>
  </div>
  <div class="granularityDiv">
    <span class="time timeStart">{{ showTimeStart }}:00</span>
    <span class="time">-</span>
    <span class="time timeEnd">{{ showTimeStart + showRange }}:00</span>
    <span>颗粒度：{{ granularity }}min/格</span>
  </div>
</div>
  
</template>
<script>

export default {
  name: 'time-series',
  data() {
    return {
      timeStart: 0,
      timeEnd: 24,
      showTimeStart: 12,
      showRange: 4,
      granularity: 5,
    };
  },
  methods: {
    clickUpTime() {
      console.log('upTime');
      if (this.timeStart + this.showRange < this.showTimeStart) {
        this.showTimeStart = this.showTimeStart - 4;
      }
    },
    clickDownTime() {
      if (this.showTimeStart + this.showRange < this.timeEnd) {
        this.showTimeStart = this.showTimeStart + 4;
      }
    },
    resizeHandler() {
      if (window.innerWidth < 1366) {
        this.granularity = 10;
      } else {
        this.granularity = 5;
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler);
  },
  destroy() {
    window.removeEventListener('resize', this.resizeHandler);
  },
};

</script>
<style scoped>

.cusCenterDiv {
  height: 98px;
  box-shadow: #162a3d 0 0 78px 0 inset;
}

.timeSeriesDiv {
  height: calc(100% - 20px);
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.timeBtn {
  width: 32px;
  height: calc(100% - 14px);
  background-position-x: 6px;
  background-position-y: 25px;
  background-size: 24px 24px;
  background-repeat: no-repeat;
  cursor: pointer;
}

.upTime {
  background-image: url(../../assets/customView/prev.png);
}

.downTime {
  background-image: url(../../assets/customView/next.png);
}

.timeContainer {
  width: calc(100% - 64px);
}

.granularityDiv {
  text-align: right;
  font-size: 12px;
  padding-right: 20px;
  
}

.granularityDiv span:last-child {
  margin-left: 20px;
}

</style>


