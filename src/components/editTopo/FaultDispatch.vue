<template>
  <ScrollBar class="fault-dispatch-wrap">
    <div class="title1"><img src="../../assets/common/tag.png"/>故障分发</div>
    <div class="fault-dispatch-content">
      <p class="config-item" v-for="(item, index) in dispatchConfig" :key="index">
        <CmSelect type="popsUp" :width="140"
              :list="levelList" :selectVal="`级别${item.level}:  ${levelNames[item.level-1]}`" 
              @on-change="selectLevel(arguments, index)"/>
        <label class="title-selects">
          分发给
        </label>
        <CmSelect type="popsUp" :width="120" :scaleWidth="1.5"
              :list="contactNameList" :selectVal="contactSelected(item.contact_person, 'person')" 
              @on-change="selectContact(arguments, index, 'person')"/>
        <CmSelect type="popsUp" :width="120" :scaleWidth="1.5"
              :list="groupNameList" :selectVal="contactSelected(item.contact_group, 'group')" 
              @on-change="selectContact(arguments, index, 'group')"/>
        <label class="title-inputs">
          通知方式:
        </label>
        <input type="checkbox" :checked="item.inform.includes('MESSAGE')" @change="checkMode('MESSAGE', index, $event)"/>短信
        <input type="checkbox" :checked="item.inform.includes('EMAIL')" @change="checkMode('EMAIL', index, $event)"/>邮件
        <input type="checkbox" :checked="item.inform.includes('INTERFACE')" @change="checkMode('INTERFACE', index, $event)"/>接口

        <i class="remove-icon" @click="removeItem(index)"></i>
        <BmsBtn type="main" v-if="(index+1) === dispatchConfig.length" @click="addItem">
          <i class="add-icon"></i></BmsBtn>
      </p>
      <div class="alert-content-wrap">
        告警内容: 
        <section class="alert-content">
          【告警来源】
          <br/>
          尊敬的用户， 您好！
          <br/>&nbsp;&nbsp;&nbsp;&nbsp;
          于【告警产生时间】，您的【系统号】的【告警节点号】产生了【告警指标】告警， 
          当前告警级别是【告警级别】，
          为了避免对该节点下的其他业务产生影响，请您及时处理！
        </section>
      </div>
    </div>
  </ScrollBar>
</template>
<script>
import _ from 'lodash';
import { CmInput, CmSelect, BmsBtn, ScrollBar } from '@/components/basic';
import { levelNames, levelList } from '@/pages/alertManage/utils';
import { getAlertContact, getAlertGroup } from '@/pages/editTopo/service';

export default {
  name: 'fault-dispatch',
  components: {
    CmInput,
    CmSelect,
    BmsBtn,
    ScrollBar,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      levelNames,
      levelList,
      // level: 1,
      // getAlertContact, getAlertGroup
      contactList: [],
      // contactNameList: [],
      groupList: [],
      // groupSelected: null,
      // groupNameList: [],
      dispatchConfig: [
        {
          level: 1,
          contact_person: [],
          contact_group: [],
          inform: [],
        },
      ],
    };
  },
  computed: {
    contactNameList() {
      return this.contactList.map(d => d.name);
    },
    groupNameList() {
      return this.groupList.map(d => d.name);
    },
  },
  watch: {
    data() {
      this.initModal();
      this.dispatchConfig = this.data;
    },
  },
  methods: {
    contactSelected(ids, key) {
      let res = null;
      const id = ids.length > 0 ? ids[0] : null;
      const curList = _.cloneDeep(key === 'person' ? this.contactList : this.groupList);
      const idList = curList.map(d => d._id);
      if (id !== null && idList.includes(id)) {
        const curObject = _.filter(curList, { _id: id });
        res = curObject[0].name;
      }
      // console.log(id, key, res);
      return res;
    },
    emit() {
      this.$emit('change', this.dispatchConfig);
    },
    selectLevel(args, index) {
      const newVal = args[0];
      const newLevel = Number(newVal[2]);
      // console.log('new-level', newLevel, index);
      this.dispatchConfig[index].level = newLevel;
      this.emit();
    },
    selectContact(args, index, key) {
      const newVal = args[0];
      let res = [];
      const curList = _.cloneDeep(key === 'person' ? this.contactList : this.groupList);
      const nameList = curList.map(d => d.name);
      if (nameList.includes(newVal)) {
        const curObject = _.filter(curList, { name: newVal });
        res = [curObject[0]._id];
      }
      this.dispatchConfig[index][`contact_${key}`] = res;
      // console.log('select-contact', newVal, index, key);
      this.emit();
    },
    checkMode(mode, index, ev) {
      const { checked } = ev.target;
      if (checked) {
        this.dispatchConfig[index].inform.push(mode);
      } else {
        const curIndexof = this.dispatchConfig[index].inform.indexOf(mode);
        if (curIndexof > -1) {
          this.dispatchConfig[index].inform.splice(curIndexof, 1);
        }
      }
      console.log('check', checked, mode, index, ev);
    },
    removeItem(index) {
      if (this.dispatchConfig.length > 1) {
        this.dispatchConfig.splice(index, 1);
      }
    },
    addItem() {
      this.dispatchConfig.push({
        level: 1,
        contact_person: [],
        contact_group: [],
        inform: [],
      });
      console.log(this.dispatchConfig.length);
    },
    initModal() {
      // 初始化模板下拉
      // getAlertContact, getAlertGroup
      getAlertContact().then((res) => {
        const data = res.data;
        if (data.code === 0) {
          this.contactList = data.data;
          // this.contactNameList = data.data.map(d => d.name);
        } else {
          this.contactList = [];
          // this.contactNameList = [];
        }
      });
      getAlertGroup().then((res) => {
        const data = res.data;
        if (data.code === 0) {
          this.groupList = data.data;
          // this.groupNameList = data.data.map(d => d.name);
        } else {
          this.groupList = [];
          // this.groupNameList = [];
        }
      });
    },
  },
  mounted() {
    this.initModal();
  },
};
</script>
<style lang="scss">
.fault-dispatch-wrap{
  .cm-select{
    margin-right: 15px;
  }
}
</style>

<style lang="scss" scoped>
input[type="checkbox"]{
  height: 14px;
  vertical-align: middle;
  width: 14px;
  border: 1px solid #278c89;
  border-radius: 3px;
  margin: 0 5px 0 15px;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;
  margin-bottom: 2px;
  &:checked{
    background: #139d8c url(../../assets/common/checked.svg) 1px center;
    background-size: 180% 180%;
    background-position-x: -4.5px;
  }
}
.remove-icon{
  display: inline-block;
  width: 45px;
  height: 28px;
  cursor: pointer;
  vertical-align: middle;
  margin: 0 25px 5px 35px;
  padding-left: 15px;
  border-left: 1px solid #223f5d;
  background: url(../../assets/common/trashcan.svg) no-repeat center;
  // background-position: 15px;
}
.add-icon{
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    margin: 0 5px 3px 0;
    background: url(../../assets/common/add.svg) no-repeat center;
  }

.fault-dispatch-wrap{
  height: 416px;
  border: 1px solid #223f5d;
  padding: 15px 0 15px 20px; 
}
.fault-dispatch-content{
  padding-left: 40px;
}
.config-item{
  height: 40px;
  padding-top: 5px;
  margin: 0;
}
.title1{
    padding: 8px 0;
    font-size: 16px;
    color: #14cef5;
    img{
      margin-right: 8px;
    }
  }
  label{
    font-weight: normal;
  }
  .title-selects{
    margin-right: 12px;
  }
  .title-inputs{
    margin-left: 12px;
  }
.alert-content-wrap{
  padding-top: 20px;
}
.alert-content{
  width: 1066px;
  height: 170px;
  margin-top: 10px;
  padding: 10px 15px;
  border: 1px solid #223f5d;
      line-height: 27px;
}
</style>
