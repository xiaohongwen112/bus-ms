<script>

/**
 * https://cn.vuejs.org/v2/guide/render-function.html
 */

/* eslint-disable no-param-reassign */

import { arrayMerge } from '@/helpers/utils';

const validateWrapper = (item, e, on, isNumber) => {
  item.val = e.target.value;
  if ((isNumber || item.isNumber) && !isNaN(+item.val) && item.val !== '') {
    item.val = +item.val;
  }
  let res;
  if (item.validateFn) res = item.validateFn(item.val);
  else res = true;
  on(item, e, res);
};

const renderSpan = (h, spans) => spans.map(span => h('span', span));
const renderInput = (h, inputs, listener, inputDisabled, isNumber) => inputs.map(item => h('input', {
  attrs: {
    type: 'text',
    autocomplete: 'off',
    disabled: !inputs.disabled === undefined ? inputs.disabled : inputDisabled,
  },
  domProps: {
    value: item.val,
  },
  on: {
    input() {
      // validateWrapper(item, e, listener, isNumber);
    },
    blur(e) {
      validateWrapper(item, e, listener, isNumber);
    },
  },
}));

export default {
  name: 'input-fragment',
  functional: true,
  props: {
    spans: {
      type: Array,
      required: true,
    },
    inputDisabled: {
      type: Boolean,
      required: true,
    },
    isNumber: {
      type: Boolean,
      default: false,
    },
    inputs: {
      type: Array,
      required: true,
      default: () => [{
        name: 'down',
        val: 1,
        validateFn: v => v > 1,
        isNumber: false,
        disabled: false,
      }],
    },
  },
  render(h, c) {
    return arrayMerge(
      renderSpan(h, c.props.spans),
      renderInput(h, c.props.inputs, c.listeners.input, c.props.inputDisabled, c.props.isNumber),
    );
  },
};

</script>
