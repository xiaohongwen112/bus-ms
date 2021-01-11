<template>
  <g text-anchor="middle">
    <text transform="matrix(1 0 0 1 537.3333 152.8338)">
      <tspan x="0" y="0" class="st13 st3 st14">接收时间</tspan>
      <tspan x="0" y="12" class="st13 st3 st14">{{ getDate(times[1]) }}</tspan>
      <tspan x="0" y="24" class="st13 st3 st14">{{ getTime(times[1]) }}</tspan>
    </text>
    <text transform="matrix(1 0 0 1 656.3333 153.0002)">
      <tspan x="0" y="0" class="st13 st3 st14">转发时间</tspan>
      <tspan x="0" y="12" class="st13 st3 st14">{{ getDate(times[0]) }}</tspan>
      <tspan x="0" y="24" class="st13 st3 st14">{{ getTime(times[0]) }}</tspan>
    </text>
    <g class="icon" transform="translate(110, 0)">
      <circle class="st15" cx="487.3" cy="154.6" r="8.4"/>
      <polygon class="st13" points="487.3,143.3 482.3,147.2 487.1,146 492.2,147.2 		"/>
      <g>
        <rect x="491.2" y="153.2" transform="matrix(-1 -4.420165e-11 4.420165e-11 -1 984.046 309.8633)" class="st12"
              width="1.7" height="3.4"/>

        <rect x="488.7" y="153.2" transform="matrix(-1 -4.527990e-11 4.527990e-11 -1 979.078 309.8633)" class="st12"
              width="1.7" height="3.4"/>

        <rect x="485.4" y="153.2" transform="matrix(-1 -4.527990e-11 4.527990e-11 -1 973.3367 309.8633)" class="st12"
              width="2.5" height="3.4"/>
        <polyline class="st12" points="484.9,158.2 481.7,154.9 484.9,151.7 			"/>
      </g>
    </g>
  </g>
</template>

<script>
export default {
  name: 'BottomTime',
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
