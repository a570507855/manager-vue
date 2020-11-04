import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import {
  getToken,
  removeToken
} from '@/script/lib/token'
import defaultSettings from '@/settings'
import router from '@/router'

//http://mantest.wm1440.com
const ajax = axios.create({
  baseURL: defaultSettings[process.env.NODE_ENV].baseURL,
  timeout: 10000
});

//请求拦截器
ajax.interceptors.request.use(
  config => {
    if (getToken()) {
      config.data = {
        ...config.data,
        token: getToken()
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//响应拦截器
ajax.interceptors.response.use(
  async (response) => {
      const res = response.data;
      if (res.err !== 0) {
        Message({
          message: res.err || 'Error',
          type: 'error',
          duration: 5 * 1000
        });

        if (res.err === 301) {
          try {
            await MessageBox.confirm('账号认证失效，是否重新登录？', '认证失效', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            });
            removeToken();
            router.push({
              path: '/login'
            });
          }
          catch (err) {
            if (err !== 'cancel') throw err;
          }
          
        }
        return Promise.reject(new Error(res.errmsg || 'Error'));
      } else {
        return res.data;
      }
    },
    error => {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject(error);
    }
);

export const Upload = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': `multipart/form-data;`,
    'X-Requested-With': 'XMLHttpRequest;'
  }
});

function arrToFormData(arr) {
  let data = [];
  arr.forEach((item, index) => {
    if (item.constructor === Array) {
      arrToFormData(item).forEach(cItem => {
        data.push({
          key: `[${index}]${cItem.key}`,
          value: cItem.value
        });
      });
    } else if (item.constructor === Object) {
      objToFormData(item).forEach(cItem => {
        data.push({
          key: `[${index}]${cItem.key}`,
          value: cItem.value
        });
      });
    } else {
      data.push({
        key: `[${index}]`,
        value: item
      });
    }
  });
  return data;
}

function objToFormData(obj) {
  let data = [];
  Object.keys(obj).forEach(key => {
    if (obj[key].constructor === Array) {
      arrToFormData(obj[key]).forEach(item => {
        data.push({
          key: `[${key}]${item.key}`,
          value: item.value
        });
      });
    } else if (obj[key].constructor === Object) {
      objToFormData(obj[key]).forEach(item => {
        data.push({
          key: `[${key}]${item.key}`,
          value: item.value
        });
      });
    } else {
      data.push({
        key: `[${key}]`,
        value: obj[key]
      });
    }
  });
  return data;
}

//Upload请求拦截器
Upload.interceptors.request.use(
  config => {
    if (getToken()) {
      let formData = new FormData();
      Object.keys(config.data).forEach(key => {
        let value = config.data[key];
        if (value.constructor === Array) {
          arrToFormData(value).forEach(r => {
            formData.append(`${key}${r.key}`, r.value);
          });
        } else if (value.constructor === Object) {
          objToFormData(value).forEach(r => {
            formData.append(`${key}${r.key}`, r.value);
          });
        } else {
          formData.append(key, value);
        }
      });
      formData.append('token', getToken());
      config.data = formData;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const ajaxPost = async (url, data) => {
  return ajax({
    url,
    method: 'post',
    data
  });
};

export default ajax