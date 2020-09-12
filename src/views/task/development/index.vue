<template>
  <div class="app-container" id="development">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input placeholder="任务名称" prefix-icon="el-icon-search" v-model="queryName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="状态" v-model="queryState">
          <el-option label="全部" value></el-option>
          <el-option
            :key="index"
            :label="item.text"
            :style="{color:item.color}"
            :value="+key"
            v-for="(item,key,index) in states"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onAdd" type="primary">新增</el-button>
      </el-form-item>
    </el-form>
    <x-table :columns="columns" :query="query" :url="'/task/dev-find-page'">
      <template v-slot:state="{row}">
        <div :style="{color:states[row.state].color}">
          {{ states[row.state].text }}
          <el-dropdown @command="onChangeState">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{row:row,state:1}">待处理</el-dropdown-item>
              <el-dropdown-item :command="{row:row,state:2}">处理中</el-dropdown-item>
              <el-dropdown-item :command="{row:row,state:3}">已完成</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
      <template v-slot:op="{row}">
        <el-button @click="onEdit(row)" circle icon="el-icon-edit" size="mini" type="primary"></el-button>
        <el-button @click="onDelete(row)" circle icon="el-icon-delete" size="mini" type="danger"></el-button>
      </template>
    </x-table>
  </div>
</template>

<script>
import { ajaxPost } from '@/utils/ajax'
import XTable from '@/components/common/table'

export default {
  name: "Development",
  data () {
    return {
      query: {},
      queryName: '',
      queryState: '',
      states: {
        1: { text: '待处理', color: '#F56C6C' },
        2: { text: '处理中', color: '#E6A23C' },
        3: { text: '已完成', color: '#67C23A' },
      },
      columns: [
        { label: 'ID', prop: 'id' },
        { label: '任务', prop: 'name' },
        { label: '描述', prop: 'desc' },
        { label: '需求', prop: 'demand' },
        { label: '状态', prop: 'state' },
        { label: '开始时间', prop: 'createOn', timeFormat: true, sort: true },
        { label: '完成时间', prop: 'completeOn', timeFormat: true, sort: true },
        { label: '操作', prop: 'op', fixed: "right" }
      ]
    }
  },
  methods: {
    onAdd () {
      this.$xiframe
        .load('task/development/add-or-save', { style: { width: '560px', minHeight: '200px' } })
        .then(this.onSearch);
    },
    onChangeState (payload) {
      payload.row.state = payload.state;
      ajaxPost('/task/dev-add-or-save', payload.row).then(() => {
        if (payload.state === 3)
          payload.row.completeOn = Math.floor(new Date().getTime() / 1000);
        else
          payload.row.completeOn = 0;
      });
    },
    onDelete (row) {
      if (row.state === 3)
        return this.$message.warning('已完成任务不可删除!');

      this.$async.waterfall([
        fn => {
          this.$confirm('确定删除该条数据吗？').then(() => fn(), fn);
        },
        fn => {
          this.$xloading.show();
          ajaxPost('/task/dev-remove', { ids: [row.id] }).then(fn, fn);
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
        .load('task/development/add-or-save', { style: { width: '560px', minHeight: '200px' }, row: row })
        .then(this.onSearch);
    },
    onSearch () {
      let query = {};
      if (this.queryName)
        query.name = this.queryName

      if (this.queryState)
        query.state = this.queryState

      this.query = query;
    }
  },
  mounted () {
    this.onSearch();
  },
  components: {
    XTable
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