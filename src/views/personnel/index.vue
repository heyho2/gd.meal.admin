<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          placeholder="请输入手机号码"
          v-model="query.phone"
          style="width: 200px;"
          class="filter-item"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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

      <el-table-column label="姓名" min-width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机" min-width="180" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" align="center" width="110">
        <template slot-scope="scope">{{form.userTypes[scope.row.userType] }}</template>
      </el-table-column>
      <el-table-column label="剩余赠款" align="right" width="180">
        <template slot-scope="scope">{{formatCurrency(scope.row.grantBalance||0)}}￥</template>
      </el-table-column>
      <el-table-column label="剩余充值款" align="right" width="180">
        <template slot-scope="scope">{{formatCurrency(scope.row.rechargeBalance||0)}}￥</template>
      </el-table-column>
      <el-table-column label="总余额" align="right" width="180">
        <template
          slot-scope="scope"
        >{{formatCurrency((scope.row.rechargeBalance||0)+(scope.row.grantBalance||0))}}￥</template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="180">
        <template slot-scope="scope">{{scope.row.enable?'正常':'禁用'}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.row)" type="primary" size="mini">{{`更改身份`}}</el-button>
          <el-button
            @click="handleDisable(scope.row)"
            type="primary"
            size="mini"
          >{{scope.row.enable?`禁用`:`启用`}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="grid.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
    />
    <el-dialog
      :title="form.dialogTitle"
      :visible.sync="form.dialogVisible"
      :close-on-click-modal="false"
      width="30%"
      top="20px"
    >
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="120px"
        label-suffix="："
        style="width:99%"
      >
        <el-form-item label="用户类型">
          <el-select v-model="form.info.userType" style="width:100%" placeholder="用户类型">
            <el-option
              v-for="item in Object.keys(form.userTypes)"
              :key="item"
              :label="form.userTypes[item]"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.dialogVisible = false" icon="el-icon-close">关闭</el-button>
        <el-button type="primary" @click="handleSave" icon="iconfont icon-save">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  GetMealAccounts,
  UpdateMealAccountIdentity,
  UpdateMealAccountStatus
} from "@/api/MealAdmin";

import Pagination from "@/components/Pagination";
import { formatCurrency, parseTime } from "@/utils/index";
import { truncate } from "fs";

export default {
  components: { Pagination },
  data() {
    return {
      date: [],
      hospitalGuid: null,
      query: {
        hospitalGuid: this.$store.getters.hospitalId,
        pageIndex: 1,
        pageSize: 20,
        phone: null
      },
      grid: {
        listLoading: false,
        list: [],
        total: 0
      },
      form: {
        userTypes: {
          1: "内部人员",
          2: "外部人员"
        },
        accountTypes: {
          1: "充值账户",
          2: "赠款账户"
        },
        types: {
          consume: "消费",
          recharge: "充值",
          deduction: "扣减"
        },
        dialogVisible: false,
        dialogTitle: "更改身份",
        info: {
          userType: null,
          userGuid: null
        }
      }
    };
  },
  watch: {},
  mounted() {
    this.hospitalGuid = this.$store.getters.hospitalId;
    this.handleFilter();
  },
  methods: {
    handleFilter() {
      var t = this;
      t.grid.listLoading = true;
      GetMealAccounts(t.query).then(
        response => {
          t.grid.list = response.data.currentPage;
          t.grid.total = response.data.total;
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
    handleUpdate(row) {
      this.form.info = Object.assign(this.form.info, row);
      this.form.info.userType += "";
      this.form.dialogVisible = true;
    },
    handleSave() {
      UpdateMealAccountIdentity({
        userType: this.form.info.userType,
        userGuid: this.form.info.userGuid,
        hospitalGuid: this.hospitalGuid
      }).then(response => {
        this.$notify({
          title: "成功",
          message: "保存成功",
          type: "success",
          duration: 2000
        });
        this.handleFilter();
        this.form.dialogVisible = false;
      });
    },
    handleDisable(row) {
      UpdateMealAccountStatus({
        userType: row.userType,
        userGuid: row.userGuid,
        hospitalGuid: this.hospitalGuid
      }).then(response => {
        this.$notify({
          title: "成功",
          message: "保存成功",
          type: "success",
          duration: 2000
        });
        this.handleFilter();
      });
    },

    tableRowClassName({ row, rowIndex }) {
      if (row.enable === false) {
        return "disable-row";
      }
      return "";
    },
    formatCurrency,
    parseTime
  }
};
</script>

