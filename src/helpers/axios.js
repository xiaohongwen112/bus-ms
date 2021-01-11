import axios from 'axios';
import jsCookie from 'js-cookie';
import devServerConfig from '@/../config/devServer';
import { buildUrlencodedData } from '@/helpers/utils';
import CmTip from '@/components/basic/CmTip';
import Loading from '@/components/common/Loading';

let token = '';
if (process.env.NODE_ENV === 'development') {
  jsCookie.set('csrftoken', devServerConfig.csrftoken);
  token = devServerConfig.csrftoken;
} else {
  token = jsCookie.get('csrftoken');
}

const defaultOpts = {
  loading: false,
  endTip: false, // 用于保存， 成功或失败都有提示
  errorTip: true, // 仅用于get类接口， 接口错误进行提示, 仅在code !== 0 时报错， 优先级不如endTip高
  timeout: 180000, // 3分钟
  reload: false,
};

/**
 * http 封装， post自动添加token
 * @param {*} opts
 * 支持默认全屏加载动画loading
 * 支持设置全屏提示endTip
 * @param {*} data,
 */
const httpClient = (paramOpts = {}) => {
  const opts = Object.assign({}, defaultOpts, paramOpts);
  const publicData = {
    csrfmiddlewaretoken: token,
  };
  const httpOpts = {
    url: opts.url,
    method: opts.method,
    withCredentials: true,
    params: Object.assign({}, publicData, opts.data || {}),
    data: Object.assign({}, publicData, opts.data || {}),
    transformRequest: [buildUrlencodedData],
    timeout: opts.timeout,
  };
  if (opts.method === 'get') {
    delete httpOpts.data;
  } else {
    delete httpOpts.params;
  }
  function endLoading() {
    if (opts.loading) {
      Loading.remove();
    }
  }
  /**
   * 接口提示
   * @param {*} data
   */
  function showEndTip(data) {
    // 接口错误或者需要endtip
    if ((opts.errorTip && Object.prototype.hasOwnProperty.call(data, 'code') && data.code !== 0 && data.code !== -1) || opts.endTip) {
      // 接口信息
      CmTip.confirm({
        tipTitle: '提示',
        tipContent: data.msg === '' ? '服务器错误！' : data.msg,
        onClose: () => {
          if (opts.endTip && opts.reload && data.code === 0) {
            window.location.reload(true);
          }
        },
      });
    }
  }

  function showExcepTip(error) {
    if (opts.errorTip) {
      let errorMsg = '服务器错误！';
      if (error.code === 'ECONNABORTED') {
        errorMsg = '请求超时!';
      }
      CmTip.confirm({
        tipTitle: '提示',
        tipContent: errorMsg,
        onClose: () => {},
      });
    }
  }
  const http = new Promise((resolve, reject) => {
    if (opts.loading) {
      Loading.open();
    }
    axios(httpOpts).then(
      (res) => {
        endLoading(res);
        resolve(res);
        showEndTip(res.data);
      },
    ).catch(
      (error) => {
        console.log(error);
        endLoading(error);
        showExcepTip(error);
        reject(error);
      },
    );
  });
  return http;
};

export default httpClient;
