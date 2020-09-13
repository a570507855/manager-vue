<template>
  <div id="user-add-or-save">
    <el-form :model="form" label-width="80px" ref="form">
      <el-form-item label="账号昵称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio :label="1" v-model="form.sex">男</el-radio>
        <el-radio :label="2" v-model="form.sex">女</el-radio>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="form.age"></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.account"></el-input>
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

export default {
  name: "UserAddOrSave",
  props: ['row'],
  data () {
    return {
      form: {
        name: '',
        sex: 1,
        age: '',
        account: ''
      }
    }
  },
  methods: {
    onSubmit () {
      this.$xloading.show();
      this.$async.waterfall([
        fn => {
          ajaxPost('/task/dev-add-or-save', this.form).then(fn, fn);
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
    if (this.row)
      this.form = {
        name: this.row.name,
        sex: this.row.sex,
        age: this.row.age,
        account: this.row.account,
        id: this.row.id
      };
  }
}
</script>