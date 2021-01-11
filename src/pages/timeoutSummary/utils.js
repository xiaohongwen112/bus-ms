import { ts2str } from '@/helpers/utils';

// export const isMs = (data) => {
//   let res = true;
//   // let tmpMax = data.filter(v => typeof v === 'number');
//   // tmpMax = Math.max(...tmpMax);
//   // const res = tmpMax < 1000;
//   return res;
// };

const ts2ms = (ts) => {
  let res = '--';
  if (typeof ts === 'number') {
    // 格式: -时-分-秒
    res = ts2str(ts, 'yyyy-MM-dd HH:mm:ss.dddddd');
    // const index = tmpStr.match(/\s/).index;
    // res = tmpStr.substring(index + 4);
    // res = res.replace(/(\d*):(\d*).(\d*)/, '$1分$2秒$3');
  }
  return res;
};

const substract = (a, b) => {
  let res = '--';
  if (typeof a === 'number' && typeof b === 'number') {
    res = Math.round((b - a) * 1000);
  }
  return res.toLocaleString();
};

export const calcTimes = (obj) => {
  const tmpTimes = [];
  tmpTimes[0] = obj.up_mbfe_send;
  tmpTimes[1] = obj.up_ccpc_rev;
  tmpTimes[2] = obj.up_ccpc_send;
  tmpTimes[3] = obj.up_npc_rev;
  tmpTimes[4] = obj.down_mbfe_send;
  tmpTimes[5] = obj.down_ccpc_rev;
  tmpTimes[6] = obj.down_ccpc_send;
  tmpTimes[7] = obj.down_npc_rev;
  tmpTimes[8] = substract(tmpTimes[2], tmpTimes[3]);
  tmpTimes[9] = substract(tmpTimes[6], tmpTimes[7]);
  tmpTimes.forEach((d, i) => {
    if (i < 8) {
      tmpTimes[i] = ts2ms(d);
    }
  });
  return tmpTimes;
};

// calcTimes({
//   down_ccpc_rev: 1536217341,
//   up_ccpc_rev: 1536217341,
//   up_npc_rev: 'xxxxx',
//   down_mbfe_send: 1536217361,
//   down_ccpc_send: 1536217361,
//   up_ccpc_send: 1536217361,
//   up_mbfe_send: 1536217361,
//   down_npc_rev: 1536217361,
// });
export default undefined;
