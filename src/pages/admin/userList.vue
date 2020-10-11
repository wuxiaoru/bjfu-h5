<template>
  <div>
    <el-card>
      <!-- 搜索区域 -->
      <el-form :model="searchForm" label-width="80px">
        <!-- 第一行的搜索条件 -->
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="工号" prop="eno">
              <el-input
                v-model="searchForm.eno"
                placeholder="请输入工号"
                pattern="[0-9]*"
                @input="value=value.replace(/[^\d]/g,'')"
                show-word-limit
                maxlength="10"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="userName">
              <el-input
                v-model="searchForm.userName"
                placeholder="请输入姓名"
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
            <el-form-item label="单位" prop="unit">
              <el-select
                filterable
                v-model="searchForm.unit"
                placeholder="请选择单位"
                style="width:100%"
              >
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16" style="text-align: center; padding-left: 30%">
            <el-button type="info" @click="clear">清空</el-button>
            <el-button type="primary" @click="queryList">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- 按钮，添加一个父级元素 为了清除浮动 -->
      <div class="clearfix">
        <el-button type="primary" style="float: right" @click="addPerson">添加</el-button>
      </div>
      <!-- 列表区域 -->
      <common-table :tableData="tableData" :tableOption.sync="tableOption" :isOperate="isOperate">
        <!-- 操作列，填充operate的插槽 -->
        <template slot="operate" slot-scope="scope">
          <el-button type="danger" size="mini" @click="deletePerson(scope.row)">删除</el-button>
          <el-button type="primary" size="mini" @click="editPerson(scope.row)">编辑</el-button>
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
      ></common-dialog>
      <!-- 嵌套表单的对话框 -->
      <el-dialog title="编辑用户信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="editForm" ref="editForm" :rules="rules" label-width="80px" class="addFrom">
          <el-form-item label="职工号">
            <el-input v-model="editForm.eno" disabled></el-input>
          </el-form-item>
          <el-form-item label="人员名称" prop="userName">
            <el-input
              v-model="editForm.userName"
              placeholder="请输入人员名称"
              show-word-limit
              maxlength="10"
              @input="formNameCheck"
            ></el-input>
          </el-form-item>
          <!-- 单位下拉框 带筛选 -->
          <el-form-item label="单位" prop="unit">
            <el-select v-model="editForm.unit" filterable placeholder="请选择单位" style="width: 100%">
              <el-option
                v-for="(item, index) in unitList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="editForm.mail" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input maxlength="11" v-model="editForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="办公电话" prop="officePhone">
            <el-input v-model="editForm.officePhone" placeholder="请输入办公电话"></el-input>
          </el-form-item>
          <el-form-item label="职务">
            <el-input v-model="editForm.job" placeholder="请输入职务" show-word-limit maxlength="10"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelForm('editForm')">取 消</el-button>
          <el-button type="primary" @click="submit('editForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import commonTable from "../../components/table/common-table";
import commonDialog from "../../components/dialog/common-dialog";
import global_ from "../../../utils/constant";
export default {
  data() {
    // 自定义的邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      if (value == "") {
        callback();
        return;
      }
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    // 自定义 手机号校验规则
    var checkPhone = (rule, value, callback) => {
      if (value == "") {
        callback();
        return;
      }
      const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      setTimeout(() => {
        if (phoneReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      }, 100);
    };
    // 自定义办公电话校验规则
    var checkTel = (rule, value, callback) => {
      if (value == "") {
        callback();
        return;
      }
      const telReg = /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
      setTimeout(() => {
        if (telReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的电话号"));
        }
      }, 100);
    };
    return {
      editForm: {},
      searchForm: {
        // 职工号
        eno: "",
        // 单位
        unit: null,
        // 用户名
        userName: ""
      },
      // 单位列表
      unitList: global_.unit,
      // 表格数据
      tableData: [],
      // 表格头数据
      tableOption: [
        {
          prop: "#",
          type: "selection",
          overHidden: true
        },
        {
          prop: "eno",
          label: "工号",
          overHidden: true
        },
        {
          prop: "userName",
          label: "姓名",
          sortable: true
        },
        {
          prop: "unit",
          label: "单位"
        },
        {
          prop: "mobile",
          label: "手机号"
        },
        {
          prop: "officePhone",
          label: "办公电话"
        },
        {
          prop: "mail",
          label: "邮箱"
        },
        {
          prop: "job",
          label: "职务"
        }
      ],
      // 查询表格的条件信息
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 控制操作列是否显示
      isOperate: true,
      // 总数量
      total: 0,
      // 对话框标题
      dialogTitle: "",
      // 控制 对话框 是否显示
      dialogVisible: false,
      // 对话框显示内容
      approvalForm: [],
      // 角色类型
      roleType: "",
      // 用户id
      id: "",
      rules: {
        // 人员名称
        userName: [
          { required: true, message: "请输入人员名称", trigger: "blur" }
        ],
        // 单位
        unit: [{ required: true, message: "请选择单位", trigger: "change" }],
        mail: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkPhone, trigger: "blur" }],
        officePhone: [{ validator: checkTel, trigger: "blur" }]
      },
      // 控制表单对话框是否显示
      dialogFormVisible: false
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
      this.searchForm.userName = this.searchForm.userName.replace(
        /[^a-zA-Z\u4E00-\u9FA5\·]/g,
        ""
      );
    },
    formNameCheck() {
      this.editForm.userName = this.editForm.userName.replace(
        /[^a-zA-Z\u4E00-\u9FA5\·]/g,
        ""
      );
    },
    // 清空搜索条件
    clear() {
      this.searchForm.eno = "";
      this.searchForm.unit = null;
      this.searchForm.userName = "";
      // 清除所有数据成功，显示所有数据
      this.queryList();
    },
    // 查询表格中的数据
    queryList() {
      const body = {
        eno: this.searchForm.eno,
        unit: this.searchForm.unit,
        userName: this.searchForm.userName,
        roleType: this.roleType,
        size: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum
      };
      this.$axios.post("/v1/user/info/list.vpage", body).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.totalCount;
      });
    },
    // 添加人员
    addPerson() {
      this.$router.push("/add-user/" + this.$route.params.userType);
    },
    // 删除表格中的数据
    deletePerson(row) {
      this.dialogTitle = "确认删除信息";
      this.dialogVisible = true;
      this.id = row.id;
      // 如果对话框里面有内容，先清空
      if (this.approvalForm.length != 0) {
        this.approvalForm.splice(0, this.approvalForm.length);
      }
      this.approvalForm.push(
        { type: "input", label: "用户id", title: row.id },
        { type: "input", label: "用户姓名", title: row.userName },
        { type: "input", label: "用户单位", title: row.unit },
        { type: "input", label: "用户职务", title: row.job }
      );
    },
    // 编辑表格中的数据
    editPerson(row) {
      this.dialogFormVisible = true;
      console.log(row);
      this.editForm = row;
      console.log(this.editForm);
    },
    // 提交表单的事件
    submit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          // 发起编辑用户的请求
          this.$axios
            .post("/v1/user/info/edit.vpage", this.editForm)
            .then(res => {
              if (res.success == true) {
                // 编辑用户成功
                this.dialogFormVisible = false;
              } else {
                this.$message.error("编辑用户信息失败，请稍后再试");
              }
            });
        }
      });
    },
    // 取消表单的事件
    cancelForm() {
      this.dialogFormVisible = false;
      this.queryList();
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
    // 对话框点击取消按钮时
    cancel() {
      this.dialogVisible = false;
      console.log(this.dialogVisible);
    },
    // 对话框点击确认按钮时
    ok(data) {
      this.dialogVisible = false;
      if (data.title == "确认删除信息") {
        // 走删除的接口
        this.delete();
      }
    },
    // 删除的接口
    delete() {
      // 确认删除
      this.$axios.post("/v1/user/info/delete.vpage?id=" + this.id).then(res => {
        if (res.success == false) {
          this.$message.error("删除用户失败，请稍后再试");
        } else if (res.success == true) {
          // 删除用户成功，重新查询用户列表
          this.queryList();
        }
      });
    }
  },
  created() {
    // 获取地址栏中的地址
    console.log(this.$route.params.userType);
    if (this.$route.params.userType == "approver") {
      this.roleType = "APPROVER";
    } else if (this.$route.params.userType == "editor") {
      this.roleType = "EDITOR";
    }
    this.queryList();
  }
};
</script>

<style>
</style>