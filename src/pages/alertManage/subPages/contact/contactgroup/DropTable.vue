<template>
  <div id="drop-table" ref="dropTable">
    <EditPeople v-if="showEditPeople" :propData="peopleData" :operation="2" @close="showEditPeople = false"></EditPeople>
    <div class="table-header">
      <div class="header-cols" v-for="(item, index) in cols" :key="index" :style="item.width ? `width:${item.width}px;` : `width:${avwidth}px;`"><p>{{item.name}}</p></div>
    </div>
    <ScrollBar class="scroll">
      <div class="table-row" v-for="(item, index) in rows" :key="index">
        <div class="row-item" v-for="(value, key, i) in item" :key="i" :style="cols[i].width ? `width:${cols[i].width}px;` : `width:${avwidth}px;`">
          <p :class="{'ellipsis': cols[i].ellipsis}" v-if="cols[i].type !== 'operation' && key !== 'switch'">{{value}}</p>
          <p v-if="cols[i].type !== 'operation' && key === 'switch'" :style="value ? 'color:green' : 'color:red'">{{value ? '启用': '禁用'}}</p>
          <div class="operation" v-if="cols[i].type === 'operation'">
            <span @click="showInfo(index)">详情</span>
            <span v-if="item.allowDel"> | </span>
            <span v-if="item.allowDel" style="color:red;" @click="removeOne(idList[index])">移除</span>
          </div>
        </div>
      </div>
    </ScrollBar>
  </div>
</template>
<script>
import ScrollBar from '@/components/basic/ScrollBar';
import EditPeople from './../alert/EditPeople';
import { removePeople } from './../../../service';

export default {
  components: { EditPeople, ScrollBar },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    default: {
      type: Boolean,
      default: false,
    },
    groupId: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      showEditPeople: false,
      peopleData: {},
      // width: 100,
      idList: [],
      cols: [
        { type: 'text', key: 'name', name: '姓名', width: 200 },
        { type: 'text', key: 'classify', name: '分类' },
        { type: 'text', key: 'switch', name: '启用状态' },
        { type: 'text', key: 'tel', name: '手机号码' },
        { type: 'text', key: 'email', name: '邮箱地址', ellipsis: true },
        { type: 'operation', name: '操作', width: 150 },
      ],
      rows: [
        // { name: '赵四', classify: '系统用户', switch: true, tel: 'asdfadsfads', email: '1@qq.com', allowDel: false },
        // { name: '赵四', classify: '系统用户', switch: true, tel: 'adsfasdfa', email: '1@qq.com', allowDel: true },
        // { name: '赵四', classify: '系统用户', switch: false, tel: 'adsfasdfa', email: '1@qq.com', allowDel: true },
      ],
    };
  },
  // mounted() {
  //   this.width = this.$refs.dropTable.offsetWidth;
  // },
  created() {
    this.init();
  },
  mounted() {
    this.setEllipsis();
  },
  methods: {
    // 监听到数据变化，进行dom操作, 变为省略号
    setEllipsis() {
      const wrapList = document.getElementsByClassName('ellipsis');
      for (let i = 0; i < wrapList.length; i += 1) {
        let str = document.getElementsByClassName('ellipsis')[i].innerText;
        if (str.length > 10) {
          str = `${str.substr(0, 10)}......`;
          document.getElementsByClassName('ellipsis')[i].innerText = str;
        }
      }
    },
    removeOne(index) {
      const _this = this;
      removePeople({ group_id: this.groupId, contact_id: index }).then((res) => {
        console.log(res.data);
        _this.$emit('update');
      });
    },
    showInfo(index) {
      this.peopleData = this.list[index];
      this.showEditPeople = true;
    },
    init() {
      // this.rows = [];
      this.list.forEach((item) => {
        const obj = {
          name: item.name,
          classify: item.classify,
          switch: item.switch,
          tel: item.tel,
          email: item.email,
          allowDel: !this.default,
        };
        // Object.assign(obj, item);
        this.rows.push(obj);
        this.idList.push(item._id);
      });
    },
  },
  computed: {
    avwidth() {
      let lswidth = 0;
      let lsnum = 0;
      for (let i = 0; i < this.cols.length; i += 1) {
        if (this.cols[i].width) {
          lswidth += this.cols[i].width;
          lsnum += 1;
        }
      }
      const averwidth = (this.width - lswidth) / (this.cols.length - lsnum);
      return averwidth;
    },
  },
  watch: {
    list() {
      this.rows = [];
      this.init();
    },
  },
};
</script>
<style lang="scss" scoped>
  #drop-table{
    margin-top: 5px;
    margin-bottom: 3px;
    border-radius: 3px;
    .scroll{
      max-height: 150px;
    }
    .table-header{
      display: flex;
      height: 30px;
      width: 100%;
      .header-cols{
        padding-left: 30px;
        box-sizing: border-box;
        p{
          line-height: 30px;
        }
      }
    }
    .table-row{
      display: flex;
      height: 30px;
      width: 100%;
      .row-item{
        padding-left: 30px;
        box-sizing: border-box;
        p{
          line-height: 30px;
        }
        .operation{
          span{
            line-height: 30px;
            cursor: pointer;
          }
        }
      }
    }
    .table-row:nth-child(2n){
      background-color: #0b1b29;
    }
    .table-row:nth-child(2n-1){
      background-color: #092535;
    }
    .table-row:hover{
      background-color: #1a5275;
    }
  }
</style>