<template>
  <div id="transfer">
    <div class="left">
      <div class="header">
        <span style="margin-left:10px;">可选联系人</span>
        <div class="select-all">
          <input type="checkbox" value="leftAll" v-model="checkbox1" @click="onCheck1">
          <span>全部</span>
        </div>
      </div>
      <div class="search">
        <Search v-model="searchKey1" :borderStyle="'border:1px solid #223f5d;width:318px;height:25px;'" :iconStyle="'top:0'" :placeholder="'输入联系人姓名进行搜索'" @on-search="onSearch1"></Search>
      </div>
      <ScrollBar class="list">
        <div class="one" :style="leftCheckIndex.indexOf(item.id) >= 0 ? 'background-color: #1d5d82;' : ''" v-for="(item, index) in searchLeftList" :key="index" @click="checked1(item.id)">
          <span>{{item.name}}</span>
        </div>
      </ScrollBar>
    </div>
    <div class="center-btn">
      <div class="button" :style="leftCheckIndex.length === 0 ? 'background-color: gray;cursor:default;': ''" @click="addList">添加<img src="../../../../../assets/common/right.svg" width="20" height="20"></div>
      <div class="button-2" :style="rightCheckIndex.length === 0 ? 'background-color: gray;cursor:default;': ''" @click="delList"><img src="../../../../../assets/common/left.svg" width="20" height="20">移除</div>
    </div>
    <div class="right">
      <div class="header">
        <span style="margin-left:10px;">已选联系人</span>
        <div class="select-all">
          <input type="checkbox" value="rightAll" v-model="checkbox2" @click="onCheck2">
          <span>全部</span>
        </div>
      </div>
      <div class="search">
        <Search v-model="searchKey2" :borderStyle="'border:1px solid #223f5d;width:318px;height:25px;'" :iconStyle="'top:0'" :placeholder="'输入联系人姓名进行搜索'" @on-search="onSearch2"></Search>
      </div>
      <ScrollBar class="list">
        <div class="one" :style="rightCheckIndex.indexOf(item.id) >= 0 ? 'background-color: #1d5d82;' : ''" v-for="(item, index) in searchRightList" :key="index" @click="checked2(item.id)">
          <span>{{item.name}}</span>
        </div>
      </ScrollBar>
    </div>
  </div>
</template>
<script>
import ScrollBar from '@/components/basic/ScrollBar';
import { Search } from '@/components/basic/index';
import { getAllName, getEditName } from '../../../service';

export default {
  components: {
    Search,
    ScrollBar,
  },
  data() {
    return {
      leftList: [
        { name: '李白', id: '0' },
        { name: '僵局', id: '1' },
        { name: '杜甫', id: '2' },
        { name: '奖项白', id: '3' },
        { name: '白酒', id: '4' },
        { name: '李白', id: '5' },
        { name: '僵局', id: '6' },
      ],
      rightList: [],
      leftCheckIndex: [],
      rightCheckIndex: [],
      searchKey1: '',
      searchKey2: '',
      searchLeftList: [],
      searchRightList: [],
      checkbox1: [],
      checkbox2: [],
    };
  },
  props: ['isEdit', 'groupId'],
  created() {
    if (!this.isEdit) {
      getAllName().then((res) => {
        this.leftList = res.data.data.map((item) => {
          const obj = {
            name: item.name,
            id: item._id,
          };
          return obj;
        });
        this.onSearch1();
        this.onSearch2();
      });
    } else {
      getEditName({ _id: this.groupId }).then((res) => {
        this.rightList = res.data.data.selected_contact.map((item) => {
          const obj = {
            name: item.name,
            id: item._id,
          };
          return obj;
        });
        this.leftList = res.data.data.unselected_contact.map((item) => {
          const obj = {
            name: item.name,
            id: item._id,
          };
          return obj;
        });
        this.onSearch1();
        this.onSearch2();
      });
    }
  },
  updated() {
    this.emit();
  },
  methods: {
    emit() {
      this.$emit('resIdList', this.rightList.map(item => item.id));
    },
    onCheck1() {
      if (this.checkbox1.indexOf('leftAll') < 0) {
        this.leftCheckIndex = [];
        this.searchLeftList.forEach((item) => {
          this.leftCheckIndex.push(item.id);
        });
      } else {
        this.leftCheckIndex = [];
      }
    },
    onCheck2() {
      if (this.checkbox2.indexOf('rightAll') < 0) {
        this.rightCheckIndex = [];
        this.searchRightList.forEach((item) => {
          this.rightCheckIndex.push(item.id);
        });
      } else {
        this.rightCheckIndex = [];
      }
    },
    addList() {
      const _this = this;
      this.leftCheckIndex.forEach((id) => {
        for (let i = 0; i < _this.leftList.length; i += 1) {
          if (_this.leftList[i].id === id) {
            _this.rightList.push(_this.leftList[i]);
            _this.leftList.splice(i, 1);
            break;
          }
        }
      });
      this.leftCheckIndex = [];
      this.onSearch1();
      this.onSearch2();
    },
    delList() {
      const _this = this;
      this.rightCheckIndex.forEach((id) => {
        for (let i = 0; i < _this.rightList.length; i += 1) {
          if (_this.rightList[i].id === id) {
            _this.leftList.push(_this.rightList[i]);
            _this.rightList.splice(i, 1);
            break;
          }
        }
      });
      this.rightCheckIndex = [];
      this.onSearch1();
      this.onSearch2();
    },
    onSearch1() {
      if (this.searchKey1 === '') {
        this.searchLeftList = [].concat(this.leftList);
        // this.onCheck1();
        this.checkbox1 = [];
        this.leftCheckIndex = [];
        return;
      }
      this.searchLeftList = this.leftList.filter(item => item.name.indexOf(this.searchKey1) >= 0);
      this.onCheck1();
      this.checkbox1 = [];
      this.leftCheckIndex = [];
    },
    checked1(id) {
      if (this.leftCheckIndex.indexOf(id) >= 0) {
        const i = this.leftCheckIndex.indexOf(id);
        this.leftCheckIndex.splice(i, 1);
      } else {
        this.leftCheckIndex.push(id);
      }
    },
    onSearch2() {
      // asdf
      if (this.searchKey2 === '') {
        this.searchRightList = [].concat(this.rightList);
        // this.onCheck2();
        this.checkbox2 = [];
        this.rightCheckIndex = [];
        return;
      }
      this.searchRightList = this.rightList.filter(item => item.name.indexOf(this.searchKey2) >= 0);
      this.onCheck2();
      this.checkbox2 = [];
      this.rightCheckIndex = [];
    },
    checked2(id) {
      if (this.rightCheckIndex.indexOf(id) >= 0) {
        const i = this.rightCheckIndex.indexOf(id);
        this.rightCheckIndex.splice(i, 1);
      } else {
        this.rightCheckIndex.push(id);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  #transfer{
    display: flex;
    justify-content: space-between;
    width:906px;
    .center-btn{
      display: flex;
      flex-direction: column;
      justify-content: center;
      .button {
        background-color: #139d8c;
        border:0;
        border-radius: 3px;
        height: 30px;
        width: 80px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 5px;
        cursor: pointer;
        img{
          margin-left: 5px;
        }
      }
      .button-2{
        background-color: #f24646;
        border:0;
        border-radius: 3px;
        height: 30px;
        width: 80px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 5px;
        cursor: pointer;
        img{
          margin-right: 5px;
        }
      }
    }
    .left, .right{
      overflow: hidden;
      width: 340px;
      height: 252px;
      border: 1px solid #0d3555;
      background-color: #061522;
      .header{
        display: flex;
        height: 37px;
        width: 100%;
        background-color: #0d3555;
        align-items: center;
        justify-content: space-between;
        margin: 0;
        .select-all{
          margin-right: 10px;
        }
      }
      .search{
        width:100%;
        height:38px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #0d3555;
      }
      .list{
        height: 180px;
        .one{
          width: 100%;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          cursor: pointer;
          &:hover{
            background-color: #1d5d82;
          }
          span{
            margin-left: 20px;
          }
        }
      }
    }
  }
</style>