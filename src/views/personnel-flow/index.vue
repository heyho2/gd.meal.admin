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
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          class="filter-item"
          clearable
        ></el-date-picker>
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
      <el-table-column label="手机" min-width="180" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" align="center" width="110">
        <template slot-scope="scope">{{form.userTypes[scope.row.userType] }}</template>
      </el-table-column>
      <el-table-column label="时间" width="180" align="center">
        <template slot-scope="scope">
          <span class="assss">{{parseTime(scope.row.creationDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户类型" align="center" width="180">
        <template slot-scope="scope">{{form.accountTypes[(scope.row.accountType)]}}</template>
      </el-table-column>
      <el-table-column label="变动金额" align="right" width="180">
        <template
          slot-scope="scope"
        >{{formatCurrency(scope.row.inComeType?(0-scope.row.fee):scope.row.fee)}}￥</template>
      </el-table-column>
      <el-table-column label="操作类型" align="center" width="180">
        <template slot-scope="scope">{{form.types[(scope.row.type)]}}</template>
      </el-table-column>
      <el-table-column label="账户总额" align="right" width="180">
        <template slot-scope="scope">{{formatCurrency(scope.row.totalFee)}}￥</template>
      </el-table-column>
    </el-table>
    <pagination
      :total="grid.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
    />
  </div>
</template>
<script>
import { GetMealAccountDetails } from "@/api/MealAdmin";

import Pagination from "@/components/Pagination";
import { formatCurrency, parseTime } from "@/utils/index";

export default {
  components: { Pagination },
  data() {
    return {
      date: [],
      query: {
        hospitalGuid: this.$store.getters.hospitalId,
        pageIndex: 1,
        pageSize: 20,
        phone: null,
        startTime: null,
        endTime: null
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
          deduction: "扣减",
          refund: "退款",
        }
      }
    };
  },
  watch: {
    date(val) {
      let t = this;
      if (val && val.length > 0) {
        t.query.startTime = parseTime(val[0], "{y}-{m}-{d}");
        t.query.endTime = parseTime(val[1], "{y}-{m}-{d}");
      } else {
        t.query.startTime = null;
        t.query.endTime = null;
      }
    }
  },
  mounted() {
    this.handleFilter();
  },
  methods: {
    handleFilter() {
      var t = this;
      t.grid.listLoading = true;
      GetMealAccountDetails(t.query).then(
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

