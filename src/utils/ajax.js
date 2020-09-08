import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getSessionId,
  removeSessionId
} from '@/sessionStorage/sessionId'
import querystring from 'querystring'

const ajax = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // request timeout
})

//请求拦截器
ajax.interceptors.request.use(
  config => {
    if (getSessionId()) {
      config.data = {
        ...config.data,
        sessionId: getSessionId()
      }
    }
    // 对 post 请求数据进行处理
    if (config.method === 'post') {
      // //将post中的数据转化格式，避免客户端再发送一次options请求
      // config.data = querystring.stringify(config.data);
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

//响应拦截器
ajax.interceptors.response.use(
  response => {
    const res = response.data
    if (res.err !== 0) {
      Message({
        message: res.err || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      if (res.err === 504) {
        MessageBox.confirm('账号认证失效，是否重新登录？', '认证失效', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeSessionId();
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res;
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export const ajaxPost = (url, data) => {
  return new Promise((resolve, reject) => {
    ajax({
      url,
      method: 'post',
      data
    }).then(res => resolve(res.data), reject);
  })
}

export default ajax
