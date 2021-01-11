<template>
  <div id="field">
    <!-- <select v-model="name" class="field-fun">
      <option value="str_trim">str_trim</option>
      <option value="str_sub">str_sub</option>
      <option value="str_add">str_add</option>
      <option value="str_regex">str_regex</option>
      <option value="as">as</option>
      <option value="notNull">notNull</option>
      <option value="isNone">isNone</option>
      <option value="in">IN</option>
      <option value="notin">NOT IN</option>
      <option value="add">+</option>
      <option value="sub">-</option>
      <option value="multi">*</option>
      <option value="divide">/</option>
      <option value="and">&&</option>
      <option value="or">||</option>
      <option value="eq">=</option>
      <option value="ne">!=</option>
      <option value="gt">></option>
      <option value="get">>=</option>
      <option value="lt"><</option>
      <option value="let"><=</option>
      <option value="lookup">lookup</option>
    </select> -->
    <CmSelect :list="selectLists" :selectVal="name" :width="146" type="popsUp" @on-change="(val) => { name = val }"></CmSelect>

    <div class="show-1" v-if="showNum === 1 || showNum === 11">
      <!-- 一个空 op value -->
      <input class="show-1-input" type="text" v-model="show6['@regexExpressions']" v-if="showNum === 11" placeholder ="abc:str"/> 
      <!-- 一个选择器 op item1 -->
      <!-- <select class="show-1-1" v-model="show1['@item1']" v-if="showNum === 1">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select> -->
      <CmSelect :list="varArr" v-if="showNum === 1" :selectVal="show1['@item1']" :width="133" style="margin-left:3px;" type="popsUp" @on-change="(val) => { show1['@item1'] = val }"></CmSelect>

    </div>
    <div class="show-2" v-if="showNum === 2">
      <!-- 选择器加返回字段 op item1 value -->
      <!-- <select class="show-2-1" v-model="show7['@item1']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select> -->
      <CmSelect :list="varArr" :selectVal="show7['@item1']" style="margin-left:3px;" :width="133" type="popsUp" @on-change="(val) => { show7['@item1'] = val }"></CmSelect>

      <span>返回字段</span>
      <input type="text" class="show-2-2" v-model="show7['@result']"/>
    </div>
    <div class="show-3" v-if="showNum === 3">
      <!-- 一个选择器加选择器或者空 op item1 item2/op item1 value -->
      <!-- <select class="show-3-1" v-model="show3['@item1']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select> -->
      <CmSelect :list="varArr" :selectVal="show3['@item1']" style="margin-left:3px;" :width="133" type="popsUp" @on-change="(val) => { show3['@item1'] = val }"></CmSelect>

      <!-- <select v-model="spaceOption" class="show-3-2">
        <option value="变量">变量</option>
        <option value="值">值</option>
      </select> -->
      <CmSelect :list="['变量', '值']" :selectVal="spaceOption" :width="76" type="popsUp" @on-change="(val) => { spaceOption = val }"></CmSelect>


      <input class="show-3-3" type="text" v-if="spaceOption === '值'" v-model="show2['@value']" :placeholder ="chooseItem"/>
      <!-- <select class="show-3-4" v-if="spaceOption === '变量'" v-model="show3['@item2']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select> -->
      <CmSelect :list="varArr" v-if="spaceOption === '变量'" :selectVal="show3['@item2']" :width="133" type="popsUp" @on-change="(val) => { show3['@item2'] = val }"></CmSelect>

    </div>
    <div class="show-4" v-if="showNum === 4">
      <!-- 一个选择器加起始位置 op item1 start end -->
      <!-- <select class="show-4-1" v-model="show4['@item1']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select> -->
      <CmSelect :list="varArr" :selectVal="show4['@item1']" style="margin-left:3px;" :width="133" type="popsUp" @on-change="(val) => { show4['@item1'] = val }"></CmSelect>

      <span>起始位置:</span>
      <input class="show-4-2" type="text" placeholder="int" v-model="show4['@start']">
      <span>结束位置:</span>
      <input class="show-4-3" type="text" placeholder="int" v-model="show4['@end']">
    </div>
    <div class="show-3" v-if="showNum === 5">
      <!-- 选择器或空 op item1/op item1 -->
      <!-- <select v-model="spaceOption" class="show-3-2" style="margin-left:5px;">
        <option value="变量">变量</option>
        <option value="value">值</option>
      </select> -->
      <CmSelect :list="['变量', '值']" :selectVal="spaceOption" style="margin-left:3px;" :width="76" type="popsUp" @on-change="(val) => { spaceOption = val }"></CmSelect>

      <input class="show-3-3" type="text" v-if="spaceOption === '值'" v-model="show5['@value']" :placeholder ="chooseItem"/>
      <!-- <select class="show-3-4" v-if="spaceOption === '变量'" v-model="show1['@item1']">
        <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
      </select> -->
      <CmSelect :list="varArr" v-if="spaceOption === '变量'" :selectVal="show1['@item1']" :width="133" type="popsUp" @on-change="(val) => { show1['@item1'] = val }"></CmSelect>

    </div>
    <div class="show-1" v-if="showNum === 6">
        <!-- <select class="show-1-1" v-model="show1['@item1']" v-if="showNum === 6">
          <option :value="item" v-for="(item, index) in varArr" :key="index">{{item}}</option>
        </select> -->
        <CmSelect v-if="showNum === 6" :list="varArr" :selectVal="show8['@item1']" style="margin-left:3px;" :width="133" type="popsUp" @on-change="(val) => { show8['@item1'] = val }"></CmSelect>
        <a class="lookup-a-bc">
          <img src="../../../assets/protocol/pro.png" width="15" height="15" alt="pro" style="cursor:pointer;margin-left:4px;" @click="showLookup=!showLookup">
        </a>
        <div class="lookup" v-if="showLookup">
          <div class="lookup-row1">
            <span style="color:red;margin-left:20px;margin-right:3px;">*</span><span style="margin-right:40px;">方式</span>
            <input type="radio" v-model="lookupMethod" value="1"/><span :style="{color: (lookupMethod !== '1' ? '#879098' : 'white')}">在线编辑</span>
            <!-- <input type="radio" v-model="lookupMethod" value="2"/><span :style="{color: (lookupMethod !== '2' ? '#879098' : 'white')}">已有CSV</span> -->
            <input type="radio" v-model="lookupMethod" value="3"/><span :style="{color: (lookupMethod !== '3' ? '#879098' : 'white')}">导入CSV</span>
          </div>
          <div class="content-1" v-if="lookupMethod === '1'">
            <div class="file-name">
              <span style="color:red;margin-left:20px;margin-right:3px;">*</span><span style="margin-right:25px;">文件名称</span>
              <input type="text" placeholder="请填写另存为CSV文件名称，如：常见银行代码转换" v-model="setfilename" @input="changeSetFileName" :style="allowUpload ? '' : 'border:1px solid red'"/>
            </div>
            <div class="data_edit">
              <span style="color:red;margin-left:20px;margin-right:3px;">*</span><span style="margin-right:25px;">数据编辑</span>
            </div>
            <div class="cbutton">
              <button class="btn-1" @click="addListNowPreFn">新增</button>
              <button class="btn-2" @click="deleteListPreFn">删除</button>
            </div>
            <div class="ctable">
              <ProMainTable class="pro-table" :cols="cols" :rows="TpyeDataOne"
              :scrollHeight="'inherit'"
              :selectList="selectList"
              @select="handleSelect"
              @MainDataChage="MainDataChage"
              style="width: 542px;margin: 20px;"
              >
              </ProMainTable>
            </div>
          </div>
          <!-- <div class="content-2" v-if="lookupMethod === '2'">
            <div class="havedcsv">
              <span style="color:red;margin-left:20px;margin-right:3px;">*</span><span style="margin-right:25px;">已有CSV</span>
              <CmSelect :list="['svg']" :width="133" type="popsUp" style="margin-left:8px;"></CmSelect>
            </div>
            <div class="see-data">
              <span style="color:red;margin-left:20px;margin-right:3px;">*</span><span style="margin-right:25px;">数据预览</span>
            </div>
            <div class="ctable"></div>
          </div> -->
          <div class="content-3" v-if="lookupMethod === '3'">
            <div class="choose-file">
              <span style="color:red;margin-left:20px;margin-right:3px;">*</span><span style="margin-right:30px;">选择文件</span>
              <input class="text" type="text" placeholder="上传文件格式仅支持：“ code, data ”" @click="chooseFile" v-model="chooseFileName"/>
              <input class="file" type="file" ref="chooseFile" @change="fileChange"/>
              <button class="filebtn-1" @click="chooseFile">浏览</button>
              <button class="filebtn-2" @click="uploadFile">上传</button>
            </div>
            <div class="rename">
              <span style="color:red;margin-left:20px;margin-right:3px;">*</span><span style="margin-right:16px;">文件重命名</span>
              <input type="text" placeholder="请填写另存为CSV文件名称，如：常见银行代码转换" v-model="rename" @input="changeReName" :style="allowUpload ? '' : 'border:1px solid red'"/>
            </div>
            <div class="data-edit">
              <span style="color:red;margin-left:20px;margin-right:3px;">*</span><span style="margin-right:25px;">数据编辑</span>
            </div>
            <div class="cbutton">
              <button class="btn-1" @click="addListPreFn">新增</button>
              <button class="btn-2" @click="deleteListPreFn">删除</button>
            </div>
            <div class="ctable">
              <ProMainTable class="pro-table" :cols="cols" :rows="DataOne"
              :scrollHeight="'inherit'"
              :selectList="selectList"
              @select="handleSelect"
              @MainDataChage="MainDataChage"
              style="width: 542px;margin: 20px;"
              >
              </ProMainTable>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>

import { mapState } from 'vuex';
import _ from 'lodash';
import jsCookie from 'js-cookie';
import { formProtocol } from '@/pages/protocol/service/index';
import ProMainTable from '@/components/protocol/ProMainTable';

import CmSelect from './Select';

export default {
  components: { CmSelect, ProMainTable },
  data() {
    return {
      cols: [
        { key: 'select', name: '', type: 'select', widths: 42 },
        { key: 'num', name: '序号', type: 'num', widths: 64 },
        { key: 'protocol_name', name: '代码', widths: 180 },
        { key: 'desc', name: '标准值', widths: 254 },
      ],
      changeInputData: [],
      ArtArr: [],
      hasCsv: false,
      selectList: [],
      chooseFileName: '',
      rename: '', // 导入的时候重命名
      setfilename: '', // 编辑的时候重命名
      uploadFileForm: new FormData(),
      token: jsCookie.get('csrftoken'),
      showLookup: false,
      selectLists: ['MAX', 'MIN', 'COUNT', 'SUM', 'as', 'notNull', 'isNone', 'in', 'notin', 'add', 'sub', 'multi', 'divide', 'eq', 'ne', 'gt', 'ge', 'lt', 'le'],
      name: 'str_trim',
      reData: {}, // 将返回的值
      varArr: ['Stsld', 'PrcSts', 'PrcCd', 'Prtry'],
      randomChoose: ['123: int', 'abc: str', '123.40: float', 'true: bool'], // spaceholder 随机
      spaceOption: '变量',
      lookupMethod: '1',
      showOption: {
        MAX: 1,
        MIN: 1,
        COUNT: 1,
        SUM: 1,
        str_trim: 1,
        str_sub: 4,
        str_add: 3,
        str_regex: 11, // 只显示文本
        as: 5,
        notNull: 2,
        isNone: 2,
        in: 3,
        notin: 3,
        add: 3,
        sub: 3,
        multi: 3,
        divide: 3,
        and: 3,
        or: 3,
        eq: 3,
        ne: 3,
        gt: 3,
        ge: 3,
        lt: 3,
        le: 3,
        lookup: 6,
      },
      show1: {
        '@op': '',
        '@item1': 'Stsld',
      },
      show2: {
        '@op': '',
        '@item1': 'Stsld',
        '@value': '',
      },
      show3: {
        '@op': '',
        '@item1': 'Stsld',
        '@item2': 'Stsld',
      },
      show4: {
        '@op': '',
        '@item1': 'Stsld',
        '@start': '',
        '@end': '',
      },
      show5: {
        '@op': '',
        '@value': '',
      },
      show6: {
        '@op': '',
        '@regexExpressions': '',
      },
      show7: {
        '@op': '',
        '@item1': 'Stsld',
        '@result': '',
      },
      show8: {
        '@op': 'lookup',
        '@item1': '',
        '@file': '',
      },
      allowUpload: true,
    };
  },
  watch: {
    lookupMethod() {
      this.setfilename = this.show8['@file'];
    },
    name() {
      if (this.name === 'lookup') {
        this.$emit('isLookup', true);
      } else {
        this.$emit('isLookup', false);
      }
    },
  },
  updated() {
    switch (this.showNum) {
      case 1:
        this.reData = this.show1;
        break;
      case 2:
        this.reData = this.show7;
        break;
      case 3:
        if (this.spaceOption === '变量') {
          this.reData = this.show3;
        } else {
          this.show2['@item1'] = this.show3['@item1'];
          this.reData = this.show2;
        }
        break;
      case 4:
        this.reData = this.show4;
        break;
      case 5:
        if (this.spaceOption === '变量') {
          this.reData = this.show1;
        } else {
          this.reData = this.show5;
        }
        break;
      case 11:
        this.reData = this.show6;
        break;
      case 6:
        this.reData = this.show8;
        break;
      default: break;
    }
    this.reData['@op'] = this.name;
    this.$emit('opData', { index: this.currentIndex, reData: this.reData, ifIndex: this.ifIndex });
  },
  props: ['currentIndex', 'ifIndex', 'poItem', 'fieldData', 'delLookup'],
  created() {
    // 判断是否需要lookup
    if (this.delLookup && this.delLookup === true) {
      for (let i = 0; i < this.selectLists.length; i += 1) {
        if (this.selectLists[i] === 'lookup') {
          this.selectLists.splice(i, 1);
          break;
        }
      }
    }
    // this.varArr = [].concat(this.$store.state.listRule.ruleList);
    // 这里将传进来的值还原
    this.getfieldfromout();
    // console.log(this.fieldData);
    // 创建的时候也更新返回
    switch (this.showNum) {
      case 1:
        this.reData = this.show1;
        break;
      case 2:
        this.reData = this.show7;
        break;
      case 3:
        if (this.spaceOption === '变量') {
          this.reData = this.show3;
        } else {
          this.show2['@item1'] = this.show3['@item1'];
          this.reData = this.show2;
        }
        break;
      case 4:
        this.reData = this.show4;
        break;
      case 5:
        if (this.spaceOption === '变量') {
          this.reData = this.show1;
        } else {
          this.reData = this.show5;
        }
        break;
      case 11:
        this.reData = this.show6;
        break;
      case 6:
        this.reData = this.show8;
        break;
      default: break;
    }
    this.reData['@op'] = this.name;
    this.$emit('opData', { index: this.currentIndex, reData: this.reData, ifIndex: this.ifIndex });
  },
  methods: {
    changeSetFileName() {
      this.show8['@file'] = this.setfilename;
      const arr = this.show8['@file'].split('.');
      if (arr[arr.length - 1] !== 'csv') {
        this.allowUpload = false;
        this.show8['@file'] = '';
      } else {
        this.allowUpload = true;
      }
    },
    addListNowPreFn() {
      this.changeSetFileName();
      if (this.allowUpload) {
        const typeScv = this.show8['@file'];
        const addObj = {};
        const naData = ['code'];
        naData.push(typeScv);
        addObj.tra = ['', ''];
        addObj.data = [];
        addObj.data.push(naData);
        addObj.csvname = typeScv;
        console.log(this.hasCsv);
        if (this.hasCsv) {
          this.hasCsv = false;
          this.$store.dispatch('addCsvRename', addObj);
        } else {
          this.hasCsv = true;
          this.$store.dispatch('newCsv', addObj); // 传一个需要添加的对象
        }
      } else this.hasCsv = false;
    },
    addListPreFn() {
      const typeScv = this.show8['@file'];
      const addObj = {};
      addObj.tra = ['', ''];
      addObj.csvname = typeScv;
      this.$store.dispatch('addCsvRename', addObj); // 传一个需要添加的对象
    },
    deleteListPreFn() {
      const typeScv = this.show8['@file'];
      const addObj = {};
      addObj.index = this.selectList;
      addObj.csvname = typeScv;
      this.$store.dispatch('delCsvRename', addObj); // 传需要删除的数组
      this.handleSelect({ index: -1, checked: false });
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
    MainDataChage(data) {
      const changeArr = [];
      const preObj = {};
      const typeScv = this.show8['@file'];
      preObj['@item'] = data.first;
      preObj['#text'] = data.sec;
      preObj.index = data.index;
      preObj.csvname = typeScv;
      this.$store.dispatch('updateCsv', preObj);
      changeArr.push(preObj);
      this.changeInputData = [];
    },
    TpyeData(data) {
      const TpyeDataArr = [];
      this.changeInputData = data;
      if (this.changeInputData.length === 0) {
        this.changeInputData = data;
      }
      const InputData = this.changeInputData;
      _.forEach(InputData, (item, index) => {
        if (index !== 0) {
          const TpyeDataObj = {};
          TpyeDataObj.protocol_name = item[0];
          TpyeDataObj.desc = item[1];
          TpyeDataArr.push(TpyeDataObj);
        }
      });
      this.ArtArr = TpyeDataArr;
      this.tableData = this.ArtArr;
    },
    changeReName() {
      this.uploadFileForm.set('filename', this.rename);
      this.show8['@file'] = this.rename;
      const arr = this.show8['@file'].split('.');
      if (arr[arr.length - 1] !== 'csv') {
        this.allowUpload = false;
        this.show8['@file'] = '';
      } else {
        this.allowUpload = true;
      }
    },
    uploadFile() {
      const arr = this.show8['@file'].split('.');
      if (arr[arr.length - 1] !== 'csv') {
        this.show8['@file'] = '';
        this.allowUpload = false;
        return;
      }
      this.allowUpload = true;
      const _this = this;
      // 用于上传文件uploadFileForm
      console.log(this.token);
      formProtocol(this.uploadFileForm).then((res) => {
        this.$store.dispatch('addCsv', { csvname: res.data.data.filename, data: res.data.data.data });
        // console.log(res);
        this.show8['@file'] = res.data.data.filename;
        _this.TpyeData(res.data.data.data);
      }).catch((e) => {
        console.log(e);
      });
    },
    chooseFile() {
      this.$refs.chooseFile.dispatchEvent(new MouseEvent('click'));
    },
    fileChange(e) {
      this.chooseFileName = e.target.files[0].name;
      this.rename = this.chooseFileName;
      this.uploadFileForm = new FormData();
      this.uploadFileForm.append('protocolfile', e.target.files[0]);
      this.uploadFileForm.append('csrfmiddlewaretoken', this.token);
      this.uploadFileForm.append('protocolname', this.$store.state.protocolData['proto.xml'].basic.name);
      this.uploadFileForm.append('filename', this.rename);
      const arr = this.rename.split('.');
      if (arr[arr.length - 1] !== 'csv') {
        this.allowUpload = false;
      } else {
        this.allowUpload = true;
      }
    },
    getfieldfromout() {
      this.name = this.fieldData['@op'];
      switch (this.showOption[this.fieldData['@op']]) {
        case 1:
          this.show1 = this.fieldData;
          break;
        case 2:
          this.show7 = this.fieldData;
          break;
        case 3:
          if (!this.fieldData['@item2']) {
            this.spaceOption = '值';
            this.show3['@item1'] = this.fieldData['@item1'];
            this.show2['@value'] = this.fieldData['@value'];
          } else {
            this.spaceOption = '变量';
            this.show3 = this.fieldData;
          }
          break;
        case 4:
          this.show4 = this.fieldData;
          break;
        case 5:
          if (!this.fieldData['@item1']) {
            this.show1['@op'] = this.name;
            this.show5['@value'] = this.fieldData['@value'];
            this.spaceOption = '值';
          } else {
            this.show1['@item1'] = this.fieldData['@item1'];
            this.spaceOption = '变量';
          }
          break;
        case 11:
          this.show6 = this.fieldData;
          break;
        case 6:
          this.show8 = this.fieldData;
          this.setfilename = this.fieldData['@file'];
          this.rename = this.fieldData['@file'];
          break;
        default: break;
      }
    },
  },
  mounted() {
    this.varArr = this.$store.state.listRule.ruleList;
  },
  computed: {
    chooseItem() {
      const rand = Math.floor(Math.random() * 4);
      return this.randomChoose[rand];
    },
    TpyeDataOne() {
      let data = [];
      const typeScv = this.show8['@file'];
      _.forEach(this.protoColData, (item) => {
        if (typeScv === item.csvname) data = item.data;
      });
      const TpyeDataArr = [];
      if (this.changeInputData.length === 0) {
        this.changeInputData = data;
      }
      const InputData = this.changeInputData;
      _.forEach(InputData, (item, index) => {
        if (index !== 0) {
          const TpyeDataObj = {};
          TpyeDataObj.protocol_name = item[0];
          TpyeDataObj.desc = item[1];
          TpyeDataArr.push(TpyeDataObj);
        }
      });
      this.ArtArr = TpyeDataArr;
      this.tableData = this.ArtArr;
      return this.ArtArr;
    },
    DataOne() {
      let data = [];
      const typeScv = this.show8['@file'];
      _.forEach(this.protoColData, (item) => {
        if (typeScv === item.csvname) data = item.data;
      });
      const TpyeDataArr = [];
      if (this.changeInputData.length === 0) {
        this.changeInputData = data;
      }
      const InputData = this.changeInputData;
      _.forEach(InputData, (item, index) => {
        if (index !== 0) {
          const TpyeDataObj = {};
          TpyeDataObj.protocol_name = item[0];
          TpyeDataObj.desc = item[1];
          TpyeDataArr.push(TpyeDataObj);
        }
      });
      this.ArtArr = TpyeDataArr;
      this.tableData = this.ArtArr;
      return this.ArtArr;
    },
    ...mapState({
      protoColData: state => state.protocolData.csv,
    }),
    showNum() {
      return this.showOption[this.name];
    },
    validIndexList() {
      const validIndexList = [];
      this.tableData.forEach((d, i) => {
        if (d.selectable || !_.has(d, 'selectable')) {
          validIndexList.push(i);
        }
      });
      return validIndexList;
    },
    canAllDelete() { return this.selectList.length === 0; },
    headSelect() { return this.selectList.length === this.validIndexList.length && this.selectList.length !== 0; },
  },
};
</script>
<style lang="scss" scoped>
  input{
    color: white;
  }
  #field{
    .lookup-a-bc{
      width: 25px;
      height: 25px;
      border: 1px solid #183149;
      background-color: #051d30;
      border-radius: 3px;
      margin-left: 3px;
      display: block;
    }
    .lookup{
      position: absolute;
      width: 573px;
      // height: 300px;
      background-color: #051d30;
      top: 33px;
      left: -165px;
      // opacity: 0.5;
      z-index: 999;
      border: 1px solid #183149;
      border-left: 0;
      border-right: 0;
      .lookup-row1{
        display: flex;
        margin-top:10px;
        input{
          margin-left: 20px;
          margin-right: 5px;
        }
      }
      .content-1{
        .file-name{
          margin-top: 10px;
          input{
            width: 360px;
            height: 25px;
            border-radius: 3px;
            border: 1px solid #183149;
            background-color: #051d30;
            padding-left: 10px;
            padding-right: 10px;
          }
        }
        .data_edit{
          height: 25px;
          margin-top: 10px;
        }
        .cbutton{
          margin-left: 20px;
          margin-top: 10px;
          .btn-1{
            width: 60px;
            height: 30px;
            border: 0;
            border-radius: 3px;
            background-color: #1d73a8;
          }
          .btn-2{
            width: 60px;
            height: 30px;
            border: 0;
            border-radius: 3px;
            background-color: #d04631;
            margin-left: 10px;
          }
        }
      }
      .content-2{
        .havedcsv{
          height: 25px;
          margin-top: 10px;
          display: flex;
          align-items: center;
        }
        .see-data{
          margin-top: 10px;
        }
      }
      .content-3{
        .choose-file{
          display: flex;
          align-items: center;
          margin-top: 10px;
          .text{
            width: 300px;
            height: 25px;
            border: 1px solid #183149;
            background-color: #051d30;
            border-radius: 3px;
            padding-left: 10px;
            padding-right: 10px;
          }
          .file{
            width: 0;
            height: 0;
            position: absolute;
            opacity: 0;
          }
          .filebtn-1{
            width: 60px;
            height: 30px;
            background-color: #051d30;
            border:1px solid #0fb9db;
            margin-left: 10px;
            border-radius: 3px;
          }
          .filebtn-2{
            width: 60px;
            height: 30px;
            background-color: #0fb9db;
            border:1px solid #0fb9db;
            margin-left: 10px;
            border-radius: 3px;
          }
        }
        .rename{
          display: flex;
          align-items: center;
          margin-top: 10px;
          input{
            width:360px;
            height: 25px;
            border: 1px solid #183149;
            background-color: #051d30;
            padding-left: 10px;
            padding-right: 10px;
            border-radius: 3px;
          }
        }
        .data-edit{
          height: 25px;
          margin-top: 10px;
        }
        .cbutton{
          margin-left: 20px;
          margin-top: 10px;
          .btn-1{
            width: 60px;
            height: 30px;
            border: 0;
            border-radius: 3px;
            background-color: #1d73a8;
          }
          .btn-2{
            width: 60px;
            height: 30px;
            border: 0;
            border-radius: 3px;
            background-color: #d04631;
            margin-left: 10px;
          }
        }
      }
    }
    display: flex;
    .field-fun{
      background-color: #081a29;
      width: 145px;
      height: 25px;
      border-radius: 3px;
      border:1px solid #183149;
      padding-left: 10px;
      padding-right: 10px;
    }
    .show-1{
      position: relative;
      display: flex;
      .show-1-input{
        width: 250px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        margin-left: 5px;
      }
      .show-1-1{
        width: 130px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .show-2{
      .show-2-1{
        width: 130px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        margin-left: 5px;
      }
      .show-2-2{
        width: 130px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        padding-left: 10px;
        padding-right: 10px;
        // margin-left: 5px;
      }
    }
    .show-3{
      .show-3-1{
        width: 130px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }
      .show-3-2{
        width: 80px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        // margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }
      .show-3-4, .show-3-3{
        width: 130px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        // margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .show-4{
      .show-4-1{
        width: 130px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }
      .show-4-2, .show-4-3{
        width: 50px;
        height: 25px;
        border:1px solid #183149;
        background-color: #081a29;
        border-radius: 3px;
        // margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
        box-sizing: border-box;
      }
    }
  }
</style>