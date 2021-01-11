import _ from 'lodash';
import $ from 'jquery';

import Node from '@/components/editTopo/models/GroupNode';
import Edge from '@/components/editTopo/models/Edge';

import {
  bgColorArr,
} from './constants';

const offset = {
  x: 0,
  y: 30,
};

/** @description
 * https://webpack.js.org/guides/dependency-management/#require-context
 */
const imgReq = require.context('../assets/topo-icon/', false, /\.svg$/);

export const imgUrl = imgName => imgReq(`./${imgName}.svg`);

const navReq = require.context('../assets/nav-icon/', false, /\.svg$/);

export const navIconUrl = imgName => navReq(`./${imgName}.svg`);

// const jsonReq = require.context('./map/mapJson/', false, /\.json$/);
// export const jsonUrl = jsonName => jsonReq(`./${jsonName}.json`);

export const getBgColor = (index) => {
  const len = bgColorArr.length;
  return bgColorArr[index % len];
};

export const coordUnitTrans = ({
  x,
  y,
}) => {
  const sx = 200;
  const sy = 100;
  return {
    x: parseFloat(x) * sx + offset.x,
    y: parseFloat(y) * sy + offset.y,
  };
};
export const coordUnitTransInverse = ({
  x,
  y,
}) => {
  const sx = 200;
  const sy = 100;
  return {
    x: (x - offset.x) / sx,
    y: (y - offset.y) / sy,
  };
};

export const buildUrlencodedData = (data) => {
  let ret = '';
  for (const it in data) { // eslint-disable-line
    ret +=
      encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'; // eslint-disable-line
  }
  return ret;
};

/**
 * build nodes and edges from dataPath
 */
export const buildNodes = (data) => {
  const nodes = [];
  const edges = [];
  _.forEach(data.datapath.trade, (v) => {
    const levelNum = v.settings.name;
    const nodeIndex = +levelNum.match(/\d+/)[0];
    const {
      x,
      y,
    } = coordUnitTrans(v.settings.pos);
    const dispName = v.settings.disp_name;
    const iconName = v.settings.imgname;
    const type = v.settings.type;
    let intf;
    if (type === 'server') {
      intf = v.collector[0].name.match(/\d+/)[0];
    }
    const node = new Node(x, y, {
      levelNum,
      nodeIndex,
      dispName,
      type,
      iconName,
      intf,
    });
    nodes.push(node);

    _.forEach(v.ref, (refV) => {
      const sourceNodeId = nodeIndex;
      const targetNodeId = +refV.name.match(/\d+/)[0];
      const edge = new Edge(sourceNodeId);
      edge.linkTo(targetNodeId);
      edges.push(edge);
    });
  });

  _.forEach(edges, (edge) => {
    const targetNode = _.find(nodes, n => n.id === edge.targetNodeId);
    const sourceNode = _.find(nodes, n => n.id === edge.sourceNodeId);
    sourceNode.addSourceEdge(edge.id);
    targetNode.addTargetEdge(edge.id);
    edge.link(sourceNode, targetNode);
  });
  return {
    nodes,
    edges,
  };
};

/**
 * build dataPath from nodes and old datapath
 */
/* eslint-disable  */
// TO-DO
export const buildDataPath = (datapath, nodes) => {
  return datapath;
};

/**
 * 健康度
 */
const healthObj = {
  'null': {
    text: '--',
    color: '#061A2B',
    status: 'null',
  },
  'urgent': {
    text: '紧急',
    color: '#d95151',
    status: 'urgent',
  },
  'concern': {
    text: '关注',
    color: '#d88745',
    status: 'concern',
  },
  'normal': {
    text: '正常',
    color: '#32dc2a',
    status: 'normal',
  },
};

export const translateHealth = health => {
  let healthNum = Number(health);
  if (healthNum === 0) {
    return healthObj['null'];
  } else if (healthNum < 41) {
    return healthObj['urgent'];
  } else if (healthNum < 61) {
    return healthObj['concern'];
  }
  return healthObj['normal'];
};

export {
  healthObj
};

// 将时间改为时间戳
export const jsStrtoTimes = time => {
  let newStr = time.replace(/:/g, '-');
  newStr = newStr.replace(/ /g, '-');
  const arr = newStr.split('-');
  const datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4]));
  const strtotime = datum.getTime() / 1000;
  return strtotime;
};

export function formatTransCount(val, isStr) {
  val = val + '';
  var numberVal = parseInt(val);
  var valLen = val.toString().length;
  var formatted = {
    value: val,
    unit: '笔'
  };
  if (valLen < 5) {
    formatted.unit = '笔';
  } else if (valLen < 9) {
    formatted.unit = '万笔';
    formatted.value = (numberVal / 10000).toFixed(2) * 100 / 100;
  } else if (valLen < 13) {
    formatted.unit = "亿笔";
    formatted.value = (numberVal / 100000000).toFixed(2) * 100 / 100;
  } else {
    formatted.unit = "万亿笔";
    formatted.value = (numberVal / 1000000000000).toFixed(2) * 100 / 100;
  }
  if (isStr) {
    return formatted.value + formatted.unit;
  } else {
    return formatted;
  }
}

export function formatNum(n, defaultV = 0) {
  n = +n;
  return (!isNaN(n)) ? n.toFixed(2) * 100 / 100 : defaultV;
}

export function formatTime(duration, isStr) {
  var json = {
    value: duration.toFixed(2) * 100 / 100,
    unit: 'ms'
  };
  if (duration <= 9999) {
    json.unit = 'ms';
  } else if ((9999 < duration) && (duration <= 9999999)) {
    json.value = (duration / 1000).toFixed(2) * 100 / 100;
    json.unit = "s";
  } else if ((9999999 < duration) && (duration <= 599940000)) {
    json.value = ((duration / 1000) / 60).toFixed(2) * 100 / 100;
    json.unit = 'min';
  } else {
    json.value = (((duration / 1000) / 60) / 60).toFixed(2) * 100 / 100;
    json.unit = 'h';
  }
  if (isStr) {
    return json.value + json.unit;
  } else {
    return json;
  }
}

export function getHealthStatus(health) {
  const style = {
    text: '',
    color: ''
  };
  if (health == 0) {
    style.text = "--";
    style.color = "#061A2B";
  } else if (health < 41) {
    style.text = "紧急";
    style.color = "#d95151";
  } else if (health < 61) {
    style.text = "关注";
    style.color = "#d88745";
  } else {
    //case health < 81:
    //    style.text = "一般";
    //    style.color = "#29d798";
    style.text = "正常";
    style.color = "#32dc2a";
  }
  return style;
}

export function getCardColor(health) {
  const style = {
    basicColor: '',
    textColor: ''
  };
  // if (health == 0) {
  //   style.text = "--";
  //   style.color = "#061A2B";
  // } else   
  if (health < 41) {
    style.basicColor = '#9e2d29';
    style.textColor = '#de7979';
  } else if (health < 61) {
    style.basicColor = '#fe9500';
    style.textColor = '#fccd89';
  } else {
    style.basicColor = '#1e69a0';
    style.textColor = '#8bcafb';
  }
  return style;
}

export const ts2str = (ts, formatType = 'yyyy-MM-dd HH:mm:ss') => {
  let res = '';
  const dt = new Date(ts * 1000);
  let strTimeLen = 0;
  let strYear = dt.getFullYear();
  let strMonth = String(dt.getMonth() + 1);
  strMonth = strMonth.length < 2 ? `0${strMonth}` : strMonth;
  let strDay = String(dt.getDate());
  strDay = strDay.length < 2 ? `0${strDay}` : strDay;
  if (formatType === 'yyyy-MM-dd HH:mm') {
    strTimeLen = 5;
  } else {
    strTimeLen = 8;
  }
  res = `${strYear}-${strMonth}-${strDay} ${dt.toTimeString().substr(0, strTimeLen)}`;
  if (formatType.match(/\.d/)) {
    const decimals = formatType.split('.')[1].length;
    const millisecond = ts.toFixed(decimals).split('.')[1];
    res = `${res}.${millisecond}`;
  }
  return res;
};

export const str2ts = str => {
  return Date.parse(new Date(str)) / 1000;
};

export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    const storageLen = localStorage.length;
    for (let i = 0; i < (storageLen * 2 / 3); i += 1) {
      localStorage.removeItem(localStorage.key(0));
    }
  }
};

export const textWidth = text => {
  text = text.replace(/ /g, 'd');
  const sensor = $(`<span id="text-width">${text}</span>`).css({
    display: 'none',
    'font-family': 'helvetica',
    'font-size': '12px'
  });
  $('body').append(sensor);
  const width = sensor.width();
  sensor.remove();
  return width;
}

// eslint-disable-next-line
export const arrayMerge = (a, b) => {
  return a.reduce((p, c, i) => {
    let t = p;
    if (c) t = t.concat(c);
    if (b[i]) t = t.concat(b[i]);
    return t;
  }, []);
};


/**
 * 拼接get请求参数
 * @param {*} data
 */
export const joinQuery = (data) => {
  let res = '';
  _.forEach(data, (v, k) => {
    if (res.length !== 0) {
      res = res.concat('&');
    }
    res = res.concat(`${k}=${v}`);
  });
  return res;
};