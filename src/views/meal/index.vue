<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          placeholder="请输入关键字"
          v-model="query.dishesName"
          style="width: 200px;"
          class="filter-item"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type icon="el-icon-plus" @click="handleAdd">添加</el-button>
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
      <el-table-column label="图片" width="180" align="center">
        <template slot-scope="scope">
          <GdImg
            :src="scope.row.dishesImgPath"
            :title="scope.row.dishesName"
            preview="1"
            :imgWidth="`100%`"
          />
        </template>
      </el-table-column>
      <el-table-column label="菜品名称" align="center" min-width="180">
        <template slot-scope="scope">{{ scope.row.dishesName }}</template>
      </el-table-column>
      <el-table-column label="内部价" width="180" align="right">
        <template slot-scope="scope">
          <span class="assss">{{formatCurrency(scope.row.dishesInternalPrice) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="外部价" align="right" width="180">
        <template slot-scope="scope">{{formatCurrency(scope.row.dishesExternalPrice)}}</template>
      </el-table-column>
      <el-table-column label="上架?" align="center" width="100">
        <template slot-scope="scope">
          <el-switch :value="scope.row.dishesOnsale==1" @change="handleStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.row)" type size="mini">编辑</el-button>
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
        <el-form-item label="菜品主图" prop="dishesImg">
          <upload-img2
            :dialogVisible="true"
            :value.sync="form.info.dishesImg"
            :url.sync="form.info.dishesImgPath"
            :imgHeight="`150px`"
            :notCutting="true"
            :size="500"
          />
          <span class="jianyi">{{`建议尺寸：800*800像素`}}</span>
        </el-form-item>
        <el-form-item label="菜品名称" prop="dishesName">
          <el-input v-model="form.info.dishesName" placeholder="请输入菜品名称，15字以内" />
        </el-form-item>

        <el-form-item label="内部价" prop="dishesInternalPrice">
          <el-input-number
            v-model="form.info.dishesInternalPrice"
            :min="0"
            :max="10000"
            :precision="2"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="外部价" prop="dishesExternalPrice">
          <el-input-number
            v-model="form.info.dishesExternalPrice"
            :min="0"
            :max="10000"
            :precision="2"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="菜品说明" prop="dishesDescription">
          <el-input
            type="textarea"
            v-model="form.info.dishesDescription"
            placeholder="相当于菜品副标题，可以说明菜品材料，套餐内容等"
            :autosize="{ minRows: 2, maxRows: 6 }"
          ></el-input>
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
  GetMealDishes,
  CreateMealDishes,
  UpdateMealDishes,
  UpdateMealDishesStatus
} from "@/api/MealAdmin";

import Pagination from "@/components/Pagination";
import GdImg from "@/components/GdImg";
import UploadImg2 from "@/components/UploadImg2/Index";
import { formatCurrency } from "@/utils/index";

export default {
  components: { Pagination, UploadImg2, GdImg },
  data() {
    return {
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
          dishesGuid: null,
          dishesImg: null,
          dishesImgPath: null,
          dishesName: null,
          dishesInternalPrice: 0,
          dishesExternalPrice: 0,
          dishesDescription: null,
          dishesOnsale: 0
        },
        //表单验证
        rules: {
          dishesImg: [{ required: true, message: "必填", trigger: "change" }],
          dishesName: [
            { required: true, message: "必填", trigger: "change" },
            { max: 15, message: "长度不能超过15", trigger: "change" }
          ],
          dishesInternalPrice: [
            { required: true, message: "必填", trigger: "change" }
          ],
          dishesExternalPrice: [
            { required: true, message: "必填", trigger: "change" }
          ],
          dishesDescription: [
            { max: 100, message: "长度不能超过100", trigger: "change" }
          ]
        }
      }
    };
  },
  mounted() {
    this.handleFilter();
  },
  methods: {
    handleFilter() {
      var t = this;
      t.grid.listLoading = true;
      GetMealDishes(t.query).then(
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
    handleAdd() {
      let t = this;
      t.form.info = {
        hospitalGuid: this.$store.getters.hospitalId,
        dishesGuid: null,
        dishesImg: null,
        dishesImgPath: null,
        dishesName: null,
        dishesInternalPrice: 0,
        dishesExternalPrice: 0,
        dishesDescription: null
      };
      t.form.dialogVisible = true;
      t.form.dialogStatus = "add";
      t.form.dialogTitle = "添加菜品";
      t.$nextTick(() => {
        t.$refs["dataForm"].clearValidate();
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.enable === false || row.dishesOnsale == 0) {
        return "disable-row";
      }
      return "";
    },
    handleUpdate(row) {
      let t = this;
      t.form.info = Object.assign(
        {
          hospitalGuid: this.$store.getters.hospitalId,
          dishesGuid: null,
          dishesImg: null,
          dishesName: null,
          dishesInternalPrice: 0,
          dishesExternalPrice: 0,
          dishesDescription: null
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
      if (t.form.dialogStatus == "add") {
        return CreateMealDishes(tempData).then(response => {
          t.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
            duration: 2000
          });
        });
      } else {
        return UpdateMealDishes(tempData).then(response => {
          t.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          });
        });
      }
    },
    handleStatus(row) {
      UpdateMealDishesStatus(
        this.$store.getters.hospitalId,
        row.dishesGuid
      ).then(response => {
        this.$notify({
          title: "成功",
          message: "修改成功",
          type: "success",
          duration: 2000
        });
        this.handleFilter();
      });
    },
    formatCurrency
  }
};
</script>
<style lang="less" >
.jianyi {
  color: #a2a2a2;
}
</style>







