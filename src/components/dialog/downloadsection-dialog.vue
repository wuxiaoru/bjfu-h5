<template>
  <el-dialog title="稿件下载" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <span>稿件名称：{{sectionTitle}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    sectionTitle: {
      type: String,
      default: "重新获取文章名称后下载"
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
      this.$emit("update:dialogVisible",false);
    },
    confirm(){
      this.$emit("update:dialogVisible",false);
      this.$emit("confirmDownload");
      
    }
  }
};
</script>

<style scoped>
span {
  font-size: 16px;
}
</style>