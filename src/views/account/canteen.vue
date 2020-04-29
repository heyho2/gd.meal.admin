<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type icon="el-icon-plus" @click="handleAdd">新增食堂操作员</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="grid.listLoading"
      :data="grid.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :row-class-name="tableRowClassName"
    >
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="账号" min-width="180" align="center">
        <template slot-scope="scope">{{scope.row.userName}}</template>
      </el-table-column>
      <el-table-column label="角色" align="center" min-width="180">
        <template slot-scope>{{ `食堂管理员` }}</template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="180" align="center">
        <template slot-scope="scope">{{parseTime(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="最后登录时间" min-width="180" align="center">
        <template slot-scope="scope">{{parseTime(scope.row.lastUpdatedDate) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button @click="handleResetPassword(scope.row)" type size="mini">重置密码</el-button>
          <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="form.dialogTitle"
      :visible.sync="form.dialogVisible"
      :close-on-click-modal="false"
      width="45%"
      append-to-body
      top="20px"
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="right"
        label-width="120px"
        label-suffix="："
        style="width:99%"
      >
        <el-form-item label="角色">{{'食堂管理员'}}</el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input v-model="form.info.userName" placeholder="请输入账号"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.info.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="密码确认" prop="password2">
          <el-input type="password" v-model="form.info.password2" placeholder="请再次输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.dialogVisible = false" icon="el-icon-close">关闭</el-button>
        <el-button type="primary" @click="handleSave" icon="iconfont icon-save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  GetMealOperators,
  DeleteMealOperator,
  ResetMealOperatorPassword,
  CreateMealOperator
} from "@/api/MealAdmin";

import { formatCurrency, parseTime } from "@/utils/index";
import md5 from "js-md5";

export default {
  components: {},
  data() {
    return {
      hospitalGuid: null,
      query: {
        pageIndex: 1,
        pageSize: 10,
        dishesName: null,
        hospitalGuid: this.$store.getters.hospitalId
      },
      grid: {
        listLoading: false,
        list: [],
        total: 0
      },
      form: {
        dialogVisible: false,
        dialogTitle: "窗口",
        dialogStatus: "add",
        info: {
          userName: null,
          password: null,
          password2: null,
          role: "食堂管理员"
        },
        //表单验证
        rules: {
          userName: [{ required: true, message: "必填", trigger: "change" }],
          password: [
            { required: true, message: "必填", trigger: "change" },
            { max: 20, message: "长度不能超过20", trigger: "change" }
          ],
          password2: [
            {
              required: true,
              trigger: "change",
              validator: (rule, value, callback) => {
                if (this.form.info.password != this.form.info.password2) {
                  callback(new Error("密码必须相同"));
                } else {
                  callback();
                }
              }
            }
          ]
        }
      }
    };
  },
  mounted() {
    this.hospitalGuid = this.$store.getters.hospitalId;
    this.handleFilter();
  },
  methods: {
    handleFilter() {
      var t = this;
      t.grid.listLoading = true;
      GetMealOperators(t.query).then(
        response => {
          t.grid.list = response.data;
          setTimeout(() => {
            t.grid.listLoading = false;
          }, 200);
        },
        error => {
          t.grid.listLoading = false;
        }
      );
    },
    handleSearch() {
      this.query.pageIndex = 1;
      this.handleFilter();
    },
    handleAdd() {
      let t = this;
      t.form.info = {
        hospitalGuid: this.hospitalGuid,
        userName: null,
        password: null,
        password2: null,
        role: "食堂管理员"
      };
      t.form.dialogVisible = true;
      t.form.dialogStatus = "add";
      t.form.dialogTitle = "新增食堂操作员";
      t.$nextTick(() => {
        t.$refs["dataForm"].clearValidate();
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.enable === false) {
        return "disable-row";
      }
      return "";
    },
    //删除
    handleDelete(row) {
      var t = this;
      t.$confirm("此操作将永久删除该数据, 是否继续?", "确认删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          DeleteMealOperator(this.hospitalGuid, row.operatorGuid).then(
            response => {
              t.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
              t.handleFilter();
            }
          );
        })
        .catch(() => {
          t.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //重置密码
    handleResetPassword(row) {
      var password = md5("123456").toUpperCase();
      var t = this;
      t.$confirm("确定重置密码为‘123456’？", "确认重置", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          ResetMealOperatorPassword({
            HospitalGuid: this.hospitalGuid,
            OperatorGuid: row.operatorGuid,
            password
          }).then(response => {
            t.$notify({
              title: "成功",
              message: "重置成功",
              type: "success",
              duration: 2000
            });
            t.handleFilter();
          });
        })
        .catch(() => {
          t.$message({
            type: "info",
            message: "已取消重置"
          });
        });
    },

    handleUpdate(row) {
      let t = this;
      t.form.info = Object.assign(
        {
          hospitalGuid: this.hospitalGuid,
          userName: null,
          password: null,
          password2: null
        },
        row
      );
      t.form.dialogVisible = true;
      t.form.dialogStatus = "update";
      t.form.dialogTitle = "修改菜品";
      t.$nextTick(() => {
        t.$refs["dataForm"].clearValidate();
      });
    },
    handleSave() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this._save().then(response => {
            this.form.dialogVisible = false;
            this.handleFilter();
          });
        }
      });
    },
    _save() {
      const t = this,
        tempData = Object.assign({}, this.form.info);
      tempData.password = md5(tempData.password).toUpperCase();

      if (t.form.dialogStatus == "add") {
        return CreateMealOperator(tempData).then(response => {
          t.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
            duration: 2000
          });
        });
      } else {
      }
    },
    formatCurrency,
    parseTime
  }
};
</script>
<style lang="less" >
.jianyi {
  color: #a2a2a2;
}
</style>

