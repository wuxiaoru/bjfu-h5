<template>
  <el-container class="home-container">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div class="logo">
          <img src="../assets/logo.png" class="logoPic" />
          <span>北林新闻管理系统</span>
        </div>
        <!-- 头部标题 -->
        <span class="headline">用户身份选择</span>
      </el-header>
      <!-- 主体内容区 -->
      <el-main>
        <el-card>
          <div class="role">
            <div class="roleCard" @click="getUserInfo(1)">
              <p>投稿人</p>
            </div>
            <div class="roleCard" @click="getUserInfo(2)">
              <p>审批人</p>
            </div>
            <div class="roleCard" @click="getUserInfo(3)">
              <p>编辑人</p>
            </div>
            <div class="roleCard" @click="getUserInfo(4)">
              <p>管理员</p>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    getUserInfo(index) {
      var UserId = "";
      switch (index) {
        case 1:
          localStorage.setItem("UserId", 1);
          localStorage.setItem("RoleType", "contributor");
          break;
        case 2:
          localStorage.setItem("UserId", 2);
          localStorage.setItem("RoleType", "approve");
          break;
        case 3:
          localStorage.setItem("UserId", 3);
          localStorage.setItem("RoleType", "editor");
          break;
        case 4:
          localStorage.setItem("UserId", 4);
          localStorage.setItem("RoleType", "admin");
          break;
        default:
          break;
      };
      this.$router.push("/home-main");
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.logo {
  position: relative;
  width: 15%;
  // display: flex;
  // justify-content: space-between;
  padding: 10px;
  // align-items: center;
  color: #fff;
  font-size: 16px;
  span {
    position: absolute;
    left: 60px;
    top: 0px;
    // margin-top: 30px;
    // vertical-align: top;
    color: black;
  }
}
.logoPic {
  width: 40px;
  height: 40px;
  padding-right: 10px;
  float: left;
}
.el-header {
  line-height: 60px;
  text-align: center;
  background-color: #fff;
  .el-icon-s-fold,
  .el-icon-s-unfold {
    float: left;
    font-size: 26px;
    line-height: 60px;
    cursor: pointer;
  }
  .headline {
    font-size: 20px;
    font-weight: 700;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -2%;
  }
  .el-icon-message-solid {
    margin-right: 10px;
  }
}
.el-card {
  height: 100%;
}
.role {
  width: 100%;
  height: 450px;
  // background-color: yellow;
  margin-top: 50px;
  text-align: center;
  padding-left: 1.5%;
  .roleCard:hover {
    cursor: pointer;
  }
  .roleCard {
    width: 20%;
    height: 100%;
    // background-color: red;
    background: url(../assets/timg.jpg) no-repeat;
    background-size: 100% 100%;
    padding-top: 130px;
    box-sizing: border-box;
    display: inline-block;
    margin-right: 3%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    // margin: 0 auto;
    p {
      // position: ab;
      font-size: 45px;
      font-weight: 700;
      text-align: center;
      // margin-top: 30px ;
    }
    // background-position:cover;
  }
}
</style>