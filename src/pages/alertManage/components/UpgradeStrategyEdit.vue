<template>
  <ul>
    <li v-for="(key, index) in levelkeys" :key="index"
    :class="{'disable-edit': !curData.hasOwnProperty(key)}">
      级别{{ index + 1 }}:  {{ levelNames[index] }}
      <img class="cutoff-rule" :src="require(`../../../assets/alertManage/${imgList[maxLen-1][index]}.png`)">
      达到基线值  且  连续告警次数>=  
      <CmInput :width="60" :value="curData[key]" type="popsUp" inputType="number"
      :disable="inputDisable(index)" 
      :errorFlag="errorFlag && index < maxLen"
      @on-change="inputChange(arguments, index)"/>
      次
    </li>
    <li class="level-tip">
      ( 告警次数为整数，且依次递增 )
    </li>
  </ul>
</template>
<script>
import { CmInput } from '@/components/basic';
import { levelNames } from '../utils';

export default {
  name: 'UpgradeStrategyEdit',
  components: {
    CmInput,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      levelkeys: ['level1', 'level2', 'level3', 'level4'],
      levelNames,
      imgList: [
        ['step_first_1', 'step_common_1', 'step_common_1', 'step_last_1'],
        ['step_first_2', 'step_common_2', 'step_common_1', 'step_last_1'],
        ['step_first_2', 'step_common_3', 'step_common_2', 'step_last_1'],
        ['step_first_2', 'step_common_3', 'step_common_3', 'step_last_2'],
      ],
      maxLen: Object.keys(this.data).length,
      curData: this.data,
      errorFlag: false,
    };
  },
  computed: {
    // levelkeys() {
    //   return Object.keys(this.data);
    // },
  },
  methods: {
    // cutoffName(index) {
    //   const len = this.levelkeys.length;
    //   let name = 'step_common_3';
    //   if (len === 1) {
    //     name = 'step_first_3';
    //   } else if (index === 0) {
    //     name = 'step_first_2';
    //   } else if ((index + 1) === len) {
    //     name = 'step_last_2';
    //   }
    //   return name;
    // },
    inputDisable(index) {
      let bool = true;
      if (index <= this.maxLen) {
        bool = false;
      }
      return bool;
    },
    inputChange(args, index) {
      // console.log(args[0], index);
      const val = args[0] !== '' ? Number(args[0]) : '';
      // 第一个元素置空无效
      if (index === 0 && val === '') {
        this.curData.level1 = '';
      } else {
        this.curData[`level${index + 1}`] = val;
      }
      if (index === this.maxLen) {
        this.maxLen += 1;
      }
      while (this.maxLen > 1 && this.curData[`level${this.maxLen}`] === '') {
        // console.log(this.maxLen, this.maxLen - 1);
        this.maxLen -= 1;
        delete this.curData[`level${this.maxLen + 1}`];
      }
      this.errorFlag = this.curData.level1 === '' || !this.checkLevel(Object.values(this.curData));
      this.$emit('change', {
        data: this.curData,
        errorFlag: this.errorFlag,
      });
    },
    checkLevel(arr) {
      let bool = true;
      arr.forEach((val, index) => {
        // 正整数
        // console.log('策略', val, typeof val, /^[1-9]\d*$/.test(val));
        if (bool && !/^[0-9]\d*$/.test(val)) {
          bool = false;
        }
        if (bool && index > 0 && (arr[index] <= arr[index - 1])) {
          bool = false;
        }
      });
      return bool;
    },
  },
};
</script>
<style lang="scss" scoped>
 img{
    vertical-align: -14px;
  }
  .disable-edit{
    color: #888f95;
  }
  .level-tip{
    height: 36px;
    font-size: 12px;
    color: #888f95;
  }
</style>
