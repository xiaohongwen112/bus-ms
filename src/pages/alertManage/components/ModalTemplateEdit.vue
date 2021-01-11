<template>
  <config-box :tabs="tabs" :width='1150' :height='496' :scrollheight="426"
    @closeConfig="close" @saveConfig="saveConfig">
    <div slot="edit" class="edit-slot">
      <div class="edit-top">
        <label class="title require">
          <i class="require-icon">*</i>
          模板名称</label>
        <CmInput class="edit-input" :width="200" :maxlength="20" type="popsUp" 
          v-model="curData.name" 
          :correctFlag="nameUnique" :errorFlag="nameErrorFlag"
          @on-change="checkName('name')" @mouseover="openPops($event, 'name')" @mouseout="closePops"
        />
        <label class="title title-describe">描述</label>
        <CmInput class="edit-input" :width="620" :maxlength="255" type="popsUp" 
        v-model="curData.describe"/>
      </div>
      <div class="edit-main">
        <ul class="edit-nav-wrap">
          <li class="nav-name1"><i class="require-icon">*</i>
          健康度告警</li>
          <li class="nav-name2" :class="{'active': activeNavIndex === 0, 'nav-error': alaCheck.health.errorFlag}" @click="activeNavIndex = 0">健康度</li>
          <li class="nav-name1"><i class="require-icon">*</i>
          基线告警</li>
          <li class="nav-name2" :class="{'active': activeNavIndex === 1, 'nav-error': alaCheck.trans_count.errorFlag}" @click="activeNavIndex = 1">交易量</li>
          <li class="nav-name2" :class="{'active': activeNavIndex === 2, 'nav-error': alaCheck.succ_rate.errorFlag}" @click="activeNavIndex = 2">成功率</li>
          <li class="nav-name2" :class="{'active': activeNavIndex === 3, 'nav-error': alaCheck.duration.errorFlag}" @click="activeNavIndex = 3">响应时间</li>
          <li class="nav-name2" :class="{'active': activeNavIndex === 4, 'nav-error': alaCheck.rr_rate.errorFlag}" @click="activeNavIndex = 4">响应率</li>
          <li class="nav-name1">自定义指标告警</li>
          <li class="nav-name2" :class="{'active': activeNavIndex === 5, 'nav-error': alaCheck.return_code.errorFlag}" @click="activeNavIndex = 5">返回码</li>
        </ul>
        <section class="edit-config" v-show="activeNavIndex === 0">
          <div class="title1"><img src="../../../assets/common/tag.png"/>健康度</div>
          <p class="detail-item">
            <label>基线值</label>
            <ul class="baseline-value">
              <li :class="{'disable-edit': !isAuto('health')}">
                <span class="baseline-type">
                  <input type="checkbox" :checked="isAuto('health')" @change="checkBaselineType('auto', 'health', $event)"/>
                  自动基线
                </span>
              </li>
              <li :class="{'disable-edit': isAuto('health')}">
                <span class="baseline-type">
                  <input type="checkbox" :checked="!isAuto('health')"
                  @change="checkBaselineType('hand', 'health', $event)"/>
                  手动设置
                </span>
                低于
                <CmInput :width="70" type="popsUp"
                  v-model="curData.alarmrules.health.health_set" :disable="isAuto('health')"
                  :errorFlag="alaCheck.health.baseline.errorFlag"
                  @mouseover="openBaselibePops($event, 'health')" @mouseout="closePops"
                  @on-change="checkBaselineVal('health')"
                />%
              </li>
            </ul>
          </p>
          <p class="detail-item">
            <label>升级策略</label>
            <UpgradeStrategyEdit class="upgrade-strategy-wrap" :data="curData.alarmrules.health.upgrade_strategy" 
            @change="changeUpgradeStrategy(arguments, 'health')"/>
          </p>
          <p class="detail-item">
            <label>延迟告警</label>
            <CmSelect type="popsUp" :width="170" position="top"
            :list="delayList" :selectVal="`${curData.alarmrules.health.ts_hold}分钟`" 
            @on-change="changeDelay(arguments, 'health')"/>
          </p>
        </section>
        <section class="edit-config" v-show="activeNavIndex === 1">
          <h6 v-show="false" v-text="'交易量'"></h6>
          <div class="title1"><img src="../../../assets/common/tag.png"/>交易量</div>
          <p class="detail-item">
            <label>基线值</label>
            <ul class="baseline-value">
              <li :class="{'disable-edit': !isAuto('trans_count')}">
                <span class="baseline-type">
                  <input type="checkbox" :checked="isAuto('trans_count')" @change="checkBaselineType('auto', 'trans_count', $event)"/>
                  自动基线
                </span>
              </li>
              <li :class="{'disable-edit': isAuto('trans_count')}">
                <span class="baseline-type">
                  <input type="checkbox" :checked="!isAuto('trans_count')"
                  @change="checkBaselineType('hand', 'trans_count', $event)"/>
                  手动设置
                </span>
                高于
                <CmInput :width="70" type="popsUp" :maxlength="16"
                  v-model="curData.alarmrules.threshold.trans_count.up.value" :disable="isAuto('trans_count')"
                  :errorFlag="alaCheck.trans_count.baseline.up.errorFlag"
                  @mouseover="openBaselibePops($event, 'trans_count', 'up')" @mouseout="closePops"
                  @on-change="checkBaselineVal('trans_count')"
                  /> 笔 或 低于
                <CmInput :width="70" type="popsUp" :maxlength="16"
                  v-model="curData.alarmrules.threshold.trans_count.down.value" :disable="isAuto('trans_count')"
                  :errorFlag="alaCheck.trans_count.baseline.down.errorFlag"
                  @mouseover="openBaselibePops($event, 'trans_count', 'down')" @mouseout="closePops"
                  @on-change="checkBaselineVal('trans_count')"
                  /> 笔
              </li>
            </ul>
          </p>
          <p class="detail-item">
            <label>升级策略</label>
            <UpgradeStrategyEdit class="upgrade-strategy-wrap" :data="curData.alarmrules.threshold.trans_count.upgrade_strategy" 
            @change="changeUpgradeStrategy(arguments, 'trans_count')"/>
          </p>
          <p class="detail-item">
            <label>延迟告警</label>
            <CmSelect type="popsUp" :width="170" position="top"
            :list="delayList" :selectVal="`${curData.alarmrules.threshold.trans_count.down.time}分钟`" 
            @on-change="changeDelay(arguments, 'trans_count')"/>
          </p>
        </section>
        <section class="edit-config" v-show="activeNavIndex === 2">
          <h6 v-show="false"  v-text="'成功率'"></h6>
          <div class="title1"><img src="../../../assets/common/tag.png"/>成功率</div>
          <p class="detail-item">
            <label>基线值</label>
            <ul class="baseline-value">
              <li :class="{'disable-edit': !isAuto('succ_rate')}">
                <span class="baseline-type">
                  <input type="checkbox" :checked="isAuto('succ_rate')" @change="checkBaselineType('auto', 'succ_rate', $event)"/>
                  自动基线
                </span>
              </li>
              <li :class="{'disable-edit': isAuto('succ_rate')}">
                <span class="baseline-type">
                  <input type="checkbox" :checked="!isAuto('succ_rate')"
                  @change="checkBaselineType('hand', 'succ_rate', $event)"/>
                  手动设置
                </span>
                低于
                <CmInput :width="70" type="popsUp"
                  v-model="curData.alarmrules.threshold.succ_rate.down.value" :disable="isAuto('succ_rate')"
                  :errorFlag="alaCheck.succ_rate.baseline.errorFlag"
                  @mouseover="openBaselibePops($event, 'succ_rate')" @mouseout="closePops"
                  @on-change="checkBaselineVal('succ_rate')"
                  />%
              </li>
            </ul>
          </p>
          <p class="detail-item">
            <label>升级策略</label>
            <UpgradeStrategyEdit class="upgrade-strategy-wrap" :data="curData.alarmrules.threshold.succ_rate.upgrade_strategy" 
            @change="changeUpgradeStrategy(arguments, 'succ_rate')"/>
          </p>
          <p class="detail-item">
            <label>延迟告警</label>
            <CmSelect type="popsUp" :width="170" position="top"
            :list="delayList" :selectVal="`${curData.alarmrules.threshold.succ_rate.down.time}分钟`" 
            @on-change="changeDelay(arguments, 'succ_rate')"/>
          </p>
        </section>
        <section class="edit-config" v-show="activeNavIndex === 3">
          <h6 v-show="false" v-text="'响应时间'"></h6>
          <div class="title1"><img src="../../../assets/common/tag.png"/>响应时间</div>
          <p class="detail-item">
            <label>基线值</label>
            <ul class="baseline-value">
              <li :class="{'disable-edit': !isAuto('duration')}">
                <span class="baseline-type">
                  <input type="checkbox" :checked="isAuto('duration')" @change="checkBaselineType('auto', 'duration', $event)"/>
                  自动基线
                </span>
              </li>
              <li :class="{'disable-edit': isAuto('duration')}">
                <span class="baseline-type">
                  <input type="checkbox" :checked="!isAuto('duration')"
                  @change="checkBaselineType('hand', 'duration', $event)"
                  />
                  手动设置
                </span>
                高于
                <CmInput :width="70" type="popsUp" :maxlength="12"
                  v-model="curData.alarmrules.threshold.duration.up.value" :disable="isAuto('duration')"
                  :errorFlag="alaCheck.duration.baseline.errorFlag"
                  @mouseover="openBaselibePops($event, 'duration')" @mouseout="closePops"
                  @on-change="checkBaselineVal('duration')"
                  />ms
              </li>
            </ul>
          </p>
          <p class="detail-item">
            <label>升级策略</label>
            <UpgradeStrategyEdit class="upgrade-strategy-wrap" :data="curData.alarmrules.threshold.duration.upgrade_strategy" 
            @change="changeUpgradeStrategy(arguments, 'duration')"/>
          </p>
          <p class="detail-item">
            <label>延迟告警</label>
            <CmSelect type="popsUp" :width="170" position="top"
            :list="delayList" :selectVal="`${curData.alarmrules.threshold.duration.up.time}分钟`" 
            @on-change="changeDelay(arguments, 'duration')"/>
          </p>
        </section>
        <section class="edit-config" v-show="activeNavIndex === 4">
          <h6 v-show="false" v-text="'响应率'"></h6>
          <div class="title1"><img src="../../../assets/common/tag.png"/>响应率</div>
          <p class="detail-item">
            <label>基线值</label>
            <ul class="baseline-value">
              <li :class="{'disable-edit': !isAuto('rr_rate')}">
                <span class="baseline-type">
                  <input type="checkbox" :checked="isAuto('rr_rate')" @change="checkBaselineType('auto', 'rr_rate', $event)"/>
                  自动基线
                </span>
              </li>
              <li :class="{'disable-edit': isAuto('rr_rate')}">
                <span class="baseline-type">
                  <input type="checkbox" :checked="!isAuto('rr_rate')"
                  @change="checkBaselineType('hand', 'rr_rate', $event)"/>
                  手动设置
                </span>
                低于
                <CmInput :width="70" inputType="number" type="popsUp"
                  v-model="curData.alarmrules.threshold.rr_rate.down.value" :disable="isAuto('rr_rate')"
                  :errorFlag="alaCheck.rr_rate.baseline.errorFlag"
                  @mouseover="openBaselibePops($event, 'rr_rate')" @mouseout="closePops"
                  @on-change="checkBaselineVal('rr_rate')"
                  />%
              </li>
            </ul>
          </p>
          <p class="detail-item">
            <label>升级策略</label>
            <UpgradeStrategyEdit class="upgrade-strategy-wrap" :data="curData.alarmrules.threshold.rr_rate.upgrade_strategy" 
            @change="changeUpgradeStrategy(arguments, 'rr_rate')"/>
          </p>
          <p class="detail-item">
            <label>延迟告警</label>
            <CmSelect type="popsUp" :width="170" position="top"
            :list="delayList" :selectVal="`${curData.alarmrules.threshold.rr_rate.down.time}分钟`" 
            @on-change="changeDelay(arguments, 'rr_rate')"/>
          </p>

        </section>
        <section class="edit-config returncode-config" v-show="activeNavIndex === 5">
          <h6 v-show="false" v-text="'返回码'"></h6>
          <div class="title1"><img src="../../../assets/common/tag.png"/>返回码</div>
          <p class="detail-item">
            <label>返回码</label>
            <CmInput :width="380" :maxlength="255" type="popsUp"
              v-model="curData.alarmrules.return_code.val"
              :errorFlag="alaCheck.return_code.baseline.errorFlag"
              @mouseover="openBaselibePops($event, 'return_code')" @mouseout="closePops"
              @on-change="checkBaselineVal('return_code')"
              />
          </p>
          <p class="detail-item">
            <label>默认告警级别</label>
            <CmSelect type="popsUp" :width="170"
            :list="levelList" :selectVal="`级别${curData.alarmrules.return_code.level}:  ${levelNames[curData.alarmrules.return_code.level-1]}`" 
            @on-change="changeAlert(arguments, 'return_code')"/>
          </p>
        </section>
      </div>
      <PopsMsg type="error" :showTips="showPops" :msg="errmsg" :lefts="lefts" :top="top"></PopsMsg>
    </div>
  </config-box>
</template>

<script>
  import _ from 'lodash';
  import { ConfigBox, CmInput, CmSelect, PopsMsg } from '@/components/basic';
  import UpgradeStrategyEdit from './UpgradeStrategyEdit';
  import { levelNames, levelList } from '../utils';
  import alarmrulesValidate from '../alarmrulesValidate';
  import { checkTemplateName } from '../service';

  export default {
    name: 'ModalTemplateDetail',
    components: { ConfigBox, CmInput, CmSelect, PopsMsg, UpgradeStrategyEdit },
    props: {
      title: {
        type: String,
        required: true,
      },
      data: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        tabs: [
          { id: 'edit', text: this.title },
        ],
        levelNames,
        levelList,
        activeNavIndex: 0, // 当前选中指标
        thresholdKeys: ['duration', 'rr_rate', 'succ_rate', 'trans_count'], // threshold中的key
        delayList: ['1分钟', '2分钟', '3分钟', '4分钟', '5分钟', '10分钟', '15分钟'], // 延迟告警下拉
        curData: _.cloneDeep(this.data),
        alaCheck: _.cloneDeep(alarmrulesValidate), // 校验记录
        nameUnique: false, // 名称唯一性
        nameErrorFlag: false, // 名称校验出错误
        nameErrorMsg: '2-20位中英文或数字', // 名称错误提示
        showPops: false,
        top: 0,
        lefts: 0,
        errmsg: '',
      };
    },
    methods: {
      closePops() {
        this.showPops = false;
      },
      openPops(e, key) {
        // 名称错误提示事件
        if (this[`${key}ErrorFlag`] && this[`${key}ErrorMsg`] !== '') {
          this.errmsg = this.nameErrorMsg;
          const ele = e.target.getBoundingClientRect();
          this.top = ele.top + 2;
          this.lefts = ele.left + ele.width / 2;
          this.showPops = true;
        }
      },
      openBaselibePops(e, key, subKey) {
        // 指标错误提示事件
        if (key !== 'trans_count' && this.alaCheck[key].baseline.errorFlag) {
          const ele = e.target.getBoundingClientRect();
          this.top = ele.top + 2;
          this.lefts = ele.left + ele.width / 2;
          this.errmsg = this.alaCheck[key].baseline.errorMsg;
          this.showPops = true;
        } else if (key === 'trans_count' && this.alaCheck[key].baseline[subKey].errorFlag) {
          const ele = e.target.getBoundingClientRect();
          this.top = ele.top + 2;
          this.lefts = ele.left + ele.width / 2;
          this.errmsg = this.alaCheck[key].baseline[subKey].errorMsg;
          this.showPops = true;
        }
      },
      isAuto(key) {
        // 单选互斥
        let tmpData;
        if (this.thresholdKeys.includes(key)) {
          tmpData = this.curData.alarmrules.threshold[key];
        } else {
          tmpData = this.curData.alarmrules[key];
        }
        const bool = tmpData.baseOn && !tmpData.on;
        return bool;
      },
      initModal() {
      },
      close() {
        this.$emit('onClose');
      },
      async saveConfig() {
        // 逐各check
        await this.checkName('name');
        ['health', 'succ_rate', 'rr_rate', 'duration', 'return_code', 'trans_count'].forEach((key) => {
          this.checkBaselineVal(key);
        });
        const alaCheckErrorFlag = !_.every(this.alaCheck, d => !d.errorFlag);
        if (this.nameUnique && !this.nameErrorFlag && !alaCheckErrorFlag) {
          this.$emit('onSave', this.curData);
        }
      },
      getDelay(key) {
        // 延时告警
        const tmp = this.curData.alarmrules;
        let time;
        if (this.thresholdKeys.includes(key)) {
          if (key === 'duration') {
            time = tmp[key].up.value;
          } else {
            time = tmp[key].down.value;
          }
        } else {
          time = tmp[key].ts_hold;
        }
        return time;
      },
      changeDelay(arg, key) {
        // 更改延时告警
        const val = arg[0];
        const time = Number(val.substring(0, val.length - 2));
        if (this.thresholdKeys.includes(key)) {
          if (key !== 'duration') {
            this.curData.alarmrules.threshold[key].down.time = time;
          }
          if (['duration', 'trans_count'].includes(key)) {
            this.curData.alarmrules.threshold[key].up.time = time;
          }
        } else {
          this.curData.alarmrules[key].ts_hold = time;
        }
      },
      changeAlert(arg, key) {
        // 更改返回码-默认告警级别
        const val = arg[0];
        this.curData.alarmrules[key].level = Number(val[2]);
      },
      checkBaselineType(type, key, ev) {
        // 切换自动基线和手动基线
        const { checked } = ev.target;
        const baseOn = (checked && type === 'auto') || (!checked && type !== 'auto');
        if (this.thresholdKeys.includes(key)) {
          this.curData.alarmrules.threshold[key].baseOn = baseOn;
          this.curData.alarmrules.threshold[key].on = !baseOn;
        } else {
          this.curData.alarmrules[key].baseOn = baseOn;
          this.curData.alarmrules[key].on = !baseOn;
        }
        if (baseOn) {
          this.checkBaselineVal(key);
        }
      },
      changeUpgradeStrategy(arg, key) {
        // 更改升级策略
        const val = arg[0].data;
        const errorFlag = arg[0].errorFlag;
        if (this.thresholdKeys.includes(key)) {
          this.curData.alarmrules.threshold[key].upgrade_strategy = val;
        } else {
          this.curData.alarmrules[key].upgrade_strategy = val;
        }
        this.alaCheck[key].strategyErrorFlag = errorFlag;
        if (['health', 'succ_rate', 'rr_rate', 'duration', 'trans_count'].includes(key)) {
          this.alaCheck[key].errorFlag = this.alaCheck[key].baseline.errorFlag || errorFlag;
        }
      },
      async checkName(key) {
        const val = this.curData.name;
        console.log(key);
        const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,20}$/;
        this.nameErrorMsg = val.length > 0 ? '2-20中英文数字' : '';
        if (reg.test(val)) {
          this.nameUnique = false;
          this.nameErrorFlag = false;
          const res = await checkTemplateName({
            _id: this.title === '编辑' ? this.data._id : '',
            name: this.curData.name,
          });
          if (res.data.code === 0) {
            this.nameUnique = true;
            this.nameErrorFlag = false;
          } else {
            this.nameErrorFlag = true;
            this.nameErrorMsg = '模板已存在,请重新输入。';
          }
        } else {
          this.nameUnique = false;
          this.nameErrorFlag = true;
        }
      },
      checkBaselineVal(key) {
        // 更改手动基线值
        const curAlaCheck = this.alaCheck[key];
        let baseOn;
        // 有区别
        let val;
        if (['succ_rate', 'rr_rate'].includes(key)) {
          baseOn = this.curData.alarmrules.threshold[key].baseOn;
          val = this.curData.alarmrules.threshold[key].down.value;
        } else if (key === 'duration') {
          baseOn = this.curData.alarmrules.threshold[key].baseOn;
          val = this.curData.alarmrules.threshold[key].up.value;
        } else if (key === 'return_code') {
          val = this.curData.alarmrules.return_code.val;
          // 重置on
          this.curData.alarmrules.return_code.on = !(val === null || val === '');
        } else if (key === 'trans_count') {
          baseOn = this.curData.alarmrules.threshold[key].baseOn;
          val = [this.curData.alarmrules.threshold[key].up.value, this.curData.alarmrules.threshold[key].down.value];
        } else {
          // health
          baseOn = this.curData.alarmrules[key].baseOn;
          val = this.curData.alarmrules[key].health_set;
        }
        // 校验
        const reg = this.alaCheck[key].baseline.reg;
        if (key === 'return_code') {
          curAlaCheck.baseline.errorFlag = !reg.test(val);
          // set father
          curAlaCheck.errorFlag = curAlaCheck.baseline.errorFlag;
        } else if (key === 'trans_count') {
          curAlaCheck.baseline.up.errorFlag = !baseOn && !reg.test(String(val[0]));
          curAlaCheck.baseline.down.errorFlag = !baseOn && !reg.test(String(val[1]));
          let curMsg = '小于16位的正整数';
          // 且不高于
          if (!baseOn && reg.test(String(val[0])) && reg.test(String(val[1])) && Number(val[0]) < Number(val[1])) {
            [curAlaCheck.baseline.up.errorFlag, curAlaCheck.baseline.down.errorFlag] = [true, true];
            curMsg = '小于16位的正整数, 高于值大于低于值';
          }
          [curAlaCheck.baseline.up.errorMsg, curAlaCheck.baseline.down.errorMsg] = [curMsg, curMsg];
          // set father
          curAlaCheck.errorFlag = curAlaCheck.baseline.up.errorFlag || curAlaCheck.baseline.down.errorFlag || curAlaCheck.strategyErrorFlag;
        } else {
          curAlaCheck.baseline.errorFlag = !baseOn && !reg.test(val);
          // set father
          curAlaCheck.errorFlag = curAlaCheck.baseline.errorFlag || curAlaCheck.strategyErrorFlag;
        }
      },
    },
    mounted() {
      // this.initModal();
    },
  };
</script>

<style lang="scss" scoped>
.edit-slot{
  font-size: 14px;
  color: #dddddd;
  border: 1px solid #223f5d;
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin-right: 45px;
  .edit-top{
    // height: 40px;
    // line-height: 40px;
    border-bottom: 1px solid #223f5d;
    padding: 5px 30px 5px 20px;
  }
  .title-describe{
    margin-left: 40px;
  }
  .require-icon{
    font-style: normal;
    color: red;
    margin: 0 2px;
  }
  .edit-input{
    margin: 0 8px;
  }
  .edit-main{
    display: flex;
    height: 340px;
  }
  .edit-config{
    padding: 18px 20px;
    min-height: 275px;
  }
  .edit-nav-wrap{
    width: 249px;
    border-right: 1px solid #223f5d;
  }
  .nav-name1, .nav-name2{
    height: 26px;
    line-height: 26px;
  }
  .nav-name1{
    background-color: #152a3e;
    color: #919aa2;
    padding-left: 22px;
  }
  .nav-name2{
    padding-left: 37px;
  }
  .nav-name2.nav-error{
    background-image: url('../../../assets/alertManage/nav_error.png');
    background-repeat: no-repeat;
    background-position: 222px 5px;
  }
  .nav-name2.active, .nav-name2:hover{
    background-color: #1a5275;
  }
  .detail-item{
    // padding-top: 5px;
    display: flex;
    label{
      display: inline-block;
      width: 64px;
      margin: 0 40px;
      padding-top: 6px;
      text-align: right;
    }
    .baseline-type{
      display: inline-block;
      width: 135px;
    }
    // ul{
    //   margin-left: 144px;
    // }    
  }
  .returncode-config {
    .detail-item{
      height: 45px;
    }
    label {
      width: 86px;
    }
  }
  .title1{
    padding: 8px 0;
    font-size: 16px;
    color: #14cef5;
    img{
      margin-right: 8px;
    }
  }
  .baseline-value li{
    height: 32px;
    line-height: 32px;
  }
  .baseline-text{
    color: #14cef5;
  }
  // 禁止状态
  .disable-edit{
    color: #888f95;
  }
}

</style>