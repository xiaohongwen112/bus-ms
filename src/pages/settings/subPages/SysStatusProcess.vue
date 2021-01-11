<template>
  <div class='status-content'>
    <table class="process-info-table process-info-head">
      <thead>
      <tr>
        <th>进程</th>
        <th>运行状态</th>
      </tr>
      </thead>
    </table>
    <div class="table-body-div bar-wrap">
      <ScrollBar class="content-subject" style="top: 0px">
        <table class="process-info-table" v-if="datadetai.length > 0">
          <tr v-for="(k, index) in datadetai[0]" :key="`tr1${index}`">
            <td>
              <span class="process-decorate stop-process"></span>
              <span class="process-name">{{ k.name }}</span>
            </td>
            <td>
              <svg width="30" height="30" viewBox="0 0 50 50">
                <g>
                  <g>
                    <circle fill="#a42224" cx="25" cy="25" r="24.5"></circle>
                  </g>
                </g>
                <g>
                  <g>
                    <path fill="#fff"
                          :d="`M 35.725 32.612 l -7.647 -7.613 l 7.644 -7.61 c 0.634 -0.631 0.459 -1.829 -0.391 -2.675 s -2.053 -1.021 -2.687 -0.389 l -7.644 7.61 l -7.644 -7.61 c -0.634 -0.631 -1.837 -0.457 -2.687 0.389 s -1.025 2.044 -0.391 2.675 l 7.644 7.61 l -7.647 7.613 c -0.634 0.631 -0.459 1.829 0.391 2.675 c 0.85 0.846 2.053 1.021 2.687 0.389 l 7.647 -7.613 l 7.647 7.613 c 0.634 0.631 1.837 0.457 2.687 -0.389 C 36.184 34.441 36.359 33.243 35.725 32.612 Z`">
                    </path>
                  </g>
                </g>
              </svg>
            </td>
          </tr>
          <tr v-for="(k, index) in datadetai[1]" :key="`tr2${index}`">
            <td>
              <span class="process-decorate running-process"></span>
              <span class="process-name">{{ k }}</span>
            </td>
            <td>
              <svg width="30" height="30" viewBox="0 0 50 50">
                <g>
                  <g>
                    <circle fill="#3AB37C" cx="25" cy="25" r="24.5"></circle>
                  </g>
                </g>
                <g>
                  <g>
                    <path fill="#fff"
                          :d="`M 40.016 13.935 c -9.607 7.296 -18.968 17.387 -18.968 17.387 l -9.484 -11.065 l -3.161 3.161 c 4.152 3.071 7.158 6.62 12.645 12.645 c 5.338 -5.214 16.54 -15.08 20.548 -17.387 C 40.538 15.692 40.563 15.566 40.016 13.935 Z`">
                    </path>
                  </g>
                </g>
              </svg>
            </td>
          </tr>
        </table>
        <table class="process-info-table" v-if="!(datadetai.length > 0) ">
          <tr v-for="(k, index) in data[5]" :key="`tr3${index}`">
            <td>
              <span class="process-decorate running-process"></span>
              <span class="process-name">{{ data[k+13] }}</span>
            </td>
            <td>
              <svg width="30" height="30" viewBox="0 0 50 50">
                <g>
                  <g>
                    <circle fill="#3AB37C" cx="25" cy="25" r="24.5"></circle>
                  </g>
                </g>
                <g>
                  <g>
                    <path fill="#fff"
                          :d="`M 40.016 13.935 c -9.607 7.296 -18.968 17.387 -18.968 17.387 l -9.484 -11.065 l -3.161 3.161 c 4.152 3.071 7.158 6.62 12.645 12.645 c 5.338 -5.214 16.54 -15.08 20.548 -17.387 C 40.538 15.692 40.563 15.566 40.016 13.935 Z`">
                    </path>
                  </g>
                </g>
              </svg>
            </td>
            <td></td>
          </tr>
        </table>
      </ScrollBar>
    </div>
  </div>
</template>

<script>
import ScrollBar from '@/components/common/ScrollBar';

export default {
  components: { ScrollBar },
  computed: {
  },
  props: ['data', 'datadetai'],
};
</script>

<style lang="scss">
.bar-wrap{
  .ps--active-y > .ps__rail-y{
    width: 5px;
    .ps__thumb-y{
      width: 3px;
      right: 1px;
      &:focus{
        width: 3px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.status-content {
  position: absolute;
  top: 195px;
  left: 0;
  right: 0;
  bottom: 10px;
  border: 1px solid #0d5b58;
  width: calc(100% - 15px);
  height: calc(100% - 235px);
  background: #01080d;
}
thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
.process-info-table tr th:first-child {
  width: 70%;
  border-right: 1px solid #1f3449;
  background: #01080d;
}
.process-info-table tr th {
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  width: 30%;
}
.table-body-div.bar-wrap {
  overflow: hidden;
  border-top: none;
}
.table-body-div {
  position: absolute;
  top: 62px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: auto;
}
.table-body-div .content-subject {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
.process-info-table {
  width: 100%;
  border-spacing: 0;
}
.process-info-head{
  border-bottom: 1px solid #05302f;
}
.running-process {
  background: #36b374;
}
.stop-process {
  background: #cc2929;
}
.process-decorate {
  display: inline-block;
  height: 12px;
  width: 5px;
  margin-top: 4px;
  margin-right: 10px;
}
.process-info-table tr td {
  text-align: center;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  width: 30%;
  svg{
    margin-bottom: -8px;
  }
}
.process-info-table tr td:first-child {
  border-right: 1px solid #1f3449;
  background: #01080d;
  width: 70%;
}
th {
  font-weight: bold;
  text-align: center;
}
td,
th {
  display: table-cell;
  vertical-align: inherit;
}
</style>
