<template>
  <span class="backup-select">
    <span class="backup-option" v-for="(item, index) in optionList" :key="`backup-item${index}`">
      <rect-btn class="option-btn"
                :keyword="item.value"
                :value="value.includes(item.value)"
                @click="changeOption"
      >{{ item.name }}</rect-btn>
    </span>
  </span>
</template>

<script>
import RectBtn from '@/components/common/RectBtn';

export default {
  name: 'StorageBackupSelect',
  components: {
    RectBtn,
  },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      optionList: [
        { name: '数据库', value: 'mongo' },
        { name: '原始数据', value: 'pcap' },
        { name: '日志', value: 'log' },
      ],
    };
  },
  methods: {
    changeOption(evt) {
      const selectValue = this.value.concat();
      if (evt.value) {
        selectValue.push(evt.key);
      } else if (!evt.value && selectValue.includes(evt.key)) {
        selectValue.splice(selectValue.indexOf(evt.key), 1);
      }
      this.$emit('change', selectValue);
    },
  },
};
</script>

<style lang="scss">
.backup-select{
  .backup-option{
    .rect-btn{
      font-size: 14px;
      height: 30px;
      line-height: 28px;
      border-color: #139d8c;
      color: #139d8c;
      border-radius: 3px;
      &.active-btn{
        background-color: #139d8c;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.backup-option{
  display: inline-block;
  width: 100px;
  .option-btn{
    display: inline-block;
    margin-right: calc(33.3% - 80px);
    width: 78px;
    padding: 0;
  }
}
</style>
