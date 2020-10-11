<template>
  <div style="positioin: relative;">
    <!-- 加载Loading的组件 -->
    <loading :isShow="isShow"></loading>
    <div id="pdf-content"></div>
    <div class="btnArea">
      <el-button
        type="primary"
        v-if="this.$route.params.isOverLook == false"
        @click="downloadSection()"
      >下载稿件</el-button>
      <el-button
        type="primary"
        v-if="this.$route.params.isOverLook == false"
        @click="jumpToApproval"
      >编审稿件</el-button>
      <picture-list :list="srcList" @click="changeActive"></picture-list>
      <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="activeList" />
      <downloadsection-dialog
        @confirmDownload="confirmDownload"
        :sectionTitle="sectionTitle"
        :dialogVisible.sync="ddialogvisible"
      ></downloadsection-dialog>
    </div>
  </div>
</template>
<script>
// import PictureList from "@/components/dialog/picture-list";
// export default {
//   components: {PictureList}
// }
</script>
<script>
import downloadsectionDialog from "../../components/dialog/downloadsection-dialog.vue";
// 导入组件
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import PictureList from "../../components/dialog/picture-list.vue";
export default {
  components: {
    downloadsectionDialog,
    ElImageViewer,
    PictureList,
  },
  data() {
    return {
      // 控制 加载组件 是否显示
      isShow: true,
      sectionPdf: "",
      showViewer: false, // 显示查看器
      // 需要下载的文章标题
      sectionTitle: "",
      //下载提示框是否显示
      ddialogvisible: false,
      srcList: [],
      activeList: [],
    };
  },
  methods: {
    getSectionPdf() {
      this.$axios
        .get("/v1/contribution/preview.vpage?id=" + this.$route.params.id)
        .then(res => {
          this.sectionPdf = res.data.pdf;
          this.srcList = res.data.pic;
          this.$nextTick(function() {
            this.$pdf.embed(`${this.sectionPdf}`, "#pdf-content");
          });
          this.isShow = false;
        });
    },
    //下载稿件按钮
    downloadSection() {
      // 需要下载的文章标题
      this.sectionTitle = this.$route.params.title;
      //下载提示框是否显示
      this.ddialogvisible = true;
    },
    showPictures() {
      if (this.srcList.length == 0) {
        this.$message.warning("作者未上传图片！");
      } else {
        this.showViewer = true;
      }
    },
    closeViewer() {
      this.showViewer = false;
    },
    //跳转到编审界面
    jumpToApproval() {
      this.$router.push({
        name: "approval-section",
        params: {
          sectionId: this.$route.params.id
        }
      });
    },
    confirmDownload() {
      console.log("sfsfs");

      window.open(
        process.env.VUE_APP_Back +
          "/v1/contribution/download.vpage?id=" +
          this.$route.params.id
      );
    },
    changeActive(item) {
      this.activeList.splice(0, this.activeList.length);
      this.activeList.push(item);
      if (this.activeList.length == 0) {
        this.$message.warning("作者未上传图片！");
      } else {
        this.showViewer = true;
      }
    }
  },
  mounted() {
    this.getSectionPdf();
  }
};
</script>

<style lang="less" scoped>
#pdf-content {
  margin: 0 auto;
  margin-top: 30px;
  width: 60%;
  height: 85%;
  position: absolute;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
}
.btnArea {
  float: right;
  margin-right: 30px;
  width: 100px;
}
.el-button {
  margin-left: 0;
  margin-top: 10px;
}
</style>