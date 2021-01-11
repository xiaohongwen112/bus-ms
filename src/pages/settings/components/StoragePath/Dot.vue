<template>
  <svg style="width: 40px; height: 33px;">
    <circle :fill="fill" r="6.083" cx="25.75" cy="24.75" filter="url(#circle_blur)"></circle>
    <circle :fill="fill" r="5" cx="25.75" cy="24.75" filter="none"></circle>
  </svg>
</template>
<script>
export default {
  name: 'Dot',
  props: {
    fill: {
      type: String,
      default: '#BC1B67',
    },
  },
};
</script>
<style>

</style>
