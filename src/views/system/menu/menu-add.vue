<template>
  <div class="app-container" id="menu-add">
    <el-form :model="form" label-width="80px" ref="form">
      <!-- <el-form-item label="活动名称">
        <el-input v-model="form.id"></el-input>
      </el-form-item>-->
      <el-form-item label="路径">
        <el-input v-model="form.path"></el-input>
      </el-form-item>
      <el-form-item label="菜单名">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标">
        <el-input v-model="form.icon"></el-input>
      </el-form-item>
      <el-form-item class="btn-center">
        <el-button @click="submit" type="primary">提交</el-button>
        <el-button @click="onClickBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import menu from '@/api/menu'
import {
  MessageBox,
  Message
} from 'element-ui'
export default {
  props: {
    parent: Number,
    row: Object
  },
  data () {
    return {
      form: {
        path: '',
        icon: '',
        title: '',
      }
    }
  },
  methods: {
    onClickBack () {
      this.$emit('onBack');
    },
    submit () {
      menu.addOrSave({
        ...this.form,
        parent: this.parent
      }).then(res => {
        if (!res.code) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          setTimeout(() => {
            this.$emit('onBack');
          }, 2000)
        }
        else {
          this.$message.error(res.message);
        }
      })


    }
  },
  mounted () {
    if (Object.keys(this.row).length) {
      this.form.path = this.row.path;
      this.form.title = this.row.meta.title;
      this.form.icon = this.row.meta.icon;
      this.form.id = this.row.id;
    }
  }
}
</script>

<style scoped>
.btn-center {
  text-align: center;
}
</style>