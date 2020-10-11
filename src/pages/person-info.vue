<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="goBack">返回</el-button>
    </div>
    <el-form label-width="80px" :model="formLabelAlign">
      <el-form-item label="工号">
        <el-input v-model="formLabelAlign.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户姓名">
        <el-input v-model="formLabelAlign.name" disabled></el-input>
      </el-form-item>
      <!-- 单位下拉框 带筛选 -->
      <el-form-item label="单位">
        <el-input v-model="formLabelAlign.unit" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户职务">
        <el-input v-model="formLabelAlign.job"></el-input>
      </el-form-item>
    </el-form>
    <!-- <el-button style="float:right" type="primary">保存</el-button> -->
  </el-card>
</template>

<script>
import global_ from '../../utils/constant'
export default {
  data() {
    return {
      // form表单绑定的数据
      formLabelAlign: {
        id: "",
        name: "",
        department: "",
        job: "",
        unit: ""
      },
      // 单位列表
      unitList:global_.unit
    };
  },
  methods: {
    // 点击返回按钮的时候跳转上一个界面
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    this.formLabelAlign.unit = localStorage.getItem("UserUnit");
    this.formLabelAlign.id = localStorage.getItem("UserEno");
    this.formLabelAlign.name = localStorage.getItem("UserName");
    this.formLabelAlign.job =
      localStorage.getItem("UserJob") == "null"
        ? ""
        : localStorage.getItem("UserJob");
  }
};
</script>

<style lang="less" scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
  margin: 100px auto;
  // padding-bottom: 20px;
}
</style>