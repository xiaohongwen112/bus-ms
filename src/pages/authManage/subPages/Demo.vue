<template>
  <div>
    <h1 v-show="false" v-text="`域管理`"></h1>
    <StTable class="st-table" :cols="cols" :rows="tableData"
    :selectList="selectList" :headSelect="headSelect"
    @select="handleSelect"
    >
    <template slot="operation" slot-scope="slotData">
      <span  class="operation">
        <a @click="handleEditItem(slotData)"  v-if="slotData.data.editable || !slotData.data.hasOwnProperty('editable')">编辑</a>
        |
        <a class="delete" @click="handleDeleteItem(slotData)"  v-if="slotData.data.deleteable || !slotData.data.hasOwnProperty('deleteable')">删除</a>
      </span>
    </template>
    </StTable>
  </div>
</template>

<script>
import _ from 'lodash';
import { StTable } from '@/components/basic/index';

export default {
  name: 'Demo',
  components: {
    StTable,
  },
  data() {
    return {
      cols: [
        { type: 'select' },
        { key: 'name', name: '姓名' },
        { key: 'age', name: '年龄' },
        { type: 'operation', name: '操作' },
      ],
      tableData: [
        { name: '张茉莉', age: '24', selectshow: false, selectable: false, editable: false, deleteable: false },
        { name: '赵四', age: '25', selectable: false, editable: true },
        { name: '张三', age: '24' },
        { name: '赵四', age: '25' },
        { name: '张三', age: '24' },
        { name: '赵四', age: '25' },
        { name: '张三', age: '24' },
        { name: '赵四', age: '25' },
      ],
      selectList: [],
      // headSelect: true,
    };
  },
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
    headSelect() { return this.selectList.length === this.validIndexList.length; },
  },
  methods: {
    handleEditItem(slotData) {
      console.log(slotData.index);
    },
    handleDeleteItem(slotData) {
      console.log(slotData.index);
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
  },
};
</script>

<style lang="scss">
.st-table{
  // margin: 30px;
  width: 1200px;
  height: 200px;
}
</style>

