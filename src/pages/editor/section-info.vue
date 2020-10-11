<template>
  <div>
    <!-- 稿件当前状态信息 -->
    <el-card>
      <span class="tip">稿件当前状态信息</span>
      <el-form :model="nowState" label-width="80px">
        <!-- 第一行显示数据 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="稿件题目">
              <el-input v-model="nowState.title" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审稿人">
              <el-input v-model="nowState.approveName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编辑人">
              <el-input v-model="nowState.editorName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行显示数据 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="作者">
              <el-input v-model="nowState.docAuthor" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批意见">
              <el-button plain style="width: 100%" @click="scanApprove">点击查看审批意见</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编辑意见">
              <el-button plain style="width: 100%" @click="scanedit">点击查看编辑意见</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行显示数据 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="提交时间">
              <el-input v-model="nowState.submitTime" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批时间">
              <el-input v-model="nowState.approveTime" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编辑时间">
              <el-input v-model="nowState.editTime" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第四行显示数据 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="稿件状态">
              <el-input v-model="status[nowState.status]" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 稿件历史状态信息 -->
    <el-card class="history-info">
      <span class="tip">稿件历史状态信息</span>
      <common-table :tableData="tableData" :tableOption.sync="tableOption"></common-table>
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
    </el-card>
    <!-- 意见弹出框 -->
    <el-dialog title="审批意见" :visible.sync="dialogVisible" width="30%">
      <span>{{suggestion}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import commonTable from "../../components/table/common-table";
export default {
  data() {
    return {
      //表格查询到的数据条数
      total: 0,
      nowState: {
        // 稿件题目
        title: "",
        // 审稿人
        approveName: "",
        // 编辑人
        editorName: "",
        // 作者
        docAuthor: "",
        // 提交时间
        submitTime: "",
        // 审批时间
        approveTime: "",
        // 编辑时间
        editTime: "",
        // 稿件状态
        status: "",
        // 审批意见
        approveSuggestion: "",
        // 编辑意见
        editSuggestion: ""
      },
      // 表格数据
      tableData: [],
      // 表格操作
      tableOption: [
        {
          prop: "operateTime",
          label: "操作时间",
          sortable: true
        },
        {
          prop: "operateName",
          label: "操作人"
        },
        {
          prop: "status",
          label: "稿件状态"
        },
        {
          prop: "docUrl",
          label: "稿件链接"
        },
        {
          prop: "suggestion",
          label: "意见"
        }
      ],
      // // 查询表格的条件信息
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      status: {
        DRAFT: "草稿",
        APPROVAL_PENDING: "待审稿",
        RE_APPROVAL_PENDING: "重投待审稿",
        APPROVE: "审稿通过等待编辑部处理",
        APPROVAL_REJECTION: "审稿不过待修改",
        HIRE: "编辑部已录用",
        REJECTION: "编辑部已拒稿"
      },
      // 总数量
      total: 0,
      // 控制意见弹出框是否显示
      dialogVisible: false,
      // 显示在界面上的意见
      suggestion: ""
    };
  },
  components: {
    commonTable
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    // 监听页大小的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
    },
    // 监听页数的变化
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent;
    },
    // 查看审批意见
    scanApprove() {
      this.suggestion = this.nowState.approveSuggestion;
      if (this.suggestion == null) {
        this.suggestion = "暂无意见";
      }
      this.dialogVisible = true;
    },
    // 查看编辑意见
    scanedit() {
      this.suggestion = this.nowState.editSuggestion;
      if (this.suggestion == null) {
        this.suggestion = "暂无意见";
      }
      this.dialogVisible = true;
    },
    // 查看稿件详细状态信息
    scanDetail(id) {
      this.$axios.get("/v1/contribution/detail.vpage?id=" + id).then(res => {
        if (res.success) {
          // 从后端返回的数据中拿出自己需要的数据
          this.nowState = JSON.parse(
            JSON.stringify(res.data, [
              "title",
              "approveName",
              "editorName",
              "docAuthor",
              "submitTime",
              "approveTime",
              "editTime",
              "status",
              "approveSuggestion",
              "editSuggestion"
            ])
          );
          this.tableData = res.data.logList;

          if (this.tableData != null) {
            this.tableData = this.translateState(this.tableData);
            this.total = res.data.logList.length;
          }
        }
      });
    },
    //将数据中的状态从英文改成中文
    translateState(data) {
      console.log(data);

      data.map(item => {
        if (item.status == "DRAFT") {
          item.status = "草稿";
        } else if (item.status == "APPROVAL_PENDING") {
          item.status = "待审批";
        } else if (item.status == "APPROVE") {
          item.status = "审批通过等待编辑部处理";
        } else if (item.status == "APPROVAL_REJECTION") {
          item.status = "审批不过待修改";
        } else if (item.status == "HIRE") {
          item.status = "编辑部已录用";
        } else {
          item.status == "编辑部已拒稿";
        }
        return item;
      });
      return data;
    }
  },
  mounted() {
    this.scanDetail(this.$route.params.id);
  }
};
</script>

<style lang="less" scoped>
.tip {
  font-size: 20px;
}
.el-form,
.history-info {
  margin-top: 20px;
}
</style>