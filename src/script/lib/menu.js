import Layout from '@/components/Layout'
import router from '@/router'
import post from '@/script/lib/post-sdk'
import store from '@/store'

let value = 0;

function getSaveMenu(menus) {
  return menus.reduce((meno, item) => {
    let menu = {
      name: item.name
    };
    if (item.route)
      menu.route = item.route

    if (item.children && item.children.length)
      menu.children = getSaveMenu(item.children);

    meno.push(menu);
    return meno;
  }, []);
};

function getGroupAndMaxValue(menus, value = 0) {
  return menus.reduce((meno, item) => {
    meno.maxValue = Math.max(meno.maxValue, item.value);
    meno.group[item.value] = item;
    if (item.children && item.children.length)
      meno.group = Object.assign({}, meno.group, getGroupAndMaxValue(item.children).group);

    return meno;
  }, {
    maxValue: value,
    group: {}
  });
};

function getMenuChildren(child) {
  return child.reduce((meno, item) => {
    let urlArr = item.route.split('?');
    let url = urlArr[0];
    let query = urlArr.length !== 1 ? urlArr[1] : '';
    let childMenu = {
      path: url,
      meta: {
        title: item.name,
        icon: ''
      },
      query: `?${query}`
    };
    if (item.route)
      childMenu.component = process.env.NODE_ENV === 'development' ? resolve => require([`@/views${url}`], resolve) : () => import(`@/views${url}`);

    if (item.children && item.children.length)
      childMenu.children = getMenuChildren(item.children);

    meno.push(childMenu);
    return meno;
  }, []);
};

function getMenus(menus) {
  if (!menus || !menus.length)
    return [];

  return menus.reduce((meno, item) => {
    let copyRoute = {
      path: `/${item.name}`,
      component: Layout,
      meta: {
        title: item.name,
        icon: ''
      }
    };
    if (item.children && item.children.length)
      copyRoute.children = getMenuChildren(item.children);

    meno.push(copyRoute);
    return meno;
  }, []);
};

function setAsyncRoutes(menus) {
  let asyncRoutes = getMenus(menus);
  store.dispatch('permission/generateRoutes', {
    routes: asyncRoutes,
    roles: ['admin']
  });
  router.addRoutes(asyncRoutes);
};

function sortMenu(menus, parent, level) {
  if (!parent)
    value = 0;

  let len = menus.length;
  for (let i = 0; i < len; ++i) {
    menus[i].parent = parent;
    menus[i].level = level;
    menus[i].value = ++value;

    if (!menus[i].route)
      menus[i].route = '';

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
    if (len === 1) {
      menus[i].isFirst = true;
      menus[i].isLast = true;
    }
    if (menus[i].children && menus[i].children.length) {
      sortMenu(menus[i].children, menus[i].value, menus[i].level + 1);
    }
  }
};

export default {
  menus: [],
  group: {},
  maxValue: 0,
  async addOrSave() {
    await get('/menu/add-or-save', {
      owner,
      items: getSaveMenu(this.menus)
    });
    sortMenu(this.menus, 0, 1);
    this.group = getGroupAndMaxValue(this.menus).group;
    this.maxValue = getGroupAndMaxValue(this.menus).maxValue;
  },
  async getMenuTree() {
    let res = await post('/menu/get');
    this.menus = res.items;
    sortMenu(this.menus, 0, 1);
    this.group = getGroupAndMaxValue(this.menus).group;
    this.maxValue = getGroupAndMaxValue(this.menus).maxValue;
    setAsyncRoutes(this.menus);
  },
  setLv2Menus(lv1Name) {
    let lv2Menus = this.menus.filter(item => item.name === lv1Name);
    if (lv2Menus && lv2Menus.length)
      setAsyncRoutes(lv2Menus[0].children);
  }
};