import Tools from '@/utils/tools';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { extend } from 'umi-request';
import { inValidateToken } from './login';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const getInvalidateToken = async () => {
  const res = await inValidateToken();
  return res;
};

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  // console.log('errorHandler', error);
  const { response = {} } = error;
  const errortext = response ? (codeMessage[response?.status] || response?.statusText) : '';
  if (response) {
    const { status = '', url = '' } = response;

    if (status === 400) {
      if (error.data.error === 'invalid_grant') {
        notification.error({
          message: '用户名或密码错误。',
        });
      } else {
        notification.error({
          message: errortext,
        });
      }
      return;
    }
  
    if (status === 401) {
      notification.error({
        message: '未登录或登录已过期，请重新登录。',
      });
      history.push('/user/login');
      getInvalidateToken();
      return;
    }
    if (!error.data.message) {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errortext,
      });
    }
    return error.data;
  }
  return 'ERROR'
};

const obj = {
  credentials: 'include',
};
if (process.env.UMI_ENV === 'local') {
  obj.errorHandler = errorHandler;
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({ ...obj });

request.interceptors.request.use(
  (url, options = {}) => {
    let fetchUrl = url;
    if (localStorage.getItem('token')) {
      options.headers.Authorization = Tools.getToken();
    }

    return {
      url: fetchUrl,
      options: { ...options, interceptors: true, errorHandler },
    };
  },
  { global: false },
);

// 捕捉成功返回
request.interceptors.response.use(async (response, other) => {
  if (other?.responseType === 'blob') {
    return response;
  }
  const data = await response.clone().json();
  // 请求不成功时，直接退出
  if (data?.status === 401 || data?.status === 403) {
    // 退出登录
    localStorage.clear();
  }
  return response;
});

export default request;
