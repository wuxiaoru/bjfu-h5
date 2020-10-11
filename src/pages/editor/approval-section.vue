<template>
  <el-card class="box-card">
    <el-form
      :model="dataInfo"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="审批结果" prop="status">
        <el-select v-model="dataInfo.status" placeholder="请选择审批结果">
          <el-option label="通过" value="AGREE"></el-option>
          <el-option label="不通过" value="REJECTION"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批意见" prop="suggestion">
        <el-input :rows="4" type="textarea" v-model="dataInfo.suggestion"></el-input>
      </el-form-item>
      <el-form-item class="buttonArea">
        <el-button type="primary" @click="submitForm('ruleForm')">编审</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      dataInfo: {
        id: this.$route.params.sectionId,
        status: "AGREE",
        suggestion: ""
      },
      rules: {
        status: [
          { required: true, message: "请选择审批结果", trigger: "change" }
        ],
        suggestion: [{ required: true, message: "请填写意见", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交稿件的审批信息
          var vm = this;
          this.$axios
            .post(
              "/v1/edit/deal.vpage?id=" +
                this.dataInfo.id +
                "&status=" +
                this.dataInfo.status +
                "&suggestion=" +
                this.dataInfo.suggestion
            )
            .then(res => {
              if (res.success == true) {
                // 编审成功
                this.$router.push("/section-list");
              } else {
                this.$message({
                  showClose: true,
                  message: "编审失败，请稍后重试！",
                  type: "warning"
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    console.log(this.$route.params.sectionId);
  }
};
</script>

<style scoped>
.el-card {
  height: 100%;
}
.el-form {
  width: 80%;
  margin: auto;
}
.el-select {
  width: 100%;
}
.el-form-item {
  margin-top: 10%;
}
.buttonArea {
  text-align: center;
}
.buttonArea .el-button {
  width: 15%;
  margin: 0 10%;
}
</style>