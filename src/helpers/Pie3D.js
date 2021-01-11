/**
 * 计算椭圆点到圆心的距离
 * @param angle
 * @param rx
 * @param ry
 * @returns {number}
 */
function getOffsetX(angle, rx, ry) {
  const k = Math.tan(angle);
  const rxP = rx * rx;
  const ryP = ry * ry;
  return Math.sqrt((rxP * ryP) / (rxP * k * k + ryP) * (1 + k * k));
}


/**
 * 获取开始角度和结束角度的椭圆点x\y值
 * @param startAngle
 * @param endAngle
 * @param rx
 * @param ry
 * @returns {{sx: number, sy: number, ex: number, ey: number}}
 */
/* eslint-disable no-param-reassign */
function getXY(startAngle, endAngle, rx, ry) {
  endAngle = endAngle > 2 * Math.PI ? 2 * Math.PI : endAngle;
  const lineS = getOffsetX(startAngle, rx, ry);
  const lineE = getOffsetX(endAngle, rx, ry);
  return {
    sx: lineS * Math.cos(startAngle),
    sy: lineS * Math.sin(startAngle),
    ex: lineE * Math.cos(endAngle),
    ey: lineE * Math.sin(endAngle),
  };
}

export const pieInner = (d, rx, ry, h, ir) => {
  const startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
  const endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);
  const sx = ir * rx * Math.cos(startAngle);
  const sy = ir * ry * Math.sin(startAngle);
  const ex = ir * rx * Math.cos(endAngle);
  const ey = ir * ry * Math.sin(endAngle);
  const ret = [];
  ret.push('M', sx, sy, 'A', ir * rx, ir * ry, '0 0 1', ex, ey, 'L', ex, h + ey, 'A', ir * rx, ir * ry, '0 0 0', sx, h + sy, 'z');
  return ret.join(' ');
};

export const pieBottom = (d, rx, ry, ir, h) => {
  if (d.endAngle - d.startAngle === 0) return 'M 0 0';
  const se = getXY(d.startAngle, d.endAngle, rx, ry);
//        A RX,RY,XROTATION,FLAG1,FLAG2,X,Y
//
//        RX,RY指所在椭圆的半轴大小
//        XROTATION指椭圆的X轴与水平方向顺时针方向夹角，可以想像成一个水平的椭圆绕中心点顺时针旋转XROTATION的角度。
//        FLAG1只有两个值，1表示大角度弧线，0为小角度弧线。
//        FLAG2只有两个值，确定从起点至终点的方向，1为顺时针，0为逆时针
//        X,Y为终点坐标
  const ret = [];
  ret.push('M', se.sx, h + se.sy, 'A', rx, ry, '0', (d.endAngle - d.startAngle > Math.PI ? 1 : 0), '1', se.ex, h + se.ey, 'L', ir * se.ex, ir * se.ey + h);
  ret.push('A', ir * rx, ir * ry, '0', (d.endAngle - d.startAngle > Math.PI ? 1 : 0), '0', ir * se.sx, ir * se.sy + h, 'z');
  return ret.join(' ');
};

export const pieSide = (d, rx, ry, h) => {
  if (d.endAngle - d.startAngle === 0) return 'M 0 0';
  const se = getXY(d.startAngle, d.endAngle, rx, ry);
  const ret = [];
  ret.push('M', se.ex, se.ey + h, 'L 0 ', h, 'L 0 0', ' L', se.ex, se.ey, ' z');
  ret.push('M', se.sx, se.sy + h, 'L 0 ', h, 'L 0 0 ', ' L', se.sx, se.sy, ' z');
  return ret.join(' ');
};

export const pieOuter = (d, rx, ry, h) => {
  const startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
  const endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);
  const se = getXY(startAngle, endAngle, rx, ry);
  const ret = [];
  ret.push('M', se.sx, h + se.sy, 'A', rx, ry, '0 0 1', se.ex, h + se.ey, 'L', se.ex, se.ey, 'A', rx, ry, '0 0 0', se.sx, se.sy, 'z');
  return ret.join(' ');
};

export const pieTop = (d, rx, ry, ir) => {
  if (d.endAngle - d.startAngle === 0) return 'M 0 0';
  const se = getXY(d.startAngle, d.endAngle, rx, ry);
  const ret = [];
  ret.push('M', se.sx, se.sy, 'A', rx, ry, '0', (d.endAngle - d.startAngle > Math.PI ? 1 : 0), '1', se.ex, se.ey, 'L', ir * se.ex, ir * se.ey);
  ret.push('A', ir * rx, ir * ry, '0', (d.endAngle - d.startAngle > Math.PI ? 1 : 0), '0', ir * se.sx, ir * se.sy, 'z');
  return ret.join(' ');
};

export const lineX = (d, rx, ry, rotate) => {
  const angle = 0.5 * (d.startAngle + d.endAngle) + rotate / 180 * Math.PI;   // 减去偏移
  return getOffsetX(angle, rx, ry) * Math.cos(angle);
};

export const lineY = (d, rx, ry, rotate) => {
  const angle = 0.5 * (d.startAngle + d.endAngle) + rotate / 180 * Math.PI;
  return getOffsetX(angle, rx, ry) * Math.sin(angle);
};

export const labelsTextTran = (d, rx, ry, h, rotate, pieX, multi, extendLen) => {
  const x = lineX(d, rx, ry, rotate);
  const y = lineY(d, rx, ry, rotate);
  const bbox = {};
  bbox.width = 30;
  const tmpX = pieX - multi * Math.abs(x) - bbox.width;
  // const tmp = tmpX < 0 ? 0 : (tmpX < extendLen ? tmpX : extendLen);
  let tmp = 0;
  if (tmpX >= 0) {
    tmp = tmpX < extendLen ? tmpX : extendLen;
  }
  const mulY = multi * y > ry ? multi * y + h : multi * y;
  return [x < 0 ? (multi * x - tmp) : (multi * x + tmp), mulY];
};

export const piePolyline = (d, rx, ry, h, rotate, pieX, multi, extendLen) => {
  const x = lineX(d, rx, ry, rotate);
  const y = lineY(d, rx, ry, rotate);
    // var bbox = text[0][0].getBBox();
  const bbox = {};
  bbox.width = 30;
  const tmpX = pieX - multi * Math.abs(x) - bbox.width;
  // const tmp = tmpX < 0 ? 0 : (tmpX < extendLen ? tmpX : extendLen);
  let tmp = 0;
  if (tmpX >= 0) {
    tmp = tmpX < extendLen ? tmpX : extendLen;
  }
  const mulY = multi * y > ry ? multi * y + h : multi * y;
  return [[0.6 * x, 0.6 * y], [multi * x, mulY], [x < 0 ? (multi * x - tmp) : (multi * x + tmp), mulY]];
};
