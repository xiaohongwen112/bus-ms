import axios from 'axios';
import jsCookie from 'js-cookie';
import devServerConfig from '@/../config/devServer';
import { buildUrlencodedData } from '@/helpers/utils';
import CmTip from '@/components/common/CmTip';
import Loading from '@/components/common/Loading';

let token = '';
if (process.env.NODE_ENV === 'development') {
  jsCookie.set('csrftoken', devServerConfig.csrftoken);
  token = devServerConfig.csrftoken;
} else {
  token = jsCookie.get('csrftoken');
}

const cmAxios = axios.create();

const defaultOpts = {
  loading: true,
  endTip: false,
  timeout: 180000, // 3分钟
};

/**
 * http 封装， post自动添加token
 * @param {*} opts
 * loading 是否全屏加载动画
 * endTip 是否全屏提示
 * @param {*} data,
 */
const httpClient = (paramOpts = {}) => {
  const opts = Object.assign({}, defaultOpts, paramOpts);
  cmAxios.interceptors.request.use(
    (config) => {
      if (opts.loading) {
        Loading.open();
      }
      return config;
    },
    (error) => {
      console.log(`request:${error}`);
      return error;
    },
  );

  cmAxios.interceptors.response.use(
    (res) => {
      if (opts.loading) {
        Loading.remove();
      }
      if (opts.endTip && res.data && res.data.msg !== undefined) {
        CmTip.confirm({
          tipTitle: '提示',
          tipContent: res.msg || 'ERROR',
          onClose: () => {},
        });
      }
      /* eslint-disable no-else-return */
      if (res.data.code !== undefined && res.data.code !== 0) {
        CmTip.confirm({
          tipTitle: '提示',
          tipContent: res.data.msg,
          onClose: () => {},
        });
        return Promise.reject(res);
      } else {
        return Promise.resolve(res);
      }
    },
    (error) => {
      if (opts.loading) {
        Loading.remove();
      }
      let errorMsg = '请求错误!';
      if (error.code === 'ECONNABORTED') {
        errorMsg = '请求超时!';
      } else {
        console.log(error, error.status, status.statusText);
        errorMsg = '服务器错误！';
      }
      CmTip.confirm({
        tipTitle: '提示',
        tipContent: errorMsg,
        onClose: () => {},
      });
      return Promise.reject(error);
    },
  );

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

  const http = new Promise((resolve, reject) => {
    // console.log(httpOpts);
    cmAxios(httpOpts).then(
      (res) => {
        resolve(res);
      },
    ).catch(
      (response) => {
        reject(response);
      },
    );
  });
  return http;
};

export default httpClient;

// axios修改引用， http代替axios
// 添加loading、endTip
// 接口后端返回格式化
