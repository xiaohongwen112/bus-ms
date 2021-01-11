<template>
  <div class="pagination">
    <ul v-if="total === 1">
      <li class="total">共{{ total }}页</li>
    </ul>
    <ul v-else>
      <li class="total">共{{ total }}页</li>
      <li class="jump">
        <input
          v-model="jump"
          type="text"
          placeholder="页码"
          :class="{error: inputError}"
        >
        <a
          @click="jumpTo(jump)"
        >跳转</a>
      </li>
      <li
        @click="goTo(1)"
        :class="{disabled: prevDisabled}"
      >首页</li>
      <li
        @click="goTo(current - 1)"
        :class="{disabled: prevDisabled}"
      >上一页</li>
      <li
        v-for="p in visiblePages"
        :key="p"
        :class="current === p ? 'current' : ''"
        :style="{'pointer-events': p === '...' ? 'none' : 'auto' }"
        @click="goTo(p)"
      >{{ p }}</li>
      <li
        @click="goTo(current + 1)"
        :class="{disabled: nextDisabled}"
      >下一页</li>
      <li
        @click="goTo(total)"
        :class="{disabled: nextDisabled}"
      >尾页</li>
    </ul>
  </div>
</template>
<script>

import _ from 'lodash';

const props = {
  total: {
    type: Number,
    default: 0,
  },
  current: {
    type: Number,
    default: 0,
  },
};

export default {
  name: 'pagination',
  props,
  data() {
    return {
      jump: '',
      inputError: false,
    };
  },
  computed: {
    prevDisabled() {
      return this.current === 1;
    },
    nextDisabled() {
      return this.current === this.total;
    },
    visiblePages() {
      if (this.total > 5) {
        if (this.current > this.total - 4) {
          return _.range(this.total - 4, this.total + 1, 1);
        } else if (this.current === 1) {
          return [this.current, this.current + 1, this.current + 2, '...', this.total];
        }
        return [this.current - 1, this.current, this.current + 1, '...', this.total];
      }
      return _.range(1, this.total + 1, 1);
    },
  },
  methods: {
    goTo(p) {
      const page = parseInt(p, 10);
      if (page > 0 && page <= this.total) {
        this.$emit('to-page', page);
      } else {
        this.flashErr();
      }
    },
    jumpTo(p) {
      if (/^\d+$/.test(p)) {
        this.goTo(p);
        this.jump = '';
      } else {
        this.flashErr();
      }
    },
    flashErr() {
      this.inputError = true;
      setTimeout(() => {
        this.inputError = false;
      }, 150);
    },
  },
};

</script>
<style scoped>

.pagination {
  position: absolute;
  bottom: 10px;
  width: 100%;
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  user-select: none;
}

ul {
  margin: 0;
}

li {
  display: inline-block;
  margin: 0 5px;
  padding: 0 10px;
  text-align: center;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  border: 1px solid #32d8f1;
  border-radius: 3px;
  background: transparent;
  color: #32d8f1;
}

li.total {
  color: #c6d8ef;
  font-size: 14px;
}

li:hover:not(.disabled):not(.jump) {
  background: #158fa1;
  color: #fff;
}

.disabled{
  pointer-events: none;
  color: #404346;
  border-color: #404346;
}

.total {
  pointer-events: none;
}

.jump {
  background: transparent;   
}

.jump input.error {
  border:1px solid red;
}

.jump:hover {
  /* background: #0A283B; */
}

.jump input {
  width: 60px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  background: none;
  color: #fff;
  border: 0;
  outline: 0;
}

.jump input {
  border: none;
  border-radius: 5px;
}

.jump input::placeholder {
  color: #414a54;
}

.jump a {
  color: #32d8f1;
}

.current {
  background: #32d8f1;
  color: #05181b;
}

</style>
