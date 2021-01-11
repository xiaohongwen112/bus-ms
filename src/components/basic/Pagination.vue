<template>
  <div class="pagination">
    <ul v-if="total === 1">
      <li class="total">共{{ total }}页</li>
    </ul>
    <ul v-else>
      <li
        @click="goTo(1)"
        :class="{disabled: prevDisabled}"
      ><i class="to-first"></i></li>
      <li
        @click="goTo(current - 1)"
        :class="{disabled: prevDisabled}"
      ><i class="pre-page"></i></li>
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
      ><i class="next-page"></i></li>
      <li
        @click="goTo(total)"
        :class="{disabled: nextDisabled}"
      ><i class="to-last"></i></li>
      <li class="jump">
        <input
            v-model="jump"
            type="text"
            :class="{error: inputError}"
          >页
          <a
            @click="jumpTo(jump)"
          >跳转</a>
      </li>
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
      if (this.total > 6) {
        if (this.current > this.total - 5) {
          return _.range(this.total - 5, this.total + 1, 1);
        } else if (this.current === 1) {
          return [this.current, this.current + 1, this.current + 2, this.current + 3, this.current + 4, '...', this.total];
        }
        return [this.current - 1, this.current, this.current + 1, this.current + 2, this.current + 3, '...', this.total];
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
<style lang="scss" scoped>

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
  li {
    display: inline-block;
    margin: 0 3px;
    padding: 0 5px;
    text-align: center;
    line-height: 20px;
    vertical-align: middle;
    cursor: pointer;
    color: #19cab4;
    &:hover{
      color: #4cffe9;
    }
    &.total {
      color: #c6d8ef;
      font-size: 14px;
      pointer-events: none;
    }
    &.current {
      color: #eee;
    }
    &.disabled{
      pointer-events: none;
      color: #404346;
      border-color: #404346;
      .pre-page, .next-page{
        background: url(../../assets/common/pre-disable.svg) no-repeat center;
      }
      .to-first, .to-last{
        background: url(../../assets/common/backfirst-disable.svg) no-repeat center;
      }
    }
    &.jump {
      color: #757678;
      background: transparent;
      input, a {
        box-sizing: border-box;
        width: 30px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: none;
        border: 1px solid #4ab2a5;
        outline: 0;
      }
      input{
        color: #fff;
        margin: 0 5px;
        &:focus{
          color:#ddd;
          border-color: #14cef5;
          box-shadow: 0 0 5px #096679 inset;
        }
        &.error{
          border:1px solid red;
        }
      }
      a {
        display:inline-block;
        color: #19cab4;
        margin-left: 15px;
        font-size: 12px;
        line-height: 18px;
        &:hover{
          border-color: #4cffe9;
          color: #4cffe9;
        }
      }
    }
    i{
      display: inline-block;
      width: 29px;
      height: 29px;
      margin: 3px -15px 0 -15px;
      &.pre-page{
        background: url(../../assets/common/pre-default.svg) no-repeat center;
        &:hover{
          background: url(../../assets/common/pre-highlight.svg) no-repeat center;
        }
      }
      &.next-page{
        transform: rotate(180deg);
        background: url(../../assets/common/pre-default.svg) no-repeat center;
        &:hover{
          transform: rotate(180deg);
          background: url(../../assets/common/pre-highlight.svg) no-repeat center;
        }
      }
      &.to-first{
        background: url(../../assets/common/backfirst-default.svg) no-repeat center;
        &:hover{
          background: url(../../assets/common/backfirst-highlight.svg) no-repeat center;
        }
      }
      &.to-last{
        transform: rotate(180deg);
        background: url(../../assets/common/backfirst-default.svg) no-repeat center;
        &:hover{
          transform: rotate(180deg);
          background: url(../../assets/common/backfirst-highlight.svg) no-repeat center;
        }
      }
    }
  }
}



</style>
