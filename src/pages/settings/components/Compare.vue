
<template>
  <table class="compare" style="width:100%">
    <tr>
      <td style="width:50%">
        <div class="edit_div">
          <ScrollBar class="scroll-area" :options="{useBothWheelAxes: true}" @ps-scroll-y="scrollY" ref="contentLeft">
            <pre v-html='value1' id="edit_pre_1"></pre>
            <textarea id="edit_textarea_1" v-model='value2' @onscroll="scrollLeft(e)" ></textarea>
          </ScrollBar>
        </div>
      </td>
      <td style="width:50%">
        <div class="edit_div">
          <ScrollBar class="scroll-area" :options="{useBothWheelAxes: true}" @ps-scroll-y="scrollY" ref="contentRight">
            <pre v-html='value3' id="edit_pre_2"></pre>
            <textarea id="edit_textarea_2" v-model='value4' @onscroll="scrollLeft(e)"></textarea>
          </ScrollBar>
        </div>
      </td>
    </tr>
  </table>
</template>
 
<script>
import ScrollBar from '@/components/common/ScrollBar';

export default {
  props: ['before', 'after'],
  components: { ScrollBar },
  watch: {  // 监听输入文字的变化 value2左边文本域的数据 value4右边文本域数据 监听之后实时赋值 显示文本的不同之处
    value2() {
      const op = this.eq({
        value1: this.value2,
        value2: this.value4,
      });
      this.value1 = op.value1;
      this.value3 = op.value2;
    },
    value4() {
      const op = this.eq({
        value1: this.value2,
        value2: this.value4,
      });
      this.value1 = op.value1;
      this.value3 = op.value2;
    },
    before(newVal) {
      this.value2 = JSON.stringify(newVal, null, 4);
    },
    after(newVal) {
      this.value4 = JSON.stringify(newVal, null, 4);
    },
  },
  data() {
    return {
      data1: {
        transaction_path: null,
        apply_ts: '',
      },
      data2: {
        transactieeon_path: null,
        apply_ts: '12',
      },
      value1: '',
      value2: '',
      value3: '',
      value4: '',
    };
  },
  created() {
    // 初始化对比
    const op = this.eq({
      value1: this.value2,
      value2: this.value4,
    });
    this.value1 = op.value1;
    this.value3 = op.value2;
    const op1 = this.eq({
      value1: this.value2,
      value2: this.value4,
    });
    this.value1 = op1.value1;
    this.value3 = op1.value2;
  },
  mounted() {
    this.value2 = JSON.stringify(this.before, null, 4);
    this.value4 = JSON.stringify(this.after, null, 4);
    this.$refs.contentLeft.$refs.sbConatiner.scrollTop = 1;
  },
  methods: {
    // 同步滚动
    scrollY(e) {
      const top = e.target.scrollTop;
      const index = e.target.childNodes[0].id.split('_')[2];
      if (index === '1') this.$refs.contentRight.$refs.sbConatiner.scrollTop = top;
      else this.$refs.contentLeft.$refs.sbConatiner.scrollTop = top;
    },
    eq(op) {
      if (!op) {
        return op;
      }
      if (!op.value1_style) {
        op.value1_style = 'background-color:#fbb2b2;'; // eslint-disable-line
      }
      if (!op.value2_style) {
        op.value2_style = 'background-color:#fbb2b2;'; // eslint-disable-line
      }
      if (!op.eq_min) {
        op.eq_min = 3; // eslint-disable-line
      }
      if (!op.eq_index) {
        op.eq_index = 5; // eslint-disable-line
      }
      if (!op.value1 || !op.value2) {
        return op;
      }
      const ps = {
        v1_i: 0,
        v1_new_value: '',
        v2_i: 0,
        v2_new_value: '',
      };
      while (ps.v1_i < op.value1.length && ps.v2_i < op.value2.length) {
        if (op.value1[ps.v1_i] === op.value2[ps.v2_i]) {
          ps.v1_new_value += op.value1[ps.v1_i].replace(/</g, '<').replace('>', '>');
          ps.v2_new_value += op.value2[ps.v2_i].replace(/</g, '<').replace('>', '>');
          ps.v1_i += 1;
          ps.v2_i += 1;
          if (ps.v1_i >= op.value1.length) {
            ps.v2_new_value += `<span style='${op.value2_style}'>${op.value2.substr(ps.v2_i).replace(/</g, '<').replace('>', '>')}</span>`;
            break;
          }
          if (ps.v2_i >= op.value2.length) {
            ps.v1_new_value += `<span style='${op.value1_style}'>${op.value1.substr(ps.v1_i).replace(/</g, '<').replace('>', '>')}</span>`;
            break;
          }
        } else {
          ps.v1_index = ps.v1_i + 1;
          ps.v1_eq_length = 0;
          ps.v1_eq_max = 0;
          ps.v1_start = ps.v1_i + 1;
          while (ps.v1_index < op.value1.length) {
            if (op.value1[ps.v1_index] === op.value2[ps.v2_i + ps.v1_eq_length]) {
              ps.v1_eq_length += 1;
            } else if (ps.v1_eq_length > 0) {
              if (ps.v1_eq_max < ps.v1_eq_length) {
                ps.v1_eq_max = ps.v1_eq_length;
                ps.v1_start = ps.v1_index - ps.v1_eq_length;
              }
              ps.v1_eq_length = 0;
              break;// 只寻找最近的
            }
            ps.v1_index += 1;
          }
          if (ps.v1_eq_max < ps.v1_eq_length) {
            ps.v1_eq_max = ps.v1_eq_length;
            ps.v1_start = ps.v1_index - ps.v1_eq_length;
          }

          ps.v2_index = ps.v2_i + 1;
          ps.v2_eq_length = 0;
          ps.v2_eq_max = 0;
          ps.v2_start = ps.v2_i + 1;
          while (ps.v2_index < op.value2.length) {
            if (op.value2[ps.v2_index] === op.value1[ps.v1_i + ps.v2_eq_length]) {
              ps.v2_eq_length += 1;
            } else if (ps.v2_eq_length > 0) {
              if (ps.v2_eq_max < ps.v2_eq_length) {
                ps.v2_eq_max = ps.v2_eq_length;
                ps.v2_start = ps.v2_index - ps.v2_eq_length;
              }
              ps.v1_eq_length = 0;
              break;// 只寻找最近的
            }
            ps.v2_index += 1;
          }
          if (ps.v2_eq_max < ps.v2_eq_length) {
            ps.v2_eq_max = ps.v2_eq_length;
            ps.v2_start = ps.v2_index - ps.v2_eq_length;
          }
          if (ps.v1_eq_max < op.eq_min && ps.v1_start - ps.v1_i > op.eq_index) {
            ps.v1_eq_max = 0;
          }
          if (ps.v2_eq_max < op.eq_min && ps.v2_start - ps.v2_i > op.eq_index) {
            ps.v2_eq_max = 0;
          }
          if ((ps.v1_eq_max === 0 && ps.v2_eq_max === 0)) {
            ps.v1_new_value += `<span style='${op.value1_style}'>${op.value1[ps.v1_i].replace(/</g, '<').replace('>', '>')}</span>`;
            ps.v2_new_value += `<span style='${op.value2_style}'>${op.value2[ps.v2_i].replace(/</g, '<').replace('>', '>')}</span>`;
            ps.v1_i += 1;
            ps.v2_i += 1;

            if (ps.v1_i >= op.value1.length) {
              ps.v2_new_value += `<span style='${op.value2_style}'>${op.value2.substr(ps.v2_i).replace(/</g, '<').replace('>', '>')}</span>`;
              break;
            }
            if (ps.v2_i >= op.value2.length) {
              ps.v1_new_value += `<span style='${op.value1_style}'>${op.value1.substr(ps.v1_i).replace(/</g, '<').replace('>', '>')}</span>`;
              break;
            }
          } else if (ps.v1_eq_max > ps.v2_eq_max) {
            ps.v1_new_value += `<span style='${op.value1_style}'>${op.value1.substr(ps.v1_i, ps.v1_start - ps.v1_i).replace(/</g, '<').replace('>', '>')}</span>`;
            ps.v1_i = ps.v1_start;
          } else {
            ps.v2_new_value += `<span style='${op.value2_style}'>${op.value2.substr(ps.v2_i, ps.v2_start - ps.v2_i).replace(/</g, '<').replace('>', '>')}</span>`;
            ps.v2_i = ps.v2_start;
          }
        }
      }
      op.value1 = ps.v1_new_value; // eslint-disable-line
      op.value2 = ps.v2_new_value; // eslint-disable-line
      return op;
    },
  },
};
</script>
<style>
.compare{
  width: 100%;
}
.compare .scroll-area{
  height: 325px;
}
.compare .edit_div {
  border: 1px solid #334656;
  border-radius: 5px;
  overflow: auto;
  position: relative;
  margin: 10px 0;
  background: rgba(171, 218, 247, .5);
}

.compare .edit_div textarea {
  display:none;
  resize: none;
  background: none repeat scroll 0 0 transparent;
  border: 0 none;
  width: 100%;
  height: 75vh;
  overflow-y: scroll;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 2;
  font-size: 18px;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
  color: #000000;
}

.compare .edit_div #edit_pre_1,  .compare .edit_div #edit_pre_2{
  overflow: unset;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
  height: 100%;
  background-color: transparent;
  text-align: left;
  color: #081928;
  z-index: 10;
  font-size: 18px;
  border: none;
}
</style>