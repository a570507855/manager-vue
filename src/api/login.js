import ajax from '@/utils/request'
import store from '@/store'

export default {
  isLogin(data) {
    return new Promise((resolve, reject) => {
      ajax({
        url: 'http://localhost:8888/login',
        method: 'post',
        data
      }).then(res => {
        resolve(res);
      }, reject);
    });
  },
};
