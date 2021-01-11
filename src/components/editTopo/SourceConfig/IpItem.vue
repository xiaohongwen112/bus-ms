<template>
  <div class="list-item col-item-wrap">
    <span class="col-item col-ip">{{ item.ip }}</span>
    <span class="col-item col-name">
      <input v-on:input="inputDevice($event)" maxlength="20" v-model="item.device_name">
    </span>
    <span class="col-item col-model">
      <input v-on:input="inputDevice($event)" maxlength="20" v-model="item.device_model">
    </span>
    <span class="col-item col-type">
      <input v-on:input="inputDevice($event)" maxlength="20" v-model="item.device_type">
    </span>
    <span class="col-item col-op">
      <a class="del-ip-btn" href="#" @click="deleteItem">删除</a>
    </span>
    <span class="col-item col-add">
      <a class="add-monitor-btn"  href="#" @click="addItem">添加监控</a>
    </span>
  </div>
</template>

<script>

import { validateName, validateIp, checkError } from '@/helpers/configValidate';

export default {
  name: 'IpItem',
  model: {
    prop: 'item',
  },
  props: {
    item: {
      type: Object,
      default() {
        return {
          ip: '', // ip
          device_name: '', // 设备名称
          device_type: '', // 设备型号
          device_model: '', // 设备类型
        };
      },
    },
    ipObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    addItem() {
      this.$emit('add', this.item.ip);
    },
    deleteItem() {
      this.$emit('delete');
    },
    addIpToList() {
      const ipIn = this.ip;
      const result = validateIp(ipIn, true);
      if (result.bool) {
        ipIn.split(',').forEach((item) => {
          if (item.indexOf('-') > -1) {
            const pattern = /.\d+$/;
            const ipSegment = item.split('-');
            const start = Number(ipSegment[0].split('.')[3]);
            const end = Number(ipSegment[1].split('.')[3]);
            const net = ipSegment[0].split(pattern)[0];
            for (let i = start; i < end + 1; i += 1) {
              this.ipIn(`${net}.${i}`);
            }
          } else if (item) {
            this.ipIn(item);
          }
        });
        this.ip = '';
      }
    },
    inputDevice(e) {
      const val = e.target.value;
      const res = validateName(val);
      console.log(typeof val, val);
      if (val === '') {
        checkError(validateName('1'), e.target);
        this.$emit('iserror', false);
        return;
      }
      checkError(res, e.target);
      if (res.bool === false) {
        this.$emit('iserror', true);
      } else {
        this.$emit('iserror', false);
      }
    },
    validateAll() {
      const ip = this.isNull ? true : this.ipList.length > 0;
      if (!this.isNull) checkError({ bool: this.portListStr !== '', tip: '端口不可为空' }, this.$refs.portInput);
      if (!this.isNull) checkError({ bool: ip, tip: 'IP列表不可为空' }, this.$refs.ipList);
      const error = Array.from(this.$el.querySelectorAll('.error-input'))
        .every((d) => {
          const index = Array.from(d.classList).findIndex(item => (item === 'name-input' || item === 'ip-input' || item === 'ip-list-header'));
          return index !== -1;
        });
      return ip && error;
    },
  },
};
</script>

<style lang="scss" scoped>
.col-ip{
  width: 110px;
}
.col-op{
  width: 60px;
}

.col-add{
  width: 80px;
}
.del-ip-btn{
  color: #de1414;
}

.add-monitor-btn{
  color: #3dd9c4;
  text-decoration: underline;
  font-style: oblique;
  font-size: 15px;
}
.col-name, .col-model, .col-type{
  width: calc(100%/3 - 282px/3);
} 

.col-item{
  display: inline-block;
  height: 26px;
  line-height: 26px;
  text-align: center;

  input{
    height: 26px;
    width: 100%;
  }
}
</style>
