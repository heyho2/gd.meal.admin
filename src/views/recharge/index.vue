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
      <el-form-item>
        <el-button class="filter-item" type @click="handleShowRecharge(3,null)">
          <svg-icon icon-class="充值" style="margin-right: 5px;"/>批量赠款充值
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type @click="handleShowRecharge(4,null)">
          <svg-icon icon-class="充值" style="margin-right: 5px;"/>批量赠款扣减
        </el-button>
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
      <el-table-column label="是否员工" align="center" width="110">
        <template slot-scope="scope">{{scope.row.userType==1?"是":"否" }}</template>
      </el-table-column>
      <el-table-column label="用户类型" align="center" width="150">
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
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button
            :disabled="!scope.row.enable"
            :title="!scope.row.enable?`禁用后禁止充值`:`充值`"
            @click="handleShowRecharge(1,scope.row)"
            type="primary"
            size="mini"
          >{{`充值`}}</el-button>
          <el-button
            :disabled="!scope.row.enable"
            :title="!scope.row.enable?`禁用后禁止充值`:`扣减`"
            @click="handleShowRecharge(2,scope.row)"
            type="primary"
            size="mini"
          >{{`扣减`}}</el-button>
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
      :title="recharge1.dialogTitle"
      :visible.sync="recharge1.dialogVisible"
      :close-on-click-modal="false"
      width="45%"
      top="20px"
    >
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="120px"
        label-suffix="："
        style="width:99%"
        :inline="true"
      >
        <el-form-item label="充值方式" style="width:100%">
          <el-radio v-model="form.info.rechargeType" :label="0">个人账户</el-radio>
          <el-radio
            v-model="form.info.rechargeType"
            :label="1"
            :disabled="form.info.userType==2"
          >赠款账户</el-radio>
        </el-form-item>
        <el-form-item label="充值对象" style="width:100%">{{form.info.phone}}</el-form-item>
        <el-form-item label="当前个人余额">￥{{formatCurrency((form.info.rechargeBalance||0))}}</el-form-item>
        <el-form-item label="赠款余额">￥{{formatCurrency(form.info.grantBalance)}}</el-form-item>
        <el-form-item label="充值金额" style="width:100%">
          <el-input-number v-model="form.info.fee" :min="0" :precision="2"></el-input-number>
        </el-form-item>
      </el-form>

      <el-row :gutter="12">
        <el-col :span="6" v-for="(item,i) in selectMs" :key="i">
          <el-card
            shadow="hover"
            style="text-align: center;font-size: 20px;cursor: pointer;"
            @click.native="handleSelectMs(recharge1,item)"
          >{{item}}元</el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recharge1.dialogVisible = false" icon="el-icon-close">关闭</el-button>
        <el-button type="primary" @click="handleSaveRecharge(1)" icon="iconfont icon-save">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="recharge2.dialogTitle"
      :visible.sync="recharge2.dialogVisible"
      :close-on-click-modal="false"
      width="45%"
      top="20px"
    >
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="120px"
        label-suffix="："
        :inline="true"
        style="width:99%"
      >
        <el-form-item label="减扣方式" style="width:100%">
          <el-radio v-model="form.info.rechargeType" :label="0">个人账户</el-radio>
          <el-radio
            v-model="form.info.rechargeType"
            :label="1"
            :disabled="form.info.userType==2"
          >赠款账户</el-radio>
        </el-form-item>
        <el-form-item label="减扣对象" style="width:100%">{{form.info.phone}}</el-form-item>
        <el-form-item label="个人账户余额">￥{{formatCurrency(form.info.rechargeBalance||0)}}</el-form-item>
        <el-form-item label="赠款余额">￥{{formatCurrency(form.info.grantBalance)}}</el-form-item>
        <el-form-item label="减扣金额" style="width:100%">
          <el-input-number
            v-model="form.info.fee"
            :min="0"
            :max="form.info.type==`Deduction`? form.info.rechargeType==0?(form.info.rechargeBalance||0):(form.info.grantBalance||0):1000000"
            :precision="2"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recharge2.dialogVisible = false" icon="el-icon-close">关闭</el-button>
        <el-button type="primary" @click="handleSaveRecharge(2)" icon="iconfont icon-save">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="recharge3.dialogTitle"
      :visible.sync="recharge3.dialogVisible"
      :close-on-click-modal="false"
      width="45%"
      top="20px"
    >
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="120px"
        label-suffix="："
        style="width:99%"
      >
        <el-form-item label="充值方式">{{recharge3.type}}</el-form-item>
        <el-form-item label="充值对象">{{form.info.phone}}</el-form-item>
        <el-form-item label="充值金额">
          <el-input-number v-model="form.info.fee" :min="0" :precision="2"></el-input-number>
        </el-form-item>

        <el-row :gutter="12">
          <el-col :span="6" v-for="(item,i) in selectMs" :key="i">
            <el-card
              shadow="hover"
              style="text-align: center;font-size: 20px;cursor: pointer;"
              @click.native="handleSelectMs(recharge3,item)"
            >{{item}}元</el-card>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recharge3.dialogVisible = false" icon="el-icon-close">关闭</el-button>
        <el-button type="primary" @click="handleSaveRecharge(3)" icon="iconfont icon-save">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="recharge4.dialogTitle"
      :visible.sync="recharge4.dialogVisible"
      :close-on-click-modal="false"
      width="45%"
      top="20px"
    >
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="120px"
        label-suffix="："
        style="width:99%"
      >
        <el-form-item label="减扣方式">{{recharge4.type}}</el-form-item>
        <el-form-item label="减扣对象">{{form.info.phone}}</el-form-item>
        <el-form-item label="减扣金额">
          <el-input-number v-model="form.info.fee" :min="0" :precision="2"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recharge4.dialogVisible = false" icon="el-icon-close">关闭</el-button>
        <el-button type="primary" @click="handleSaveRecharge(4)" icon="iconfont icon-save">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  GetMealAccounts,
  RechargeAccountRechargeOrDeduction,
  AllGrantAccountRechargeOrDeduction,
  GrantAccountRechargeOrDeduction
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
        info: {
          userGuid: null,
          rechargeBalance: 0,
          grantBalance: 0,
          phone: null,
          fee: 0,
          rechargeType: 0, //0：个人，1：赠款
          userType: 0
        }
      },
      selectMs: [50, 100, 200, 300],
      recharge1: {
        dialogVisible: false,
        dialogTitle: "充值"
      },
      recharge2: {
        dialogVisible: false,
        dialogTitle: "扣减"
      },
      recharge3: {
        dialogVisible: false,
        dialogTitle: "赠款充值",
        type: "批量赠款充值"
      },
      recharge4: {
        dialogVisible: false,
        dialogTitle: "赠款扣减",
        type: "批量赠款扣减"
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
    handleShowRecharge(type, row) {
      switch (type) {
        case 1:
          this.form.info = Object.assign(this.form.info, {
            userGuid: row.userGuid,
            rechargeBalance: row.rechargeBalance,
            grantBalance: row.grantBalance,
            phone: row.phone,
            fee: 0,
            type: "Recharge",
            rechargeType: 0, //0：个人，1：赠款
            userType: row.userType
          });
          this.recharge1.dialogVisible = true;
          break;
        case 2:
          this.form.info = Object.assign(this.form.info, {
            userGuid: row.userGuid,
            rechargeBalance: row.rechargeBalance,
            grantBalance: row.grantBalance,
            phone: row.phone,
            fee: 0,
            type: "Deduction",
            rechargeType: 0, //0：个人，1：赠款
            userType: row.userType
          });
          this.recharge2.dialogVisible = true;
          break;
        case 3:
          this.form.info = Object.assign(this.form.info, {
            userGuid: null,
            rechargeBalance: Infinity,
            grantBalance: Infinity,
            phone: "所有员工",
            fee: 0,
            type: "Recharge",
            rechargeType: 1
          });
          this.recharge3.dialogVisible = true;
          break;
        case 4:
          this.form.info = Object.assign(this.form.info, {
            userGuid: null,
            rechargeBalance: Infinity,
            grantBalance: Infinity,
            phone: "所有员工",
            fee: 0,
            type: "Deduction",
            rechargeType: 1
          });
          this.recharge4.dialogVisible = true;
          break;
      }
    },
    handleSaveRecharge(type) {
      if (this.form.info.fee <= 0) {
        this.$message({
          type: "warning",
          message: "金额必须大于0"
        });
        return;
      }
      switch (type) {
        case 1:
        case 2:
          if (this.form.info.rechargeType == 0) {
            if (
              this.form.info.type == "Deduction" &&
              this.form.info.fee > this.form.info.rechargeBalance
            ) {
              this.$message({
                type: "warning",
                message: "减扣金额不能大于个人金额"
              });
              return;
            }
            return RechargeAccountRechargeOrDeduction({
              hospitalGuid: this.hospitalGuid,
              userGuid: this.form.info.userGuid,
              type: this.form.info.type,
              fee: this.form.info.fee
            }).then(response => {
              this.$notify({
                title: "成功",
                message: `${
                  this.form.info.type == "Deduction" ? "减扣" : "充值"
                }成功`,
                type: "success",
                duration: 2000
              });
              this.handleFilter();
              this.recharge2.dialogVisible = false;
              this.recharge1.dialogVisible = false;
            });
          } else {
            if (
              this.form.info.type == "Deduction" &&
              this.form.info.fee > this.form.info.grantBalance
            ) {
              this.$message({
                type: "warning",
                message: "减扣金额不能大于赠款金额"
              });
              return;
            }
            return GrantAccountRechargeOrDeduction({
              hospitalGuid: this.hospitalGuid,
              userGuid: this.form.info.userGuid,
              type: this.form.info.type,
              fee: this.form.info.fee
            }).then(response => {
              debugger;
              this.$notify({
                title: "成功",
                message: `${
                  this.form.info.type == "Deduction" ? "减扣" : "充值"
                }成功`,
                type: "success",
                duration: 2000
              });
              this.handleFilter();
              this.recharge2.dialogVisible = false;
              this.recharge1.dialogVisible = false;
            });
          }
          break;
        case 3:
        case 4:
          return AllGrantAccountRechargeOrDeduction({
            hospitalGuid: this.hospitalGuid,
            type: this.form.info.type,
            fee: this.form.info.fee
          }).then(response => {
            debugger;
            this.$notify({
              title: "成功",
              message: `${
                this.form.info.type == "Deduction" ? "减扣" : "充值"
              }成功`,
              type: "success",
              duration: 2000
            });
            this.handleFilter();
            this.recharge3.dialogVisible = false;
            this.recharge4.dialogVisible = false;
          });
          break;
      }
    },
    handleSelectMs(recharge, m) {
      debugger;
      this.form.info.fee = m;
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

