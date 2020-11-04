<template>
  <div class="local-page-grid">
    <el-table :border="border" :data="data" ref="localPageGrid" @row-click="onRowClick" :row-style="rowStyle">
      <el-table-column align="center" type="selection" v-if="checkedRow" width="55">
      </el-table-column>
      <el-table-column :align="item.align || 'left'" :fixed="item.fixed" :key="index" :label="item.label" :min-width="item.minWidth || 160" :prop="item.prop" :sortable="item.sort" v-for="(item, index) in columns">
        <template v-slot="{ row }">
          <slot :name="item.prop" :row="row">
            <div v-if="item.timeFormat">
              {{ row[item.prop] | timestamp }}
            </div>
            <div v-else>
              {{ row[item.prop] }}
            </div>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="pageSizes" :total="total" @current-change="onPageChange" @size-change="onSizeChange" background :layout="layout" style="text-align: center">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'uc-local-page-grid',
  props: {
    border: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: [],
    },
    rows: {
      type: Array,
      default: [],
    },
    rowStyle: {
      type: Function,
      default: () => {},
    },
    checkedRow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      layout: 'prev, pager, next, jumper, sizes, total',
    };
  },
  computed: {
    checkedRows() {
      return this.$refs.localPageGrid.selection;
    },
    total() {
      return this.rows.length;
    },
    data() {
      let start = (this.page - 1) * this.pageSize;
      let end = start + this.pageSize;
      let pageRows = this.rows.slice(start, end > this.total ? this.total : end);
      this.$emit('onPageChange', pageRows);
      return pageRows;
    },
  },
  methods: {
    onPageChange(page) {
      this.page = page;
    },
    onRowClick(row) {
      this.$emit('onRowClick', row);
    },
    onSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
  },
};
</script>
