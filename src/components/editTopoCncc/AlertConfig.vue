<template>
  <div class="alert-container">
    <div class="alert-type">
      <div class="alert-row1 alert-col1">
        <span class="alert-name-tip"></span>
        <span class="alert-name">健康度告警</span>
      </div>
      <div class="alert-row4 alert-col1" :class="{ 'collapse-tit' : collapseBaseline }">
        <span class="alert-name-tip"></span>
        <span class="alert-name">基线告警</span>
        <span class="triangle-icon" :class="{ 'alert-spread' : !collapseBaseline }" @click="collapseBaseline = !collapseBaseline">▶</span>
      </div>
      <div class="alert-row6 alert-col1" :class="{ 'collapse-tit' : collapseThreshold }">
        <span class="alert-name-tip"></span>
        <span class="alert-name">阈值告警</span>
        <span class="triangle-icon " :class="{ 'alert-spread' : !collapseThreshold }" @click="collapseThreshold = !collapseThreshold">▶</span>
      </div>
    </div>
    <div class="alert-content">
      <div class="alert-row health-alert" :class="{ 'disabled-alert': !newAlarmRules.health.on }">
        <div class="alert-col alert-col2">
          <input @change="checkChange" v-model="newAlarmRules.health.on" type="checkbox" >
          <label>健康度</label>
        </div>
        <div class="alert-col alert-col3">
          <label>响应时间正常值</label>
          <input
            @input="checkIn($event, 'ms', true)"
            :disabled="!newAlarmRules.health.on"
            v-model="newAlarmRules.health.duration"
            type="text"
            autocomplete="off"
            id="healthDurationMs"
          />
          <label>ms</label>
          <label>健康度低于</label>
          <input
            @input="checkIn($event, 'percent')"
            :disabled="!newAlarmRules.health.on"
            v-model="newAlarmRules.health.health_set"
            type="text"
            autocomplete="off"
          />
          <label>%</label>
        </div>
        <div class="alert-col alert-col4">
          <label>时间范围</label>
          <select :disabled="!newAlarmRules.health.on" @change="emit" v-model="newAlarmRules.health.ts_hold"  class="port-input">
            <option v-for="(item,index) in tsRange" :value="item" :key="index">{{ item }}</option>
          </select>
          <label>分钟</label>
        </div>
        <div class="alert-col alert-col5">
          <span> 参考值：</span>
          <span>65.54%</span>
        </div>
      </div>
      <div class="spread-div-baseline" :class="{ 'collapse-div': collapseBaseline }">
        <div class="alert-row " >
          <div class="alert-col alert-col2">
            <input  @change="checkChange" v-model="newAlarmRules.baseline.succ_rate.on" type="checkbox" >
            <label>成功率</label>
          </div>
          <div class="alert-col alert-col3" :class="{ 'disabled-alert': !newAlarmRules.baseline.succ_rate.on }">
            <label>高于</label>
            <input
              @input="checkIn($event, 'percent')"
              :disabled="!newAlarmRules.baseline.succ_rate.on"
              v-model="newAlarmRules.baseline.succ_rate.up"
              type="text" autocomplete="off"
            />
            <label>或低于</label>
            <input
              @input="checkIn($event, 'percent')"
              :disabled="!newAlarmRules.baseline.succ_rate.on"
              v-model="newAlarmRules.baseline.succ_rate.down"
              type="text"
              autocomplete="off"
            />
            <label>%</label>
          </div>
          <div class="alert-col alert-col4" :class="{ 'disabled-alert': !newAlarmRules.baseline.succ_rate.on }">
            <label>时间范围</label>
            <select :disabled="!newAlarmRules.baseline.succ_rate.on" @change="emit" v-model="newAlarmRules.baseline.succ_rate.time"  class="port-input">
              <option v-for="(item,index) in tsRange" :value="item" :key="index">{{ item }}</option>
            </select>
            <label>分钟</label>
          </div>
          <div class="alert-col alert-col5">
            <span> 参考值：</span>
            <span>65.54</span>
            <span>%</span>
          </div>
        </div>
        <div class="alert-row " >
          <div class="alert-col alert-col2">
            <input @change="checkChange" v-model="newAlarmRules.baseline.duration.on" type="checkbox" >
            <label>响应时间</label>
          </div>
          <div class="alert-col alert-col3" :class="{ 'disabled-alert': !newAlarmRules.baseline.duration.on }">
            <label>高于</label>
            <input
              @input="checkIn($event, 'ms')"
                   :disabled="!newAlarmRules.baseline.duration.on"
                   v-model="newAlarmRules.baseline.duration.up"
                   type="text"
                   autocomplete="off"
            />
            <label>或低于</label>
            <input
              @input="checkIn($event, 'ms')"
                   :disabled="!newAlarmRules.baseline.duration.on"
                   v-model="newAlarmRules.baseline.duration.down"
                   type="text"
                   autocomplete="off"
            />
            <label>ms</label>
          </div>
          <div class="alert-col alert-col4" :class="{ 'disabled-alert': !newAlarmRules.baseline.duration.on }">
            <label>时间范围</label>
            <select :disabled="!newAlarmRules.baseline.duration.on"  @change="emit" v-model="newAlarmRules.baseline.duration.time"  class="port-input">
              <option v-for="(item,index) in tsRange" :value="item" :key="index">{{ item }}</option>
            </select>
            <label>分钟</label>
          </div>
          <div class="alert-col alert-col5">
            <span> 参考值：</span>
            <span>65.54</span>
            <span>ms</span>
          </div>
        </div>
        <div class="alert-row " >
          <div class="alert-col alert-col2">
            <input @change="checkChange" v-model="newAlarmRules.baseline.trans_count.on" type="checkbox" >
            <label>交易量</label>
          </div>
          <div class="alert-col alert-col3" :class="{ 'disabled-alert': !newAlarmRules.baseline.trans_count.on }">
            <label>高于</label>
            <input
              @input="checkIn($event, 'count')"
              :disabled="!newAlarmRules.baseline.trans_count.on"
              v-model="newAlarmRules.baseline.trans_count.up"
              type="text"
              autocomplete="off"
            />
            <label>或低于</label>
            <input
              @input="checkIn($event, 'count')"
              :disabled="!newAlarmRules.baseline.trans_count.on"
              v-model="newAlarmRules.baseline.trans_count.down"
              type="text"
              autocomplete="off"
            />
            <label>笔</label>
          </div>
          <div class="alert-col alert-col4" :class="{ 'disabled-alert': !newAlarmRules.baseline.trans_count.on }">
            <label>时间范围</label>
            <select :disabled="!newAlarmRules.baseline.trans_count.on" @change="emit" v-model="newAlarmRules.baseline.trans_count.time"  class="port-input">
              <option v-for="(item,index) in tsRange" :value="item" :key="index">{{ item }}</option>
            </select>
            <label>分钟</label>
          </div>
          <div class="alert-col alert-col5">
            <span> 参考值：</span>
            <span>65.54</span>
            <span>笔</span>
          </div>
        </div>
        <div class="alert-row " >
          <div class="alert-col alert-col2">
            <input @change="checkChange" v-model="newAlarmRules.return_code.on" type="checkbox" >
            <label>返回特定码</label>
          </div>
          <div class="alert-col alert-col3" :class="{ 'disabled-alert': !newAlarmRules.return_code.on }">
            <input
              @input="checkIn($event, 'code')"
              :disabled="!newAlarmRules.return_code.on"
              v-model="newAlarmRules.return_code.val"
              type="text"
              autocomplete="off"/>
          </div>
        </div>
      </div>
      <div class="spread-div-threshold" :class="{ 'collapse-div': collapseThreshold }">
        <div class="alert-row " >
          <div class="alert-col alert-col2">
            <input @change="checkChange" v-model="newAlarmRules.threshold.trans_count.on" type="checkbox" >
            <label>交易量</label>
          </div>
          <div class="alert-col alert-col3" :class="{ 'disabled-alert': !newAlarmRules.threshold.trans_count.on }">
            <label>阈值</label>
            <label>高于</label>
            <input
              @input="checkIn($event, 'count')"
              :disabled="!newAlarmRules.threshold.trans_count.on"
              v-model="newAlarmRules.threshold.trans_count.up.value"
              type="text"
              autocomplete="off"
            />
            <label>笔</label>
          </div>
          <div class="alert-col alert-col4" :class="{ 'disabled-alert': !newAlarmRules.threshold.trans_count.on }">
            <label>时间范围</label>
            <select :disabled="!newAlarmRules.threshold.trans_count.on"  @change="emit" v-model="newAlarmRules.threshold.trans_count.up.time"  class="port-input">
              <option v-for="(item,index) in tsRange" :value="item" :key="index">{{ item }}</option>
            </select>
            <label>分钟</label>
          </div>
          <div class="alert-col alert-col5">
            <span> 参考值：</span>
            <span>65.54</span>
            <span>笔</span>
          </div>
        </div>
        <div class="alert-row " >
          <div class="alert-col alert-col2">
          </div>
          <div class="alert-col alert-col3" :class="{ 'disabled-alert': !newAlarmRules.threshold.trans_count.on }">
            <label :disabled="!newAlarmRules.threshold.trans_count.on"  class="threshold-down">低于</label>
            <input
              @input="checkIn($event, 'count')"
              v-model="newAlarmRules.threshold.trans_count.down.value"
              type="text" autocomplete="off"/>
            <label>笔</label>
          </div>
          <div class="alert-col alert-col4" :class="{ 'disabled-alert': !newAlarmRules.threshold.trans_count.on }">
            <label>时间范围</label>
            <select :disabled="!newAlarmRules.threshold.trans_count.on" @change="emit" v-model="newAlarmRules.threshold.trans_count.down.time"  class="port-input">
              <option v-for="(item,index) in tsRange" :value="item" :key="index">{{ item }}</option>
            </select>
            <label>分钟</label>
          </div>
          <div class="alert-col alert-col5">
            <span> 参考值：</span>
            <span>65.54</span>
            <span>笔</span>
          </div>
        </div>
        <div class="alert-row " >
          <div class="alert-col alert-col2">
            <input @change="checkChange" v-model="newAlarmRules.threshold.no_req.on" type="checkbox" >
            <label>无交易请求</label>
          </div>
          <div class="alert-col alert-col3"></div>
          <div class="alert-col alert-col4" :class="{ 'disabled-alert': !newAlarmRules.threshold.no_req.on }">
            <label>时间范围</label>
            <select :disabled="!newAlarmRules.threshold.no_req.on"  @change="emit" v-model="newAlarmRules.threshold.no_req.time"  class="port-input">
              <option v-for="(item,index) in tsRange" :value="item" :key="index">{{ item }}</option>
            </select>
            <label>分钟</label>
          </div>
        </div>

        <div class="alert-row ">
          <div class="alert-col alert-col2">
            <input @change="checkChange" v-model="newAlarmRules.threshold.succ_rate.on" type="checkbox" >
            <label>成功率</label>
          </div>
          <div class="alert-col alert-col3" :class="{ 'disabled-alert': !newAlarmRules.threshold.succ_rate.on }">
            <label>绝对值低于</label>
            <input
              @input="checkIn($event, 'percent')"
              :disabled="!newAlarmRules.threshold.succ_rate.on"
              v-model="newAlarmRules.threshold.succ_rate.down.value"
              type="text"
              autocomplete="off"
            />
            <label>%</label>
          </div>
          <div class="alert-col alert-col4" :class="{ 'disabled-alert': !newAlarmRules.threshold.succ_rate.on }">
            <label>时间范围</label>
            <select :disabled="!newAlarmRules.threshold.succ_rate.on" @change="emit" v-model="newAlarmRules.threshold.succ_rate.down.time"  class="port-input">
              <option v-for="(item,index) in tsRange" :value="item" :key="index">{{ item }}</option>
            </select>
            <label>分钟</label>
          </div>
          <div class="alert-col alert-col5">
            <span> 参考值：</span>
            <span>65.54</span>
            <span>%</span>
          </div>
        </div>
        <div class="alert-row " >
          <div class="alert-col alert-col2">
            <input @change="checkChange" v-model="newAlarmRules.threshold.duration.on" type="checkbox" >
            <label>响应时间</label>
          </div>
          <div class="alert-col alert-col3" :class="{ 'disabled-alert': !newAlarmRules.threshold.duration.on }">
            <label>绝对值高于</label>
            <input @input="checkIn($event, 'ms')"  :disabled="!newAlarmRules.threshold.duration.on" v-model="newAlarmRules.threshold.duration.up.value" type="text" autocomplete="off"/>
            <label>ms</label>
          </div>
          <div class="alert-col alert-col4" :class="{ 'disabled-alert': !newAlarmRules.threshold.duration.on }">
            <label>时间范围</label>
            <select :disabled="!newAlarmRules.threshold.duration.on" @change="emit" v-model="newAlarmRules.threshold.duration.up.time"  class="port-input">
              <option v-for="(item,index) in tsRange" :value="item" :key="index">{{ item }}</option>
            </select>
            <label>分钟</label>
          </div>
          <div class="alert-col alert-col5">
            <span> 参考值：</span>
            <span>65.54</span>
            <span>ms</span>
          </div>
        </div>
        <div class="alert-row " >
          <div class="alert-col alert-col2">
            <input v-model="newAlarmRules.threshold.rr_rate.on" @change="checkChange" type="checkbox" >
            <label>响应率</label>
          </div>
          <div class="alert-col alert-col3" :class="{ 'disabled-alert': !newAlarmRules.threshold.rr_rate.on }">
            <label>绝对值低于</label>
            <input
              @input="checkIn($event, 'percent')"
              :disabled="!newAlarmRules.threshold.rr_rate.on"
              v-model="newAlarmRules.threshold.rr_rate.down.value"
              type="text"
              autocomplete="off"
            />
            <label>%</label>
          </div>
          <div class="alert-col alert-col4" :class="{ 'disabled-alert': !newAlarmRules.threshold.rr_rate.on }">
            <label>时间范围</label>
            <select :disabled="!newAlarmRules.threshold.rr_rate.on" @change="emit" v-model="newAlarmRules.threshold.rr_rate.down.time"  class="port-input">
              <option v-for="(item,index) in tsRange" :value="item" :key="index">{{ item }}</option>
            </select>
            <label>分钟</label>
          </div>
          <div class="alert-col alert-col5">
            <span> 参考值：</span>
            <span>65.54</span>
            <span>%</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  //  import find from 'lodash/find';
//  import has from 'lodash/has';
  import { validatePercent, validateCode, validateMs, validateCount, checkError } from '@/helpers/configValidate';

  export default {
    name: 'alert-config',
    props: {
      alarmrules: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        newAlarmRules: JSON.parse(JSON.stringify(this.alarmrules)),
        tsRange: [1, 2, 3, 4, 5, 10, 15],
        collapseBaseline: true,
        collapseThreshold: true,
      };
    },
    watch: {
      alarmrules() {
        this.newAlarmRules = JSON.parse(JSON.stringify(this.alarmrules));
        this.emit();
      },
    },
    computed: {
    },
    methods: {
      checkIn(e, type, isNull) {
        let res = {};
        const val = e.target.value;
        switch (type) {
          case 'ms': res = validateMs(val, isNull);
            break;
          case 'percent': res = validatePercent(val);
            break;
          case 'code': res = validateCode(val);
            break;
          case 'count': res = validateCount(val);
            break;
          default: res = {
            bool: true,
            tip: '',
          };
        }
        checkError(res, e.target);
        this.emit();
      },
      checkChange(e) {
        const isChecked = e.target.checked;
        const _parent = e.target.closest('.alert-row');
        Array.from(_parent.querySelectorAll('input[type="text"]')).forEach((d) => {
          if (isChecked) {
            if (d.id !== 'healthDurationMs' && d.value === '') {
              checkError({ bool: false, tip: '不可为空' }, d);
            }
          } else {
            if (Array.from(d.classList).indexOf('error-input') > -1 && d.value === '') {
              checkError({ bool: true }, d);
            }
          }
        });
        this.emit();
      },
      emit() {
        this.$emit('alertChange', {
          alarmrules: this.newAlarmRules,
          isRight: this.valid(),
        });
      },
      valid() {
        return Array.from(this.$el.querySelectorAll('.error-input')).every(d => !d.closest('.alert-row').querySelector('input[type="checkbox"]').checked);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .alert-container{
    .alert-type,.alert-content{
      float: left;
    }
    .alert-type{
      width: 200px;
      font-size: 18px;

      .alert-row1 {
        height: 40px;
        padding-top: 7px;
      }
      .alert-row4 {
        height: calc(40px * 4);
        padding-top: 7px;
        transition: height 0.5s;
      }
      .alert-row6{
        height: calc(40px * 6);
        padding-top: 7px;
        transition: height 0.5s;
      }
    }

    .alert-content{
      width: calc(100% - 200px);

      .spread-div-baseline {
        height: 160px;
        transition: height 0.5s;
      }
     .spread-div-threshold  {
        height: 240px;
        transition: height 0.5s;
      }
    }
  }

  .alert-name-tip{
    display: inline-block;
    width: 10px;
    height: 14px;
    background: linear-gradient(left, #22726F, #3AB9B3);
    filter: progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = #22726F, endColorstr = #3AB9B3);
  }

  .triangle-icon{
    transition: transform 100ms;
    font-size: 12px;
    color: #38BBB4;
    display: inline-block;
    cursor: pointer;
  }

  .alert-spread{
    transform: rotate(90deg);
    transition: rotate 0.5s;
  }

  .collapse-tit {
    height: 40px!important;
    overflow: hidden;
    transition: height 0.5s;
  }
  .collapse-div{
    height: 40px!important;
    overflow: hidden;
    transition: height 0.5s;
  }

  .alert-row{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 7px 0;

    .alert-col{
      flex-shrink: 0;
    }

    .alert-col1{
      font-size: 16px;
      flex-basis: 190px;
    }
    .alert-col2{
      flex-basis: 120px;
    }
    .alert-col3{
      flex-basis: 400px;
    }
    .alert-col4{
      flex-basis: 180px;
    }
    .alert-col5{
      flex-basis: 150px;
      color: #37d0c9;
      white-space: nowrap;
      font-size: 14px;
    }

    label{
      font-weight: 200;
      margin-bottom: 0;
    }

    input{
      background: #0b2537;
    }

    input[type="radio"]{
      width: 12px;
      height: 12px;
      margin: 0 4px;
    }

    input[type="checkbox"]{
      height: 18px;
      vertical-align: middle;
      width: 18px;
      border: 1px solid #278C89 !important;
      margin: 0 4px;
    }

    input[type="checkbox"]:checked {
      background: #2C9D97 url(../../assets/topo-nav/input-checked.svg)  1px center;
      background-size: cover;
    }

    input[type="text"]{
      width: 110px;
    }

    select{
      width: 40px;
    }
    input[type="text"],select{
      height: 26px;
      line-height: 26px;
      border: 1px solid #2b4055 !important;
      max-width: 260px;
    }

    input.error-input{
      border:1px solid red!important;
    }
  }

  .health-alert input[type="text"]{
    width: 70px;
  }

  .threshold-down{
    margin-left: 33px;
  }

  .ellipsis{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .disabled-alert{
    color: #777777 !important;
  }

  .error-input{
    border:1px solid red!important;
  }
</style>
