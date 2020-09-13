<template>
  <div id="role-add-or-save">
    <el-form :model="form" label-width="80px" ref="form">
      <el-form-item label="角色名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-tree
          :data="menus"
          :default-checked-keys="[...defaultCheckedKeys]"
          :default-expand-all="true"
          :props="defaultProps"
          node-key="value"
          ref="powerTree"
          show-checkbox
        ></el-tree>
      </el-form-item>
      <div style="text-align:center">
        <el-button @click="onSubmit" type="primary">完成</el-button>
        <el-button @click="onCancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { ajaxPost } from '@/utils/ajax'
import menu from '@/api/menu'

export default {
  name: "RoleAddOrSave",
  props: ['row'],
  data () {
    return {
      form: {
        name: '',
        power: {},
      },
      menus: menu.menus,
      defaultProps: {
        label: (data, node) => {
          return data.meta.title;
        }
      },
      defaultCheckedKeys: []
    }
  },
  methods: {
    onSubmit () {
      let checkedNodes = this.$refs.powerTree.getCheckedNodes(false, true);
      this.form.power = checkedNodes.reduce((meno, item) => {
        let parent = item.parent ? item.parent : item.value;
        if (!meno[parent])
          meno[parent] = [];

        meno[parent].push(item.value);
        return meno;
      }, {});
      this.$xloading.show();
      this.$async.waterfall([
        fn => {
          ajaxPost('/role/add-or-save', this.form).then(fn, fn);
        }
      ], err => {
        this.$xloading.hide().then(() => {
          if (err)
            return this.$message.error(err);

          this.$message.success('操作成功');
          this.$xiframe.hide(1);
        });
      });
    },
    onCancel () {
      this.$xiframe.hide(0);
    }
  },
  mounted () {
    if (this.row) {
      this.form = {
        name: this.row.name,
        power: this.row.power,
        id: this.row.id
      };
      Object.keys(this.row.power).forEach(key => {
        this.defaultCheckedKeys.push(...this.row.power[key]);
      });
    }
  }
}
</script>