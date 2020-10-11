<template>
  <el-card>
    <el-form :model="addForm" ref="addForm" :rules="rules" label-width="80px" class="addFrom">
      <!-- 职工号只允许输入数字 -->
      <el-form-item label="职工号" prop="eno">
        <el-input
          v-model="addForm.eno"
          placeholder="请输入职工号"
          pattern="[0-9]*"
          oninput="value=value.replace(/[^\d]/g,'')"
          show-word-limit
          maxlength="10"
        ></el-input>
      </el-form-item>
      <!-- 对人员名称进行了校验 -->
      <el-form-item label="人员名称" prop="userName">
        <el-input
          v-model="addForm.userName"
          placeholder="请输入人员名称"
          show-word-limit
          maxlength="10"
          @input="nameCheck"
        ></el-input>
      </el-form-item>
      <!-- 单位下拉框 带筛选 -->
      <el-form-item label="单位" prop="unit">
        <el-select v-model="addForm.unit" filterable placeholder="请选择单位" style="width: 100%">
          <el-option
            v-for="(item, index) in unitList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 邮箱的校验规则 自定义 -->
      <el-form-item label="邮箱" prop="mail">
        <el-input v-model="addForm.mail" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <!-- 手机号的校验规则 自定义 -->
      <el-form-item label="手机号" prop="mobile">
        <el-input type="tel" maxlength="11" v-model="addForm.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <!-- 办公电话的校验规则 自定义 -->
      <el-form-item label="办公电话" prop="officePhone">
        <el-input v-model="addForm.officePhone" placeholder="请输入办公电话"></el-input>
      </el-form-item>
      <el-form-item label="职务">
        <el-input v-model="addForm.job" placeholder="请输入职务" show-word-limit maxlength="10"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('addForm')">立即添加</el-button>
        <el-button @click="resetForm('addForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>

import global_ from '../../../utils/constant'
export default {
  data() {
    // 自定义的邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      if (value == "") {
        callback();
        return;
      }
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    // 自定义 手机号校验规则
    var checkPhone = (rule, value, callback) => {
      if (value == "") {
        callback();
        return;
      }
      const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      setTimeout(() => {
        if (phoneReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      }, 100);
    };
    // 自定义办公电话校验规则
    var checkTel = (rule, value, callback) => {
      if (value == "") {
        callback();
        return;
      }
      const telReg = /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
      setTimeout(() => {
        if (telReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的电话号"));
        }
      }, 100);
    };
    return {
      addForm: {
        // 人员名称
        userName: "",
        // 邮箱
        mail: "",
        // 职工号
        eno: "",
        // 手机号
        officePhone: "",
        // 办公电话
        mobile: "",
        // 单位
        unit: "",
        // 职务
        job: "",
        // 角色类型
        roleType: ""
      },
      // 单位列表
      unitList: global_.unit,
      rules: {
        // 人员名称
        userName: [
          { required: true, message: "请输入人员名称", trigger: "blur" }
        ],
        // 职工号
        eno: [{ required: true, message: "请输入职工号", trigger: "blur" }],
        // 单位
        unit: [{ required: true, message: "请选择单位", trigger: "change" }],
        mail: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkPhone, trigger: "blur" }],
        officePhone: [{ validator: checkTel, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 作者姓名检测 只能输入英文 汉字和·
    nameCheck() {
      this.addForm.userName = this.addForm.userName.replace(
        /[^a-zA-Z\u4E00-\u9FA5\·]/g,
        ""
      );
    },
    // 提交表单
    submitForm(addForm) {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          // 验证通过 发起添加用户的请求
          this.$axios
            .post("/v1/user/info/create.vpage", this.addForm)
            .then(res => {
              if (res.success == true) {
                // 添加成功，回到列表界面
                this.$router.push(
                  "/user-list/" + this.addForm.roleType.toLowerCase()
                );
              }
            });
        } else {
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    if (this.$route.params.userType == "approver") {
      this.addForm.roleType = "APPROVER";
    } else if (this.$route.params.userType == "editor") {
      this.addForm.roleType = "EDITOR";
    }
  }
};
</script>

<style lang="less" scoped>
.addFrom {
  margin: 0 auto;
  width: 50%;
}
</style>