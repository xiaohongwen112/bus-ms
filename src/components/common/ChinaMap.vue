<template>
  <div class="map-container">
    <div class="map-btn-group" v-if="isDrill">
      <div class="drill-group">
        <span class="btn-desc">{{ parentName }}</span>
        <svg class="drill-svg" viewBox="10 0 22 22" @click="mapBack">
          <g class="drill-bg" :class="{'visible-drill': level !== 1}">
            <path fill="rgb(23, 38, 51)" d="M11.000,-0.000 C11.000,-0.000 37.000,-0.000 37.000,-0.000 C43.075,-0.000 48.000,4.925 48.000,11.000 C48.000,11.000 48.000,11.000 48.000,11.000 C48.000,17.075 43.075,22.000 37.000,22.000 C37.000,22.000 11.000,22.000 11.000,22.000 C4.925,22.000 -0.000,17.075 -0.000,11.000 C-0.000,11.000 -0.000,11.000 -0.000,11.000 C-0.000,4.925 4.925,-0.000 11.000,-0.000 Z"></path>
          </g>
          <g class="drill-btn"  :class="{'move-drill': level !== 1}">
            <path fill="rgb(183, 189, 199)" class="cursor-path switch-map-path" d="M11.000,-0.000 C11.000,-0.000 11.000,-0.000 11.000,-0.000 C17.075,-0.000 22.000,4.925 22.000,11.000 C22.000,11.000 22.000,11.000 22.000,11.000 C22.000,17.075 17.075,22.000 11.000,22.000 C11.000,22.000 11.000,22.000 11.000,22.000 C4.925,22.000 -0.000,17.075 -0.000,11.000 C-0.000,11.000 -0.000,11.000 -0.000,11.000 C-0.000,4.925 4.925,-0.000 11.000,-0.000 Z"></path><path fill="rgb(2, 13, 22)" d="M11.500,19.454 C11.500,19.454 5.818,12.292 5.818,9.180 C5.818,6.068 8.362,3.545 11.500,3.545 C14.638,3.545 17.181,6.068 17.181,9.180 C17.181,12.292 11.500,19.454 11.500,19.454 ZM11.500,5.313 C9.346,5.313 7.600,7.044 7.600,9.180 C7.600,11.315 9.346,13.047 11.500,13.047 C13.653,13.047 15.399,11.315 15.399,9.180 C15.399,7.044 13.653,5.313 11.500,5.313 ZM11.500,11.942 C9.961,11.942 8.714,10.705 8.714,9.180 C8.714,7.654 9.961,6.418 11.500,6.418 C13.038,6.418 14.285,7.654 14.285,9.180 C14.285,10.705 13.038,11.942 11.500,11.942 Z"></path>
          </g>
        </svg>
        <span class="btn-desc" v-show="level !== 1">{{ name }}</span>
      </div>
      <div class="flow-group">
        <div class="btn-desc">显示流向</div>
        <div class="flow-btn" :class="isShowFlow ? 'on' : 'off'" @click="clickFlow()">
          <span class="flow-on" :class="{'visible-flow': isShowFlow}">开</span>
          <span class="flow-off" :class="{'visible-flow': !isShowFlow}">关</span>
          <span class="flow-bg" :class="{'move-flow': isShowFlow}" ></span>
        </div>
      </div>
    </div>

    <svg preserveAspectRatio="xMidYMid meet" :viewBox="viewBox" class="map-svg" xmlns="http://www.w3.org/2000/svg">
      <g class="map-group">
        <g v-for="(item, index) in 3" :key="index" class="map-back">
          <path v-for="(item, index) in pathData.features" :key="index"  :d="mapPath(item)"></path>
        </g>
        <g class="map-truth" ref="mapGroup" :class="{'map-drilling': isDrilling, 'map-no-data': !hasData}">
          <path v-for="(item, index) in pathData.features" :key="index"
                class="map-path"
                stroke="#798ea3"
                stroke-width="1"
                :d="mapPath(item)"
                :fill="item.backColor"
                @click="mapClick(item.properties.name, item.id, $event)"
                @mouseover="mapHover(item.properties.name, item.id, $event)"
                @mousemove="mapHover(item.properties.name, item.id, $event)"
                @mouseout="mapOut"
          >
          </path>
        </g>
        <image class="south-china-sea" xmlns:xlink="http://www.w3.org/1999/xlink" ref="south" v-if="level === 1 && hasData"
        xlink:href="../../assets/china-map/south-china-sea.svg" height="16.5%" width="9%"
        preserveAspectRatio="none meet" :x="southX" :y="southY"></image>
        <image class="south-china-sea" xmlns:xlink="http://www.w3.org/1999/xlink" ref="south" v-if="level === 1 && !hasData"
               xlink:href="../../assets/china-map/south-china-sea-empty.svg" height="16.5%" width="9%"
               preserveAspectRatio="none meet" :x="southX" :y="southY"></image>
      </g>
      <g class="circle-group" >
        <circle class="map-circle" r="1.5"
                v-for="(item, index) in circleArr"
                :key="index"
                v-if="item.inVs"
                filter="url(#mapCircleFilter)"
                :class="{
                    'stop-animate': true,
                    'circle-least' :  item.trans_count <= 500,
                    'circle-middle' : item.trans_count < 2000 && item.trans_count > 500,
                    'circle-large' : item.trans_count >= 2000}"
                :cx="item.cx"
                :cy="item.cy"
                :style="{'transform-origin': item.cx +'px ' + item.cy + 'px'}"
                @mouseover="circleHover(item, $event)"
                @mousemove="circleHover(item, $event)"
                @mouseout="showTip = false"
        ></circle>
      </g>
      <g class="line-group" v-if="isShowFlow">
        <g class="flow-item" v-for="(item, index) in flowArr" :key="index">
          <path class="line-truth" :d="item.path" @mouseover="flowHover(item, $event)" @mousemove="flowHover(item, $event)" @mouseout="showTip = false" @click="flowClick(item, $event)"></path>
          <path class="line-bg" :d="item.path" @mouseover="flowHover(item, $event)" @mousemove="flowHover(item, $event)" @mouseout="showTip = false" @click="flowClick(item, $event)"></path>
          <g :clip-path="'url(#lineRectClip' + index + ')'" >
            <path class="line-move" d="M 0,0 Q 15,2 17,0 Q 15,-2 0,0" stroke="url(#lineMoveGradient)" stroke-width="1px" fill="url(#lineMoveGradient)" >
              <animateMotion :path="item.path" dur="5s" repeatCount="indefinite" rotate="auto"/>
            </path>
          </g>
          <defs>
            <clipPath :id="'lineRectClip' + index">
              <rect :x="item.x" :y="item.width > item.height ? item.y - 7.5 : item.y" :width="item.width" :height="item.width > item.height ? item.height + 15 : item.height"></rect>
            </clipPath>
          </defs>
        </g>
      </g>
      <defs>
        <filter id="mapCircleFilter" x="-10" y="-10" width="20" height="20">
          <feGaussianBlur stdDeviation="5" in="SourceGraphic" result="Gau1"></feGaussianBlur>
          <feMerge>
            <feMergeNode in="Gau1"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
        <linearGradient id="lineMoveGradient">
          <stop offset="20%" stop-color="rgba(255,255,255,.2)"></stop>
          <stop offset="50%" stop-color="rgba(255,255,255,.5)"></stop>
          <stop offset="70%" stop-color="rgba(255,255,255,.7)"></stop>
          <stop offset="100%" stop-color="rgba(255,255,255,1)"></stop>
        </linearGradient>
        <!--<filter id="f1" x="0" y="0" width="200%" height="200%">-->
            <!--<feOffset data-v-b592ac94="" result="offOut" in="SourceAlpha" dx="5" dy="10"></feOffset>-->
            <!--<feColorMatrix data-v-b592ac94="" result="matrixOut" in="offOut" type="matrix" values="0.2 4 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0"></feColorMatrix>-->
            <!--<feBlend data-v-b592ac94="" in="SourceGraphic" in2="matrixOut" mode="normal"></feBlend>-->
        <!--</filter>-->
      </defs>
    </svg>
    <div class="map-tip" ref="toolTip" v-show="showTip" :style="{left: tipLeft + 'px', top: tipTop + 'px'}" v-html="tipContent"></div>
    <div v-if="!hasData" class="empty-prompt">暂无数据</div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { geoMercator, geoPath } from 'd3-geo';

  import GEO from '@/helpers/map/geo';
  import { getMapJson } from '@/helpers/map/mapService';
  import { setLocalStorage } from '@/helpers/utils';

  const CHINA_CODE = 100000;

  export default {
    name: 'china-map',
    props: {
      areaCode: { type: Number, default: 100000 },
      areaName: { type: String, default: '全国' },
      isDrill: { type: Boolean, default: true },
      data: {
        type: Array,
        default() {
          return [];
        },
      },
      mapDataChina: {
        type: Object,
        default() {
          return {};
        },
      },
      isStorage: {
        type: Boolean,
        default: false,
      },
      isApply: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        id: this.areaCode || Number(this.findId(this.areaName)),
        viewBox: '0 0 1000 600',
        showTip: false,
        tipContent: '',
        tipLeft: 0,
        tipTop: 0,
        southX: 0,
        southY: 0,
        isDrilling: false,
        isShowFlow: sessionStorage.getItem('isShowFlow') !== undefined && sessionStorage.getItem('isShowFlow') === 'true' ? true : false, // eslint-disable-line
        drillPath: [],
        mapData: _.cloneDeep(this.data),
        pathData: {},
      };
    },
    created() {
      if (this.isStorage && localStorage.getItem('drillPath') !== undefined && localStorage.getItem('drillPath') !== null && localStorage.getItem('drillPath') !== '[]') this.drillPath = JSON.parse(localStorage.getItem('drillPath'));
      this.getPathData();
    },
    watch: {
      areaCode() {
        if (_.has(GEO, this.areaCode) && _.has(GEO[this.areaCode], 'coordinates')) {
          this.id = this.areaCode;
        } else {
          const provinceId = Math.floor(this.areaCode / 1000) * 1000;
          if (_.has(GEO, provinceId) && _.has(GEO[provinceId], this.areaCode)
            && _.has(GEO[provinceId][this.areaCode], 'coordinates')) {
            this.id = this.areaCode;
          }
        }
      },
      areaName() {
        this.id = Number(this.findId(this.areaName)) || this.id;
      },
      data() {
        this.mapData = _.cloneDeep(this.data);
      },
      id() {
        this.getPathData();
      },
    },
    computed: {
      setFlag() {
        return localStorage.getItem('areaCode') !== undefined;
      },
      hasData() {
        // return this.mapData.length > 0;
        return this.isApply;
      },
      level() {
        if (this.id === CHINA_CODE) {
          return 1;
        } else if (this.id % 10000 === 0) {
          return 2;
        }
        return 3;
      },
      geoPos() {
        const provinceId = this.id % 10000 === 0 ? CHINA_CODE : Math.floor(this.id / 10000) * 10000;
        if (_.has(GEO, provinceId) && _.has(GEO[provinceId], this.id)
          && _.has(GEO[provinceId][this.id], 'coordinates')) {
          return GEO[provinceId][this.id];
        }
        return GEO[CHINA_CODE][CHINA_CODE];
      },
      center() {
        return this.geoPos.coordinates;
      },
      scale() {
        return this.geoPos.scale;
      },
      name() {
        const nameTmp = this.geoPos.name === '全国' ? '全国地图' : this.geoPos.name;
        if (this.level === 1) {
          this.drillPath = [];
        }
        if (!this.drillPath.some(d => d.code === this.id)) {
          this.drillPath.push({
            code: this.id,
            name: nameTmp,
          });
        }
        return nameTmp;
      },
      parentName() {
        const len = this.drillPath.length;
        if (len === 0) {
          return '全国地图';
        } else if (len === 1) {
          return this.drillPath[len - 1].name;
        }
        return this.drillPath[len - 2].name;
      },
      projection() {
        return geoMercator().center(this.center).scale(this.scale);
      },
      mapPath() {
        return geoPath().projection(this.projection);
      },
      mapVs() { // eslint-disable-line
        if (this.pathData.features && this.pathData.features.length !== 0) return this.flattenPolygon(this.pathData.features.map(d => d.geometry.coordinates));
      },
      circleArr() {
        let arr = [];
        this.mapData.forEach((data) => {
          const { s, d, trans_count } = data;
          const repeatCircle = arr.find(item => (item.longitude === s.longitude && item.latitude === s.latitude) || (item.longitude === d.longitude && item.latitude === d.latitude));
          if (repeatCircle) {
            repeatCircle.trans_count += Number(trans_count);
          }
          const sPoint = [Number(s.longitude), Number(s.latitude)];
          const dPoint = [Number(d.longitude), Number(d.latitude)];
          const sPos = this.projection(sPoint);
          const dPos = this.projection(dPoint);
          arr.push(Object.assign({}, s, {
            trans_count: Number(trans_count),
            type: 'source',
            cx: sPos[0],
            cy: sPos[1],
            inVs: this.inVs(sPoint),
          }));
          arr.push(Object.assign({}, d, {
            trans_count: Number(trans_count),
            type: 'dist',
            cx: dPos[0],
            cy: dPos[1],
            inVs: this.inVs(dPoint),
          }));
        });
        const obj = {};
        arr = arr.reduce((cur, next) => {
          obj[next.c] ? '' : obj[next.c] = true && cur.push(next); // eslint-disable-line
          return cur;
        }, []);
        if (JSON.stringify(this.mapDataChina) !== '{}' && arr.length !== 0) {
          arr.forEach((item, index) => {
            Object.keys(this.mapDataChina).forEach((x) => {
              Object.keys(this.mapDataChina[x]).forEach((value) => {
                if ((value !== '' && item.c.includes(value)) || (value === '' && item.c.includes(this.mapDataChina[x])) || (value === '' && item.c.includes(x))) arr[index].trans_count = this.mapDataChina[x][value].trans_count;
              });
            });
          });
        }
        return arr;
      },
      flowArr() {
        const arr = [];
        this.mapData.forEach((data) => {
          const { s, d } = data; /* trans_count */
          const sPoint = [Number(s.longitude), Number(s.latitude)];
          const dPoint = [Number(d.longitude), Number(d.latitude)];
          if (sPoint.indexOf(-1) === -1 && dPoint.indexOf(-1) === -1) {
            const sPos = this.projection(sPoint);
            const dPos = this.projection(dPoint);
            const x = Math.min(sPos[0], dPos[0]);
            const y = Math.min(sPos[1], dPos[1]);
            const width = Math.abs(sPos[0] - dPos[0]);
            const height = Math.abs(sPos[1] - dPos[1]);
            let path;
            if (s.longitude === d.longitude && s.latitude === d.latitude) {
              path = 'M 0,0 Q 0,0 0,0';
            } else {
              const conPointPos = this.getLinePath(sPos, dPos);
              path = `M ${sPos} Q ${conPointPos.pos} ${dPos}`;
            }
            arr.push(Object.assign({}, data, { path, x, y, width, height }));
          }
        });
        return arr;
      },
    },
    methods: {
      clickFlow() {
        this.isShowFlow = !this.isShowFlow;
        sessionStorage.setItem('isShowFlow', this.isShowFlow);
      },
      async getPathData() {
        const res = await getMapJson(this.id);
        this.pathData = res.data;
        // this.pathData = await import(/* webpackChunkName: "mapData" */ `@/helpers/map/mapJson/${this.id}.json`);
        this.$nextTick(() => this.setViewBox());
      },
      findId(areaName) {
        let key = 0;
        _.findKey(GEO, (d) => {
          key = _.findKey(d, k => k.name === areaName);
          return key;
        });
        return key;
      },
      mapDrill(code) {
        if (code && this.level !== 3) {
          this.id = Number(code);
        }
      },
      mapBack() {
        if (this.level !== 1) {
          this.drillPath.splice(this.drillPath.length - 1, 1);
          this.id = Number(_.last(this.drillPath).code);
        }
        if (this.isStorage) {
          setLocalStorage('areaCode', _.last(this.drillPath).code);
          setLocalStorage('drillPath', JSON.stringify(this.drillPath));
        }
      },
      mapClick(name, code, e) {
        if (this.isDrill) {
          this.isDrilling = true;
          this.mapDrill(code);
          this.$nextTick(() => {
            this.isDrilling = false;
          });
        }
        this.$emit('mapClick', { name, code, e });
        if (this.isStorage && String(code).slice(-2) === '00') {
          setLocalStorage('areaCode', code);
          setLocalStorage('drillPath', JSON.stringify(this.drillPath));
        }
      },
      mapHover(name, code, e) {
        this.tipContent = name;
        this.showTip = true;
        this.$nextTick(() => this.moveToolTip(e));
      },
      mapOut() {
        this.showTip = false;
      },
      moveToolTip(e) {
        const pos = { x: e.pageX, y: e.pageY };
        const containerBox = this.$el.getBoundingClientRect();
        const tipTop = pos.y - containerBox.top;
        const maxTop = containerBox.height - this.$refs.toolTip.clientHeight - 5;
        this.tipTop = tipTop > maxTop ? maxTop - 20 : tipTop + 20;
        this.tipLeft = (pos.x - containerBox.left) + 20;
      },
      setViewBox() {
        const box = this.$refs.mapGroup.getBBox();
        this.viewBox = `${box.x - 5} ${box.y - 5} ${box.width + 20} ${box.height + 20}`;
        if (this.level === 1) {
          const southBox = this.$refs.south.getBBox();
          this.southX = box.width - southBox.width;
          this.southY = box.height - southBox.height;
        }
      },
      /**
       * 提取坐标点对数组
       */
      flattenPolygon(arr) {
        return arr.reduce((flat, toFlatten) => flat.concat(this.isPolygon(toFlatten) ? [toFlatten] : this.flattenPolygon(toFlatten)), []);
      },
      /**
       * 判断数组是否为GeoJson Polygon格式
       */
      isPolygon(arr) {
        const len = arr.length;
        return len >= 4 && (arr[0][0] === arr[len - 1][0] && arr[0][1] === arr[len - 1][1]);
      },
      pointInPolygon(point, vs) {
        const [x, y] = point;
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i, i += 1) {
          const [xi, yi] = vs[i];
          const [xj, yj] = vs[j];
          const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
        return inside;
      },
      inVs(point) { //eslint-disable-line
        if (this.mapVs && this.mapVs.length !== 0) return this.mapVs.some(d => this.pointInPolygon(point, d));
      },
      getLinePath(sourPos, distPos) {
        const disX = Math.abs(distPos[0] - sourPos[0]);
        const disY = Math.abs(distPos[1] - sourPos[1]);

        const disXPow = Math.pow(disX, 2);
        const disYPow = Math.pow(disY, 2);

        const dis1To2 = Math.sqrt(disXPow + disYPow);
        const dis1To2Half = dis1To2 / 2;
        const dis1ToConPoint = (dis1To2Half * 2) / Math.sqrt(3);
        const kx1Tox2 = disY / disX;

        const argTan = Math.atan(kx1Tox2);
        let argTanTmp;
        let conPointY;
        let conPointX;

        if (sourPos[0] >= distPos[0] && sourPos[1] >= distPos[1]) {
          argTanTmp = Math.abs(argTan - Math.PI / 6);
          conPointX = distPos[0] + dis1ToConPoint * Math.cos(argTanTmp);
          conPointY = argTan >= (Math.PI / 6) ? distPos[1] + dis1ToConPoint * Math.sin(argTanTmp) : distPos[1] - dis1ToConPoint * Math.sin(argTanTmp);
        } else if (sourPos[0] < distPos[0] && sourPos[1] >= distPos[1]) {
          argTanTmp = Math.abs(argTan - Math.PI / 6);
          conPointX = distPos[0] - dis1ToConPoint * Math.cos(argTanTmp);
          conPointY = argTan >= (Math.PI / 6) ? distPos[1] + dis1ToConPoint * Math.sin(argTanTmp) : distPos[1] - dis1ToConPoint * Math.sin(argTanTmp);
        } else if (sourPos[0] < distPos[0] && sourPos[1] < distPos[1]) {
          argTanTmp = argTan + Math.PI / 6;
          conPointX = sourPos[0] + dis1ToConPoint * Math.cos(argTanTmp);
          conPointY = sourPos[1] + dis1ToConPoint * Math.sin(argTanTmp);
        } else if (sourPos[0] >= distPos[0] && sourPos[1] < distPos[1]) {
          argTanTmp = argTan + Math.PI / 6;
          conPointX = sourPos[0] - dis1ToConPoint * Math.cos(argTanTmp);
          conPointY = sourPos[1] + dis1ToConPoint * Math.sin(argTanTmp);
        }

        return {
          pos: [conPointX, conPointY],
        };
      },
      circleHover(data, e) {
        this.tipContent = `${data.c} 交易量：${data.trans_count}笔`;
        this.showTip = true;
        this.$nextTick(() => this.moveToolTip(e));
      },
      flowHover(data, e) {
        this.tipContent = `${data.s.c} -> ${data.d.c}</br>交易量：${data.trans_count}笔`;
        this.showTip = true;
        this.$nextTick(() => this.moveToolTip(e));
      },
      flowClick(data, e) {
        this.$emit('flowClick', { data, e });
      },
      clickMap() {
        this.$emit('on-mapdetail');
      },
    },
    mounted() {
//      this.setViewBox();
    },
  };
</script>

<style lang="scss" scoped>
  .map-container{
    width: 1200px;
    height: 600px;
    position: relative;

    .map-svg{
      width: calc(100% - 172px);
      height: calc(100% - 52px);
      margin-top: 52px;
      margin-left: 116px;
    }

    .map-back:first-child {
      transform: translate(5px, 10px);

      path{
        stroke: #383838;
        stroke-width: 1;
        fill: #0B0B0B;
      }
    }

    .map-back:nth-child(2) path{
      fill: #4390A0;
      stroke: #90A1A4;
      stroke-width: 4;
    }

    .map-back:nth-child(3) path{
      fill:#1F3D5D;
      stroke:none;
    }

    .map-btn-group{
      width: auto;
      position: absolute;
      left: 0;
      top: 0;

      .drill-group{
        margin-bottom: 10px;
        display: flex;
        align-content: center;

        .drill-svg {
          width: 60px;
          height: 22px;
          vertical-align: middle;

          .drill-bg{
            opacity: 0;
            transition: opacity .3s;
          }

          .drill-btn{
            transition: fill,stroke,transform .3s linear;
            cursor: pointer;
          }

          .visible-drill{
            opacity: 1;
          }

          .move-drill{
            transform: translate(25px,0);

            path:first-child{
              fill: rgb(42, 153, 190);
            }
          }
        }

      }

      .flow-group{
        display: flex;
        align-content: center;

        .flow-btn {
          display: flex;
          width: 44px;
          height: 20px;
          outline: none;
          border-radius: 10px;
          box-sizing: border-box;
          transition: border-color .3s,background-color .3s;
          vertical-align: middle;
          align-content: center;
          background: none;
          cursor: pointer;
          margin-left: 12px;
          position: relative;
          &.on{
            border: 1px solid #5b86b9;
            .flow-bg{
              background-color: #5b86b9;
            }
          }
          &.off{
            border: 1px solid #8F8F8F;
            .flow-bg{
              background-color: #8F8F8F;
            }
            .flow-off{
              color: #8F8F8F;
            }
          }
          .flow-on, .flow-off {
            display: inline-block;
            height: 100%;
            width: 50%;
            text-align: center;
            color: #C2D1D6;
            font-size: 10px !important;
            line-height: 18px;
            visibility: hidden;
          }

          .flow-bg {
            position: absolute;
            top: 1px;
            left: 1px;
            border-radius: 100%;
            transition: transform .3s;
            width: 16px;
            height: 16px;
            background-color: #fff;
          }

          .visible-flow{
            visibility: visible;
          }

          .move-flow{
            transform: translate3d(24px, 0px, 0px);
          }

        }

      }
    }

    .map-tip {
      position: absolute;
      width: auto;
      height: auto;
      padding: 5px 10px;
      border: 1px solid #e5e5e5;
      font-size: 14px;
      text-align: center;
      background-color: rgba(0, 0, 0, .5);
      border-radius: 5px;
      z-index: 1;
    }

    .empty-prompt{
      width: 150px;
      height: 50px;
      font-size: 20px;
      background-color: #051522;
      border: 1px solid #1A4E5C;
      text-align: center;
      line-height: 50px;
      position: absolute;
      left: calc(50% - 75px);
      top: 50%;
      color: #517187;
    }
    .map-path{
      cursor: pointer;
    }
    .map-path:hover {
      fill: #bdcbce !important;
      stroke: #DEDFF3 !important;
      transform: translate(-3px, -5px);
    }

    .map-no-data .map-path{
      fill: #0D1A23;
      stroke: #434D56;
    }

    .map-drilling {
      animation: drillMapAnimation 1s;
      /*animation-fill-mode: forwards;*/
    }
    @keyframes drillMapAnimation {
      from {
        transform: scale(1);
      }
      to {
        transform: scale(2);

      }
    }

    .circle-group{
      .map-circle{
        cursor: pointer;
      }
      .circle-least{
        animation:least-animate 1.5s infinite linear ;
        transform:translateZ(0);
      }
      .circle-middle{
        animation:middle-animate 1.5s infinite linear ;
        transform:translateZ(0);
      }
      .circle-large{
        animation:large-animate 1.5s infinite linear ;
        transform:translateZ(0);
      }
      .stop-animate {
        animation-play-state: paused;
      }
      @keyframes least-animate {
        0%,100%{
          fill: #B99951;
          transform: translate(0, 0) scale(1);
        }
        50%{
          fill: rgb(211,180,113);
          transform: translate(0, 0) scale(2);
        }
      }
      @keyframes middle-animate {
        0%,100%{
          fill: #00B98D;
          transform: scale(1);
        }
        50%{
          fill: #5AE3C1;
          transform: scale(2);
        }
      }
      @keyframes large-animate {
        0%,100%{
          fill: #C2414C;
          transform: scale(1);
        }
        50%{
          fill: #E87481;
          transform: scale(2);
        }
      }
    }
    .line-group{
      .flow-item{

        .line-truth{
          stroke-width: 2;
          fill: none;
          stroke: rgba(139,164,172, 0.2);
          cursor: pointer;
        }
        .line-bg{
          stroke-width: 2;
          fill: none;
          stroke: rgba(139,164,172, 0.2);
          cursor: pointer;
        }
        .line-move{
        }
      }
    }
  }
</style>
