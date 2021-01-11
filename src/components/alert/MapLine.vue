<template>
  <g>
    <path class="linkArrow" :class="[alertFlag ? 'line-alert' : alertFlag !== null && !alertFlag ? 'line-common' : '']":d="attrs.path" fill="none" :marker-end="[alertFlag ? 'url(#linkArrow-alert)' : alertFlag !== null ?'url(#linkArrow-common)' : 'url(#linkArrow)']"></path>  
  </g>
</template>

<script>
  import EdgeClass from '@/components/editTopo/models/Edge';
  
  export default{
    props: {
      edge: {
        type: Object,
        default() {
          return {};
        },
      },
      alertFlag: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        r: EdgeClass.r,
        bugleDistance: EdgeClass.bugleDistance,
        source: { x: 0, y: 0 },
        target: { x: 1, y: 1 },
      };
    },
    computed: {
      attrs() { // 处理折线
        const { bugleDirection, source, target } = this.edge;
        const [r, bugleDistance] = [0, 10];
        const { x: x1, y: y1 } = source;
        const { x: x2, y: y2 } = target;
        const d = Math.pow((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1), 0.5);
        const _x1 = d ? ((x2 - x1) * (r / d) + x1) : (x1);
        const _y1 = d ? ((y2 - y1) * (r / d) + y1) : (y1);
        const _x2 = (x2 - x1 > 0 ? -1 : 1) * r + x2;
        const _y2 = y2;
        const delX = (x2 - x1) / 2 + x1;
        const delY = (y2 - y1) / 2 + y1;
        let dx;
        if (_x1 <= _x2) { // 默认为左向
          if (bugleDirection === 'right') {
            dx = _x2 + bugleDistance;
          } else {
            dx = _x2 - bugleDistance;
          }
        } else { // 默认为右向
          if (bugleDirection === 'left') {
            dx = _x2 - bugleDistance;
          } else {
            dx = _x2 + bugleDistance;
          }
        }
        const path = `M${_x1 + 66},${_y1 / 2.5 + 45}L${dx + 65},${_y2 / 2.5 + 45}L${_x2 + 63},${_y2 / 2.5 + 45}`;
        return { d, dx, delX, delY, path, x1, x2, y1, y2 };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .linkArrow{
    stroke:rgba(0, 168, 236, .3);
    stroke-width:1;
    &.line-common{
      stroke:rgba(0, 168, 236, 1);
    }
    &.line-alert{
      stroke:#e04c4c;
    }
  }
</style>