<template>
  <div class="alert-sound" :class="{'sound-close': isClose}" @click="play">
    <audio preload="auto" loop="loop" ref="audio">
      <source src="../../assets/audio/dong.wav">
      <source src="../../assets/audio/dong.mp3">
    </audio>
  </div>

</template>

<script>
  export default {
    name: 'alert-sound',
    props: {
      open: {
        type: Boolean,
        default: true,
      },
      sound: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        isClose: !this.open,
        audio: null,
      };
    },
    watch: {
      open() {
        this.isClose = !this.open;
        this.setAudio();
      },
      sound() {
        this.setAudio();
      },
    },
    computed: {},
    methods: {
      play() {
        this.isClose = !this.isClose;
        this.emit();
      },
      setAudio() {
        if (this.isClose) {
          this.audio.pause();
        } else if (this.sound) {
          setTimeout(() => this.audio.play(), 150);
        }
      },
      emit() {
        this.$emit('clickAudio', { isOpen: !this.isClose });
      },
    },
    mounted() {
      this.audio = this.$refs.audio;
      this.setAudio();
    },
  };
</script>

<style lang="scss" scoped>
  .alert-sound{
    float: right;
    width: 30px;
    margin-right: calc(5% - 6px);
    height: 24px;
    cursor: pointer;
    background: url(../../assets/index/sound-open.svg);
    background-size: 100% 100%;
    margin-top: 5px;
    z-index: 9;
    position: relative;
  }

  .sound-close{
    background: url(../../assets/index/sound-close.svg);
    background-size: 100% 100%;
  }

</style>
