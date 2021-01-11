<template>
  <div :class="wrapper">
    <template>
      <CmSelect :type="selectType" :list="provinces" :disable="disabled" :selectVal="province" :position="position" :placeholder="placeholder" @on-change="change"></CmSelect>
    </template>
  </div>
</template>

<script>
  import DISTRICTS from '@/helpers/districts';
  import CmSelect from './CmSelect';

  const DEFAULT_CODE = 100000;

  export default {
    name: 'dist-picker',
    props: {
      province: { type: [String, Number], default: '' },
      placeholder: {
        type: String, default: '请选择',
      },
      disabled: { type: Boolean, default: false },
      wrapper: { type: String, default: 'addressDiv' },
      selectType: { type: String, default: 'system' },
      position: { type: String, default: '' },
    },
    components: { CmSelect },
    data() {
      return {
        provinces: [],
      };
    },
    created() {
      this.provinces = this.getDistricts();
    },
    methods: {
      change(val) {
        this.$emit('change', val);
      },
      getDistricts(code = DEFAULT_CODE) {
        return DISTRICTS[code] || null;
      },
    },
  };
</script>

<style lang="scss" scoped>
@import '../../assets/css/iconbms.css';
  .addressDiv {
    display: inline-block;
    position: relative;
    i{
      position:absolute;
      right: 8px;
      top: 9px;
      font-size: 12px;
      transform: scale(.7, .8);
    }
  }
  ul {
    margin: 0;
    padding: 0;

    li {
      list-style: none;
    }
  }
  .address-header {
    background-color: #fff;

    ul {
      display: flex;
      justify-content: space-around;
      align-items: stretch;

      li {
        display: inline-block;
        padding: 10px 10px 7px;

        &.active {
          border-bottom: #52697f solid 3px;
          color: #52697f;
        }
      }
    }
  }
  .address-container {
    background-color: #fff;

    ul {
      height: 100%;
      overflow: auto;

      li {
        padding: 8px 10px;
        border-top: 1px solid #f6f6f6;

        &.active {
          color: #52697f;
        }
      }
    }
  }
</style>
