<template>
  <div class="app-container" id="development">
    <el-form :inline="true" :model="query" class="demo-form-inline">
      <el-form-item>
        <el-input placeholder="任务名称" prefix-icon="el-icon-search" v-model="query.taskName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="状态" v-model="query.status">
          <el-option label="暂未处理" value="1"></el-option>
          <el-option label="正在处理" value="2"></el-option>
          <el-option label="任务完成" value="3"></el-option>
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
        <template
          slot-scope="scope"
        >{{scope.row.completeOn ? (scope.row.completeOn | dateTimeFormat) : "无"}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            @click="onAdd(0,scope.row)"
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

export default {
  name: "Development",
  data () {
    return {
      devList: [],
      query: {
        taskName: '',
        status: ''
      },
      statusArr: {
        1: { text: '暂未处理', color: '#F56C6C' },
        2: { text: '正在处理', color: '#E6A23C' },
        3: { text: '任务完成', color: '#67C23A' },
      }
    }
  },
  methods: {
    onAdd () {

    },
    onDelete () {

    },
    onSearch () {

    },
    filterStatus (status) {

    }
  },
  mounted () {
    devApi.findPage({
      skip: 0,
      take: 10
    }).then(res => {
      this.devList = res.rows;
    })
  }
}
</script>