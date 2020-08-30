import request from '@/utils/request'
import Layout from '@/layout'
import store from '@/store'

let group = {};
export default {
  getMenuTree() {
    return new Promise((resolve, reject) => {
      let menus = [];
      request({
        url: 'http://localhost:8888/menu/get',
        method: 'get',
      }).then(res => {

        res.data.forEach((item) => {
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
            order: item.order,
            parent: item.parent
          });
        });

        Object.keys(group).forEach(key => {
          group[key].sort((a, b) => {
            return a.order - b.order;
          });
        });
        menus = group[0];
        menus.forEach((item) => {
          item.children = group[item.id] || [];
          item.component = Layout;
          item.children.forEach((citem) => {
            citem.children = group[citem.id] || [];
            citem.component = resolve => require([`@/views${item.path}/${citem.path}`], resolve);
          });
        });
        menus.push({
          path: '*',
          redirect: '/404',
          hidden: true
        })
        resolve(menus);
      }, reject)
    })
  },
  addOrSave(data) {
    return new Promise((resolve, reject) => {
      request({
        url: 'http://localhost:8888/menu/addOrSave',
        method: 'post',
        data
      }).then(res => {
        let id = res.id;
        let newData = {
          id: id,
          path: data.path,
          name: data.path.replace(/^[a-z]/g, (l) => l.toUpperCase()),
          meta: {
            title: data.title,
            icon: data.icon,
          },
          children: [],
          order: data.order,
          parent: data.parent
        }
        let asyncRoutes = store.getters.async_routes;
        if (id) {
          if (data.parent === 0) {
            newData.component = Layout;
            asyncRoutes.push(newData);
          } else {
            newData.component = resolve => require([`@/views${data.path}/${data.path}`], resolve);
            asyncRoutes.forEach(item => {
              if (item.id === data.parent) {
                item.children.push(newData);
              }
            })
          }
          store.dispatch('permission/generateRoutes', {
            routes: asyncRoutes,
            roles: ['admin']
          });
        } else {
          asyncRoutes.forEach(item => {
            if (!item.id)
              return;

            if (item.id === data.id) {
              item.path = data.path;
              item.meta.icon = data.icon;
              item.meta.title = data.title;
            } else {
              item.children.forEach(citem => {
                if (citem.id === data.id) {
                  citem.path = data.path;
                  citem.meta.icon = data.icon;
                  citem.meta.title = data.title;
                }
              })
            }
          })
          store.dispatch('permission/generateRoutes', {
            routes: asyncRoutes,
            roles: ['admin']
          });
        }
        resolve(res);
      }, reject)
    })
  },
  delete(data) {
    return new Promise((resolve, reject) => {
      request({
        url: 'http://localhost:8888/menu/delete',
        method: 'post',
        data
      }).then(res => {
        let idArr = data.ids.toString().split(',');
        let asyncRoutes = store.getters.async_routes.filter(item => {
          if (!item.children) return true;
          item.children = item.children.filter(citem => {
            return !idArr.includes(citem.id.toString());
          })
          return !idArr.includes(item.id.toString());
        })
        store.dispatch('permission/generateRoutes', {
          routes: asyncRoutes,
          roles: ['admin']
        })
        resolve(res);
      }, reject)
    })
  }
};
