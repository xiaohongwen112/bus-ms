<template>
  <li class="item">
    <span class="title" v-tooltip.ellipsis="{title: field.field_show_name, placement: 'top', trigger: ['blur']}">{{ field.field_show_name }}</span>
    <span v-if="type === 'input'">
      <input class="input-normal cb-input" type="text" v-model="field.value" @change="changeQuery" />
    </span>
    <span v-else-if="type === 'select'">
      <select class="select-normal cb-select" v-model="field.value" @change="changeQuery">
          <option value=""></option>
          <option v-for="(sub, i) in field.options"
            :key="i"
            :value="sub"
          >{{ sub }}</option>
      </select>
    </span>
    <span v-else-if="type === 'duration'">
      <input class="input-small cb-input" type="text" v-model="field.value[0]" @change="changeQuery"/>
      -
      <input class="input-small cb-input" type="text" v-model="field.value[1]" @change="changeQuery"/>
      ms
    </span>
    <span v-else-if="type === 'resp_count'">
      <input type="checkbox" v-model="field.value" @change="changeQuery"/>
    </span>
  </li>
</template>
<script>
import tooltip from '@/directive/tooltip';

export default {
  name: 'TrackFormItem',
  directives: {
    tooltip,
  },
  props: {
    field: {
      type: Object,
      default() {
        return {
          type: 'input',  //  input | select | duration | resp_count
          field_name: 'ip_src',
          field_show_name: '客户端IP',
          visible: true,
          dimension: true,
          options: [], //  select类型才具有的属性
        };
      },
    },
  },
  data() {
    return {
      type: this.field.type,
      value: '',
      gte: '',
      lt: '',
    };
  },
  methods: {
    changeQuery() {
      this.$store.commit('setTrackQuery', { key: this.field.field_name, value: this.field.value });
    },
  },
};
</script>
<style lang="scss" scoped>
.item{
  float: left;
  width: 25%;
  height: 36px;
  text-align: left;
  .title{
    display: inline-block;
    width: 80px;
    text-align: right;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  input[type="text"], select {
    height: 27px;
    border: 1px solid #183349;
    color: #BEE2EB;
  }
  .input-small{
    width: calc(50% - 69px);
  }
  .input-normal, .select-normal{
    width: calc(100% - 90px);
  }
}

</style>
