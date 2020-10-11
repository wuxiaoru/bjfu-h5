<template>
  <div>
    <el-card>
      <!-- 搜索区域 -->
      <el-form :model="searchForm" label-width="80px">
        <!-- 第一行的搜索条件 -->
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="文章名称" prop="title">
              <el-input
                v-model="searchForm.title"
                placeholder="请输入文章名称"
                show-word-limit
                maxlength="30"
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
      <!-- 新闻列表区域 -->
      <common-table :tableData="tableData" :tableOption.sync="tableOption" :isOperate="isOperate">
        <!-- 操作列，填充operate的插槽 -->
        <template slot="operate" slot-scope="scope">
          <!-- 所有的状态都有查看的操作 -->
          <el-button type="primary" size="mini" @click="scanNews(scope.row)">查看</el-button>
          <!-- 待审稿 重投待审稿 可以进行审稿 -->
          <el-button
            type="warning"
            size="mini"
            v-if="scope.row.status == '待审稿' || scope.row.status == '重投待审稿'"
            @click="approveNews(scope.row)"
          >审稿</el-button>
          <!-- 审批通过等待编辑部处理 的可以撤回 -->
          <el-button
            type="danger"
            size="mini"
            v-else-if="scope.row.status == '审批通过等待编辑部处理'"
            @click="recallNews(scope.row)"
          >撤回</el-button>
          <!-- 审批不过待修改 的可以追加 -->
          <el-button type="primary" size="mini" v-else @click="appendNews(scope.row)">追加</el-button>
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
      // 表格数据
      tableData: [],
      // 表格操作
      tableOption: [
        {
          prop: "title",
          label: "稿件名称",
          overHidden: true
        },
        {
          prop: "status",
          label: "稿件状态"
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
      // 稿件状态选择项
      stateList: [
        { label: "全部", value: null },
        { label: "待审稿", value: "APPROVAL_PENDING" },
        { label: "重投待审稿", value: "RE_APPROVAL_PENDING" },
        { label: "审稿通过等待编辑部处理", value: "APPROVE" },
        { label: "审稿不过待修改", value: "APPROVAL_REJECTION" },
        { label: "编辑部已录用", value: "HIRE" },
        { label: "编辑部已拒稿", value: "REJECTION" }
      ],
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
      // 登录的用户id
      userId: "",
      // 撤回稿件的id
      id: "",
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
    // 界面加载完成后查询所有的稿件列表
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
      this.$axios.post("/v1/approve/list.vpage", body).then(res => {
        console.log(res);
        if (res.success == true) {
          this.tableData = res.data.list;
          this.tableData.map(item => {
            if (item.status == "APPROVAL_PENDING") {
              item.status = "待审稿";
            } else if (item.status == "RE_APPROVAL_PENDING") {
              item.status = "重投待审稿";
            } else if (item.status == "APPROVE") {
              item.status = "审批通过等待编辑部处理";
            } else if (item.status == "APPROVAL_REJECTION") {
              item.status = "审批不过待修改";
            }
            return item;
          });
          this.total = res.data.totalCount;
        }
      });
    },
    // 点击查看按钮触发的事件
    scanNews(row) {
      this.$router.push({
        path: "/approve-state-info",
        query: { id: row.id }
      });
    },
    // 点击审稿按钮触发的事件,跳转预览稿件的界面
    approveNews(row) {
      localStorage.setItem("newsId", row.id);
      localStorage.setItem("state", "approve");
      localStorage.setItem("title", row.title);
      this.$router.push("/approve-perview-news");
    },
    // 点击撤回按钮时触发的事件
    recallNews(row) {
      this.dialogTitle = "撤回稿件确认";
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
    // 追加意见
    appendNews(row) {
      localStorage.setItem("newsId", row.id);
      localStorage.setItem("state", "append");
      localStorage.setItem("title", row.title);
      this.$router.push("/approve-perview-news");
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
    cancel() {
      this.dialogVisible = false;
      console.log("用户点击了退出");
    },
    ok() {
      this.dialogVisible = false;
      // 用户点击了撤回，需要撤回稿件
      this.$axios.post("/v1/approve/withDraw.vpage?id=" + this.id).then(res => {
        if (res.success == true) {
          // 撤回稿件成功，重新查询所有稿件
          this.queryList();
        } else {
          this.$message.error("撤回稿件失败，请稍后再试");
        }
      });
    },
    getId() {
      console.log("我要获取id了");
    },
    clear() {
      this.searchForm.title = "";
      this.searchForm.docAuthor = "";
      this.searchForm.status = null;
      this.searchForm.date = [];
      this.queryList();
    }
  },
  created() {
    this.userId = localStorage.getItem("UserId");
    this.queryList();
  }
};
</script>

<style>
</style>