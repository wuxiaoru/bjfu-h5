<template>
  <div>
    <!-- 表格部分 -->
    <el-table
      :data="tableData"
      stripe
      border
      :default-sort="{prop: 'date', order: 'descending'}"
      @cell-click="show"
      :cell-style="changeCellStyle"
      :row-class-name="tableRowClassName"
    >
      <!-- 表格业务内容列 -->
      <template v-for="(item, index) in tableOption">
        <el-table-column
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align || 'center'"
          :show-overflow-tooltip="item.overHidden || false"
          :min-width="item.width || '100px'"
          :fixed="item.fixed || true"
          :sortable="item.sortable || false"
          :type="item.type || 'normal'"
        ></el-table-column>
      </template>
      <!-- 表格操作列 -->
      <el-table-column label="操作" v-if="isOperate" min-width="150px">
        <template slot-scope="scope">
          <slot name="operate" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  // 父组件向子组件传值
  props: {
    // 表格显示的数据
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 表格的操作
    tableOption: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 控制操作列是否显示
    isOperate: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  methods: {
    // 点击单元格事件
    show(row, column, cell, event) {
      console.log(row.id);
      if (column.label == "稿件链接") {
        window.open(
          process.env.VUE_APP_Back +
            "/v1/contribution/log/download.vpage?logId=" +
            row.id
        );
      }
    },
    tableRowClassName({row, rowIndex}) {
      console.log(row);
      if (row.status  === "审稿不过待修改" || row.status  === "编辑部已拒稿") {
        return 'warning-row';
      } else if (row.status  === "编辑部已录用") {
        return 'success-row';
      }
      return '';
    },
    // 更改某列的样式事件
    changeCellStyle(row, column, rowIndex, columnIndex) {
      // 列的label的名称
      if (row.column.label === "稿件链接") {
        //修改的样式
        return "color: #1f9fff";
      } else {
        return "";
      }
    }
  }
};
</script>

<style>
 .el-table .warning-row {
    color: #F56C6C;
  }

  .el-table .success-row {
    color: #67C23A;
  }
</style>