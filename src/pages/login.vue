<template>
  <!-- 窗体 -->
  <div class="login_container">
    <!-- 登录框 -->
    <div class="login_box">
      <!-- 头像框 -->
      <div class="avatar_box">
        <img src="../assets/avatar.jpg" />
      </div>
      <!-- 登录表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <!-- 用户名区 -->
        <el-form-item prop="userCode">
          <el-input
            v-model="loginForm.userCode"
            prefix-icon="el-icon-user-solid"
            placeholder="职工号"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>
        <!-- 密码区
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="el-icon-s-goods"
            placeholder="密码"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>-->
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetContent()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单登录内容
      loginForm: {
        userCode: "",
        password: ""
      },
      // 表单验证规则
      loginFormRules: {
        // 验证用户名是否合法
        userCode: [
          { required: true, message: "请输入职工号", trigger: "blur" }
          // { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
        // 验证密码是否合法
        // password: [
        //   { required: true, message: "请输入密码", trigger: "blur" }
        //   // { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        // ]
      }
    };
  },
  methods: {
    // 重置表单
    resetContent() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async value => {
        if (!value) {
          return;
        }
        this.$axios
          .get("/v1/user/info/role.vpage?eno=" + this.loginForm.userCode)
          .then(res => {
            console.log(this);

            localStorage.clear();
            if (res.success) {
              localStorage.setItem("UserEno", this.loginForm.userCode);
              localStorage.setItem("RoleType", res.role.toString());
              if (res.userInfo != undefined) {
                localStorage.setItem(
                  "UserId",
                  res.userInfo.id == undefined ? "" : res.userInfo.id
                );
                localStorage.setItem(
                  "UserEno",
                  res.userInfo.eno == undefined ? "" : res.userInfo.eno
                );
                localStorage.setItem(
                  "UserName",
                  res.userInfo.userName == undefined
                    ? ""
                    : res.userInfo.userName
                );
                localStorage.setItem(
                  "UserUnit",
                  res.userInfo.unit == undefined ? "" : res.userInfo.unit
                );
                localStorage.setItem(
                  "UserJob",
                  res.userInfo.job == undefined ? "" : res.userInfo.job
                );
                localStorage.setItem(
                  "UserMail",
                  res.userInfo.mail == undefined ? "" : res.userInfo.mail
                );
                localStorage.setItem(
                  "UserOfficePhone",
                  res.userInfo.officePhone == undefined
                    ? ""
                    : res.userInfo.officePhone
                );
                localStorage.setItem(
                  "UserMobile",
                  res.userInfo.mobile == undefined ? "" : res.userInfo.mobile
                );
              }

              // 如果 res.role 为空，证明是新用户，需要跳转improve-info界面
              if (res.role.length == 0) {
                this.$router.push("/improve-info");
              } else {
                this.$router.push("/home-main");
              }
            }
          });
      });
    }
  }
};
</script>

<style lang="less" scoped>
// 窗体的背景颜色
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
// 登录框
.login_box {
  width: 400px;
  height: 250px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
// 头像框
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  // 阴影
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
// 登录表单区
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
// 按钮区
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
