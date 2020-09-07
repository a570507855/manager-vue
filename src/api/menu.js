import ajax from '@/utils/ajax'
import Layout from '@/layout'
import store from '@/store'
import router from '@/router'

function getMenus(menus) {
  return menus.reduce((meno, item) => {
    let copyRoute = {
      ...item
    };
    copyRoute.path = `/${copyRoute.path}`
    copyRoute.component = Layout;
    copyRoute.children = item.children.reduce((cmeno, citem) => {
      let copyRoute = {
        ...citem
      }
      copyRoute.component = resolve => require([`@/views/${item.path}/${citem.path}`], resolve);
      cmeno.push(copyRoute);
      return cmeno;
    }, []);
    meno.push(copyRoute);
    return meno;
  }, []);
}

function setAsyncRoutes(menus) {
  let asyncRoutes = getMenus(menus);
  store.dispatch('permission/generateRoutes', {
    routes: asyncRoutes,
    roles: ['admin']
  });
  router.addRoutes(asyncRoutes);
}

function sortMenu(menus) {
  let len = menus.length;
  for (let i = 0; i < len; ++i) {
    if (len === 1) {
      menus[i].isFirst = true;
      menus[i].isLast = true;
      return;
    }
    if (i === 0) {
      menus[i].isFirst = true;
      menus[i].isLast = false;
    } else if (i === len - 1) {
      menus[i].isFirst = false;
      menus[i].isLast = true;
    } else {
      menus[i].isFirst = false;
      menus[i].isLast = false;
    }
    if (menus[i].children.length)
      sortMenu(menus[i].children);
  }
}

function getGroupAndMaxValue(menus) {
  let maxValue = 0;
  let group = menus.reduce((meno, item) => {
    maxValue = Math.max(maxValue, item.value);
    meno[item.value] = item;
    item.children.forEach(citem => {
      meno[citem.value] = citem;
      maxValue = Math.max(maxValue, citem.value);
    });
    return meno;
  }, {})
  return {
    group,
    maxValue
  };
}

export default {
  menus: [],
  group: {},
  maxValue: 0,
  id: '',
  getMenuTree() {
    if (this.menus.length) {
      setAsyncRoutes(this.menus)
    }
    return new Promise((resolve, reject) => {
      ajax({
        url: '/menu/get',
        method: 'post',
      }).then(res => {
        this.menus = res.data.menus;
        this.id = res.data.id;
        sortMenu(this.menus);
        setAsyncRoutes(this.menus);
        this.group = getGroupAndMaxValue(this.menus).group;
        this.maxValue = getGroupAndMaxValue(this.menus).maxValue;
        resolve();
      }, reject);
    });
  },
  addOrSave() {
    let data = {
      menus: JSON.parse(JSON.stringify(this.menus)),
      id: this.id
    }
    return new Promise((resolve, reject) => {
      ajax({
        url: '/menu/add-or-save',
        method: 'post',
        data
      }).then(() => {
        sortMenu(this.menus);
        setAsyncRoutes(this.menus);
        this.group = getGroupAndMaxValue(this.menus).group;
        this.maxValue = getGroupAndMaxValue(this.menus).maxValue;
        resolve();
      }, reject);
    });
  },
};
