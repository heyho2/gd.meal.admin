<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          placeholder="请输入类别名称"
          v-model="query.categoryName"
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
    <div v-for="(item,i) in grid.list" :key="i" class="category">
      <div class="buttons">
        <el-button
          icon="el-icon-close"
          size="mini"
          circle
          class="close"
          @click="handleDelete(item)"
        ></el-button>
        <el-button
          icon="el-icon-edit-outline"
          size="mini"
          circle
          class="edit"
          @click="handleUpdate(item)"
        ></el-button>
      </div>

      <el-card :body-style="{ padding: '0px' }" class="card">
        <div class="content">
          <div class="title">{{item.categoryName}}</div>
          <span>{{`用餐时间：${item.mealStartTime}-${item.mealEndTime}`}}</span>
          <span>{{`预订时间：${(form.days.first(a=>a.code==item.categoryAdvanceDay)||{}).name}${item.categoryScheduleTime}前`}}</span>
        </div>
      </el-card>
    </div>

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
        label-width="130px"
        label-suffix="："
        style="width:99%"
      >
        <el-form-item label="类别名称" prop="categoryName">
          <el-input v-model="form.info.categoryName" placeholder="请输入类别名称"/>
        </el-form-item>

        <el-form-item label="限制用餐时间" prop="mealStartTime">
          <el-time-select
            placeholder="起始时间"
            v-model="form.info.mealStartTime"
            :picker-options="{start: '00:00',step: '00:15',end: '23:45'}"
          ></el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="form.info.mealEndTime"
            :picker-options="{start: '00:00',step: '00:15',end: '23:45',minTime: form.info.mealStartTime}"
          ></el-time-select>
        </el-form-item>

        <el-form-item label="可预订时间" prop="categoryScheduleTime">
          <el-select v-model="form.info.categoryAdvanceDay" placeholder="选择" style="width:100px">
            <el-option
              v-for="item in form.days"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-time-select
            placeholder="时间"
            v-model="form.info.categoryScheduleTime"
            :picker-options="{start: '00:00',step: '00:15',end: '23:45'}"
          ></el-time-select>
          <span>之前可预定</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <span
          style="color: rgb(242, 76, 76);float: left;font-size: 14px;line-height: 35px;"
        >请谨慎修改，修改将实时生效，并同步到食堂端与用户端。</span>

        <el-button @click="form.dialogVisible = false" icon="el-icon-close">关闭</el-button>
        <el-button type="primary" @click="handleSave" icon="iconfont icon-save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  GetMealCategories,
  CreateCategory,
  UpdateCategory,
  DeleteCategory
} from "@/api/MealAdmin";

import "@/utils/linq";
export default {
  components: {},
  data() {
    return {
      hospitalGuid: null,
      date: null,
      query: {
        hospitalGuid: null,
        categoryName: null,
        pageIndex: 1,
        pageSize: 10
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
        days: [
          { code: 0, name: "当天" },
          { code: 1, name: "前1天" },
          { code: 2, name: "前2天" },
          { code: 30, name: "前30天" }
        ],
        info: {
          categoryGuid: null,
          hospitalGuid: null,
          categoryName: null,
          mealStartTime: null,
          mealEndTime: null,
          categoryAdvanceDay: 0,
          categoryScheduleTime: null
        },
        //表单验证
        rules: {
          categoryName: [
            { required: true, message: "必填", trigger: "change" },
            { max: 8, message: "长度不能超过8", trigger: "change" }
          ],
          mealStartTime: [
            {
              required: true,
              message: "必填",
              trigger: "change",
              validator: (rule, value, callback) => {
                if (
                  !this.form.info.mealStartTime ||
                  !this.form.info.mealEndTime
                ) {
                  callback(new Error("必填"));
                } else {
                  callback();
                }
              }
            }
          ],
          categoryScheduleTime: [
            { required: true, message: "必填", trigger: "change" }
          ]
        }
      }
    };
  },
  watch: {
    date(val) {
      let t = this;
      if (val && val.length > 0) {
        t.query.mealStartTime = parseTime(val[0], "{y}-{m}-{d}");
        t.query.mealEndTime = parseTime(val[1], "{y}-{m}-{d}");
      } else {
        t.query.mealStartTime = null;
        t.query.mealEndTime = null;
      }
    }
  },
  mounted() {
    this.hospitalGuid = this.$store.getters.hospitalId;
    this.query.hospitalGuid = this.hospitalGuid;
    this.handleFilter();
  },
  methods: {
    handleFilter() {
      var t = this;
      GetMealCategories(t.query).then(response => {
        t.grid.list = response.data;
      });
    },
    handleSearch() {
      this.query.pageIndex = 1;
      this.handleFilter();
    },
    handleAdd() {
      let t = this;
      t.form.info = {
        hospitalGuid: this.hospitalGuid,
        categoryGuid: null,
        categoryName: null,
        mealStartTime: null,
        mealEndTime: null,
        categoryAdvanceDay: 0,
        categoryScheduleTime: null
      };
      t.form.dialogVisible = true;
      t.form.dialogStatus = "add";
      t.form.dialogTitle = "添加分类";
      t.$nextTick(() => {
        t.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      let t = this;
      t.form.info = Object.assign(
        {
          hospitalGuid: this.hospitalGuid,
          categoryGuid: null,
          categoryName: null,
          mealStartTime: null,
          mealEndTime: null,
          categoryAdvanceDay: 0,
          categoryScheduleTime: null
        },
        row
      );
      t.form.dialogVisible = true;
      t.form.dialogStatus = "update";
      t.form.dialogTitle = "修改分类";
      t.$nextTick(() => {
        t.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      var t = this;
      t.$confirm("此操作将永久删除该数据, 是否继续?", "确认删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          DeleteCategory(this.hospitalGuid, row.categoryGuid).then(response => {
            t.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            t.handleFilter();
          });
        })
        .catch(() => {
          t.$message({
            type: "info",
            message: "已取消删除"
          });
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
        return CreateCategory(tempData).then(response => {
          t.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
            duration: 2000
          });
        });
      } else {
        return UpdateCategory(tempData).then(response => {
          t.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          });
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.category {
  position: relative;
  display: inline-block;
  margin-right: 20px;

  .buttons {
    position: absolute;
    right: 0px;
    top: 0px;
    .close {
      float: right;
      margin-left: 10px;
    }
    .edit {
      float: right;
    }
  }
  .card {
    display: inline-block;
    margin-right: 12px;
    margin-top: 12px;

    .content {
      width: 300px;
      height: 140px;
      display: block;
      .title {
        text-align: center;
        font-size: 35px;
        margin-top: 40px;
      }
      span {
        display: block;
        text-align: center;
        margin-top: 10px;
      }
    }
  }
}
</style>


