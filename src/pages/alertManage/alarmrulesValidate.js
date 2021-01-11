export default {
  health: {
    errorFlag: false, // 导航感叹号提示
    baseline: {
      reg: /(?!^0\.0$)^[0-9][0-9]?(\.[0-9]{1,2})?$|^100$/,
      errorFlag: false,
      errorMsg: '0-100, 最多两位小数',
    },
    strategyErrorFlag: false,
  },
  trans_count: {
    errorFlag: false, // 导航感叹号提示
    baseline: {
      reg: /(^([1-9][0-9]{0,16})$)|(^[0]$)/,
      // errorFlag: false,
      // errorMsg: '小于16位的正整数, 高于值大于低于值',
      up: {
        reg: /(^([1-9][0-9]{0,16})$)|(^[0]$)/,
        errorFlag: false,
        errorMsg: '小于16位的正整数',
      },
      down: {
        reg: /(^([1-9][0-9]{0,16})$)|(^[0]$)/,
        errorFlag: false,
        errorMsg: '小于16位的正整数',
      },
    },
    strategyErrorFlag: false,
  },
  succ_rate: {
    errorFlag: false, // 导航感叹号提示
    baseline: {
      reg: /(?!^0\.0$)^[0-9][0-9]?(\.[0-9]{1,2})?$|^100$/,
      errorFlag: false,
      errorMsg: '0-100, 最多两位小数',
    },
    strategyErrorFlag: false,
  },
  duration: {
    errorFlag: false, // 导航感叹号提示
    baseline: {
      reg: /^(([1-9][0-9]{0,12})|([0]))(\.[0-9]{1,2})?$/,
      errorFlag: false,
      errorMsg: '小于12位, 最多两位小数',
    },
    strategyErrorFlag: false,
  },
  rr_rate: {
    errorFlag: false, // 导航感叹号提示
    baseline: {
      reg: /(?!^0\.0$)^[0-9][0-9]?(\.[0-9]{1,2})?$|^100$/,
      errorFlag: false,
      errorMsg: '0-100, 最多两位小数',
    },
    strategyErrorFlag: false,
  },
  return_code: {
    errorFlag: false, // 导航感叹号提示
    baseline: { // 返回码
      reg: /^([A-Za-z0-9]+([\\,][A-Za-z0-9]+)*)?$/,
      errorFlag: false,
      errorMsg: '字母或数字, 多个值用逗号隔开',
    },
    strategyErrorFlag: false,
  },
};

