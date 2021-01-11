<template>
  <g text-anchor="middle">
    <text transform="matrix(1 0 0 1 103.3333 39.1672)">
      <tspan x="0" y="0" class="st13 st3 st14">转发时间</tspan>
      <tspan x="0" y="12" class="st13 st3 st14">{{ getDate(times[0]) }}</tspan>
      <tspan x="0" y="24" class="st13 st3 st14">{{ getTime(times[0]) }}</tspan>
    </text>
    <text transform="matrix(1 0 0 1 222.8333 39.1668)">
      <tspan x="0" y="0" class="st13 st3 st14">接收时间</tspan>
      <tspan x="0" y="12" class="st13 st3 st14">{{ getDate(times[1]) }}</tspan>
      <tspan x="0" y="24" class="st13 st3 st14">{{ getTime(times[1]) }}</tspan>
    </text>
    <g class="icon" transform="translate(23, 0)">
      <circle class="st15" cx="140.1" cy="41.9" r="8.4"/>
      <polygon class="st13" points="140.1,53.3 135.1,49.4 139.9,50.5 145.1,49.4 		"/>
      <g>
        <rect x="135" y="40.6" class="st7" width="1.7" height="3.4"/>
        <rect x="137.5" y="40.6" class="st7" width="1.7" height="3.4"/>
        <rect x="140" y="40.6" class="st7" width="2.5" height="3.4"/>
        <polyline class="st7" points="143,45.5 146.2,42.3 143,39 			"/>
      </g>
    </g>
  </g>
</template>

<script>
export default {
  name: 'TopTime',
  props: {
    times: {
      type: Array,
      default() {
        return ['--', '--'];
      },
    },
  },
  methods: {
    getDate(val) {
      return val === '--' ? '' : val.split(' ')[0];
    },
    getTime(val) {
      return val === '--' ? '--' : val.split(' ')[1];
    },
  },
};
</script>

<style>

</style>
