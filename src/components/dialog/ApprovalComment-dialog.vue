<template>
  <el-dialog title="审批意见" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <span>{{approvalText}}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    sectionTitle: {
      type: String,
      default: "意见获取失败，请重新获取！"
    },
    dialogVisible: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style scoped>
span {
  font-size: 16px;
}
</style>