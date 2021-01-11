<template>
  <div class="ps-container"
    ref="sbConatiner"
    @mouseover.once="update"
    @ps-scroll-y="scrollHandler"
    @ps-scroll-x="scrollHandler"
    @ps-scroll-up="scrollHandler"
    @ps-scroll-down="scrollHandler"
    @ps-scroll-left="scrollHandler"
    @ps-scroll-right="scrollHandler"
    @ps-y-reach-start="scrollHandler"
    @ps-y-reach-end="scrollHandler"
    @ps-x-reach-start="scrollHandler"
    @ps-x-reach-end="scrollHandler">
    <slot></slot>
  </div>
</template>
<script>

import ScrollBar from 'perfect-scrollbar';

let sb;

export default {
  name: 'perfect-scrollbar',
  props: {
    options: {
      default: undefined,
    },
    swicher: {
      type: Boolean,
      default: true,
    },
    left: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    scrollHandler(evt) {
      // console.log(evt.type, evt);
      this.$emit(evt.type, evt);
    },
    update() {
      if (sb) {
        sb.update();
      }
    },
    init() {
      if (this.swicher) {
        if (!this.isInited) {
          this.isInited = true;
          sb = new ScrollBar(this.$el, this.options);
          if (this.left) {
            const s1 = this.$refs.sbConatiner.querySelector('.ps__rail-y');
            const s2 = this.$refs.sbConatiner.querySelector('.ps__thumb-y');
            s1.classList.add('left');
            s2.classList.add('left');
          }
        } else {
          this.update();
        }
      }
    },
    destroy() {
      if (sb) sb.destroy();
      sb = null;
      this.isInited = false;
    },
  },
  watch: {
    swicher(val) {
      if (val && !this.isInited) {
        this.init();
      }
      if (!val && this.isInited) {
        this.destroy();
      }
    },
    $route() {
      this.update();
    },
  },
  mounted() {
    this.init();
    window.addEventListener('resize', () => {
      this.init();
    });
  },
  updated() {
    this.$nextTick(this.update);
  },
  activated() {
    this.init();
  },
  deactivated() {
    this.destroy();
  },
  beforeDestroy() {
    this.destroy();
  },
};
</script>
<style lang="scss">

  @import '~perfect-scrollbar/css/perfect-scrollbar.css';
  
  .ps-container {
    position: relative;
  }

  .ps--active-x > .ps__rail-x, .ps--active-y > .ps__rail-y {
    background-color: #094561;
    opacity: 0.6;
  }

  .ps:hover > .ps__rail-x,
  .ps:hover > .ps__rail-y,
  .ps--focus > .ps__rail-x,
  .ps--focus > .ps__rail-y,
  .ps--scrolling-x > .ps__rail-x,
  .ps--scrolling-y > .ps__rail-y {
    opacity: 0.6;
  }

  .ps--active-y > .ps__rail-y {
    width: 9px;
  }

  .ps--active-x > .ps__rail-x {
    height: 9px;
  }

  .ps__thumb-y, .ps__thumb-x {
    background: #1498D6;
  }

  .ps__rail-y:hover > .ps__thumb-y, .ps__rail-y:focus > .ps__thumb-y {
    background: #1498D6;
    width: 6px;
  }

  .ps__rail-x:hover > .ps__thumb-x, .ps__rail-x:focus > .ps__thumb-x {
    background: #1498D6;
    height: 6px;
  }

  .ps__rail-y.left {
    left: 0px;
    right: auto;
  }
  .ps__thumb-y.left {
    left: 2px;
    right: auto;
  }

</style>