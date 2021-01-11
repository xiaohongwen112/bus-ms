<template>
  <g>
    <path d="M92,73.7H21h-5.7H5V84v8.5v14.8c0,5.7,4.6,10.3,10.3,10.3h71.5H92h10.3v-10.3v-8.3V84
    C102.3,78.3,97.7,73.7,92,73.7z" class="st0 node-bg"></path>
    <g class="node-logo" transform="translate(-7, 0)">
      <path class="st5" d="M28.4,99.4H18c-0.6,0-1.1-0.5-1.1-1.1v-6.9c0-0.6,0.5-1.1,1.1-1.1h10.4c0.6,0,1.1,0.5,1.1,1.1v6.9
        C29.5,98.9,29,99.4,28.4,99.4z"/>
      <rect x="16.9" y="96.9" class="st6" width="12.6" height="0.7"/>
      <g>
        <rect x="22.8" y="99.6" class="st6" width="0.7" height="1.4"/>
        <path class="st6" d="M25.9,101.4h-5.4c-0.2,0-0.4-0.2-0.4-0.4l0,0c0-0.2,0.2-0.4,0.4-0.4h5.4c0.2,0,0.4,0.2,0.4,0.4l0,0
          C26.3,101.2,26.1,101.4,25.9,101.4z"/>
      </g>
    </g>
    <text x="62" y="100" text-anchor="middle" class="st2 st3 st4">{{ name }}</text>
  </g> 
</template>

<script>
export default {
  name: 'node',
  props: {
    name: {
      type: String,
      default: 'MBFE上行',
    },
  },
};
</script>
