<template>
  <div style="positioin: relative;">
    <!-- 加载Loading的组件 -->
    <loading :isShow="isShow"></loading>
    <div id="pdf-content"></div>
    <div class="btnArea">
      <el-button type="primary" v-if="showApprove" @click="approveNews">审批稿件</el-button>
      <el-button type="primary" v-if="showAppend" @click="appendNews">追加意见</el-button>
      <el-button type="primary" @click="downloadSection">下载稿件</el-button>
      <el-button type="primary" @click="showPictures">下载附图</el-button>
      <picture-list :list="srcList" @click="changeActive"></picture-list>
      <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="activeList" />
    </div>
    <!-- 图片预览区 -->
<!--    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="srcList"/>-->
    <!-- 点击按钮弹出的对话框 -->
    <common-dialog
        :dialogTitle="dialogTitle"
        :dialogVisible="dialogVisible"
        :approvalForm="approvalForm"
        @cancel="cancel"
        @ok="ok"
        @pushId="getId"
    ></common-dialog>
  </div>
</template>

<script>
// 导入组件
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import commonDialog from "../../components/dialog/common-dialog";
import PictureList from "../../components/dialog/picture-list.vue";

export default {
  components: {
    ElImageViewer,
    commonDialog,
    PictureList
  },
  data() {
    return {
      // 控制 加载组件 是否显示
      isShow: true,
      // pdf预览地址
      pdfUrl: "",
      // 图片预览地址
      srcList: [],
      activeList: [],
      // 显示查看器
      showViewer: false,
      // 需要下载的文章标题
      sectionTitle: "",
      // 控制审批稿件按钮是否显示
      showApprove: true,
      // 控制追加按钮是否显示
      showAppend: false,
      // 稿件名称
      title: "",
      // 稿件id
      id: "",
      // 对话框标题
      dialogTitle: "",
      // 控制 对话框 是否显示
      dialogVisible: false,
      // 对话框显示内容
      approvalForm: []
    };
  },
  methods: {
    // 发起预览稿件的请求
    previewNews(id) {
      this.$axios.get("/v1/contribution/preview.vpage?id=" + id).then(res => {
        if (res.success == true) {
          this.pdfUrl = res.data.pdf;
          this.srcList = res.data.pic;
          this.$nextTick(function () {
            this.$pdf.embed(`${this.pdfUrl}`, "#pdf-content");
          });
          this.isShow = false;
        }
      });
    },
    // 审批稿件按钮
    approveNews() {
      this.$router.push("/approve-suggestion/" + this.id);
    },
    // 追加意见按钮
    appendNews() {
      // 去查询之前审批的意见
      this.$axios
          .get("/v1/approve/suggestion.vpage?id=" + this.id)
          .then(res => {
            if (res.success == true) {
              this.dialogTitle = "追加意见";
              //下载提示框是否显示
              this.dialogVisible = true;
              // 如果对话框里面有内容，先清空
              if (this.approvalForm.length != 0) {
                this.approvalForm.splice(0, this.approvalForm.length);
              }
              this.approvalForm.push({
                type: "textarea",
                label: "审批意见",
                title: res.data
              });
            }
          });
    },
    //下载稿件按钮
    downloadSection() {
      // 需要下载的文章标题
      this.dialogTitle = "稿件下载确认";
      //下载提示框是否显示
      this.dialogVisible = true;
      // 如果对话框里面有内容，先清空
      if (this.approvalForm.length != 0) {
        this.approvalForm.splice(0, this.approvalForm.length);
      }
      this.approvalForm.push({
        type: "input",
        label: "稿件名称",
        title: this.title
      });
    },
    changeActive(item) {
      this.activeList.splice(0, this.activeList.length);
      this.activeList.push(item);
      if (this.activeList.length == 0) {
        this.$message.warning("作者未上传图片！");
      } else {
        this.showViewer = true;
      }
    },
    // 显示图片预览
    showPictures() {
      if (this.srcList.length == 0) {
        this.$message.warning("作者未上传图片！");
      } else {
        window.open(
            process.env.VUE_APP_Back +
            "/v1/contribution/pic/download.vpage?id=" +
            this.id
        );
        // this.showViewer = true;
      }
    },
    // 关闭图片预览
    closeViewer() {
      this.showViewer = false;
    },
    cancel() {
      this.dialogVisible = false;
      console.log("用户点击了退出");
    },
    ok(data) {
      console.log(data);
      this.dialogVisible = false;
      if (data.title == "追加意见") {
        // 走 追加意见 的接口
        this.append(data.content[0].title);
      } else if (data.title == "稿件下载确认") {
        // 走 下载稿件 的接口
        this.download();
      }
    },
    // 追加意见
    append(suggest) {
      this.$axios
          .post(
              "/v1/approve/addSuggestion.vpage?id=" +
              this.id +
              "&suggestion=" +
              suggest
          )
          .then(res => {
            console.log(res);
            if (res.success == true) {
              this.$message.success("追加意见成功");
            } else {
              this.$message.error("追加意见失败，请稍后再试");
            }
          });
    },
    // 下载稿件
    download() {
      window.open(
          process.env.VUE_APP_Back +
          "/v1/contribution/download.vpage?id=" +
          this.id
      );
    },
    getId() {
      console.log("我要获取id了");
    }
  },
  created() {
    // 从缓存中获取稿件id 状态（是审批稿件还是追加意见） 稿件名称
    this.id = localStorage.getItem("newsId");
    var state = localStorage.getItem("state");
    this.title = localStorage.getItem("title");
    this.previewNews(this.id);
    if (state == "append") {
      this.showApprove = false;
      this.showAppend = true;
    }
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