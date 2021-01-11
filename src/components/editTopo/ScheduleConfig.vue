<template>
  <div class="work-schedule">
    <div class="on-off-schedule">
      <span class="alert-name-tip"></span>
      <span class="work-name">监控</span>
      <span class="on-off-group">
        <input
          type="button"
          value="开启"
          @click="switchChange('on')"
          :class="{ 'btn-selected': isOn}"
        />
        <input
          type="button"
          value="关闭"
          @click="switchChange('off')"
          :class="{ 'btn-selected': !isOn}"
        />
      </span>
    </div>
    <div
      class="edit-schedule"
      :class="{'edit-status': editId !== '','off-style': !isOn}"
    >
      <div class="left-work">
        <span class="alert-name-tip"></span>
        <span class="work-name">工作时段名称</span>
        <input
          ref="workName"
          type="text"
          autocomplete="off"
          placeholder="周末"
          maxlength="20"
          v-model="editName"
          @blur="checkName"
        >
      </div>
      <div class="center-work" ref="workWeek">
        <input
          type="button"
          v-for="(value,key) in week"
          :key="key"
          :value="value"
          @click="selectWeek(key)"
          :class="{ selected: editWeek.indexOf(key) > -1 }"
        />
      </div>
      <div class="right-work">
        <input v-show="!isEdit" @click="create" type="button" value="+" class="op-btn"/>
        <input v-show="isEdit" @click="save" type="button" value="保存" class="op-btn"/>
        <input v-show="isEdit" @click="clear" type="button" value="取消" class="op-btn"/>
      </div>
    </div>
    <div class="show-schedule" :class="{'off-style': !isOn}">
      <div :class="{'per-schedule': true, 'edit-status': isAdd}" v-if="isAdd">
        <div class="per-schedule-content">
          <TimeAxis :timeList="newTime" @timeChange="timeChange"/>
        </div>
      </div>
      <div :class="{'per-schedule': true, 'edit-status': editId === item.id}" v-for="item in newSchedule.schedule" :key="item.id">
        <div class="per-schedule-tit">
          <span class="schedule-note logic-name">{{ item.name }}</span>
          <span class="schedule-repeat logic-week">{{weekFormat(item.week )}}</span>
          <input
            class="schedule-edit-btn"
            type="button"
            value="编辑"
            @click="editSchedule(item)"
          />
          <input type="button"  value="删除" @click="removeSchedule(item.id)"/>
        </div>
        <div class="per-schedule-content">
          <div class="per-schedule-type">工作时段</div>
          <div class="per-schedule-axis">
            <TimeAxis
              :timeList="item.time_range"
              :isClear="isClear"
              @timeChange="timeChange"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="off-div" v-show="!isOn"></div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import TimeAxis from '@/components/common/TimeScheduleAxis';
  import { checkError } from '@/helpers/configValidate';

  export default {
    name: 'schedule-config',
    components: {
      TimeAxis,
    },
    props: {
      schedule: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        week: { all: '全', week_mon: '一', week_tue: '二', week_wed: '三', week_thu: '四', week_fri: '五', week_sat: '六', week_sun: '日' },
        weekArr: 'all,week_mon,week_tue,week_wed,week_thu,week_fri,week_sat,week_sun'.split(','),
        isAdd: false,
        isEdit: false,
        editId: '',
        editName: '',
        editWeek: [],
        editTime: [],
        newTime: [],
        newSchedule: this.getSchedule(),
      };
    },
    watch: {
      schedule(newV) {
        if (newV) this.newSchedule = this.getSchedule();
      },
    },
    computed: {
      isOn() {
        return this.newSchedule.switch === 'on';
      },
      isClear() {
        return !this.isEdit;
      },
    },
    methods: {
      getSchedule() {
        return _.cloneDeep(this.schedule);
      },
      switchChange(val) {
        this.newSchedule.switch = val;
        // this.emit();
      },
      selectWeek(key) {
        const keyIndex = this.editWeek.indexOf(key);
        if (key === 'all') {
          this.editWeek = ['all'];
        } else {
          const allIndex = this.editWeek.indexOf('all');
          if (allIndex > -1) {
            this.editWeek.splice(allIndex, 1);
          }
          if (keyIndex > -1) {
            this.editWeek.splice(keyIndex, 1);
          } else {
            this.editWeek.push(key);
          }
        }
      },
      create() {
        this.clear(true);
        this.isAdd = true;
        this.isEdit = true;
        this.editId = this.randomID(10);
      },
      editSchedule(item) {
        this.editId = item.id;
        this.editName = item.name;
        this.editWeek = _.cloneDeep(item.week);
        this.editTime = _.cloneDeep(item.time_range);
        this.isEdit = true;
      },
      save() {
        const index = _.findIndex(this.newSchedule.schedule, item => item.id === this.editId);
        const res = { bool: this.editWeek.length > 0, tip: '不可为空' };
        checkError(res, this.$refs.workWeek);
        this.checkName();
        if (res.bool && !/[&; ]/g.test(this.editName)) {
          if (index === -1) {
            this.newSchedule.schedule.push({
              week: _.cloneDeep(this.editWeek),
              time_range: _.cloneDeep(this.editTime),
              name: this.editName,
            });
          } else {
            this.$set(this.newSchedule.schedule, index, {
              week: _.cloneDeep(this.editWeek),
              time_range: _.cloneDeep(this.editTime),
              name: this.editName,
            });
          }
          // this.emit();
          this.clear();
        }
      },
      removeSchedule(id) {
        const index = _.findIndex(this.newSchedule.schedule, item => item.id === id);
        this.newSchedule.schedule.splice(index, 1);
        // this.emit();
        this.clear();
      },
      clear() {
        this.editId = '';
        this.editName = '';
        this.editWeek = [];
        this.editTime = [];
        this.newTime = [];
        this.isAdd = false;
        this.isEdit = false;
      },
      randomID(n) {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let res = '_';
        for (let i = 0; i < n; i += 1) {
          const id = Math.ceil(Math.random() * 35);
          res += chars[id];
        }
        return res;
      },
      weekFormat(data) {
        const dispWeekdata = _.cloneDeep(data).sort((a, b) => this.weekArr.indexOf(a) - this.weekArr.indexOf(b)); // eslint-disable-line
        const week = {
          周一至周日: 'all',
          周一: 'week_mon',
          周二: 'week_tue',
          周三: 'week_wed',
          周四: 'week_thu',
          周五: 'week_fri',
          周六: 'week_sat',
          周日: 'week_sun',
        };
        let val = '';
        if (_.isArray(dispWeekdata)) {
          dispWeekdata.forEach((item) => {
            if (_.has(week, item)) {
              val += `${week[item]} `;
            } else {
              val += `${_.findKey(week, value => value === item)} `;
            }
          });
        }
        return val;
      },
      checkName() {
        const res = { bool: !this.editName.match(/[&; ]/g), tip: '不能包含"&",";"和空格!' };
        checkError(res, this.$refs.workName);
      },
      timeChange(data) {
        this.editTime = _.cloneDeep(data.timeList);
      },
      emit() {
        this.$emit('scheduleChange', {
          schedule: this.newSchedule,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .work-schedule{
    width: 100%;
    height: 100%;
    position: relative;

    input[type=button]{
      width: 30px;
      height: 26px;
      line-height: 26px;
      padding: 0;
      margin: 0;
      border: none;
      text-align: center;
      font-size: 14px;
    }

    .alert-name-tip{
      display: inline-block;
      width: 10px;
      height: 14px;
      background: linear-gradient(left, #22726F, #3AB9B3);
      background: -webkit-gradient(linear, left top, right top, from(#22726F), to(#3AB9B3));
      filter: progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = #22726F, endColorstr = #3AB9B3);
    }

    .work-name{
      font-size: 18px;
      margin: 0 5px;
    }

    .on-off-schedule{
      height: 52px;
      line-height: 52px;
      padding: 0 5%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      input[type=button]{
        float: left;
        border: 1px solid #1a9394;
        background: #071c2a;
        color: #e7eff4;
        width: 40px;
        outline: none;
      }
      input[type=button]:first-child{
        margin-left: 20px;
        border-radius: 5px 0 0 5px;
      }
      input[type=button]:last-child{
        border-radius: 0 5px 5px 0;
      }

      .btn-selected{
        background: deepskyblue!important;
      }
    }

    .edit-schedule{
      border: 1px solid #0c3755;
      height: 56px;
      line-height: 56px;
      padding: 0 5%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left-work{
        width: 40%;
        min-width: 140px;
        margin-right: 5px;

        input[type="text"]{
          border: 1px solid #2b4055 !important;
          max-width: 260px;
          background: #0b2537;
          height: 30px;
          line-height: 30px;
          text-align: left;
          padding-left: 10px;
        }
      }

      .center-work{
        width: 288px;

        input[type=button]{
          float: left;
          border: 1px solid #192d40 !important;
          border-left: 0 !important;
          color: #38bab3;
          width: 12.5%;
          font-size: 16px;
          outline: none;
          text-decoration: none;
          border-radius: 0;

          &:first-child {
            border-radius: 5px 0 0 5px;
            border-left: 1px solid #192d40 !important;
          }

          &:last-child {
            border-radius: 0 5px 5px 0;
          }

          &.selected{
            background: #3AB8B4;
            color: #192d40;
          }
        }
      }

      .right-work{
        width: 130px;
        display: flex;

        input[type=button]{
          /*float: left;*/
          background: #1ecdb5;
          color: #192d40;
          border-radius: 3px;
          font-size: 14px;
          width: 50px;
        }
      }
    }

    .show-schedule{
      border: 1px solid #0c3755;
      bottom: 72px;
      background: #061521;
      overflow: auto;
      margin-top: 20px;
      width: 100%;
      height: calc(100% - 130px);

      input[type="button"]{
        font-style: italic;
        color: #38bab3;
        border: none!important;
        background: none;
        width: 40px;
      }
      .per-schedule-content{
        pointer-events: none;
        display: flex;
        justify-content: center;

        .per-schedule-type{
          width: 60px;
          height: 60px;
          line-height: 60px;
        }

        .per-schedule-axis{
          width: calc(100% - 60px);
          height: 60px;
          line-height: 60px;
        }
      }
    }

    .edit-status{
      background: #15334a;
      border-radius: 3px;
      box-shadow: 0 0 15px #43fbd5;

      .per-schedule-content{
        pointer-events: all;
      }
    }

    .off-div{
      background: rgba(7, 28, 42, .4);
      position: absolute;
      top: 52px;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .off-style{
      color: #5b5f5f!important;
      pointer-events: none;
    }
  }

  ::-webkit-input-placeholder { /* WebKit browsers */
    color:#999;
  }

  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color:#999;
  }

  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color:#999;
  }

  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color:#999;
  }
</style>
