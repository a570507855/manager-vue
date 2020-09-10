<template>
  <div id="dev-add-or-save">
    <el-form :model="form" label-width="80px" ref="form">
      <el-form-item label="任务名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="任务描述">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="功能需求">
        <el-input rows="4" type="textarea" v-model="form.demand"></el-input>
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
  name: "DevAddOrSave",
  props: ['row'],
  data () {
    return {
      form: {
        name: '',
        desc: '',
        demand: ''
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
          this.$emit('refresh');
        });
      })
    },
    onCancel () {
      this.$xiframe.hide(0);
    }
  },
  mounted () {
    if (this.row)
      this.form = {
        name: this.row.name,
        desc: this.row.desc,
        demand: this.row.demand,
        id: this.row.id
      };
  }
}
</script>