<template>
  <div class="app-container">
    <div v-show="!isEdit">
      <el-button @click="onAdd('add',0)" style="margin-bottom:10px;" type="primary">添加主菜单</el-button>
      <el-table
        :border="true"
        :data="async_routes"
        :row-class-name="tableRowClassName"
        row-key="id"
        style="margin-right:30px;"
      >
        <el-table-column align="center" label="菜单" min-width="160" prop="meta.title"></el-table-column>
        <el-table-column align="center" label="路径" min-width="160" prop="path"></el-table-column>
        <el-table-column label="操作" prop="parent" width="280">
          <template slot-scope="scope">
            <el-button
              @click="onAdd('edit',scope.row)"
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
              @click="onAdd('add',scope.row.id)"
              size="mini"
              type="primary"
              v-if="scope.row.parent === 0"
            >添加子菜单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="isEdit">
      <menu-add :parent="parent" :row="row" @onBack="back"></menu-add>
    </div>
  </div>
</template>
<script>
import Layout from '@/layout'
import menu from '@/api/menu'
import menuAdd from './menu-add'
import { mapGetters } from 'vuex'
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
      parent: -1
    }
  },
  computed: {
    ...mapGetters([
      'async_routes'
    ]),
    windowHeight () {
      return window.innerHeight - 100;
    }
  },
  methods: {
    onAdd (type, param) {
      this.isEdit = true;
      if (type === 'add') {
        this.parent = param;
        this.row = {};
      }
      else {
        this.parent = param.parent;
        this.row = param;
      }
    },
    onDelete (row) {
      if (row.children.length)
        return this.$message.warning('存在子菜单，不可删除！！！');

      this.$async.waterfall([
        fn => {
          this.$confirm('确定删除？').then(() => { fn() }, fn);
        },
        fn => {
          menu.delete({ ids: row.id }).then(() => {
            this.$message.success('操作成功');
            fn();
          }, fn);
        }
      ], err => {
        if (err && err !== 'cancel') {
          this.$message.error('操作失败');
          return console.log(err);
        }
      });
    },
    onUp (row) {
      menu.swapMenu(row, 'up');
    },
    onDown (row) {
      menu.swapMenu(row, 'down');
    },
    back () {
      this.isEdit = false;
    },
    tableRowClassName ({ row, index }) {
      if (row.path === '*') {
        return 'el-table-row-hide';
      }
    }
  },
  mounted () {
  }
}
</script>
<style>
.el-table-row-hide {
  display: none;
}
</style>