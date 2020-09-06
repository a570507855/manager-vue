<template>
  <div class="app-container" id="menu-add">
    <el-form :model="form" label-width="80px" ref="form">
      <el-form-item label="菜单">
        <el-input v-model="form.meta.title"></el-input>
      </el-form-item>
      <el-form-item label="路径">
        <el-input v-model="form.path"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="form.meta.icon"></el-input>
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
    row: Object,
    type: Number
  },
  data () {
    return {
      form: {
        path: '',
        meta: {
          icon: '',
          title: ''
        },
        value: 0,
        level: 0,
        parent: 0
      }
    }
  },
  methods: {
    onClickBack () {
      this.$emit('onBack');
    },
    submit () {
      switch (this.type) {
        case 0://编辑
          menu.group[this.form.value].path = this.form.path;
          menu.group[this.form.value].meta = { ...this.form.meta };
          break;
        case 1://新增主菜单
          menu.maxValue += 1;
          menu.menus.push({
            ...this.form,
            value: menu.maxValue,
            level: 1,
            children: []
          })
          break;
        case 2://新增子菜单
          menu.maxValue += 1;
          menu.group[this.form.parent].children.push({
            ...this.form,
            value: menu.maxValue,
            level: 2,
            parent: this.form.parent,
            children: []
          })
          break;
      }

      menu.addOrSave().then(res => {
        if (!res.err) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          setTimeout(() => {
            this.$emit('onBack');
          }, 2000)
        }
        else {
          this.$message.error(res.err);
        }
      })
    }
  },
  mounted () {
    this.form = {
      path: this.row.path,
      meta: { ...this.row.meta },
      value: this.row.value,
      level: this.row.level,
      parent: this.row.parent,
      children: []
    }
  }
}
</script>

<style scoped>
.btn-center {
  text-align: center;
}
</style>