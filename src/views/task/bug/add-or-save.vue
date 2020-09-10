<template>
  <div id="bug-add-or-save">
    <el-form :model="form" label-width="80px" ref="form">
      <el-form-item label="Bug描述">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="解决方法">
        <el-input rows="4" type="textarea" v-model="form.solution"></el-input>
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
  name: "BugAddOrSave",
  props: ['row'],
  data () {
    return {
      form: {
        desc: '',
        solution: ''
      }
    }
  },
  methods: {
    onSubmit () {
      this.$xloading.show();
      this.$async.waterfall([
        fn => {
          ajaxPost('/task/bug-add-or-save', this.form).then(fn, fn);
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
        desc: this.row.desc,
        solution: this.row.solution,
        id: this.row.id
      };
  }
}
</script>