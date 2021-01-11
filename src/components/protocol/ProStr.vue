<template>
  <div class="pro-str">
    <div style="margin-bottom: 15px;width: 160px;">
      <span class="pro-name-tip"></span>
      <span class="pro-name-title">{{ codeTitle }}</span>
      <span v-if="bntCode" class="pro-close" @click="codeShow = true;bntCode = false"></span>
      <span v-else class="pro-open" @click="codeShow = false;bntCode = true"></span>
    </div>
    <div class="str-code" v-show="codeShow">
      <div class="str-has-data">
        <ProMainTable class="pro-table" :cols="codeCols" :rows="initTable"
              :headSelect="headSelect" :selectList="selectList"
              @select="handleSelect"
              @MainDataChage="MainDataChage"
              style="width: 915px;"
              :scrollHeight="'inherit'"
              >
        </ProMainTable>
      </div>
    </div>
    <span class="pro-name-tip"></span>
    <span class="pro-name-title">{{ nameTitle }}</span>
    <div class="str-prepare">
      <div class="str-has-data">
        <ProTable
          :item2="'预处理字段'"
          :dataList=transData
          @popupPreChange="popupPreChange"
        />
      </div>
    </div>
    <span class="pro-name-tip"></span>
    <span class="pro-name-title">{{ nameSecTitle }}</span>
    <div class="str-normalizes">
      <div class="str-has-data">
        <ProTable
          :item2="'处理字段'"
          :dataList=normalize
          @popupDataChange="popupDataChange"
        />
      </div>
    </div>
    <span class="pro-name-tip"></span>
    <span class="pro-name-title">{{ nametraRename }}</span>
    <div class="addordel">
      <div class="add" @click="addtraRename">新建</div>
      <div class="del" @click="deltraRename">删除</div>
    </div>
    <div class="str-traRename">
      <ProMainTable class="pro-table" :cols="cols" :rows="traceDis"
              :headSelect="headSelect" :selectList="selectList"
              @select="handleSelect"
              @MainDataChage="MainDataChage"
              style="width: 915px;"
              :scrollHeight="'inherit'"
              ref="inputDom"
              >
      </ProMainTable>
    </div>

  </div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import ProTable from './ProTable';
import ProMainTable from './ProMainTable';
import undefined from '../../pages/protocol/utils';

export default{
  components: { ProTable, ProMainTable },
  data() {
    return {
      totilNum: 0,
      bntCode: true,
      codeShow: false,
      selectList: [],
      codeCols: [
        { key: 'code', name: '原始字段', widths: 501 },
        { key: 'decode', name: '解码字段', widths: 412 },
      ],
      cols: [
        { key: 'select', name: '', type: 'select', widths: 45 },
        // { key: 'nowListOne', type: 'listOne', name: '解码字段', widths: 568 },
        { key: 'protocol_name', name: '解码字段', widths: 568 },
        { key: 'desc', name: '字段重命名', widths: 300 },
      ],
      tableData: [
        { nowListOne: '', desc: '24' },
      ],
      initTable: [
        { code: 'DecodeId', decode: 'DecodeId' },
        { code: 'DestPort', decode: 'DestPort' },
        { code: 'DestIp', decode: 'DestIp' },
        { code: 'FlowId', decode: 'FlowId' },
        { code: 'FlowSide', decode: 'FlowSide' },
        { code: 'IpProt', decode: 'IpProt' },
        { code: 'MetaType', decode: 'MetaType' },
        { code: 'PartId', decode: 'PartId' },
        { code: 'PktId', decode: 'PktId' },
        { code: 'PktLen', decode: 'PktLen' },
        { code: 'Prot', decode: 'Prot' },
        { code: 'SrcIp', decode: 'SrcIp' },
        { code: 'SrcPort', decode: 'SrcPort' },
        { code: 'StreamId', decode: 'StreamId' },
        { code: 'ts', decode: 'ts' },
        { code: 'TcpSeq', decode: 'TcpSeq' },
        { code: 'TcpAck', decode: 'TcpAck' },
        { code: 'TcpPldLen', decode: 'TcpPldLen' },
        { code: 'Vlan', decode: 'Vlan' },
      ],
      data: {},
      codeTitle: '基础解码字段',
      nameTitle: '字段预处理',
      nameSecTitle: '字段处理',
      nametraRename: '字段重命名',
    };
  },
  methods: {
    addtraRename() {
      this.$store.dispatch('addTraRename', { tra: { '@op': 'disp', '@item1': '', '#text': '' } }); // 传一个需要添加的对象
      setTimeout(() => {
        this.focus();
      }, 100);
    },
    deltraRename() {
      this.$store.dispatch('delTraRename', { deltra: this.selectList }); // 传需要删除的数组
      this.handleSelect({ index: -1, checked: false });
    },
    createP() {
    },
    popupDataChange(item, index) {
      this.$emit('popupDataT', item, index);
    },
    popupPreChange(item, index) {
      this.$emit('popupPreT', item, index);
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
      if (this.traceDisp.trace_disp !== undefined) {
        const changeArr = [];
        _.forEach(this.traceDisp.trace_disp.field, (item, index) => {
          const preObj = _.cloneDeep(item);
          if (index === data.index) {
            // preObj['@item1'] = data.val;
            preObj['@item1'] = data.first;
            preObj['#text'] = data.sec;
            preObj.index = index;
            this.$store.dispatch('upTraRename', preObj);
          }
          changeArr.push(preObj);
        });
        this.changeInputData = _.cloneDeep(changeArr);
        this.changeType = false;
      }
    },
    focus() {
      const ele = this.$refs.inputDom;
      if (ele !== undefined) {
        const eleDom = ele.$el.children[1].children[0].children[this.totilNum - 1];
        eleDom.children[1].click();
        setTimeout(() => {
          eleDom.children[0].children[1].focus();
        }, 100);
      }
    },
  },
  computed: {
    transData() {
      let norData = [];
      if (!(this.proStrData instanceof Array)) {
        norData.push(this.proStrData);
      } else norData = this.proStrData;
      return norData;
    },
    traceDis() {
      const ArrTrace = [];
      // const CodelistAll = this.listAll;
      if (this.traceDisp.trace_disp !== undefined) {
        _.forEach(this.traceDisp.trace_disp.field, (item) => {
          const perObj = {};
          // perObj.nowListOne = item['@item1'];
          perObj.protocol_name = item['@item1'];
          perObj.desc = item['#text'];
          // perObj.listArrOne = CodelistAll;
          ArrTrace.push(perObj);
        });
        this.tableData = ArrTrace;
        this.totilNum = this.tableData.length;
      }
      return ArrTrace;
    },
    ...mapState({
      proStrData: state => state.protocolData['proto.xml'].prepare.field,
      normalize: state => state.protocolData['proto.xml'].normalizes.normalize,
      traceDisp: state => state.protocolData['proto.xml'],
      // listAll: state => state.listRule.ruleList,
    }),
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
};
</script>

<style lang="scss" scoped>
  .pro-close{
    cursor: pointer;
    float: right;
    display: inline-block;
    background: url(../../assets/protocol/protocol_close.png) no-repeat;
    width: 20px;
    height: 20px;
    background-size: contain;
    margin-top: 2px;
    margin-right: 4px;
  }
  .pro-open{
    cursor: pointer;
    float: right;
    display: inline-block;
    background: url(../../assets/protocol/protocol_open.png) no-repeat;
    width: 20px;
    height: 20px;
    background-size: contain;
    margin-top: 2px;
    margin-right: 4px;
  }
  .pro-str{
    .str-traRename{
      margin-top: 10px;
      margin-left: 35px;
    }
    .addordel{
      margin-top: 10px;
      display: flex;
      margin-left: 30px;
      .add{
        width: 60px;
        height: 30px;
        background-color: #1d73a8;
        border-radius: 3px;
        border: 0;
        text-align: center;
        padding-top: 5px;
        cursor: pointer;
      }
      .del{
        width: 60px;
        height: 30px;
        background-color: #d04631;
        border-radius: 3px;
        border: 0;
        text-align: center;
        padding-top: 5px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    margin: 15px 45px;
    height: 380px;
    >div{
      box-sizing: border-box;
    }
    .str-has-data{
      margin: 20px 35px 20px;
    }
    .str-no-data{
      position: relative;
      height: 90px;
      border: 1px #223f5d solid;
      width: 910px;
      border-radius: 3px;
      margin: 20px 35px 20px;
      .no-data-div{
        width: 200px;
        height: 26px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        >span{
          float: left;
          font-size: 14px;
          line-height: 26px;
          margin-left: 6px;
        }
        .create-prepare{
          cursor: pointer;
          float: left;
          color: #0ea4c3;
          width: 123px;
          height: 26px;
          margin-left: 6px;
          line-height: 18px;
          >span{
            float: left;
            line-height: 26px;
          }
          .add-prepare{
            font-size: 14px;
          }
          .add-png{
            font-size: 29px;
            line-height: 21px;
          }
        }
      }
    }
  }
</style>