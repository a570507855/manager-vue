import ajax from '@/utils/ajax'

export default {
  findPage(data) {
    return new Promise((resolve, reject) => {
      ajax({
        url: '/task/dev-find-page',
        method: 'post',
        data
      }).then(res => {
        resolve(res.data);
      }, reject);
    });
  },
};
