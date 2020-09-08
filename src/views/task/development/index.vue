<template>
  <div class="app-container" id="development">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input placeholder="任务名称" prefix-icon="el-icon-search" v-model="queryTaskName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="状态" v-model="queryStatus">
          <el-option label="全部" value></el-option>
          <el-option :value="1" label="暂未处理"></el-option>
          <el-option :value="2" label="正在处理"></el-option>
          <el-option :value="3" label="任务完成"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onAdd" type="primary">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :border="true" :data="devList">
      <el-table-column align="center" label="ID" min-width="160" prop="id"></el-table-column>
      <el-table-column align="center" label="任务" min-width="160" prop="taskName"></el-table-column>
      <el-table-column align="center" label="描述" min-width="160" prop="desc"></el-table-column>
      <el-table-column align="center" label="需求" min-width="160" prop="demand"></el-table-column>
      <el-table-column align="center" label="状态" min-width="160" prop="status">
        <template slot-scope="scope">
          <div
            :style="{color:statusArr[scope.row.status].color}"
          >{{ statusArr[scope.row.status].text }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间" min-width="160" prop="createOn">
        <template slot-scope="scope">{{scope.row.createOn | dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column align="center" label="完成时间" min-width="160" prop="completeOn">
        <template slot-scope="scope">{{scope.row.completeOn | dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            @click="onEdit(scope.row)"
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
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import devApi from '@/api/task/development'
import { ajaxPost } from '@/utils/ajax'

export default {
  name: "Development",
  data () {
    return {
      devList: [],
      queryTaskName: '',
      queryStatus: '',
      statusArr: {
        1: { text: '暂未处理', color: '#F56C6C' },
        2: { text: '正在处理', color: '#E6A23C' },
        3: { text: '任务完成', color: '#67C23A' },
      }
    }
  },
  methods: {
    onAdd () {
      this.$xiframe
        .load('task/development/add-or-save', { style: { width: '560px', minHeight: '200px' } })
        .then(this.onSearch);
    },
    onEdit (row) {
      this.$xiframe
        .load('task/development/add-or-save', { style: { width: '560px', minHeight: '200px' }, row: row })
        .then(this.onSearch);
    },
    onDelete (row) {
      if (row.status === 3)
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
        })
      })

    },
    onSearch () {
      let query = {};
      this.queryTaskName ? query.taskName = this.queryTaskName : '';
      this.queryStatus ? query.status = this.queryStatus : '';
      this.$xloading.show();
      this.$async.waterfall([
        fn => {
          ajaxPost('/task/dev-find-page', { ...query, skip: 0, take: 10 }).then(res => {
            this.devList = res.rows;
            fn();
          }, fn);
        }
      ], err => {
        this.$xloading.hide().then(() => {
          if (err)
            this.$message.error(err);
        });
      })

    }
  },
  mounted () {
    this.onSearch();
  }
}
</script>