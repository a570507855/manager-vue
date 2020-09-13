<template>
  <div class="x-table">
    <el-table :border="true" :data="list" ref="XTable">
      <el-table-column align="center" type="selection" v-if="checkedRow" width="55"></el-table-column>
      <el-table-column
        :fixed="item.fixed"
        :key="index"
        :label="item.label"
        :min-width=" (item.minWidth || 160)"
        :prop="item.prop"
        :sortable="item.sort"
        align="center"
        v-for="(item,index) in columns"
      >
        <template v-slot="{row}">
          <slot :name="item.prop" :row="row">
            <div v-if="item.timeFormat">{{row[item.prop] | dateTimeFormat}}</div>
            <div v-else>{{row[item.prop]}}</div>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="[10,20,30,40,50]"
      :total="total"
      @current-change="onPageChange"
      @size-change="onSizeChange"
      background
      layout="prev, pager, next, jumper, sizes, total"
      style="text-align:center;"
    ></el-pagination>
  </div>
</template>

<script>
import { ajaxPost } from '@/utils/ajax'

export default {
  name: "XTable",
  props: {
    columns: {
      type: Array,
      default: []
    },
    url: {
      type: String,
      default: ""
    },
    query: {
      type: Object,
      default: () => { }
    },
    checkedRow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      list: [],
      total: 0,
      page: 1,
      pageSize: 10
    }
  },
  computed: {
    checkedRows () {
      return this.$refs.XTable.selection;
    }
  },
  methods: {
    onChange () {
      this.$xloading.show();
      this.$async.waterfall([
        fn => {
          ajaxPost(this.url, { ...this.query, skip: (this.page - 1) * this.pageSize, take: this.pageSize }).then(res => {
            this.list = res.rows;
            this.total = res.total;
            fn();
          }, fn);
        }
      ], err => {
        this.$xloading.hide().then(() => {
          if (err)
            this.$message.error(err);
        });
      });
    },
    onPageChange (page) {
      this.page = page;
      this.onChange();
    },
    onSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.onChange();
    }
  },
  watch: {
    query () {
      this.page = 1;
      this.onChange();
    }
  },
}
</script>