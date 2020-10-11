<template>
  <div>
    <el-card>
      <!-- 搜索区域 -->
      <el-form label-width="80px">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="文章名称">
              <el-input v-model="textName" show-word-limit maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审稿日期">
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="selectedTextDateTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="作者姓名">
              <el-input v-model="docAuthor" show-word-limit maxlength="10" @input="nameCheck"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在单位">
              <el-select v-model="selectedUnitOption" filterable placeholder="请选择">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :push="3">
            <!-- 清空按钮 -->
            <el-button class="search" type="info" @click="clearText">清空</el-button>
            <!-- 搜索按钮 -->
            <el-button class="search" type="primary" @click="searchText">搜索</el-button>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="稿件状态">
              <el-select v-model="selectedTextStatus" placeholder="请选择">
                <el-option
                  v-for="item in selectStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
        </el-row>
      </el-form>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- Tabs标签页 -->
      <div>
        <el-button
          :class="searchType == 0 ? 'el-button-focus' : ''"
          @click="changeSearchType(0)"
        >已审核待编辑处理</el-button>
        <el-button @click="changeSearchType(1)">已拒稿</el-button>
        <el-button @click="changeSearchType(2)">已录用</el-button>
      </div>

      <!-- 稿件列表区域 -->
      <common-table :tableData="tableData" :tableOption.sync="tableOption" :isOperate="isOperate">
        <!-- 操作列，填充operate的插槽 -->
        <template slot="operate" slot-scope="scope">
          <el-button
            v-if="searchType == 0 || searchType == 1"
            type="primary"
            size="mini"
            @click="getSectionInfo(scope.row)"
          >查看</el-button>
          <el-button
            v-if="searchType == 0"
            type="warning"
            size="mini"
            @click="approvalSection(scope.row)"
          >编审</el-button>
          <el-button
            v-if="searchType == 1 || searchType == 2"
            type="info"
            size="mini"
            @click="priviewSection(scope.row)"
          >预览</el-button>
          <el-button
            v-if="searchType == 2"
            type="danger"
            size="mini"
            @click="downloadSection(scope.row)"
          >下载</el-button>
        </template>
      </common-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 50]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <downloadsection-dialog
      :sectionTitle="sectionTitle"
      :dialogVisible.sync="ddialogvisible"
      @confirmDownload="confirmDownload"
    ></downloadsection-dialog>
  </div>
</template>

<script>
import commonTable from "../../components/table/common-table";
import downloadsectionDialog from "../../components/dialog/downloadsection-dialog.vue";
import global_ from '../../../utils/constant'
export default {
  components: {
    commonTable,
    downloadsectionDialog
  },
  data() {
    return {
      // 当前选中的稿件id
      selectedSectionId: "",
      //每页条数
      size: 10,
      //当前的页数
      page: 0,
      //当前记录条数
      total: 0,
      // 0 已审核待编辑处理  1 已拒稿  2 已录用
      searchType: 0,
      value1: "",
      //稿件状态
      status: "",
      //文章名称
      textName: "",
      //文章作者
      docAuthor: "",
      //选择稿件时间范围
      selectedTextDateTime: "",
      //稿件状态，查询参数使用
      TextStatus: "APPROVE",
      // 控制操作列是否显示
      isOperate: true,
      // 表格数据
      tableData: [],
      tableOption: [
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
          prop: "unit",
          label: "单位"
        },
        {
          prop: "approveName",
          label: "审稿人"
        },
        {
          prop: "approveTime",
          label: "审稿日期",
          sortable: true
        }
      ],
      //当前选中的单位
      selectedUnitOption: "",
      //当前选中的稿件状态
      selectedTextStatus: "",
      //单位数据
      selectOptions: global_.unit,
      //稿件状态数据
      selectStatusOptions: [
        {
          value: "APPROVE",
          label: "审稿通过等待编辑部处理"
        },
        {
          value: "HIRE",
          label: "编辑部已录用"
        },
        {
          value: "REJECTION",
          label: "编辑部已拒稿"
        }
      ],
      // 需要下载的文章标题
      sectionTitle: "",
      //下载提示框是否显示
      ddialogvisible: false,
      // 设置日期格式
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 24 * 60 * 60 * 1000;
          // return time.getTime() > Date.now() - 8.64e6;
        }
      }
    };
  },
  methods: {
    // 作者姓名检测 只能输入英文 汉字和·
    nameCheck() {
      this.docAuthor = this.docAuthor.replace(/[^a-zA-Z\u4E00-\u9FA5\·]/g, "");
    },
    changeSearchType(typeid) {
      this.searchType = typeid;
      switch (typeid) {
        case 0:
          this.TextStatus = "APPROVE";
          this.status = "审稿通过等待编辑部处理";
          break;
        case 1:
          this.TextStatus = "REJECTION";
          this.status = "编辑部已拒稿";
          break;
        case 2:
          this.TextStatus = "HIRE";
          this.status = "编辑部已录用";
          break;
        default:
          break;
      }
      this.$axios
        .post("/v1/edit/list.vpage", {
          status: this.TextStatus,
          size: this.size,
          page: this.page
        })
        .then(res => {
          // console.log(res);
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].status = this.status;
          }
        });
    },
    // 点击稿件预览按钮
    jumpPreview() {
      this.$router.push("/v1/preview-section");
    },
    //点击审批稿件按钮
    approvalSection(info) {
      this.$router.push({
        name: "preview-section",
        params: {
          id: info.id,
          title: info.title,
          isOverLook: false
        }
      });
    },
    //点击预览稿件按钮
    priviewSection(info) {
      this.$router.push({
        name: "preview-section",
        params: {
          id: info.id,
          title: info.title,
          isOverLook: true
        }
      });
    },
    //下载稿件按钮
    downloadSection(sectionInfo) {
      console.log(sectionInfo);

      this.selectedSectionId = sectionInfo.id;
      // 需要下载的文章标题
      this.sectionTitle = sectionInfo.title;
      //下载提示框是否显示
      this.ddialogvisible = true;
    },
    confirmDownload() {
      window.open(
        process.env.VUE_APP_Back +
          "/v1/contribution/download.vpage?id=" +
          this.selectedSectionId
      );
    },
    //按条件查询文章
    searchText() {
      //构建一个查询对象
      var searchObj = {};
      if (this.textName.trim() != "") {
        searchObj.title = this.textName;
      }
      if (this.selectedTextDateTime.length > 0) {
        searchObj.startTime = this.selectedTextDateTime[0];
        searchObj.endTime = this.selectedTextDateTime[1];
      }
      if (this.selectedUnitOption != "") {
        searchObj.unit = this.selectedUnitOption;
      }
      if (this.docAuthor.trim() != "") {
        searchObj.docAuthor = this.docAuthor;
      }
      // if (this.selectedTextStatus!="") {
      searchObj.status = this.TextStatus;
      // };
      this.$axios.post("/v1/edit/list.vpage", searchObj).then(res => {
        console.log(res);
        this.tableData = res.data.list;
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].status = this.status;
        }
      });
    },
    clearText() {
      this.textName = "";
      this.selectedTextDateTime = [];
      this.docAuthor = "";
      this.selectedUnitOption = null;
    },
    //预览指定稿件
    previewSection(info) {
      console.log(info);
      // this.$axios.get("/contribution/detail.vpage")
    },
    // 查看稿件详情
    getSectionInfo(info) {
      this.$router.push({
        name: "section-info",
        params: {
          id: info.id
        }
      });
    },
    // 监听页大小的变化
    handleSizeChange(newSize) {
      console.log("监听页大小的变化");

      this.size = newSize;
      this.$axios
        .post("/v1/edit/list.vpage", {
          status: this.TextStatus,
          size: this.size,
          page: this.page
        })
        .then(res => {
          // console.log(res);
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].status = this.status;
          }
        });
    },
    // 监听页数的变化
    handleCurrentChange(newCurrent) {
      console.log("监听页数的变化");
      this.page = newCurrent;
      this.$axios
        .post("/v1/edit/list.vpage", {
          status: this.TextStatus,
          size: this.size,
          page: this.page
        })
        .then(res => {
          // console.log(res);
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].status = this.status;
          }
        });
    }
  },
  mounted() {
    this.changeSearchType(0);
  }
};
</script>

<style lang="less" scoped>
.el-date-editor--daterange.el-input__inner {
  width: 100%;
}
.el-select {
  width: 100%;
}
.el-button {
  margin-left: 0;
}
.el-button {
  margin-right: 3px;
}
.el-button-focus {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
</style>