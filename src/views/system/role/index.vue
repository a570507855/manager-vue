<template>
  <div class="app-container" id="role">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button @click="onAdd" type="primary">新增</el-button>
      </el-form-item>
    </el-form>
    <uc-page-grid :columns="columns" :query="query" :url="'/role/find-page'">
      <template v-slot:power="{row}">
        <div :key="key" v-for="(value,key) in row.power">
          <span
            :key="index"
            v-for="(item,index) in value"
          >{{menuGroup[item].meta.title + (index === value.length - 1 ? '' : '，')}}</span>
        </div>
      </template>
      <template v-slot:op="{row}">
        <el-button @click="onEdit(row)" circle icon="el-icon-edit" size="mini" type="primary"></el-button>
        <el-button @click="onDelete(row)" circle icon="el-icon-delete" size="mini" type="danger"></el-button>
      </template>
    </uc-page-grid>
  </div>
</template>

<script>
import ucPageGrid from '@/script/uc/page-grid'
import menu from '@/script/lib/menu'

export default {
  name: "Role",
  data () {
    return {
      query: {},
      columns: [
        { label: 'ID', prop: 'id' },
        { label: '角色名', prop: 'name' },
        { label: '菜单权限', prop: 'power', minWidth: '500' },
        { label: '人数', prop: 'nums' },
        { label: '操作', prop: 'op', fixed: "right" }
      ],
      menuGroup: menu.group
    }
  },
  methods: {
    onAdd () {
      this.$xiframe
        .load('system/role/add-or-save', { style: { width: '560px', minHeight: '200px' } })
        .then(this.onSearch);
    },
    onDelete (row) {
      if (row.nums)
        return this.$message.warning('该角色下有用户，不可删除!');

      this.$async.waterfall([
        fn => {
          this.$confirm('确定删除该条数据吗？').then(() => fn(), fn);
        },
        fn => {
          this.$xloading.show();
          ajaxPost('/role/remove', { ids: [row.id] }).then(fn, fn);
        }
      ], err => {
        this.$xloading.hide().then(() => {
          if (err && err !== 'cancel')
            this.$message.error(err);

          if (!err) {
            this.$message.success('删除成功!');
            this.onSearch();
          }
        });
      });
    },
    onEdit (row) {
      this.$xiframe
        .load('system/role/add-or-save', { style: { width: '560px', minHeight: '200px' }, row: row })
        .then(this.onSearch);
    },
    onSearch () {
      this.query = {};
    }
  },
  components: {
    ucPageGrid
  },
  mounted () {
    this.onSearch();
  }
}
</script>
<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>