<template>
  <el-container class="home-container">
    <el-aside :width="menuCollapse ? '64px' : '200px'">
      <!-- logo区 -->
      <div class="logo">
        <img src="../assets/logo.png" class="logoPic" />
        <span v-show="!menuCollapse">北林新闻管理系统</span>
      </div>
      <!-- 侧边栏菜单区域 -->
      <el-menu
        background-color="#16583d"
        text-color="#fff"
        active-text-color="#409EFF"
        unique-opened
        :collapse="menuCollapse"
        :collapse-transition="false"
        router
        :default-active="activePath"
      >
        <!-- 一级菜单 -->
        <el-submenu
          :index="item.id + ''"
          v-for="item in menulist"
          :key="item.id"
          v-show="getUserType.indexOf(item.type) != -1"
        >
          <!-- 一级菜单的模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i :class="iconsObj[item.id]"></i>
            <!-- 文本 -->
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="'/' + subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="chooseActivePath('/' + subItem.path, subItem.authName)"
          >
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[subItem.id]"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <!-- 折叠与展开的按钮 -->
        <i :class="menuCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="toggleMenu"></i>
        <!-- 头部标题 -->
        <span class="headline">{{headline}}</span>
        <!-- 右侧用户信息 -->
        <div class="right-name">
          <!-- <i class="el-icon-message-solid"></i> -->
          <div class="box">
            <span class="front">
              <i class="el-icon-s-custom"></i>
              {{UserName}}
              <!-- <i class="el-icon-arrow-down"></i> -->
            </span>
            <span class="bottom" @click="toPerInfo">个人信息</span>
          </div>
        </div>
      </el-header>
      <!-- 主体内容区 -->
      <el-main>
        <!-- 路由站位符 -->
        <router-view :key="$route.fullPath" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      UserName: "",
      // 显示的标题名称
      headline: "新闻列表",
      // 控制左侧菜单是否展开
      menuCollapse: false,
      // 左侧菜单列表
      menulist: [],
      // 菜单的图标显示
      iconsObj: {
        "101": "el-icon-user-solid",
        "102": "el-icon-more",
        "103": "el-icon-document-add",
        "106": "el-icon-user-solid",
        "107": "el-icon-more",
        "111": "el-icon-user-solid",
        "112": "el-icon-more",
        "116": "el-icon-user-solid",
        "117": "el-icon-more",
        "118": "el-icon-more",
        "119": "el-icon-document-add",
        "120": "el-icon-document-add"
      },
      // 被激活的路径
      activePath: ""
    };
  },
  computed: {
    getUserType() {
      return localStorage.getItem("RoleType");
    }
  },
  methods: {
    // 控制左侧菜单是否展开
    toggleMenu() {
      this.menuCollapse = !this.menuCollapse;
    },
    // 跳转个人信息界面
    toPerInfo() {
      this.$router.push("/person-info");
    },
    // 高亮显示的路径
    chooseActivePath(activePath, activeName) {
      sessionStorage.setItem("activePath", activePath);
      sessionStorage.setItem("activeName", activeName);
      this.activePath = activePath;
      this.headline = activeName;
    }
  },
  created() {
    this.UserName = localStorage.getItem("UserName");
    // 引入数据文件，获取数据的值并加以显示
    var data = require("../assets/lib/mockData.js");
    this.menulist = data.navData[0].data;
    this.activePath = sessionStorage.getItem("activePath");
    this.headline = sessionStorage.getItem("activeName ");
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-aside {
  background-color: #16583d;
  .el-menu {
    border-right: 0;
  }
}
.logo {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  color: #fff;
  font-size: 16px;
}
.logoPic {
  width: 40px;
  height: 40px;
  padding-right: 10px;
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
  }
  .el-icon-message-solid {
    margin-right: 10px;
  }
  .right-name {
    float: right;
    .box {
      display: inline-block;
      position: relative;
      width: 110px;
      height: 36px;
      cursor: pointer;
      transform-style: preserve-3d;
      transition: all 0.4s;
    }
    .box:hover {
      transform: rotateX(90deg);
    }
    .front,
    .bottom {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .front {
      z-index: 1;
      transform: translateZ(17.5px);
    }
    .bottom {
      transform: translateY(17.5px) rotateX(-90deg);
    }
  }
}
</style>