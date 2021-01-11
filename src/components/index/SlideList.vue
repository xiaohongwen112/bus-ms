<template>
  <div class="slide-list-div">
    <div class="slide-left-btn arrow-btn " @click="prev" :class="{'visible-btn': showPrev}"></div>
    <div class="slide-list-container" ref="container">
      <div class="slide-list" :style="`transform: translate(${slideLeft}px, 0)`" ref="list">
        <slot name="list"></slot>
      </div>
    </div>
    <div class="slide-right-btn arrow-btn " @click="next" :class="{'visible-btn': showNext}"></div>
  </div>
</template>

<script>
  export default {
    name: 'slide-list',
    props: {
      carouseCount: {
        type: Number,
        default: 3,
      },
      cardWidth: {
        type: Number,
        default: 154,
      },
      offsetWidth: {
        type: Number,
        default: 80,
      },
      index: {
        type: Number,
        default: 1,
      },
      update: {
        type: Boolean,
        default: false,
      },
//      interval: {
//        type: Number,
//        default: 2000,
//      },
//      autoRoll: {
//        type: Boolean,
//        default: true,
//      },
    },
    data() {
      return {
        slideLeft: 0,
        maxWidth: 0,
        width: 0,
//        timer: null,
      };
    },
    watch: {
      index(newVal) {
        this.calcSlideLeft();
        if (newVal === 1) {
          this.slideLeft = 0;
        }
//        this.timer = this.autoRoll ? setInterval(this.roll, this.interval) : null;
      },
      update() {
        this.$nextTick(() => this.getWidth());
      },
    },
    computed: {
      activeIndex() {
        return Math.abs(Math.floor(this.slideLeft / this.slideWidth)) * this.carouseCount;
      },
      slideWidth() {
        return this.carouseCount * this.cardWidth;
      },
      showPrev() {
        return this.slideLeft < 0;
      },
      showNext() {
        return this.slideLeft + this.width > this.maxWidth;
      },
    },
    methods: {
      prev() {
        const offset = this.slideLeft + this.slideWidth;
        this.slideLeft = offset > 0 ? 0 : offset;
        this.emit();
        this.emitLeft();
      },
      next() {
        this.slideLeft -= this.slideWidth;
        this.emit();
        this.emitLeft();
      },
      calcSlideLeft() {
        const tmp = this.index * this.cardWidth + this.offsetWidth + this.slideLeft;
        if (tmp > this.maxWidth) {
          this.slideLeft -= this.cardWidth;
        }
        this.emitLeft();
      },
      getWidth() {
        this.maxWidth = this.$refs.container.clientWidth;
        if (this.maxWidth > this.width) {
          this.slideLeft = 0;
        } else {
          this.calcSlideLeft();
        }
      },
      emit() {
        this.$emit('move', { index: this.activeIndex });
      },
      emitLeft() {
        this.$emit('getLeft', { slideLeft: this.slideLeft });
      },
    },
    mounted() {
      this.getWidth();
      window.addEventListener('resize', () => this.getWidth());
    },
    updated() {
      if (this.$refs.list.clientWidth !== 0) {
        this.width = this.$refs.list.clientWidth;
      }
    },
  };
</script>

<style lang="scss" scoped>
.slide-list-div{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;


  .slide-list-container{
    width: calc(100% - 72px);
    height: 100%;
    overflow: hidden;

    .slide-list{
      left: 0;
      right: 0;
      height: 100%;
      position: relative;
      white-space: nowrap;
      width: auto;
      display: inline-block;
      transition: transform 0.5s;
    }
  }

  .arrow-btn {
    width: 36px;
    height: calc(100% - 14px);
    background-position-x: 6px;
    background-position-y: 50%;
    background-size: 24px 24px;
    background-repeat: no-repeat;
    cursor: pointer;
    visibility: hidden;
  }

  .visible-btn{
    visibility: visible;
  }

  .slide-left-btn {
    background-image: url(../../assets/index/index-prev.png);
  }

  .slide-left-btn:hover {
    background-image: url(../../assets/index/index-prev-selected.png);

  }

  .slide-right-btn {
    background-image: url(../../assets/index/index-next.png);
  }

  .slide-right-btn:hover {
    background-image: url(../../assets/index/index-next-selected.png);
  }

}
</style>
