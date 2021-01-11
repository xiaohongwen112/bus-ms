import {
  select as D3Select,
} from 'd3-selection';


/**
 * 错误提示
 * @param ele
 * @param tip
 */
function error(ele, tip) {
  const _ele = D3Select(ele);
  _ele.classed('error-input', true);
  window.show_msgs(window.d3.select(ele), tip, 'top', true);
  console.log(tip);
}

/**
 * 删除错误提示
 * @param ele
 */
function removeError(ele) {
  const _ele = D3Select(ele);
  if (_ele.classed('error-input')) {
    _ele.classed('error-input', false);
    if (window.d3.select(ele).property('tips')) {
      window.d3.select(ele).property('tips').remove();
    }
  }
}

/**
 * 错误toggle
 * bool 为true，则无错误
 * @param result
 * @param ele
 */
function checkError(result, ele) {
  let flag = true;
  if (result.bool) {
    removeError(ele);
  } else {
    error(ele, result.tip);
    flag = false;
  }
  return flag;
}

/**
 * 验证名称20以内
 * @param name
 * @param nullable, 校验不为空
 * @returns {{bool: boolean, tip: string}}
 */
function validateName(name, nullable = true) {
  const pattern1 = /^[A-Za-z0-9\u4e00-\u9fa5-]+$/;
  const pattern2 = /^\s*[\s\S]{0,20}\s*$/;
  let tip = '';
  let bool = true;
  if (!nullable && (name === '' || name === null)) {
    tip = '不能为空';
    bool = false;
  }
  if (!pattern1.test(name)) {
    tip = '不能包含除数字、英文字母、汉字外的其他字符';
    bool = false;
  } else if (bool) {
    if (pattern2.test(name)) {
      bool = true;
      tip = '';
    } else {
      tip = '长度不能超过20';
      bool = false;
    }
  }
  return {
    bool,
    tip,
  };
}

/**
 * 验证名称20以内
 * @param name
 * @returns {{bool: boolean, tip: string}}
 */
function validateDev(name) {
  const pattern1 = /^[A-Za-z0-9\u4e00-\u9fa5-]+$/;
  const pattern2 = /^\s*[\s\S]{0,20}\s*$/;
  let tip = '';
  let bool = true;
  if (name === '') {
    return {
      bool,
      tip,
    };
  }
  if (!pattern1.test(name)) {
    tip = '不能包含除数字、英文字母、汉字外的其他字符';
    bool = false;
  } else if (bool) {
    if (pattern2.test(name)) {
      bool = true;
      tip = '';
    } else {
      tip = '长度不能超过20';
      bool = false;
    }
  }
  return {
    bool,
    tip,
  };
}

function validateCollName(name) {
  let tip = '';
  let bool = true;
  if (name) {
    const pattern = /[&; ]/;
    if (pattern.test(name) || name.length > 20) {
      tip = '不能存在"&",";"和空格,且长度不能超过20！';
      bool = false;
    } else {
      tip = '';
      bool = true;
    }
  } else {
    tip = '不能为空';
    bool = false;
  }

  return {
    bool,
    tip,
  };
}

/**
 * 验证IP
 * @param ipIn
 * @param nullable, 校验不为空
 * @param isReturn
 * @returns {*}
 */
function validateIp(ipIn, nullable = true) {
  const pattern = /(^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$)/;
  const pattern1 = /.\d+$/;
  const pattern2 = /\d+/;
  let tip = '';
  let bool = true;
  if (ipIn) {
    ipIn.split(',').every((item) => {
      if (item.indexOf('-') > -1) {
        const ipSegment = item.split('-');
        bool = ipSegment.every(d => pattern.test(d));
        if (bool && ipSegment[0].split(pattern1)[0] === ipSegment[1].split(pattern1)[0]) {
          const start = Number(ipSegment[0].match(pattern1)[0].match(pattern2)[0]);
          const end = Number(ipSegment[1].match(pattern1)[0].match(pattern2)[0]);
          if (start > end) {
            bool = false;
            tip = 'IP错误，网段用“-”连接，地址间用“，”分隔！';
          }
        } else {
          bool = false;
          tip = 'IP错误，网段用“-”连接，地址间用“，”分隔！';
        }
      } else {
        bool = pattern.test(item);
        tip = 'IP错误，网段用“-”连接，地址间用“，”分隔！';
      }
      return bool;
    });
  } else if (!nullable) {
    tip = 'ip地址不能为空';
    bool = false;
  }
  return {
    bool,
    tip,
  };
}

/**
 * 验证端口
 * @param portIn
 * @returns {{bool: boolean, tip: string}}
 */
function validatePort(portIn, nullable = false) {
  const obj = {
    bool: true,
    tip: '',
  };
  if (portIn) {
    const pattern = /(^[0]$)|(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/;
    const port = portIn.split(',');
    obj.bool = port.every((item) => {
      if (port.indexOf(item) !== port.lastIndexOf(item)) {
        obj.tip = '端口中存在重复项';
        return false;
      }
      if (item.indexOf('-') > -1) {
        const portSegment = item.split('-');
        if (Number(portSegment[1]) > Number(portSegment[0]) && portSegment.every(d => pattern.test(d))) {
          return true;
        }
        obj.tip = '0-65535之间，区间用"-"连接，多个端口用","隔开';
        return false;
      } else if (!pattern.test(item)) {
        obj.tip = '0-65535之间，区间用"-"连接，多个端口用","隔开';
        return false;
      }
      return true;
    });
  } else if (!nullable) {
    obj.tip = '端口号不能为空';
    obj.bool = false;
  }
  return obj;
}

/**
 * 验证百分比
 * @param val
 * @returns {*}
 */
function validatePercent(val, n) {
  const pattern = /(?!^0\.0$)^[0-9][0-9]?(\.[0-9]{1,2})?$/;
  const pattern1 = /(?!^0\.0$)^[0-9][0-9]?(\.[0-9]{1,2})?$|^100$/;
  if (n) {
    if (val !== '' && pattern.test(val) && val !== '0') {
      return {
        bool: true,
      };
    }
  } else {
    if (val !== '' && pattern1.test(val)) {
      return {
        bool: true,
      };
    }
  }
  return {
    bool: false,
    tip: '请输入0到100之间的数字，可保留两位小数',
  };
}

/**
 * 验证返回码
 * @param val
 * @returns {*}
 */
function validateCode(val) {
  const pattern = /^[A-Za-z0-9]+([\\,][A-Za-z0-9]+)*$/;
  if (val !== '' && pattern.test(val) && val.length <= 225) {
    return {
      bool: true,
    };
  } else if (val.length > 225) {
    return {
      bool: false,
      tip: '长度不能超过20！',
    };
  }
  return {
    bool: false,
    tip: '请输入字母或数字,多个值用"，"隔开',
  };
}

/**
 * 验证响应时间
 * @param val
 * @param isNull
 * @returns {*}
 */
function validateMs(val, isNull) {
  const pattern = /^(([1-9][0-9]{0,10})|([0]))(\.[0-9]{1,2})?$/;
  if ((isNull && val === '') || (val !== '' && pattern.test(val))) {
    return {
      bool: true,
    };
  }
  return {
    bool: false,
    tip: '请输入小于12位的自然数，可精确到2位小数',
  };
}

/**
 * 验证交易量
 * @param val
 * @returns {*}
 */
function validateCount(val) {
  const pattern = /(^([1-9][0-9]{0,14})$)|(^[0]$)/;
  if (val !== '' && pattern.test(val)) {
    return {
      bool: true,
    };
  }
  return {
    bool: false,
    tip: '请输入小于16位的自然数',
  };
}

/**
 * 验证密码 非空 6 - 16 位 至少包含一个字母和纯数字
 * @param pwd
 * @returns {{bool: boolean, tip: string}}
 */
function validatePwd(pwd) {
  const pattern = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
  const pattern1 = /[*#\u4e00-\u9fa5]/;
  const pattern2 = new RegExp('\\s');
  const pattern3 = /^\d+$/;
  const pattern4 = new RegExp("[`~!@$^&()_=|{}':;',\\[\\].<>《》/?~！@#￥……&+*%（）——|{}【】‘；：”“'。，、？-]");
  if ((pwd.match(pattern2) !== null || pattern1.test(pwd))) {
    return {
      bool: false,
      tip: '仅能输入除中文、*、#、空格以外的字符',
    };
  }
  if (pwd !== '' && !pattern3.test(pwd) && pattern.test(pwd) && pwd.length >= 6 && pwd.length <= 16) {
    return {
      bool: true,
    };
  }
  if (pattern4.test(pwd) && pattern.test(pwd)) {
    return {
      bool: true,
    };
  }
  return {
    bool: false,
    tip: '6-16位，除中文、*、#、空格，字母和数字组合',
  };
}

/**
 * 验证用户名4 - 20
 * @param 用户名
 * @returns {{bool: boolean, tip: string}}
 */
function validateUserName(name) {
  let obj = {
    bool: true,
    tip: '',
  };
  const pattern = /^[\w.@-]+$/;
  if (name !== '' && pattern.test(name)) {
    if (name.length < 4 || name.length > 20) {
      obj = {
        bool: false,
        tip: '该值长度为4-20',
      };
    }
  } else {
    obj = {
      bool: false,
      tip: '必填项，只能包含字母、数字和字符@.-_',
    };
  }
  return obj;
}

/**
 * 协议 2- 20
 * @param 协议验证
 * @returns {{bool: boolean, tip: string}}
 */
function validateProtocolName(name) {
  let obj = {
    bool: true,
    tip: '',
  };
  const pattern = /^[\w_]+$/;
  if (name !== '' && pattern.test(name)) {
    if (name.length < 2 || name.length > 20) {
      obj = {
        bool: false,
        tip: '该值长度为2-20',
      };
    }
  } else {
    obj = {
      bool: false,
      tip: '必填项，只能包含字母、数字和字符_',
    };
  }
  return obj;
}


/**
 * 协议 2- 20
 * @param 协议验证
 * @returns {{bool: boolean, tip: string}}
 */
function validateProtocolData(name) {
  let obj = {
    bool: true,
    tip: '',
  };
  const pattern = /^[\w_*/]+$/;
  if (name !== '' && pattern.test(name)) {
    if (name.length < 2 || name.length > 20) {
      obj = {
        bool: false,
        tip: '该值长度为2-20',
      };
    }
  } else {
    obj = {
      bool: false,
      tip: '必填项，只能包含字母、数字和字符_*/',
    };
  }
  return obj;
}

/**
 * 协议 0- 255
 * @param 协议验证
 * @returns {{bool: boolean, tip: string}}
 */
function validateProtocoldis(name) {
  let obj = {
    bool: true,
    tip: '',
  };
  if (name === null) {
    obj = {
      bool: true,
      tip: '',
    };
  } else if (name === '' || name.length > 255) {
    if (name.length > 255) {
      obj = {
        bool: false,
        tip: '该值长度为0-255',
      };
    }
  } else {
    obj = {
      bool: true,
      tip: '',
    };
  }
  return obj;
}
/**
 * 协议 0- 255
 * @param 协议验证
 * @returns {{bool: boolean, tip: string}}
 */
function validateProtocolDecode(name) {
  let obj = {
    bool: true,
    tip: '',
  };
  const pattern = /^.*[\u4e00-\u9fa5].*$/;
  if (name === '') {
    obj = {
      bool: false,
      tip: '配置信息不能为空',
    };
  } else if (pattern.test(name)) {
    obj = {
      bool: false,
      tip: '配置信息不能为中文',
    };
  } else {
    obj = {
      bool: true,
      tip: '',
    };
  }
  return obj;
}


/**
 * 验证部门名称 汉字、字母或数字 不能为纯数字
 * @param name
 * @returns {{bool: boolean, tip: string}}
 */
function validateDepName(name) {
  const pattern = /^[\u4e00-\u9fa5a-zA-Z0-9]*[a-zA-Z\u4e00-\u9fa5][\u4e00-\u9fa5a-zA-Z0-9]*$/;
  if (pattern.test(name)) {
    if (name.length > 20) {
      return {
        bool: false,
        tip: '该值长度最大为20',
      };
    }
    return {
      bool: true,
    };
  }
  return {
    bool: false,
    tip: '只能为汉字字母或数字且不能为纯数字',
  };
}

/**
 * 验证电话
 * @param tel
 * @returns {{bool: boolean, tip: string}}
 */
function validateTel(tel) {
  const pattern = /^[01]\d{10}$|^\d{3,4}-\d{7,8}$/;
  if (pattern.test(tel)) {
    return {
      bool: true,
    };
  }
  return {
    bool: false,
    tip: '请输入正确的手机号码或带区号的座机号',
  };
}

/**
 * 验证手机
 * @param phone
 * @returns {{bool: boolean, tip: string}}
 */
function validatePhone(phone) {
  const pattern = /^1[34578]\d{9}$/;
  if (pattern.test(phone)) {
    return {
      bool: true,
    };
  }
  return {
    bool: false,
    tip: '请输入正确的手机号码',
  };
}

/**
 * 验证电子邮箱
 * @param email
 * @returns {{bool: boolean, tip: string}}
 */
function validateMail(email) {
  const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/; // eslint-disable-line
  if (pattern.test(email)) {
    return {
      bool: true,
    };
  }
  return {
    bool: false,
    tip: '请输入有效的邮箱地址',
  };
}

// 验证特殊字符
function checkSpecial(str) {
  const pattern = new RegExp("[`~!@#$^&*()_=|{}':;',\\[\\].<>《》/?~！@#￥……&+*%（）——|{}【】‘；：”“'。，、？-]");
  if (pattern.test(str)) {
    return true;
  }
  return false;
}

/**
 * 验证名称 仅中、英文 长度最少为2
 * @param val
 * @returns {*}
 */
function validateCmName(val) {
  const pattern = /^[\u4e00-\u9fa5a-zA-Z]*[a-zA-Z\u4e00-\u9fa5][\u4e00-\u9fa5a-zA-Z]*$/;
  if (val !== '' && pattern.test(val) && val.length >= 2) {
    return {
      bool: true,
    };
  } else if (val.length < 2) {
    return {
      bool: false,
      tip: '长度至少为2',
    };
  }
  return {
    bool: false,
    tip: '仅能输入中文和英文，长度至少为2',
  };
}

/**
 * 验证名称 仅中、英文 长度最少为2
 * @param val
 * @returns {*}
 */
function valiproLay(val) {
  // const pattern = /^\d{5}$/;
  // debugger;
  if (val !== '' && Number(val) <= 65535 && Number(val) >= 0) {
    return {
      bool: true,
    };
  } else if (Number(val) > 65535) {
    return {
      bool: false,
      tip: '最大值不大于65535',
    };
  } else if (Number(val) < 0) {
    return {
      bool: false,
      tip: '最小值不低于0',
    };
  }
  return {
    bool: false,
    tip: '格式错误，请输入0-65535之间的数字',
  };
}

export {
  error,
  removeError,
  checkError,
  validateName,
  validateDev,
  validateCollName,
  validateIp,
  validatePort,
  validatePercent,
  validateCode,
  validateMs,
  validateCount,
  validatePwd,
  validateUserName,
  validateProtocolName,
  validateProtocolData,
  validateProtocoldis,
  validateProtocolDecode,
  validateDepName,
  validateTel,
  validateMail,
  checkSpecial,
  validateCmName,
  validatePhone,
  valiproLay,
};
