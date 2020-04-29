<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="'图片上传'"
      style="width: 100%"
      :close-on-click-modal="false"
      top="50px"
      width="80%"
      :center="true"
      append-to-body
    >
      <div style=" position: relative;">
        <div class="cropper">
          <vue-cropper
            ref="cropper"
            :img="option.img"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :fixed-box="option.fixedBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :center-box="option.centerBox"
            @realTime="realTime"
            :high="option.high"
            :outputSize="(option.size/100)"
          ></vue-cropper>
        </div>
        <div class="tool">
          <el-row>
            <el-button-group>
              <!-- <el-button type="small" icon="el-icon-circle-plus" title="选择图片" @click="selectFile()"></el-button> -->
              <el-button type="small" icon="el-icon-refresh" title="刷新" @click="refreshCrop()">刷新</el-button>
              <el-button type="small" title="左旋转" @click="rotateLeft()">
                <svg-icon icon-class="向左旋转"/>
                <span>左旋转</span>
              </el-button>
              <el-button type="small" title="右旋转" @click="rotateRight()">
                <svg-icon icon-class="向右旋转"/>
                <span>右旋转</span>
              </el-button>
            </el-button-group>
          </el-row>

          <el-row>
            <div style="margin-top: 5px">
              <span>长：</span>
              <el-input-number
                v-model="cAutoCropWidth"
                size="small"
                :min="1"
                :max="2000"
                @change="hhhh()"
                controls-position="right"
              ></el-input-number>
            </div>
            <div style="margin-top: 5px">
              <span>宽：</span>
              <el-input-number
                v-model="cAutoCropHeight"
                size="small"
                :min="1"
                :max="2000"
                @change="hhhh()"
                controls-position="right"
              ></el-input-number>
            </div>
            <div style="margin-top: 5px;">
              <span>裁剪后质量：{{option.size}}%</span>
              <el-slider v-model="option.size" :min="0" :max="100" input-size="small"></el-slider>
            </div>
          </el-row>
          <el-row>
            <el-button-group>
              <el-button
                style="margin-top: 5px"
                type="small"
                title="裁剪后得尺寸"
                @click="finish('base64')"
              >
                <svg-icon icon-class="裁剪"/>
                <span>裁剪并上传</span>
              </el-button>
              <el-button
                style="margin-top: 5px"
                type="small"
                icon="el-icon-upload"
                title="原始尺寸"
                @click="uploadOriginal()"
              >
                <span>原图上传</span>
              </el-button>
            </el-button-group>
          </el-row>
          <el-row>
            <div class="show-preview ssss" :style="previewStyle2">
              <div :style="previews.div">
                <img :src="previews.url" :style="previews.img">
              </div>
            </div>
          </el-row>
        </div>
      </div>
    </el-dialog>
    <el-button
      :class="hidden?'button_hidden':''"
      type="small"
      icon="el-icon-upload"
      title="请选择图片"
      @click="selectFile()"
    >{{buttontext}}</el-button>
    <input
      type="file"
      :id="id"
      style="position:absolute; clip:rect(0 0 0 0);"
      accept="image/png, image/jpeg, image/gif, image/jpg"
      @change="fileChange($event)"
    >
  </div>
</template>

<script>
import VueCropper from "@/components/VueCropper/vue-cropper";
import { uploadImages } from "@/api/Upload";
export default {
  components: { VueCropper },
  name: "uploadImgDialog",
  props: {
    autoCropWidth: { type: [Number, String], default: 300 },
    autoCropHeight: { type: [Number, String], default: 300 },
    afterSuccess: { type: Function, default: () => {} },
    url: { type: String, default: null },
    value: { type: String, default: null },
    buttontext: { type: String, default: "选择图片" },
    hidden: { type: Boolean, default: false },
    size: { type: Number, default: 1024 }, //图片大小
    notCutting: { type: Boolean, default: false } //不裁剪
  },
  computed: {
    curl: {
      get() {
        return this.url;
      },
      set(val) {
        this.$emit("update:url", val);
      }
    },
    cvalue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      }
    }
  },
  watch: {
    url(val) {
      this.option.url = val;
    },
    dialogVisible(val) {
      if (!val) {
        var obj = document.getElementById(this.id);
        obj.value = "";
      }
    }
  },
  data() {
    return {
      id: null,
      dialogVisible: false,
      cAutoCropHeight: this.cAutoCropHeight,
      cAutoCropWidth: this.cAutoCropWidth,
      previews: {},
      previewStyle2: {},
      option: {
        img: this.url,
        size: 50,
        full: false,
        outputType: "jpeg",
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: this.autoCropWidth,
        autoCropHeight: this.autoCropHeight,
        centerBox: false,
        high: true,
        example2: null
      }
    };
  },
  created() {
    var t = this;
    t.id = `MMMMMM-${t.guid()}`;
  },
  methods: {
    hhhh() {
      this.option.autoCropHeight = this.cAutoCropHeight;
      this.option.autoCropWidth = this.cAutoCropWidth;
    },
    // 实时预览函数
    realTime(data) {
      var previews = data;
      let zoom = 1;
      if (previews.w > previews.h) {
        this.previewStyle2 = {
          width: previews.w + "px",
          height: previews.h + "px",
          overflow: "hidden",
          marginTop: 10 / (240 / previews.w) + "px",
          zoom: 240 / previews.w
        };
      } else {
        this.previewStyle2 = {
          width: previews.w + "px",
          height: previews.h + "px",
          overflow: "hidden",
          marginTop: 10 / (240 / previews.h) + "px",
          zoom: 240 / previews.h
        };
      }
      this.cAutoCropWidth = previews.w;
      this.cAutoCropHeight = previews.h;
      this.previews = data;
    },
    refreshCrop() {
      this.option.autoCropHeight = this.autoCropHeight;
      this.option.autoCropWidth = this.autoCropWidth;
      // clear
      this.$refs.cropper.refresh();
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    base64ToBlob(base64) {
      var arr = base64.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], { type: mime });
    },
    upload(base64) {
      var t = this;
      let conversions = t.base64ToBlob(base64);
      var formData = new FormData();
      formData.append("image", conversions, "alice.jpg");
      uploadImages(formData).then(response => {
        t.curl = response.data[0].url;
        t.cvalue = response.data[0].accessoryGuid;
        t.afterSuccess(response.data[0].url, response.data[0].accessoryGuid);
        t.$notify({
          title: "成功",
          message: "上传成功",
          type: "success",
          duration: 2000
        });
        t.dialogVisible = false;
      });
    },
    uploadOriginal() {
      var t = this;

      var fileSize = t.option.img.length - (t.option.img.length / 8) * 2;
      if (fileSize / 1024 > 2048) {
        var image = new Image();
        image.src = t.option.img;
        image.onload = function() {
          var canvas = document.createElement("canvas");
          var cxt = canvas.getContext("2d");
          canvas.width = 600;
          canvas.height = image.height * (canvas.width / image.width);

          cxt.drawImage(image, 0, 0);
          var base64 = canvas.toDataURL("image/jpg", 0.7);
          t.upload(base64);
        };
      } else {
        t.upload(t.option.img);
      }
    },
    uploadImg(data, num) {
      let t = this;
      if (num === 1) {
        this.option.img = data;
      } else if (num === 2) {
        this.example2.img = data;
      }
      t.dialogVisible = true;
    },
    notCuttingUpload(data) {
      var fileSize = data.length - (data.length / 8) * 2;
      if (fileSize / 1024 > this.size) {
        alert(`图片大小不能超过${this.size}k`);
        return;
      }
      this.upload(data);
    },
    getfile(e) {
      let t = this;
      //上传图片
      // this.option.img
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = e => {
          let data;
          if (typeof e.target.result === "object") {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]));
          } else {
            data = e.target.result;
          }

          resolve(data);
        };
        reader.readAsDataURL(file);
      });
    },
    fileChange(e, num) {
      let t = this;
      t.getfile(e).then(data => {
        if (t.notCutting) {
          t.notCuttingUpload(data);
        } else {
          t.uploadImg(data, 1);
        }
      });
    },
    finish(type) {
      // 输出
      //   var test = window.open("about:blank");
      //   test.document.body.innerHTML = "图片生成中..";
      var files = document.getElementById(this.id).files;
      if (files.length == 0) return;
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          this.upload(data);
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.upload(data);
        });
      }
    },
    selectFile() {
      document.getElementById(this.id).click();
    },
    guid(char) {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      var s4s = [
        `${S4()}${S4()}`,
        `${S4()}`,
        `${S4()}`,
        `${S4()}`,
        `${S4()}${S4()}${S4()}`
      ];
      return s4s.join(char || "");
    }
  }
};
</script>
<style scoped>
.button_hidden {
  display: none;
}
.tool {
  width: 260px;
  position: absolute;
  top: 0;
  right: 0;
  text-align: center;
}
.cropper {
  height: 600px;
  width: 100%;
  width: -webkit-calc(100% - 270px);
  width: -moz-calc(100% - 270px);
  width: calc(100% - 270px);
}
.ssss {
  display: inline-block;
  margin-top: 25px;
}
</style>
