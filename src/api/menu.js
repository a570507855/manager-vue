import request from '@/utils/request'
import Layout from '@/layout'
import store from '@/store'

let group = {};

function getGroup(routes) {
  routes.forEach((item) => {
    if (!group[item.parent])
      group[item.parent] = [];

    group[item.parent].push({
      id: item.id,
      path: item.parent === 0 ? `/${item.path}` : item.path,
      name: item.path.replace(/^[a-z]/g, (l) => l.toUpperCase()),
      meta: {
        title: item.title,
        icon: item.icon,
      },
      children: [],
      sort: item.sort,
      parent: item.parent
    });
  });
};

function sortGroup() {
  Object.keys(group).forEach(key => {
    group[key].sort((a, b) => {
      return a.sort - b.sort;
    });
    let len = group[key].length;
    let last = key === '0' && len !== 1 ? (len - 1) : len;
    for (let i = 0; i < last; ++i) {
      if (last === 1) {
        group[key][i].isFirst = true;
        group[key][i].isLast = true;
        return;
      }
      if (i === 0) {
        group[key][i].isFirst = true;
        group[key][i].isLast = false;
      } else if (i === last - 1) {
        group[key][i].isFirst = false;
        group[key][i].isLast = true;
      } else {
        group[key][i].isFirst = false;
        group[key][i].isLast = false;
      }
    };
  });
};

function getMenusFromGroup() {
  let menus = group[0];
  menus.forEach((item) => {
    item.children = group[item.id] || [];
    item.component = Layout;
    item.children.forEach((citem) => {
      citem.children = group[citem.id] || [];
      citem.component = resolve => require([`@/views${item.path}/${citem.path}`], resolve);
    });
  });
  return menus;
}
export default {
  getMenuTree() {
    return new Promise((resolve, reject) => {
      request({
        url: 'http://localhost:8888/menu/get',
        method: 'get',
      }).then(res => {
        getGroup(res.data);
        sortGroup();
        let menus = getMenusFromGroup();
        menus.push({
          path: '*',
          redirect: '/404',
          sort: 100,
          hidden: true
        });
        resolve(menus);
      }, reject);
    });
  },
  addOrSave(data) {
    return new Promise((resolve, reject) => {
      if (!data.sort) {
        let maxSort = 0;
        if (!group[data.parent])
          group[data.parent] = [];


        group[data.parent].forEach(item => {
          if (!item.sort || item.sort === 100)
            return;

          maxSort = Math.max(maxSort, item.sort);
        });
        data.sort = maxSort + 1;
      }
      data.path = data.path.replace(/^\//, '');
      request({
        url: 'http://localhost:8888/menu/addOrSave',
        method: 'post',
        data
      }).then(res => {
        let id = res.id;
        let newData = {
          id: id,
          path: data.parent === 0 ? `/${data.path}` : data.path,
          name: data.path.replace(/^[a-z]/g, (l) => l.toUpperCase()),
          meta: {
            title: data.title,
            icon: data.icon,
          },
          children: [],
          sort: data.sort,
          parent: data.parent
        }
        if (id) { //新增
          newData.component = data.parent ? resolve => require([`@/views${data.path}/${data.path}`], resolve) : Layout;
          group[data.parent].push(newData);
        } else { //更新
          group[data.parent].forEach(item => {
            if (item.id === data.id) {
              item.path = newData.path;
              item.meta.icon = data.icon;
              item.meta.title = data.title;
              return;
            }
          });
        }
        sortGroup();
        let asyncRoutes = getMenusFromGroup();
        store.dispatch('permission/generateRoutes', {
          routes: asyncRoutes,
          roles: ['admin']
        });
        resolve(res);
      }, reject);
    });
  },
  delete(data) {
    return new Promise((resolve, reject) => {
      request({
        url: 'http://localhost:8888/menu/delete',
        method: 'post',
        data
      }).then(res => {
        Object.keys(group).forEach(key => {
          let index = group[key].findIndex(item => item.id === data.ids);
          if (index !== -1) {
            return group[key].splice(index, 1);
          }
        });
        let asyncRoutes = getMenusFromGroup();
        store.dispatch('permission/generateRoutes', {
          routes: asyncRoutes,
          roles: ['admin']
        });
        resolve(res);
      }, reject);
    });
  },
  swapMenu(row, type) {
    let index = group[row.parent].findIndex(item => item.id === row.id);
    let swapRow = type === 'up' ? group[row.parent][index - 1] : group[row.parent][index + 1];
    return new Promise((resolve, reject) => {
      request({
        url: 'http://localhost:8888/menu/swap',
        method: 'post',
        data: {
          id: row.id,
          swapId: swapRow.id
        }
      }).then(res => {
        let tempSort = group[row.parent][index].sort;
        group[row.parent][index].sort = swapRow.sort;
        swapRow.sort = tempSort;
        sortGroup();
        let asyncRoutes = getMenusFromGroup();
        store.dispatch('permission/generateRoutes', {
          routes: asyncRoutes,
          roles: ['admin']
        });
        resolve(res);
      }, reject);
    });
  }
};
