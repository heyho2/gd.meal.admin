<template>
  <el-dialog
    :title="'修改密码'"
    :visible.sync="dialogEditVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <el-form
      ref="dataForm"
      :rules="loginRules"
      :model="form"
      label-position="right"
      label-width="80px"
      style="width:95%;"
    >
      <!-- <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="form.oldPassword" placeholder="请输入旧密码"/>
      </el-form-item>-->
      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入新密码"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="qpassword">
        <el-input type="password" v-model="form.qpassword" placeholder="请输入确认新密码"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogEditVisible = false" icon="el-icon-close">关闭</el-button>
      <el-button type="primary" @click="handleSave" icon="iconfont icon-save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { UpdatePassword } from "@/api/MealAdmin";
import { isvalidUsername } from "@/utils/validate";
import md5 from "js-md5";
export default {
  data() {
    const validateq = (rule, value, callback) => {
      if (value != this.form.password) {
        callback(new Error("密码不相同"));
      } else {
        callback();
      }
    };
    return {
      dialogEditVisible: false,
      form: { oldPassword: null, password: null, qpassword: null },
      loginRules: {
        oldPassword: [
          { required: true, trigger: "blur", message: "旧密码必填" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码必填" },
          { max: 20, trigger: "blur", message: "密码不能大于20位" },
          { min: 6, trigger: "blur", message: "密码不能小于6位" }
        ],
        qpassword: [{ trigger: "blur", validator: validateq }]
      }
    };
  },
  components: {},
  methods: {
    showDialog() {
      this.dialogEditVisible = true;
      this.form = {};
    },
    handleSave() {
      let t = this;
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          let form = {
            password: md5(t.form.password).toUpperCase()
          };
          UpdatePassword(form).then(response => {
            t.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            });
            t.dialogEditVisible = false;
          });
        }
      });
    }
  }
};
</script>


