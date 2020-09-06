import ajax from '@/utils/ajax'

export default {
  isLogin(data) {
    return new Promise((resolve, reject) => {
      ajax({
        url: '/login/login',
        method: 'post',
        data
      }).then(res => {
        resolve(res.data);
      }, reject);
    });
  },
};
