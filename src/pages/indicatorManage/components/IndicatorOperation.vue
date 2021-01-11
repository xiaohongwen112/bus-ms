<template>
  <config-box :tabs="tabs" :width='755' :height='505' :scrollheight="scrollheight" @closeConfig="close" @saveConfig="saveSettings">
    <div slot="setting" class="opertaion-container">
      <div class="dimension-info">
        <div class="baes-info">
          <div>
            <span class="title required">名称</span>
            <CmInput :value="curValue" :width="inputWidth" type="popsUp" :correctFlag="correctFlag" :errorFlag="errorFlag" 
             :maxlength="20" @mouseover="showPopsTip" @mouseout="showPops = false" @on-change="onChange"></CmInput>
          </div>
          <div>
            <span class="title">描述</span>
            <CmTextarea v-model="curDescrip" :width="textWidth" :maxlength="255" type="popsUp"></CmTextarea>
          </div>
          <div class="setting-content">
            <span class="title">计算方式</span>
            <div class="rule-box">
              <CmSelect :list="ruleList" :selectVal="ruleIndex[selectRule]" :disable="title === '编辑'" type="popsUp" @on-change="changeRule"/>
            </div>
            <div class="unsetting" v-show="!createFlag && title === '新建指标' && selectRule === 'indicator'">
              <span>未配置，<label class="create-btn" @click="createFlag = true">点击创建</label></span>
            </div>
            <div class="btn-box" v-show="createFlag || title === '编辑' || selectRule === 'protocol'">
              <BmsBtn type="add" @click="addIndicator">添加</BmsBtn>
              <BmsBtn type="danger" @click="delIndicator">删除</BmsBtn>
            </div>
          </div>
          <div v-show="(title === '编辑' || selectRule === 'protocol') && selectRule !== 'indicator'">
            <ProMainTable class="pro-table" :cols="protocolCols" :rows="tableData"
            :headSelect="headSelect" :selectList="selectList"
            @select="handleSelect"
            @MainDataChage="MainDataChage($event, 'protocol')"
            @editSingleLine="editSingleLine($event, 'protocol')"
            style="width: 560px;"
            >
            </ProMainTable>
          </div>
          <div v-show="createFlag || title === '编辑' && selectRule === 'indicator'">
            <ProMainTable class="pro-table" :cols="indicatorCols" :rows="tableData"
            :headSelect="headSelect" :selectList="selectList"
            @select="handleSelect"
            @MainDataChage="MainDataChage($event, 'indicator')"
            @editSingleLine="editSingleLine($event, 'indicator')"
            style="width: 560px;"
            >
            </ProMainTable>
          </div>
        </div>
      </div>
      <div class="error-tip" v-show="indicatorFlag">{{errorTip}}</div>
      <PopsMsg type="error" :showTips="showPops" :msg="errmsg" :lefts="lefts" :top="top"></PopsMsg>
    </div>
  </config-box>
</template>

<script>
  import _ from 'lodash';
  import { ConfigBox, CmInput, CmTextarea, BmsBtn, ProMainTable, CmSelect, PopsMsg } from '@/components/basic';
  import { updateIndicator, checkParameter } from '../service';

  export default {
    props: {
      title: {
        type: String,
        default: '',
      },
      data: {
        type: Object,
        default() {
          return {
            name: '',
            desc: '',
          };
        },
      },
      config: {
        type: Object,
        default() {
          return {};
        },
      },
      num: {
        type: [Number, String],
        default: '',
      },
    },
    watch: {
      data(newVal) {
        this.curValue = newVal.name;
        this.curDescrip = newVal.desc;
      },
    },
    components: { ConfigBox, CmInput, CmTextarea, BmsBtn, ProMainTable, CmSelect, PopsMsg },
    computed: {
      validIndexList() {
        const validIndexList = [];
        this.tableData.forEach((d, i) => {
          if (d.selectable || !_.has(d, 'selectable')) {
            validIndexList.push(i);
          }
        });
        return validIndexList;
      },
      headSelect() { return this.selectList.length === this.validIndexList.length && this.selectList.length !== 0; },
    },
    data() {
      return {
        oldName: '',
        tabs: [
          { id: 'setting', text: this.title },
        ],
        correctFlag: false,
        errorFlag: false,
        curValue: this.data.name,
        inputWidth: 335,
        curDescrip: this.data.desc,
        textWidth: 560,
        scrollheight: 480,
        indicatorFlag: false,
        createFlag: false,
        protocolCols: [
          { key: 'select', name: '', type: 'select' },
          { key: 'num', name: '序号', type: 'num', widths: 50 },
          { key: 'protocol_name', type: 'listOne', name: '协议', widths: 200 },
          { key: 'associated', type: 'associated', name: '关联字段', widths: 185 },
          { key: 'edit', type: 'edit', name: '操作', widths: 80 },
        ],
        indicatorCols: [
          { key: 'select', name: '', type: 'select' },
          { key: 'num', name: '序号', type: 'num', widths: 50 },
          { key: 'associated', type: 'associated', name: '关联指标', widths: 385 },
          { key: 'edit', type: 'edit', name: '操作', widths: 80 },
        ],
        proConfigData: { nowListOne: '', listArrOne: [], associated: '' },
        indConfigData: { associated: '' },
        tableData: [],
        selectList: [],
        ruleList: [
          {
            name: '基于协议字段',
            value: 'protocol',
          },
          {
            name: '基于指标',
            value: 'indicator',
          },
        ],
        selectRule: 'protocol',
        ruleIndex: {
          protocol: '基于协议字段',
          indicator: '基于指标',
        },
        activeIndex: 0,
        showPops: false,
        errmsg: '',
        top: 0,
        lefts: 0,
        errorTip: '',
      };
    },
    methods: {
      showPopsTip(e) {
        if (this.errorFlag && this.errmsg !== '') {
          const ele = e.target.parentNode.getBoundingClientRect();
          this.top = ele.top;
          this.lefts = ele.left + ele.width / 2;
          this.showPops = true;
        }
      },
      dealData(dataList, i) {
        const compDataArr = [];
        Object.keys(dataList[i]).forEach((item) => {
          console.log(item);
          if (isNaN(item)) {
            if (dataList[i][item] !== undefined) {
              if (dataList[i][item] instanceof Array) {
                dataList[i][item].forEach((x) => {
                  compDataArr.push(x['@item1'] || x['@value']);
                  if (x.field instanceof Array && x.field.length > 0) {
                    x.field.forEach((f) => {
                      compDataArr.push(f['@item1'] || f['@value']);
                    });
                  }
                });
              }
            }
            if (dataList[i][item] !== undefined) {
              if (dataList[i][item].field instanceof Array && dataList[i][item].field.length > 0) {
                dataList[i][item].field.forEach((x) => {
                  compDataArr.push(x['@item1'] || x['@value']);
                });
              }
            }
            if (dataList[i][item].field) {
              if (!(dataList[i][item].field instanceof Array)) {
                console.log(item, 'item非数组结构');
              } else if (dataList[i][item].field.length > 0) {
                dataList[i][item].field.forEach((x) => {
                  compDataArr.push(x['@item1'] || x['@value']);
                });
              }
            }
          } else {
            if (dataList[i][item].if !== undefined) { // 存在if判断条件（默认取第一条的第一个field的第一条）
              if (dataList[i][item].if instanceof Array) { // if else
                dataList[i][item].if.forEach((x) => {
                  compDataArr.push(x['@item1'] || x['@value']);
                });
                if (dataList[i][item].if[0].field.length > 0) { // 多条 field
                  dataList[i][item].if[0].field.forEach((f) => {
                    compDataArr.push(f['@item1'] || f['@value']);
                  });
                }
              } else { // if obj
                if (dataList[i][item].if.field.length > 0) { // 多条 field
                  dataList[i][item].if[0].field.forEach((f) => {
                    compDataArr.push(f['@item1'] || f['@value']);
                  });
                }
              }
              if (dataList[i][item].else instanceof Array) { // if else
                dataList[i][item].else.forEach((x) => {
                  compDataArr.push(x['@item1'] || x['@value']);
                });
                if (dataList[i][item].else[0].field && dataList[i][item].else[0].field.length > 0) { // 多条 field
                  dataList[i][item].else[0].field.forEach((f) => {
                    compDataArr.push(f['@item1'] || f['@value']);
                  });
                }
              } else {
                if (dataList[i][item].else.field.length > 0) { // 多条 field
                  dataList[i][item].else.field.forEach((f) => {
                    compDataArr.push(f['@item1'] || f['@value']);
                  });
                }
              }
            } else { // field的第一条
              if (dataList[i][item].field.length > 0) { // fiedf 为多条格式 数组取第一条
                if (dataList[i][item].field.length > 0) { // 多条 field
                  dataList[i][item].if[0].field.forEach((f) => {
                    compDataArr.push(f['@item1'] || f['@value']);
                  });
                }
              }
            }
          }
        });
        console.log('compDataArr', compDataArr);
        this.tableData[this.activeIndex].associated = this.dedupe(compDataArr).sort().join(',');
        this.tableData[this.activeIndex].normalizes = this.$store.state.protocolData.normalizes;
        this.displayDate();
      },
      dedupe(array) { // 数组去重
        return Array.from(new Set(array));
      },
      changeRule(newV) {
        this.selectRule = newV.value;
        if (newV.value === 'protocol') {
          this.createFlag = false;
          this.indicatorFlag = false;
        }
        this.tableData = [];
        this.judege();
        this.$store.dispatch('ititAllData');
      },
      addIndicator() {
        this.indicatorFlag = false;
        this.judege();
      },
      editSingleLine(e, type) {
        this.activeIndex = e;
        this.indicatorFlag = false;
        this.$store.state.listRule.ruleList = [];
        let list = [];
        if (this.selectRule === 'protocol') {
          this.config.protocol.forEach((item) => {
            console.log(333, this.tableData[e].nowListOne, item.name);
            if (item.name === this.tableData[e].nowListOne) {
              list = item.decode_field;
            }
          });
        } else {
          list = this.config.indicator;
        }
        this.$store.dispatch('setRuleList', list);
        this.$emit('editSingleLine', e, type);
      },
      delIndicator() {
        const list = this.selectList.sort((a, b) => { return b - a; }); // eslint-disable-line
        list.forEach((item) => {
          this.tableData.splice(item, 1);
        });
        this.$store.dispatch('delData', list);
        if (this.tableData.length === 0) {
          this.$store.dispatch('ititAllData');
        }
        this.selectList = [];
        this.displayDate();
      },
      handleSelect(data) {
        const [index, checked] = [data.index, data.checked];
        console.log(index, checked);
        if (index === -1 && !checked) {
          this.selectList = [];
        } else if (index === -1 && checked) {
          this.selectList = this.validIndexList;
        } else if (this.selectList.includes(index) && !checked) {
          this.selectList = _.filter(this.selectList, d => d !== index);
        } else if (!this.selectList.includes(index) && checked) {
          this.selectList.push(index);
        }
      },
      MainDataChage(e, type) {
        console.log(e, type);
        if (type === 'protocol') {
          this.tableData[e.index].nowListOne = e.val;
          this.tableData[e.index].associated = '';
        }
        this.displayDate();
        this.$store.dispatch('delData', [e.index]);
      },
      displayDate() { // 判断数据是否存在重复项
        let find = false;
        for (let i = 0; i < this.tableData.length; i += 1) {
          for (let j = i + 1; j < this.tableData.length; j += 1) {
            if (this.tableData[i].associated !== '' && this.tableData[j].associated !== '') {
              if (this.tableData[i].nowListOne === this.tableData[j].nowListOne && this.tableData[i].associated === this.tableData[j].associated) {
                find = true;
                break;
              }
            }
          }
          if (find) break;
        }
        console.log('find', find, this.tableData);
        if (find) {
          this.indicatorFlag = true;
          this.errorTip = '指标计算方式配置项不可重复';
        } else this.indicatorFlag = false;
      },
      saveSettings() {
        this.onChange(this.curValue);
        if (this.errorFlag) return;
        if (this.tableData.length === 0 || (this.selectRule === 'indicator' && !this.createFlag)) {
          this.indicatorFlag = true;
          this.errorTip = '指标计算方式未配置';
        }
        if (this.tableData.length === 1) {
          if (this.tableData[0].associated === '' || this.tableData[0].associated.length === 0) {
            this.indicatorFlag = true;
            this.errorTip = '指标计算方式未配置';
          }
        } else {
          this.tableData.forEach((item) => {
            if (item.associated === '' || item.associated.length === 0) {
              this.indicatorFlag = true;
              this.errorTip = '指标计算方式未配置';
            } else this.indicatorFlag = false;
          });
        }
        if (!this.indicatorFlag) {
          const config = [];
          this.tableData.forEach((x, index) => {
            const norContent = x.normalizes.normalize[index] || x.normalizes.normalize;
            const nor = {
              normalize: norContent instanceof Array ? norContent : [norContent],
            };
            config.push(
              {
                name: x.nowListOne,
                field: x.associated.split(','),
                normalizes: nor,
              },
            );
          });
          this.displayDate();
          if (!this.indicatorFlag) {
            const data = {
              name: this.curValue,
              oldName: this.oldName,
              desc: this.curDescrip === undefined ? '' : this.curDescrip,
              related: this.selectRule,
              config: JSON.stringify(config),
            };
            if (this.title === '编辑') data._id = this.num;
            updateIndicator(data).then((res) => {
              if (res.data.code === 0) this.$parent.saveChange();
            });
          }
        }
      },
      onChange(val) {
        this.curValue = val;
        if (this.curValue === '' || this.curValue === undefined) {
          this.errmsg = '';
          this.errorFlag = true;
          this.correctFlag = false;
        } else {
          const char = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
          if (!char.test(this.curValue)) {
            this.errorFlag = true;
            this.correctFlag = false;
            this.errmsg = '不能输入中文、英文和数字之外的字符';
          } else {
            if (this.curValue.length < 2) {
              this.errorFlag = true;
              this.correctFlag = false;
              this.errmsg = '长度至少为2';
              return;
            }
            const data = {
              name: this.curValue,
              flag: 'indicator',
              status: 'create',
            };
            if (this.title === '编辑') {
              data.status = 'edit';
              data._id = this.num;
            }
            checkParameter(data).then((res) => {
              if (res.data.code !== 0) {
                this.errorFlag = true;
                this.correctFlag = false;
                this.errmsg = '指标名称已存在，请重新输入';
              } else {
                this.errorFlag = false;
                this.correctFlag = true;
              }
            }).catch();
          }
        }
      },
      close() {
        this.curValue = '';
        this.curDescrip = '';
        this.$emit('onClose');
      },
      judege() {
        const proConfigData = { nowListOne: '', listArrOne: [], associated: '' };
        if (this.selectRule === 'protocol') {
          this.config.protocol.forEach((item) => {
            proConfigData.listArrOne.push(item.name);
          });
          proConfigData.nowListOne = proConfigData.listArrOne[0];
          this.tableData.push(proConfigData);
        } else this.tableData.push({ associated: '' });
      },
    },
    mounted() {
      this.judege();
      if (this.title === '编辑') {
        this.oldName = this.data.name;
        this.selectRule = this.data.related;
        this.tableData = [];
        if (this.data.related === 'protocol') {
          const proList = [];
          this.config.protocol.forEach((item) => {
            proList.push(item.name);
          });
          this.data.config.forEach((item) => {
            this.tableData.push({
              nowListOne: item.name,
              listArrOne: proList,
              associated: item.field.sort().join(','),
              normalizes: item.normalizes,
            });
          });
        } else {
          this.data.config.forEach((item) => {
            this.tableData.push({
              associated: item.field.sort().join(','),
              normalizes: item.normalizes,
            });
          });
          this.createFlag = true;
        }
        this.$store.dispatch('setData', this.data.normalizes);
      }
    },
  };
</script>

<style lang="scss">
.indicator-tab{
  .config-container{
    .config-main{
      width: 755px !important;
      .nav-content{
        box-sizing: border-box;
      }
      .scroll-area{
        height: inherit !important;
        max-height: 155px;
      }
      .ps--active-x > .ps__rail-x, .ps--active-y > .ps__rail-y {
        background-color: #070f16;
      }
      .ps__thumb-y, .ps__thumb-x {
        background: #1d5d82;
      }
      .cm-textarea{
        textarea{
          height: 55px;
        }
      }
      .stable-td-wrap {
        .stable-tr{
          cursor: default;
          &:last-child{
            cursor: pointer;
          }
        }
      }
    }
  }
  .opertaion-container{
    .pro-table{
      margin-left: calc(100% - 560px);
      .fix-table-wrap{
        .stable-th{
          height: 30px;
          line-height: 30px;
          &:last-child{
            border: none;
          }
        }
      }
      &>.ps-container{
        min-height: 155px;
      }
      .stable-td-wrap{
        height: 30px;
        .stable-tr{
          height: 30px;
          line-height: 30px;
          &:last-child{
            border: none;
          }
        }
      }
      input[type="checkbox"]{
        border: 1px solid #bcc3ca;
        &:checked{
          background: #183149 url(../../../assets/common/checked.svg) no-repeat;
          background-size: 180% 180%;
          background-position-x: -4.5px;
          background-position-y: -4.5px;
        }
      }
      .skill{
        // position: fixed;
        width: 200px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.opertaion-container{
  .dimension-info{
    .baes-info{
      >div{
        display: flex;
        margin-bottom: 15px;
      }
    }
    .title{
      position: relative;
      width: calc(100% - 560px);
      vertical-align: middle;
      font-size: 14px;
      color: #ddd;
      line-height: 30px;
      text-align: right;
      padding-right: 15px;
      box-sizing: border-box;
      &.required:after {
        content: '*';
        position: absolute;
        right: 55px;
        top: 2px;
        color: red;
      }
    }
    .cm-input{
      vertical-align: middle;
    }
    .cm-input, .cm-textarea{
      float: right;
    }
    .setting-content{
      display:block !important;
      .title{
        line-height: inherit;
      }
      .rule-box{
        display:inline-block;
        margin-left: -2px;
        margin-bottom: 13px;
      }
      .btn-box{
        padding-left: 73px;
      }
      button:nth-of-type(1){
        margin-right: 15px;
      }
      .unsetting{
        width: 558px;
        height: 120px;
        line-height: 120px;
        text-align:center;
        border: 1px solid #223f5d;
        border-radius: 3px;
        float: right;
        .create-btn {
          color: #1d73a8;
          cursor: pointer;
        }
      }
    }
  }
  >.error-tip{
    position: absolute;
    bottom: 3px;
    right: 185px;
    text-align: right;
    font-size: 12px;
    color: #d04631;
  }
}
</style>