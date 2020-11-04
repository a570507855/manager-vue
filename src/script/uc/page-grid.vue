<template>
  <div class="page-grid">
    <el-table :border="border" :data="list" ref="pageGrid" @row-click="onRowClick" :row-style="rowStyle">
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
  name: 'uc-page-grid',
  props: {
    border: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: [],
    },
    appName: {
      type: String,
      default: '',
    },
    rowStyle: {
      type: Function,
      default: () => {},
    },
    route: {
      type: String,
      default: '',
    },
    query: {
      type: Object,
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
      total: 0,
      page: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      layout: 'prev, pager, next, jumper, sizes, total',
    };
  },
  computed: {
    checkedRows() {
      return this.$refs.pageGrid.selection;
    },
  },
  methods: {
    async onChange() {
      this.$cloading.show();
      try {
        let res = await this.scSDK(this.appName, this.route, {
          ...this.query,
          skip: (this.page - 1) * this.pageSize,
          take: this.pageSize,
        });
        this.list = res.rows;
        this.total = res.total;
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.$cloading.hide();
        this.$emit('onPageChange', this.list);
      }
    },
    onRowClick(row) {
      this.$emit('onRowClick', row);
    },
    onPageChange(page) {
      this.page = page;
      this.onChange();
    },
    onSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.onChange();
    },
  },
  watch: {
    query() {
      this.onChange();
    },
  },
};
</script>
