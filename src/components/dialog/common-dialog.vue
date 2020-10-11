<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="isCancel"
  >
    <el-form>
      <template v-for="(item,index) in approvalForm">
        <!-- 如果是input框的话 -->
        <el-form-item
          :key="index"
          v-if="item.type=='input'"
          :label="item.label"
          :label-width="formLabelWidth"
        >
          <el-input v-model="item.title" disabled></el-input>
        </el-form-item>
        <!-- 如果是select选择框 -->
        <el-form-item
          :key="index"
          v-else-if="item.type=='select'"
          :label="item.label"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="item.approval"
            placeholder="请选择审批人"
            style="width:100%"
            @change="changeApproval(item.approval)"
          >
            <!-- 循环下拉框的数据 -->
            <el-option
              v-for="(item, index) in item.option"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 如果是textarea输入框 -->
        <el-form-item
          :key="index"
          v-if="item.type=='textarea'"
          :label="item.label"
          :label-width="formLabelWidth"
        >
          <el-input type="textarea" v-model="item.title" show-word-limit maxlength="150"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <!-- 对话框底部，按钮区 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="isCancel">取 消</el-button>
      <el-button type="primary" @click="isOk">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 对话框标题
    dialogTitle: {
      type: String,
      default: function() {
        return "";
      }
    },
    // 控制对话框是否显示
    dialogVisible: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 对话框绑定内容
    approvalForm: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      // 左边提示信息的宽度
      formLabelWidth: "85px"
    };
  },
  methods: {
    // 点击取消按钮时 子组件向父组件传值
    isCancel() {
      this.$emit("cancel", "false");
    },
    // 点击确认按钮时 子组件向父组件传值
    isOk() {
      this.$emit("ok", {
        visible: "false",
        title: this.dialogTitle,
        content: this.approvalForm
      });
    },
    changeApproval(id) {
      this.$emit("pushId", id);
    }
  }
};
</script>

<style>
</style>