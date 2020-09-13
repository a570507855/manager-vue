<template>
  <div class="app-container">
    <div v-show="!isEdit">
      <el-button @click="onAdd(1)" style="margin-bottom:10px;" type="primary">添加主菜单</el-button>
      <el-table :border="true" :data="menus" :default-expand-all="true" row-key="value">
        <el-table-column align="center" label="菜单" min-width="160" prop="meta.title"></el-table-column>
        <el-table-column align="center" label="路径" min-width="160" prop="path"></el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button
              @click="onAdd(0,scope.row)"
              circle
              icon="el-icon-edit"
              size="mini"
              type="primary"
            ></el-button>
            <el-button
              @click="onDelete(scope.row)"
              circle
              icon="el-icon-delete"
              size="mini"
              type="danger"
            ></el-button>
            <el-button @click="onUp(scope.row)" circle size="mini" v-if="!scope.row.isFirst">上</el-button>
            <el-button @click="onDown(scope.row)" circle size="mini" v-if="!scope.row.isLast">下</el-button>
            <el-button
              @click="onAdd(2,scope.row)"
              size="mini"
              type="primary"
              v-if="scope.row.level === 1"
            >添加子菜单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="isEdit">
      <menu-add :row="row" :type="type" @onBack="back"></menu-add>
    </div>
  </div>
</template>
<script>
import menu from '@/api/menu'
import menuAdd from './menu-add'
export default {
  name: 'Menu',
  components: {
    menuAdd
  },
  data () {
    return {
      menuRows: [],
      childMenu: [],
      isEdit: false,
      row: {},
      type: -1,
      menus: menu.menus
    }
  },
  methods: {
    onAdd (type, param) {
      this.isEdit = true;
      this.type = type;
      if (type === 0) {//编辑
        this.row = param;
      }
      else {//新增
        this.row = {
          path: '',
          meta: {
            icon: '',
            title: ''
          },
          value: 0,
          parent: param ? param.value : 0,
          children: []
        };
      }
    },
    onDelete (row) {
      if (row.children.length)
        return this.$message.warning('存在子菜单，不可删除！！！');

      this.$async.waterfall([
        fn => {
          this.$confirm('确定删除？').then(() => fn(), fn);
        },
        fn => {
          this.$xloading.show();
          let children = row.parent ? menu.group[row.parent].children : menu.menus;
          let index = children.findIndex(item => item.value === row.value);
          children.splice(index, 1);
          menu.addOrSave().then(fn, fn);
        }
      ], err => {
        this.$xloading.hide().then(() => {
          if (err && err !== 'cancel')
            return this.$message.error(err);

          if (!err)
            this.$message.success('删除成功!');
        });
      });
    },
    swapMenu (row, count) {
      let children = row.parent ? menu.group[row.parent].children : menu.menus;
      let index = children.findIndex(item => item.value === row.value);
      let temp = { ...children[index] };
      Object.keys(children[index]).forEach(key => {
        children[index][key] = children[index + count][key];
        children[index + count][key] = temp[key];
      });
      this.$xloading.show();
      this.$async.waterfall([
        fn => {
          menu.addOrSave().then(fn, fn);
        }
      ], err => {
        this.$xloading.hide().then(() => {
          if (err)
            return this.$message.error(res.err);

          this.$message.success('操作成功');
        });
      });
    },
    onUp (row) {
      this.swapMenu(row, -1);
    },
    onDown (row) {
      this.swapMenu(row, 1);
    },
    back () {
      this.isEdit = false;
    }
  }
}
</script>
<style>
.el-table-row-hide {
  display: none;
}
</style>