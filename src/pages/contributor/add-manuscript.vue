<template>
  <div>
    <el-card>
      <el-form :model="manuscriptForm" :rules="rules" ref="manuscriptForm" label-width="100px">
        <!-- 稿件题目 -->
        <el-form-item label="稿件题目" prop="title">
          <el-input
            v-model="manuscriptForm.title"
            show-word-limit
            maxlength="30"
            placeholder="请输入文章标题"
          ></el-input>
        </el-form-item>
        <!-- 稿件作者 -->
        <el-form-item label="稿件作者" prop="docAuthor">
          <el-input
            v-model="manuscriptForm.docAuthor"
            placeholder="请输入文章作者"
            show-word-limit
            maxlength="10"
            @input="nameCheck"
          ></el-input>
        </el-form-item>
        <!-- 稿件上传 -->
        <el-form-item label="稿件上传" prop="docUrl">
          <el-row>
            <el-col :span="20">
              <el-input v-model="manuscriptForm.docTitle" placeholder="请上传文章" :disabled="true"></el-input>
            </el-col>
            <el-col :span="4" style="text-align:right">
              <el-upload
                :action="fileURL"
                :show-file-list="false"
                :on-success="fileSuccess"
                accept=".doc, .docx"
              >
                <el-button style="height:40px" size="small" type="primary">选择本地文件</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <label>注意：只可上传word文档</label>
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item label="图片上传">
          <el-row>
            <el-col :span="20">
              <el-input v-model="manuscriptForm.picTitle" placeholder="请上传图片" :disabled="true"></el-input>
            </el-col>
            <el-col :span="4" style="text-align:right">
              <el-upload
                :action="fileURL"
                :show-file-list="false"
                multiple
                :on-success="pictureSuccess"
                accept="image/*"
              >
                <el-button style="height:40px" size="small" type="primary">选择本地文件</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 图片作者 -->
        <el-form-item label="图片作者">
          <el-input
            v-model="manuscriptForm.picAuthor"
            placeholder="请输入图片作者"
            show-word-limit
            maxlength="10"
            @input="picNameCheck"
          ></el-input>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item label="备注">
          <el-input type="textarea" v-model="manuscriptForm.note" show-word-limit maxlength="150"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="space-around">
            <el-col :span="6">
              <el-button @click="resetForm('manuscriptForm')">取消</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="saveForm('manuscriptForm')">存为草稿</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="success" @click="submitForm('manuscriptForm')">提交稿件</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <!-- 点击按钮弹出的对话框 -->
      <common-dialog
        :dialogTitle="dialogTitle"
        :dialogVisible="dialogVisible"
        :approvalForm="approvalForm"
        @cancel="cancel"
        @ok="ok"
        @pushId="getId"
      ></common-dialog>
    </el-card>
  </div>
</template>

<script>
import commonDialog from "../../components/dialog/common-dialog";
export default {
  data() {
    return {
      manuscriptForm: {
        // 稿件题目
        title: "",
        // 稿件作者
        docAuthor: "",
        // 稿件地址
        docUrl: "",
        // 稿件名称
        docTitle: "",
        // 图片作者
        picAuthor: "",
        // 图片名称
        picTitle: "",
        // 图片地址
        picUrl: "",
        // 备注
        note: "",
        // 投稿人id
        userId: "",
        // 审稿人id
        approveId: ""
      },
      rules: {
        title: [{ required: true, message: "请输入稿件题目", trigger: "blur" }],
        docAuthor: [
          { required: true, message: "请输入文章作者", trigger: "blur" }
        ],
        docUrl: [{ required: true, message: "请上传稿件", trigger: "blur" }]
      },
      // 对话框标题
      dialogTitle: "",
      // 控制 对话框 是否显示
      dialogVisible: false,
      // 对话框显示内容
      approvalForm: [],
      // 审批人列表
      approvalList: [],
      // 上传的文件地址
      fileURL: process.env.VUE_APP_Back + "/v1/contribution/upload.vpage",
      // 临时存储上传的图片地址
      picUrlTmp: [],
      // 临时存储上传的图片名称
      picTitleTmp: []
    };
  },
  components: {
    commonDialog
  },
  methods: {
    // 作者姓名检测 只能输入英文 汉字和·
    nameCheck() {
      this.manuscriptForm.docAuthor = this.manuscriptForm.docAuthor.replace(
        /[^a-zA-Z\u4E00-\u9FA5\·]/g,
        ""
      );
    },
    // 图片姓名检测 只能输入英文 汉字和·
    picNameCheck() {
      this.manuscriptForm.picAuthor = this.manuscriptForm.picAuthor.replace(
        /[^a-zA-Z\u4E00-\u9FA5\·]/g,
        ""
      );
    },
    // 上传文件成功后的回调函数
    fileSuccess(response, file, fileList) {
      this.manuscriptForm.docUrl = response.data.toString();
      this.manuscriptForm.docTitle = file.name;
    },
    // 上传图片成功后的回调函数
    pictureSuccess(response, file, fileList) {
      if (response.success == true) {
        this.picUrlTmp.push(response.data.toString());
        // 从后台返回的数据中截取文档名称
        this.picTitleTmp.push(
          response.data
            .toString()
            .substring(response.data.toString().lastIndexOf("/") + 1)
        );
      }
      this.manuscriptForm.picUrl = this.picUrlTmp.join(",");
      this.manuscriptForm.picTitle = this.picTitleTmp.join(",");
    },
    // 新建文章点击提交稿件时 先判断验证是否通过 然后弹出对话框 选择审批人
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 弹出的对话框的标题
          this.dialogTitle = "选择审批人";
          // 让对话框显示
          this.dialogVisible = true;
          // 如果对话框里面有内容，先清空
          if (this.approvalForm.length != 0) {
            this.approvalForm.splice(0, this.approvalForm.length);
          }
          this.approvalForm.push(
            {
              type: "input",
              label: "稿件题目",
              title: this.manuscriptForm.title
            },
            {
              type: "select",
              label: "选择审稿人",
              approval: "",
              option: this.approvalList
            }
          );
        } else {
          return false;
        }
      });
    },
    // 获取审批人列表
    getApproveList() {
      this.$axios
        .get(
          "/v1/contribution/approve/list.vpage?userId=" +
            this.manuscriptForm.userId
        )
        .then(res => {
          this.approvalList = res.data;
        });
    },
    // 存为草稿
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 表单验证通过 发起存为草稿的请求
          this.$axios
            .post("/v1/contribution/draft.vpage", this.manuscriptForm)
            .then(res => {
              if (res.success == true) {
                // 稿件保存成功，跳转回稿件列表界面
                this.$router.push("/news-list");
              } else {
                this.$message.error("保存失败，请稍后再试");
              }
            });
        }
      });
    },
    // 点击取消时 清空表单数据 跳转回稿件列表界面
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push("/news-list");
    },
    // 对话框点击取消按钮时
    cancel() {
      this.dialogVisible = false;
      console.log(this.dialogVisible);
    },
    // 对话框点击确认按钮时
    ok() {
      // 对话框消失 发送提交稿件的请求
      this.dialogVisible = false;
      console.log(this.manuscriptForm);
      this.$axios
        .post("/v1/contribution/submit.vpage", this.manuscriptForm)
        .then(res => {
          if (res.success == true) {
            // 新建稿件成功，跳转回稿件列表界面
            this.$router.push("/news-list");
          } else {
            this.$message.error("提交失败，请稍后再试");
          }
        });
    },
    // 获取选择审批人
    getId(id) {
      this.manuscriptForm.approveId = id;
      console.log(id);
    }
  },
  created() {
    this.manuscriptForm.userId = localStorage.getItem("UserId");
    // 获取所有的审批人列表
    this.getApproveList();
  }
};
</script>

<style lang="less" scoped>
.el-form {
  width: 80%;
  margin: 0 auto;
}
/deep/ .el-form-item__content {
  line-height: 20px;
}
</style>