<template>
  <config-box :tabs="tabs" :width='755' :height='460' :scrollheight="scrollheight" @closeConfig="close" @saveConfig="saveSettings">
    <div slot="setting" class="opertaion-container">
      <div class="dimension-info">
        <div class="baes-info">
          <div>
            <span class="title required">名称</span>
            <CmInput :value="curValue" :width="inputWidth" type="popsUp" :correctFlag="correctFlag" :errorFlag="errorFlag"
            :maxlength="20" @on-change="onChange" @mouseover="showPopsTip" @mouseout="showPops = false"></CmInput>
          </div>
          <div>
            <span class="title">描述</span>
            <CmTextarea v-model="curDescrip" :width="textWidth" :maxlength="255" type="popsUp"></CmTextarea>
          </div>
          <div class="setting-content">
            <span class="title">来源</span>
            <BmsBtn type="add" @click="addDimension">添加</BmsBtn>
            <BmsBtn type="danger" @click="delDimension">删除</BmsBtn>
          </div>
          <div>
            <ProMainTable class="pro-table" :cols="cols" :rows="tableData"
            :headSelect="headSelect" :selectList="selectList" :needResize="needResize"
            @select="handleSelect"
            @MainDataChage="MainDataChage"
            @delSingleLine="delSingleLine"
            style="width: 575px;"
            >
            </ProMainTable>
          </div>
        </div>
      </div>
      <div class="error-tip" v-show="dimensionFlag">{{errorTip}}</div>
      <PopsMsg type="error" :showTips="showPops" :msg="errmsg" :lefts="lefts" :top="top"></PopsMsg>
    </div>
  </config-box>
</template>

<script>
  import _ from 'lodash';
  import { ConfigBox, CmInput, CmTextarea, BmsBtn, ProMainTable, PopsMsg } from '@/components/basic';
  import { checkParameter, updateDimension } from '../service';

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
        type: Array,
        default() {
          return [];
        },
      },
      dataId: {
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
    components: { ConfigBox, CmInput, CmTextarea, BmsBtn, ProMainTable, PopsMsg },
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
        tabs: [
          { id: 'setting', text: this.title },
        ],
        correctFlag: false,
        errorFlag: false,
        curValue: '',
        inputWidth: 335,
        curDescrip: '',
        textWidth: 575,
        scrollheight: 435,
        dimensionFlag: false,
        cols: [
          { key: 'select', name: '', type: 'select' },
          { key: 'num', name: '序号', type: 'num', widths: 50 },
          { key: 'protocol_name', type: 'listOne', name: '协议', widths: 200 },
          { key: 'desc', type: 'listTwo', name: '解码字段', widths: 200 },
          { key: 'delete', type: 'delete', name: '操作', widths: 80 },
        ],
        tableData: [],
        selectList: [],
        showPops: false,
        errmsg: '',
        top: 0,
        lefts: 0,
        needResize: true,
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
      createDimension() {
        this.dimensionFlag = false;
      },
      addDimension() {
        this.dimensionFlag = false;
        this.initConfig();
      },
      delSingleLine(index) {
        this.tableData.splice(index, 1);
        this.displayDate();
      },
      delDimension() {
        const list = this.selectList.sort((a, b) => { return b - a; }); // eslint-disable-line
        list.forEach((item) => {
          this.tableData.splice(item, 1);
        });
        this.selectList = [];
        this.displayDate();
      },
      handleSelect(data) {
        const [index, checked] = [data.index, data.checked];
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
      MainDataChage(data) {
        this.needResize = false;
        if (data.type === 'listOne') {
          this.tableData[data.index].nowListOne = data.val;
          this.config.map((x) => { // eslint-disable-line
            if (x.name === data.val) this.tableData[data.index].listArrTwo = x.decode_field;
          });
          this.tableData[data.index].nowListTwo = this.tableData[data.index].listArrTwo[0];
        } else this.tableData[data.index].nowListTwo = data.val;
        this.displayDate();
      },
      displayDate() { // 判断数据是否存在重复项
        let find = false;
        for (let i = 0; i < this.tableData.length; i += 1) {
          for (let j = i + 1; j < this.tableData.length; j += 1) {
            if (this.tableData[i].nowListOne === this.tableData[j].nowListOne && this.tableData[i].nowListTwo === this.tableData[j].nowListTwo) {
              find = true;
              break;
            }
          }
          if (find) break;
        }
        if (find) {
          this.dimensionFlag = true;
          this.errorTip = '维度来源配置项不可重复';
        } else this.dimensionFlag = false;
      },
      saveSettings() {
        this.onChange(this.curValue);
        if (this.errorFlag) return;
        if (this.tableData.length === 0) {
          this.dimensionFlag = true;
          this.errorTip = '维度来源未配置';
          return;
        }
        this.displayDate();
        if (!this.dimensionFlag) {
          const configData = [];
          this.tableData.forEach((item) => {
            configData.push({ protocol: item.nowListOne, field: item.nowListTwo });
          });
          const data = {
            name: this.curValue,
            desc: this.curDescrip,
            config: JSON.stringify(configData),
          };
          if (this.title === '编辑') data._id = this.dataId;
          updateDimension(data).then((res) => {
            if (res.data.code === 0) {
              this.$emit('onSave');
            }
          }).catch();
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
          if (char.test(this.curValue)) {
            if (this.curValue.length < 2) {
              this.errorFlag = true;
              this.correctFlag = false;
              this.errmsg = '长度至少为2';
              return;
            }
            const data = {
              name: this.curValue,
              flag: 'dimension',
              status: 'create',
            };
            if (this.title === '编辑') {
              data.status = 'edit';
              data._id = this.dataId;
            }
            checkParameter(data).then((res) => {
              if (res.data.code !== 0) {
                this.errorFlag = true;
                this.correctFlag = false;
                this.errmsg = '维度名称已存在，请重新输入';
              } else {
                this.correctFlag = true;
                this.errorFlag = false;
              }
            }).catch();
          } else {
            this.errorFlag = true;
            this.correctFlag = false;
            this.errmsg = '不能输入中文、英文和数字之外的字符';
          }
        }
      },
      close() {
        this.curValue = '';
        this.curDescrip = '';
        this.$emit('onClose');
      },
      initConfig() {
        const protocol = [];
        this.config.forEach((item) => {
          protocol.push(item.name);
        });
        const configData = { nowListOne: '', nowListTwo: '', listArrOne: [], listArrTwo: [] };
        configData.listArrOne = protocol;
        configData.nowListOne = protocol[0];
        this.config.forEach((item) => {
          if (configData.nowListOne === item.name) {
            configData.listArrTwo = item.decode_field;
            configData.nowListTwo = item.decode_field[0];
          }
        });
        this.tableData.push(configData);
      },
    },
    mounted() {
      this.initConfig();
      if (this.title === '编辑') {
        this.tableData = [];
        this.curValue = this.data.name;
        this.curDescrip = this.data.desc;
        const protocol = [];
        this.config.forEach((item) => {
          protocol.push(item.name);
        });
        this.data.config.forEach((item) => {
          let field = [];
          this.config.map((x) => { // eslint-disable-line
            if (x.name === item.protocol) field = x.decode_field;
            return field;
          });
          this.tableData.push({
            nowListOne: item.protocol,
            nowListTwo: item.field,
            listArrOne: protocol,
            listArrTwo: field,
          });
        });
      }
    },
  };
</script>

<style lang="scss">
.dimension-tab{
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
    }
  }
  .opertaion-container{
    .pro-table{
      margin-left: calc(100% - 590px);
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
      text-align: right;
      box-sizing: border-box;
      width: calc(100% - 590px);
      vertical-align: middle;
      font-size: 14px;
      color: #ddd;
      padding-right: 15px;
      line-height: 30px;
      &.required:after {
        content: '*';
        position: absolute;
        right: 52px;
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
      .title{
        line-height: inherit;
      }
      button:nth-of-type(1){
        margin-right: 15px;
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