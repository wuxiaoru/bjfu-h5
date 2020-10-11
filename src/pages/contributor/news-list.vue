<template>
  <div>
    <el-card>
      <!-- 搜索区域 -->
      <el-form :model="searchForm" label-width="80px">
        <!-- 第一行的搜索条件 -->
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="文章标题" prop="title">
              <el-input
                v-model="searchForm.title"
                show-word-limit
                maxlength="30"
                placeholder="请输入文章标题"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作者姓名" prop="docAuthor">
              <el-input
                v-model="searchForm.docAuthor"
                placeholder="请输入作者姓名"
                show-word-limit
                maxlength="10"
                @input="nameCheck"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行的搜索条件 -->
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="稿件状态" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择稿件状态" style="width:100%">
                <el-option
                  v-for="(item, index) in stateList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提交日期" prop="date">
              <el-date-picker
                v-model="searchForm.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                :editable="false"
                :picker-options="pickerOptions"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align: center">
            <el-button type="info" @click="clear">清空</el-button>
            <el-button type="primary" @click="queryList">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- 按钮，添加一个父级元素 为了清除浮动 -->
      <div class="clearfix">
        <el-button type="primary" style="float: right" @click="createArticle">新建文章</el-button>
      </div>
      <!-- 新闻列表区域 -->
      <common-table :tableData="tableData" :tableOption.sync="tableOption" :isOperate="isOperate">
        <!-- 操作列，填充operate的插槽 -->
        <template slot="operate" slot-scope="scope">
          <!-- 所有的状态都有查看的操作 -->
          <el-button type="primary" size="mini" @click="scanNews(scope.row)">查看</el-button>
          <!-- 只有草稿有提交的操作 -->
          <el-button
            type="warning"
            size="mini"
            @click="submitNews(scope.row)"
            v-if="scope.row.status == '草稿'"
          >提交</el-button>
          <!-- 草稿 审批不过待修改 可以进行编辑 -->
          <el-button
            type="info"
            size="mini"
            v-if="scope.row.status == '草稿' || scope.row.status == '审稿不过待修改'"
            @click="editNews(scope.row)"
          >编辑</el-button>
          <!-- 草稿 的可以删除 -->
          <el-button
            type="danger"
            size="mini"
            @click="deleteNews(scope.row)"
            v-if="scope.row.status == '草稿'"
          >删除</el-button>
          <!-- 待审批 的可以撤回 -->
          <el-button
            type="danger"
            size="mini"
            @click="recallNews(scope.row)"
            v-if="scope.row.status == '待审稿'"
          >撤回</el-button>
        </template>
      </common-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
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
import commonTable from "../../components/table/common-table";
import commonDialog from "../../components/dialog/common-dialog";
export default {
  data() {
    return {
      // 搜索表单的内容
      searchForm: {
        // 文章标题
        title: "",
        // 作者姓名
        docAuthor: "",
        // 稿件状态
        status: null,
        // 提交日期
        date: []
      },
      // 稿件状态选择项
      stateList: [
        { label: "全部", value: null },
        { label: "草稿", value: "DRAFT" },
        { label: "待审稿", value: "APPROVAL_PENDING" },
        { label: "重投待审稿", value: "RE_APPROVAL_PENDING" },
        { label: "审稿通过等待编辑部处理", value: "APPROVE" },
        { label: "审稿不过待修改", value: "APPROVAL_REJECTION" },
        { label: "编辑部已录用", value: "HIRE" },
        { label: "编辑部已拒稿", value: "REJECTION" }
      ],
      // 表格数据
      tableData: [],
      // 表格操作
      tableOption: [
        {
          type: "selection",
          label: "#"
        },
        {
          prop: "title",
          label: "稿件名称",
          overHidden: true
        },
        {
          prop: "status",
          label: "稿件状态",
          sortable: true
        },
        {
          prop: "docAuthor",
          label: "作者"
        },
        {
          prop: "submitTime",
          label: "提交日期",
          sortable: true
        }
      ],
      // 控制操作列是否显示
      isOperate: true,
      // 查询表格的条件信息
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 总数量
      total: 0,
      // 对话框标题
      dialogTitle: "",
      // 控制 对话框 是否显示
      dialogVisible: false,
      // 对话框显示内容
      approvalForm: [],
      // 稿件id
      id: "",
      // 登录的用户id
      userId: 1,
      // 审批人列表
      approveList: [],
      // 设置日期格式
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 24 * 60 * 60 * 1000;
        }
      }
    };
  },
  // 注册组件
  components: {
    commonTable,
    commonDialog
  },
  methods: {
    // 作者姓名检测 只能输入英文 汉字和·
    nameCheck() {
      this.searchForm.docAuthor = this.searchForm.docAuthor.replace(
        /[^a-zA-Z\u4E00-\u9FA5\·]/g,
        ""
      );
    },
    // 监听页大小的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.queryList();
    },
    // 监听页数的变化
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent;
      this.queryList();
    },
    // 点击新建文章按钮
    createArticle() {
      this.$router.push("add-manuscript");
    },
    // 点击查看按钮触发的事件
    scanNews(row) {
      this.$router.push({
        path: "/state-info",
        query: { id: row.id }
      });
    },
    // 点击提交按钮时触发的事件
    submitNews(row) {
      this.dialogTitle = "选择审批人";
      this.dialogVisible = true;
      this.id = row.id;
      // 如果对话框里面有内容，先清空
      if (this.approvalForm.length != 0) {
        this.approvalForm.splice(0, this.approvalForm.length);
      }
      this.approvalForm.push(
        { type: "input", label: "稿件题目", title: row.title },
        {
          type: "select",
          label: "选择审稿人",
          approval: this.approveList[0].id,
          option: this.approveList
        }
      );
    },
    // 点击编辑按钮时触发的事件
    editNews(row) {
      console.log(row);

      this.$router.push({
        name: "edit-manuscript",
        params: { id: row.id, status: row.status }
      });
    },
    // 点击删除按钮时触发的事件
    deleteNews(row) {
      this.dialogTitle = "删除信息确认";
      this.dialogVisible = true;
      this.id = row.id;
      // 如果对话框里面有内容，先清空
      if (this.approvalForm.length != 0) {
        this.approvalForm.splice(0, this.approvalForm.length);
      }
      this.approvalForm.push({
        type: "input",
        label: "稿件题目",
        title: row.title
      });
    },
    // 点击撤回按钮时触发的事件
    recallNews(row) {
      this.dialogTitle = "撤回信息确认";
      this.dialogVisible = true;
      this.id = row.id;
      // 如果对话框里面有内容，先清空
      if (this.approvalForm.length != 0) {
        this.approvalForm.splice(0, this.approvalForm.length);
      }
      this.approvalForm.push({
        type: "input",
        label: "稿件题目",
        title: row.title
      });
    },
    // 对话框点击取消按钮时
    cancel() {
      this.dialogVisible = false;
      console.log(this.dialogVisible);
    },
    // 对话框点击确认按钮时
    ok(data) {
      this.dialogVisible = false;
      console.log(data);
      if (data.title == "选择审批人") {
        // 走 提交稿件 的接口
        this.submit();
      } else if (data.title == "删除信息确认") {
        // 走 删除稿件 的接口
        this.delete();
      } else if (data.title == "撤回信息确认") {
        // 走 撤回稿件 的接口
        this.recall();
      }
    },
    // 提交稿件
    submit() {
      console.log(this.approvalForm.approval);
      console.log(this.approveList[0].id);

      if (this.approvalForm.approval == undefined) {
        this.approvalForm.approval = this.approveList[0].id;
      }
      this.$axios
        .post(
          "/v1/contribution/fast-submit.vpage?id=" +
            this.id +
            "&approveId=" +
            this.approvalForm.approval
        )
        .then(res => {
          if (res.success == true) {
            // 提交稿件成功，重新调用获取稿件列表的接口
            this.queryList();
          } else {
            this.$message.error("提交失败，请稍后再试");
          }
        });
    },
    // 删除稿件
    delete() {
      this.$axios
        .post("/v1/contribution/delete.vpage?id=" + this.id)
        .then(res => {
          if (res.success == true) {
            // 稿件删除成功，重新调用获取稿件列表的接口
            this.queryList();
          } else {
            this.$message.error("删除稿件失败，请稍后再试");
          }
        });
    },
    // 撤回稿件
    recall() {
      this.$axios
        .post("/v1/contribution/withDraw.vpage?id=" + this.id)
        .then(res => {
          if (res.success == true) {
            // 稿件撤回成功，重新调用获取稿件列表的接口
            this.queryList();
          } else {
            this.$message.error("撤回稿件失败，请稍后再试");
          }
        });
    },
    // 获取选择审批人
    getId(id) {
      this.approvalForm.approval = id;
    },
    // 查询所有稿件列表
    queryList() {
      if (this.searchForm.date == null) {
        this.searchForm.date = [];
      }
      const body = {
        userId: this.userId,
        docAuthor: this.searchForm.docAuthor,
        title: this.searchForm.title,
        status: this.searchForm.status,
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        size: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum
      };
      this.$axios.post("/v1/contribution/list.vpage", body).then(res => {
        console.log(res);
        if (res.success == true) {
          this.tableData = res.data.list;
          this.tableData.map(item => {
            if (item.status == "DRAFT") {
              item.status = "草稿";
            } else if (item.status == "APPROVAL_PENDING") {
              item.status = "待审稿";
            } else if (item.status == "RE_APPROVAL_PENDING") {
              item.status = "重投待审稿";
            } else if (item.status == "APPROVE") {
              item.status = "审稿通过等待编辑部处理";
            } else if (item.status == "APPROVAL_REJECTION") {
              item.status = "审稿不过待修改";
            } else if (item.status == "HIRE") {
              item.status = "编辑部已录用";
            } else {
              item.status = "编辑部已拒稿";
            }
            return item;
          });
          this.total = res.data.totalCount;
        }
      });
    },
    // 获取所有的审稿人列表
    getApproveList() {
      this.$axios
        .get("/v1/contribution/approve/list.vpage?userId=" + this.userId)
        .then(res => {
          if (res.success == true) {
            this.approveList = res.data;
          }
        });
    },
    //查询状态
    selectStatus() {
      this.$axios
        .get("/v1/news/enum.vpage")
        .then(res => {
          if (res.success == true) {
            // 稿件删除成功，重新调用获取稿件列表的接口
            this.stateList=res.data.status;
          } else {
            this.$message.error("删除稿件失败，请稍后再试");
          }
        });
    },
    // 清空搜索内容
    clear() {
      this.searchForm.title = "";
      this.searchForm.docAuthor = "";
      this.searchForm.status = null;
      this.searchForm.date = [];
      this.queryList();
    }
  },
  async created() {
    this.userId = localStorage.getItem("UserId");
    await this.queryList();
    await this.getApproveList();
  }
};
</script>

<style lang="less" scoped>
</style>