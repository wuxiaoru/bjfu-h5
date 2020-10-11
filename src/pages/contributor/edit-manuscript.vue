<template>
  <div>
    <el-card>
      <el-form :model="manuscriptForm" :rules="rules" ref="manuscriptForm" label-width="100px">
        <!-- 稿件题目 -->
        <el-form-item label="稿件题目" prop="title">
          <el-input v-model="manuscriptForm.title" disabled></el-input>
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
                :on-success="pictureSuccess"
                multiple
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
            <el-col :span="6" v-if="showSaveBtn">
              <el-button type="primary" @click="saveForm('manuscriptForm')">存为草稿</el-button>
            </el-col>
            <el-col :span="6" v-if="showSubmitBtn">
              <el-button type="success" @click="submitForm('manuscriptForm')">提交稿件</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      manuscriptForm: {
        // 稿件id
        id: "",
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
        // 图片地址
        picUrl: "",
        // 图片名称
        picTitle: "",
        // 备注
        note: "",
        // 投稿人id
        userId: 1,
        // 审稿人id
        approveId: 1
      },
      rules: {
        title: [{ required: true, message: "请输入稿件题目", trigger: "blur" }],
        docAuthor: [
          { required: true, message: "请输入文章作者", trigger: "blur" }
        ],
        docUrl: [{ required: true, message: "请上传稿件", trigger: "blur" }]
      },
      // 上传的文件地址
      fileURL: process.env.VUE_APP_Back + "/v1/contribution/upload.vpage",
      // 控制保存草稿的按钮是否显示
      showSaveBtn: true,
      // 控制提交稿件的按钮是否显示
      showSubmitBtn: true,
      // 临时存储上传的图片地址
      picUrlTmp: [],
      // 临时存储上传的图片名称
      picTitleTmp: []
    };
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
        this.picTitleTmp.push(
          response.data
            .toString()
            .substring(response.data.toString().lastIndexOf("/") + 1)
        );
      }
      this.manuscriptForm.picUrl = this.picUrlTmp.join(",");
      this.manuscriptForm.picTitle = this.picTitleTmp.join(",");
    },
    // 点击提交稿件时 先判断验证是否通过 验证通过 提交稿件
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 发起提交稿件的请求
          this.$axios
            .post("/v1/contribution/reSubmit.vpage", this.manuscriptForm)
            .then(res => {
              if (res.success == true) {
                // 稿件提交成功，跳转回稿件列表界面
                this.$router.push("/news-list");
              } else {
                this.$message.error("提交失败，请稍后再试");
              }
            });
        } else {
          return false;
        }
      });
    },
    // 存为草稿
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 表单验证通过 发起存为草稿的请求
          this.$axios
            .post("/v1/contribution/edit.vpage", this.manuscriptForm)
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
    // 根据稿件id查询稿件的详细信息
    scanDetail(id) {
      this.$axios.get("/v1/contribution/detail.vpage?id=" + id).then(res => {
        if (res.success == true) {
          // 从后端返回的数据中拿出自己需要的数据
          this.manuscriptForm.title = res.data.title;
          this.manuscriptForm.docAuthor = res.data.docAuthor;
          this.manuscriptForm.docUrl = res.data.docUrl;
          // 从后台返回的数据中截取文档名称
          this.manuscriptForm.docTitle = res.data.docUrl.substring(
            res.data.docUrl.lastIndexOf("/") + 1
          );
          this.manuscriptForm.picAuthor = res.data.picAuthor;
          this.manuscriptForm.picUrl = res.data.picUrl;
          // 从后台返回的数据中截取图片名称 因为图片可能会有多张
          const picURLArray = res.data.picUrl.split(",");
          const picTitleArray = [];
          for (let i = 0; i < picURLArray.length; i++) {
            picTitleArray.push(
              picURLArray[i].substring(picURLArray[i].lastIndexOf("/") + 1)
            );
          }
          this.manuscriptForm.picTitle = picTitleArray.join(",");
          this.manuscriptForm.note = res.data.note;
        }
      });
    },
    // 点击取消时 清空表单数据 跳转回稿件列表界面
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push("/news-list");
    }
  },
  created() {
    console.log(this.$route.params.id);
    console.log(this.$route.params.status);

    // 如果有路由传参，证明是点编辑按钮跳转过来的，需要去查稿件的详细信息
    if (this.$route.params.id !== undefined) {
      this.scanDetail(this.$route.params.id);
      this.manuscriptForm.id = this.$route.params.id;
    }

    if (this.$route.params.status === "草稿") {
      this.showSubmitBtn = false;
    } else if (this.$route.params.status === "审稿不过待修改") {
      this.showSaveBtn = false;
    }
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